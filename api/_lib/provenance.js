// Where does each line of a generated translation come from?
//
// The model is asked to quote the words each entry rests on. The server then checks the quote itself: it must appear
// in the official reference text the person's grade selected ("publication"), or in what the person wrote or uploaded
// ("personal"). An entry whose quote is in neither is dropped. This is what keeps "what the specialty involves" apart
// from "what this person did", and it does not depend on the model's own claim about which one it is.

// Letters and digits only: ignores spacing, hyphenation ("non- repudiation"), curly quotes and punctuation.
export const squash = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '')

const MIN_QUOTE_CHARS = 24

export function containsQuote(haystack, quote) {
  const q = squash(quote)
  return q.length >= MIN_QUOTE_CHARS && squash(haystack).includes(q)
}

// reference: result of retrieveReference (sections carry text, sourceRef, pdfPages, rankBand, section)
// personal: [{ label, text }] — what the person typed and what came from their uploaded records
export function groundEntries(entries, { reference, personal = [], referenceSectionLabels = {} } = {}) {
  const refSections = (reference?.sections || []).map(sec => ({ sec, flat: squash(sec.text) }))
  const people = personal.filter(p => p.text?.trim()).map(p => ({ ...p, flat: squash(p.text) }))
  const sourceByRef = Object.fromEntries((reference?.sources || []).map(s => [s.ref, s]))
  const kept = []
  const dropped = []
  for (const e of Array.isArray(entries) ? entries : []) {
    const q = squash(e?.evidence)
    if (q.length < MIN_QUOTE_CHARS) { dropped.push({ entry: e, why: 'no usable quote' }); continue }
    const own = people.find(p => p.flat.includes(q))
    if (own) { kept.push({ ...e, basis: 'personal', evidence: String(e.evidence).trim(), from: own.label }); continue }
    const hit = refSections.find(r => r.flat.includes(q))
    if (hit) {
      const src = sourceByRef[hit.sec.sourceRef]
      kept.push({
        ...e, basis: 'publication', evidence: String(e.evidence).trim(),
        source: {
          ref: hit.sec.sourceRef || null,
          publication: src?.publicationNumber || null,
          publicationDate: src?.publicationDate || null,
          chapter: src?.chapter || null,
          pdfPages: hit.sec.pdfPages || null,
          grade: hit.sec.rankBand || null,
          section: referenceSectionLabels[hit.sec.section] || hit.sec.section,
        },
      })
      continue
    }
    dropped.push({ entry: e, why: 'quote not found in the reference or in what the person provided' })
  }
  return { kept, dropped }
}
