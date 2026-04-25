import { useState } from 'react'
import FunFact from '../components/FunFact'

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

const HELP_CARDS = [
  {
    icon: '⚡',
    title: 'Translate your MOS',
    body: 'Type in your MOS or AFSC and get civilian job titles, transferable skills, and certifications in 60 seconds.',
    buttonText: 'Start translating →',
    tab: 'translator',
  },
  {
    icon: '📄',
    title: 'Build your resume',
    body: 'Turn your military experience into a targeted civilian resume for any company or industry.',
    buttonText: 'Build my resume →',
    tab: 'resume',
  },
  {
    icon: '🧭',
    title: 'Find your path',
    body: '12 questions. Discover your veteran career archetype and get a personalized roadmap for your transition.',
    buttonText: 'Find my path →',
    tab: 'path',
  },
]

const SCHLOSSBERG_4S = [
  {
    letter: 'S',
    label: 'Situation',
    color: '#1B3A6B',
    tab: 'path',
    desc: 'Understanding where you are right now — what has changed, what you\'ve lost, and what\'s possible. The "Find Your Path" assessment starts here.',
  },
  {
    letter: 'S',
    label: 'Self',
    color: '#C07A28',
    tab: 'identity',
    desc: 'Knowing your values, strengths, and identity beyond your rank and MOS. The Identity Guide and Skills Translator help you see yourself clearly.',
  },
  {
    letter: 'S',
    label: 'Support',
    color: '#0A7868',
    tab: 'network',
    desc: 'Building the people around you — mentors, peers, advocates. The Veteran Network connects you to people who have already made your transition.',
  },
  {
    letter: 'S',
    label: 'Strategies',
    color: '#7c3aad',
    tab: 'resume',
    desc: 'Taking action with the right tools — your resume, career plan, and resources. Every tool in TYFMS is a strategy for your next chapter.',
  },
]

export default function HomeTab({ onNavigate }) {
  const dayIndex = Math.floor(Date.now() / 86400000)
  const todaysTip = DAILY_TIPS[dayIndex % DAILY_TIPS.length]
  const [showApproach, setShowApproach] = useState(false)

  return (
    <div>
      {/* Hero — navy overlay, full title */}
      <div className="hero" style={{
        backgroundImage: 'url(/hero.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'top',
        minHeight: 500,
        marginBottom: 32,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(15,27,77,0.88) 0%, rgba(27,58,107,0.80) 100%)',
        }} />
        <div style={{ position: 'relative' }}>
          <h1 className="hero-title">Thank You For My<br />Service (TYFMS)</h1>
          <p className="hero-tagline">No more empty thanks — just real tools for the next mission.</p>
          <p style={{ position: 'relative', fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 12, lineHeight: 1.7, maxWidth: 480 }}>
            Every tool here maps to one of four factors that determine how well veterans transition:
            your Situation, your Self, your Support, and your Strategies.
          </p>
          <button
            onClick={() => setShowApproach(true)}
            style={{
              marginTop: 14, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.35)',
              borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              padding: '7px 14px', fontFamily: 'inherit', letterSpacing: '.02em',
              backdropFilter: 'blur(4px)',
            }}
          >
            Our approach →
          </button>
        </div>
      </div>

      {/* Our Approach modal */}
      {showApproach && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={() => setShowApproach(false)}
        >
          <div
            style={{ background: '#fff', borderRadius: 16, padding: '28px 24px', maxWidth: 520, width: '100%', maxHeight: '85vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#C07A28', marginBottom: 4 }}>
                  Research-backed framework
                </p>
                <p style={{ fontSize: 20, fontWeight: 800, color: '#1a1a18', lineHeight: 1.2 }}>
                  The 4S Framework
                </p>
              </div>
              <button
                onClick={() => setShowApproach(false)}
                style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#888', lineHeight: 1, padding: 0, flexShrink: 0 }}
              >×</button>
            </div>
            <p style={{ fontSize: 14, color: '#5f5e5a', lineHeight: 1.75, marginBottom: 20 }}>
              TYFMS is built around Schlossberg's Transition Theory — one of the most robust
              frameworks in transition research. It identifies four factors that determine whether
              a transition goes well or falls apart. Every tool in this app addresses at least one.
            </p>
            {SCHLOSSBERG_4S.map(s => (
              <div
                key={s.label}
                style={{
                  display: 'flex', gap: 14, marginBottom: 14, padding: '14px 16px',
                  background: '#f9f8f5', borderRadius: 12, borderLeft: `4px solid ${s.color}`,
                  cursor: 'pointer',
                }}
                onClick={() => { setShowApproach(false); onNavigate(s.tab) }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', background: s.color,
                  color: '#fff', fontWeight: 800, fontSize: 15, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {s.letter}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1a18', marginBottom: 4 }}>{s.label}</p>
                  <p style={{ fontSize: 12, color: '#5f5e5a', lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </div>
            ))}
            <p style={{ fontSize: 11, color: '#b4b2a9', marginTop: 8, lineHeight: 1.6 }}>
              Source: Schlossberg, N. K. (1981). A model for analyzing human adaptation to transition.
              The Counseling Psychologist, 9(2), 2–18.
            </p>
          </div>
        </div>
      )}


      {/* Daily tip */}
      <div style={{
        background: '#fff', border: '1px solid #E5E3DC', borderRadius: 12,
        padding: '16px 20px', marginBottom: 48, display: 'flex', gap: 14, alignItems: 'flex-start',
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

      {/* Who this is for */}
      <p className="cat-label" style={{ marginBottom: 14 }}>Where are you in your transition?</p>
      <div className="grid-3" style={{ marginBottom: 52 }}>
        {HELP_CARDS.map(c => (
          <div
            key={c.title}
            className="card audience-card"
            style={{ padding: '28px 22px', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
            onClick={() => onNavigate(c.tab)}
            role="button"
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onNavigate(c.tab) }}
          >
            <p style={{ fontSize: 26, marginBottom: 12 }}>{c.icon}</p>
            <p style={{ fontWeight: 700, fontSize: 15, color: '#1a1a18', marginBottom: 10 }}>{c.title}</p>
            <p style={{ fontSize: 13, color: '#5f5e5a', lineHeight: 1.7, flex: 1 }}>{c.body}</p>
            <p style={{ marginTop: 16, fontSize: 13, fontWeight: 600, color: '#C07A28' }}>{c.buttonText}</p>
          </div>
        ))}
      </div>

      {/* By the numbers */}
      <p className="cat-label" style={{ marginBottom: 14 }}>By the numbers</p>
      <div className="grid-3" style={{ marginBottom: 52 }}>
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

      <div className="insight" style={{ marginBottom: 48 }}>
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
