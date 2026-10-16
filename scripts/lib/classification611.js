// Parsers for DA PAM 611-21 (Military Occupational Classification and Structure).
//
// This publication defines every Army enlisted MOS, warrant specialty and officer AOC: its duties, grade range,
// and the dated markers that say when a code takes effect or is rescinded. It is the authoritative, uniform source for
// "what does this specialty do", so it is the primary source for translations. (Career-development guidance by rank
// lives in DA PAM 600-25 / 600-3 and is imported separately where reviewed.)
//
// Rules, as everywhere else in this importer:
//   * text is stored as extracted, never paraphrased
//   * structure comes from the document's own headings and numbering
//   * every line inside a specification block is either part of a stored passage or is explicitly skipped with a reason
//   * anything the parser cannot place is reported, never guessed
//
// Admin-time only. Nothing here runs in the request path.

import { createHash } from 'node:crypto'
import { parseMarkers } from './codeStatus.js'
import { joinLines } from './careerGuides.js'

const sha = s => createHash('sha256').update(s).digest('hex')
const norm = s => String(s).replace(/\s+/g, ' ').trim()

// Table 9-2 "Definition of Enlisted Skill Levels" (DA PAM 611-21, ch. 9, PDF p. 26).
export const SKILL_LEVEL_GRADE = { 1: 'E-1..E-4', 2: 'E-5', 3: 'E-6', 4: 'E-7', 5: 'E-8', 6: 'E-9' }
const SL_MAX_GRADE = { 1: 4, 2: 5, 3: 6, 4: 7, 5: 8, 6: 9 }

export function flattenPages(pages) {
  const out = []
  // The printed page number is the first line of a page (a lone 1-3 digit number); it is not part of the text.
  // The two-column layout can put the next section's heading mid-line ("... operations. b. Physical demands rating ...").
  const INLINE_SECTION = /\s+(?=[b-z]\s?\.\s+(?:Physical demands?|Physical requirements|Qualifications?\b|Reclassification|Position coding|Restrictions?\b|Additional skill|Skill [Ii]dentifiers|Special personnel classification)\b)/
  const INLINE_ITEM_LABEL = /\s+(?=\(\d\)\s*(?:Unique duty positions?|Special grading of positions|Description of duties|Special qualifications|Physical Demands? [Rr]ating)\b)/
  for (const p of pages) p.text.split('\n').map(norm).filter(Boolean).forEach((t, k) => {
    if (k === 0 && /^\d{1,3}$/.test(t)) return
    const cut = Math.max(t.search(INLINE_SECTION), t.search(INLINE_ITEM_LABEL))
    if (cut > 8) { out.push({ page: p.num, text: t.slice(0, cut).trim(), i: out.length }); out.push({ page: p.num, text: t.slice(cut).trim(), i: out.length }) }
    else out.push({ page: p.num, text: t, i: out.length })
  })
  return out
}

// ── enlisted (chapter 10c) ───────────────────────────────────────────────────

// The official headings contain typos ("1110-15G.", "10-17. MOS 17E", "10—91C.") and some blocks have no
// "a. Major duties" label at all, so a block starts at a HEADING and ends at the next one.
const HEADING_RES = [
  /^10\s*[-–—]+\s*\d{2}[A-Z]\.\s*\S/,                  // 10-25E.  10–25E.  10—91C.
  /^\d{3,4}\s*[-–—]+\s*\d{2}[A-Z]\.\s*\S/,            // 1110-15G.
  /^10\s*[-–—]+\s*\d{2}\.\s*MOS\s+\d{2}[A-Z]/,        // 10-17. MOS 17E   10-42. MOS 42S   10-94. MOS 94A
  /^MOS\s+\d{2}[A-Z]\s*[—–-]{1,2}\s*[A-Za-z]/,          // MOS 25H—Network...   (heading with its prefix missing)
]
export const isEnlistedHeading = t => HEADING_RES.some(re => re.test(t))
function codeFromHeading(text) {
  const stripped = text.replace(/^\d*\s*[-–—]+\s*/, '')
  const m = stripped.match(/\b(\d{2}[A-Z])\b/)
  return m ? m[1] : null
}
const HEADING_TAIL_STOP = /^([a-z]\.\s|\(\d+\)\s|Major [Dd]uties|MOS\s|Duties\b)/

export function findEnlistedBlocks(lines) {
  const starts = lines.filter(l => isEnlistedHeading(l.text))
  const blocks = starts.map((l, n) => {
    // A heading can wrap over up to three lines: "(Effective" / "202610)", "(Army Civilian Acquired Skills Program ...)".
    let hEnd = l.i + 1
    while (hEnd < Math.min(lines.length, l.i + 4) && !HEADING_TAIL_STOP.test(lines[hEnd].text) && !isEnlistedHeading(lines[hEnd].text)) hEnd++
    return { start: l.i, headingEnd: hEnd, headingText: lines.slice(l.i, hEnd).map(x => x.text).join(' '), code: codeFromHeading(l.text) }
  })
  blocks.forEach((b, n) => { b.end = n + 1 < blocks.length ? blocks[n + 1].start : lines.length })
  return blocks
}

const SL_START = /^(?:\(\d+\)|[a-z]\.)\s*(?:MOSC|MOS)\s*(\d{2}[A-Z])\s?(\d)\s?[O0]\b/i
const ITEM_START = /^[a-z]\s?\.\s/
const REQ_RE = /^(?:Physical demands|Qualifications?\b|Additional skill identifiers?|Physical requirements|Prerequisites?|Special qualifications|Standards of grade|Physical profile)/i
// "Performs duties shown in preceding level of skill" / "all duties of preceding skill level" / "mastery of the preceding skills"
const CUMULATIVE_RE = /\b(?:preceding|previous|lower)\s+(?:skill\s+|grade\s+)?(?:levels?|skills|grades?)\b|duties\s+(?:shown|described)\s+(?:in|at)\s+(?:the\s+)?(?:preceding|previous|paragraphs?)\b|perform\w*\s+(?:the\s+)?(?:duties\s+)?(?:as\s+)?(?:described|shown)\s+(?:in|at)\s+paragraphs?/i
const RESTRICTION_RE = /^(?:Restrictions?\b)/i
const DUTY_LABEL_RE = /^(?:Major [Dd]uties|Duties\b)/i

// The last sentence of "Major duties" often just introduces the skill-level paragraphs ("Duties for MOS 18F at each level are:").
// It is not a duty, so it is dropped, together with a stray trailing "Major" left by a line break.
export function dropLeadIn(text) {
  const parts = text.split(/(?<=[.!?])\s+/)
  const last = parts.at(-1)
  if (parts.length > 1 && (/^Major$/i.test(last) || (/\b(?:[Dd]uties|[Ff]unctions)\b/.test(last) && /\b(?:at each|by|for each|of each)\b/.test(last) && /\b(?:are|follows|below)\b/.test(last) && last.length < 170))) return parts.slice(0, -1).join(' ')
  return text.replace(/\s*(?:Major\s+)?[Dd]uties (?:for|of) [^.]{0,110}?\bare\s*[:;]?\s*$/, '').replace(/\s+Major\s*$/, '')
}

export function parseEnlistedBlock(lines, block, ctx) {
  const { code } = block
  const issues = []
  const duty = [], req = [], restr = []
  let mode = 'duty'
  let seenItem = false
  for (let k = block.headingEnd; k < block.end; k++) {
    const l = lines[k]
    if (SL_START.test(l.text)) mode = 'duty'
    else if (ITEM_START.test(l.text) && seenItem && /^a\./.test(l.text) && !DUTY_LABEL_RE.test(l.text.replace(/^[a-z]\.\s*/, ''))) {
      // "a." again after the first lettered item is a sub-list restarting inside a requirements table, not a new duty item.
    } else if (ITEM_START.test(l.text)) {
      seenItem = true
      const label = l.text.replace(/^[a-z]\.\s*/, '')
      // Only the first lettered item (usually "a. Major duties") and items labelled as duties are duty text;
      // reclassification, position coding, utilization and the like are rules about the MOS, not what it does.
      mode = REQ_RE.test(label) ? 'req' : RESTRICTION_RE.test(label) ? 'restr' : (/^a\./.test(l.text) || DUTY_LABEL_RE.test(label)) ? 'duty' : 'req'
    }
    ;(mode === 'req' ? req : mode === 'restr' ? restr : duty).push(l)
  }
  const firstSL = duty.findIndex(l => SL_START.test(l.text))
  const major = firstSL < 0 ? duty : duty.slice(0, firstSL)

  // General duties: strip the item label and the "Duties for MOS X at each level of skill are:" lead-in.
  const majorText = dropLeadIn(joinLines(major)
    .replace(/^[a-z]\.\s*(?:Major [Dd]uties[.:]?)?\s*/, '').replace(/^Major [Dd]uties[.:]?\s*/, '')
    .trim())
  const passages = []
  const mk = (type, band, heading, text, lns, extra = {}) => {
    const pages = lns.map(l => l.page)
    passages.push({ section_type: type, rank_band: band, heading, body: text, pdf_page_start: Math.min(...pages), pdf_page_end: Math.max(...pages), ...extra })
  }
  if (majorText.length > 20) mk('general_duties', null, 'Major duties', majorText, major)
  else if (firstSL < 0) issues.push('no duties text')

  const slStarts = []
  duty.forEach((l, k) => { const m = l.text.match(SL_START); if (m) slStarts.push({ k, code: m[1], level: Number(m[2]) }) })
  slStarts.forEach((s, n) => {
    const end = n + 1 < slStarts.length ? slStarts[n + 1].k : duty.length
    const lns = duty.slice(s.k, end)
    if (s.code !== code) issues.push(`skill-level paragraph names ${s.code}, block is ${code}`)
    const text = joinLines(lns).replace(/^(?:\(\d+\)|[a-z]\.)\s*(?:MOSC|MOS)\s*\d{2}[A-Z]\s?\d\s?[O0]\s*[.:]?\s*/i, '').trim()
    if (!SKILL_LEVEL_GRADE[s.level]) { issues.push(`unknown skill level ${s.level}`); return }
    if (/^\(Personnel Only\)/i.test(text)) {
      ctx.skipped.push({ code, page: lns[0].page, why: 'administrative personnel-only skill level (identifies Soldiers accessed before the grade); not a duty description', text: text.slice(0, 70) })
      return
    }
    mk('rank_duties', SKILL_LEVEL_GRADE[s.level], `Skill level ${s.level} (${SKILL_LEVEL_GRADE[s.level]})`, text, lns, { cumulative: CUMULATIVE_RE.test(text), skill_level: s.level })
  })
  if (!slStarts.length && majorText.length > 20) issues.push('major duties only (no skill-level breakdown)')

  if (restr.length) ctx.skipped.push({ code, page: restr[0].page, why: 'restriction on use of the MOS (a rule about positions, not a duty)', text: restr[0].text.slice(0, 100), lines: restr.length })
  if (req.length) {
    const items = req.filter(l => ITEM_START.test(l.text)).map(l => l.text.slice(0, 50))
    ctx.skipped.push({ code, page: req[0].page, why: `requirements and tables, not duties (${items.length} lettered items)`, text: items.join(' | ').slice(0, 160), lines: req.length })
  }
  return { passages, issues, headingLines: block.headingEnd - block.start, dutyLines: duty.length, reqLines: req.length, restrLines: restr.length }
}

// Versions: a code can have two specs (an older one and one that takes effect later). Each passage carries the period
// in which it applies, so a version that has not taken effect yet (or has been replaced) is never shown as current.
export function assignVersions(blocksForCode) {
  const sorted = [...blocksForCode].sort((a, b) => String(a.effective_from || '').localeCompare(String(b.effective_from || '')))
  sorted.forEach((b, n) => {
    const next = sorted[n + 1]
    b.effective_to = next && next.effective_from && next.effective_from !== b.effective_from ? next.effective_from : (b.rescinded_from || null)
  })
  return sorted
}

export function titleFromHeading(headingText) {
  return norm(headingText)
    .replace(/^\d*\s*[-–—]+\s*\d*[A-Z]?\d*\.\s*/, '').replace(/^MOS\s+/i, '').replace(/^\d{2}[A-Z]\s*[—–-]{1,2}\s*/, '')
    .replace(/\((?:Effective|Eff|Rescind)[^)]*\)?/gi, '').replace(/\(Rescind\)\s*\d+\)?/gi, '')
    .replace(/,?\s*CMF\s*\d+.*$/i, '').replace(/\(Army Civilian Acquired.*$/i, '')
    .replace(/[\s,;:—-]+$/, '').trim().slice(0, 110)
}

export function importEnlistedChapter(pages) {
  const lines = flattenPages(pages)
  const blocks = findEnlistedBlocks(lines)
  const ctx = { skipped: [] }
  const byCode = new Map()
  const report = { blocks: blocks.length, unattributed: [], issues: [], lineAccounting: { inBlocks: 0, consumed: 0, skippedRequirements: 0 } }
  for (const b of blocks) {
    if (!b.code) { report.unattributed.push({ page: lines[b.start].page, text: lines[b.start].text.slice(0, 80) }); continue }
    const mk = parseMarkers(b.headingText)
    const parsed = parseEnlistedBlock(lines, b, ctx)
    parsed.issues.forEach(msg => report.issues.push({ code: b.code, page: lines[b.start].page, msg }))
    report.lineAccounting.inBlocks += (b.end - b.start); report.lineAccounting.consumed += parsed.dutyLines + parsed.headingLines; report.lineAccounting.skippedRequirements += parsed.reqLines + parsed.restrLines
    const rec = { code: b.code, title: titleFromHeading(b.headingText), heading: norm(b.headingText).slice(0, 220), startPage: lines[b.start].page, endPage: lines[b.end - 1].page, effective_from: mk.effective_from, rescinded_from: mk.rescinded_from, flags: mk.flags, component_restriction: mk.component_restriction, passages: parsed.passages }
    if (!byCode.has(b.code)) byCode.set(b.code, [])
    byCode.get(b.code).push(rec)
  }
  for (const [code, list] of byCode) assignVersions(list)
  return { byCode, skipped: ctx.skipped, report, lines }
}

export const fingerprint = sha

// ── warrant officers (chapters 8a chart + 8b specifications) ─────────────────

const WO_BAND = { WO1: 1, CW2: 2, CW3: 3, CW4: 4, CW5: 5 }
const bandOf = tokens => {
  const n = tokens.map(t => WO_BAND[t]).filter(Boolean)
  if (!n.length) return null
  const lo = Math.min(...n), hi = Math.max(...n)
  return lo === hi ? `W-${lo}` : `W-${lo}..W-${hi}`
}

export function parseWarrantChart(pages) {
  const lines = flattenPages(pages)
  const chart = new Map()
  for (const l of lines) {
    const m = l.text.match(/^(\d{3}[A-Z]) (\d) ?[-–] ?(\d) (.+)$/)
    if (!m) continue
    const mk = parseMarkers(m[4])
    chart.set(m[1], { code: m[1], lo: +m[2], hi: +m[3], page: l.page, title: m[4].replace(/\(\s*(?:del|add)[^)]*\)?/gi, '').replace(/\s+[A-Z0-9](?: [A-Z0-9])*$/, '').trim().slice(0, 100), markers: mk })
  }
  return chart
}

const WO_HEADING = /^8\s*[-–—]+\s*\d{1,3}[A-Z]?\.\s/
const WO_GRADE_HEAD = /^((?:WO1|CW[2-5])(?:\s*[-–—/,&]\s*(?:WO1|CW[2-5]))*)\s*[-–—.:]*\s*/
const WO_DUTIES_END = /^(?:\(\d\)\s*)?(?:A physical demands rating|Physical Demands|Table 10-|The following grades|Qualifying scores)/i
const fixWoHeader = t => t.replace(/\bW0(\d)\b/g, 'WO$1').replace(/(WO1)\s*\/\s*0?2\b/, '$1/CW2')

export function importWarrantChapter(pages, chart) {
  const lines = flattenPages(pages)
  const starts = lines.filter(l => WO_HEADING.test(l.text))
  const blocks = starts.map((l, n) => {
    let hEnd = l.i + 1
    while (hEnd < Math.min(lines.length, l.i + 6) && !ITEM_START.test(lines[hEnd].text) && !WO_HEADING.test(lines[hEnd].text)) hEnd++
    const headingText = lines.slice(l.i, hEnd).map(x => x.text).join(' ')
    const immaterial = /immaterial/i.test(headingText)
    const codes = [...new Set(headingText.match(/\b\d{3}[A-Z]\b/g) || [])]
    // A shared specification also names the other family members in its "c." item ("MOS 153B, 153D, ... may be substituted").
    const blockEnd = n + 1 < starts.length ? starts[n + 1].i : lines.length
    const cStart = lines.slice(hEnd, Math.min(blockEnd, hEnd + 14)).findIndex(x => /^c\.\s/.test(x.text))
    let cItem = null
    if (cStart >= 0) { let k = hEnd + cStart + 1; while (k < blockEnd && !ITEM_START.test(lines[k].text)) k++; cItem = { text: lines.slice(hEnd + cStart, k).map(x => x.text).join(' ') } }
    if (codes.length > 1 && cItem) for (const c of (cItem.text.match(/\b\d{3}[A-Z]\b/g) || [])) if (chart.has(c) && c.slice(0, 3) === codes[0].slice(0, 3) && !codes.includes(c)) codes.push(c)
    return { start: l.i, headingEnd: hEnd, headingText, codes, immaterial, end: blockEnd }
  })
  const ctx = { skipped: [] }
  const byCode = new Map()
  const report = { blocks: blocks.length, issues: [], unplaced: [], immaterialCodes: [], lineAccounting: { inBlocks: 0, duties: 0, skipped: 0 } }
  for (const b of blocks) {
    report.lineAccounting.inBlocks += b.end - b.start
    if (!b.codes.length || b.immaterial) {
      report.lineAccounting.skipped += b.end - b.start
      if (b.immaterial) { report.immaterialCodes.push(...b.codes); ctx.skipped.push({ code: b.codes.join('/'), page: lines[b.start].page, why: 'branch/MOS immaterial code, not a job specialty', lines: b.end - b.start }) }
      else report.unplaced.push({ page: lines[b.start].page, heading: b.headingText.slice(0, 100) })
      continue
    }
    const mk = parseMarkers(b.headingText)
    const body = lines.slice(b.headingEnd, b.end)
    const di = body.findIndex(l => /^[a-z]\.\s*Duties\b/i.test(l.text))
    const passages = []
    const issues = []
    let dutyLines = []
    if (di < 0) issues.push('no "Duties" item')
    else {
      let de = body.findIndex((l, k) => k > di && ITEM_START.test(l.text))
      if (de < 0) de = body.length
      // The PDF is two-column: a grade heading can start mid-line ("... SOPs. (2) CW3 must--"). Split such lines.
      dutyLines = body.slice(di, de).flatMap(l => {
        const m = l.text.match(/^(.+?)\s+(\(\d\)\s*(?:WO1|W01|CW[2-5])(?:\s*[\/,&]\s*(?:WO1|W01|0?2|CW[2-5]))*\s*(?:[-–—]{1,2}|must\b).*)$/)
        return m ? [{ ...l, text: m[1] }, { ...l, text: m[2] }] : [l]
      })
      // Grade items start at a line whose text begins with WO1/CW2..CW5; other numbered lines continue the previous item.
      const segs = []
      let cur = { head: [], lines: [] }
      let ended = -1
      for (let k = 1; k < dutyLines.length; k++) {
        const l = dutyLines[k]
        const first = fixWoHeader(l.text.replace(/^\(\d\)\s*/, ''))
        if (WO_DUTIES_END.test(l.text) && segs.length + (cur.head.length ? 1 : 0) > 0) { ended = k; break }
        if (/^\(\d\)\s*/.test(l.text) && WO_GRADE_HEAD.test(first)) { if (cur.head.length || cur.lines.length) segs.push(cur); cur = { head: [l], lines: [] } }
        else cur.lines.push(l)
      }
      if (cur.head.length || cur.lines.length) segs.push(cur)
      const used = ended < 0 ? dutyLines : dutyLines.slice(0, ended)
      dutyLines = used
      const lead = segs.length && !segs[0].head.length ? segs[0].lines : []
      const leadText = joinLines(lead).trim()
      if (leadText.length > 20) passages.push({ section_type: 'general_duties', rank_band: null, heading: 'Duties', body: leadText, pdf_page_start: lead[0].page, pdf_page_end: lead.at(-1).page })
      for (const sg of segs) {
        if (!sg.head.length) continue
        const first = fixWoHeader(sg.head[0].text.replace(/^\(\d\)\s*/, ''))
        const m = first.match(WO_GRADE_HEAD)
        const tokens = m[1].match(/WO1|CW[2-5]/g)
        const all = [{ ...sg.head[0], text: first.slice(m[0].length) }, ...sg.lines].filter(l => l.text)
        const text = joinLines(all).replace(/^must\s*[-–—]*\s*/i, '').trim()
        if (/does not apply/i.test(text) || text.length < 15) { ctx.skipped.push({ code: b.codes.join('/'), page: sg.head[0].page, why: 'grade band marked "does not apply" or empty', text: first.slice(0, 60) }); continue }
        passages.push({ section_type: 'rank_duties', rank_band: bandOf(tokens), heading: `Duties — ${m[1].replace(/\s+/g, '')}`, body: text, pdf_page_start: Math.min(...all.map(l => l.page)), pdf_page_end: Math.max(...all.map(l => l.page)), cumulative: /perform(?:s)? (?:the )?duties described in paragraph/i.test(text) })
      }
      if (!passages.length) issues.push('duties item produced no passages')
    }
    const used = dutyLines.length + (b.headingEnd - b.start)
    report.lineAccounting.duties += used; report.lineAccounting.skipped += (b.end - b.start) - used
    ctx.skipped.push({ code: b.codes.join('/'), page: lines[b.start].page, why: 'licensing, prerequisites, qualifications, SQI/ASI and grading items (requirements, not duties)', lines: (b.end - b.start) - used })
    for (const code of b.codes) {
      const c = chart.get(code)
      const titleMatch = b.headingText.match(new RegExp(code + '\\s*[—–-]{1,2}\\s*([^;(]+?)\\s*(?:[;(]|$|,\\s*\\d{3}[A-Z])'))
      if (!byCode.has(code)) byCode.set(code, [])
      byCode.get(code).push({ code, title: c?.title || (titleMatch ? titleMatch[1].trim() : null), grades: c ? [c.lo, c.hi] : null, heading: norm(b.headingText).slice(0, 200), startPage: lines[b.start].page, endPage: lines[b.end - 1].page, effective_from: mk.effective_from, rescinded_from: mk.rescinded_from, flags: mk.flags, passages: passages.map(p => ({ ...p })), sharedWith: b.codes.filter(c2 => c2 !== code) })
    }
    issues.forEach(msg => report.issues.push({ code: b.codes.join('/'), page: lines[b.start].page, msg }))
  }
  for (const [, list] of byCode) assignVersions(list)
  return { byCode, skipped: ctx.skipped, report, lines }
}


// ── officers (chapter 3) ─────────────────────────────────────────────────────

export function parseOfficerChart(pages) {
  const lines = flattenPages(pages)
  const chart = new Map()
  let lastChartPage = 0
  for (const l of lines) {
    const m = l.text.match(/^(\d{2}[A-Z]) (\d) ?[-–] ?(\d) (.+)$/)
    if (!m) continue
    chart.set(m[1], { code: m[1], lo: +m[2], hi: +m[3], page: l.page, title: m[4].replace(/\(\s*(?:del|add)[^)]*\)?/gi, '').trim().slice(0, 100), markers: parseMarkers(m[4]) })
    lastChartPage = Math.max(lastChartPage, l.page)
  }
  return { chart, lastChartPage, lines }
}

const OFFICER_HEADING = /^(?:[a-z]{1,2}|(?:\d+-)?\d+)\.\s+(.{2,110}?)\s*\((?:AOC\s+)?(\d{2}[A-Z](?:\s*(?:,|and|&|\/)\s*\d{2}[A-Z])*)\)(?:\.?\s*\([^)]*\))*\.?(?:\s+\S.*)?$/i
const OFFICER_LABEL = /^(?:\(\d\)|[a-z]\.?)?\s*(Educational [Rr]equirements|Restrictions?|Positions? coding|Description of duties|Special qualifications|Special grading of positions|Unique duty positions?|Skill identifiers|Physical demands|Description of positions|Functional area qualifications|Qualifications)\b/i
const BRANCH_HEADING = /^3\s*[-–—]\s*\d+/
// A lettered item that opens a different section (requirements, identifiers, the next AOC's heading) ends the item before it.
const OFFICER_SECTION_END = /^[a-z]{1,2}\s?\.\s+(?:Physical|Skill [Ii]dentifiers|Special personnel|AOC \d{2}[A-Z] (?:qualifications|skill)|Associated|Qualifications|.{2,100}\(\s*(?:AOC\s+)?\d{2}[A-Z]\s*\))/

export function importOfficerChapter(pages) {
  const { chart, lastChartPage, lines } = parseOfficerChart(pages)
  const prose = lines.filter(l => l.page > lastChartPage)
  const heads = []
  prose.forEach(l => {
    if (l.text.length > 170) return
    const m = l.text.match(OFFICER_HEADING)
    if (!m) return
    const codes = m[2].match(/\d{2}[A-Z]/g).filter(c => chart.has(c))
    if (codes.length) heads.push({ i: l.i, codes, title: m[1].trim(), page: l.page })
  })
  const branchStarts = prose.filter(l => BRANCH_HEADING.test(l.text)).map(l => l.i)
  const byCode = new Map()
  const report = { headings: heads.length, issues: [], gaps: [] }
  heads.forEach((h, n) => {
    const nextHead = n + 1 < heads.length ? heads[n + 1].i : lines.length
    const nextBranch = branchStarts.find(x => x > h.i) ?? lines.length
    const end = Math.min(nextHead, nextBranch)
    const sec = lines.slice(h.i + 1, end)
    const labelAt = (re) => sec.findIndex(l => re.test(l.text))
    const di = labelAt(/Description of duties/i)
    let unlabeled = false
    const passages = []
    if (di < 0 && sec.length && /^\(1\)\s/.test(sec[0].text) && !OFFICER_LABEL.test(sec[0].text)) {
      // A few sections (the nursing specialties) describe the specialty in an unlabeled first item.
      let de = sec.findIndex((l, k) => k > 0 && /^\(\d\)\s/.test(l.text)); if (de < 0) de = Math.min(sec.length, 20)
      const dl = sec.slice(0, de)
      const text = joinLines(dl).replace(/^\(1\)\s*/, '').trim()
      if (text.length > 60) { passages.push({ section_type: 'general_duties', rank_band: null, heading: 'Specialty description (unlabeled first item; the publication has no "Description of duties" label here)', body: text, pdf_page_start: dl[0].page, pdf_page_end: dl.at(-1).page, cumulative: false }); unlabeled = true }
    }
    if (di >= 0) {
      let de = sec.findIndex((l, k) => k > di && (OFFICER_LABEL.test(l.text) || OFFICER_SECTION_END.test(l.text)) && !/Description of duties/i.test(l.text))
      if (de < 0) de = Math.min(sec.length, di + 40)
      const dl = sec.slice(di, de)
      const text = joinLines(dl).replace(/^(?:\(?\d\)|[a-z]\.?)?\s*(?:AOC\s+\d{2}[A-Z]\s+)?Description of duties[.:]?\s*/i, '').trim()
      if (text.length > 30) passages.push({ section_type: 'general_duties', rank_band: null, heading: 'Description of duties', body: text, pdf_page_start: Math.min(...dl.map(l => l.page)), pdf_page_end: Math.max(...dl.map(l => l.page)), cumulative: false })
    }
    const gi = labelAt(/Special grading of positions/i)
    let gradeNote = null
    if (gi >= 0) {
      let ge = sec.findIndex((l, k) => k > gi && (OFFICER_LABEL.test(l.text) || OFFICER_SECTION_END.test(l.text))); if (ge < 0) ge = Math.min(sec.length, gi + 4)
      const gl = sec.slice(gi, ge)
      gradeNote = joinLines(gl).replace(/^(?:\(?\d\)|[a-z]\.?)?\s*Special grading of positions[.:]?\s*/i, '').trim()
      if (gradeNote && !/^none\.?$/i.test(gradeNote)) passages.push({ section_type: 'grades_authorized', rank_band: null, heading: 'Special grading of positions', body: gradeNote, pdf_page_start: gl[0].page, pdf_page_end: gl.at(-1).page, cumulative: false })
    }
    const ui = labelAt(/Unique duty positions?/i)
    if (ui >= 0) {
      let ue = sec.findIndex((l, k) => k > ui && (OFFICER_LABEL.test(l.text) || OFFICER_SECTION_END.test(l.text))); if (ue < 0) ue = Math.min(sec.length, ui + 40)
      const ul = sec.slice(ui, ue)
      const text = joinLines(ul).replace(/^(?:\(?\d\)|[a-z]\.?)?\s*Unique duty positions?[.:]?\s*/i, '').trim()
      if (text.length > 10) passages.push({ section_type: 'assignments', rank_band: null, heading: 'Unique duty positions', body: text, pdf_page_start: ul[0].page, pdf_page_end: ul.at(-1).page, cumulative: false })
    }
    const mk = parseMarkers(lines[h.i].text)
    for (const code of h.codes) {
      const c = chart.get(code)
      if (!byCode.has(code)) byCode.set(code, [])
      byCode.get(code).push({ code, title: c.title, grades: [c.lo, c.hi], heading: lines[h.i].text.slice(0, 160), startPage: lines[h.i].page, endPage: lines[end - 1]?.page ?? lines[h.i].page, effective_from: mk.effective_from, rescinded_from: mk.rescinded_from, flags: mk.flags, passages: passages.map(p => ({ ...p })), sharedWith: h.codes.filter(x => x !== code), hasDescription: di >= 0 || unlabeled })
    }
    if (di < 0 && !unlabeled) report.issues.push({ code: h.codes.join('/'), page: lines[h.i].page, msg: 'no "Description of duties" label in section' })
  })
  for (const [, list] of byCode) assignVersions(list)
  for (const [code] of chart) if (!byCode.has(code)) report.gaps.push(code)
  return { byCode, chart, report, lines }
}
