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
