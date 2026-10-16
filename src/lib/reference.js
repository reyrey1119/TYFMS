// Plain-language helpers for the official-reference lookup. The lookup is advisory in the browser: the server
// re-reads the reference itself before anything is generated.

// A reviewed official reference exists for this code and grade (the server may still decline to use it).
export function referenceUsable(data) {
  return !!data && (data.status === 'verified' || data.status === 'stale') && Array.isArray(data.sections) && data.sections.length > 0
}

// "From DA PAM 611-21, PDF p. 17" for a translation entry that rests on the publication; the person's own text otherwise.
export function entryOrigin(entry) {
  if (!entry) return ''
  if (entry.basis === 'personal') return entry.from ? `From ${entry.from}` : 'From what you provided'
  const s = entry.source || {}
  const where = [s.publication, s.pdfPages ? `PDF p. ${s.pdfPages}` : null].filter(Boolean).join(', ')
  return where ? `From ${where}` : 'From the official specialty description'
}

// One plain sentence about where the specialty description came from; empty if there is none.
export function sourceLine(reference) {
  const src = (reference?.sources || [])[0]
  if (!src?.publicationNumber) return ''
  const date = src.publicationDate ? new Date(src.publicationDate + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }) : ''
  return `Specialty descriptions come from ${src.publicationNumber}${date ? ` (${date})` : ''}, the Army's official classification publication.`
}
