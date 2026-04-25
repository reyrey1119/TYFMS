// Supabase setup:
// CREATE TABLE identity_reflections (
//   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
//   user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
//   answers jsonb NOT NULL DEFAULT '{}'::jsonb,
//   created_at timestamptz DEFAULT now(),
//   updated_at timestamptz DEFAULT now()
// );
// ALTER TABLE identity_reflections ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "users see own reflections" ON identity_reflections FOR ALL USING (auth.uid() = user_id);
// CREATE UNIQUE INDEX identity_reflections_user_id_idx ON identity_reflections(user_id);

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const REFLECTION_QUESTIONS = [
  {
    id: 'situation',
    factor: 'Situation',
    color: '#1B3A6B',
    question: 'When did you separate (or when do you plan to), and what has changed most in your daily life since then?',
    placeholder: "e.g. Separated 6 months ago. Biggest change has been the lack of structure and not knowing what I'm working toward.",
  },
  {
    id: 'self_strengths',
    factor: 'Self',
    color: '#C07A28',
    question: 'How would you describe yourself to a civilian who knows nothing about the military — in terms of who you are, not what you did?',
    placeholder: "e.g. I'm someone who thrives in ambiguity, makes decisions fast, and takes care of the people around me.",
  },
  {
    id: 'self_struggle',
    factor: 'Self',
    color: '#C07A28',
    question: 'What has been the hardest part of your identity to carry into civilian life?',
    placeholder: "e.g. I led a team of 25 people. Now I'm an entry-level candidate and it feels like I've lost a rank I earned.",
  },
  {
    id: 'support',
    factor: 'Support',
    color: '#0A7868',
    question: 'Who in your life has been most helpful in this transition — and who do you wish you had access to?',
    placeholder: "e.g. My spouse has been supportive but doesn't fully get it. I could really use a mentor who made a similar move.",
  },
  {
    id: 'strategies',
    factor: 'Strategies',
    color: '#7c3aad',
    question: 'What does a successful transition look like for you — and what is one thing standing between you and that picture right now?',
    placeholder: "e.g. Success means a meaningful role in project management. The obstacle is not knowing how to talk about myself in interviews.",
  },
]

const OPENING =
  "Welcome to the TYFMS Identity Guide. I'm here to help you work through one of the most important — and most overlooked — parts of transition: figuring out who you are when the uniform comes off.\n\nThis isn't a checklist. It's a conversation. Start wherever feels right.\n\nWhat's been the hardest part of your transition so far?"

const PHASE_MAP = [
  { min: 0, label: null, color: '#b4b2a9' },
  { min: 1, label: 'Awareness', color: '#C07A28' },
  { min: 3, label: 'Exploration', color: '#1B3A6B' },
  { min: 6, label: 'Articulation', color: '#7c3aad' },
  { min: 10, label: 'Integration', color: '#0A7868' },
]

const STARTERS = [
  "Tell me about the hardest adjustment you've made since leaving service.",
  "I'm not sure who I am outside of my military role. Where do I even start?",
  "Walk me through what my transition has looked like so far.",
]

function getPhase(userMsgCount) {
  let phase = PHASE_MAP[0]
  for (const p of PHASE_MAP) {
    if (userMsgCount >= p.min) phase = p
  }
  return phase
}

export default function IdentityTab() {
  const { user, supabaseEnabled } = useAuth()
  const useDb = supabaseEnabled && !!supabase && !!user

  // Reflections state
  const [reflectionAnswers, setReflectionAnswers] = useState({})
  const [reflectionsComplete, setReflectionsComplete] = useState(false)
  const [reflectionsLoaded, setReflectionsLoaded] = useState(false)
  const [reflectionStep, setReflectionStep] = useState(0)
  const [savingReflections, setSavingReflections] = useState(false)

  const [messages, setMessages] = useState([{ role: 'assistant', content: OPENING }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [statement, setStatement] = useState('')
  const [statementLoading, setStatementLoading] = useState(false)
  const [statementCopied, setStatementCopied] = useState(false)
  const [sessionLoaded, setSessionLoaded] = useState(false)
  const endRef = useRef(null)

  // Load saved reflections
  useEffect(() => {
    if (reflectionsLoaded) return
    // Try localStorage first (works without sign-in)
    const local = localStorage.getItem('identity_reflections')
    if (local) {
      try {
        const parsed = JSON.parse(local)
        const allAnswered = REFLECTION_QUESTIONS.every(q => parsed[q.id]?.trim())
        if (allAnswered) {
          setReflectionAnswers(parsed)
          setReflectionsComplete(true)
          setReflectionsLoaded(true)
          return
        }
      } catch {}
    }
    if (!useDb) { setReflectionsLoaded(true); return }
    supabase.from('identity_reflections').select('answers').eq('user_id', user.id).single()
      .then(({ data }) => {
        if (data?.answers) {
          const allAnswered = REFLECTION_QUESTIONS.every(q => data.answers[q.id]?.trim())
          if (allAnswered) {
            setReflectionAnswers(data.answers)
            setReflectionsComplete(true)
          }
        }
        setReflectionsLoaded(true)
      })
  }, [useDb, user, reflectionsLoaded])

  async function saveReflections(answers) {
    localStorage.setItem('identity_reflections', JSON.stringify(answers))
    if (useDb) {
      await supabase.from('identity_reflections').upsert(
        { user_id: user.id, answers, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      )
    }
  }

  async function submitReflections() {
    const allAnswered = REFLECTION_QUESTIONS.every(q => reflectionAnswers[q.id]?.trim())
    if (!allAnswered) return
    setSavingReflections(true)
    await saveReflections(reflectionAnswers)
    setSavingReflections(false)
    setReflectionsComplete(true)
  }

  function buildReflectionContext() {
    if (!reflectionsComplete) return ''
    return REFLECTION_QUESTIONS.map(q =>
      `${q.factor} — ${q.question}\nAnswer: ${reflectionAnswers[q.id] || ''}`
    ).join('\n\n')
  }

  // Load saved session
  useEffect(() => {
    if (!useDb || sessionLoaded) return
    async function load() {
      const { data } = await supabase
        .from('identity_chats')
        .select('messages')
        .eq('user_id', user.id)
        .single()
      if (data?.messages && Array.isArray(data.messages) && data.messages.length > 1) {
        setMessages(data.messages)
      }
      setSessionLoaded(true)
    }
    load()
  }, [useDb, user, sessionLoaded])

  // Save session on message change
  useEffect(() => {
    if (!useDb || !sessionLoaded || messages.length <= 1) return
    supabase.from('identity_chats').upsert(
      { user_id: user.id, messages, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    )
  }, [messages, useDb, user, sessionLoaded])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const userMsgCount = messages.filter(m => m.role === 'user').length
  const phase = getPhase(userMsgCount)

  async function send(overrideText) {
    const text = (overrideText || input).trim()
    if (!text || loading) return
    const userMsg = { role: 'user', content: text }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setLoading(true)
    setError('')
    const apiMessages = updated.slice(1).map(m => ({ role: m.role, content: m.content }))
    const reflectionContext = buildReflectionContext()
    try {
      const r = await fetch('/api/identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'chat', messages: apiMessages, reflectionContext: reflectionContext || undefined }),
      })
      const data = await r.json()
      if (!r.ok) { setError(data.error || 'Something went wrong.'); return }
      const next = [...updated, { role: 'assistant', content: data.reply }]
      setMessages(next)
    } catch {
      setError('Could not reach the server. Try again.')
    } finally {
      setLoading(false)
    }
  }

  async function generateStatement() {
    setStatementLoading(true)
    setStatement('')
    try {
      const r = await fetch('/api/identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'statement', messages }),
      })
      const data = await r.json()
      if (data.statement) setStatement(data.statement)
      else setError(data.error || 'Could not generate statement.')
    } catch {
      setError('Could not reach the server.')
    } finally {
      setStatementLoading(false)
    }
  }

  function copyStatement() {
    navigator.clipboard.writeText(statement).then(() => {
      setStatementCopied(true)
      setTimeout(() => setStatementCopied(false), 2000)
    })
  }

  function clearChat() {
    setMessages([{ role: 'assistant', content: OPENING }])
    setInput('')
    setError('')
    setStatement('')
    setSessionLoaded(true)
    if (useDb) {
      supabase.from('identity_chats').delete().eq('user_id', user.id)
    }
  }

  return (
    <div>
      <div style={{ width: '100%', maxHeight: 220, borderRadius: 12, marginBottom: 20, overflow: 'hidden', background: '#f5f4f0', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
        <img src="/identity.png" alt="Identity guide" style={{ width: '100%', maxHeight: 220, objectFit: 'contain', objectPosition: 'top', display: 'block' }} />
      </div>

      <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#b4b2a9', marginBottom: 4 }}>Knowing Your Self</p>
      <p className="sec-title">Identity guide</p>
      <p className="sec-sub">
        The hardest part of transition isn't finding a job — it's figuring out who you are when the uniform comes off.
        Have a real conversation with your AI mentor below. Your session is saved if you sign in.
      </p>

      {/* Pre-chat reflection questions */}
      {reflectionsLoaded && !reflectionsComplete && (
        <div style={{ marginBottom: 24 }}>
          <div style={{
            background: 'linear-gradient(135deg, #1B3A6B 0%, #0f2857 100%)',
            borderRadius: 14, padding: '18px 20px', marginBottom: 20,
          }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6 }}>
              Before we start
            </p>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8, lineHeight: 1.3 }}>
              5 quick reflections — your AI mentor uses these to personalize the conversation.
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>
              These map to Schlossberg's 4S framework: Situation, Self, Support, and Strategies.
              They take about 3 minutes. Answers are saved to your account if you're signed in.
            </p>
          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 20, alignItems: 'center' }}>
            {REFLECTION_QUESTIONS.map((q, i) => (
              <div
                key={q.id}
                onClick={() => setReflectionStep(i)}
                style={{
                  width: i === reflectionStep ? 20 : 8,
                  height: 8, borderRadius: 4, cursor: 'pointer', transition: 'all .2s',
                  background: reflectionAnswers[q.id]?.trim()
                    ? q.color
                    : i === reflectionStep ? '#1B3A6B' : '#E5E3DC',
                }}
              />
            ))}
            <p style={{ fontSize: 11, color: '#b4b2a9', marginLeft: 6 }}>
              {reflectionStep + 1} of {REFLECTION_QUESTIONS.length}
            </p>
          </div>

          {/* Current question */}
          {REFLECTION_QUESTIONS.map((q, i) => i !== reflectionStep ? null : (
            <div key={q.id}>
              <div style={{
                display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 14,
                padding: '12px 14px', background: '#fff', border: '1px solid #E5E3DC',
                borderLeft: `4px solid ${q.color}`, borderRadius: '0 10px 10px 0',
              }}>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 600, color: q.color, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>
                    {q.factor}
                  </p>
                  <p style={{ fontSize: 14, color: '#1a1a18', fontWeight: 500, lineHeight: 1.55 }}>{q.question}</p>
                </div>
              </div>
              <textarea
                value={reflectionAnswers[q.id] || ''}
                onChange={e => setReflectionAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                placeholder={q.placeholder}
                rows={3}
                style={{
                  width: '100%', fontSize: 13, borderRadius: 8, border: '1px solid #d3d1c7',
                  padding: '10px 12px', fontFamily: 'inherit', resize: 'vertical',
                  boxSizing: 'border-box', lineHeight: 1.6,
                }}
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                {reflectionStep > 0 && (
                  <button
                    onClick={() => setReflectionStep(s => s - 1)}
                    style={{
                      padding: '8px 16px', background: '#fff', border: '1px solid #d3d1c7',
                      borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: '#5f5e5a',
                    }}
                  >
                    Back
                  </button>
                )}
                {reflectionStep < REFLECTION_QUESTIONS.length - 1 ? (
                  <button
                    onClick={() => setReflectionStep(s => s + 1)}
                    disabled={!reflectionAnswers[q.id]?.trim()}
                    style={{
                      padding: '8px 18px', background: reflectionAnswers[q.id]?.trim() ? '#1B3A6B' : '#d3d1c7',
                      border: 'none', borderRadius: 8, fontSize: 13,
                      cursor: reflectionAnswers[q.id]?.trim() ? 'pointer' : 'default',
                      fontFamily: 'inherit', color: '#fff', fontWeight: 500,
                    }}
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={submitReflections}
                    disabled={savingReflections || !REFLECTION_QUESTIONS.every(rq => reflectionAnswers[rq.id]?.trim())}
                    style={{
                      padding: '8px 18px', background: '#C07A28',
                      border: 'none', borderRadius: 8, fontSize: 13,
                      cursor: 'pointer', fontFamily: 'inherit', color: '#fff', fontWeight: 600,
                    }}
                  >
                    {savingReflections ? 'Saving…' : 'Start the conversation →'}
                  </button>
                )}
                <button
                  onClick={() => setReflectionsComplete(true)}
                  style={{
                    padding: '8px 14px', background: 'none', border: 'none',
                    fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', color: '#b4b2a9',
                  }}
                >
                  Skip for now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reflections complete — show summary chip */}
      {reflectionsComplete && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
          padding: '10px 14px', background: '#F0F7EE', border: '1px solid #B8DDB8', borderRadius: 10,
        }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>✓</span>
          <p style={{ fontSize: 12, color: '#1a6614', flex: 1 }}>
            <strong>4S reflections complete.</strong> Your AI mentor has your context and will personalize the conversation.
          </p>
          <button
            onClick={() => { setReflectionsComplete(false); setReflectionStep(0) }}
            style={{ background: 'none', border: 'none', fontSize: 11, color: '#0A7868', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}
          >
            Edit
          </button>
        </div>
      )}

      {/* Progress phase indicator */}
      {phase.label && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
          padding: '10px 14px', background: '#fff', border: '1px solid #E5E3DC',
          borderLeft: `4px solid ${phase.color}`, borderRadius: '0 10px 10px 0',
        }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, color: phase.color, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 1 }}>
              Identity phase
            </p>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a18' }}>{phase.label}</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
            {['Awareness', 'Exploration', 'Articulation', 'Integration'].map((p, i) => {
              const pColors = ['#C07A28', '#1B3A6B', '#7c3aad', '#0A7868']
              const pMins = [1, 3, 6, 10]
              const active = userMsgCount >= pMins[i]
              return (
                <div key={p} style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: active ? pColors[i] : '#E5E3DC',
                }} title={p} />
              )
            })}
          </div>
        </div>
      )}

      {/* Session status */}
      {useDb && (
        <p style={{ fontSize: 11, color: '#b4b2a9', marginBottom: 10 }}>
          {sessionLoaded && messages.length > 1 ? '✓ Session saved to your account' : 'Session will be saved automatically'}
        </p>
      )}

      {/* Chat messages */}
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="chat-bubble-ai" style={{ color: '#b4b2a9', fontStyle: 'italic' }}>
            Thinking…
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Conversation starters (shown only at start) */}
      {userMsgCount === 0 && !loading && (
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 11, color: '#b4b2a9', marginBottom: 8, fontWeight: 500 }}>
            NOT SURE WHERE TO START? TAP ONE:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {STARTERS.map(s => (
              <button
                key={s}
                onClick={() => send(s)}
                style={{
                  padding: '9px 14px', background: '#fff', border: '1px solid #E5E3DC',
                  borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13,
                  color: '#1a1a18', textAlign: 'left', lineHeight: 1.5,
                  transition: 'border-color .12s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#C07A28'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E3DC'}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p style={{ fontSize: 12, color: '#a32d2d', marginBottom: 8 }}>{error}</p>}

      {/* Input */}
      <div className="chat-input-area">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          placeholder="Type your response… (Enter to send, Shift+Enter for new line)"
          disabled={loading}
          style={{ flex: 1, minHeight: 72, maxHeight: 160, resize: 'vertical' }}
        />
        <button
          onClick={() => send()}
          disabled={loading || !input.trim()}
          style={{
            padding: '10px 18px', background: '#1B3A6B', border: 'none',
            borderRadius: 8, color: '#fff', fontSize: 13,
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', fontWeight: 500, flexShrink: 0,
            opacity: loading || !input.trim() ? 0.55 : 1,
          }}
        >
          Send
        </button>
      </div>

      {/* Identity statement generator */}
      {userMsgCount >= 6 && (
        <div style={{ marginTop: 20, padding: '16px 18px', background: '#fff', border: '1px solid #E5E3DC', borderRadius: 12 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a18', marginBottom: 4 }}>
            Identity statement
          </p>
          <p style={{ fontSize: 13, color: '#5f5e5a', marginBottom: 12, lineHeight: 1.6 }}>
            Based on this conversation, generate a 2–3 sentence professional identity statement you can use in interviews, LinkedIn, and networking introductions.
          </p>
          {!statement ? (
            <button
              onClick={generateStatement}
              disabled={statementLoading}
              style={{
                padding: '8px 18px', background: '#C07A28', border: 'none',
                borderRadius: 8, color: '#fff', fontSize: 13,
                cursor: statementLoading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', fontWeight: 500,
                opacity: statementLoading ? 0.6 : 1,
              }}
            >
              {statementLoading ? 'Generating…' : 'Generate my identity statement'}
            </button>
          ) : (
            <div>
              <div style={{ padding: '12px 14px', background: '#F5F4F0', borderRadius: 8, marginBottom: 10 }}>
                <p style={{ fontSize: 14, color: '#1a1a18', lineHeight: 1.75, fontStyle: 'italic' }}>{statement}</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={copyStatement}
                  style={{
                    padding: '6px 14px', background: statementCopied ? '#0A7868' : '#fff',
                    border: '1px solid #E5E3DC', borderRadius: 8, fontSize: 12,
                    cursor: 'pointer', fontFamily: 'inherit',
                    color: statementCopied ? '#fff' : '#5f5e5a',
                  }}
                >
                  {statementCopied ? '✓ Copied' : 'Copy'}
                </button>
                <button
                  onClick={generateStatement}
                  disabled={statementLoading}
                  style={{
                    padding: '6px 14px', background: 'none', border: '1px solid #E5E3DC',
                    borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', color: '#5f5e5a',
                  }}
                >
                  Regenerate
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {messages.length > 1 && (
        <button
          onClick={clearChat}
          style={{
            marginTop: 12, background: 'none', border: 'none', color: '#b4b2a9',
            fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', padding: 0,
          }}
        >
          Start over
        </button>
      )}

      <div className="insight" style={{ marginTop: 28 }}>
        <p className="label">Research insight</p>
        <p>
          Veterans who invest time in identity reflection — not just job searching — report significantly smoother
          transitions. The goal is not to become someone new. It is to bring who you already are into a new context.
        </p>
      </div>
    </div>
  )
}
