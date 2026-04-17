import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password)
        if (error) { setError(error.message); return }
        onClose()
      } else {
        const { error } = await signUp(email, password)
        if (error) { setError(error.message); return }
        setMessage('Check your email to confirm your account, then sign in.')
      }
    } finally {
      setLoading(false)
    }
  }

  function switchMode() {
    setMode(m => m === 'signin' ? 'signup' : 'signin')
    setError('')
    setMessage('')
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="card" style={{ width: '100%', maxWidth: 360, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <p style={{ fontWeight: 600, fontSize: 15, color: '#1a1a18' }}>{mode === 'signin' ? 'Sign in to TYFMS' : 'Create your account'}</p>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#5f5e5a', lineHeight: 1 }}
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ marginBottom: 10 }}
            placeholder="you@example.com"
            required
            autoFocus
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ marginBottom: 14 }}
            placeholder={mode === 'signup' ? 'At least 6 characters' : ''}
            required
            minLength={6}
          />
          {error && <p style={{ color: '#a32d2d', fontSize: 13, marginBottom: 10 }}>{error}</p>}
          {message && <p style={{ color: '#0A7868', fontSize: 13, marginBottom: 10 }}>{message}</p>}
          <button className="btn-g" type="submit" disabled={loading}>
            {loading ? 'Loading...' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>
        <p style={{ fontSize: 12, color: '#5f5e5a', textAlign: 'center', marginTop: 12 }}>
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={switchMode}
            style={{ background: 'none', border: 'none', color: '#1B3A6B', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', textDecoration: 'underline' }}
          >
            {mode === 'signin' ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
