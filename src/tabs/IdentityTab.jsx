import { useState, useEffect } from 'react'
import FunFact from '../components/FunFact'

const MODULES = [
  {
    id: 1,
    title: 'Module 1: who are you beyond your uniform?',
    theme: 'self-directed identity construction',
    body: 'For most veterans, military identity is clear: your rank, your unit, your specialty. Those labels define how you act, who you lead, and how others see you. When you separate, those labels change overnight. Many veterans arrive at their next chapter with a plan already in place, which is a real strength. But a plan is not an identity. The work is in discovering who you are when the uniform is off and building a professional self that is genuinely yours.',
    prompts: [
      'Outside of your rank and role, how would you describe yourself to a civilian employer?',
      'What values from your service do you want to carry into your civilian career?',
      'What is one part of your military identity you are ready to evolve as you transition?',
    ],
  },
  {
    id: 2,
    title: 'Module 2: taking ownership of your transition',
    theme: 'proactive engagement and self-investment',
    body: 'Transition programs lay a foundation, but the veterans who move forward most effectively are those who treat the process as personally owned, not externally managed. That means going beyond what is handed to you: finding mentors, asking hard questions, seeking out communities of people who have already navigated the path. The transition is yours to lead. The resources in this guide exist to support that leadership.',
    prompts: [
      'What have you done proactively to prepare for your transition, outside of what was provided for you?',
      'What three things do you wish someone had told you before you began the transition process?',
      'Who or what has been your most valuable resource in this transition, and how did you find it?',
    ],
  },
  {
    id: 3,
    title: 'Module 3: navigating two worlds',
    theme: 'identity navigation at the military-civilian boundary',
    body: 'The military-civilian gap is real. Civilians do not always understand your experience, and you may find yourself constantly translating military language, downplaying your rank, or feeling out of place in a classroom or workplace where no one has served. This friction is normal. What matters is learning to hold both identities at once without erasing either one. Your military background is a genuine asset. The work is in finding the language to make others see it that way too.',
    prompts: [
      'Describe a moment when you felt the gap between your military identity and your civilian environment. How did you handle it?',
      'What parts of your military background do civilians tend to misunderstand? How do you explain them?',
      'How has your definition of leadership changed since leaving or preparing to leave the military?',
    ],
  },
  {
    id: 4,
    title: 'Module 4: building your support system',
    theme: 'institutional gaps and informal alternatives',
    body: "Veteran resource centers exist on many campuses and in many communities, but they do not always reach everyone who needs them. Research shows that faculty mentors, professors who take time to understand a veteran's background, often fill a gap that formal programs leave open. Building your support network means being proactive: finding the people who understand where you come from, whether that is a veteran advisor, a professor who served, or a peer who is a few months ahead of you in the same transition.",
    prompts: [
      'Who in your current environment has been most helpful to your transition? What made them effective?',
      'What gaps exist in the formal support available to you? What informal solutions have you found?',
      'What is one connection you will make this month to strengthen your support network?',
    ],
  },
]

export default function IdentityTab() {
  const [open, setOpen] = useState({})
  const [responses, setResponses] = useState({})
  const [feedbacks, setFeedbacks] = useState({})
  const [feedbackLoading, setFeedbackLoading] = useState({})
  const [feedbackErrors, setFeedbackErrors] = useState({})

  useEffect(() => {
    const saved = localStorage.getItem('vtg_identity_responses')
    if (saved) setResponses(JSON.parse(saved))
  }, [])

  function toggleMod(id) {
    setOpen(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function handleChange(modId, promptIdx, value) {
    setResponses(prev => {
      const next = { ...prev, [`${modId}-${promptIdx}`]: value }
      localStorage.setItem('vtg_identity_responses', JSON.stringify(next))
      return next
    })
  }

  function hasResponses(modId, prompts) {
    return prompts.some((_, i) => responses[`${modId}-${i}`]?.trim())
  }

  async function getFeedback(mod) {
    setFeedbackErrors(prev => ({ ...prev, [mod.id]: '' }))
    setFeedbackLoading(prev => ({ ...prev, [mod.id]: true }))
    const filled = mod.prompts
      .map((prompt, i) => ({ prompt, response: responses[`${mod.id}-${i}`] || '' }))
      .filter(r => r.response.trim())
    try {
      const r = await fetch('/api/identity-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleTitle: mod.title, theme: mod.theme, responses: filled }),
      })
      const data = await r.json()
      if (!r.ok) { setFeedbackErrors(prev => ({ ...prev, [mod.id]: data.error || 'Something went wrong.' })); return }
      setFeedbacks(prev => ({ ...prev, [mod.id]: data.feedback }))
    } catch {
      setFeedbackErrors(prev => ({ ...prev, [mod.id]: 'Could not reach the server. Try again.' }))
    } finally {
      setFeedbackLoading(prev => ({ ...prev, [mod.id]: false }))
    }
  }

  return (
    <div>
      <p className="sec-title">Identity guide</p>
      <p className="sec-sub">
        Identity reconstruction is an ongoing process of reflection, practice, and growth.
        Work through these four modules at your own pace. After filling in the prompts, use
        the AI feedback button to get personalized next steps — your answers don't disappear
        into a void here.
      </p>

      {MODULES.map(mod => (
        <div key={mod.id}>
          <button className="mhd" onClick={() => toggleMod(mod.id)}>
            <span>{mod.title}</span>
            <span style={{ fontSize: 20, color: '#888' }}>{open[mod.id] ? '−' : '+'}</span>
          </button>

          {open[mod.id] && (
            <div style={{ marginBottom: 12 }}>
              <div className="card">
                <p style={{ fontSize: 12, color: '#5f5e5a', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.05em' }}>
                  Theme: {mod.theme}
                </p>
                <p style={{ fontSize: 14, color: '#1a1a18', lineHeight: 1.7, marginBottom: 16 }}>{mod.body}</p>
                <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Reflection prompts</p>

                {mod.prompts.map((prompt, i) => (
                  <div key={i}>
                    <label>{i + 1}. {prompt}</label>
                    <textarea
                      style={{ marginBottom: i < mod.prompts.length - 1 ? 12 : 16, minHeight: 70 }}
                      placeholder="Write your thoughts here..."
                      value={responses[`${mod.id}-${i}`] || ''}
                      onChange={e => handleChange(mod.id, i, e.target.value)}
                    />
                  </div>
                ))}

                <button
                  className="btn-b"
                  onClick={() => getFeedback(mod)}
                  disabled={!hasResponses(mod.id, mod.prompts) || feedbackLoading[mod.id]}
                  style={{ marginTop: 4 }}
                >
                  {feedbackLoading[mod.id]
                    ? 'Reading your responses...'
                    : feedbacks[mod.id]
                    ? 'Refresh feedback'
                    : 'Get personalized feedback'}
                </button>

                {feedbackErrors[mod.id] && (
                  <p style={{ color: '#a32d2d', fontSize: 13, marginTop: 8 }}>{feedbackErrors[mod.id]}</p>
                )}

                {feedbacks[mod.id] && (
                  <div className="ai-feedback">
                    <p className="label">Personalized feedback</p>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{feedbacks[mod.id]}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      <FunFact />
    </div>
  )
}
