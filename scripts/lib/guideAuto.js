// Generalized parser for DA PAM 600-25 career progression plans (enlisted CMF guides).
//
// The guides are written from a few templates that differ in numbering and heading style, so structure is found from
// the document's own headings, never from rank words in running text:
//   * "Chapter N. ..." headings (the number must be the next one in sequence),
//   * rank headings: a short line that is nothing but a rank phrase, optionally enumerated, with a trailing ":" or ".",
//     or standing alone after a line that ends a sentence,
//   * items inside a rank section start with a known label ("Institutional training", "Operational assignments", ...).
//
// Same rules as every importer here: text is stored as extracted; every in-scope line ends up in exactly one passage or
// is skipped with a reason; anything unexpected is flagged, never guessed. Admin-time only.

import { createHash } from 'node:crypto'
import { joinLines } from './careerGuides.js'

const sha = s => createHash('sha256').update(s).digest('hex')

// ── rank headings ────────────────────────────────────────────────────────────

const ENUM = /^(?:\(\d+\)\.?|\d+\s*[-–—]\s*\d+\.|\d+\.|\([a-z]\)\.?|[a-z]\)|[a-z]\.)\s*/
const ABBR = { pvt: ['private'], pv1: ['private'], pv2: ['private'], pfc: ['private'], spc: ['specialist'], cpl: ['corporal'], sgt: ['sergeant'], ssg: ['staff', 'sergeant'], sfc: ['sergeant', 'first', 'class'], msg: ['master', 'sergeant'], '1sg': ['first', 'sergeant'], sgm: ['sergeant', 'major'], csm: ['command', 'sergeant', 'major'], privates: ['private'], sergeants: ['sergeant'], corporals: ['corporal'], specialists: ['specialist'] }

// Canonical word list of a rank phrase: lower-case, punctuation and grade tags removed, abbreviations expanded, repeats collapsed.
function rankTokens(text) {
  let t = text.toLowerCase().replace(/[–—]/g, '-')
  // parenthetical groups, also nested: "(PVT – SPC/CPL) (Skill Level (SL) 1)"
  for (let i = 0; i < 4 && /\([^()]*\)/.test(t); i++) t = t.replace(/\([^()]*\)/g, ' ')
  t = t.replace(/skill levels?\s*\d(\s*(and|-|\/)\s*\d)?/g, ' ').replace(/\be-?\d\b/g, ' ')
  t = t.replace(/[–—\-\/.,:;]+/g, ' ')
  let words = t.split(/\s+/).filter(w => w && w !== 'and' && w !== 'or' && w !== 'the' && w !== 'e' && !['active', 'guard', 'reserve', 'ra', 'agr', 'regular', 'army'].includes(w))
  words = words.flatMap(w => ABBR[w] || [w])
  // "staff sergeant staff sergeant" -> "staff sergeant"
  for (let len = 1; len <= 4; len++) {
    for (let k = 0; k + 2 * len <= words.length; k++) {
      if (words.slice(k, k + len).join(' ') === words.slice(k + len, k + 2 * len).join(' ')) { words.splice(k + len, len); k-- }
    }
  }
  return words.join(' ')
}
const RANK_PHRASES = [
  [/^private( specialist)?( corporal)?$/, 'E-1..E-4'],
  [/^specialist( corporal)?$/, 'E-1..E-4'],
  [/^corporal sergeant$/, 'E-4..E-5'],
  [/^sergeant$/, 'E-5'],
  [/^staff sergeant$/, 'E-6'],
  [/^sergeant first class$/, 'E-7'],
  [/^master sergeant( first sergeant)?$/, 'E-8'],
  [/^first sergeant( master sergeant)?$/, 'E-8'],
  [/^sergeant major( command sergeant major)?$/, 'E-9'],
  [/^command sergeant major( sergeant major)?$/, 'E-9'],
]

export function rankHeading(text, prevText = '') {
  if (text.length > 90) return null
  if (/\b(reserve component|RC only|ARNG|USAR|national guard)\b/i.test(text)) return null   // component-specific section, not this guide's main rank sections
  // "4-6. SSG - Intelligence Sergeant (SL3)" — an enumerated heading that leads with the grade abbreviation
  const ab = text.match(/^(?:\d+\s*-\s*\d+\.|\d+\.|\([a-z0-9]+\)|[a-z]\.)\s*(SPC|PVT|SGT|SSG|SFC|MSG|1SG|SGM|CSM)(?:\s*\/\s*[A-Z0-9]+)?(?:\s*[-–—]\s*|\s+)[A-Z]\S*.{0,70}\(\s*SL\s*\d\s*\)\s*$/)
  if (ab) { const hit = RANK_PHRASES.find(([re]) => re.test(rankTokens(ab[1]))); if (hit) return { band: hit[1], title: text.replace(ENUM, '').replace(/\.$/, '').trim() } }
  // "4 - 7. MOS 38R3O Civil Reconnaissance Sergeant (SSG)."  — an MOS skill-level heading that names the grade in parentheses
  const sl = text.replace(ENUM, '').match(/^MOS\s+(\d{2}[A-Z])\d\s?[O0]\b.{0,60}\(\s*(SGT|SSG|SFC|MSG|1SG|MSG\/1SG|SGM|CSM|SGM\/CSM|SPC|PVT[^)]{0,20}|CPL)\s*\)\.?$/i)
  if (sl && ENUM.test(text)) {
    const hit = RANK_PHRASES.find(([re]) => re.test(rankTokens(sl[2])))
    if (hit) return { band: hit[1], title: text.replace(ENUM, '').replace(/\.$/, '').trim(), mos: sl[1].toUpperCase() }
  }
  const enumerated = ENUM.test(text)
  const body0 = text.replace(ENUM, '')
  const PREFIX = /^(?:CMF\s*\d+[A-Z]?|\d{2}[A-Z])\s+(?=[A-Za-z])/
  const mosPrefixed = PREFIX.test(body0)
  const body = body0.replace(PREFIX, '')   // some guides prefix the MOS ("19C Sergeant")
  const punct = /[.:]\s*$/.test(body)
  const phrase = rankTokens(body)
  const hit = RANK_PHRASES.find(([re]) => re.test(phrase))
  if (!hit) return null
  // A bare word like "Sergeant" at the start of a wrapped line is not a heading.
  const afterSentence = !prevText || endsSentenceOrHeading(prevText) || /^(chapter|[a-z]\.|\(\d+\))\s/i.test(prevText)
  // A multi-word rank phrase that is the whole line ("Sergeant First Class") is a heading even after an unpunctuated line;
  // a lone "Sergeant" is not (it is too often the wrapped end of a sentence).
  const multiWord = (phrase.split(' ').length >= 2 && !/^corporal sergeant$/.test(phrase)) || /\(\s*(SGT|SSG|SFC|MSG|1SG|SGM|CSM|SPC|CPL)(\s*\/\s*[A-Z0-9-]+)?\s*\)\s*$/.test(body)
  if (enumerated || mosPrefixed || punct && afterSentence || afterSentence && !/[a-z]\.$/.test(prevText) || multiWord && /^[A-Z]/.test(body)) return { band: hit[1], title: body.replace(/[.:]\s*$/, '').trim(), single: phrase.split(' ').length === 1 }
  return null
}

// The previous line ends a sentence, or is itself a short enumerated heading ("c. Goals for Development").
function endsSentenceOrHeading(prev) {
  return /[.:)]\s*$/.test(prev) || (ENUM.test(prev) && prev.length < 80) || (prev.length < 40 && /^[A-Z]/.test(prev) && !/[,;]$/.test(prev))
}

// "Private-Specialist/Corporal (14E1O). Soldiers at this level ..." — the heading and its first sentence share a line.
export function rankHeadingRunIn(text, prevText = '') {
  // A wrapped line that starts with "Sergeant. ..." continues a sentence; a heading follows the end of one.
  const m = text.replace(ENUM, '').match(/^([A-Za-z][A-Za-z\s\/\-–—1]{2,60}?)\s*(\([^)]{1,40}\))?\s*[.:]\s+(\S.{6,})$/)
  if (!m) return null
  // an enumerator, or a skill-level code in parentheses ("(14G3O)"), is enough evidence on its own
  const strong = ENUM.test(text) || /\(\s*\d{2}[A-Z]\d\s?[O0]\s*\)/.test(m[2] || '')
  if (m[3].length < 13 && !strong) return null   // a short remainder ("See MOS 12A.") only counts after an enumerator or skill-level code
  if (prevText && !strong && !endsSentenceOrHeading(prevText)) return null
  const head = rankHeading(`${m[1]}.`, '')
  if (!head) return null
  return { band: head.band, title: m[1].trim(), rest: m[3] }
}

// ── labels inside a rank section ─────────────────────────────────────────────

const LABELS = [
  [/^(operational|generating)\s+(assignments?|authorizations?|positions?)\b/i, 'assignments'],
  [/^broadening(\s+(assignments?|positions?))?\b/i, 'assignments'],
  [/^(broadening\s*\/\s*special|special)\s+assignments?\b/i, 'assignments'],
  [/^(critical|key)\s+(leader\s+)?(developmental|development|designated)\b/i, 'assignments'],
  [/^career developmental\b/i, 'assignments'],
  [/^(kd|operating|nominative|mission critical|mission essential|developmental)\s+(assignments?|positions?|billets?)\b/i, 'assignments'],
  [/^(special\s*\/\s*nominative|nominative)\s+(opportunit\w*|assignments?|billets?)\b/i, 'assignments'],
  [/^(OF|GF|operating force|generating force)\s+(assignments?|positions?)\b/i, 'assignments'],
  [/^assignments?\b/i, 'assignments'],
  [/^(institutional|additional)\s+training\b/i, 'training'],
  [/^(functional courses?|troop schools?|professional military education)\b/i, 'training'],
  [/^training\b/i, 'training'],
  [/^additional duties\b/i, 'development'],
  [/^(military|functional|required|recommended|professional military)\s+(training|education|courses?)\b/i, 'training'],
  [/^suggested (correspondence )?courses?\b/i, 'training'],
  [/^(army )?credential(ing)?\s*(opportunit|\/|s\b|:)/i, 'credentials'],
  [/^(civilian )?(credentials?|certifications?)\b/i, 'credentials'],
  [/^star credential/i, 'credentials'],
  [/^lifelong learning\b/i, 'lifelong_learning'],
  [/^(self-?development|civilian education|army career degree|professional (clubs?|organizations?|reading|development)|competitive events?)\b/i, 'self_development'],
  [/^(skills?\s*[.:]|core competenc\w+|knowledge,? skills)/i, 'skills'],
  [/^(special awards?|goals? for development)\b/i, 'development'],
]
// Labels that only identify the type of an item that is already delimited by its enumerator ("j) Education. ..."); as free-standing
// lines they would also match wrapped text, so they are not used to start items in guides without enumerators.
const ENUM_ONLY_LABELS = [
  [/^(military\s+)?education\s*[.:]/i, 'training'],
  [/^developmental\s*\/\s*broadening\b/i, 'assignments'],
]
const POINTER_PARA = /(professional|talent|career)\s+development\s+model|reserve\s+components?|national guard|\bUSAR\b|\bARNG\b|career map|^references?$/i
const PROMOTION = /^(along\s+with\s+evaluating|promotion (selection|board|consideration)|to be (most|highly) qualified|(unqualified|fully qualified|highly qualified|most qualified|not (fully )?qualified)\b|promotion indicators?\b|(most|highly|fully) qualified indicators?\b)/i
// An item whose text opens with the board-qualification list ((1) Most Qualified, (2) Highly Qualified ...) is promotion criteria.
const PROMO_BODY = /(^|\n)(\(\d\)|\d\.)\s*(Most|Highly|Fully)\s+Qualified\b/i
const LABEL_TEXT = /^([^.:]{2,70}?)\s*[.:]\s*/

function labelOf(text, enumerated = false) {
  const t = text.replace(ENUM, '')
  for (const [re, type] of enumerated ? [...ENUM_ONLY_LABELS, ...LABELS] : LABELS) { const m = t.match(re); if (m) { const lm = t.match(LABEL_TEXT); return { type, label: (lm ? lm[1] : m[0]).trim() } } }
  return null
}

// ── chapters ─────────────────────────────────────────────────────────────────

// A chapter title can wrap onto a short second line ("... Civil" / "Affairs Medical Sergeant (38W)").
function wrapsTitle(title, next) {
  return !/[.:]\s*$/.test(title) && next.length < 60 && /^[A-Z]/.test(next) && !/[.:]\s*$/.test(next)
    && !/^(Major|Prerequisite|Goals?|Proponent|Introduction|The |This |Soldiers|NCOs|Chapter|\d+\s*-\s*\d+|\([a-z0-9]+\)|[a-z]\.\s)/.test(next) && /\(\d{2}[A-Z]\)\s*$|\bSergeant\b|Specialist/.test(next)
}

export function findChapters(lines, fixups = []) {
  const out = []
  let last = 0
  lines.forEach((l, k) => {
    // a known typo in the document's own chapter numbering, recorded in the guide's manifest
    const fx = fixups.find(f => new RegExp(f.match).test(l.text))
    const m = fx ? [l.text, String(fx.n), fx.title] : l.text.match(/^Chapter\s+(\d+)(?![-–]\d)\s*[.:]?\s*(.*)$/)
    if (!m) return
    const n = Number(m[1])
    // A second "Chapter 1" means the first run was a table of contents (CMF 46); start over from the real chapters.
    if (n === 1 && out.length) { out.length = 0; last = 0 }
    const heading = true || /^(MOS)/.test((m[2] || '').trim()) && !/^(for|of|to|and|in|above|below|paragraph|section|table|figure)\b/i.test((m[2] || '').trim())
    // The next number, or (when the document skips numbers) one of the next three if the text reads like a chapter title.
    const crossRef = /^(for|of|to|and|in|above|below|paragraph|section|table|figure|on|at|by|with|is|are|as)\b/i.test((m[2] || '').trim())
    if (crossRef || !(n === last + 1 || (n > last + 1 && n <= last + 3 && heading))) return
    last = n
    let title = m[2]
    let headingEnd = k + 1
    // "Chapter 4" / "Career Management ..." — the title can be on the next line
    if (!title.trim() && lines[k + 1] && lines[k + 1].text.length < 110 && !/^Chapter\s+\d/.test(lines[k + 1].text)) { title = lines[k + 1].text; headingEnd = k + 2 }
    // wrapped heading ("... self-development, by" / "rank")
    while (headingEnd < lines.length && headingEnd < k + 3 && (/(,|\bby|\band|\bof|\bfor|\bthe|\bin)\s*$/i.test(title) || wrapsTitle(title, lines[headingEnd].text))) { title += ' ' + lines[headingEnd].text; headingEnd++ }
    out.push({ n, k, headingEnd, title: title.trim() })
  })
  out.forEach((c, i) => { c.end = i + 1 < out.length ? out[i + 1].k : lines.length })
  return out
}

const SKIP_TITLE = /(professional|talent|career) development model|reserve component|reserve components|^duties\b|^transformation\b|^adaptation\b|career developmental position|^mos [0-9]{2}[a-z] professional development/i
export function classifyChapter(c) {
  const codes = [...new Set([...(c.title.match(/\b\d{2}[A-Z]\b/g) || []), ...[...c.title.matchAll(/\b(\d{2}[A-Z])\d[OP0]\b/g)].map(m => m[1])])]
  // Pointer chapters (a figure, a reserve-component note, a short overview) are short. A long chapter with the same kind of title
  // carries real text (92Z's "professional development model", 88U's "(Reserve Component ...)") and is classified by its content.
  const long = (c.end - c.k) > 40
  if (SKIP_TITLE.test(c.title) && !(long && codes.length)) return { kind: 'skip', reason: /reserve/i.test(c.title) ? 'Reserve Component chapter: component-specific text is not shown because the app has no component choice' : /model/i.test(c.title) ? 'professional/talent development model: a figure, no text to import' : 'CMF-wide overview, not a rank or MOS section' }
  if (codes.length) return { kind: 'mos', codes }
  if (/\bby rank\b|self-?development|career management/i.test(c.title)) return { kind: 'cmf-rank' }
  return { kind: 'skip', reason: 'not an MOS chapter and not rank guidance' }
}

// ── passages ─────────────────────────────────────────────────────────────────

function pageSpan(lines) { return lines.length ? [Math.min(...lines.map(l => l.page)), Math.max(...lines.map(l => l.page))] : [null, null] }

export function splitRankSections(chapterLines, explicit = null) {
  const heads = []
  // A guide manifest can name the rank headings of a nonstandard chapter outright: [{ match: regex, band, title? }].
  if (explicit) {
    chapterLines.forEach((l, k) => {
      const hit = explicit.find(e => new RegExp(e.match).test(l.text))
      if (hit) heads.push({ k, band: hit.band, title: l.text.replace(ENUM, '').replace(/[.:]\s*$/, '').trim(), enumerated: true })
    })
    heads.dropped = 0; heads.strongDropped = []; heads.perMos = false
    return heads
  }
  chapterLines.forEach((l, k) => {
    const prev = k > 0 ? chapterLines[k - 1].text : ''
    const r = rankHeading(l.text, prev)
    if (r) { heads.push({ k, ...r, enumerated: ENUM.test(l.text) }); return }
    const run = rankHeadingRunIn(l.text, prev)
    if (run) heads.push({ k, band: run.band, title: run.title, rest: run.rest, enumerated: ENUM.test(l.text) })
  })
  // Within one chapter the rank sections run in order, once each. The longest in-order run of candidates is the set of real
  // headings; any other line that looks like one (a sub-item, a cross-reference) is body text. The count is reported.
  // Skill-level headings that name their own MOS ("MOS 38R3O ...") are ordered separately for each MOS.
  const start = band => Number(band.match(/E-(\d)/)[1])
  let wrapped = heads.filter((h, i) => !(i > 0 && h.band === heads[i - 1].band && h.k === heads[i - 1].k + 1))
  // When the chapter's real headings are enumerated, a bare "Sergeant." line is a sub-item, not a heading.
  if (wrapped.filter(h => h.enumerated).length >= 3) wrapped = wrapped.filter(h => h.enumerated || h.rest || !h.single)
  const groups = new Map()
  for (const h of wrapped) { const key = h.mos || ''; if (!groups.has(key)) groups.set(key, []); groups.get(key).push(h) }
  const kept = []
  for (const [, g] of groups) {
    const n = g.length
    const best = new Array(n).fill(1), prev = new Array(n).fill(-1)
    // numbered-paragraph headings ("24–4. Sergeant Major (SGM)", "24–5. Command Sergeant Major (CSM)") may repeat a grade: two sections
    const isNM = h => /^\d+\s*[-–—]\s*\d+\./.test(chapterLines[h.k].text)
    const stepsUp = (a, b) => start(a.band) < start(b.band) || (start(a.band) === start(b.band) && isNM(a) && isNM(b))
    for (let i = 0; i < n; i++) for (let j = 0; j < i; j++) if (stepsUp(g[j], g[i]) && best[j] + 1 > best[i]) { best[i] = best[j] + 1; prev[i] = j }
    let end = 0
    for (let i = 1; i < n; i++) if (best[i] > best[end]) end = i
    const run = []
    for (let i = n ? end : -1; i >= 0; i = prev[i]) run.unshift(g[i])
    kept.push(...run)
  }
  kept.sort((a, b) => a.k - b.k)
  kept.dropped = heads.length - kept.length
  // A full-line heading that was dropped (out of order or repeated) means the chapter's structure is not what the parser assumes.
  // A discarded heading is only ambiguous if it goes BACK in rank relative to the nearest heading before it (a second set of
  // rank sections); a repeat of the same rank (a sub-heading such as "SPC/CPL.") is part of that rank's text.
  kept.strongDropped = wrapped.filter(h => !h.rest && !kept.includes(h)).filter(h => {
    const before = kept.filter(x => x.k < h.k).at(-1)
    return before && start(h.band) < start(before.band)
  }).map(h => ({ line: h.title, band: h.band }))
  // Dropped lines after the first real heading that sit under a DIFFERENT rank than the nearest kept heading before them: a heading
  // may have been missed there. (Same-rank repeats are sub-headings of that rank; lines before the first heading are preamble.)
  const firstK = kept.length ? kept[0].k : Infinity
  kept.crossBandDropped = wrapped.filter(h => !kept.includes(h) && h.k > firstK).filter(h => { const before = kept.filter(x => x.k < h.k).at(-1); return before && before.band !== h.band }).length
  // The chapter's own numbered paragraphs ("2–3. Goals for development", "2–4. Professional Development Model"): the rank sections
  // are either those paragraphs themselves ("7–8. Master Sergeant") or lettered items inside one of them. A numbered paragraph that
  // follows the grade sections is not part of the last grade's text.
  kept.terminators = []
  const paras = []
  chapterLines.forEach((l, k) => { const m = l.text.match(/^(\d+)\s*[-–—]\s*(\d+)\.\s+([A-Z][^.]{2,80})/); if (m) paras.push({ k, n: +m[1], title: m[3].trim() }) })
  const modeN = [...new Set(paras.map(x => x.n))].sort((a, b) => paras.filter(x => x.n === b).length - paras.filter(x => x.n === a).length)[0]
  if (kept.length && paras.filter(x => x.n === modeN).length >= 3) {
    for (const t of paras) if (t.n === modeN && t.k > kept[0].k && !kept.some(h => h.k === t.k) && !rankHeading(chapterLines[t.k].text, chapterLines[t.k - 1]?.text || '') && !/^(See|Refer|In addition|Continue|Note)\b/.test(t.title)) kept.terminators.push({ k: t.k, title: t.title })
  }
  kept.perMos = groups.size > 1 || (groups.size === 1 && !groups.has(''))
  return kept
}

function topLevelStyle(bodyLines) {
  const first = bodyLines.find(l => ENUM.test(l.text))
  if (!first) return 'none'
  if (/^\([a-z]\)/.test(first.text)) return 'paren-letter'
  if (/^[a-z]\)/.test(first.text)) return 'rparen-letter'
  if (/^\(\d+\)/.test(first.text)) return 'paren-number'
  if (/^[a-z]\./.test(first.text)) return 'dot-letter'
  return 'dot-number'
}

// Items of a rank section. If the section is enumerated, top-level items are the enumerators in sequence; otherwise an item
// starts at a line with a known label. Text before the first item is the section's overview.
function nextInSeq(style, prev, cur) {
  if (style === 'paren-letter' || style === 'dot-letter' || style === 'rparen-letter') { const a = prev.charCodeAt(0), b = cur.charCodeAt(0); return b > a && b <= a + 2 }
  return Number(cur) > Number(prev) && Number(cur) <= Number(prev) + 3
}
function enumOf(text, style) {
  const m = style === 'rparen-letter' ? text.match(/^([a-z])\)\s+/) : style === 'paren-letter' ? text.match(/^\(([a-z])\)\s+/) : style === 'dot-letter' ? text.match(/^([a-z])\.\s+/) : style === 'paren-number' ? text.match(/^\((\d+)\)\s+/) : style === 'dot-number' ? text.match(/^(\d+)\.\s+/) : null
  return m ? m[1] : null
}
function splitItems(body) {
  const style = topLevelStyle(body)
  const items = []
  const lead = []
  let prev = style.endsWith('letter') ? '`' : '0'
  // A promotion-indicators item ends in nested lists ((1) Most qualified ... (a)..(j), (2) Highly qualified ... (a)..) whose
  // letters can continue the outer sequence; everything up to the next labeled item belongs to it.
  let inPromo = false
  for (const l of body) {
    const lab = labelOf(l.text, style !== 'none')
    const e = style === 'none' ? null : enumOf(l.text, style)
    if (inPromo && items.length && !(lab && e && !PROMOTION.test(l.text.replace(ENUM, '')))) { items.at(-1).lines.push(l); continue }
    inPromo = false
    if (e && nextInSeq(style, prev, e)) {
      if (PROMOTION.test(l.text.replace(ENUM, ''))) inPromo = true
      prev = e
      items.push({ ...(lab || { type: 'development', label: unknownLabel(l.text) }), lines: [l] })
    } else if (style === 'none' && lab) {
      items.push({ ...lab, lines: [l] })
    } else if (items.length) items.at(-1).lines.push(l)
    else lead.push(l)
  }
  return { items, lead }
}
function unknownLabel(text) {
  const t = text.replace(ENUM, '')
  const m = t.match(LABEL_TEXT)
  // An item with no label of its own is shown under a plain heading, never under a truncated sentence fragment.
  return (m ? m[1] : 'Additional guidance').trim()
}

// A heading can be glued to the end of the previous line by the text layer ("... complete SSD Level IV.e. Master sergeant (MSG)").
const GLUED = /(?<=\S[.)])(?=(?:\([a-z0-9]+\)|[a-z]\.|\d+\.)\s*(?:Private|Corporal|Sergeant|Staff [Ss]ergeant|Master [Ss]ergeant|First [Ss]ergeant|Sergeant [Ff]irst [Cc]lass|Sergeant [Mm]ajor)\b)/
// A label that starts mid-line after a sentence ("... See TADECIDE (...). Army Credentialing Opportunities. Credentialing ...").
const INLINE_LABEL = /(?<=[.)]\s)(?=(?:Army Credentialing Opportunities|Army Career Degree|Suggested correspondence courses|Additional training|Special assignments|Self-development)\s*[.:]\s)/
// A heading that starts in the middle of a line after a label that ends without a period ("... See GI to Jobs COOL Website (f) Sergeant Major/Command Sergeant Major. ...").
const MIDLINE_HEAD = /\s(?=\((?:[a-z]|\d+)\)\s*(?:Private|Specialist|Corporal|Sergeant|Staff Sergeant|Master Sergeant|First Sergeant|Command Sergeant Major|Sergeant Major)(?:[ \/-][A-Za-z\/ ]{0,40})?\.(?:\s+[A-Z]|$))/
export function splitGluedHeadings(lines) {
  const out = []
  for (const l of lines) {
    const mid = l.text.search(MIDLINE_HEAD)
    if (mid > 20) { out.push({ ...l, text: l.text.slice(0, mid).trimEnd() }, { ...l, text: l.text.slice(mid + 1) }); continue }
    let at = l.text.search(GLUED)
    if (at > 3) { out.push({ ...l, text: l.text.slice(0, at) }, { ...l, text: l.text.slice(at) }); continue }
    at = l.text.search(INLINE_LABEL)
    if (at > 12) { out.push({ ...l, text: l.text.slice(0, at).trimEnd() }, { ...l, text: l.text.slice(at) }); continue }
    out.push(l)
  }
  return out
}

export function parseGuideAuto({ lines, source, chapterOverrides = {}, excludeCodes = [], chapterFixups = [], virtualChapters = null }) {
  const indexed = splitGluedHeadings(lines).map((l, i) => ({ ...l, i }))
  const consumed = new Array(lines.length).fill(null)
  const report = { chapters: [], skippedChapters: [], flags: [], unassigned: [], cmfWideAttachedTo: [] }
  const passages = []
  // Guides that are not written in numbered chapters (CMF 40, 51) are cut where the manifest says; each cut starts at the
  // first line after the previous one that matches. The manifest also fixes the kind, MOS codes and explicit rank headings.
  let chapters
  if (virtualChapters) {
    chapters = []
    let from = 0
    for (const v of virtualChapters) {
      const k = indexed.findIndex((l, i) => i >= from && new RegExp(v.match).test(l.text))
      if (k < 0) { report.flags.push(`virtual chapter "${v.title}": start line not found`); continue }
      chapters.push({ n: v.n, k, headingEnd: k + 1, title: v.title }); from = k + 1
    }
    chapters.forEach((c, i) => { c.end = i + 1 < chapters.length ? chapters[i + 1].k : indexed.length })
    // text before the first cut (introduction, duties, transformation) is not imported from here
    for (const l of indexed.slice(0, chapters[0]?.k ?? 0)) consumed[l.i] = 'before-first-section: not rank guidance'
    virtualChapters.forEach(v => { chapterOverrides = { ...chapterOverrides, [v.n]: { kind: v.kind, codes: v.codes, reason: v.reason, rankHeadings: v.rankHeadings } } })
  } else chapters = findChapters(indexed, chapterFixups)
  const mosCodes = []
  const plans = []
  for (const c of chapters) {
    const plan = { c, ...classifyChapter(c), ...(chapterOverrides[c.n] || {}) }
    // Appendices at the end of a chapter ("Appendix A – Assignments", "Appendix B1 – ...") are not part of the last rank section;
    // each starts its own section, and only the one about assignments is imported.
    const apIdx = plan.kind === 'skip' ? [] : indexed.map((l, k) => k >= c.headingEnd && k < c.end && /^Appendix\s+[A-Z]\d?(\s*[-–—:]\s*\S|\s+[A-Z][a-z])/.test(l.text) ? k : -1).filter(k => k >= 0)
    if (apIdx.length) {
      plans.push({ ...plan, c: { ...c, end: apIdx[0] } })
      apIdx.forEach((ak, ai) => {
        const title = indexed[ak].text
        const aend = ai + 1 < apIdx.length ? apIdx[ai + 1] : c.end
        plans.push({ c: { n: `${c.n}-app${ai + 1}`, k: ak, headingEnd: ak + 1, end: aend, title }, kind: /assignment/i.test(title) ? 'appendix' : 'skip', codes: plan.codes, reason: 'appendix that is not about assignments by rank', attachTo: plan.kind === 'mos' ? plan.codes : null })
      })
    } else plans.push(plan)
  }
  for (const p of plans) if (p.kind === 'mos') mosCodes.push(...p.codes)
  const uniqueMos = [...new Set(mosCodes)].filter(c => !excludeCodes.includes(c))

  let sort = 0
  const mk = (ctx, attrs, lns) => {
    const text = joinLines(lns)
    if (!text.trim()) return
    const [p1, p2] = pageSpan([...(attrs.spanExtra || []), ...lns])
    passages.push({
      occupation_code: ctx.code, occupation_title: ctx.title, branch: 'Army', personnel_category: 'enlisted',
      section_type: attrs.section_type, rank_band: attrs.rank_band ?? null, components: null, heading: attrs.heading ?? null,
      chapter: ctx.chapterTitle, body: text, pdf_page_start: p1, pdf_page_end: p2, printed_page: null, sort_order: sort++, body_sha256: sha(text),
    })
    if (ctx.primary) for (const l of lns) consumed[l.i] = consumed[l.i] ? `${consumed[l.i]}+p` : 'p'
  }
  const mark = (l, why) => { consumed[l.i] = consumed[l.i] ? `${consumed[l.i]}+${why}` : why }

  function parseRankChapter(ctxBase, chapterLines, codes, kindLabel, explicit = null) {
    const heads = splitRankSections(chapterLines, explicit)
    const preamble = chapterLines.slice(0, heads.length ? heads[0].k : chapterLines.length)
    return { heads, preamble }
  }

  for (const plan of plans) {
    const { c } = plan
    const chapterLines = indexed.slice(c.headingEnd, c.end)
    const headingLines = indexed.slice(c.k, c.headingEnd)
    if (plan.kind === 'skip') { report.skippedChapters.push({ chapter: c.title.slice(0, 100), pdfPages: pageSpan(indexed.slice(c.k, c.end)).join('-'), reason: plan.reason }); continue }
    // The title names the MOS; the text must agree (31's "MOS 31B Professional Development Model" chapter is really 31D).
    if (plan.kind === 'mos' && !chapterOverrides[c.n]) {
      const headText = chapterLines.slice(0, 60).map(l => l.text).join(' ')
      const own = 0
      // the prerequisites sentence names the MOS the chapter is really about ("All Soldiers entering MOS 31D must ...")
      const mentioned = new Set([...headText.matchAll(/(?:entering|initial award of|award of|prerequisites?[^.]{0,30}for)\s+MOS\s+(\d{2}[A-Z])\b/gi)].map(m => m[1]).filter(code => !plan.codes.includes(code)))
      if (own === 0 && mentioned.size) {
        report.flags.push(`chapter ${c.n}: the title names ${plan.codes.join('/')} but the text is about ${[...mentioned].join('/')}; not imported`)
        report.skippedChapters.push({ chapter: c.title.slice(0, 100), pdfPages: pageSpan(indexed.slice(c.k, c.end)).join('-'), reason: `title/content mismatch (text is about ${[...mentioned].join(', ')})` })
        for (const l of indexed.slice(c.k, c.end)) mark(l, 'title/content mismatch')
        continue
      }
    }
    for (const l of headingLines) mark(l, 'chapter-heading')
    const targets = ((plan.kind === 'mos' || plan.kind === 'appendix') && plan.codes ? plan.codes : uniqueMos).filter(c => !excludeCodes.includes(c))
    if (!targets.length) {
      if (plan.kind === 'mos' || plan.kind === 'appendix') { report.skippedChapters.push({ chapter: c.title.slice(0, 100), pdfPages: pageSpan(indexed.slice(c.k, c.end)).join('-'), reason: 'MOS imported from a separately reviewed source or excluded in the guide manifest' }); for (const l of indexed.slice(c.k, c.end)) mark(l, 'excluded MOS'); continue }
      report.flags.push(`chapter ${c.n}: rank guidance but no MOS chapter in this guide to attach it to`); for (const l of chapterLines) mark(l, 'unattached'); continue
    }
    let { heads, preamble } = parseRankChapter(null, chapterLines, targets, null, plan.rankHeadings || null)
    // A chapter that holds several separate by-rank lists (professional military education by rank, then publications by rank),
    // with ordinary paragraphs in between, is cut into those lists by the guide's manifest. The text between the lists is kept
    // as unranked general guidance, never as part of a rank.
    // A chapter that is about one grade only (MOS 35Z5O for MSG): its goals-for-development text is that grade's section.
    if (plan.singleBand) {
      const gk = chapterLines.findIndex(l => /^(?:\d+\s*[-–]\s*\d+\.\s*)?goals? for development\b/i.test(l.text))
      if (gk < 0) report.flags.push(`chapter ${c.n}: no "goals for development" line for the single-grade chapter`)
      else { heads = [{ k: gk, band: plan.singleBand, title: plan.bandTitle || c.title, enumerated: true }]; heads.dropped = 0; heads.strongDropped = []; heads.crossBandDropped = 0; preamble = chapterLines.slice(0, gk) }
    }
    if (plan.runs) {
      heads = []; let cursor = 0, firstStart = null
      for (const r of plan.runs) {
        const a = chapterLines.findIndex((l, i) => i >= cursor && new RegExp(r.from).test(l.text))
        if (a < 0) { report.flags.push(`chapter ${c.n}: list "${r.label}" start line not found`); continue }
        let b = r.to ? chapterLines.findIndex((l, i) => i > a && new RegExp(r.to).test(l.text)) : -1
        if (b < 0) b = chapterLines.length
        if (firstStart === null) firstStart = a
        else if (a > cursor) heads.at(-1).gapAfter = { lines: chapterLines.slice(cursor, a), heading: plan.gapHeading || 'General guidance' }
        const hs = splitRankSections(chapterLines.slice(a, b), r.rankHeadings || null)
        for (const h of hs) heads.push({ ...h, k: h.k + a, runLabel: r.label })
        if (hs.length) heads.at(-1).end = b
        cursor = b
      }
      if (heads.length && cursor < chapterLines.length) heads.at(-1).gapAfter = { lines: chapterLines.slice(cursor), heading: plan.gapHeading || 'General guidance' }
      preamble = chapterLines.slice(0, firstStart ?? chapterLines.length)
      heads.dropped = 0; heads.strongDropped = []; heads.crossBandDropped = 0
    }
    const summary = { chapter: c.n, title: c.title.slice(0, 90), kind: plan.kind, codes: targets, ranks: heads.map(h => h.band), droppedHeadings: heads.dropped || 0, crossBandDropped: heads.crossBandDropped || 0, ambiguous: heads.strongDropped || [], passages: 0, flags: 0 }
    if (!heads.length) { report.flags.push(`chapter ${c.n} (${c.title.slice(0, 50)}): no rank headings found`); summary.flags++ }
    const order = ['E-1..E-4', 'E-4..E-5', 'E-5', 'E-6', 'E-7', 'E-8', 'E-9']
    const idxs = heads.map(h => order.indexOf(h.band))
    for (let i = 1; i < idxs.length; i++) if (idxs[i] - idxs[i - 1] > 1 && !(order[idxs[i - 1]] === 'E-1..E-4' && order[idxs[i]] === 'E-5')) { report.flags.push(`chapter ${c.n} (${c.title.slice(0, 40)}): rank sequence skips from ${order[idxs[i - 1]]} to ${order[idxs[i]]}`); summary.flags++ }
    if ((heads.dropped || 0) > 0) { report.flags.push(`chapter ${c.n} (${c.title.slice(0, 40)}): ${heads.dropped} line(s) looked like rank headings but were out of order or repeated`); summary.flags++ }

    targets.forEach((code, ti) => {
      const ctx = { code, title: null, chapterTitle: `Chapter ${c.n}. ${c.title}`.slice(0, 160), primary: ti === 0 }
      const before = passages.length
      // preamble: Major duties / Prerequisites duplicate DA PAM 611-21 and are not stored; goals for development are.
      let preLines = preamble, promoLines = []
      // Qualification indicators ("Most Qualified Indicators ...") listed before the by-rank sections are promotion criteria.
      if (plan.promotionFrom) { const pk = preamble.findIndex(l => new RegExp(plan.promotionFrom).test(l.text)); if (pk >= 0) { preLines = preamble.slice(0, pk); promoLines = preamble.slice(pk) } }
      const pre = splitPreamble(preLines)
      if (promoLines.length) mk(ctx, { section_type: 'promotion_criteria', heading: 'Qualification indicators (promotion consideration)' }, promoLines)
      for (const part of pre) {
        if (part.skip) { if (ti === 0) for (const l of part.lines) mark(l, `skipped: ${part.skip}`); continue }
        mk(ctx, { section_type: part.type, heading: part.heading }, part.lines)
      }
      heads.forEach((h, idx) => {
        const nextHead = idx + 1 < heads.length ? heads[idx + 1].k : chapterLines.length
        const term = (heads.terminators || []).find(t => t.k > h.k && t.k < nextHead)
        const end = h.end ?? (term ? term.k : nextHead)
        if (ti === 0 && !h.rest) mark(chapterLines[h.k], 'rank-heading')
        if (h.mos && h.mos !== code) { if (ti === 0) for (const l of chapterLines.slice(h.k + 1, end)) mark(l, `section for MOS ${h.mos}`); return }
        const body = chapterLines.slice(h.k + 1, end)
        if (h.rest) body.unshift({ ...chapterLines[h.k], text: h.rest })
        parseRankBody(ctx, h, body, chapterLines[h.k], plan.kind)
        if (h.gapAfter) mk(ctx, { section_type: 'development', heading: h.gapAfter.heading }, h.gapAfter.lines)
        // paragraphs after this grade's text that are not part of it: kept as general guidance, or skipped when they only point to
        // a figure, a Reserve Component chapter or another document
        if (term && !h.end) {
          const terms = (heads.terminators || []).filter(t => t.k >= term.k && t.k < nextHead)
          terms.forEach((t, i) => {
            const tend = i + 1 < terms.length ? terms[i + 1].k : nextHead
            const lns = chapterLines.slice(t.k, tend)
            const text = joinLines(lns)
            const skip = POINTER_PARA.test(t.title) ? 'figure, Reserve Component or pointer paragraph that follows the grade sections' : /^\S+\s+\S+\.\s+(See|Refer to)\b[^.]{0,120}\.?$/.test(text.replace(/\s+/g, ' ')) ? 'paragraph that only points elsewhere' : null
            if (skip) { if (ti === 0) for (const l of lns) mark(l, `skipped: ${skip}`); return }
            mk(ctx, { section_type: 'development', heading: t.title.length > 70 ? 'Additional guidance' : t.title }, [{ ...lns[0], text: lns[0].text.replace(/^\d+\s*[-–—]\s*\d+\.\s*/, '').trim() }, ...lns.slice(1)].filter(l => l.text))
          })
        }
      })
      summary.passages += passages.length - before
    })
    report.chapters.push(summary)
    if (plan.kind === 'cmf-rank') report.cmfWideAttachedTo = targets
  }

  function splitPreamble(preamble) {
    // items "Major duties", "Prerequisites", "Goals for development" at the start of an MOS chapter
    const out = []
    let cur = null
    for (const l of preamble) {
      const t = l.text.replace(ENUM, '')
      let m
      if ((m = t.match(/^((Major|MAJOR) [Dd]uties|(Prerequisites?|PREREQUISITES?))\b\s*[.:]?\s*/))) { cur = { skip: 'duplicates DA PAM 611-21 (duties and prerequisites are imported from it)', lines: [l] }; out.push(cur) }
      else if ((m = t.match(/^((Goals?|GOALS?) [Ff]or [Dd]evelopment)\b\s*[.:]?\s*/))) { cur = { type: 'development', heading: 'Goals for development', lines: [{ ...l, text: t.replace(/^(goals? for development)\b\s*[.:]?\s*/i, '') }] }; out.push(cur); if (!cur.lines[0].text) { mark(l, 'label-only'); cur.lines.shift() } }
      else if (cur) cur.lines.push(l)
      else out.push(cur = { type: 'development', heading: 'Overview', lines: [l] })
    }
    return out.filter(p => p.skip || p.lines.length)
  }

  function parseRankBody(ctx, h, body, headingLine, kind) {
    const gradeLabel = h.title
    if (kind === 'appendix') {
      mk(ctx, { section_type: 'assignments', rank_band: h.band, heading: `${gradeLabel} — assignments (appendix; applies to every MOS in this chapter)`, spanExtra: [headingLine] }, body)
      return
    }
    if (kind === 'cmf-rank') {
      // CMF-wide narrative: one passage per rank, with credential / recommended-reading text kept inside as written.
      mk(ctx, { section_type: 'development', rank_band: h.band, heading: `${gradeLabel} — ${h.runLabel || 'recommended career management'} (applies to every MOS in this career management field)`, spanExtra: [headingLine] }, body)
      return
    }
    const { items, lead } = splitItems(body)
    if (lead.length) mk(ctx, { section_type: 'development', rank_band: h.band, heading: `${gradeLabel} — overview`, spanExtra: [headingLine] }, lead)
    for (const item of items) {
      const first = item.lines[0].text.replace(ENUM, '')
      if (PROMOTION.test(first) || PROMOTION.test(first.replace(LABEL_TEXT, '')) || PROMO_BODY.test(item.lines.slice(0, 3).map(l => l.text).join('\n'))) { mk(ctx, { section_type: 'promotion_criteria', rank_band: h.band, heading: `${gradeLabel} — promotion consideration` }, item.lines); continue }
      const m = first.match(/^[^.:]{2,70}?[.:]\s*/)
      const rest = m && labelOf(item.lines[0].text, true) || m && item.type === 'development' ? first.slice(m[0].length) : first
      const bodyLines = [{ ...item.lines[0], text: rest }, ...item.lines.slice(1)].filter(l => l.text)
      if (!rest) mark(item.lines[0], 'label-only')
      mk(ctx, { section_type: item.type, rank_band: h.band, heading: `${gradeLabel} — ${item.label}`.replace(/\s+/g, ' ') }, bodyLines)
    }
  }

  for (let k = 0; k < indexed.length; k++) {
    // lines before the first chapter heading are the title block
    if (chapters.length && k < chapters[0].k) continue
    const inSkipped = plans.some(p => p.kind === 'skip' && k >= p.c.k && k < p.c.end)
    if (inSkipped) continue
    if (!consumed[k]) report.unassigned.push({ page: indexed[k].page, text: indexed[k].text.slice(0, 90), why: 'not assigned to any passage' })
  }
  // A passage that is only a pointer ("See MOS 68Z.") says nothing about the specialty or grade; it is left out and counted.
  const POINTER_ONLY = /^\(?(see|refer to)\b[^.]{0,100}\.?\)?$/i
  const keptPassages = passages.filter(p => !(p.body.length < 110 && POINTER_ONLY.test(p.body.trim().replace(/\s+/g, ' '))))
  report.pointerOnlyDropped = passages.length - keptPassages.length
  keptPassages.forEach((p, i) => { p.sort_order = i })
  report.passageCount = keptPassages.length
  return { passages: keptPassages, report, mosCodes: uniqueMos }
}
