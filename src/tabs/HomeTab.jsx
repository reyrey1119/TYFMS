export default function HomeTab({ onNavigate }) {
  const cards = [
    { id: 'translator', icon: '🎯', title: 'Skills translator', desc: 'Turn your MOS or AFSC into civilian career language' },
    { id: 'identity',   icon: '🧭', title: 'Identity guide',    desc: 'Rebuild your professional identity one module at a time' },
    { id: 'network',    icon: '🤝', title: 'Networking',        desc: 'Connect with mentors and peers who share your background' },
    { id: 'tracker',    icon: '📋', title: 'Progress tracker',  desc: 'Set goals and track your journey' },
    { id: 'resources',  icon: '📚', title: 'Resources',         desc: 'VA benefits, education, career tools, and more' },
  ]

  return (
    <div>
      <p className="sec-title">Your transition starts with you.</p>
      <p className="sec-sub">
        Built from field research with veterans navigating the path from military service to civilian careers,
        this guide puts identity reconstruction in your hands. Use it at your own pace, return to it when needed,
        and share it with others on the same road.
      </p>
      <div className="grid-5">
        {cards.map(c => (
          <div key={c.id} className="card" style={{ cursor: 'pointer' }} onClick={() => onNavigate(c.id)}>
            <p style={{ fontSize: 18, marginBottom: 6 }}>{c.icon}</p>
            <p style={{ fontWeight: 500, fontSize: 13, marginBottom: 4 }}>{c.title}</p>
            <p style={{ fontSize: 12, color: '#5f5e5a' }}>{c.desc}</p>
          </div>
        ))}
      </div>
      <div className="insight">
        <p className="label">Research insight</p>
        <p>
          Veterans who thrive in transition treat the process as self-directed work. They seek out mentors,
          ask questions, and actively build new professional identities. This guide is designed to support
          every step of that process.
        </p>
      </div>
    </div>
  )
}
