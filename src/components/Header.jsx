import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'

export default function Header() {
  const { user, signOut, supabaseEnabled } = useAuth()
  const [showAuth, setShowAuth] = useState(false)

  return (
    <>
      <header>
        <div>
          <h1>TYFMS</h1>
          <p>No more empty thanks — just real tools for the next mission.</p>
        </div>
        {supabaseEnabled && (
          <div>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, color: '#9fba9f' }}>{user.email}</span>
                <button
                  onClick={signOut}
                  style={{
                    padding: '5px 12px', background: 'transparent', border: '1px solid #3a5a3a',
                    borderRadius: 8, color: '#9fba9f', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit'
                  }}
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                style={{
                  padding: '6px 14px', background: '#0f6e56', border: 'none',
                  borderRadius: 8, color: '#fff', fontSize: 13, cursor: 'pointer',
                  fontFamily: 'inherit', fontWeight: 500
                }}
              >
                Sign in
              </button>
            )}
          </div>
        )}
      </header>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  )
}
