import { useState, useEffect } from 'react'
import FunFact from '../components/FunFact'
import AdUnit from '../components/AdUnit'

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

function fetchTrends(onSuccess, onError, onDone) {
  fetch('/api/market-trends')
    .then(r => r.json())
    .then(data => {
      if (data.trends) onSuccess(data.trends)
      else onError('Could not load market trends.')
    })
    .catch(() => onError('Could not load market trends.'))
    .finally(onDone)
}

export default function CareerTrendsTab() {
  const [trends, setTrends] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const weekNum = Math.floor(Date.now() / WEEK_MS)
    const cached = (() => { try { return JSON.parse(localStorage.getItem('vtg_market_trends') || 'null') } catch { return null } })()
    if (cached && cached.week === weekNum && Array.isArray(cached.trends)) {
      setTrends(cached.trends)
      return
    }
    setLoading(true)
    fetchTrends(
      data => {
        setTrends(data)
        try { localStorage.setItem('vtg_market_trends', JSON.stringify({ week: weekNum, trends: data })) } catch {}
      },
      setError,
      () => setLoading(false),
    )
  }, [])

  function refresh() {
    try { localStorage.removeItem('vtg_market_trends') } catch {}
    setTrends(null)
    setError('')
    setLoading(true)
    const weekNum = Math.floor(Date.now() / WEEK_MS)
    fetchTrends(
      data => {
        setTrends(data)
        try { localStorage.setItem('vtg_market_trends', JSON.stringify({ week: weekNum, trends: data })) } catch {}
      },
      setError,
      () => setLoading(false),
    )
  }

  return (
    <div>
      <p className="sec-title">Career trends</p>
      <p className="sec-sub">
        High-demand roles, booming industries, and civilian hiring surges — curated weekly
        for veterans who are ready to make their move.
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <p className="cat-label" style={{ marginBottom: 0 }}>This week in civilian careers</p>
        <button
          onClick={refresh}
          disabled={loading}
          style={{
            padding: '4px 12px', background: 'none', border: '1px solid #d3d1c7',
            borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', color: '#5f5e5a',
          }}
        >
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      {loading && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '24px 0' }}>
          <span className="search-spinner" style={{ width: 14, height: 14 }} />
          <p style={{ fontSize: 13, color: '#5f5e5a' }}>Loading this week's trends…</p>
        </div>
      )}
      {error && <p style={{ fontSize: 13, color: '#a32d2d', marginBottom: 16 }}>{error}</p>}

      {trends && (
        <div className="grid-2" style={{ marginBottom: 32 }}>
          {trends.map((t, i) => (
            <div key={i} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a18', flex: 1, marginRight: 8, lineHeight: 1.4 }}>{t.title}</p>
                <span className={t.badgeCls || 'bg'} style={{ flexShrink: 0 }}>{t.category}</span>
              </div>
              <p style={{ fontSize: 13, color: '#5f5e5a', lineHeight: 1.7 }}>{t.description}</p>
            </div>
          ))}
        </div>
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
    </div>
  )
}
