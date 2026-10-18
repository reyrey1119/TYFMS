// Deterministic check on generated resume text. A prompt rule asks the model not to add results, effects or
// quality claims the person never made; this catches the ones that slip through.
//
// For every line of generated text, any "claim word" (accurately, consistently, ensuring, reducing, demonstrated,
// strict, proficient, ...) that does not appear anywhere in the facts the person supplied gets a visible annotation.
// It never deletes text and never silently rewrites; the person decides.

const CLAIM_WORDS = [
  'accurate', 'accurately', 'accuracy', 'consistent', 'consistently', 'effective', 'effectively', 'efficient', 'efficiently',
  'successful', 'successfully', 'reliable', 'reliably', 'reliability', 'ensure', 'ensuring', 'ensured', 'reduce', 'reducing', 'reduced',
  'improve', 'improved', 'improving', 'demonstrate', 'demonstrated', 'demonstrating', 'strict', 'strictly', 'rigorous', 'rigorously',
  'thorough', 'thoroughly', 'meticulous', 'meticulously', 'proficient', 'proficiency', 'expert', 'expertise', 'exceptional', 'excellent',
  'recognized', 'recognised', 'recognition', 'awarded', 'commended', 'praised', 'honored', 'trusted', 'top-performing', 'award-winning',
  'clearly', 'timely', 'seamless', 'seamlessly', 'disciplined', 'detail-oriented', 'dependable', 'fast-paced', 'precise', 'precisely', 'diligent', 'diligently',
  'on schedule', 'on time', 'without gaps', 'without error', 'without errors', 'without fail', 'missed entries',
  'outstanding', 'streamline', 'streamlined', 'optimize', 'optimized', 'high-quality', 'sign-off', 'flawless', 'flawlessly', 'mastery', 'mastered',
]
const WORD_RE = new RegExp(`\\b(${CLAIM_WORDS.map(w => w.replace('-', '\\-')).join('|')})\\b`, 'gi')

const isStructure = line => {
  const t = line.trim()
  return !t || /^[─\-=_•\s]+$/.test(t) || t.length < 25 || /^[A-Z][A-Z &/,'’-]{3,}$/.test(t) || /^\[(ADD|CONFIRM)/.test(t)
}

export function tokensOf(text) {
  return new Set(String(text || '').toLowerCase().match(/[a-z][a-z-]*/g) || [])
}

// Returns { text, flagged: [{ line, words }] }
export function annotateUnsupportedClaims(generated, suppliedFacts) {
  const supplied = tokensOf(suppliedFacts)
  const suppliedText = String(suppliedFacts || '').toLowerCase().replace(/\s+/g, ' ')
  const flagged = []
  const out = String(generated || '').split('\n').map((line, i) => {
    if (isStructure(line)) return line
    const body = line.replace(/\[[^\]]*\]/g, ' ')               // text already inside [ADD]/[CONFIRM] is not a claim
    const hits = [...new Set((body.match(WORD_RE) || []).map(w => w.toLowerCase()))].filter(w => w.includes(' ') ? !suppliedText.includes(w) : !supplied.has(w))
    if (!hits.length) return line
    flagged.push({ line: i + 1, words: hits })
    return `${line} [CONFIRM: you did not describe this as ${hits.map(h => `"${h}"`).join(', ')}. Keep it only if it is true.]`
  })
  return { text: out.join('\n'), flagged }
}
