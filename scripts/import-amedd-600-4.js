#!/usr/bin/env node
/**
 * Imports the AMEDD officer career-management chapters (DA PAM 600-4 Smart Book chapters) for the Army Medical Department
 * area-of-concentration codes that DA PAM 611-21 lists but does not describe.
 *
 *   node scripts/import-amedd-600-4.js --pdf <medical-service-corps.pdf> --out <dir> [--today 2026-10-17]
 *
 * Only the sections of the listed AOCs are imported: "Description of duties" (general duties), qualifications (prerequisites),
 * positions, training and self-development, plus the "unique skills" given by grade. Text is stored as extracted; each AOC's
 * block is checked against the chapter's own heading for it. Admin-time only; the bundle is written UNREVIEWED.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'
import os from 'node:os'
import { parseArgs } from 'node:util'
import { extractPages, toLines, findRunningLines } from './lib/pdfLines.js'
import { joinLines } from './lib/careerGuides.js'
import { stableUuid, importSql } from './lib/bundleSql.js'

const { values } = parseArgs({ options: { pdf: { type: 'string' }, out: { type: 'string', default: 'data/reference' }, today: { type: 'string', default: new Date().toISOString().slice(0, 10) } } })
if (!values.pdf) { console.error('Usage: node scripts/import-amedd-600-4.js --pdf <chapter.pdf>'); process.exit(2) }

// The AOCs DA PAM 611-21 (Nov 2025) lists without a description, with the title it gives them.
const TARGETS = { '70A': 'HEALTH CARE ADMINISTRATION', '70B': 'HEALTH SERVICES ADMINISTRATION', '70C': 'HEALTH SERVICES COMPTROLLER', '70D': 'HEALTH SERVICES SYSTEMS MANAGEMENT', '70E': 'PATIENT ADMINISTRATION', '70F': 'HEALTH SERVICES HUMAN RESOURCES', '70H': 'HEALTH SERVICES PLANS, OPERATIONS, INTELLIGENCE, SECURITY AND TRAINING', '70K': 'HEALTH SERVICES MATERIEL', '71A': 'MICROBIOLOGY', '71B': 'BIOCHEMISTRY', '71E': 'CLINICAL LABORATORY', '71F': 'RESEARCH PSYCHOLOGY', '72A': 'NUCLEAR MEDICAL SCIENCE', '72B': 'ENTOMOLOGY', '72C': 'AUDIOLOGY', '72D': 'ENVIRONMENTAL SCIENCE AND ENGINEERING', '73A': 'SOCIAL WORK', '73B': 'CLINICAL PSYCHOLOGY' }
const inv = JSON.parse(await readFile('data/reference/corpus/army-code-inventory.json', 'utf8'))
const titleOf = code => (inv.codes.find(c => c.category === 'officer' && c.code === code) || {}).title || TARGETS[code]

const buf = await readFile(values.pdf)
const sha = createHash('sha256').update(buf).digest('hex')
const pages = await extractPages(buf)
const running = findRunningLines(pages)
const { lines, printedPages, skipped } = toLines(pages, { runningLines: running })
const idx = lines.map((l, i) => ({ ...l, i }))

// AOC headings: "(2) AOC 70A–Health Care Administration." / "(a) AOC 71A–Microbiology." / "(1) 70B–Health Services Administration."
const HEAD = /^(?:\(\w+\)\.?\s*|\d+\.\s*)?(?:AOC\s+)?(\d{2}[A-Z])(?:\d{2})?\s*[–-]\s*(.+?)\.?$/
const heads = []
const seen = new Set()
for (const l of idx) {
  const m = l.text.match(HEAD)
  if (!m || l.text.length > 120 || !/^(\(|\d+\.|AOC)/.test(l.text)) continue
  if (seen.has(m[1])) continue   // the first heading line is the section; later mentions are cross-references
  seen.add(m[1]); heads.push({ k: l.i, code: m[1], title: m[2].trim() })
}
// Block end: next AOC heading, or the next MFA heading ("b. MFA 71–Medical Allied Sciences.").
const MFA = /^[a-z]\.\s*MFA\s*\d+/
const LABELS = [
  [/^Description of duties\b\.?:?\s*/i, 'general_duties', 'Description of duties'],
  [/^Description of positions\b\.?:?\s*/i, 'assignments', 'Description of positions'],
  [/^Qualifications?\b\.?:?\s*/i, 'prerequisites', 'Qualifications'],
  [/^Restrictions?\b\.?:?\s*/i, null, 'Restrictions'],
  [/^Unique (education|training)[^.:]*[.:]\s*/i, 'training', 'Unique education/training opportunities'],
  [/^(?:\w+\s+)?Unique skills?\b[^.:]*[.:]\s*/i, 'skills', 'Unique skills'],
  [/^Self-?[Dd]evelopment\b\.?:?\s*/i, 'self_development', 'Self-development'],
]
const ENUM = /^(?:\(\w{1,2}\)\.?|\w{1,2}\.)\s+/
const BAND = { CPT: 'O-3', MAJ: 'O-4', LTC: 'O-5', COL: 'O-6' }
const passages = []
const report = { aocs: [], flags: [], unassigned: [], removedLines: skipped.map(x => ({ page: x.page, text: x.text, why: x.why || 'running header/footer' })), runningLines: running }
let sort = 0
const mk = (code, attrs, lns) => {
  const text = joinLines(lns)
  if (!text.trim()) return
  const p1 = Math.min(...lns.map(l => l.page)), p2 = Math.max(...lns.map(l => l.page))
  passages.push({ occupation_code: code, occupation_title: titleOf(code), branch: 'Army', personnel_category: 'officer', section_type: attrs.section_type, rank_band: attrs.rank_band ?? null, components: null, heading: attrs.heading, chapter: 'Medical Service Corps (DA PAM 600-4 chapter)', body: text, pdf_page_start: p1, pdf_page_end: p2, printed_page: printedPages[p1] || null, sort_order: sort++, body_sha256: createHash('sha256').update(text).digest('hex') })
}
for (const code of Object.keys(TARGETS)) {
  const h = heads.find(x => x.code === code)
  if (!h) { report.flags.push(`${code}: no heading found in the chapter`); continue }
  const nextHead = heads.filter(x => x.k > h.k).sort((a, b) => a.k - b.k)[0]
  // headings of the AOCs we do not import (67J ...) also end a block
  const other = idx.find(l => l.i > h.k && HEAD.test(l.text) && /^(\(|\d+\.|AOC)/.test(l.text) && l.text.length <= 120 && !TARGETS[l.text.match(HEAD)[1]] && !seen.has('x') && /^(?:\(\w+\)\.?\s*|\d+\.\s*)?AOC\s/.test(l.text))
  const mfa = idx.find(l => l.i > h.k && MFA.test(l.text))
  const end = Math.min(nextHead ? nextHead.k : Infinity, other ? other.i : Infinity, mfa ? mfa.i : Infinity, lines.length)
  const block = idx.slice(h.k + 1, end)
  // Items start at a labelled line, each label once. The chapter then goes on to grade-by-grade development text for the AOC
  // (self-development, phases of the career); that part is not imported, except "unique skills" when it is the plain
  // CPT / MAJ / LTC / COL list.
  const items = []
  let cur = null
  const seenLabels = new Set()
  let stopped = false
  const stoppedLines = []
  for (const l of block) {
    const bare = l.text.replace(ENUM, '')
    const hit = LABELS.find(([re]) => re.test(bare))
    if (hit && !seenLabels.has(hit[2])) {
      seenLabels.add(hit[2])
      if (hit[1] === 'self_development') { stopped = true; cur = null }
      else cur = { type: hit[1], label: hit[2], lines: [{ ...l, text: bare.replace(hit[0], '') }] }, items.push(cur)
      if (stopped) continue
    } else if (stopped) { stoppedLines.push(l); continue }
    else if (cur) cur.lines.push(l)
    else items.push(cur = { type: 'development', label: 'Overview', lines: [l] })
  }
  const got = []
  for (const it of items) {
    const lns = it.lines.filter(l => l.text)
    if (!lns.length) continue
    if (it.type === null) continue   // restrictions on use of the code: not a description
    if (it.type === 'skills') {
      // "1. CPT. ... 2. MAJ. ..." : one passage per grade, only when it is that plain list
      const parts = []; let pc = null
      for (const l of lns) { const m = l.text.replace(ENUM, '').match(/^(CPT|MAJ|LTC|COL)\.\s*/); if (m) { pc = { band: BAND[m[1]], lines: [{ ...l, text: l.text.replace(ENUM, '').replace(m[0], '') }] }; parts.push(pc) } else if (pc) pc.lines.push(l); else parts.push(pc = { band: null, lines: [l] }) }
      const sizes = parts.map(pt => joinLines(pt.lines).length)
      if (parts.filter(pt => pt.band).length < 2 || Math.max(...sizes) > 1800) { report.flags.push(`${code}: unique skills not imported (not a plain grade list)`); continue }
      for (const pt of parts) mk(code, { section_type: 'skills', rank_band: pt.band, heading: `Unique skills${pt.band ? ` (${Object.keys(BAND).find(k => BAND[k] === pt.band)})` : ''}` }, pt.lines)
      got.push('skills')
    } else {
      const titleNote = it.type === 'general_duties' && h.title.toLowerCase().replace(/[^a-z]/g, '') !== titleOf(code).toLowerCase().replace(/[^a-z]/g, '') ? ` (the chapter titles this AOC "${h.title}")` : ''
      mk(code, { section_type: it.type, heading: it.label + titleNote }, lns)
      got.push(it.type)
    }
  }
  if (stoppedLines.length) report.notImported = [...(report.notImported || []), { code, pages: [stoppedLines[0].page, stoppedLines.at(-1).page].join('-'), lines: stoppedLines.length, why: 'grade-by-grade self-development and career-phase text' }]
  report.aocs.push({ code, chapterTitle: h.title, inventoryTitle: titleOf(code), pages: [h.k, end].map(k => lines[Math.min(k, lines.length - 1)].page).join('-'), sections: got })
  if (!got.includes('general_duties')) report.flags.push(`${code}: no description of duties found`)
}
passages.forEach((p, i) => { p.sort_order = i })

const id = `army-600-4-${path.basename(values.pdf, '.pdf')}`
const src = JSON.parse(await readFile('data/reference/corpus/source-audit.json', 'utf8').catch(() => '{"sources":[]}'))
const bundle = {
  bundle_version: 1, manifest_id: id, import_batch: `${id}@${values.today}`,
  source: {
    id: stableUuid('source|' + id), branch: 'Army', personnel_category: 'officer', publication_number: 'DA PAM 600-4 (Smart Book chapter)',
    title: 'Army Medical Department Officer Career Management: Medical Service Corps chapter', chapter: null, career_field: 'Medical Service Corps (functional areas 70, 71, 72, 73)',
    proponent: 'AMEDD Personnel Proponency Directorate / U.S. Army Medical Center of Excellence', official_url: 'https://api.army.mil/e2/c/downloads/2023/05/03/844ac285/20220223-medical-service-corps.pdf',
    publication_date: '2022-02-23', effective_date: null, last_checked_at: values.today + 'T00:00:00Z', checksum_sha256: sha, extraction_tool: 'pdf-parse',
    notes: 'EDITION: the date 2022-02-23 comes from the file name (20220223-medical-service-corps.pdf); the PDF body prints no date. The file is hosted on api.army.mil under an upload path dated 3 May 2023, after the base pamphlet DA PAM 600-4, Army Medical Department Officer Career Management, dated 27 April 2023 (listed as the current, active edition by GlobalSpec, checked 2026-10-17; armypubs.army.mil could not be reached from this environment, and the Army G-1 publications page lists no DA PAM 600-4 chapter). The AMEDD chapter of DA PAM 600-3 (1 June 2017 text) points to DA PAM 600-4 for detail. No newer Medical Service Corps chapter was found, but it was not possible to confirm that none exists. TITLES: for 70D and 72D the chapter uses different words than DA PAM 611-21 (Nov 2025); the 611-21 title is used for the AOC and the chapter\'s wording is noted on the description. Imported only for AOCs that DA PAM 611-21 lists without a description: ' + Object.keys(TARGETS).join(', ') + '. Figures and tables of assignments by grade are not imported. LIMITATIONS: this is a 2022 chapter; duties and positions may have changed.',
  },
  passages: passages.map(p => ({ id: stableUuid(`passage|${id}|${p.sort_order}|${p.occupation_code}|${p.section_type}|${p.rank_band}`), ...p })),
  report,
}
await mkdir(path.join(values.out, 'bundles'), { recursive: true }); await mkdir(path.join(values.out, 'sql'), { recursive: true })
await writeFile(path.join(values.out, 'bundles', `${id}.bundle.json`), JSON.stringify(bundle, null, 1) + '\n')
await writeFile(path.join(values.out, 'sql', `${id}.import.sql`), importSql(bundle))
console.log(id, passages.length, 'passages;', report.flags.length, 'flags')
for (const a of report.aocs) console.log(' ', a.code, a.pages, a.sections.join(','), a.chapterTitle !== a.inventoryTitle.replace(/ AND /g, ' & ') ? `| chapter title "${a.chapterTitle}" vs 611-21 "${a.inventoryTitle}"` : '')
for (const f of report.flags) console.log('  FLAG', f)
