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
      {/* BLUF */}
      <div style={{
        background: '#1B3A6B', borderRadius: 10, padding: '14px 20px', marginBottom: 24,
      }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#fff', lineHeight: 1.55 }}>
          TYFMS gives veterans the tools TAP does not. Free, research-backed, and built by someone who served.
        </p>
      </div>

      {/* Top: logo / mission / regulation badge */}
      <div className="about-top">
        {/* Left — logo */}
        <div className="about-logo-col">
          <img src="/logo.png" alt="TYFMS" className="about-logo-img" style={{ height: 'auto', display: 'block' }} />
        </div>

        {/* Center — mission */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#C07A28', textTransform: 'uppercase', letterSpacing: '.15em', marginBottom: 14 }}>
            Our mission
          </p>
          <p style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 900, color: '#1a1a18', lineHeight: 1.1, marginBottom: 18, letterSpacing: '-.02em' }}>
            To replace empty thanks<br />with real tools.
          </p>
          <p style={{ fontSize: 16, color: '#5f5e5a', lineHeight: 1.8 }}>
            Every feature in TYFMS — the skills translator, the identity guide, the peer network,
            the goal tracker — exists because field research identified something veterans
            actually need and too rarely find in one place. The work is ongoing. So is the transition.
          </p>
        </div>

        {/* Right — regulation backed badge */}
        <div className="about-badge">
          <svg viewBox="0 0 120 144" style={{ width: 96, display: 'block', margin: '0 auto 10px' }} aria-hidden="true">
            <path d="M60,6 L110,28 L110,76 C110,108 86,132 60,142 C34,132 10,108 10,76 L10,28 Z" fill="#1B3A6B" />
            <path d="M60,6 L110,28 L110,76 C110,108 86,132 60,142 C34,132 10,108 10,76 L10,28 Z"
              fill="none" stroke="rgba(192,122,40,0.35)" strokeWidth="3" />
            <path d="M38,74 L53,89 L83,57" stroke="#C07A28" strokeWidth="6" fill="none"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#1B3A6B', marginBottom: 5 }}>Regulation Backed</p>
          <p style={{ fontSize: 11, color: '#5f5e5a', lineHeight: 1.55, maxWidth: 160 }}>
            Answers sourced from{' '}
            <span style={{ color: '#C07A28', fontWeight: 600 }}>38 CFR Federal Regulations</span>
          </p>
        </div>
      </div>

      {/* What you walk away with */}
      <p className="cat-label" style={{ marginBottom: 14 }}>What you walk away with</p>
      <div className="grid-3" style={{ marginBottom: 32 }}>
        {[
          {
            icon: '📄',
            title: 'A civilian resume targeted to your dream job',
            body: 'Not a generic template — a resume tailored to the company and role you actually want, with your military experience translated into civilian language that hiring managers respond to.',
          },
          {
            icon: '🧭',
            title: 'A clear picture of which careers match your background',
            body: 'Know exactly which civilian roles your MOS, rank, and experience translate to — and which industries are actively hiring veterans with your profile right now.',
          },
          {
            icon: '🤝',
            title: 'A peer mentor who has already made the crossing',
            body: 'Connect with veterans who transitioned into your target field. No program, no gatekeeping — direct access to people who have done what you are trying to do.',
          },
        ].map(c => (
          <div key={c.title} className="card">
            <span style={{ fontSize: 28, display: 'block', marginBottom: 12 }}>{c.icon}</span>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a18', marginBottom: 8 }}>{c.title}</p>
            <p style={{ fontSize: 13, color: '#5f5e5a', lineHeight: 1.75 }}>{c.body}</p>
          </div>
        ))}
      </div>

      {/* Magazine hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0f1b4d 0%, #1B3A6B 60%, #0f2857 100%)',
        borderRadius: 16, padding: 'clamp(32px,5vw,56px) clamp(24px,5vw,48px)',
        marginBottom: 32, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -60, right: -60, width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(192,122,40,.2) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#fff', textTransform: 'uppercase', letterSpacing: '.15em', marginBottom: 16 }}>
            About TYFMS
          </p>
          <h2 style={{ fontSize: 'clamp(28px,5vw,52px)', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: 20, letterSpacing: '-.02em' }}>
            Veterans deserve more<br />than an empty phrase.
          </h2>
          <p style={{ fontSize: 'clamp(14px,2vw,17px)', color: '#fff', lineHeight: 1.65, maxWidth: 540 }}>
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
      <div style={{ borderLeft: '4px solid #C07A28', paddingLeft: 20, marginBottom: 32 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#C07A28', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>
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

      {/* Our Research Foundation */}
      <div style={{ marginBottom: 32 }}>
        <p className="cat-label" style={{ marginBottom: 14 }}>Our research foundation</p>
        <div className="card" style={{ borderLeft: '4px solid #1B3A6B', borderRadius: '0 12px 12px 0', marginBottom: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#1B3A6B', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>
            Schlossberg's Transition Theory
          </p>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a18', marginBottom: 10 }}>
            The 4S framework behind every TYFMS feature
          </p>
          <p style={{ fontSize: 13, color: '#5f5e5a', lineHeight: 1.75, marginBottom: 10 }}>
            TYFMS is built on Nancy K. Schlossberg's Transition Theory — one of the most robust
            and widely validated frameworks in adult transition research. First published in 1981
            and refined over decades, the theory identifies four factors that determine whether
            a transition succeeds: <strong>Situation</strong> (the context of the change),
            <strong> Self</strong> (who the person is and how they cope),
            <strong> Support</strong> (the people and networks available),
            and <strong>Strategies</strong> (the actions taken). Schlossberg's research showed
            that these four factors — not luck, not timing alone — predict transition outcomes.
          </p>
          <p style={{ fontSize: 13, color: '#5f5e5a', lineHeight: 1.75, marginBottom: 10 }}>
            For veterans, the military-to-civilian transition is one of the most structurally
            complex role changes an adult can navigate. The entire institutional identity —
            rank, unit, mission, belonging — dissolves almost overnight. Schlossberg's framework
            provides a language for what veterans actually experience and a roadmap for addressing
            each dimension systematically rather than by accident.
          </p>
          <p style={{ fontSize: 13, color: '#5f5e5a', lineHeight: 1.75 }}>
            Every feature in TYFMS maps to at least one of the 4S factors. The Skills Translator
            and Identity Guide address <em>Self</em>. The Path assessment clarifies <em>Situation</em>.
            The Veteran Network builds <em>Support</em>. The Resume Builder, Resources, and
            Progress Tracker are your <em>Strategies</em>. The invisible architecture of this
            app is the same framework that researchers have found, repeatedly, to determine
            who transitions well — and who doesn't.
          </p>
        </div>
        <p style={{ fontSize: 11, color: '#b4b2a9', lineHeight: 1.6, paddingLeft: 4 }}>
          Source: Schlossberg, N. K. (1981). A model for analyzing human adaptation to transition.
          The Counseling Psychologist, 9(2), 2–18. See also: Anderson, M. L., Goodman, J., &amp;
          Schlossberg, N. K. (2012). Counseling adults in transition (4th ed.).
        </p>
      </div>

      {/* Built by */}
      <div className="card" style={{ marginBottom: 8, textAlign: 'center', padding: '24px 20px' }}>
        <p style={{ fontSize: 22, fontWeight: 800, color: '#1a1a18', marginBottom: 8, letterSpacing: '-.01em' }}>
          Built by veterans, for veterans.
        </p>
        <p style={{ fontSize: 14, color: '#5f5e5a', lineHeight: 1.75, maxWidth: 480, margin: '0 auto' }}>
          Every tool in TYFMS exists because veterans told us what was missing. The research is real.
          The people it was built for are real. The gap it fills is real.
        </p>
      </div>

      <FunFact />
    </div>
  )
}
