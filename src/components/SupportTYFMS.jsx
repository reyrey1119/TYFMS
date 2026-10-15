// Optional support section. Everything on TYFMS stays free whether or not
// someone contributes: this never interrupts, gates, or nags.
//
// The contribution button appears only when VITE_SUPPORT_URL is set to a valid
// https link (set it in Vercel → Project → Settings → Environment Variables).
// With no link configured, nothing renders — no dead button, no invented payment
// destination. It makes no tax-deductibility claim.

export function supportUrl() {
  const raw = (import.meta.env.VITE_SUPPORT_URL || '').trim()
  try {
    const u = new URL(raw)
    return u.protocol === 'https:' ? u.toString() : null
  } catch {
    return null
  }
}

export const SPONSOR_MAILTO = 'mailto:tyfmsapp@gmail.com?subject=TYFMS%20sponsor%20inquiry'

export default function SupportTYFMS() {
  const url = supportUrl()
  if (!url) return null
  return (
    <div style={{ background: '#fff', border: '1px solid #C2B588', borderRadius: 10, padding: '16px 18px', margin: '24px 0' }}>
      <p style={{ fontSize: 14, color: '#211F19', lineHeight: 1.6, marginBottom: 12 }}>
        TYFMS is free to use. If it helps you, an optional contribution helps cover hosting, AI tools, and maintenance so it can stay free for the next person.
      </p>
      <a href={url} target="_blank" rel="noopener noreferrer"
        style={{ display: 'inline-block', padding: '9px 16px', background: '#1B3A6B', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
        Support TYFMS
      </a>
      <p style={{ fontSize: 11, color: '#8F8768', marginTop: 10 }}>Entirely optional. Every tool stays free either way.</p>
    </div>
  )
}
