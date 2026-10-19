// Document Vault: the migration that adds the missing columns, and the upload/delete operations' failure handling.
// A fake storage/database client stands in for Supabase; the migration runs in a real Postgres (PGlite).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { newDb } from './helpers/pgliteSupabase.js'
import { uploadVaultDocument, deleteVaultDocument } from '../src/lib/vaultOps.js'

// ── migration ──────────────────────────────────────────────────────────────
test('migration 008 adds the two columns, is repeatable, keeps existing rows and the access policy', async () => {
  const db = await newDb()
  await db.exec(`
    create table public.vault_documents (id uuid default gen_random_uuid() primary key, user_id uuid not null, document_type text not null,
      filename text not null, storage_path text not null);
    alter table public.vault_documents enable row level security;
    create policy "Users manage own vault docs" on public.vault_documents for all using (true) with check (true);
    insert into public.vault_documents (user_id, document_type, filename, storage_path)
      values ('00000000-0000-0000-0000-000000000001', 'other', 'old.pdf', 'u/other/1-old.pdf');`)
  const sql = await readFile(new URL('../supabase/migrations/008_vault_documents_columns.sql', import.meta.url), 'utf8')
  await db.exec(sql); await db.exec(sql)
  const cols = (await db.query(`select column_name from information_schema.columns where table_name='vault_documents'`)).rows.map(r => r.column_name)
  for (const c of ['file_size', 'content_type', 'extracted_text', 'extraction_summary', 'uploaded_at']) assert.ok(cols.includes(c), c)
  const rows = (await db.query(`select filename, extracted_text, content_type, file_size from public.vault_documents`)).rows
  assert.deepEqual(rows, [{ filename: 'old.pdf', extracted_text: null, content_type: null, file_size: null }])
  assert.equal((await db.query(`select count(*)::int c from pg_policies where tablename='vault_documents'`)).rows[0].c, 1)
  assert.equal((await db.query(`select relrowsecurity from pg_class where relname='vault_documents'`)).rows[0].relrowsecurity, true)
  await db.exec(`insert into public.vault_documents (user_id, document_type, filename, storage_path, file_size, content_type, extraction_summary)
                 values ('00000000-0000-0000-0000-000000000001','other','new.pdf','u/other/2-new.pdf',34503,'application/pdf','{"a":1}')`)
})

// ── fake client ────────────────────────────────────────────────────────────
function fake(opts = {}) {
  const files = new Set(opts.files || []); const rows = new Map((opts.rows || []).map(r => [r.id, r])); const log = []
  const st = {
    upload: async (path) => { log.push('upload'); if (opts.uploadError) return { error: { message: opts.uploadError } }; files.add(path); return { error: null } },
    remove: async ([path]) => { log.push('remove'); if (opts.removeError) return { error: { message: opts.removeError } }; if (!opts.removeSilentlyFails) files.delete(path); return { data: [], error: null } },
    list: async (dir, { search }) => { log.push('list'); if (opts.listError) return { data: null, error: { message: 'list denied' } }; return { data: [...files].filter(f => f.startsWith(dir + '/') && f.slice(dir.length + 1).includes(search)).map(f => ({ name: f.slice(dir.length + 1) })), error: null } },
  }
  return {
    log, files, rows,
    storage: { from: () => st },
    from: () => {
      const q = { _op: null, _eq: null, _doc: null }
      q.insert = d => { q._op = 'insert'; q._doc = d; return q }
      q.select = () => { if (!q._op) q._op = 'select'; return q }
      q.single = () => q
      q.delete = () => { q._op = 'delete'; return q }
      q.eq = (c, v) => { q._eq = v; return q }
      q.then = (res, rej) => (async () => {
        if (q._op === 'insert') { if (opts.insertError) return { data: null, error: { message: opts.insertError } }; const r = { id: 'row1', ...q._doc }; rows.set('row1', r); return { data: r, error: null } }
        if (q._op === 'delete') { if (opts.deleteRowError) return { error: { message: opts.deleteRowError } }; if (!opts.deleteRowSilentlyFails) rows.delete(q._eq); return { error: null } }
        return { data: [...rows.values()].filter(r => r.id === q._eq), error: null }
      })().then(res, rej)
      return q
    },
  }
}
const file = { name: 'SYNTHETIC TEST.pdf', type: 'application/pdf', size: 10 }
const args = c => ({ supabase: c, bucket: 'document-vault', userId: 'u1', catId: 'other', file, now: () => 111 })

test('upload: success returns the record and keeps the file', async () => {
  const c = fake(); const r = await uploadVaultDocument(args(c))
  assert.equal(r.doc.storage_path, 'u1/other/111-SYNTHETIC_TEST.pdf'); assert.ok(c.files.has(r.doc.storage_path))
})

test('upload: a storage failure is reported and nothing is inserted', async () => {
  const c = fake({ uploadError: 'bucket not found' }); const r = await uploadVaultDocument(args(c))
  assert.match(r.error, /Upload failed: bucket not found/); assert.equal(c.rows.size, 0)
})

test('upload: when the database insert fails the uploaded file is removed and the person is told', async () => {
  const c = fake({ insertError: "Could not find the 'content_type' column" }); const r = await uploadVaultDocument(args(c))
  assert.ok(r.error && !r.doc); assert.equal(c.files.size, 0, 'the new file is removed')
  assert.match(r.error, /not saved/); assert.match(r.error, /content_type/); assert.match(r.error, /file was removed/)
})

test('upload: a failed cleanup is reported, not hidden', async () => {
  const c = fake({ insertError: 'boom', removeError: 'permission denied' }); const r = await uploadVaultDocument(args(c))
  assert.match(r.error, /could not be removed \(permission denied\)/); assert.equal(c.files.size, 1)
  const d = fake({ insertError: 'boom', removeSilentlyFails: true }); const r2 = await uploadVaultDocument(args(d))
  assert.match(r2.error, /could not be removed \(the file is still in storage\)/)
  const e = fake({ insertError: 'boom', listError: true }); const r3 = await uploadVaultDocument(args(e))
  assert.match(r3.error, /could not be removed/, 'removal that cannot be confirmed is not claimed')
})

const doc = { id: 'row1', storage_path: 'u1/other/111-a.pdf' }
test('delete: removes the file and the record, and says so only after checking both', async () => {
  const c = fake({ files: [doc.storage_path], rows: [doc] }); const r = await deleteVaultDocument({ supabase: c, bucket: 'b', doc })
  assert.deepEqual(r, { ok: true }); assert.equal(c.files.size, 0); assert.equal(c.rows.size, 0)
})

test('delete: a failed file removal leaves the record and reports the failure', async () => {
  const c = fake({ files: [doc.storage_path], rows: [doc], removeError: 'denied' }); const r = await deleteVaultDocument({ supabase: c, bucket: 'b', doc })
  assert.match(r.error, /Not deleted/); assert.equal(c.rows.size, 1)
  const d = fake({ files: [doc.storage_path], rows: [doc], removeSilentlyFails: true }); const r2 = await deleteVaultDocument({ supabase: d, bucket: 'b', doc })
  assert.match(r2.error, /still in storage/); assert.equal(d.rows.size, 1, 'silent no-op removal is not success')
})

test('delete: a failed or silently ignored record delete is reported as partial, never as success', async () => {
  const c = fake({ files: [doc.storage_path], rows: [doc], deleteRowError: 'rls' }); const r = await deleteVaultDocument({ supabase: c, bucket: 'b', doc })
  assert.match(r.error, /Only partly deleted/); assert.ok(!r.ok)
  const d = fake({ files: [doc.storage_path], rows: [doc], deleteRowSilentlyFails: true }); const r2 = await deleteVaultDocument({ supabase: d, bucket: 'b', doc })
  assert.match(r2.error, /record is still there/); assert.ok(!r2.ok)
})

test('delete: retry after a partial delete succeeds when the file is already gone', async () => {
  const c = fake({ files: [], rows: [doc] }); const r = await deleteVaultDocument({ supabase: c, bucket: 'b', doc })
  assert.deepEqual(r, { ok: true })
})
