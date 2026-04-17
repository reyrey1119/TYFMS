import { useState, useEffect } from 'react'
import AdUnit from '../components/AdUnit'

const QUESTIONS = [
  {
    q: 'In your military role, you were most energized by:',
    options: [
      'Developing plans and anticipating problems before they happen',
      'Working with equipment, systems, or technical challenges',
      'Protecting your team and ensuring no one was left behind',
      'Training others and building unit cohesion',
    ],
  },
  {
    q: 'Your ideal civilian work environment is:',
    options: [
      'Fast-paced and strategic — where your analysis shapes decisions',
      'Hands-on and results-driven — where you can see what you build',
      'Structured and mission-clear — where standards matter',
      'People-centered — where relationships are the work',
    ],
  },
  {
    q: 'When a complex problem hits, your instinct is to:',
    options: [
      'Step back, map the whole situation, and build a plan',
      'Get hands-on and work through it directly',
      'Identify the risk and make sure everyone stays safe',
      'Get the team together and solve it collectively',
    ],
  },
  {
    q: 'A civilian recruiter asks what you\'re proudest of. You say:',
    options: [
      'The operations I planned that executed flawlessly',
      'The technical problems I solved that others couldn\'t',
      'The standards I held even when it was hard',
      'The people I trained who went on to lead',
    ],
  },
  {
    q: 'In five years, you want to be:',
    options: [
      'In a leadership or strategy role shaping organizational direction',
      'A recognized expert in a high-demand technical field',
      'In a role with clear accountability and real-world safety or quality impact',
      'Managing and developing a team I\'ve built from scratch',
    ],
  },
  {
    q: 'Which matters more to you in a job?',
    options: [
      'Influence over how decisions are made',
      'Mastery of a specific domain or discipline',
      'Stability, accountability, and a mission worth serving',
      'Strong culture and relationships at work',
    ],
  },
  {
    q: 'Your risk tolerance in a new career is:',
    options: [
      'Calculated — I want to understand the full landscape before committing',
      'Practical — I\'ll take on challenges if I have the right tools',
      'Conservative — I prefer proven paths with clear standards',
      'Social — I\'ll take risks if my network is with me',
    ],
  },
  {
    q: 'The type of work that would drain you fastest:',
    options: [
      'Pure execution with no room for strategy or improvement',
      'Desk work with no tangible output or skill application',
      'Roles with no accountability, no standards, and no clear mission',
      'Isolated work with no collaboration or human contact',
    ],
  },
  {
    q: 'You\'ll know your civilian career is on track when:',
    options: [
      'I have a seat at the table where major decisions are made',
      'I\'m the go-to expert others call when the problem is hard',
      'I\'m trusted to hold the standard no matter the pressure',
      'I\'m known for the people I\'ve developed and the culture I\'ve built',
    ],
  },
  {
    q: 'Former leaders would most likely describe you as:',
    options: [
      'Always two steps ahead — a sharp operator',
      'The go-to person when the technical problem seemed impossible',
      'Reliable, disciplined, never cut corners',
      'A natural leader who made everyone around them better',
    ],
  },
  {
    q: 'When you think about your transition, your biggest question is:',
    options: [
      'How do I position my strategic thinking for senior civilian roles?',
      'How do I get credit for the technical skills I built in service?',
      'How do I find a role with the same sense of mission and accountability?',
      'How do I build the kind of professional network I had in the military?',
    ],
  },
  {
    q: 'Your transition goal, if you\'re honest with yourself:',
    options: [
      'A senior leadership position where I can shape strategy',
      'Technical work built on the expertise I spent years developing',
      'A career that keeps people safer, healthier, or better served',
      'A legacy of people I\'ve developed and a team that reflects my values',
    ],
  },
]

const ARCHETYPES = {
  Strategist: {
    label: 'The Strategist',
    color: '#185fa5',
    tagline: 'Big-picture thinking. Systems-level impact.',
    desc: 'You see the whole board when others see one square. In the military, you were the person others turned to when the mission needed a clear-eyed analysis and a plan that would hold under pressure. In civilian life, those same instincts translate directly to leadership, operations, and strategic roles.',
    roles: ['Operations Manager', 'Strategy Analyst', 'Program Manager', 'Policy Advisor', 'Project Director'],
    sectors: ['Consulting', 'Finance', 'Government', 'Defense Contracting', 'Technology'],
    tip: 'Lead with outcomes, not titles. Frame your military experience around the scale of decisions you influenced and the complexity you navigated.',
  },
  Builder: {
    label: 'The Builder',
    color: '#0A7868',
    tagline: 'Hands-on mastery. Tangible results.',
    desc: 'You thrive when there is something real to build, fix, or improve. In the military, you were the one who kept systems running, solved the technical problems no one else could crack, and found deep satisfaction in mastery. Civilian employers in technical fields are actively looking for veterans with exactly that background.',
    roles: ['Systems Engineer', 'Project Manager', 'Technical Specialist', 'Skilled Tradesperson', 'Entrepreneur'],
    sectors: ['Engineering', 'Technology', 'Manufacturing', 'Construction', 'Defense Contractors'],
    tip: 'Your military technical training often exceeds what civilian employers expect. Research which certifications map directly to your specialty — many are faster to earn than you think.',
  },
  Guardian: {
    label: 'The Guardian',
    color: '#a32d2d',
    tagline: 'Accountability under pressure. Mission above self.',
    desc: 'You built your career around holding the line — maintaining standards, protecting your team, and ensuring no one was left exposed. That instinct for reliability, safety, and mission-readiness is exactly what regulated industries are paying premium salaries for right now.',
    roles: ['Law Enforcement Officer', 'Healthcare Administrator', 'Security Manager', 'Compliance Officer', 'Quality Assurance Lead'],
    sectors: ['Healthcare', 'Public Safety', 'Law Enforcement', 'Logistics', 'Quality Management'],
    tip: 'Civilian employers in regulated industries are actively recruiting veterans. Your ability to maintain standards under pressure is genuinely rare — don\'t underplay it on your resume.',
  },
  Connector: {
    label: 'The Connector',
    color: '#7c3aad',
    tagline: 'People-first leadership. Culture as mission.',
    desc: 'Your greatest military strength was the team you built and the ones you developed. You understood that mission success always runs through people — and that insight is exactly what civilian organizations pay premium rates for. Your ability to build trust, develop talent, and hold teams together under adversity is a rare skill set.',
    roles: ['HR Manager', 'Corporate Trainer', 'Account Manager', 'Social Worker', 'Community Outreach Director'],
    sectors: ['Education', 'Human Resources', 'Nonprofits', 'Sales', 'Healthcare'],
    tip: 'Lead every application with a people story. Quantify culture: team size you led, retention rates you maintained, promotions you helped earn.',
  },
}

const ARCH_KEYS = ['Strategist', 'Builder', 'Guardian', 'Connector']

export default function PathTab() {
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null))
  const [phase, setPhase] = useState('questions') // 'questions' | 'interstitial' | 'results'
  const [archetype, setArchetype] = useState(null)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (phase !== 'interstitial' || countdown === 0) return
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, countdown])

  function setAnswer(qIdx, optIdx) {
    setAnswers(prev => { const n = [...prev]; n[qIdx] = optIdx; return n })
  }

  const allAnswered = answers.every(a => a !== null)
  const answered = answers.filter(a => a !== null).length

  function startInterstitial() {
    const scores = { Strategist: 0, Builder: 0, Guardian: 0, Connector: 0 }
    answers.forEach(a => { if (a !== null) scores[ARCH_KEYS[a]]++ })
    const top = Object.entries(scores).sort((x, y) => y[1] - x[1])[0][0]
    setArchetype(top)
    setPhase('interstitial')
    setCountdown(5)
  }

  function restart() {
    setAnswers(Array(QUESTIONS.length).fill(null))
    setPhase('questions')
    setArchetype(null)
    setCountdown(5)
  }

  if (phase === 'interstitial') {
    return (
      <div>
        <p className="sec-title">Almost there.</p>
        <p className="sec-sub">
          TYFMS is free for every veteran. Support the mission by viewing a brief message below.
        </p>
        <AdUnit slot="6514090037" />
        <div className="card" style={{ textAlign: 'center', padding: '28px 20px' }}>
          {countdown > 0 ? (
            <>
              <p style={{ fontSize: 32, fontWeight: 800, color: '#0f6e56', marginBottom: 8 }}>{countdown}</p>
              <p style={{ fontSize: 14, color: '#5f5e5a' }}>Your results unlock in {countdown} second{countdown !== 1 ? 's' : ''}…</p>
            </>
          ) : (
            <>
              <p style={{ fontSize: 15, fontWeight: 500, color: '#1a1a18', marginBottom: 16 }}>Your archetype is ready.</p>
              <button className="btn-g" onClick={() => setPhase('results')} style={{ maxWidth: 260, margin: '0 auto' }}>
                See my results
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  if (phase === 'results' && archetype) {
    const a = ARCHETYPES[archetype]
    return (
      <div>
        <div style={{
          background: `linear-gradient(135deg, ${a.color}18 0%, ${a.color}08 100%)`,
          border: `1px solid ${a.color}40`, borderRadius: 16, padding: '28px 24px', marginBottom: 20,
        }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: a.color, textTransform: 'uppercase', letterSpacing: '.15em', marginBottom: 8 }}>
            Your archetype
          </p>
          <p style={{ fontSize: 28, fontWeight: 800, color: '#1a1a18', marginBottom: 6, letterSpacing: '-.01em' }}>{a.label}</p>
          <p style={{ fontSize: 14, fontWeight: 500, color: a.color, marginBottom: 16 }}>{a.tagline}</p>
          <p style={{ fontSize: 14, color: '#1a1a18', lineHeight: 1.75 }}>{a.desc}</p>
        </div>

        <div className="grid-2" style={{ marginBottom: 20 }}>
          <div className="card">
            <p className="cat-label" style={{ marginBottom: 10 }}>Target roles</p>
            {a.roles.map(r => (
              <div key={r} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 7 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: a.color, flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: '#1a1a18' }}>{r}</p>
              </div>
            ))}
          </div>
          <div className="card">
            <p className="cat-label" style={{ marginBottom: 10 }}>Target sectors</p>
            {a.sectors.map(s => (
              <div key={s} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 7 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: a.color, flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: '#1a1a18' }}>{s}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="insight" style={{ marginBottom: 24 }}>
          <p className="label">Career translation tip</p>
          <p>{a.tip}</p>
        </div>

        <button onClick={restart} style={{
          padding: '10px 20px', background: 'none', border: '1px solid #d3d1c7',
          borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: '#5f5e5a',
        }}>
          Retake the assessment
        </button>
      </div>
    )
  }

  return (
    <div>
      <p className="sec-title">Find your path.</p>
      <p className="sec-sub">
        12 questions. No wrong answers. Discover which of four veteran career archetypes matches how you think,
        lead, and operate — and get a tailored roadmap for your civilian transition.
      </p>

      {/* Progress bar */}
      <div style={{ background: '#f5f4f0', borderRadius: 8, height: 6, marginBottom: 24, overflow: 'hidden' }}>
        <div style={{
          height: '100%', background: '#0f6e56', borderRadius: 8,
          width: `${(answered / QUESTIONS.length) * 100}%`, transition: 'width .2s', background: '#C07A28',
        }} />
      </div>
      <p style={{ fontSize: 12, color: '#5f5e5a', marginBottom: 20, marginTop: -18 }}>
        {answered} of {QUESTIONS.length} answered
      </p>

      {QUESTIONS.map((q, qi) => (
        <div key={qi} className="card" style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#1a1a18', marginBottom: 12, lineHeight: 1.5 }}>
            {qi + 1}. {q.q}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {q.options.map((opt, oi) => (
              <button
                key={oi}
                onClick={() => setAnswer(qi, oi)}
                style={{
                  padding: '9px 14px', borderRadius: 8, border: '1px solid',
                  borderColor: answers[qi] === oi ? '#C07A28' : '#d3d1c7',
                  background: answers[qi] === oi ? '#FDF4E7' : '#fff',
                  cursor: 'pointer', fontFamily: 'inherit', fontSize: 13,
                  color: answers[qi] === oi ? '#8A5F1A' : '#1a1a18',
                  textAlign: 'left', lineHeight: 1.5, transition: 'all .12s',
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}

      <button
        className="btn-g"
        onClick={startInterstitial}
        disabled={!allAnswered}
        style={{ marginTop: 8 }}
      >
        {allAnswered ? 'See my results' : `Answer all ${QUESTIONS.length - answered} remaining question${QUESTIONS.length - answered !== 1 ? 's' : ''} to continue`}
      </button>
    </div>
  )
}
