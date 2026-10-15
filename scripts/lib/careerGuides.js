// Parsers for Army career-progression publications.
//
// Two layouts are supported, both seen in real documents:
//   * "enlisted-cmf"    — DA PAM 600-25 CMF chapters (CMF 42, CMF 36): a general
//                         by-rank chapter, an MOS chapter whose rank sections are
//                         numbered, and a Reserve/Guard component chapter.
//   * "officer-branch"  — a branch officer guide (Finance and Comptroller): numbered
//                         top-level sections for Regular Army / Reserve / Guard,
//                         each with grade subsections.
//
// Design rules:
//   * Structure comes from the document's own headings, never from rank WORDS in
//     running text (a "most qualified SSG to be selected for SFC" paragraph lives
//     inside the Staff Sergeant section and must stay there).
//   * Every in-scope line must end up in exactly one passage, or be explicitly
//     skipped with a reason. Anything left over is reported, and a clean import
//     has none.
//   * Text is stored as extracted. Nothing is paraphrased or "fixed".

import { createHash } from 'node:crypto'

// ── small helpers ─────────────────────────────────────────────────────────────

const ENUMERATED = /^(\(\d+\)|\([a-z]\)|\([a-z]\.\)|\([ivx]+\)|\d+\.\s|[a-z]\.\s)/

// Re-flow hard-wrapped lines; keep a line break where a new numbered/lettered item starts.
export function joinLines(lines) {
  let out = ''
  for (const l of lines) {
    if (!out) out = l.text
    else out += (ENUMERATED.test(l.text) ? '\n' : ' ') + l.text
  }
  return out
}

const sha = s => createHash('sha256').update(s).digest('hex')
const pageSpan = lines => lines.length ? [Math.min(...lines.map(l => l.page)), Math.max(...lines.map(l => l.page))] : [null, null]

function cleanTitle(text) {
  return text
    .replace(/^(?:\d+\.|[a-z]\.)\s+/, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.:]$/, '')
    .replace(/\s+Development$/i, '')
}

// ── rank headings (full-match, enumerated lines only) ────────────────────────

const ENLISTED_HEADINGS = [
  [/^private\s*-\s*specialist\/corporal$/i, 'E-1..E-4'],
  [/^sergeant$/i, 'E-5'],
  [/^staff sergeant$/i, 'E-6'],
  [/^sergeant first class$/i, 'E-7'],
  [/^master sergeant\s*\/\s*first sergeant$/i, 'E-8'],
  [/^sergeant major\s*\/\s*command sergeant major$/i, 'E-9'],
]
const OFFICER_HEADINGS = [
  [/^lieutenant$/i, 'O-1..O-2'],
  [/^captain$/i, 'O-3'],
  [/^major$/i, 'O-4'],
  [/^lieutenant colonel$/i, 'O-5'],
  [/^colonel$/i, 'O-6'],
  [/^company grade$/i, 'O-1..O-3'],
  [/^field grade$/i, 'O-4..O-6'],
]

export function enlistedRankBand(line) {
  if (!/^(?:\d+\.|[a-z]\.)\s+/.test(line)) return null
  const title = cleanTitle(line)
  const hit = ENLISTED_HEADINGS.find(([re]) => re.test(title))
  return hit ? { band: hit[1], title } : null
}

export function officerGradeBand(line) {
  if (!/^[a-z]\.\s+\S/.test(line) || !/development\.?$/i.test(line.trim())) return null
  const title = cleanTitle(line)
  const hit = OFFICER_HEADINGS.find(([re]) => re.test(title))
  return hit ? { band: hit[1], title } : null
}

// ── item splitting ───────────────────────────────────────────────────────────

// Top-level items are lettered, and the letter must INCREASE past the last
// top-level letter (skipping at most one: one document goes (f) → (h)).
// A nested "(a)" after "(g)" is therefore a continuation, not a new item.
// `prefix` is how the enumerator is written: parenthesised "(a)" or dotted "a.".
export function splitLetteredItems(lines, prefix) {
  const re = prefix === 'paren' ? /^\(([a-z])\)\s+/ : /^([a-z])\.\s+/
  const items = []
  const lead = []
  let last = 96 // char code before 'a'
  for (const line of lines) {
    const m = line.text.match(re)
    const code = m ? m[1].charCodeAt(0) : 0
    if (m && code > last && code <= last + 2) {
      last = code
      items.push({ letter: m[1], lines: [line] })
    } else if (items.length) {
      items[items.length - 1].lines.push(line)
    } else {
      lead.push(line)
    }
  }
  return { items, lead }
}

// Numbered "(1) Education." items for the officer guide. The first item may be
// mis-lettered "(a)" in the source (field-grade Reserve/Guard), so a known label
// is accepted there.
const OFFICER_ITEM_LABEL = /^(education|key developmental|key designated|broadening|self-?develop|additional training|desired experience)/i
export function splitNumberedItems(lines) {
  const items = []
  const lead = []
  let last = 0
  for (const line of lines) {
    const num = line.text.match(/^\((\d+)\)\s+(.*)$/)
    const firstLettered = !items.length && line.text.match(/^\(a\)\s+(.*)$/)
    if (num && Number(num[1]) > last && Number(num[1]) <= last + 3) {
      last = Number(num[1])
      items.push({ lines: [line] })
    } else if (firstLettered && OFFICER_ITEM_LABEL.test(firstLettered[1])) {
      items.push({ lines: [line] })
      last = 1
    } else if (items.length) {
      items[items.length - 1].lines.push(line)
    } else {
      lead.push(line)
    }
  }
  return { items, lead }
}

function stripLabel(text, label) {
  const lead = text.slice(0, label.length)
  if (lead !== label) return text
  return text.slice(label.length).replace(/^\s*[.:]\s*/, '')
}

function stripEnumerator(text) {
  return text.replace(/^\(([a-z0-9]+\.?)\)\s+/, '').replace(/^[a-z]\.\s+/, '')
}

// ── classification ───────────────────────────────────────────────────────────

const ENLISTED_LABELS = [
  [/^operational assignments?\s*[:.]?\s*/i,  'assignments',       'Operational assignments'],
  [/^generating assignments?\s*[:.]?\s*/i,   'assignments',       'Generating assignments'],
  [/^broadening assignments?\s*[:.]?\s*/i,   'assignments',       'Broadening assignments'],
  [/^institutional training\s*[:.]?\s*/i,    'training',          'Institutional training'],
  [/^additional training\s*[:.]?\s*/i,       'training',          'Additional training'],
  [/^special awards?\s*[:.]?\s*/i,           'development',       'Special awards'],
  [/^professional clubs? and organizations?\s*[:.]?\s*/i, 'self_development', 'Professional clubs and organizations'],
  [/^broadening\s*\/\s*special assignments?\s*[:.]?\s*/i, 'assignments', 'Broadening/Special assignments'],
  [/^lifelong learning\s*[:.]?\s*/i,         'lifelong_learning', 'Lifelong learning'],
  [/^self-?development\s*[:.]?\s*/i,         'self_development',  'Self-development'],
  [/^credentials?\s*\/?\s*certifications?\s*[:.]?\s*/i, 'credentials', 'Credentials/Certifications'],
]
const INLINE_ASSIGNMENT = /^(operational|generating|broadening) assignments?\s*[:.]\s*/i
const PROMOTION = /^(along\s+with\s+evaluating|promotion selection indicators)/i

// Chapter preamble items (a./b./c. before the rank sections).
const PREAMBLE_LABELS = [
  [/^major duties\s*[:.]?\s*/i,                'general_duties', 'Major duties'],
  [/^prerequisites?\s*[:.]?\s*/i,              'prerequisites',  'Prerequisites'],
  [/^goals for development\s*[:.]?\s*/i,       'development',    'Goals for development'],
]

function mkPassage(ctx, attrs, lines, body) {
  const text = body ?? joinLines(lines)
  // A section's heading can sit at the bottom of the page before its text starts;
  // count that page too so "where does this start" points at the heading.
  const [p1, p2] = pageSpan([...(attrs.spanExtra || []), ...lines])
  const sortOrder = ctx.nextSort++
  const passage = {
    occupation_code: ctx.occupation.code,
    occupation_title: ctx.occupation.title,
    branch: ctx.source.branch,
    personnel_category: attrs.personnel_category || ctx.source.personnel_category,
    section_type: attrs.section_type,
    rank_band: attrs.rank_band ?? null,
    components: attrs.components ?? null,
    heading: attrs.heading ?? null,
    chapter: ctx.chapterTitle,
    body: text,
    pdf_page_start: p1,
    pdf_page_end: p2,
    printed_page: ctx.printedPages[p1] || null,
    sort_order: sortOrder,
    body_sha256: sha(text),
  }
  for (const l of lines) ctx.mark(l.i, `p${sortOrder}`)
  ctx.passages.push(passage)
  return passage
}

// ── enlisted CMF guide ───────────────────────────────────────────────────────

function parseRankSection(ctx, band, rankTitle, lines) {
  const { items, lead } = splitLetteredItems(lines, 'paren')
  for (const l of lead) ctx.unassigned(l, `text before first lettered item in ${rankTitle}`)

  for (const item of items) {
    const first = stripEnumerator(item.lines[0].text)
    const rest = item.lines.slice(1)

    if (PROMOTION.test(first)) {
      mkPassage(ctx, { section_type: 'promotion_criteria', rank_band: band, heading: `${rankTitle} — promotion consideration` }, item.lines)
      continue
    }
    const hit = ENLISTED_LABELS.find(([re]) => re.test(first))
    if (!hit) {
      ctx.flag(`${rankTitle}: unclassified item "(${item.letter}) ${first.slice(0, 50)}"`)
      mkPassage(ctx, { section_type: 'development', rank_band: band, heading: `${rankTitle} — unclassified item (${item.letter})` }, item.lines)
      continue
    }
    const [re, type, label] = hit
    const firstBody = first.replace(re, '')
    if (!firstBody) ctx.mark(item.lines[0].i, 'label-only')   // the label became the passage heading
    const bodyLines = [{ ...item.lines[0], text: firstBody }, ...rest].filter(l => l.text)

    if (type === 'assignments') {
      // "Generating assignments:" is sometimes its own lettered item and sometimes
      // an inline sentence inside (a). Split inline ones so each keeps its own label.
      let cur = { label, lines: [] }
      const pieces = []
      for (const l of bodyLines) {
        const inline = l.text.match(INLINE_ASSIGNMENT)
        if (inline && cur.lines.length) {
          pieces.push(cur)
          cur = { label: `${inline[1][0].toUpperCase()}${inline[1].slice(1).toLowerCase()} assignments`, lines: [{ ...l, text: l.text.replace(INLINE_ASSIGNMENT, '') }] }
        } else cur.lines.push(l)
      }
      pieces.push(cur)
      for (const p of pieces) mkPassage(ctx, { section_type: 'assignments', rank_band: band, heading: p.label }, p.lines)
      continue
    }

    if (type === 'self_development') {
      // "Credentials/Certifications:" is written inside the self-development
      // paragraph. Keep credentials as their own category.
      const at = bodyLines.findIndex(l => /Credentials\s*\/\s*Certifications\s*:/i.test(l.text))
      if (at >= 0) {
        const m = bodyLines[at].text.match(/Credentials\s*\/\s*Certifications\s*:\s*/i)
        const before = bodyLines[at].text.slice(0, m.index).trim()
        const after = bodyLines[at].text.slice(m.index + m[0].length).trim()
        const selfLines = [...bodyLines.slice(0, at), ...(before ? [{ ...bodyLines[at], text: before }] : [])]
        const credLines = [...(after ? [{ ...bodyLines[at], text: after }] : []), ...bodyLines.slice(at + 1)]
        if (selfLines.length) mkPassage(ctx, { section_type: 'self_development', rank_band: band, heading: 'Self-development' }, selfLines)
        else ctx.mark(bodyLines[at].i, 'label-only')
        if (credLines.length) mkPassage(ctx, { section_type: 'credentials', rank_band: band, heading: 'Credentials/Certifications' }, credLines)
        continue
      }
    }
    mkPassage(ctx, { section_type: type, rank_band: band, heading: label }, bodyLines)
  }
}

function parseMosChapter(ctx, chapterLines) {
  // Split at enumerated rank headings.
  const heads = []
  chapterLines.forEach((l, k) => { const r = enlistedRankBand(l.text); if (r) heads.push({ k, ...r }) })
  const preamble = chapterLines.slice(0, heads.length ? heads[0].k : chapterLines.length)

  const { items, lead } = splitLetteredItems(preamble, 'dot')
  for (const l of lead) ctx.unassigned(l, 'text before first preamble item')
  for (const item of items) {
    const first = stripEnumerator(item.lines[0].text)
    const hit = PREAMBLE_LABELS.find(([re]) => re.test(first))
    if (!hit) { ctx.flag(`preamble item "${first.slice(0, 40)}" not recognised`); mkPassage(ctx, { section_type: 'development', heading: `Unclassified (${item.letter})` }, item.lines); continue }
    const [re, type, label] = hit
    const firstBody = first.replace(re, '')
    if (!firstBody) ctx.mark(item.lines[0].i, 'label-only')
    const lines = [{ ...item.lines[0], text: firstBody }, ...item.lines.slice(1)].filter(l => l.text)
    mkPassage(ctx, { section_type: type, heading: label }, lines)
  }

  heads.forEach((h, idx) => {
    const end = idx + 1 < heads.length ? heads[idx + 1].k : chapterLines.length
    ctx.mark(chapterLines[h.k].i, 'rank-heading')
    parseRankSection(ctx, h.band, h.title, chapterLines.slice(h.k + 1, end))
  })
}

function parseRankGuidance(ctx, chapterLines) {
  const heads = []
  chapterLines.forEach((l, k) => { const r = enlistedRankBand(l.text); if (r) heads.push({ k, ...r }) })
  const lead = chapterLines.slice(0, heads.length ? heads[0].k : chapterLines.length)
  for (const l of lead) ctx.unassigned(l, 'text before first rank heading in rank-guidance chapter')
  heads.forEach((h, idx) => {
    const end = idx + 1 < heads.length ? heads[idx + 1].k : chapterLines.length
    ctx.mark(chapterLines[h.k].i, 'rank-heading')
    const body = chapterLines.slice(h.k + 1, end)
    // A "(a) Star Credential(s)… (b) Proponent Recommended: …" block is credential
    // guidance. Keep it as its own category; the rest stays general development text.
    const s0 = body.findIndex(l => /^\(a\)\s+Star Credentials?\b/i.test(l.text))
    if (s0 >= 0) {
      let e0 = body.findIndex((l, k) => k > s0 && /^\(\d+\)\s/.test(l.text))
      if (e0 < 0) e0 = body.length
      const before = body.slice(0, s0), cred = body.slice(s0, e0), after = body.slice(e0)
      if (before.length) mkPassage(ctx, { section_type: 'development', rank_band: h.band, heading: h.title, spanExtra: [chapterLines[h.k]] }, before)
      mkPassage(ctx, { section_type: 'credentials', rank_band: h.band, heading: `${h.title} — recommended credentials` }, cred)
      if (after.length) mkPassage(ctx, { section_type: 'development', rank_band: h.band, heading: `${h.title} (continued)` }, after)
    } else {
      mkPassage(ctx, { section_type: 'development', rank_band: h.band, heading: h.title, spanExtra: [chapterLines[h.k]] }, body)
    }
  })
}

function parseComponentChapter(ctx, chapterLines, components) {
  const { items, lead } = splitLetteredItems(chapterLines, 'dot')
  if (lead.length) mkPassage(ctx, { section_type: 'general_duties', components, heading: 'Overview' }, lead)
  for (const item of items) {
    const first = stripEnumerator(item.lines[0].text)
    const label = (first.match(/^([^.:]{2,60})[.:]/) || [])[1] || `Item ${item.letter}`
    const type = /qualification|prerequisite/i.test(label) ? 'prerequisites' : 'general_duties'
    const stripped = first.replace(/^[^.:]{2,60}[.:]\s*/, '')
    if (!stripped) ctx.mark(item.lines[0].i, 'label-only')
    mkPassage(ctx, { section_type: type, components, heading: label.trim() }, [{ ...item.lines[0], text: stripped }, ...item.lines.slice(1)].filter(l => l.text))
  }
}

// ── officer branch guide ─────────────────────────────────────────────────────

function classifyOfficerItem(label) {
  if (/^education/i.test(label)) return ['training', 'Education']
  if (/^key developmental/i.test(label)) return ['assignments', 'Key developmental assignments']
  if (/^key designated/i.test(label)) return ['assignments', 'Key designated billet positions']
  if (/^broadening/i.test(label)) return ['assignments', 'Broadening assignments']
  if (/^self-?develop|^additional training/i.test(label)) return ['self_development', 'Self-development / additional training']
  if (/^desired experience/i.test(label)) return ['rank_duties', 'Desired experience']
  if (/^(arng|usar|army reserve|reserve)\s+officers? may have occupations or educational/i.test(label)) return ['prerequisites', 'Branch-transfer alternatives']
  return null
}

// Some Reserve/Guard items are written for one grade inside a field-grade section
// ("... for lieutenant colonels"). Use that narrower band when it says so.
function refineBand(label, band) {
  if (/for lieutenant colonels/i.test(label)) return 'O-5'
  if (/for colonels/i.test(label)) return 'O-6'
  if (/for majors/i.test(label)) return 'O-4'
  return band
}

function parseOfficerGradeItem(ctx, band, gradeTitle, lines, components) {
  const { items, lead } = splitNumberedItems(lines)
  for (const l of lead) ctx.unassigned(l, `text before first numbered item in ${gradeTitle}`)
  for (const item of items) {
    const first = stripEnumerator(item.lines[0].text)
    const label = (first.match(/^([^.:]{2,80}?)[.:]\s*/) || [])[1] || first.slice(0, 60)
    const cls = classifyOfficerItem(label)
    const stripped = stripLabel(first, label)
    if (!stripped) ctx.mark(item.lines[0].i, 'label-only')
    const lines2 = [{ ...item.lines[0], text: stripped }, ...item.lines.slice(1)].filter(l => l.text)
    if (!cls) {
      ctx.flag(`${gradeTitle}: unclassified item "${label.slice(0, 50)}"`)
      mkPassage(ctx, { section_type: 'development', rank_band: band, components, heading: `${gradeTitle} — ${label}` }, lines2)
      continue
    }
    mkPassage(ctx, { section_type: cls[0], rank_band: refineBand(label, band), components, heading: `${gradeTitle} — ${label}` }, lines2)
  }
}

function parseOfficerSection(ctx, cfg, sectionLines) {
  const [headingLine, ...body] = sectionLines
  ctx.mark(headingLine.i, 'section-heading')
  if (cfg.mode === 'single') {
    mkPassage(ctx, { section_type: cfg.section_type, rank_band: cfg.rank_band || null, personnel_category: cfg.personnel_category, components: cfg.components, heading: cfg.heading }, body)
    return
  }
  if (cfg.mode === 'whole') {
    mkPassage(ctx, { section_type: cfg.section_type, components: cfg.components, heading: cfg.heading }, body)
    return
  }
  // mode 'grades' / 'intro': lettered items; grade-development items are split by number.
  const { items, lead } = splitLetteredItems(body, 'dot')
  for (const l of lead) ctx.unassigned(l, `text before first lettered item in section "${cfg.heading}"`)
  for (const item of items) {
    const grade = officerGradeBand(item.lines[0].text)
    if (grade) {
      ctx.mark(item.lines[0].i, 'grade-heading')
      parseOfficerGradeItem(ctx, grade.band, grade.title, item.lines.slice(1), cfg.components)
      continue
    }
    const first = stripEnumerator(item.lines[0].text)
    const label = (first.match(/^([^.:]{2,80}?)[.:]\s*/) || [])[1] || first.slice(0, 60)
    const rule = (cfg.items || []).find(r => new RegExp(r.match, 'i').test(label))
    if (rule?.skip) { for (const l of item.lines) ctx.mark(l.i, `skipped: ${rule.reason}`); continue }
    const type = rule?.section_type || (/requirements|transfer/i.test(label) ? 'prerequisites' : 'development')
    const strippedFirst = stripLabel(first, label)
    if (!strippedFirst) ctx.mark(item.lines[0].i, 'label-only')
    mkPassage(ctx, { section_type: type, components: cfg.components, heading: label }, [{ ...item.lines[0], text: strippedFirst }, ...item.lines.slice(1)].filter(l => l.text))
  }
}

// ── driver ───────────────────────────────────────────────────────────────────

export function parseGuide({ manifest, lines, printedPages }) {
  const consumed = new Array(lines.length).fill(null)
  const report = { skippedChapters: [], flags: [], unassigned: [], notes: manifest.notes || [] }
  const passages = []
  const indexed = lines.map((l, i) => ({ ...l, i }))
  const inScope = new Set()

  const baseCtx = occupation => ({
    source: manifest.source, occupation, printedPages, passages, nextSort: 0, chapterTitle: null,
    mark: (i, who) => { consumed[i] = consumed[i] ? `${consumed[i]}+${who}` : who },
    flag: msg => report.flags.push(msg),
    unassigned: (l, why) => report.unassigned.push({ page: l.page, text: l.text.slice(0, 90), why }),
  })

  if (manifest.profile === 'enlisted-cmf') {
    const chapters = []
    indexed.forEach((l, k) => { const m = l.text.match(/^Chapter (\d+)\.\s+(\S.*)$/); if (m) chapters.push({ num: Number(m[1]), title: l.text, k }) })
    chapters.forEach((ch, idx) => {
      const end = idx + 1 < chapters.length ? chapters[idx + 1].k : indexed.length
      const cfg = manifest.chapters?.[String(ch.num)]
      const chapterLines = indexed.slice(ch.k + 1, end)
      if (!cfg || cfg.kind === 'skip') {
        const [p1, p2] = pageSpan(indexed.slice(ch.k, end))
        report.skippedChapters.push({ chapter: ch.title.slice(0, 100), pdfPages: `${p1}-${p2}`, reason: cfg?.reason || 'not in manifest' })
        return
      }
      for (let k = ch.k; k < end; k++) inScope.add(k)
      for (const occupation of cfg.occupations) {
        const ctx = baseCtx(occupation)
        ctx.chapterTitle = ch.title
        ctx.nextSort = passages.length
        if (occupation !== cfg.occupations[0]) ctx.mark = () => {}
        ctx.mark(indexed[ch.k].i, 'chapter-heading')
        if (cfg.kind === 'rank-guidance') parseRankGuidance(ctx, chapterLines)
        else if (cfg.kind === 'mos-chapter') parseMosChapter(ctx, chapterLines)
        else if (cfg.kind === 'component-chapter') parseComponentChapter(ctx, chapterLines, cfg.components)
        else throw new Error(`unknown chapter kind ${cfg.kind}`)
      }
    })
  } else if (manifest.profile === 'officer-branch') {
    const heads = []
    let last = 0
    indexed.forEach((l, k) => {
      const m = l.text.match(/^(\d+)\.\s+[A-Z]/)
      if (m && Number(m[1]) === last + 1) { last = Number(m[1]); heads.push({ n: last, k }) }
    })
    heads.forEach((h, idx) => {
      const end = idx + 1 < heads.length ? heads[idx + 1].k : indexed.length
      const cfg = manifest.sections?.[String(h.n)]
      const secLines = indexed.slice(h.k, end)
      if (!cfg || cfg.mode === 'skip') {
        const [p1, p2] = pageSpan(secLines)
        report.skippedChapters.push({ chapter: secLines[0].text.slice(0, 100), pdfPages: `${p1}-${p2}`, reason: cfg?.reason || 'not in manifest' })
        return
      }
      for (let k = h.k; k < end; k++) inScope.add(k)
      for (const occupation of manifest.occupations) {
        const ctx = baseCtx(occupation)
        ctx.chapterTitle = secLines[0].text
        ctx.nextSort = passages.length
        if (occupation !== manifest.occupations[0]) ctx.mark = () => {}
        parseOfficerSection(ctx, cfg, secLines)
      }
    })
  } else {
    throw new Error(`unknown profile ${manifest.profile}`)
  }

  // Accounting: every in-scope line must be consumed.
  for (const k of inScope) if (!consumed[k]) report.unassigned.push({ page: indexed[k].page, text: indexed[k].text.slice(0, 90), why: 'not assigned to any passage' })
  report.inScopeLines = inScope.size
  report.consumedLines = [...inScope].filter(k => consumed[k]).length
  passages.forEach((p, i) => { p.sort_order = i })
  return { passages, report }
}
