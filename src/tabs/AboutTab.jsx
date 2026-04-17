import FunFact from '../components/FunFact'

const RESEARCH_POINTS = [
  {
    icon: '🔍',
    title: 'Identity is the real transition',
    body: 'Field research with transitioning veterans revealed a consistent finding: the hardest part of leaving the military is not finding a job — it is figuring out who you are when the uniform comes off. Rank, unit, and specialty are more than a job description. They are an identity system. When that system dissolves overnight, veterans face a reconstruction challenge that no transition checklist fully addresses.',
  },
  {
    icon: '🧭',
    title: 'Proactive ownership changes outcomes',
    body: 'Veterans who treated their transition as self-directed work — finding mentors independently, asking hard questions, seeking communities of people already on the other side — reported significantly smoother paths than those who waited for institutional support to lead the way. The resources exist. The difference is in who goes looking for them.',
  },
  {
    icon: '🌉',
    title: 'Two identities can coexist',
    body: 'The military-civilian gap is real, but it is not a wall. Veterans who thrived learned to hold both identities simultaneously — translating their background without erasing it, and finding civilian language for experiences that civilians often underestimate. The goal is not to become someone new. It is to bring who you already are into a new context.',
  },
  {
    icon: '🤝',
    title: 'Informal networks fill formal gaps',
    body: 'Official veteran support programs reach many people, but not everyone who needs them. What actually filled the gap, in study after study, was informal connection: a professor who had served, a peer two months ahead in the same transition, a mentor found through a community rather than a program. TYFMS is built to be that connection.',
  },
]

export default function AboutTab() {
  return (
    <div>
      {/* Magazine hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0f1e0f 0%, #1a3a1a 60%, #0f2e1e 100%)',
        borderRadius: 16, padding: 'clamp(32px,5vw,56px) clamp(24px,5vw,48px)',
        marginBottom: 32, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -60, right: -60, width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(15,110,86,.3) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#9fba9f', textTransform: 'uppercase', letterSpacing: '.15em', marginBottom: 16 }}>
            About TYFMS
          </p>
          <h2 style={{ fontSize: 'clamp(28px,5vw,52px)', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: 20, letterSpacing: '-.02em' }}>
            Veterans deserve more<br />than an empty phrase.
          </h2>
          <p style={{ fontSize: 'clamp(14px,2vw,17px)', color: '#9fba9f', lineHeight: 1.65, maxWidth: 540 }}>
            TYFMS was built from field research, not assumptions — because the real transition
            challenge is not finding a job. It is figuring out who you are when the uniform comes off.
          </p>
        </div>
      </div>

      {/* Research findings — 2-column card grid */}
      <p className="cat-label" style={{ marginBottom: 14 }}>What the research found</p>
      <div className="grid-2" style={{ marginBottom: 32 }}>
        {RESEARCH_POINTS.map(p => (
          <div key={p.title} className="card">
            <span style={{ fontSize: 30, display: 'block', marginBottom: 12 }}>{p.icon}</span>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a18', marginBottom: 8 }}>{p.title}</p>
            <p style={{ fontSize: 13, color: '#5f5e5a', lineHeight: 1.75 }}>{p.body}</p>
          </div>
        ))}
      </div>

      {/* Origin story */}
      <div style={{ borderLeft: '4px solid #0f6e56', paddingLeft: 20, marginBottom: 32 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#0f6e56', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>
          Origin story
        </p>
        <p style={{ fontSize: 16, fontWeight: 600, color: '#1a1a18', marginBottom: 14 }}>
          Built from field research, not assumptions
        </p>
        <p style={{ fontSize: 14, color: '#1a1a18', lineHeight: 1.85, marginBottom: 12 }}>
          TYFMS began as a research project into veteran identity transition — specifically, how
          service members reconstruct their professional identity after separation. The research
          involved extended conversations with veterans at different stages: recent separatees
          navigating campus life, mid-career veterans pivoting to second careers, and senior leaders
          who could name exactly what helped.
        </p>
        <p style={{ fontSize: 14, color: '#1a1a18', lineHeight: 1.85 }}>
          What emerged was not a checklist or a program. It was a picture of how identity
          reconstruction actually works — what accelerates it, what stalls it, and what most
          institutional programs miss entirely. TYFMS is an attempt to put that picture in the
          hands of every veteran who needs it.
        </p>
      </div>

      {/* Mission statement */}
      <div className="insight" style={{ marginBottom: 32 }}>
        <p className="label">Our mission</p>
        <p style={{ fontSize: 16, fontWeight: 600, color: '#085041', lineHeight: 1.4, marginBottom: 8 }}>
          To replace empty thanks with real tools.
        </p>
        <p>
          Every feature in TYFMS — the skills translator, the identity guide, the peer network,
          the goal tracker — exists because field research identified it as something veterans
          actually need and too rarely find in one place. The work is ongoing. So is the transition.
        </p>
      </div>

      {/* Personal section */}
      <p className="cat-label" style={{ marginBottom: 12 }}>The person behind it</p>
      <div className="card" style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%', background: '#0f6e56',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <span style={{ color: '#fff', fontSize: 22, fontWeight: 700 }}>R</span>
        </div>
        <div>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#1a1a18', marginBottom: 4 }}>Reynaldo Rodriguez</p>
          <p style={{ fontSize: 12, color: '#0f6e56', marginBottom: 10 }}>Researcher · Builder · Veteran advocate</p>
          <p style={{ fontSize: 13, color: '#5f5e5a', lineHeight: 1.75 }}>
            This platform grew from years of listening to veterans describe a transition process
            that institutions were not fully equipped to support — and a conviction that better
            tools, grounded in their actual experience, could change that. TYFMS is the result
            of that listening turned into action.
          </p>
        </div>
      </div>

      <FunFact />
    </div>
  )
}
