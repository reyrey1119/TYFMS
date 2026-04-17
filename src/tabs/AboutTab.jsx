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
      <p className="sec-title">About TYFMS</p>
      <p className="sec-sub">
        TYFMS — Thank You For Your Military Service — was built on a simple observation: the phrase
        is everywhere, and it means almost nothing. Veterans deserve more than a sentence. They deserve
        real tools, grounded in research, for the hardest professional transition most people will ever face.
      </p>

      {/* Origin story */}
      <div className="card" style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 12, color: '#5f5e5a', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>
          Origin
        </p>
        <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 12, color: '#1a1a18' }}>
          Built from field research, not assumptions
        </p>
        <p style={{ fontSize: 14, color: '#1a1a18', lineHeight: 1.8, marginBottom: 12 }}>
          TYFMS began as a research project into veteran identity transition — specifically, how
          service members reconstruct their professional identity after separation. The research
          involved extended conversations with veterans at different stages of transition: recent
          separatees navigating campus life, mid-career veterans pivoting to second careers, and
          senior leaders who had made the crossing years earlier and could name exactly what helped.
        </p>
        <p style={{ fontSize: 14, color: '#1a1a18', lineHeight: 1.8 }}>
          What emerged from that research was not a checklist or a program. It was a picture of
          how identity reconstruction actually works — what accelerates it, what stalls it, and
          what most institutional programs miss entirely. TYFMS is an attempt to put that picture
          in the hands of every veteran who needs it.
        </p>
      </div>

      {/* Research pillars */}
      <p className="cat-label" style={{ marginBottom: 12 }}>What the research found</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {RESEARCH_POINTS.map(p => (
          <div key={p.title} className="card">
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{p.icon}</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>{p.title}</p>
                <p style={{ fontSize: 13, color: '#5f5e5a', lineHeight: 1.7 }}>{p.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mission */}
      <div className="insight" style={{ marginBottom: 20 }}>
        <p className="label">Our mission</p>
        <p>
          To replace empty thanks with real tools. Every feature in TYFMS — the skills translator,
          the identity guide, the peer network, the goal tracker — exists because field research
          identified it as something veterans actually need and too rarely find in one place.
          The work is ongoing. So is the transition.
        </p>
      </div>

      {/* Built by */}
      <div className="card" style={{ marginBottom: 8 }}>
        <p style={{ fontSize: 12, color: '#5f5e5a', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>
          Built by
        </p>
        <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Reynaldo Rodriguez</p>
        <p style={{ fontSize: 13, color: '#5f5e5a', lineHeight: 1.7 }}>
          Researcher, builder, and advocate for veteran transition. This platform grew from years
          of listening to veterans describe a process that institutions were not fully equipped to
          support — and a conviction that better tools, grounded in their actual experience, could
          change that.
        </p>
      </div>

      <FunFact />
    </div>
  )
}
