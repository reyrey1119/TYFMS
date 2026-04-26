import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const BRANCHES = [
  'Army', 'Air Force', 'Marine Corps', 'Navy',
  'Coast Guard', 'Space Force', 'National Guard', 'Reserve',
]

const NO_WARRANT_BRANCHES = new Set(['Air Force', 'Space Force'])

const STATUS_OPTIONS = [
  'Active Duty', 'Veteran', 'Reservist', 'National Guard', 'Retired',
  'Military Spouse', 'Military Dependent', 'Civilian Supporter',
]

function getRanks(branch) {
  const enlisted = ['E-1','E-2','E-3','E-4','E-5','E-6','E-7','E-8','E-9']
  const warrant  = ['W-1','W-2','W-3','W-4','W-5']
  const officer  = ['O-1','O-2','O-3','O-4','O-5','O-6','O-7','O-8','O-9','O-10']
  return NO_WARRANT_BRANCHES.has(branch)
    ? { enlisted, officer }
    : { enlisted, warrant, officer }
}

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState('signin')

  // Shared fields
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [message, setMessage]   = useState('')
  const [loading, setLoading]   = useState(false)

  // Signup-only fields
  const [firstName,       setFirstName]       = useState('')
  const [lastName,        setLastName]        = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [branch,          setBranch]          = useState('Army')
  const [rank,            setRank]            = useState('')
  const [status,          setStatus]          = useState('')

  const { signIn, signUp } = useAuth()

  const savedFirstName = (() => {
    try { return localStorage.getItem('vtg_first_name') || '' } catch { return '' }
  })()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      if (mode === 'signin') {
        const { error: err } = await signIn(email, password)
        if (err) { setError(err.message); return }
        onClose()
      } else {
        const { error: err } = await signUp(email, password, {
          first_name: firstName.trim(),
          last_name:  lastName.trim(),
          branch,
          rank,
          status,
        })
        if (err) { setError(err.message); return }
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

  const ranks = getRanks(branch)

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: mode === 'signup' ? 440 : 360,
          padding: '20px 24px 24px',
          maxHeight: '92vh',
          overflowY: 'auto',
        }}
      >
        {/* Close */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#5f5e5a', lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {/* Header */}
        {mode === 'signup' ? (
          <div style={{ textAlign: 'center', marginBottom: 22 }}>
            <img src="/logo.png" alt="TYFMS" style={{ height: 52, marginBottom: 12 }} />
            <p style={{ fontWeight: 700, fontSize: 17, color: '#1a1a18', marginBottom: 6 }}>Create your account</p>
            <p style={{ fontSize: 13, color: '#5f5e5a', lineHeight: 1.5 }}>
              Join thousands of veterans navigating their next mission.
            </p>
          </div>
        ) : (
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontWeight: 700, fontSize: 17, color: '#1a1a18' }}>
              {savedFirstName ? `Welcome back, ${savedFirstName}.` : 'Sign in to TYFMS'}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Signup: name row */}
          {mode === 'signup' && (
            <div className="grid-2" style={{ marginBottom: 10 }}>
              <div>
                <label>First name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="First name"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label>Last name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Last name"
                  required
                />
              </div>
            </div>
          )}

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ marginBottom: 10 }}
            placeholder="you@example.com"
            required
            autoFocus={mode === 'signin'}
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ marginBottom: 10 }}
            placeholder={mode === 'signup' ? 'At least 6 characters' : ''}
            required
            minLength={6}
          />

          {/* Signup: confirm + military fields */}
          {mode === 'signup' && (
            <>
              <label>Confirm password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                style={{ marginBottom: 10 }}
                placeholder="Re-enter password"
                required
                minLength={6}
              />

              <div className="grid-2" style={{ marginBottom: 10 }}>
                <div>
                  <label>Branch of service</label>
                  <select
                    value={branch}
                    onChange={e => { setBranch(e.target.value); setRank('') }}
                    required
                  >
                    {BRANCHES.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label>Rank</label>
                  <select value={rank} onChange={e => setRank(e.target.value)}>
                    <option value="">Select rank</option>
                    <optgroup label="Enlisted">
                      {ranks.enlisted.map(r => <option key={r}>{r}</option>)}
                    </optgroup>
                    {ranks.warrant && (
                      <optgroup label="Warrant Officer">
                        {ranks.warrant.map(r => <option key={r}>{r}</option>)}
                      </optgroup>
                    )}
                    <optgroup label="Officer">
                      {ranks.officer.map(r => <option key={r}>{r}</option>)}
                    </optgroup>
                  </select>
                </div>
              </div>

              <label>Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                style={{ marginBottom: 16 }}
              >
                <option value="">Select your status</option>
                {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </>
          )}

          {mode === 'signin' && <div style={{ marginBottom: 14 }} />}

          {error   && <p style={{ color: '#a32d2d', fontSize: 13, marginBottom: 10 }}>{error}</p>}
          {message && <p style={{ color: '#0A7868', fontSize: 13, marginBottom: 10 }}>{message}</p>}

          <button className="btn-g" type="submit" disabled={loading}>
            {loading ? 'Loading…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p style={{ fontSize: 12, color: '#5f5e5a', textAlign: 'center', marginTop: 12 }}>
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={switchMode}
            style={{
              background: 'none', border: 'none', color: '#1B3A6B',
              cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', textDecoration: 'underline',
            }}
          >
            {mode === 'signin' ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
