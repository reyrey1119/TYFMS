import { useState } from 'react'

const PHASES = [
  {
    num: 1,
    range: 'Month 1',
    title: 'Paperwork and benefits',
    color: '#185fa5',
    desc: 'The first 30 days are about securing your foundation. File your VA claim early — the sooner you file, the sooner your effective date starts.',
    items: [
      'File your VA disability claim at va.gov',
      'Obtain certified copies of your DD-214',
      'Set up your eBenefits account',
      'Apply for VA healthcare enrollment',
      'Open a SkillBridge or TAP follow-up if applicable',
    ],
  },
  {
    num: 2,
    range: 'Months 2–3',
    title: 'Identity reflection and skills inventory',
    color: '#0A7868',
    desc: 'Who are you when the uniform comes off? This is the most important — and most skipped — work of transition. Don\'t rush it.',
    items: [
      'Complete the Identity Guide modules at your own pace',
      'Use the Skills Translator to map your MOS to civilian roles',
      'Update your LinkedIn profile with translated experience',
      'Research 2–3 target industries or sectors',
      'Connect with veterans 6–12 months ahead of you in transition',
    ],
  },
  {
    num: 3,
    range: 'Months 3–6',
    title: 'Education or job search',
    color: '#ba7517',
    desc: 'Whether you\'re heading to school or directly into the workforce, this phase is about active pursuit — not passive waiting.',
    items: [
      'Apply to GI Bill schools or target companies',
      'Attend at least one career fair or veteran hiring event',
      'Join a Student Veterans of America chapter if in school',
      'Set daily job search or study targets',
      'Use Hiring Our Heroes or LinkedIn for Veterans for applications',
    ],
  },
  {
    num: 4,
    range: 'Months 6–12',
    title: 'First civilian role and adjustment',
    color: '#7c3aad',
    desc: 'The hardest part isn\'t getting the job — it\'s adjusting to a workplace where leadership looks very different. Be patient with yourself.',
    items: [
      'Set 30-60-90 day goals in your new role',
      'Find a mentor inside or outside the organization',
      'Adjust your communication style for civilian culture',
      'Track progress in the Progress Tracker',
      'Stay connected with your veteran network',
    ],
  },
  {
    num: 5,
    range: 'Months 12–18',
    title: 'Identity consolidation and growth',
    color: '#a32d2d',
    desc: 'You\'ve made it through the hardest stretch. Now the work is integrating who you were with who you\'re becoming — and paying it forward.',
    items: [
      'Reflect on how your professional identity has evolved',
      'Celebrate concrete wins and milestones',
      'Mentor a veteran who is a few months behind you',
      'Update your transition goals for the next phase',
      'Share your story — it matters to someone still on the path',
    ],
  },
]

export default function TransitionTimeline() {
  const [open, setOpen] = useState(null)

  return (
    <div style={{ marginBottom: 28 }}>
      <p className="cat-label" style={{ marginBottom: 14 }}>Transition timeline</p>
      <p style={{ fontSize: 13, color: '#5f5e5a', marginBottom: 18, lineHeight: 1.65 }}>
        Most veterans find their footing within 12–18 months. Click any phase to see what to focus on.
      </p>

      {/* Track */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18, overflowX: 'auto', paddingBottom: 4 }}>
        {PHASES.map((p, i) => (
          <div key={p.num} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <button
              onClick={() => setOpen(open === p.num ? null : p.num)}
              style={{
                width: 40, height: 40, borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: open === p.num ? p.color : '#fff',
                color: open === p.num ? '#fff' : p.color,
                fontWeight: 700, fontSize: 15, fontFamily: 'inherit',
                boxShadow: `0 0 0 2.5px ${p.color}`,
                transition: 'all .15s', flexShrink: 0,
              }}
              title={p.title}
            >
              {p.num}
            </button>
            {i < PHASES.length - 1 && (
              <div style={{ height: 3, width: 32, background: '#d3d1c7', flexShrink: 0 }} />
            )}
          </div>
        ))}
        <p style={{ fontSize: 11, color: '#b4b2a9', marginLeft: 12, whiteSpace: 'nowrap', flexShrink: 0 }}>
          18 months
        </p>
      </div>

      {/* Phase labels under track */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 18, overflowX: 'auto' }}>
        {PHASES.map(p => (
          <button
            key={p.num}
            onClick={() => setOpen(open === p.num ? null : p.num)}
            style={{
              flex: '1 0 auto', padding: '6px 8px', borderRadius: 8, border: '1px solid',
              borderColor: open === p.num ? p.color : '#d3d1c7',
              background: open === p.num ? p.color + '12' : '#fff',
              cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
            }}
          >
            <p style={{ fontSize: 10, fontWeight: 600, color: p.color, marginBottom: 1 }}>{p.range}</p>
            <p style={{ fontSize: 11, color: '#1a1a18', lineHeight: 1.3 }}>{p.title}</p>
          </button>
        ))}
      </div>

      {/* Expanded phase detail */}
      {open !== null && (() => {
        const p = PHASES[open - 1]
        return (
          <div className="card" style={{ borderLeft: `4px solid ${p.color}`, borderRadius: '0 12px 12px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{
                width: 28, height: 28, borderRadius: '50%', background: p.color,
                color: '#fff', fontWeight: 700, fontSize: 13, display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {p.num}
              </span>
              <div>
                <p style={{ fontSize: 11, color: p.color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>{p.range}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a18' }}>{p.title}</p>
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#5f5e5a', lineHeight: 1.65, marginBottom: 14 }}>{p.desc}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {p.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{
                    width: 20, height: 20, borderRadius: '50%', border: `1.5px solid ${p.color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, color: p.color, fontWeight: 600, flexShrink: 0, marginTop: 1,
                  }}>
                    {i + 1}
                  </span>
                  <p style={{ fontSize: 13, color: '#1a1a18', lineHeight: 1.5 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        )
      })()}
    </div>
  )
}
