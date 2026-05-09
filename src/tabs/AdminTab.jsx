import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const ADMIN_EMAIL = 'reyrey1119@gmail.com'

const STAR_DISPLAY = { 1: '★☆☆☆☆', 2: '★★☆☆☆', 3: '★★★☆☆', 4: '★★★★☆', 5: '★★★★★' }

export default function AdminTab() {
  const { user } = useAuth()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!supabase || user?.email !== ADMIN_EMAIL) return

    async function load() {
      try {
        const { data, error: dbError } = await supabase
          .from('user_feedback')
          .select('*')
          .order('created_at', { ascending: false })
        if (dbError) throw dbError
        setRows(data || [])
      } catch {
        setError('Could not load feedback submissions.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  if (user?.email !== ADMIN_EMAIL) {
    return <p style={{ color: '#a32d2d', padding: 24, fontSize: 14 }}>Access denied.</p>
  }

  const avg = rows.length
    ? (rows.reduce((s, r) => s + (r.rating || 0), 0) / rows.length).toFixed(1)
    : null

  return (
    <div>
      <p className="sec-title">Feedback Submissions</p>
      <p className="sec-sub">
        {rows.length} total submission{rows.length !== 1 ? 's' : ''}
        {avg && ` · avg rating ${avg} / 5`}
      </p>

      {loading && <p style={{ color: '#5f5e5a', fontSize: 14 }}>Loading…</p>}
      {error && <p style={{ color: '#a32d2d', fontSize: 14 }}>{error}</p>}

      {!loading && !error && rows.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
          <p style={{ color: '#5f5e5a', fontSize: 14 }}>No submissions yet.</p>
        </div>
      )}

      {rows.map(row => (
        <div key={row.id} className="card" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, color: '#1a1a18', marginBottom: 2 }}>
                {row.name || 'Anonymous'}
              </p>
              {row.email && (
                <p style={{ fontSize: 12, color: '#5f5e5a' }}>{row.email}</p>
              )}
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 16 }}>
              {row.rating && (
                <p style={{ color: '#C07A28', fontSize: 14, letterSpacing: 1 }}>
                  {STAR_DISPLAY[row.rating]}
                </p>
              )}
              <p style={{ fontSize: 11, color: '#9b9a96', marginTop: 2 }}>
                {new Date(row.created_at).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                })}
              </p>
            </div>
          </div>
          {row.message && (
            <p style={{
              fontSize: 13, color: '#3a3a38', lineHeight: 1.7,
              whiteSpace: 'pre-wrap', background: '#F7F5EF',
              padding: '10px 12px', borderRadius: 8,
            }}>
              {row.message}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
