export default function Footer({ onPrivacy, className }) {
  return (
    <footer className={className} style={{
      borderTop: '1px solid #d3d1c7', marginTop: 48, padding: '20px 24px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      flexWrap: 'wrap', gap: 8,
    }}>
      <p style={{ fontSize: 12, color: '#b4b2a9' }}>
        © {new Date().getFullYear()} TYFMS. All rights reserved.
      </p>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <button
          onClick={onPrivacy}
          style={{ background: 'none', border: 'none', color: '#5f5e5a', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}
        >
          Privacy Policy
        </button>
        <a href="mailto:tyfmsapp@gmail.com" style={{ fontSize: 12, color: '#5f5e5a', textDecoration: 'none' }}>
          Contact
        </a>
      </div>
    </footer>
  )
}
