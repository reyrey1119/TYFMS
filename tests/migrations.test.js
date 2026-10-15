// Runs the REAL migrations, the REAL generated import SQL and the REAL retrieval
// code in a real Postgres engine (PGlite). This is a local stand-in for a staging
// database: it proves the SQL is valid, idempotent, enforces its constraints and
// row-level-security, and that the app reads the imported data correctly.
//
// It is NOT a run against Supabase itself (no credentials were available).

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { newDb, supabaseOn } from './helpers/pgliteSupabase.js'
import { retrieveReference, clearReferenceCache } from '../api/_lib/milReference.js'
import { approveSql, importSql } from '../scripts/lib/bundleSql.js'
import { loadBundles } from './helpers/bundleDb.js'

const MIG = new URL('../supabase/migrations/', import.meta.url).pathname
const SQL = new URL('../data/reference/sql/', import.meta.url).pathname
const migrationFiles = (await readdir(MIG)).filter(f => /^00[456]_/.test(f)).sort()
const importFiles = (await readdir(SQL)).filter(f => f.endsWith('.import.sql')).sort()
const NOW = Date.parse('2026-10-16T00:00:00Z')

async function migrated() {
  const db = await newDb()
  for (const f of migrationFiles) await db.exec(await readFile(MIG + f, 'utf8'))
  return db
}
const count = async (db, t, where = '') => Number((await db.query(`select count(*)::int c from public.${t} ${where}`)).rows[0].c)

test('migrations 004 and 005 apply cleanly, and re-applying them changes nothing (idempotent)', async () => {
  const db = await migrated()
  for (const f of migrationFiles) await db.exec(await readFile(MIG + f, 'utf8'))   // second run
  for (const f of migrationFiles) await db.exec(await readFile(MIG + f, 'utf8'))   // third run
  const cols = (await db.query(`select column_name from information_schema.columns where table_name='reference_passages'`)).rows.map(r => r.column_name)
  for (const c of ['components', 'chapter', 'body_sha256', 'printed_page', 'rank_band']) assert.ok(cols.includes(c), `missing column ${c}`)
})

test('004 then 005 on an empty database (the supported order)', async () => {
  const db = await newDb()
  await db.exec(await readFile(MIG + migrationFiles[0], 'utf8'))
  await db.exec(await readFile(MIG + migrationFiles[1], 'utf8'))
  assert.equal(await count(db, 'reference_sources'), 0)
})

test('constraints reject bad data', async () => {
  const db = await migrated()
  const src = `insert into reference_sources (branch, personnel_category, title, official_url) values ('Army','enlisted','t'`
  await assert.rejects(db.exec(`${src}, 'http://insecure.example/x.pdf')`), /check/i, 'official_url must be https')
  await assert.rejects(db.exec(`${src.replace("'enlisted'", "'civilian'")}, 'https://x.example/x.pdf')`), /check/i, 'category must be a known value')
  await db.exec(`${src}, 'https://x.example/x.pdf')`)
  const id = (await db.query('select id from reference_sources limit 1')).rows[0].id
  const pass = (type, comps) => `insert into reference_passages (source_id, branch, personnel_category, occupation_code, section_type, components, body) values ('${id}','Army','enlisted','42A','${type}',${comps},'x')`
  await assert.rejects(db.exec(pass('made_up_type', 'null')), /check/i, 'section_type must be a known value')
  await assert.rejects(db.exec(pass('training', `'space'`)), /check/i, 'components must be active/reserve/guard')
  await db.exec(pass('promotion_criteria', 'null'))
  await db.exec(pass('training', `'reserve,guard'`))
  assert.equal(await count(db, 'reference_passages'), 2)
})

test('real import SQL loads, and re-importing replaces rather than duplicates', async () => {
  assert.ok(importFiles.length >= 3, 'import SQL files exist')
  const db = await migrated()
  for (const f of importFiles) await db.exec(await readFile(SQL + f, 'utf8'))
  const bundles = await loadBundles()
  const expected = bundles.reduce((a, b) => a + b.passages.length, 0)
  assert.equal(await count(db, 'reference_passages'), expected)
  assert.equal(await count(db, 'reference_sources'), bundles.length)
  for (const f of importFiles) await db.exec(await readFile(SQL + f, 'utf8'))   // run again
  assert.equal(await count(db, 'reference_passages'), expected, 're-import must not duplicate')
  assert.equal(await count(db, 'reference_sources', `where review_status = 'unreviewed'`), bundles.length, 'imports are never auto-approved')
})

test('row-level security: nothing is visible to the public role until a source is approved', async () => {
  const db = await migrated()
  for (const f of importFiles) await db.exec(await readFile(SQL + f, 'utf8'))
  const sb = supabaseOn(db, 'anon')
  const before = await sb.from('reference_passages').select('source_id').eq('occupation_code', '42A')
  assert.deepEqual(before.data, [], 'unreviewed passages are invisible to the public role')
  const srcBefore = await sb.from('reference_sources').select('id')
  assert.deepEqual(srcBefore.data, [])

  const bundles = await loadBundles(['army-cmf42'])
  await db.exec(approveSql(bundles[0], 'Reviewer (test)'))
  const after = await sb.from('reference_passages').select('source_id').eq('occupation_code', '42A')
  assert.ok(after.data.length > 0, 'approved passages become visible')
  const other = await sb.from('reference_passages').select('source_id').eq('occupation_code', '36B')
  assert.deepEqual(other.data, [], 'sources that are still unreviewed stay invisible')
})

test('the public role cannot write to the registry', async () => {
  const db = await migrated()
  await db.exec('set role anon')
  await assert.rejects(db.exec(`insert into reference_sources (branch, personnel_category, title, official_url) values ('Army','enlisted','t','https://x.example/a.pdf')`), /permission denied|row-level security/i)
  await db.exec('reset role')
})

test('END TO END in Postgres: imported + approved real data → real retrieval → correct E-6 answer', async () => {
  const db = await migrated()
  for (const f of importFiles) await db.exec(await readFile(SQL + f, 'utf8'))
  for (const b of await loadBundles()) await db.exec(approveSql(b, 'Reviewer (test)'))
  clearReferenceCache()
  const sb = supabaseOn(db, 'anon')
  const r = await retrieveReference({ supabase: sb, now: NOW, body: { branch: 'Army', mos_afsc: '42A', rank: 'E-6' } })
  assert.equal(r.status, 'verified')
  assert.match(r.training_recommendations, /Advanced Leader Course; Promotion to SFC requires ALC graduation/)
  assert.ok(!/Basic Leader Course/.test(r.training_recommendations))
  assert.equal(r.sources[0].publicationDate, '2025-09-30')
  assert.ok(r.sections.every(s => s.sourceId === r.sources[0].id && /^\d+(-\d+)?$/.test(s.pdfPages)))
  const g = await retrieveReference({ supabase: sb, now: NOW, body: { branch: 'Army', mos_afsc: '36A', rank: 'O-3', component: 'guard' } })
  assert.match(g.sections.map(s => s.text).join(' '), /ARNG/)
  assert.equal(g.sources[0].publicationDate, '2025-09-10')
})


test('changed reimport revokes approval, hides passages, and rejects an old approval script', async () => {
  const db = await migrated()
  const [original] = await loadBundles(['army-cmf42'])
  await db.exec(importSql(original))
  await db.exec(approveSql(original, 'First reviewer'))
  const sb = supabaseOn(db, 'anon')
  const visible = async () => (await sb.from('reference_passages').select('source_id')).data.length
  assert.ok(await visible() > 0)
  const changed = structuredClone(original)
  changed.passages[0].body += ' Changed extraction for regression test.'
  await db.exec(importSql(changed))
  assert.equal(await visible(), 0, 'new extraction cannot inherit old approval')
  const row = (await db.query('select review_status, reviewed_by, reviewed_at from reference_sources')).rows[0]
  assert.deepEqual(row, { review_status: 'unreviewed', reviewed_by: null, reviewed_at: null })
  await db.exec(approveSql(original, 'Outdated approval'))
  assert.equal(await visible(), 0, 'approval generated for an older extraction must do nothing')
  await db.exec(approveSql(changed, 'New reviewer'))
  assert.ok(await visible() > 0)
  await db.close()
})

test('same-PDF mapping correction invalidates cached rank passages after reapproval', async () => {
  const db = await migrated()
  const [original] = await loadBundles(['army-cmf42'])
  await db.exec(importSql(original))
  await db.exec(approveSql(original, 'First reviewer'))
  const sb = supabaseOn(db, 'anon')
  const body = { branch: 'Army', mos_afsc: '42A', rank: 'E-6' }
  clearReferenceCache()
  const before = await retrieveReference({ supabase: sb, now: NOW, body })
  const target = original.passages.find(p => before.sections.some(s => s.text === p.body))
  assert.ok(target)
  const changed = structuredClone(original)
  const newText = 'Corrected extraction used only in the database regression test.'
  changed.passages.find(p => p.id === target.id).body = newText
  await db.exec(importSql(changed))
  await db.exec(approveSql(changed, 'Second reviewer'))
  // No cache clear: same source UUID and PDF checksum, different extraction.
  const after = await retrieveReference({ supabase: sb, now: NOW + 1000, body })
  assert.ok(after.sections.some(s => s.text === newText), 'old cache must not survive a changed extraction')
  await db.close()
})
