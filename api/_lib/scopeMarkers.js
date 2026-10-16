// Resume drafts keep two kinds of experience line apart: what the official publication says the specialty involves
// (SPECIALTY SCOPE) and what the person did (YOUR ACCOMPLISHMENTS). The scope lines are not the person's claims, so each
// one carries "[CONFIRM]" — added here if the model left it off, so it never depends on the model remembering.

const SCOPE_HEAD = /^\s*SPECIALTY SCOPE\b/i
const NEXT_HEAD = /^\s*(YOUR ACCOMPLISHMENTS\b|EDUCATION\b|CERTIFICATIONS\b|PROFESSIONAL SUMMARY\b|CORE COMPETENCIES\b|HONORS\b|[─-]{6,}|[A-Z][A-Z &/]{6,}$)/
const BULLET = /^(\s*)([•\-*])\s*(.*)$/

export function markScopeBullets(text) {
  let inScope = false
  return String(text || '').split('\n').map(line => {
    if (SCOPE_HEAD.test(line)) { inScope = true; return line }
    if (inScope && NEXT_HEAD.test(line) && !SCOPE_HEAD.test(line)) inScope = false
    if (!inScope) return line
    const m = line.match(BULLET)
    if (!m) return line
    return /^\[CONFIRM\b/i.test(m[3]) ? line : `${m[1]}${m[2]} [CONFIRM] ${m[3]}`
  }).join('\n')
}

// Used by tests and the full resume builder: how many scope bullets lack the marker (should be 0 after markScopeBullets).
export function unmarkedScopeBullets(text) {
  let inScope = false, n = 0
  for (const line of String(text || '').split('\n')) {
    if (SCOPE_HEAD.test(line)) { inScope = true; continue }
    if (inScope && NEXT_HEAD.test(line)) { inScope = false; continue }
    const m = inScope && line.match(BULLET)
    if (m && !/^\[CONFIRM\b/i.test(m[3])) n++
  }
  return n
}

// Claim-word check for a whole resume. Lines under SPECIALTY SCOPE may use the vocabulary of the official publication
// (scopeFacts); every other line may only use words the person supplied (personalFacts).
import { annotateUnsupportedClaims } from './claimLint.js'

export function annotateResume(text, { personalFacts, scopeFacts = '' }) {
  let inScope = false
  const flagged = []
  const lines = String(text || '').split('\n').map((line, i) => {
    if (SCOPE_HEAD.test(line)) { inScope = true; return line }
    if (inScope && NEXT_HEAD.test(line)) inScope = false
    const r = annotateUnsupportedClaims(line, inScope ? `${personalFacts} ${scopeFacts}` : personalFacts)
    if (r.flagged.length) flagged.push({ line: i + 1, words: r.flagged[0].words })
    return r.text
  })
  return { text: lines.join('\n'), flagged }
}
