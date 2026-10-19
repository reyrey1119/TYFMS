// CORE COMPETENCIES on a resume are only ever what the person chose.
//
// The skills translator and the writers suggest skills; a suggestion is not something the person has shown. So the
// competency list of a generated resume is built here, deterministically, from (a) the suggestions the person explicitly
// selected and (b) skills the person typed themselves. Whatever the model wrote under that heading is discarded.

const MAX_SKILLS = 24
const MAX_LEN = 60

export function parseSkillList(value) {
  const parts = Array.isArray(value) ? value : String(value || '').split(/[\n,;•]+/)
  const seen = new Set(); const out = []
  for (const p of parts) {
    const s = String(p ?? '').replace(/\s+/g, ' ').trim()
    const k = s.toLowerCase()
    if (!s || s.length > MAX_LEN || seen.has(k) || /[\[\]]/.test(s)) continue
    seen.add(k); out.push(s)
    if (out.length >= MAX_SKILLS) break
  }
  return out
}

// A selection counts only if it is one of the suggestions that were shown (case-insensitive, exact text).
export function selectedFromSuggestions(selected, suggestions) {
  const shown = new Map(parseSkillList(suggestions).map(s => [s.toLowerCase(), s]))
  return parseSkillList(selected).map(s => shown.get(s.toLowerCase())).filter(Boolean)
}

export const NO_COMPETENCIES_LINE = '[ADD: skills you can demonstrate, or select them from the suggestions in the skills translator]'

export function competencyLines({ selected = [], own = [] } = {}) {
  const all = parseSkillList([...parseSkillList(selected), ...parseSkillList(own)])
  if (!all.length) return [NO_COMPETENCIES_LINE]
  const rows = []
  for (let i = 0; i < all.length; i += 3) rows.push(all.slice(i, i + 3).join(' | '))
  if (all.length < 6) rows.push('[ADD: additional competency you can demonstrate]')
  return rows
}

const DIVIDER = /^\s*[─\-=_]{5,}\s*$/
const HEADING = /^[A-Z][A-Z &,/'’-]{5,}(?:\s.*)?$/

// Replace the body of the CORE COMPETENCIES section; a text without that section is returned unchanged.
export function applyCompetencies(text, choice) {
  const lines = String(text || '').split('\n')
  const at = lines.findIndex(l => /^\s*CORE COMPETENCIES\b/.test(l))
  if (at < 0) return text
  let start = at + 1
  if (DIVIDER.test(lines[start] || '')) start++
  let end = start
  while (end < lines.length && !DIVIDER.test(lines[end]) && !(HEADING.test(lines[end].trim()) && !/^\[/.test(lines[end].trim()))) end++
  return [...lines.slice(0, start), ...competencyLines(choice), '', ...lines.slice(end)].join('\n').replace(/\n{4,}/g, '\n\n\n')
}
