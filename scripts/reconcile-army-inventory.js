#!/usr/bin/env node
/**
 * Reconciles the Army code inventory against the official DA PAM 611-21 chapters
 * and the DA PAM 600-25 / 600-3 guides. Admin-time only; reads local PDFs, writes files.
 *
 *   node scripts/reconcile-army-inventory.js --corpus <folder with Classification-611-21/, Enlisted-600-25/, Officer-600-3/> \
 *        --as-of 2026-10-15 --out data/reference/corpus
 *
 * What it decides, and from what:
 *   - Which codes exist: DA PAM 611-21 ch.10c (enlisted MOS specifications), ch.3 (officer
 *     branches/AOCs chart), ch.8a/8b (warrant chart and specifications).
 *   - Each code's status AS OF a date, from the dated markers printed in those headings:
 *       current · future_effective · rescinded (historical) · special_reporting · immaterial
 *     "(Effective 202610)" is read as 1 Oct 2026; "(Rescind 202610)" as removed from 1 Oct 2026.
 *   - Which DA PAM 600-25 edition has a chapter for each enlisted MOS, and whether that edition
 *     predates the code's latest classification change.
 *
 * What it does NOT decide: it never marks anything reviewed or approved, and a guide "candidate"
 * for an officer AOC or warrant specialty is only a place to look, not coverage.
 */

import { readFile, writeFile, readdir, mkdir, stat } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import os from 'node:os'
import path from 'node:path'
import { parseArgs } from 'node:util'
import { extractPages } from './lib/pdfLines.js'

const { values } = parseArgs({ options: {
  corpus: { type: 'string' }, 'as-of': { type: 'string', default: new Date().toISOString().slice(0, 10) },
  out: { type: 'string', default: 'data/reference/corpus' }, module: { type: 'string' }, cache: { type: 'string', default: path.join(os.tmpdir(), 'tyfms-corpus-text') },
} })
if (!values.corpus) { console.error('Usage: node scripts/reconcile-army-inventory.js --corpus <folder> [--as-of YYYY-MM-DD] [--out dir]'); process.exit(2) }
const ASOF = values['as-of']
await mkdir(values.cache, { recursive: true })

// ── text access (cached per PDF checksum) ─────────────────────────────────────
async function pagesOf(rel) {
  const buf = await readFile(path.join(values.corpus, rel))
  const sha = createHash('sha256').update(buf).digest('hex')
  const cachePath = path.join(values.cache, sha + '.json')
  try { return { sha, pages: JSON.parse(await readFile(cachePath, 'utf8')) } } catch {}
  const pages = await extractPages(buf)
  await writeFile(cachePath, JSON.stringify(pages))
  return { sha, pages }
}

import { parseMarkers, statusOf as statusOfAt } from './lib/codeStatus.js'
import { importEnlistedChapter, parseWarrantChart, importWarrantChapter } from './lib/classification611.js'
const statusOf = (versions, kind, inherited) => statusOfAt(versions, kind, inherited, ASOF)

// ── enlisted: ch.10c headings ────────────────────────────────────────────────
async function enlisted() {
  const rel = 'Classification-611-21/chapter-10c-enlisted-mos-specifications.pdf'
  const { sha, pages } = await pagesOf(rel)
  // Heading-anchored parse: the official headings contain typos, so a regex on "10-NNX." alone misses codes.
  const parsed = importEnlistedChapter(pages)
  const byCode = new Map()
  for (const [code, list] of parsed.byCode) {
    byCode.set(code, list.map(v => {
      const kind = /Special Reporting Code/i.test(v.heading) ? (/Immaterial/i.test(v.heading) ? 'immaterial' : 'special_reporting') : 'mos'
      return { page: v.startPage, kind, heading: v.heading, title: v.title, effective_from: v.effective_from, rescinded_from: v.rescinded_from, flags: v.flags, component_restriction: v.component_restriction, acasp: /ACASP/i.test(v.heading) }
    }))
  }
  return { rel, sha, byCode, parsed }
}

// ── warrant: ch.8a chart + ch.8b specifications ──────────────────────────────
async function warrant() {
  const a = await pagesOf('Classification-611-21/chapter-8a-wo-branches-and-aocs.pdf')
  const b = await pagesOf('Classification-611-21/chapter-8b-wo-specifications.pdf')
  const chart = parseWarrantChart(a.pages)
  const parsed = importWarrantChapter(b.pages, chart)
  const byCode = new Map()
  const add = (code, rec) => { if (!byCode.has(code)) byCode.set(code, []); byCode.get(code).push(rec) }
  for (const [code, c] of chart) add(code, { page: c.page, kind: 'chart', grades: `W-${c.lo}..W-${c.hi}`, title: c.title, ...c.markers })
  for (const [code, list] of parsed.byCode) for (const v of list) add(code, { page: v.startPage, kind: 'specification', heading: v.heading, title: v.title, effective_from: v.effective_from, rescinded_from: v.rescinded_from, flags: v.flags })
  for (const code of parsed.report.immaterialCodes || []) add(code, { page: 0, kind: 'immaterial', title: 'Branch/MOS immaterial' })
  return { sha: { chart: a.sha, specs: b.sha }, byCode, chart, parsed }
}

// ── officer: ch.3 chart ──────────────────────────────────────────────────────
async function officer() {
  const { sha, pages } = await pagesOf('Classification-611-21/chapter-3-officer-branches-and-fas.pdf')
  const byCode = new Map()
  for (const p of pages) {
    const lines = p.text.split('\n').map(l => l.replace(/\s+/g, ' ').trim())
    lines.forEach((l, i) => {
      const m = l.match(/^(\d{2}[A-Z]) (\d) ?[-–] ?(\d) (.+)$/)
      if (!m) return
      if (!byCode.has(m[1])) byCode.set(m[1], [])
      byCode.get(m[1]).push({ page: p.num, kind: 'chart', grades: `O-${m[2]}..O-${m[3]}`, title: m[4].replace(/\(\s*(?:del|add)[^)]*\)?/gi, '').trim().slice(0, 90), ...parseMarkers(m[4]) })
    })
  }
  // Branch-level dated headings: "3-90. Logistics (90) (...) (Effective 202610)", "3-24. Ordnance (91) (Rescind 202610)",
  // "3-60-62. Medical Corps (60-62) (...)". They apply to every AOC whose first two digits fall in that branch.
  const branchEvents = new Map()
  for (const p of pages) {
    const L = p.text.split('\n').map(l => l.replace(/\s+/g, ' ').trim())
    L.forEach((l, i) => {
      const h = l.match(/^3-[\d-]+[A-Z]?\.\s+.*?\((\d{2})(?:-(\d{2}))?\)/)
      if (!h) return
      const mk = parseMarkers([l, L[i + 1] || ''].join(' '))
      if (!mk.effective_from && !mk.rescinded_from) return
      for (let n = +h[1]; n <= +(h[2] || h[1]); n++) {
        if (!branchEvents.has(String(n))) branchEvents.set(String(n), [])
        if (mk.effective_from) branchEvents.get(String(n)).push({ date: mk.effective_from, type: 'effective', page: p.num })
        if (mk.rescinded_from) branchEvents.get(String(n)).push({ date: mk.rescinded_from, type: 'rescind', page: p.num })
      }
    })
  }
  // Code-level dated notes in the prose, e.g. "u. USMA Professor ... (47U). (Rescind 202310)" / "(Effective 202310)".
  for (const p of pages) {
    const L = p.text.split('\n').map(l => l.replace(/\s+/g, ' ').trim())
    L.forEach((l, i) => {
      if (!/\((?:Effective|Eff|Rescind)\.?\s*\d{6}\)/.test(l)) return
      const code = (l.match(/\((\d{2}[A-Z])\)/) || (L[i - 1] || '').match(/\((\d{2}[A-Z])\)/) || [])[1]
      if (code && byCode.has(code)) byCode.get(code).push({ page: p.num, kind: 'marker_line', heading: l.slice(0, 160), ...parseMarkers(l) })
    })
  }
  return { sha, byCode, branchEvents }
}

// ── DA PAM 600-25: which edition has a chapter for each enlisted MOS ────────
function editionDate(filename) {
  const mon = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12' }
  const m = filename.match(/(\d{1,2})-(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*-(\d{2,4})(?!\d)/i)
  if (!m) return null
  const y = m[3].length === 2 ? '20' + m[3] : m[3]
  return `${y}-${mon[m[2].toLowerCase()]}-${m[1].padStart(2, '0')}`
}
async function guides() {
  const dir = path.join(values.corpus, 'Enlisted-600-25')
  const files = (await readdir(dir)).filter(f => f.endsWith('.pdf') && !/board-products/.test(f)).sort()
  const byMos = new Map(), docs = []
  for (const f of files) {
    const { sha, pages } = await pagesOf(`Enlisted-600-25/${f}`)
    const found = new Set()
    // Chapter headings differ between CMFs: "Chapter 4. MOS 42A ...", "Chapter 6: MOS 14E: ...", a bare
    // "Chapter 4" with the title on the next line, or one chapter for several MOS ("MOS 18B, 18C, ... and 18Z").
    for (const p of pages) {
      const L = p.text.split('\n').map(l => l.replace(/\s+/g, ' ').trim())
      L.forEach((l, i) => {
        const m = l.match(/^Chapter\s+(\d+)\b[.:]?\s*(.*)$/i)
        if (!m) return
        const head = [m[2], L[i + 1] || ''].join(' ').slice(0, 220)
        if (!/\b(?:MOS|Military Occupational Specialty)\b/i.test(head) || /professional development model|Reserve Component/i.test(m[2] || L[i + 1] || '')) return
        const afterMos = head.replace(/^.*?\b(?:MOS|Military Occupational Specialty)s?\b/i, '')
        const list = afterMos.slice(0, 120).match(/\b\d{2}[A-Z]\b/g) || []
        for (const code of list) {
          found.add(code)
          if (!byMos.has(code)) byMos.set(code, [])
          if (!byMos.get(code).some(x => x.file === f)) byMos.get(code).push({ file: f, edition: editionDate(f), page: p.num, chapter: head.slice(0, 100) })
        }
      })
    }
    docs.push({ file: f, sha256: sha, edition: editionDate(f), pdf_pages: pages.length, mos_chapters: [...found].sort() })
  }
  return { byMos, docs }
}

// ── reconcile ────────────────────────────────────────────────────────────────
function reconcile(category, byCode, guideByMos, branchEvents) {
  const rows = []
  for (const [code, versions] of [...byCode].sort(([a], [b]) => a.localeCompare(b))) {
    const kind = versions.some(v => v.kind === 'immaterial') ? 'immaterial' : versions.some(v => v.kind === 'special_reporting') ? 'special_reporting' : 'mos'
    const st = statusOf(versions, kind === 'mos' ? null : kind, branchEvents?.get(code.slice(0, 2)) || [])
    const flags = [...new Set(versions.flatMap(v => v.flags || []))]
    const titles = [...new Set(versions.map(v => v.title).filter(Boolean))]
    const row = {
      category, code, status: st.status, ...st,
      grades: versions.map(v => v.grades).find(Boolean) || null,
      titles, component_restriction: [...new Set(versions.map(v => v.component_restriction).filter(Boolean))].join('; ') || null,
      versions: versions.map(v => ({ page: v.page, kind: v.kind, effective_from: v.effective_from, rescinded_from: v.rescinded_from, heading: v.heading || v.title })),
      flags,
    }
    if (category === 'enlisted' && guideByMos) {
      const g = (guideByMos.get(code) || []).sort((a, b) => String(b.edition).localeCompare(String(a.edition)))
      row.guide = g.length ? { latest: g[0], also_in: g.slice(1).map(x => x.file) } : null
      const latestChange = versions.map(v => v.effective_from).filter(Boolean).sort().at(-1)
      row.guide_predates_classification_change = !!(g[0] && latestChange && g[0].edition && g[0].edition < latestChange && latestChange <= ASOF)
    }
    rows.push(row)
  }
  return rows
}

const [en, wo, of, gd] = await Promise.all([enlisted(), warrant(), officer(), guides()])
const rows = [...reconcile('enlisted', en.byCode, gd.byMos), ...reconcile('warrant', wo.byCode), ...reconcile('officer', of.byCode, null, of.branchEvents)]

// rescinded → possible successor: another current code whose title/heading text names the old code
for (const r of rows.filter(r => r.status === 'rescinded' && r.category === 'enlisted')) {
  const cands = rows.filter(o => o.category === 'enlisted' && o.status === 'current' && o.code !== r.code && o.versions.some(v => (v.heading || '').includes(r.code)))
  if (cands.length) r.possible_successors = cands.map(c => c.code)
}

const count = (cat, st) => rows.filter(r => r.category === cat && r.status === st).length
const cats = ['enlisted', 'officer', 'warrant']
const stats = ['current', 'future_effective', 'rescinded', 'special_reporting', 'immaterial', 'unclassified']
const summary = Object.fromEntries(cats.map(c => [c, { total: rows.filter(r => r.category === c).length, ...Object.fromEntries(stats.map(s => [s, count(c, s)])) }]))
const basisCounts = Object.fromEntries(cats.map(c => [c, Object.fromEntries(['dated_marker_on_code', 'dated_marker_on_branch', 'listed_without_dated_marker', 'classification_heading'].map(b => [b, rows.filter(r => r.category === c && r.basis === b).length]))]))
const enCur = rows.filter(r => r.category === 'enlisted' && r.status === 'current')
const coverage = {
  enlisted_current_with_guide_chapter: enCur.filter(r => r.guide).length,
  enlisted_current_without_guide_chapter: enCur.filter(r => !r.guide).map(r => r.code),
  enlisted_guide_predates_classification_change: enCur.filter(r => r.guide_predates_classification_change).map(r => r.code),
}

const report = {
  as_of: ASOF,
  generated_from: { enlisted_specs_sha256: en.sha, warrant_sha256: wo.sha, officer_sha256: of.sha },
  NOT_ESTABLISHED: 'A reconciled code list is not reviewed reference text. It says which codes the classification document lists and which are in force on the as-of date. Chart rows can omit codes whose headings are formatted differently; unclassified/flagged rows need a person.',
  summary, basis: basisCounts, coverage, guides: gd.docs, codes: rows,
}
await mkdir(values.out, { recursive: true })
await writeFile(path.join(values.out, 'army-code-inventory.json'), JSON.stringify(report, null, 1) + '\n')

const md = ['# Army code inventory reconciled against DA PAM 611-21', '', `As of **${ASOF}**. ${report.NOT_ESTABLISHED}`, '', 'Basis for "current": ' + cats.map(c => `${c}: ${basisCounts[c].dated_marker_on_code + basisCounts[c].dated_marker_on_branch} supported by a dated marker, ${basisCounts[c].listed_without_dated_marker} listed in the classification chart/specifications with no dated marker`).join(' · '), '', '| Category | Codes listed | Current | Future-effective | Rescinded (historical) | Special reporting | Immaterial | Unclassified |', '|---|--:|--:|--:|--:|--:|--:|--:|',
  ...cats.map(c => `| ${c} | ${summary[c].total} | ${summary[c].current} | ${summary[c].future_effective} | ${summary[c].rescinded} | ${summary[c].special_reporting} | ${summary[c].immaterial} | ${summary[c].unclassified} |`), '',
  '## Non-current enlisted/warrant/officer codes', '', '| Category | Code | Status | Date | Title |', '|---|---|---|---|---|',
  ...rows.filter(r => r.status !== 'current').map(r => `| ${r.category} | ${r.code} | ${r.status} | ${r.effective_from || r.rescinded_from || ''} | ${(r.titles[0] || '').slice(0, 70)} |`), '',
  '## Current codes with a scheduled change', '', ...rows.filter(r => r.status === 'current' && (r.scheduled_change || r.scheduled_rescission)).map(r => `- ${r.category} ${r.code}: ${r.scheduled_change ? 'change effective ' + r.scheduled_change : ''}${r.scheduled_rescission ? ' rescission effective ' + r.scheduled_rescission : ''}`), '',
  '## Enlisted guide coverage', '', `- Current enlisted MOS with a DA PAM 600-25 chapter in the collected editions: **${coverage.enlisted_current_with_guide_chapter}** of ${enCur.length}`,
  `- Current enlisted MOS with NO chapter found: ${coverage.enlisted_current_without_guide_chapter.join(', ') || 'none'}`,
  `- Guide edition predates the code's latest classification change (guide may describe the older spec): ${coverage.enlisted_guide_predates_classification_change.join(', ') || 'none'}`, '',
  '## Rows needing a person (flags)', '', ...rows.filter(r => r.flags.length).map(r => `- ${r.category} ${r.code}: ${r.flags.join('; ')}`), '']
await writeFile(path.join(values.out, 'army-code-inventory.md'), md.join('\n'))

// The app only needs the codes that are NOT simply current, plus scheduled changes and component limits.
// Everything else is "no special status", and the file says what it was generated from.
if (values.module) {
  // Hand-checked against the cited pages: DA PAM 611-21 ch.3 p.159 introduces the Logistics branch (90) effective 202610,
  // and the chart rows 88A/91A/92A are marked "del 2610". This links the two; it does not claim an AOC-to-AOC mapping.
  const RELATED = { 'officer:88A': 'DA PAM 611-21 ch. 3 (PDF p. 159) establishes a Logistics branch (90) effective October 2026.', 'officer:91A': 'DA PAM 611-21 ch. 3 (PDF p. 159) establishes a Logistics branch (90) effective October 2026.', 'officer:92A': 'DA PAM 611-21 ch. 3 (PDF p. 159) establishes a Logistics branch (90) effective October 2026.' }
  const data = { enlisted: {}, officer: {}, warrant: {} }
  // Official titles for EVERY listed code (not only the exceptions). The title is the one verified fact the generators
  // may state about what a code is when no reviewed reference exists.
  const cleanTitle = t => String(t || '').replace(/,?\s*CMF\s*\d+.*$/i, '').replace(/\s+MOS\s+\d{2}[A-Z].*$/i, '').replace(/\s+/g, ' ').replace(/[\s,;:—-]+$/, '').trim().slice(0, 110)
  const titles = { enlisted: {}, officer: {}, warrant: {} }
  for (const r of rows) { const t = cleanTitle(r.titles[0]); if (t) titles[r.category][r.code] = t }
  // Authorized grade range per officer AOC / warrant specialty, from the structure charts (ch. 3, ch. 8a).
  const grades = { officer: {}, warrant: {} }
  for (const r of rows) if (r.grades && grades[r.category]) grades[r.category][r.code] = r.grades
  for (const r of rows) {
    const interesting = r.status !== 'current' || r.scheduled_change || r.scheduled_rescission || r.component_restriction || r.guide_predates_classification_change
    if (!interesting) continue
    // cite the page that supports the status: the rescission notice, the future-effective heading, else the first listing
    const pageOf = (r.status === 'rescinded' ? r.versions.find(v => v.rescinded_from === r.rescinded_from) : r.status === 'future_effective' ? r.versions.find(v => v.effective_from === r.effective_from) : r.scheduled_change ? r.versions.find(v => v.effective_from === r.scheduled_change) : null)?.page || r.versions.find(v => v.page)?.page
    data[r.category][r.code] = {
      status: r.status, title: r.titles[0] || null,
      ...(r.effective_from ? { effective_from: r.effective_from } : {}), ...(r.rescinded_from ? { rescinded_from: r.rescinded_from } : {}),
      ...(r.scheduled_change ? { scheduled_change: r.scheduled_change } : {}), ...(r.scheduled_rescission ? { scheduled_rescission: r.scheduled_rescission } : {}),
      ...(r.component_restriction ? { component_restriction: r.component_restriction } : {}),
      ...(r.guide_predates_classification_change ? { guide_predates_change: true } : {}),
      source: r.category === 'enlisted' ? 'DA PAM 611-21, ch. 10c' : r.category === 'warrant' ? 'DA PAM 611-21, ch. 8a/8b' : 'DA PAM 611-21, ch. 3',
      pdf_page: pageOf || null, basis: r.basis,
      ...(RELATED[`${r.category}:${r.code}`] ? { related: RELATED[`${r.category}:${r.code}`] } : {}),
    }
  }
  const body = `// GENERATED by scripts/reconcile-army-inventory.js — do not edit by hand.
// Source: official DA PAM 611-21 classification chapters (api.army.mil), as of ${ASOF}.
// Only codes that are not simply "current", or that carry a scheduled change or component limit, appear here.
// Absence from this list means "no special status found", not "verified current".
export const ARMY_CODE_STATUS_AS_OF = '${ASOF}'
export const ARMY_CODE_STATUS_SOURCES = ${JSON.stringify(report.generated_from)}
export const ARMY_CODE_STATUS_DATA = ${JSON.stringify(data, null, 1)}
// Official title of every listed code, from the same classification chapters.
export const ARMY_CODE_TITLES = ${JSON.stringify(titles, null, 1)}
// Authorized grade range of each officer AOC and warrant specialty, from the structure charts.
export const ARMY_CODE_GRADES = ${JSON.stringify(grades)}
`
  await mkdir(path.dirname(values.module), { recursive: true })
  await writeFile(values.module, body)
}
console.log(JSON.stringify({ as_of: ASOF, summary, coverage: { with_guide: coverage.enlisted_current_with_guide_chapter, without_guide: coverage.enlisted_current_without_guide_chapter.length, guide_predates_change: coverage.enlisted_guide_predates_classification_change.length } }, null, 1))
