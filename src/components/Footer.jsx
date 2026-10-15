import { supportUrl, SPONSOR_MAILTO } from './SupportTYFMS'

export default function Footer({ onPrivacy, className }) {
  const support = supportUrl()
  return (
    <footer className={className} style={{
      borderTop: '1px solid #C2B588', marginTop: 48, padding: '20px 24px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      flexWrap: 'wrap', gap: 8,
    }}>
      <p style={{ fontSize: 12, color: '#8F8768' }}>
        © {new Date().getFullYear()} TYFMS. All rights reserved.
      </p>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <button
          onClick={onPrivacy}
          style={{ background: 'none', border: 'none', color: '#5C5646', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}
        >
          Privacy Policy
        </button>
        <a href="mailto:tyfmsapp@gmail.com" style={{ fontSize: 12, color: '#5C5646', textDecoration: 'none' }}>
          Contact
        </a>
        {support && (
          <a href={support} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#5C5646', textDecoration: 'none' }}>
            Support TYFMS
          </a>
        )}
        <a href={SPONSOR_MAILTO} style={{ fontSize: 12, color: '#5C5646', textDecoration: 'none' }}>
          Sponsor inquiry
        </a>
      </div>
    </footer>
  )
}
