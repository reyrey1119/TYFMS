import { useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'

export default function Header({ onSearch, onNavigateHome }) {
  const { user, signOut, deleteAccount, supabaseEnabled } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [deleting, setDeleting] = useState(false)
  const cache = useRef(new Map())

  async function handleSearch(e) {
    e.preventDefault()
    const q = query.trim()
    if (!q || searching) return
    setSearching(true)
    setSearchError('')

    if (cache.current.has(q)) {
      const cached = cache.current.get(q)
      if (onSearch) onSearch(cached)
      setQuery('')
      setSearching(false)
      return
    }

    try {
      const r = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      })
      const data = await r.json()
      if (data.tab && data.summary && onSearch) {
        cache.current.set(q, data)
        onSearch(data)
        setQuery('')
      } else if (data.error) {
        setSearchError(data.error)
      } else {
        setSearchError('No results found. Try a different search.')
      }
    } catch {
      setSearchError('Search unavailable. Try again.')
    } finally {
      setSearching(false)
    }
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      'Delete your TYFMS account?\n\nThis will permanently delete your account, network profile, and all saved goals. This cannot be undone.'
    )
    if (!confirmed) return
    setDeleting(true)
    const result = await deleteAccount()
    setDeleting(false)
    if (result?.error) {
      alert('Could not delete account: ' + result.error.message)
    }
  }

  return (
    <>
      <header>
        {/* Left spacer — centers brand */}
        <div className="header-spacer" />

        {/* Center brand */}
        <div
          onClick={onNavigateHome}
          style={{ cursor: onNavigateHome ? 'pointer' : 'default', textAlign: 'center' }}
        >
          <h1 style={{
            fontSize: 'clamp(13px, 1.8vw, 18px)', fontWeight: 800, letterSpacing: '-.02em', color: '#fff',
          }}>
            Thank You For My Service
          </h1>
          <p style={{ fontSize: 10, color: '#9fba9f', marginTop: 2 }}>
            No more empty thanks — just real tools for the next mission.
          </p>
        </div>

        {/* Right: search + auth */}
        <div style={{ justifySelf: 'end', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setSearchError('') }}
                placeholder="Search — try &quot;GI Bill&quot; or &quot;resume&quot;"
                style={{
                  width: 190, border: `1px solid ${searchError ? 'rgba(239,99,99,0.7)' : 'rgba(159,186,159,0.4)'}`,
                  borderRadius: 8, padding: '7px 10px', fontSize: 12,
                  background: 'rgba(255,255,255,0.08)', color: '#fff',
                  fontFamily: 'inherit', outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={searching || !query.trim()}
                style={{
                  padding: '7px 10px', background: searching ? '#0a1e45' : '#1B3A6B',
                  border: 'none', borderRadius: 8, color: '#fff', fontSize: 12,
                  cursor: searching ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                  whiteSpace: 'nowrap', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                {searching && <span className="search-spinner" />}
                {searching ? 'Searching' : 'Search'}
              </button>
            </div>
            {searchError && (
              <p style={{ fontSize: 11, color: '#ef9f60', margin: 0 }}>{searchError}</p>
            )}
          </form>

          {supabaseEnabled && (
            <div style={{ flexShrink: 0 }}>
              {user ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: '#9fba9f' }}>{user.email}</span>
                    <button
                      onClick={signOut}
                      style={{
                        padding: '5px 10px', background: 'transparent', border: '1px solid #3a5a3a',
                        borderRadius: 8, color: '#9fba9f', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    style={{
                      background: 'none', border: 'none', color: '#ef9f60', cursor: 'pointer',
                      fontSize: 11, fontFamily: 'inherit', padding: 0, textDecoration: 'underline',
                      opacity: deleting ? 0.6 : 1,
                    }}
                  >
                    {deleting ? 'Deleting…' : 'Delete account'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  style={{
                    padding: '7px 14px', background: '#C07A28', border: 'none',
                    borderRadius: 8, color: '#fff', fontSize: 13, cursor: 'pointer',
                    fontFamily: 'inherit', fontWeight: 500,
                  }}
                >
                  Sign in
                </button>
              )}
            </div>
          )}
        </div>
      </header>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  )
}
