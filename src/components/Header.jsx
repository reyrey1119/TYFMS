import { useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'

export default function Header({ onSearch, onNavigateHome }) {
  const { user, signOut, supabaseEnabled } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
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
      if (data.tab && onSearch) {
        cache.current.set(q, data)
        onSearch(data)
        setQuery('')
      } else if (data.error) {
        setSearchError(data.error)
      }
    } catch {
      setSearchError('Search unavailable. Try again.')
    } finally {
      setSearching(false)
    }
  }

  return (
    <>
      <header style={{ flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        {/* Brand — stretches toward the right group */}
        <div
          onClick={onNavigateHome}
          style={{ cursor: onNavigateHome ? 'pointer' : 'default', flex: 1, minWidth: 0 }}
        >
          <h1 style={{
            fontSize: 'clamp(15px, 2.2vw, 20px)', fontWeight: 800, letterSpacing: '-.02em',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            color: '#fff',
          }}>
            Thank You For My Service
          </h1>
          <p style={{ fontSize: 11, color: '#9fba9f', marginTop: 2 }}>
            No more empty thanks — just real tools for the next mission.
          </p>
        </div>

        {/* Search + auth — grouped on the right */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexShrink: 0 }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setSearchError('') }}
                placeholder="Search — try &quot;GI Bill&quot; or &quot;resume tips&quot;"
                style={{
                  width: 220, border: `1px solid ${searchError ? 'rgba(239,99,99,0.7)' : 'rgba(159,186,159,0.4)'}`,
                  borderRadius: 8, padding: '7px 12px', fontSize: 12,
                  background: 'rgba(255,255,255,0.08)', color: '#fff',
                  fontFamily: 'inherit', outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={searching || !query.trim()}
                style={{
                  padding: '7px 12px', background: searching ? '#085041' : '#0f6e56',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, color: '#9fba9f' }}>{user.email}</span>
                  <button
                    onClick={signOut}
                    style={{
                      padding: '5px 12px', background: 'transparent', border: '1px solid #3a5a3a',
                      borderRadius: 8, color: '#9fba9f', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  style={{
                    padding: '7px 14px', background: '#0f6e56', border: 'none',
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
