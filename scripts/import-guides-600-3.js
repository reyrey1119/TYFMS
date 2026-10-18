#!/usr/bin/env node
/**
 * Imports the grade-by-grade development sections of DA PAM 600-3 officer branch / functional-area pamphlets.
 *
 *   node scripts/import-guides-600-3.js --corpus <folder holding Officer-600-3/> --out <dir> [--only <text>]
 *
 * Per-pamphlet decisions live in data/reference/guide-manifests-600-3/<pdf name>.json:
 *   { "codes": ["14A"], "run": 0, "title": ..., "proponent": ..., "publicationDate": ..., "dateBasis": ..., "endAfterLast": "<regex>" }
 *   or { "skip": "reason" } for a pamphlet that is not imported. A pamphlet with no manifest is listed as "not decided".
 * Admin-time only; bundles are written UNREVIEWED.
 */
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import os from 'node:os'
import path from 'node:path'
import { parseArgs } from 'node:util'
import { extractPages, toLines, findRunningLines } from './lib/pdfLines.js'
import { findRuns, gradeItems, BAND_ORDER, joinLines } from './lib/officerGuide.js'
import { ENUM } from './lib/guideAuto.js'
import { stableUuid, importSql } from './lib/bundleSql.js'

const { values } = parseArgs({ options: { corpus: { type: 'string' }, only: { type: 'string' }, out: { type: 'string', default: 'data/reference' }, today: { type: 'string', default: new Date().toISOString().slice(0, 10) } } })
if (!values.corpus) { console.error('Usage: node scripts/import-guides-600-3.js --corpus <folder>'); process.exit(2) }
const audit = JSON.parse(await readFile('data/reference/corpus/source-audit.json', 'utf8'))
const cache = path.join(os.tmpdir(), 'tyfms-corpus-text'); await mkdir(cache, { recursive: true })
const pdfParseVersion = JSON.parse(await readFile(new URL('../node_modules/pdf-parse/package.json', import.meta.url), 'utf8')).version
const inv = JSON.parse(await readFile('data/reference/corpus/army-code-inventory.json', 'utf8'))
const titleOf = code => (inv.codes.find(c => c.category === 'officer' && c.code === code) || {}).titles?.[0] || null
const MONTH = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12' }

// "e." -> style 'letter' value 5 ; "(2)" -> 'paren-number' 2
function enumKey(text) {
  let m
  if ((m = text.match(/^\(([a-z])\)\.?\s/))) return { style: 'paren-letter', val: m[1].charCodeAt(0) }
  if ((m = text.match(/^\((\d+)\)\.?\s/))) return { style: 'paren-number', val: +m[1] }
  if ((m = text.match(/^([a-z])\.\s/))) return { style: 'letter', val: m[1].charCodeAt(0) }
  if ((m = text.match(/^(\d+)\.\s/))) return { style: 'number', val: +m[1] }
  if ((m = text.match(/^([ivx]+)\.\s/))) return { style: 'roman', val: m[1] }
  return null
}

const dir = path.join(values.corpus, 'Officer-600-3')
const files = (await readdir(dir)).filter(f => f.endsWith('.pdf') && (!values.only || f.includes(values.only))).sort()
await mkdir(path.join(values.out, 'bundles'), { recursive: true }); await mkdir(path.join(values.out, 'sql'), { recursive: true })
const summary = []
for (const f of files) {
  const rel = `Officer-600-3/${f}`
  const entry = audit.sources.find(s => s.path === rel)
  if (!entry) { summary.push({ file: f, result: 'not in the source audit' }); continue }
  const mf = await readFile(path.join('data/reference/guide-manifests-600-3', f.replace(/\.pdf$/, '.json')), 'utf8').then(JSON.parse).catch(() => null)
  if (!mf) { summary.push({ file: f, result: 'no manifest (not decided)' }); continue }
  if (mf.skip) { summary.push({ file: f, result: 'skipped: ' + mf.skip.slice(0, 80) }); continue }
  const buf = await readFile(path.join(dir, f))
  const sha = createHash('sha256').update(buf).digest('hex')
  if (sha !== entry.sha256) throw new Error(`checksum mismatch for ${f}`)
  const cp = path.join(cache, sha + '.json')
  let pages; try { pages = JSON.parse(await readFile(cp, 'utf8')) } catch { pages = await extractPages(buf); await writeFile(cp, JSON.stringify(pages)) }
  const runningLines = findRunningLines(pages)
  const { lines, printedPages, skipped } = toLines(pages, { skipLinePatterns: mf.skipLinePatterns || [], skipRawPatterns: mf.skipRawPatterns || [], skipRegions: mf.skipRegions || [], runningLines })
  const idx = lines.map((l, i) => ({ ...l, i }))
  const { runs, heads: allHeads } = findRuns(idx)
  const warrantAt = new Set(allHeads.filter(h => h.warrant).map(h => h.k))
  const run = runs[mf.run ?? 0]
  const report = { flags: [], runs: runs.map(r => r.map(h => h.abbr).join('>') + '@p' + idx[r[0].k].page), removedLines: skipped.map(x => ({ page: x.page, text: x.text, why: x.why || 'skip pattern in the guide manifest' })), runningLines }
  if (!run || run.length < (mf.minGrades || 3)) { summary.push({ file: f, result: `no usable run of grade headings (${report.runs.join(' | ') || 'none'})` }); continue }
  // a grade heading the generic detector cannot read ("k. AOC 26Z Colonels.") named in the manifest
  for (const x of mf.extraGrades || []) {
    const k = idx.findIndex(l => new RegExp(x.match).test(l.text))
    if (k < 0) { report.flags.push(`extra grade heading not found: ${x.match}`); continue }
    run.push({ k, band: x.band, abbr: x.abbr, title: idx[k].text.replace(/^(?:\(?[a-z]{1,3}[.)]|\d+\.)\s*/, '').replace(/[\s.:]+$/, ''), codes: x.codes })
  }
  run.sort((a, b) => a.k - b.k)
  // section ends
  const sections = run.map((h, n) => {
    let end = n + 1 < run.length ? run[n + 1].k : null
    // the next heading of any kind after this one at the same enumeration level (e.g. "f." after "e.") also ends it
    const key = enumKey(idx[h.k].text)
    const stop = k => {
      const kk = enumKey(idx[k].text)
      if (key && kk && kk.style === key.style && typeof kk.val === 'number' && kk.val === key.val + 1) return true
      return warrantAt.has(k) || /^(?:\d+\.|[A-Z]\.|[a-z]\.)\s+.{0,60}\b(Reserve Component|Reserve Components|Warrant Officers?|National Guard|Glossary|References|Appendix)\b/.test(idx[k].text) && idx[k].text.length < 90 || /^\(?(Appendix|Chapter\s+\d|Figure\s+\d|Table\s+\d)/.test(idx[k].text) || (mf.endAfterLast && n === run.length - 1 && new RegExp(mf.endAfterLast).test(idx[k].text))
    }
    for (let k = h.k + 1; k < (end ?? idx.length); k++) if (stop(k)) { end = k; break }
    if (end === null) end = idx.length
    return { h, end }
  })
  const bands = run.map(h => h.band)
  const passages = []
  let sort = 0
  const codes = mf.codes
  const mkFor = code => (attrs, lns) => {
    const text = joinLines(lns)
    if (!text.trim()) return
    const all = [...(attrs.spanExtra || []), ...lns]
    const p1 = Math.min(...all.map(l => l.page)), p2 = Math.max(...all.map(l => l.page))
    passages.push({ occupation_code: code, occupation_title: titleOf(code), branch: 'Army', personnel_category: 'officer', section_type: attrs.section_type, rank_band: attrs.rank_band ?? null, components: null, heading: attrs.heading ?? null, chapter: mf.title, body: text, pdf_page_start: p1, pdf_page_end: p2, printed_page: printedPages[p1] || null, sort_order: sort++, body_sha256: createHash('sha256').update(text).digest('hex') })
  }
  const POINTER_ONLY = /^\(?(see|refer to)\b[^.]{0,100}\.?\)?$/i
  const sizes = []
  for (const code of codes) {
    for (const { h, end } of sections) {
      if (!(h.codes || mf.runCodes || codes).includes(code)) continue
      const body = idx.slice(h.k + 1, end)
      if (h.rest) body.unshift({ ...idx[h.k], text: h.rest })
      sizes.push({ grade: h.abbr, lines: body.length, chars: joinLines(body).length, pages: `${idx[h.k].page}-${idx[Math.max(h.k, end - 1)].page}` })
      gradeItems(body, mkFor(code), h.title, h.band, idx[h.k])
    }
  }
  // a passage that is only a pointer ("See paragraph 3d(2).") says nothing about the grade; it is left out and counted
  const kept = passages.filter(p => !(p.body.length < 110 && POINTER_ONLY.test(p.body.trim().replace(/\s+/g, ' '))))
  report.pointerOnlyDropped = passages.length - kept.length
  passages.length = 0; passages.push(...kept)
  report.sections = sizes.slice(0, sizes.length / codes.length < run.length ? run.length : Math.round(sizes.length / codes.length))
  const big = report.sections.filter(s => s.chars > 9000)
  for (const b of big) report.flags.push(`${b.grade} section is ${b.chars} characters (pages ${b.pages}): check that it does not run past its grade`)
  const lowOf = b => b.split('..')[0]
  const missing = BAND_ORDER.slice(BAND_ORDER.indexOf(lowOf(bands[0]))).filter(b => !bands.some(x => lowOf(x) === lowOf(b)))
  if (missing.length) report.flags.push(`grades with no section in this run: ${missing.join(', ')}`)
  const date = mf.publicationDate || (() => { const m = f.match(/(\d{1,2})-(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*-?(\d{2,4})/i); return m ? `${m[3].length === 2 ? '20' + m[3] : m[3]}-${MONTH[m[2].toLowerCase()]}-${m[1].padStart(2, '0')}` : null })()
  const id = `army-600-3-${f.replace(/\.pdf$/, '')}`
  const bundle = {
    bundle_version: 1, manifest_id: id, import_batch: `${id}@${values.today}`,
    source: {
      id: stableUuid('source|' + id), branch: 'Army', personnel_category: 'officer', publication_number: 'DA PAM 600-3',
      title: mf.title, chapter: null, career_field: mf.careerField || mf.title, proponent: mf.proponent || null, official_url: entry.official_url,
      publication_date: date, effective_date: null, last_checked_at: values.today + 'T00:00:00Z', checksum_sha256: sha, extraction_tool: `pdf-parse ${pdfParseVersion}`,
      notes: `Date basis: ${mf.dateBasis || 'from the official file name and the Army G-1 listing (https://www.army.mil/g-1), checked 2026-10-17; the PDF body may print no date.'} Imported for ${codes.join(', ')}: the grade-by-grade development sections (${bands.join(', ')}) as the pamphlet gives them for the branch or functional area; they apply to every AOC listed. Duties and prerequisites are not imported from this pamphlet (DA PAM 611-21 is the source); figures and tables are not extracted. ${mf.limitations || ''} LIMITATIONS: ${mf.limitations || 'figures (development models) are images and are not imported.'}`.replace(/\s+/g, ' ').trim(),
    },
    passages: passages.map((p, i) => ({ id: stableUuid(`passage|${id}|${i}|${p.occupation_code}|${p.section_type}|${p.rank_band}|${p.heading}`), ...p, sort_order: i })),
    report: { pdfPages: pages.length, ...report, byType: Object.fromEntries([...new Set(passages.map(p => p.section_type))].map(t => [t, passages.filter(p => p.section_type === t).length])), codes },
  }
  await writeFile(path.join(values.out, 'bundles', `${id}.bundle.json`), JSON.stringify(bundle, null, 1) + '\n')
  await writeFile(path.join(values.out, 'sql', `${id}.import.sql`), importSql(bundle))
  summary.push({ file: f, result: `${passages.length} passages, grades ${run.map(h => h.abbr).join('>')}`, flags: report.flags.length })
}
console.table(summary)
