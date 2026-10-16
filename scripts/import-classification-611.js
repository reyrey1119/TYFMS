#!/usr/bin/env node
/**
 * Imports DA PAM 611-21 (Military Occupational Classification and Structure) into reviewable bundles:
 * one each for enlisted MOS specifications (ch. 10c), warrant officer specifications (ch. 8a/8b) and officer
 * branch/AOC descriptions (ch. 3).
 *
 *   node scripts/import-classification-611.js --corpus <folder holding Classification-611-21/> [--out data/reference]
 *
 * Admin-time only; never part of a user request. Bundles are written UNREVIEWED. Nothing becomes visible to users
 * until it is approved (data/reference/approvals.json for the bundled store, or 02-approve.sql for Supabase).
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import os from 'node:os'
import path from 'node:path'
import { parseArgs } from 'node:util'
import { extractPages } from './lib/pdfLines.js'
import { importEnlistedChapter, parseWarrantChart, importWarrantChapter, importOfficerChapter } from './lib/classification611.js'
import { stableUuid, importSql, bundleContentHash } from './lib/bundleSql.js'

const { values } = parseArgs({ options: { corpus: { type: 'string' }, out: { type: 'string', default: 'data/reference' }, today: { type: 'string', default: new Date().toISOString().slice(0, 10) } } })
if (!values.corpus) { console.error('Usage: node scripts/import-classification-611.js --corpus <folder>'); process.exit(2) }

const audit = JSON.parse(await readFile('data/reference/corpus/source-audit.json', 'utf8'))
const cache = path.join(os.tmpdir(), 'tyfms-corpus-text'); await mkdir(cache, { recursive: true })

async function load(rel) {
  const entry = audit.sources.find(s => s.path === rel)
  if (!entry) throw new Error('not in the source audit: ' + rel)
  const buf = await readFile(path.join(values.corpus, rel))
  const sha = createHash('sha256').update(buf).digest('hex')
  if (sha !== entry.sha256) throw new Error(`checksum mismatch for ${rel}`)
  const cp = path.join(cache, sha + '.json')
  let pages
  try { pages = JSON.parse(await readFile(cp, 'utf8')) } catch { pages = await extractPages(buf); await writeFile(cp, JSON.stringify(pages)) }
  return { entry, sha, pages, bytes: buf.length }
}

const pdfParseVersion = JSON.parse(await readFile(new URL('../node_modules/pdf-parse/package.json', import.meta.url), 'utf8')).version
const NOTE_BASE = 'Date basis: the DA PAM 611-21 (Smartbook) cover reads "End of Fiscal Year 2025 … November 2025"; no day is stated, so the 1st is used. The chapter was posted on api.army.mil on 2025-12-04. Individual specifications carry their own effective dates (e.g. "Effective 202610"); those are stored per passage, not per source.'

// DA PAM 611-21 prints a few specifications twice (e.g. 155A-G at PDF pp. 44-45 and 46-47). Identical text for the same
// code, section, grade and effective window is stored once; the repeat is recorded in the report.
const repeats = []
const crossRefs = []
// A passage that only points somewhere else ("see MOS 948B", "(see AR 614-115)", a lead-in ending "as described below:")
// is not a description of duties. It is not stored; it is listed so the gap is explicit.
const isCrossReferenceOnly = body => body.length < 100 && (/^(?:and\s+CW\d--)?\(?\s*see\b/i.test(body.trim()) || /(?:described|outlined|shown)\s+below\s*:\s*$/i.test(body.trim()))
function flatten(category, byCode, chapterLabel) {
  const out = []
  const seen = new Map()
  for (const [code, versions] of [...byCode].sort(([a], [b]) => a.localeCompare(b))) {
    for (const v of versions) {
      v.passages.forEach(p => { if (isCrossReferenceOnly(p.body)) { crossRefs.push({ code, section: p.section_type, rank_band: p.rank_band ?? null, pdf_page: p.pdf_page_start, text: p.body.trim().slice(0, 100) }); return } const k = [code, p.section_type, p.rank_band, v.effective_from, v.effective_to, p.body].join('|'); if (seen.has(k)) { repeats.push({ code, section: p.section_type, rank_band: p.rank_band ?? null, kept_pdf_page: seen.get(k), repeated_pdf_page: p.pdf_page_start }); return } seen.set(k, p.pdf_page_start); out.push({
        occupation_code: code, occupation_title: v.title || null, branch: 'Army', personnel_category: category,
        section_type: p.section_type, rank_band: p.rank_band ?? null, components: null, heading: p.heading, chapter: chapterLabel,
        body: p.body, pdf_page_start: p.pdf_page_start, pdf_page_end: p.pdf_page_end, printed_page: null,
        effective_from: v.effective_from || null, effective_to: v.effective_to || null,
        cumulative: !!p.cumulative, skill_level: p.skill_level ?? null,
      }) })
    }
  }
  return out
}

function finish(manifestId, source, passages, report) {
  passages.forEach((p, i) => { p.sort_order = i; p.body_sha256 = createHash('sha256').update(p.body).digest('hex') })
  const sourceId = stableUuid('source|' + manifestId)
  passages.forEach((p, i) => { p.id = stableUuid(`passage|${manifestId}|${i}|${p.occupation_code}|${p.section_type}|${p.rank_band}|${p.effective_from}|${p.heading}`) })
  return { bundle_version: 1, manifest_id: manifestId, import_batch: `${manifestId}@${values.today}`, source: { id: sourceId, ...source }, passages, report }
}

const out = []

// ── enlisted ──
{
  const f = await load('Classification-611-21/chapter-10c-enlisted-mos-specifications.pdf')
  const r = importEnlistedChapter(f.pages)
  repeats.length = 0; crossRefs.length = 0
  const passages = flatten('enlisted', r.byCode, 'DA PAM 611-21, ch. 10 (enlisted MOS specifications)')
  const repeatsDropped = [...repeats]
  const crossReferences = [...crossRefs, ...(r.skipped || []).filter(x => /does not apply|empty/.test(x.why || '')).map(x => ({ code: x.code, section: 'rank_duties', rank_band: null, pdf_page: x.page, text: String(x.text || '').slice(0, 100) }))]
  const byType = {}; passages.forEach(p => { byType[p.section_type] = (byType[p.section_type] || 0) + 1 })
  out.push(finish('army-611-21-enlisted-ch10c', {
    branch: 'Army', personnel_category: 'enlisted', publication_number: 'DA PAM 611-21', title: 'Military Occupational Classification and Structure — enlisted MOS specifications (chapter 10c)',
    chapter: 'Chapter 10c', career_field: 'All Army enlisted MOS', proponent: 'Military Personnel Structure & Plans Division (DAPE-PRP), HQDA ODCS G-1',
    official_url: f.entry.official_url, publication_date: '2025-11-01', effective_date: null, last_checked_at: values.today + 'T00:00:00Z', checksum_sha256: f.sha,
    extraction_tool: `pdf-parse ${pdfParseVersion}`,
    notes: `${NOTE_BASE} Skill levels map to grades by Table 9-2 (ch. 9, PDF p. 26): 1=E-1..E-4, 2=E-5, 3=E-6, 4=E-7, 5=E-8, 6=E-9. Only duties are stored; physical demands, qualifications, ASIs, restrictions and standards-of-grade tables are requirements, not duties, and are skipped (counted in the report). LIMITATIONS: the standards-of-grade tables (ch. 10d) and enlisted career-progression charts (ch. 10a) are not imported.`,
  }, passages, {
    codes: r.byCode.size, passages: passages.length, byType, issues: r.report.issues, lineAccounting: r.report.lineAccounting, skipped: r.skipped, publicationRepeatsDropped: repeatsDropped, crossReferences,
    majorDutiesOnly: r.report.issues.filter(i => /major duties only/.test(i.msg)).map(i => i.code),
  }))
}

// ── warrant ──
{
  const a = await load('Classification-611-21/chapter-8a-wo-branches-and-aocs.pdf')
  const b = await load('Classification-611-21/chapter-8b-wo-specifications.pdf')
  const chart = parseWarrantChart(a.pages)
  const r = importWarrantChapter(b.pages, chart)
  repeats.length = 0; crossRefs.length = 0
  const passages = flatten('warrant', r.byCode, 'DA PAM 611-21, ch. 8 (warrant officer specifications)')
  const repeatsDropped = [...repeats]
  const crossReferences = [...crossRefs, ...(r.skipped || []).filter(x => /does not apply|empty/.test(x.why || '')).map(x => ({ code: x.code, section: 'rank_duties', rank_band: null, pdf_page: x.page, text: String(x.text || '').slice(0, 100) }))]
  const byType = {}; passages.forEach(p => { byType[p.section_type] = (byType[p.section_type] || 0) + 1 })
  out.push(finish('army-611-21-warrant-ch8b', {
    branch: 'Army', personnel_category: 'warrant', publication_number: 'DA PAM 611-21', title: 'Military Occupational Classification and Structure — warrant officer MOS specifications (chapter 8b)',
    chapter: 'Chapter 8b', career_field: 'All Army warrant officer MOS', proponent: 'Military Personnel Structure & Plans Division (DAPE-PRP), HQDA ODCS G-1',
    official_url: b.entry.official_url, publication_date: '2025-11-01', effective_date: null, last_checked_at: values.today + 'T00:00:00Z', checksum_sha256: b.sha,
    extraction_tool: `pdf-parse ${pdfParseVersion}`,
    notes: `${NOTE_BASE} Duties are stored by grade band (WO1/CW2, CW3, CW4, CW5). Warrant officer grades are stored as W-1..W-5. Shared specifications (e.g. the aviator families) are stored once per code that the specification names. LIMITATIONS: licensing, prerequisites, qualifications, SQI/ASI and grading items are skipped as requirements. The structure chart (ch. 8a, dated November 2024) lags the specifications: 280A, 390A and 490B appear only in ch. 8b.`,
  }, passages, { codes: r.byCode.size, passages: passages.length, byType, publicationRepeatsDropped: repeatsDropped, crossReferences, issues: r.report.issues, unplaced: r.report.unplaced, lineAccounting: r.report.lineAccounting, skipped: r.skipped, chartCodesWithoutSpec: [...chart.keys()].filter(c => !r.byCode.has(c)) }))
}

// ── officer ──
{
  const f = await load('Classification-611-21/chapter-3-officer-branches-and-fas.pdf')
  const r = importOfficerChapter(f.pages)
  repeats.length = 0; crossRefs.length = 0
  const passages = flatten('officer', r.byCode, 'DA PAM 611-21, ch. 3 (officer branches and functional areas)')
  const repeatsDropped = [...repeats]
  const crossReferences = [...crossRefs, ...(r.skipped || []).filter(x => /does not apply|empty/.test(x.why || '')).map(x => ({ code: x.code, section: 'rank_duties', rank_band: null, pdf_page: x.page, text: String(x.text || '').slice(0, 100) }))]
  const byType = {}; passages.forEach(p => { byType[p.section_type] = (byType[p.section_type] || 0) + 1 })
  const withDuties = new Set(passages.filter(p => p.section_type === 'general_duties').map(p => p.occupation_code))
  out.push(finish('army-611-21-officer-ch3', {
    branch: 'Army', personnel_category: 'officer', publication_number: 'DA PAM 611-21', title: 'Military Occupational Classification and Structure — officer branches, functional areas and AOCs (chapter 3)',
    chapter: 'Chapter 3', career_field: 'All Army officer AOCs', proponent: 'Military Personnel Structure & Plans Division (DAPE-PRP), HQDA ODCS G-1',
    official_url: f.entry.official_url, publication_date: '2025-11-01', effective_date: null, last_checked_at: values.today + 'T00:00:00Z', checksum_sha256: f.sha,
    extraction_tool: `pdf-parse ${pdfParseVersion}`,
    notes: `${NOTE_BASE} The officer chapter describes each AOC in general; it is not written by grade. Grade ranges come from the structure chart in the same chapter. LIMITATIONS: AOCs whose section has no "Description of duties" item (listed in the report) have no description here; qualification, special-qualification and physical-demand items are skipped as requirements.`,
  }, passages, { codes: r.byCode.size, passages: passages.length, byType, publicationRepeatsDropped: repeatsDropped, crossReferences, issues: r.report.issues, aocsWithoutDutiesText: [...r.chart.keys()].filter(c => !withDuties.has(c)), chartAocs: r.chart.size }))
}

await mkdir(path.join(values.out, 'bundles'), { recursive: true }); await mkdir(path.join(values.out, 'sql'), { recursive: true })
for (const b of out) {
  await writeFile(path.join(values.out, 'bundles', `${b.manifest_id}.bundle.json`), JSON.stringify(b, null, 1) + '\n')
  await writeFile(path.join(values.out, 'sql', `${b.manifest_id}.import.sql`), importSql(b))
  console.log(`${b.manifest_id}: ${b.report.codes} codes, ${b.passages.length} passages ${JSON.stringify(b.report.byType)}  fingerprint ${bundleContentHash(b).slice(0, 12)}`)
}
