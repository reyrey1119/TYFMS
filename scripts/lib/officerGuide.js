// Parser for the DA PAM 600-3 officer branch / functional-area pamphlets: grade-by-grade development sections
// ("e. Lieutenant Colonel development.", "(2) Major.", "CPT").
//
// The pamphlets are written from no single template, so nothing is guessed: a run of grade headings that is in order
// (LT, CPT, MAJ, LTC, COL) is a candidate; the guide's manifest says which run belongs to which AOC codes, and every
// structural fact it cannot establish (a missing grade, a section that ends in a figure, several runs for several AOCs)
// is reported instead of imported. Same rules as every importer here: text as extracted, nothing rewritten.

import { createHash } from 'node:crypto'
import { joinLines } from './careerGuides.js'
import { ENUM, labelOf, splitItems, PROMOTION, PROMO_BODY, LABEL_TEXT, unknownLabel } from './guideAuto.js'

const sha = s => createHash('sha256').update(s).digest('hex')

const OFFICER_GRADES = [
  [/^(?:second |first )?lieutenants?$|^[12]?lt$/, 'O-1..O-2', 'LT'],
  [/^captains?$|^cpt$/, 'O-3', 'CPT'],
  [/^majors?$|^maj$/, 'O-4', 'MAJ'],
  [/^lieutenant colonels?$|^ltc$/, 'O-5', 'LTC'],
  [/^colonels?$|^col$/, 'O-6', 'COL'],
]
export const BAND_ORDER = ['O-1..O-2', 'O-3', 'O-4', 'O-5', 'O-6']

// "e. Lieutenant (LT) Development." -> { band, title }.  Warrant headings return { warrant: true } so they end an officer section.
// "g. Colonel development. The professional development objective ..." : an enumerated heading that shares its line with the first sentence.
export function gradeHeadingRunIn(text) {
  const m = text.match(/^((?:\(?[a-z]{1,3}[.)]|\(?\d+[.)])\s*(?:Second |First )?(?:Lieutenant Colonel|Lieutenant|Captain|Major|Colonel)s?(?:\s*\([A-Z0-9]{2,4}\))?(?:\s+development)?)\.\s+(\S.{20,})$/i)
  if (!m) return null
  const g = gradeHeading(m[1] + '.')
  return g && g.band ? { ...g, rest: m[2] } : null
}

export function gradeHeading(text) {
  if (text.length > 90) return null
  let t = text.replace(/^(?:\(?[a-z]{1,3}[.)]|\(?\d+[.)]|[ivx]+\.)\s*/i, '').trim()
  if (/\b(WO1|CW[2-5]|warrant officers?|chief warrant)\b/i.test(t) && /^(?:WO1|CW|warrant|chief warrant)/i.test(t)) return { warrant: true, title: t }
  t = t.replace(/\s*\([^)]*\)/g, ' ')                         // "(LT)", "(90A88)"
    .replace(/\s*[-–—]\s*(?:development|career).*$/i, '')
    .replace(/\s+(?:development|career development|phase|assignments?|education)\b[\s.:]*$/i, '')
    .replace(/[\s.:]+$/, '').toLowerCase().replace(/\s+/g, ' ').trim()
  for (const [re, band, abbr] of OFFICER_GRADES) if (re.test(t)) return { band, abbr, title: text.replace(/^(?:\(?[a-z]{1,3}[.)]|\(?\d+[.)]|[ivx]+\.)\s*/i, '').replace(/[\s.:]+$/, '').trim() }
  return null
}

// Runs of grade headings that step up through the grades.
export function findRuns(lines) {
  const heads = []
  lines.forEach((l, k) => {
    const g = gradeHeading(l.text) || gradeHeadingRunIn(l.text)
    if (!g) return
    // a bare "Major." in the middle of a sentence is not a heading: it must follow a line that ends a sentence/heading or be enumerated
    const prev = k ? lines[k - 1].text : ''
    const enumerated = ENUM.test(l.text) || /^\s*\(?[a-z0-9]{1,3}[.)]/.test(l.text)
    const bare = /^(Lieutenant|Captain|Major|Colonel|Lieutenant Colonel|LT|CPT|MAJ|LTC|COL)[.:]?$/i.test(l.text.trim())
    if (!g.warrant && !enumerated && !bare && !/(development|phase)\b/i.test(l.text)) return
    if (!g.warrant && bare && !(/[.:)]\s*$/.test(prev) || prev.length < 60)) return
    heads.push({ k, ...g })
  })
  const runs = []
  let cur = []
  for (const h of heads) {
    if (h.warrant) { if (cur.length) runs.push(cur); cur = []; continue }
    const last = cur.at(-1)
    if (last && BAND_ORDER.indexOf(h.band) <= BAND_ORDER.indexOf(last.band)) { runs.push(cur); cur = [] }
    cur.push(h)
  }
  if (cur.length) runs.push(cur)
  return { heads, runs }
}

const TYPE_FOR = { assignments: 'assignments', training: 'training', credentials: 'credentials', self_development: 'self_development', lifelong_learning: 'lifelong_learning', skills: 'skills', development: 'development' }

// Items of one grade section: reuse the enlisted guide's enumerator/label logic.
export function gradeItems(body, mk, gradeLabel, band, headingLine) {
  const { items, lead } = splitItems(body)
  if (lead.length) mk({ section_type: 'development', rank_band: band, heading: `${gradeLabel} — overview`, spanExtra: [headingLine] }, lead)
  for (const item of items) {
    const first = item.lines[0].text.replace(ENUM, '')
    if (PROMOTION.test(first) || PROMOTION.test(first.replace(LABEL_TEXT, '')) || PROMO_BODY.test(item.lines.slice(0, 3).map(l => l.text).join('\n'))) { mk({ section_type: 'promotion_criteria', rank_band: band, heading: `${gradeLabel} — promotion consideration` }, item.lines); continue }
    const m = first.match(/^[^.:]{2,70}?[.:]\s*/)
    const rest = m && labelOf(item.lines[0].text, true) || m && item.type === 'development' ? first.slice(m[0].length) : first
    const bodyLines = [{ ...item.lines[0], text: rest }, ...item.lines.slice(1)].filter(l => l.text)
    mk({ section_type: TYPE_FOR[item.type] || 'development', rank_band: band, heading: `${gradeLabel} — ${item.label}`.replace(/\s+/g, ' ') }, bodyLines)
  }
}

export { sha, joinLines, unknownLabel }
