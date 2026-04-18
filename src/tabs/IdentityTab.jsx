import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

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

  const [messages, setMessages] = useState([{ role: 'assistant', content: OPENING }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [statement, setStatement] = useState('')
  const [statementLoading, setStatementLoading] = useState(false)
  const [statementCopied, setStatementCopied] = useState(false)
  const [sessionLoaded, setSessionLoaded] = useState(false)
  const endRef = useRef(null)

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
    try {
      const r = await fetch('/api/identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'chat', messages: apiMessages }),
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

      <p className="sec-title">Identity guide</p>
      <p className="sec-sub">
        The hardest part of transition isn't finding a job — it's figuring out who you are when the uniform comes off.
        Have a real conversation with your AI mentor below. Your session is saved if you sign in.
      </p>

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
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
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
