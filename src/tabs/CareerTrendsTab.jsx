import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import FunFact from '../components/FunFact'
import AdUnit from '../components/AdUnit'

function getWeekStart() {
  const now = new Date()
  const day = now.getUTCDay()
  const diff = day === 0 ? -6 : 1 - day
  const mon = new Date(now)
  mon.setUTCDate(now.getUTCDate() + diff)
  mon.setUTCHours(0, 0, 0, 0)
  return mon.toISOString().slice(0, 10) // YYYY-MM-DD
}

const BAR_COLORS = ['#1B3A6B', '#C07A28', '#7c3aad', '#a32d2d']
const LS_KEY = 'vtg_trends_v2'

export default function CareerTrendsTab() {
  const { user, supabaseEnabled } = useAuth()
  const useDb = supabaseEnabled && !!supabase && !!user

  const [trends, setTrends] = useState(null)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generatedAt, setGeneratedAt] = useState(null)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [countdown, setCountdown] = useState(null)

  const [matches, setMatches] = useState(null)
  const [matchLoading, setMatchLoading] = useState(false)
  const [resumeMeta, setResumeMeta] = useState(null)

  useEffect(() => {
    const weekStart = getWeekStart()
    let hasCached = false

    const cached = (() => { try { return JSON.parse(localStorage.getItem(LS_KEY) || 'null') } catch { return null } })()

    // Show cached data immediately — never block the UI on an API call if we have anything cached
    if (cached && Array.isArray(cached.trends)) {
      setTrends(cached.trends)
      if (cached.generatedAt) setGeneratedAt(cached.generatedAt)
      hasCached = true
      if (cached.weekStart !== weekStart) setRefreshing(true)  // Stale week — show indicator
    } else {
      setLoading(true)
    }

    fetch('/api/trends')
      .then(r => r.json())
      .then(data => {
        if (data.trends) {
          setTrends(data.trends)
          const gAt = data.generatedAt || new Date().toISOString()
          setGeneratedAt(gAt)
          try { localStorage.setItem(LS_KEY, JSON.stringify({ weekStart, trends: data.trends, generatedAt: gAt })) } catch {}
        } else if (!hasCached) {
          setError('Could not load market trends.')
        }
      })
      .catch(() => { if (!hasCached) setError('Could not load market trends.') })
      .finally(() => { setLoading(false); setRefreshing(false) })
  }, [])

  // Personalization: fetch resume + call trend-match when signed in and trends ready
  useEffect(() => {
    if (!useDb || !trends) return
    async function fetchPersonalization() {
      setMatchLoading(true)
      try {
        const { data } = await supabase
          .from('resume_drafts')
          .select('data')
          .eq('user_id', user.id)
          .single()
        if (!data?.data?.mos) return
        const { mos, branch, rank } = data.data
        setResumeMeta({ mos, branch, rank })
        const r = await fetch('/api/trends', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'match', mos, branch, rank,
            trends: trends.map(t => ({ title: t.title, category: t.category })),
          }),
        })
        const result = await r.json()
        if (result.matches) setMatches(result.matches)
      } catch {}
      setMatchLoading(false)
    }
    fetchPersonalization()
  }, [useDb, user, trends])

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

  const topMatches = matches
    ? [...matches].sort((a, b) => b.matchScore - a.matchScore).slice(0, 2)
    : []

  return (
    <div>
      <p className="sec-title">Career trends</p>
      <p className="sec-sub">
        High-demand roles, booming industries, and civilian hiring surges — updated every Monday
        for veterans who are ready to make their move.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, minHeight: 20 }}>
        {generatedAt && (
          <p style={{ fontSize: 11, color: '#b4b2a9' }}>
            Last updated: {new Date(generatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        )}
        {refreshing && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span className="search-spinner" style={{ width: 10, height: 10, borderColor: 'rgba(192,122,40,.2)', borderTopColor: '#C07A28' }} />
            <p style={{ fontSize: 11, color: '#C07A28' }}>Refreshing…</p>
          </div>
        )}
      </div>

      {loading && !trends && (
        <>
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="skeleton-block" style={{ width: 180, height: 14, marginBottom: 14 }} />
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <div className="skeleton-block" style={{ width: 110, height: 12 }} />
                  <div className="skeleton-block" style={{ width: 30, height: 12 }} />
                </div>
                <div className="skeleton-block" style={{ width: '100%', height: 8 }} />
              </div>
            ))}
          </div>
          <div className="grid-2" style={{ marginBottom: 32 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, gap: 8 }}>
                  <div className="skeleton-block" style={{ flex: 1, height: 18 }} />
                  <div className="skeleton-block" style={{ width: 60, height: 20, borderRadius: 8 }} />
                </div>
                <div className="skeleton-block" style={{ width: '100%', height: 13, marginBottom: 4 }} />
                <div className="skeleton-block" style={{ width: '100%', height: 13, marginBottom: 4 }} />
                <div className="skeleton-block" style={{ width: '80%', height: 13, marginBottom: 10 }} />
                <div className="skeleton-block" style={{ width: 120, height: 12 }} />
              </div>
            ))}
          </div>
        </>
      )}
      {error && <p style={{ fontSize: 13, color: '#a32d2d', marginBottom: 16 }}>{error}</p>}

      {trends && (
        <>
          {/* Personalized matches — only when signed in with resume */}
          {useDb && (matchLoading || topMatches.length > 0) && (
            <div className="card" style={{ marginBottom: 24, borderLeft: '4px solid #C07A28', borderRadius: '0 12px 12px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#C07A28', textTransform: 'uppercase', letterSpacing: '.1em' }}>
                  Matched to your background
                </p>
                {resumeMeta?.mos && (
                  <span className="bg" style={{ fontSize: 10, padding: '2px 7px' }}>{resumeMeta.mos}</span>
                )}
              </div>

              {matchLoading ? (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span className="search-spinner" style={{ width: 12, height: 12, borderColor: 'rgba(26,26,24,.15)', borderTopColor: '#C07A28' }} />
                  <p style={{ fontSize: 13, color: '#5f5e5a' }}>Matching trends to your MOS…</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {topMatches.map(m => {
                    const trend = trends[m.idx]
                    if (!trend) return null
                    return (
                      <div
                        key={m.idx}
                        style={{
                          padding: '12px 14px', background: '#FAFAF8', borderRadius: 10,
                          border: '1px solid #E5E3DC', cursor: 'pointer',
                        }}
                        onClick={() => openTrend(trend)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a18', flex: 1, marginRight: 8 }}>{trend.title}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                            <div style={{ height: 6, width: 60, background: '#E5E3DC', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${m.matchScore}%`, background: '#C07A28', borderRadius: 3 }} />
                            </div>
                            <p style={{ fontSize: 11, fontWeight: 700, color: '#C07A28' }}>{m.matchScore}%</p>
                          </div>
                        </div>
                        <p style={{ fontSize: 12, color: '#5f5e5a', lineHeight: 1.6 }}>{m.matchReason}</p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Opportunity bar chart */}
          <div className="card" style={{ marginBottom: 24 }}>
            <p className="cat-label" style={{ marginBottom: 14 }}>Opportunity score by sector</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {trends.map((t, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <p style={{ fontSize: 12, color: '#1a1a18', fontWeight: 500 }}>{t.category}</p>
                    <p style={{ fontSize: 12, fontWeight: 700, color: BAR_COLORS[i % BAR_COLORS.length] }}>{t.score ?? '–'}</p>
                  </div>
                  <div style={{ height: 8, background: '#f5f4f0', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${t.score ?? 0}%`,
                      background: BAR_COLORS[i % BAR_COLORS.length],
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
                <p style={{ fontSize: 11, color: '#C07A28', fontWeight: 600 }}>Read full analysis →</p>
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
                      <p style={{ fontSize: 11, fontWeight: 600, color: '#C07A28', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10 }}>
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
