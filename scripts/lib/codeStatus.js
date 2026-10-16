// Reading dated classification markers and deciding a code's status as of a date.
// Pure functions (no file access) so the rules can be tested.

// ── marker parsing ────────────────────────────────────────────────────────────
// Six digits: YYYYMM ("202610") is the normal form. A few headings carry a YYMMDD form
// ("251010"); those are kept but flagged, never silently trusted.
export function toDate(six) {
  if (/^20\d{2}(0[1-9]|1[0-2])$/.test(six)) return { date: `${six.slice(0, 4)}-${six.slice(4)}-01`, odd: false }
  if (/^\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/.test(six)) return { date: `20${six.slice(0, 2)}-${six.slice(2, 4)}-${six.slice(4)}`, odd: true }
  return null
}
export function parseMarkers(text) {
  const flags = []
  const effective = [], rescind = []
  for (const m of text.matchAll(/\(?\b(?:Effective|Eff)\.?\s*(\d{6})\)?/gi)) { const d = toDate(m[1]); if (d) { effective.push(d.date); if (d.odd) flags.push(`nonstandard date "${m[1]}" read as ${d.date}`) } else flags.push(`unreadable date "${m[1]}"`) }
  for (const m of text.matchAll(/\(?Rescind\)?\s*(\d{6})\)?/gi)) { const d = toDate(m[1]); if (d) { rescind.push(d.date); if (d.odd) flags.push(`nonstandard date "${m[1]}" read as ${d.date}`) } else flags.push(`unreadable date "${m[1]}"`) }
  // Chart notation: "( del 2610 / 2510 - 05 )" = deleted effective Oct 2026; "( add 2510 / ... )" = added Oct 2025.
  for (const m of text.matchAll(/\(\s*(del|add)\s+(\d{2})(\d{2})\b/gi)) {
    const date = `20${m[2]}-${m[3]}-01`
    if (+m[3] < 1 || +m[3] > 12) { flags.push(`unreadable chart date "${m[0]}"`); continue }
    ;(m[1].toLowerCase() === 'del' ? rescind : effective).push(date)
  }
  if (new Set(effective).size > 1) flags.push('more than one effective date on the heading')
  const component = [...text.matchAll(/\((Active Component(?: and USAR)?(?: Only)?|RC Only|COMPO [123](?: and [123])? Only)\)/gi)].map(m => m[1])
  return {
    effective_from: effective.length ? effective.sort().at(-1) : null,   // a version applies once its LATEST date has arrived
    rescinded_from: rescind.length ? rescind.sort()[0] : null,
    component_restriction: component.length ? component.join('; ') : null,
    acasp: /ACASP/i.test(text),
    flags,
  }
}

// Status is decided by the LATEST dated event on or before the as-of date. A rescission and a
// re-establishment in the same month (a retitled code) resolve to "current". `basis` records
// whether any dated marker supports the call, so "no marker found" is never passed off as proof.
export function statusOf(versions, headingKind, inherited = [], ASOF) {
  if (headingKind === 'immaterial') return { status: 'immaterial', basis: 'classification_heading' }
  if (headingKind === 'special_reporting') return { status: 'special_reporting', basis: 'classification_heading' }
  let events = []
  for (const v of versions) {
    if (v.effective_from) events.push({ date: v.effective_from, type: 'effective' })
    if (v.rescinded_from) events.push({ date: v.rescinded_from, type: 'rescind' })
  }
  let basis = 'dated_marker_on_code'
  if (!events.length && inherited.length) { events = inherited.map(e => ({ ...e })); basis = 'dated_marker_on_branch' }
  if (!events.length) return { status: 'current', basis: 'listed_without_dated_marker' }
  const order = e => e.date + (e.type === 'rescind' ? '0' : '1')            // same month: effective wins
  const past = events.filter(e => e.date <= ASOF).sort((x, y) => order(x).localeCompare(order(y)))
  const future = events.filter(e => e.date > ASOF)
  const futEff = future.filter(e => e.type === 'effective').map(e => e.date).sort()
  const futRes = future.filter(e => e.type === 'rescind').map(e => e.date).sort()
  if (past.length) {
    const last = past.at(-1)
    return last.type === 'rescind'
      ? { status: 'rescinded', rescinded_from: last.date, basis, ...(futEff.length ? { scheduled_change: futEff[0] } : {}) }
      : { status: 'current', basis, ...(futEff.length ? { scheduled_change: futEff[0] } : {}), ...(futRes.length ? { scheduled_rescission: futRes[0] } : {}) }
  }
  if (futEff.length) return { status: 'future_effective', effective_from: futEff[0], basis }
  return { status: 'current', basis, ...(futRes.length ? { scheduled_rescission: futRes[0] } : {}) }
}

