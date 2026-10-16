// Is this Army code in force today? Backed by api/_lib/armyCodeStatus.data.js, which is generated from the
// official DA PAM 611-21 classification chapters (scripts/reconcile-army-inventory.js).
//
// Only codes that are NOT simply current (rescinded, future-effective, special reporting, immaterial) or that
// carry a scheduled change / component limit are listed. Absence means "no special status found", never
// "verified current".

import { ARMY_CODE_STATUS_DATA, ARMY_CODE_STATUS_AS_OF, ARMY_CODE_TITLES } from './armyCodeStatus.data.js'

// Official title of an Army code from DA PAM 611-21 (null if the document gives none).
export function officialTitle(category, code) {
  return ARMY_CODE_TITLES[category]?.[code] || null
}

export function armyCodeStatus(category, code) {
  return ARMY_CODE_STATUS_DATA[category]?.[code] || null
}

const when = iso => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', timeZone: 'UTC' })
const cite = rec => `${rec.source}${rec.pdf_page ? `, PDF p. ${rec.pdf_page}` : ''}`

// A person's own past code is never overwritten or hidden. For a code that is not in force today we say so
// plainly, cite the page, show no current specialty reference, and ask for their own tasks instead.
export function describeCodeStatus(rec, code, today = new Date().toISOString().slice(0, 10)) {
  const name = rec.title ? `${code} (${rec.title})` : code
  switch (rec.status) {
    case 'rescinded':
      return { blocking: true, status: 'historical', message: `${name} was rescinded effective ${when(rec.rescinded_from)} (${cite(rec)}). You can still use it to describe past service, but no current specialty reference applies. Describe the tasks you performed below.${rec.related ? ' ' + rec.related : ''}` }
    case 'future_effective':
      return { blocking: true, status: 'future_effective', message: `${name} takes effect ${when(rec.effective_from)} (${cite(rec)}), so no current reference applies yet. Describe the tasks you performed below.` }
    case 'special_reporting':
    case 'immaterial':
      return { blocking: true, status: 'special_code', message: `${code} is a ${rec.status === 'immaterial' ? 'MOS-immaterial' : 'special reporting'} code (${cite(rec)}), not a job specialty with its own duties. Describe the tasks you performed below.` }
    default: {
      const notes = []
      if (rec.scheduled_change) notes.push(`A change to ${code} takes effect ${when(rec.scheduled_change)} (${cite(rec)}).`)
      if (rec.scheduled_rescission) notes.push(`${code} is scheduled to be rescinded ${when(rec.scheduled_rescission)} (${cite(rec)}).`)
      if (rec.component_restriction) notes.push(`DA PAM 611-21 lists this code as "${rec.component_restriction}".`)
      if (rec.guide_predates_change) notes.push(`The career guide for ${code} is older than its latest classification change; duties may have changed since the guide was written.`)
      return notes.length ? { blocking: false, note: notes.join(' ') } : null
    }
  }
}

export { ARMY_CODE_STATUS_AS_OF }
