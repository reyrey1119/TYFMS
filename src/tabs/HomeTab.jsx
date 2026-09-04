import { useState } from 'react'
import FunFact from '../components/FunFact'
import { Icon } from '../components/icons'

const TRANSITION_STATS = [
  {
    stat: '200,000+',
    desc: 'veterans separate from service every year',
    source: 'U.S. Department of Veterans Affairs',
  },
  {
    stat: '6–12 months',
    desc: 'average time for veterans to find civilian employment after separation',
    source: 'Bureau of Labor Statistics',
  },
  {
    stat: '12+ months',
    desc: 'of advance planning is associated with significantly better employment alignment with skills',
    source: 'Institute for Veterans and Military Families',
  },
]

const FAQ_ITEMS = [
  {
    q: 'Is TYFMS really free?',
    a: 'Yes, completely free. No subscriptions, no hidden fees, no premium tiers. Every tool on this site — the Resume Builder, Skills Translator, Identity Guide, Document Vault, and everything else — is available to every veteran and service member at no cost. The site is supported by Google AdSense display ads.',
  },
  {
    q: 'Who is TYFMS for?',
    a: 'TYFMS is built for anyone navigating the military-to-civilian transition — active duty service members preparing to separate, veterans who have already transitioned and are still finding their footing, National Guard and Reserve members, and military spouses. If the uniform is part of your life, this site is for you.',
  },
  {
    q: 'How does the Resume Builder work?',
    a: 'You enter your military background, upload your service documents (OERs, NCOERs, award citations, DD-214, or Joint Service Transcript), and paste in a job description for the role you are targeting. The AI reads your actual service record and the official duty descriptions for your MOS from DA PAM 600-3 and DA PAM 600-25, then builds a resume tailored to that specific job. It scores your resume against the job description and tells you exactly what to improve before you apply.',
  },
  {
    q: 'What is the Joint Service Transcript and why does it matter?',
    a: 'The Joint Service Transcript (JST) is your official military education and training transcript. It documents every course you completed during your service and recommends college credit for them through the American Council on Education. Most veterans have never heard of it. You can get yours free at jst.doded.mil — it takes about 10 minutes. Upload it to your TYFMS Document Vault and the Resume Builder will use your actual training record to build your resume.',
  },
  {
    q: 'Is my personal information safe?',
    a: 'Yes. All data is stored in a SOC 2 compliant database with Row Level Security enabled — meaning only you can access your own data. Documents uploaded to the Document Vault are stored in a private storage bucket accessible only to your account. TYFMS does not sell, share, or monetize your personal information. The site does not require your Social Security Number.',
  },
  {
    q: 'What branches of service does TYFMS support?',
    a: 'TYFMS supports Army (officers and enlisted), Air Force (officers and enlisted), Navy, and Marine Corps. Coast Guard and Space Force support is coming soon. The MOS and rating lookup system uses official government publications including DA PAM 600-3, DA PAM 600-25, NAVPERS 18068F, and MCO 1200.17.',
  },
  {
    q: 'What is the Identity Guide?',
    a: 'The Identity Guide is a confidential AI conversation that helps you figure out who you are beyond your rank and MOS. Research shows that the hardest part of military transition isn\'t finding a job — it\'s the identity shift that happens when the structure and purpose of military life disappear. The Identity Guide helps you find the language to talk about yourself, your values, and your strengths in civilian terms.',
  },
  {
    q: 'How is TYFMS different from TAP?',
    a: 'TAP (Transition Assistance Program) is mandatory and time-limited — you go through it once before you separate. TYFMS is available to you before, during, and after your transition, as many times as you need it. TAP gives you information. TYFMS gives you tools you can use at any point in the process.',
  },
]

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
    icon: 'bolt',
    title: 'Translate your MOS',
    body: 'Type in your MOS or AFSC and get civilian job titles, transferable skills, and certifications in 60 seconds.',
    buttonText: 'Start translating →',
    tab: 'translator',
  },
  {
    icon: 'document',
    title: 'Build your resume',
    body: 'Turn your military experience into a targeted civilian resume for any company or industry.',
    buttonText: 'Build my resume →',
    tab: 'resume',
  },
  {
    icon: 'compass',
    title: 'Find your path',
    body: 'Not sure what career fits you? Answer 12 questions and get a personalized civilian career roadmap based on your strengths, interests, and military background.',
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
    desc: 'Not sure what career fits you? The "Find Your Path" assessment helps you figure out what to do next — 12 questions, personalized roadmap.',
  },
  {
    letter: 'S',
    label: 'Self',
    color: '#C07A28',
    tab: 'identity',
    desc: 'Know what job you want but struggling to explain who you are? The Identity Guide helps you find the language to tell your story in interviews and on paper.',
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
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div>
      {/* Hero — official-record document card */}
      <div className="hero">
        <p className="mono-tag" style={{ fontSize: 11, color: '#8F8768', letterSpacing: '.06em', marginBottom: 14 }}>
          FORM TYFMS-1 · TRANSITION RECORD
        </p>
        <h1 className="hero-title">Thank You For My Service</h1>
        <p className="hero-tagline">No more empty thanks — just real tools for the next mission.</p>
        <p style={{ fontSize: 13, color: '#5C5646', lineHeight: 1.7, maxWidth: 480, marginBottom: 16 }}>
          Every tool here maps to one of four factors that determine how well veterans transition:
          your Situation, your Self, your Support, and your Strategies.
        </p>
        <button
          onClick={() => setShowApproach(true)}
          style={{
            background: '#211F19', border: 'none', borderRadius: 3, color: '#E7E0C6', fontSize: 12.5,
            fontWeight: 600, cursor: 'pointer', padding: '9px 16px', fontFamily: 'inherit', letterSpacing: '.02em',
          }}
        >
          Our approach →
        </button>
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
                <p style={{ fontSize: 20, fontWeight: 800, color: '#211F19', lineHeight: 1.2 }}>
                  The 4S Framework
                </p>
              </div>
              <button
                onClick={() => setShowApproach(false)}
                style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#726B4E', lineHeight: 1, padding: 0, flexShrink: 0 }}
              >×</button>
            </div>
            <p style={{ fontSize: 14, color: '#5C5646', lineHeight: 1.75, marginBottom: 20 }}>
              TYFMS is built around Schlossberg's Transition Theory — one of the most robust
              frameworks in transition research. It identifies four factors that determine whether
              a transition goes well or falls apart. Every tool in this app addresses at least one.
            </p>
            {SCHLOSSBERG_4S.map(s => (
              <div
                key={s.label}
                style={{
                  display: 'flex', gap: 14, marginBottom: 14, padding: '14px 16px',
                  background: '#EFE7CD', borderRadius: 12, borderLeft: `4px solid ${s.color}`,
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
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#211F19', marginBottom: 4 }}>{s.label}</p>
                  <p style={{ fontSize: 12, color: '#5C5646', lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </div>
            ))}
            <p style={{ fontSize: 11, color: '#8F8768', marginTop: 8, lineHeight: 1.6 }}>
              Source: Schlossberg, N. K. (1981). A model for analyzing human adaptation to transition.
              The Counseling Psychologist, 9(2), 2–18.
            </p>
          </div>
        </div>
      )}


      {/* Daily tip */}
      <div style={{
        background: '#fff', border: '1px solid #D6CBA3', borderRadius: 4,
        padding: '16px 20px', marginBottom: 48, display: 'flex', gap: 14, alignItems: 'flex-start',
      }}>
        <span style={{ flexShrink: 0, marginTop: 1, color: '#C07A28' }}><Icon name="lightbulb" size={22} /></span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#C07A28', textTransform: 'uppercase', letterSpacing: '.08em' }}>
              Daily tip
            </p>
            <span className="bg" style={{ fontSize: 10, padding: '2px 7px' }}>{todaysTip.label}</span>
          </div>
          <p style={{ fontSize: 13, color: '#211F19', lineHeight: 1.7 }}>{todaysTip.tip}</p>
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
            <span style={{ color: '#C07A28', marginBottom: 12, display: 'block' }}><Icon name={c.icon} size={26} /></span>
            <p style={{ fontWeight: 700, fontSize: 15, color: '#211F19', marginBottom: 10 }}>{c.title}</p>
            <p style={{ fontSize: 13, color: '#5C5646', lineHeight: 1.7, flex: 1 }}>{c.body}</p>
            <p style={{ marginTop: 16, fontSize: 13, fontWeight: 600, color: '#C07A28' }}>{c.buttonText}</p>
          </div>
        ))}
      </div>

      {/* Why We Built This */}
      <div style={{ marginBottom: 52, padding: '36px 28px', background: 'linear-gradient(135deg, #0f1b4d 0%, #1B3A6B 100%)', borderRadius: 16 }}>
        <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.12em', color: '#C07A28', marginBottom: 6 }}>Our Story</p>
        <p style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', lineHeight: 1.2, marginBottom: 0 }}>Why We Built This</p>
        <div style={{ width: 48, height: 3, background: '#C07A28', borderRadius: 2, margin: '12px 0 24px' }} />
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.80)', lineHeight: 1.8, marginBottom: 20 }}>
          Most transition resources hand you a checklist and call it support. Update your resume. Attend a TAP class.
          Connect on LinkedIn. Check the boxes and good luck out there.
        </p>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.80)', lineHeight: 1.8, marginBottom: 20 }}>
          But anyone who has actually left the military knows the hardest part isn't finding a job listing.
          It's the moment you realize the structure, the identity, the sense of purpose that came with wearing
          the uniform — none of that transfers automatically. You spent years knowing exactly who you were.
          Your rank told people how to address you. Your MOS told people what you did. Your unit told people
          where you belonged. And then one day, none of that follows you through the door.
        </p>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.80)', lineHeight: 1.8, marginBottom: 28 }}>
          TYFMS was built because that gap is real and it deserved a real response. Not another generic job board.
          Not another PDF of tips. A platform grounded in actual research on how people navigate major life
          transitions — built by a veteran who has lived it, for veterans who are living it right now. Every
          tool on this site is designed around one idea: the resume works best when it comes from knowing
          yourself first. The Skills Translator helps you see what you actually bring to the civilian world.
          The Identity Guide helps you find the language to talk about who you are beyond your rank. The
          Resume Builder pulls from your real service record — your evaluations, your awards, your actual
          accomplishments — not a template. And it's all free, because access to a good transition shouldn't
          depend on how much money you have left in the bank.
        </p>
        <p style={{ fontSize: 17, fontWeight: 700, color: '#ffffff', lineHeight: 1.6, textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 24, marginBottom: 0 }}>
          We're not done building it. But we built it for you.
        </p>
      </div>

      {/* The Transition Gap Is Real */}
      <div style={{ marginBottom: 52 }}>
        <p className="cat-label" style={{ marginBottom: 6 }}>The Transition Gap Is Real</p>
        <p style={{ fontSize: 14, color: '#5C5646', lineHeight: 1.7, marginBottom: 20, maxWidth: 640 }}>
          The data is clear: military transition is one of the most disruptive life events a person can face.
          Understanding the scope of the challenge is the first step toward navigating it on your own terms.
        </p>
        <div className="grid-3">
          {TRANSITION_STATS.map(s => (
            <div key={s.stat} className="card" style={{ borderTop: '3px solid #1B3A6B' }}>
              <p style={{ fontSize: 28, fontWeight: 800, color: '#1B3A6B', marginBottom: 8, letterSpacing: '-.02em', lineHeight: 1.1 }}>
                {s.stat}
              </p>
              <p style={{ fontSize: 13, color: '#211F19', lineHeight: 1.6, marginBottom: 8 }}>{s.desc}</p>
              <p style={{ fontSize: 10, color: '#8F8768' }}>Source: {s.source}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ marginBottom: 52 }}>
        <p className="cat-label" style={{ marginBottom: 6 }}>Frequently Asked Questions</p>
        <p style={{ fontSize: 14, color: '#5C5646', lineHeight: 1.7, marginBottom: 24, maxWidth: 640 }}>
          Common questions from veterans, service members, and military families about TYFMS and how to get the most out of it.
        </p>
        <div>
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openFaq === i
            return (
              <div
                key={i}
                style={{
                  border: '1px solid #D6CBA3',
                  borderRadius: 10,
                  marginBottom: 8,
                  overflow: 'hidden',
                  background: '#fff',
                }}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  style={{
                    width: '100%', textAlign: 'left', background: 'none', border: 'none',
                    padding: '16px 20px', cursor: 'pointer', display: 'flex',
                    justifyContent: 'space-between', alignItems: 'center', gap: 12,
                    fontFamily: 'inherit',
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#211F19', lineHeight: 1.4 }}>
                    {item.q}
                  </span>
                  <span style={{
                    flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
                    background: isOpen ? '#1B3A6B' : '#ECE3C7',
                    color: isOpen ? '#fff' : '#5C5646',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 700, lineHeight: 1,
                    transition: 'background .15s, color .15s',
                  }}>
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div style={{ padding: '0 20px 18px', borderTop: '1px solid #ECE3C7' }}>
                    <p style={{ fontSize: 13, color: '#2A2820', lineHeight: 1.8, marginTop: 14 }}>
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* By the numbers */}
      <p className="cat-label" style={{ marginBottom: 14 }}>By the numbers</p>
      <div className="grid-3" style={{ marginBottom: 52 }}>
        {STATS.map(s => (
          <div key={s.stat} className="card">
            <p style={{ fontSize: 22, fontWeight: 800, color: '#211F19', marginBottom: 6, letterSpacing: '-.02em', lineHeight: 1.1 }}>
              {s.stat}
            </p>
            <p style={{ fontSize: 12, color: '#211F19', lineHeight: 1.55, marginBottom: 8 }}>{s.label}</p>
            <p style={{ fontSize: 10, color: '#8F8768' }}>{s.source}</p>
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
