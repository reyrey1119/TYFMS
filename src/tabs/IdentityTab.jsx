import { useState, useEffect, useRef } from 'react'

const OPENING =
  "Welcome to the TYFMS Identity Guide. I'm here to help you work through one of the most important — and most overlooked — parts of transition: figuring out who you are when the uniform comes off.\n\nThis isn't a checklist. It's a conversation. Start wherever feels right.\n\nWhat's been the hardest part of your transition so far?"

export default function IdentityTab() {
  const [messages, setMessages] = useState([{ role: 'assistant', content: OPENING }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const endRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send() {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setLoading(true)
    setError('')

    // Skip the hardcoded opening when calling the API — it's part of the system prompt
    const apiMessages = updated.slice(1).map(m => ({ role: m.role, content: m.content }))

    try {
      const r = await fetch('/api/identity-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      })
      const data = await r.json()
      if (!r.ok) {
        setError(data.error || 'Something went wrong.')
        return
      }
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setError('Could not reach the server. Try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  function clearChat() {
    setMessages([{ role: 'assistant', content: OPENING }])
    setInput('')
    setError('')
  }

  return (
    <div>
      <div style={{ width: '100%', maxHeight: 260, borderRadius: 12, marginBottom: 20, overflow: 'hidden', background: '#f5f4f0', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
        <img src="/identity.png" alt="Identity guide" style={{ width: '100%', maxHeight: 260, objectFit: 'contain', objectPosition: 'top', display: 'block' }} />
      </div>

      <p className="sec-title">Identity guide</p>
      <p className="sec-sub">
        The hardest part of transition isn't finding a job — it's figuring out who you are when the uniform comes off.
        This is a conversation, not a form. The AI mentor below will ask you one question at a time and help you work
        through it.
      </p>

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

      {error && (
        <p style={{ fontSize: 12, color: '#a32d2d', marginBottom: 8 }}>{error}</p>
      )}

      {/* Input area */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your response… (Enter to send, Shift+Enter for new line)"
          disabled={loading}
          style={{ flex: 1, minHeight: 72, maxHeight: 160, resize: 'vertical' }}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          style={{
            padding: '10px 18px', background: loading ? '#085041' : '#1B4F8C',
            border: 'none', borderRadius: 8, color: '#fff', fontSize: 13,
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', fontWeight: 500, flexShrink: 0,
            opacity: loading || !input.trim() ? 0.6 : 1,
          }}
        >
          Send
        </button>
      </div>

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
