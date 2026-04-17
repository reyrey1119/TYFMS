import { useState, useEffect } from 'react'
import FunFact from '../components/FunFact'
import TransitionTimeline from '../components/TransitionTimeline'

const DAILY_TIPS = [
  { tip: "Your military experience is more transferable than you think. Start by writing down three skills you used every day in service.", label: "Skill inventory" },
  { tip: "Reach out to one person in your target industry this week. Veterans are often surprised by how much respect civilians have for their service.", label: "Networking" },
  { tip: "LinkedIn is one of the most powerful tools for veteran transition. If you haven't updated your profile this month, now is the time.", label: "Career" },
  { tip: "The GI Bill covers more than tuition — books, housing, and fees too. Compare schools using the VA's GI Bill Comparison Tool before deciding.", label: "Education" },
  { tip: "You don't have to become a new person in transition. Your military identity doesn't disappear — it expands.", label: "Identity" },
  { tip: "Veteran Service Organizations (VSOs) can help you navigate VA claims at no cost. Contact a VSO before filing on your own.", label: "Benefits" },
  { tip: "Mental health support is not weakness — it's mission readiness for your next chapter. The Veterans Crisis Line is 988, then press 1.", label: "Wellbeing" },
  { tip: "Set one concrete goal this week. Not a list — just one. Veterans who set specific goals report faster, smoother transitions.", label: "Focus" },
  { tip: "O*NET is a free tool that maps military codes directly to civilian occupations. Try searching your MOS or AFSC right now.", label: "Career tools" },
  { tip: "Hiring Our Heroes hosts fellowships that place transitioning service members with civilian employers. Applications open year-round.", label: "Jobs" },
  { tip: "When translating your experience, drop the acronyms. Every military term that needs explaining is an opportunity to reframe as a civilian strength.", label: "Communication" },
  { tip: "Student Veterans of America chapters are on nearly every major campus. They offer peer support, resources, and a community that gets it.", label: "Education" },
  { tip: "Rank matters less in civilian life than results. Lead with what you accomplished — numbers, outcomes, scale — not your title.", label: "Resume" },
  { tip: "Your clearance is an asset. Many private sector roles in defense, tech, and government contracting specifically seek cleared candidates.", label: "Clearance" },
  { tip: "Transition takes longer than you expect and shorter than you fear. Most veterans report finding their footing within 12 to 18 months.", label: "Perspective" },
  { tip: "Veteran-owned small businesses are a growing sector. The Small Business Administration has programs specifically for veteran entrepreneurs.", label: "Entrepreneurship" },
  { tip: "Your ability to work under pressure, lead in ambiguity, and execute without complete information is rare in the civilian workforce — say it plainly.", label: "Strengths" },
  { tip: "TAP (Transition Assistance Program) is a starting point, not the finish line. The most prepared veterans build beyond what the program offers.", label: "Planning" },
  { tip: "A mentor who has already made your transition is worth more than any checklist. Look for them in LinkedIn veteran groups, VSOs, and alumni networks.", label: "Mentorship" },
  { tip: "Free LinkedIn Premium is available to veterans and military spouses. Use it to see who has viewed your profile and reach out directly.", label: "Networking" },
  { tip: "The civilian job interview is not a debrief — it's a two-way conversation. Ask questions. Show curiosity. That signals confidence.", label: "Interview" },
  { tip: "VR&E (Veteran Readiness and Employment) can pay for education or training if you have a service-connected disability. You may qualify without knowing it.", label: "Benefits" },
  { tip: "Every piece of military training you received has a civilian equivalent certification. Research which credentials are recognized in your target field.", label: "Certifications" },
  { tip: "Mission first still applies — your mission is now your career. Treat job searching like an operation: set objectives, gather intel, execute daily.", label: "Mindset" },
  { tip: "Your identity is not your job title. The work of transition is separating who you are from what you did — and that takes time. Give yourself that time.", label: "Identity" },
  { tip: "Informational interviews are free and underused. Ask someone in a role you want for 20 minutes of their time. Most people say yes.", label: "Networking" },
  { tip: "Federal jobs are a natural bridge for many veterans. USAJOBS.gov has a specific filter for veteran preference — use it.", label: "Federal jobs" },
  { tip: "Your DD-214 is one of the most important documents you own. Keep multiple certified copies in separate locations.", label: "Documentation" },
  { tip: "The transition from leading a team to being an individual contributor is one of the hardest adjustments. It is temporary. Your leadership will be recognized.", label: "Leadership" },
  { tip: "Give an Hour offers free mental health care to post-9/11 veterans. You do not need to be in crisis to benefit from a professional conversation.", label: "Wellbeing" },
]

const STATS = [
  {
    stat: '~200,000',
    label: 'veterans separate from U.S. military service every year',
    source: 'U.S. Dept of Veterans Affairs, 2023',
  },
  {
    stat: 'Identity first',
    label: 'The primary obstacle in transition is not finding a job — it is reconstructing professional identity',
    source: 'Rumann & Hamrick, 2010',
  },
  {
    stat: 'Mentorship works',
    label: 'Peer and faculty mentorship significantly smooths identity transitions for student veterans',
    source: 'DiRamio & Jarvis, 2011',
  },
]

const FEATURE_CARDS = [
  { id: 'path',       icon: '🧭', title: 'Find your path',    desc: 'Discover your veteran career archetype with a 12-question assessment' },
  { id: 'translator', icon: '🎯', title: 'Skills translator', desc: 'Turn your MOS, AFSC, or rate into civilian job titles and career paths' },
  { id: 'resume',     icon: '📄', title: 'Resume builder',    desc: 'Generate a tailored civilian resume from your military background' },
]

export default function HomeTab({ onNavigate }) {
  const dayIndex = Math.floor(Date.now() / 86400000)
  const todaysTip = DAILY_TIPS[dayIndex % DAILY_TIPS.length]

  return (
    <div>
      {/* Hero */}
      <div className="hero" style={{
        backgroundImage: 'url(/hero.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        marginBottom: 32,
      }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 16,
          background: 'linear-gradient(135deg, rgba(15,30,15,0.82) 0%, rgba(15,46,30,0.72) 100%)',
        }} />
        <div style={{ position: 'relative' }}>
          <p className="hero-eyebrow">Veteran Transition Platform</p>
          <h1 className="hero-title">TYFMS</h1>
          <p className="hero-tagline">No more empty thanks — just real tools for the next mission.</p>
        </div>
      </div>

      {/* Daily tip */}
      <div style={{
        background: '#fff', border: '1px solid #d3d1c7', borderRadius: 12,
        padding: '16px 20px', marginBottom: 36, display: 'flex', gap: 14, alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>💡</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#C07A28', textTransform: 'uppercase', letterSpacing: '.08em' }}>
              Daily tip
            </p>
            <span className="bg" style={{ fontSize: 10, padding: '2px 7px' }}>{todaysTip.label}</span>
          </div>
          <p style={{ fontSize: 13, color: '#1a1a18', lineHeight: 1.7 }}>{todaysTip.tip}</p>
        </div>
      </div>

      {/* Feature highlight cards */}
      <p className="cat-label" style={{ marginBottom: 14 }}>Start here</p>
      <div className="grid-3" style={{ marginBottom: 12 }}>
        {FEATURE_CARDS.map(c => (
          <div key={c.id} className="card" style={{ cursor: 'pointer', padding: '24px 20px' }} onClick={() => onNavigate(c.id)}>
            <p style={{ fontSize: 28, marginBottom: 10 }}>{c.icon}</p>
            <p style={{ fontWeight: 600, fontSize: 14, color: '#1a1a18', marginBottom: 6 }}>{c.title}</p>
            <p style={{ fontSize: 13, color: '#5f5e5a', lineHeight: 1.55 }}>{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Career trends teaser */}
      <div
        className="card"
        style={{ cursor: 'pointer', marginBottom: 36, padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}
        onClick={() => onNavigate('trends')}
      >
        <div>
          <span className="bg" style={{ fontSize: 10, padding: '2px 8px', marginBottom: 8, display: 'inline-block' }}>Updated weekly</span>
          <p style={{ fontWeight: 600, fontSize: 14, color: '#1a1a18', marginBottom: 4 }}>Career trends this week</p>
          <p style={{ fontSize: 13, color: '#5f5e5a', lineHeight: 1.5 }}>
            Booming sectors and high-demand roles veterans are uniquely positioned to fill right now →
          </p>
        </div>
        <span style={{ fontSize: 28, flexShrink: 0 }}>📈</span>
      </div>

      {/* By the numbers */}
      <p className="cat-label" style={{ marginBottom: 14 }}>By the numbers</p>
      <div className="grid-3" style={{ marginBottom: 36 }}>
        {STATS.map(s => (
          <div key={s.stat} className="card">
            <p style={{ fontSize: 22, fontWeight: 800, color: '#1a1a18', marginBottom: 6, letterSpacing: '-.02em', lineHeight: 1.1 }}>
              {s.stat}
            </p>
            <p style={{ fontSize: 12, color: '#1a1a18', lineHeight: 1.55, marginBottom: 8 }}>{s.label}</p>
            <p style={{ fontSize: 10, color: '#b4b2a9' }}>{s.source}</p>
          </div>
        ))}
      </div>

      {/* Transition timeline */}
      <TransitionTimeline />

      {/* Research insight */}
      <div className="insight" style={{ marginBottom: 32 }}>
        <p className="label">Research insight</p>
        <p>
          Veterans who thrive in transition treat the process as self-directed work. They seek out mentors,
          ask questions, and actively build new professional identities. This guide is designed to support
          every step of that process.
        </p>
      </div>

      <FunFact />
    </div>
  )
}
