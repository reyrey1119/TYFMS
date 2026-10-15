// Small shared helpers for rank / component handling in the forms.

export const COMPONENT_OPTIONS = [
  { value: '', label: 'Not specified' },
  { value: 'active', label: 'Active duty' },
  { value: 'reserve', label: 'Reserve' },
  { value: 'guard', label: 'National Guard' },
]

// Older profiles stored "National Guard" / "Reserve" in the branch field. Those
// are components, not branches. Keep the component, and leave the branch for the
// person to choose rather than guessing it.
export function splitLegacyBranch(value) {
  if (value === 'National Guard') return { branch: null, component: 'guard' }
  if (value === 'Reserve') return { branch: null, component: 'reserve' }
  return { branch: value || null, component: null }
}

const JUNIOR_YOS = ['Less than 1 year', '1–2 years']

// Trainees and junior enlisted: used only to change wording (training vs. duties
// performed). It never changes what the reference says.
export function isJuniorContext(rank, yos) {
  const m = String(rank || '').toUpperCase().match(/^E-?(\d)$/)
  return (!!m && Number(m[1]) <= 4) || JUNIOR_YOS.includes(yos || '')
}

// Mirrors the server rule (api/_lib/milReference.js): rank must be a real pay
// grade. Used to stop a request before it is sent; the server re-checks it
// before any paid model call.
export function rankProblem(rank) {
  const m = String(rank || '').trim().toUpperCase().match(/^([EWO])-?(\d{1,2})$/)
  if (!m) return rank ? 'Rank must be a pay grade like E-5, W-2, or O-3.' : 'Select your rank (pay grade) first. The result is rank-specific, and we do not assume one.'
  const max = { E: 9, W: 5, O: 10 }[m[1]]
  const n = Number(m[2])
  return n >= 1 && n <= max ? '' : 'Rank must be a pay grade like E-5, W-2, or O-3.'
}
