#!/usr/bin/env node
// Pre-/post-deploy check of "MOS/AOC + rank alone produces a translation from the official publication".
//   node scripts/reference-spot-check.mjs --plan plan.json --out results.json [--base https://www.tyfms.com | --deployment <vercel url>] [--pdf-dir <Classification-611-21 folder>] [--personal]
//
// plan.json: { codes: [{ category, code, ranks: ['E-4', ...], personal: 'optional bullet text' }] }
// For every (code, rank) it calls the REAL translator with the personal-duties field EMPTY and checks:
//   * HTTP 200 and at least one entry,
//   * every entry is basis "publication" with a quote and a source page,
//   * each quote is found in the official PDF text on the cited page (when --pdf-dir is given), re-read independently.
// With --personal it repeats once per code with the plan's optional bullet and checks that a "personal" entry appears.
// Uses paid model calls; paced under the public rate limits.
import { readFile, writeFile } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { parseArgs } from 'node:util'
import path from 'node:path'
const run = promisify(execFile)
const { values } = parseArgs({ options: { plan: { type: 'string' }, out: { type: 'string' }, base: { type: 'string' }, deployment: { type: 'string' }, 'pdf-dir': { type: 'string' }, 'pdf-root': { type: 'string', multiple: true }, personal: { type: 'boolean', default: false } } })
const plan = JSON.parse(await readFile(values.plan, 'utf8'))
const sleep = ms => new Promise(r => setTimeout(r, ms))
const sent = []
async function pace() { for (;;) { const now = Date.now(); while (sent.length && now - sent[0] > 605_000) sent.shift(); if (sent.length < 12) { sent.push(now); return } await sleep(605_000 - (now - sent[0]) + 500) } }

async function post(route, body) {
  await pace()
  const t0 = Date.now()
  let text
  if (values.deployment) {
    const r = await run('vercel', ['curl', route, '--deployment', values.deployment, '--', '-s', '-w', '\n%{http_code}', '-X', 'POST', '-H', 'Content-Type: application/json', '-d', JSON.stringify(body)], { maxBuffer: 20e6 })
    text = r.stdout
  } else {
    const r = await run('curl', ['-s', '-w', '\n%{http_code}', '-X', 'POST', '-H', 'Content-Type: application/json', '-d', JSON.stringify(body), values.base + route], { maxBuffer: 20e6 })
    text = r.stdout
  }
  const i = text.lastIndexOf('\n'); const http = Number(text.slice(i + 1)); let json = null; try { json = JSON.parse(text.slice(0, i)) } catch {}
  return { http, json, ms: Date.now() - t0, raw: json ? null : text.slice(0, 300) }
}

// Independent text of the official pages
const FILES = { enlisted: 'chapter-10c-enlisted-mos-specifications.pdf', warrant: 'chapter-8b-wo-specifications.pdf', officer: 'chapter-3-officer-branches-and-fas.pdf' }
const pdfPages = {}
async function pagesOf(category) {
  if (!values['pdf-dir']) return null
  if (!pdfPages[category]) {
    const { PDFParse } = await import('pdf-parse')
    const parser = new PDFParse({ data: new Uint8Array(await readFile(path.join(values['pdf-dir'], FILES[category]))) })
    pdfPages[category] = Object.fromEntries((await parser.getText()).pages.map(p => [p.num, p.text.toLowerCase().replace(/[^a-z0-9]+/g, '')]))
  }
  return pdfPages[category]
}
// Entries drawn from a career guide cite that guide's PDF: found by the file name in the source URL under any --pdf-root folder.
const byName = new Map()
async function indexRoots() {
  const { readdir } = await import('node:fs/promises')
  async function walk(dir) { for (const d of await readdir(dir, { withFileTypes: true })) { const f = path.join(dir, d.name); if (d.isDirectory()) await walk(f); else if (d.name.endsWith('.pdf')) byName.set(d.name, f) } }
  for (const r of values['pdf-root'] || []) await walk(r)
}
await indexRoots()
const guidePages = {}
async function pagesOfUrl(url) {
  const name = decodeURIComponent(String(url || '').split('/').pop())
  const file = byName.get(name)
  if (!file) return null
  if (!guidePages[name]) {
    const { PDFParse } = await import('pdf-parse')
    const parser = new PDFParse({ data: new Uint8Array(await readFile(file)) })
    guidePages[name] = Object.fromEntries((await parser.getText()).pages.map(p => [p.num, p.text.toLowerCase().replace(/[^a-z0-9]+/g, '')]))
  }
  return guidePages[name]
}
const squash = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '')

const results = { ran_at: new Date().toISOString(), target: values.deployment || values.base, rows: [] }
for (const c of plan.codes) {
  const pages = values['pdf-dir'] ? await pagesOf(c.category) : null
  const letter = { enlisted: 'Army', warrant: 'Army', officer: 'Army' }[c.category]
  const calls = c.ranks.map(rank => ({ rank, personal: '' }))
  if (values.personal && c.personal) calls.push({ rank: c.ranks[Math.floor(c.ranks.length / 2)], personal: c.personal })
  for (const call of calls) {
    const r = await post('/api/translate', { action: 'translate', branch: letter, mos: c.code, rank: call.rank, yos: '', milDuties: call.personal })
    const entries = r.json?.civilianTranslation || []
    const row = { category: c.category, code: c.code, rank: call.rank, personalTextGiven: !!call.personal, http: r.http, ms: r.ms, referenceStatus: r.json?.referenceStatus, entries: entries.length, error: r.json?.error || r.raw || null, translationBasis: r.json?.translationBasis, checks: {} }
    // A code whose publication text is only a cross-reference must ASK for details (HTTP 422, no model call), not make something up.
    row.checks.ok = c.expectNeedsDetails && !call.personal ? r.http === 422 && r.json?.status === 'needs_experience' : r.http === 200 && entries.length > 0
    if (c.expectNeedsDetails && !call.personal) { /* nothing to check beyond the 422 */ } else if (!call.personal) row.checks.allPublication = entries.every(e => e.basis === 'publication' && e.source?.publication && e.evidence)
    else row.checks.hasPersonalEntry = entries.some(e => e.basis === 'personal')
    if (pages || byName.size) {
      const missing = []
      for (const e of entries.filter(e => e.basis === 'publication')) {
        const own = e.source.url ? await pagesOfUrl(e.source.url) : null
        const src = own || pages
        if (!src) { missing.push(e); continue }
        const span = String(e.source.pdfPages || '').split('-').map(Number); const lo = span[0], hi = span[1] || span[0]
        let hay = ''; for (let n = lo; n <= hi; n++) hay += src[n] || ''
        if (!hay.includes(squash(e.evidence))) missing.push(e)
      }
      row.checks.quotesFoundInPdfAtCitedPages = missing.length === 0
      row.quotesNotFound = missing.map(e => e.evidence)
    }
    row.sample = entries.slice(0, 6).map(e => ({ basis: e.basis, evidence: e.evidence, pages: e.source?.pdfPages || null, grade: e.source?.grade || null, from: e.from || null, militarySkill: e.militarySkill }))
    results.rows.push(row)
    console.log(c.code, call.rank, call.personal ? '(+bullet)' : '(empty)', r.http, entries.length, JSON.stringify(row.checks))
  }
}
await writeFile(values.out, JSON.stringify(results, null, 1) + '\n')
const bad = results.rows.filter(r => Object.values(r.checks).some(v => v === false))
console.log(bad.length ? `FAILED rows: ${bad.length}` : 'all checks passed', 'rows:', results.rows.length)
