import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import FunFact from '../components/FunFact'
import AdUnit from '../components/AdUnit'

function getMondayStart() {
  const now = new Date()
  const day = now.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const mon = new Date(now)
  mon.setDate(now.getDate() + diff)
  mon.setHours(0, 0, 0, 0)
  return mon.getTime()
}

const BAR_COLORS = ['#185fa5', '#0A7868', '#ba7517', '#a32d2d']

export default function CareerTrendsTab() {
  const { user, supabaseEnabled } = useAuth()
  const [trends, setTrends] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [countdown, setCountdown] = useState(null)

  useEffect(() => {
    const mondayTs = getMondayStart()
    const cached = (() => { try { return JSON.parse(localStorage.getItem('vtg_market_trends') || 'null') } catch { return null } })()
    if (cached && cached.monday === mondayTs && Array.isArray(cached.trends)) {
      setTrends(cached.trends)
      return
    }
    setLoading(true)
    fetch('/api/market-trends')
      .then(r => r.json())
      .then(data => {
        if (data.trends) {
          setTrends(data.trends)
          try { localStorage.setItem('vtg_market_trends', JSON.stringify({ monday: mondayTs, trends: data.trends })) } catch {}
        } else {
          setError('Could not load market trends.')
        }
      })
      .catch(() => setError('Could not load market trends.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (selected === null || countdown === null || countdown === 0) return
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [selected, countdown])

  function openTrend(trend) {
    setSelected(trend)
    setCountdown(5)
  }

  function closeModal() {
    setSelected(null)
    setCountdown(null)
  }

  return (
    <div>
      <p className="sec-title">Career trends</p>
      <p className="sec-sub">
        High-demand roles, booming industries, and civilian hiring surges — updated every Monday
        for veterans who are ready to make their move.
      </p>

      {loading && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '24px 0' }}>
          <span className="search-spinner" style={{ width: 14, height: 14, borderColor: 'rgba(26,26,24,.2)', borderTopColor: '#1a1a18' }} />
          <p style={{ fontSize: 13, color: '#5f5e5a' }}>Loading this week's trends…</p>
        </div>
      )}
      {error && <p style={{ fontSize: 13, color: '#a32d2d', marginBottom: 16 }}>{error}</p>}

      {trends && (
        <>
          {/* Opportunity bar chart */}
          <div className="card" style={{ marginBottom: 24 }}>
            <p className="cat-label" style={{ marginBottom: 14 }}>Opportunity score by sector</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {trends.map((t, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <p style={{ fontSize: 12, color: '#1a1a18', fontWeight: 500 }}>{t.category}</p>
                    <p style={{ fontSize: 12, fontWeight: 700, color: BAR_COLORS[i] }}>{t.score ?? '–'}</p>
                  </div>
                  <div style={{ height: 8, background: '#f5f4f0', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${t.score ?? 0}%`,
                      background: BAR_COLORS[i],
                      borderRadius: 4,
                      transition: 'width 0.8s ease',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trend cards */}
          <p className="cat-label" style={{ marginBottom: 14 }}>This week in civilian careers</p>
          <div className="grid-2" style={{ marginBottom: 32 }}>
            {trends.map((t, i) => (
              <div
                key={i}
                className="card"
                style={{ cursor: 'pointer', transition: 'box-shadow .15s' }}
                onClick={() => openTrend(t)}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a18', flex: 1, marginRight: 8, lineHeight: 1.4 }}>{t.title}</p>
                  <span className={t.badgeCls || 'bg'} style={{ flexShrink: 0 }}>{t.category}</span>
                </div>
                <p style={{ fontSize: 13, color: '#5f5e5a', lineHeight: 1.7, marginBottom: 10 }}>{t.description}</p>
                <p style={{ fontSize: 11, color: '#0A7868', fontWeight: 600 }}>Read full analysis →</p>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="insight" style={{ marginBottom: 32 }}>
        <p className="label">Why this matters for veterans</p>
        <p>
          Veterans bring leadership, technical training, and mission-driven discipline to industries
          competing hard for that talent. The trends above are curated for skills you already have —
          not ones you need to build from scratch.
        </p>
      </div>

      <AdUnit slot="5201008369" />
      <FunFact />

      {/* Interstitial modal */}
      {selected && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            style={{
              background: '#fff', borderRadius: 16, padding: '28px 24px',
              maxWidth: 560, width: '100%', maxHeight: '85vh', overflowY: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <span className={selected.badgeCls || 'bg'} style={{ marginBottom: 8, display: 'inline-block' }}>{selected.category}</span>
                <p style={{ fontSize: 20, fontWeight: 700, color: '#1a1a18', lineHeight: 1.3 }}>{selected.title}</p>
              </div>
              <button
                onClick={closeModal}
                style={{ background: 'none', border: 'none', fontSize: 26, cursor: 'pointer', color: '#888', marginLeft: 12, flexShrink: 0, lineHeight: 1, padding: 0 }}
              >×</button>
            </div>

            {countdown > 0 ? (
              <div>
                <p style={{ fontSize: 13, color: '#5f5e5a', marginBottom: 16 }}>
                  Full analysis unlocks in <strong>{countdown}</strong> second{countdown !== 1 ? 's' : ''}…
                </p>
                <AdUnit slot="5201008369" />
              </div>
            ) : (
              <div>
                <p style={{ fontSize: 14, color: '#1a1a18', lineHeight: 1.75, marginBottom: 20 }}>{selected.description}</p>

                {supabaseEnabled && user ? (
                  selected.fullAnalysis ? (
                    <div style={{ borderTop: '1px solid #d3d1c7', paddingTop: 16 }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: '#0A7868', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10 }}>
                        Full analysis
                      </p>
                      <p style={{ fontSize: 14, color: '#1a1a18', lineHeight: 1.8 }}>{selected.fullAnalysis}</p>
                    </div>
                  ) : null
                ) : supabaseEnabled ? (
                  <div style={{ background: '#f5f4f0', borderRadius: 10, padding: '16px 18px' }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a18', marginBottom: 6 }}>Full analysis — sign in to unlock</p>
                    <p style={{ fontSize: 13, color: '#5f5e5a', lineHeight: 1.65 }}>
                      Create a free account to access deeper career analysis and veteran-specific action steps for each trend.
                    </p>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
