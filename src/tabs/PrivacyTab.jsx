export default function PrivacyTab({ onClose }) {
  const sections = [
    {
      title: 'Information we collect',
      body: `When you create an account, we collect your email address and password (stored securely via Supabase Auth). When you join the veteran network, we collect your display name, branch, MOS/AFSC, role (mentor/mentee), bio, and contact information you choose to provide. When you use the progress tracker, we store your goals and their completion status. We do not collect your name, phone number, or any payment information.`,
    },
    {
      title: 'How we use your information',
      body: `Your account information is used solely to authenticate you and associate your goals and network profile with your account. Network profiles you create are visible to other TYFMS users. Goals are private and visible only to you. We do not sell, rent, or share your personal information with third parties for marketing purposes.`,
    },
    {
      title: 'Cookies and local storage',
      body: `TYFMS uses browser localStorage to save your identity guide reflections and, when you are not signed in, your goals and network entries. We use session cookies set by Supabase for authentication. We do not use tracking cookies of our own. Third-party services on this site (see Advertising below) may set their own cookies subject to their own privacy policies.`,
    },
    {
      title: 'Google AdSense advertising',
      body: `TYFMS displays ads served by Google AdSense (publisher ID: ca-pub-9783766249592608). Google may use cookies and web beacons to serve ads based on your prior visits to this and other websites. Google's use of advertising cookies enables it and its partners to serve ads based on your visit to this site and other sites on the internet. You may opt out of personalized advertising by visiting Google's Ads Settings at adssettings.google.com. For more information about how Google uses data when you use its partners' sites or apps, visit google.com/policies/privacy/partners.`,
    },
    {
      title: 'Supabase data storage',
      body: `User account data, network profiles, and goals are stored in a Supabase-hosted PostgreSQL database. Supabase is a U.S.-based service. Data is protected by row-level security policies that prevent any user from accessing another user's private data. Supabase's privacy policy is available at supabase.com/privacy. Authentication tokens are stored in your browser's secure cookie storage and expire after your session ends.`,
    },
    {
      title: 'Account deletion',
      body: `You can delete your account and all associated data instantly and directly — no need to email anyone. When you are signed in, click "Delete account" in the header. You will be asked to confirm. Upon confirmation, your account and all associated data are permanently deleted immediately.\n\nNote that reflection responses saved in the Identity Guide are stored only in your browser's localStorage and can be cleared at any time by clearing your browser's site data for tyfms.com.`,
    },
    {
      title: 'Data retention',
      body: `We retain your account data for as long as your account is active. If you delete your account, all associated data is permanently removed from our database. Anonymous usage data is not collected or retained.`,
    },
    {
      title: "Children's privacy",
      body: `TYFMS is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.`,
    },
    {
      title: 'Changes to this policy',
      body: `We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. Continued use of TYFMS after changes are posted constitutes acceptance of the updated policy.`,
    },
    {
      title: 'Contact',
      body: `For any questions about this Privacy Policy or your data, contact us at:\n\nTYFMS Support Team\nEmail: tyfmsapp@gmail.com\nWebsite: tyfms.com`,
    },
  ]

  return (
    <div>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#185fa5', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', marginBottom: 16, padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}
        >
          ← Back
        </button>
      )}

      <p className="sec-title">Privacy Policy</p>
      <p style={{ fontSize: 13, color: '#5f5e5a', marginBottom: 24 }}>
        Effective date: April 16, 2026 &nbsp;·&nbsp; tyfms.com
      </p>

      <p style={{ fontSize: 14, color: '#1a1a18', lineHeight: 1.75, marginBottom: 24 }}>
        TYFMS ("we," "our," or "us") is committed to protecting your privacy. This policy explains
        what information we collect, how we use it, and your rights regarding your data.
      </p>

      {sections.map((s, i) => (
        <div key={i} className="card" style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>{s.title}</p>
          <p style={{ fontSize: 13, color: '#5f5e5a', lineHeight: 1.75, whiteSpace: 'pre-line' }}>{s.body}</p>
        </div>
      ))}
    </div>
  )
}
