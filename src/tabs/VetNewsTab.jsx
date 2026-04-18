import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import AdUnit from '../components/AdUnit'
import FunFact from '../components/FunFact'

const CACHE_KEY = 'vtg_vet_news_v1'
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000

const CAT_CLS = { Benefits: 'bg', Employment: 'ba', Policy: 'bb', Education: 'bd', Health: 'bd' }

export default function VetNewsTab() {
  const { user, supabaseEnabled } = useAuth()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [cachedAt, setCachedAt] = useState(null)
  const [showSignInHint, setShowSignInHint] = useState(false)

  useEffect(() => {
    let mounted = true

    async function loadNews() {
      // Show any cached data immediately — never make the user wait for cached content
      let hasCached = false
      try {
        const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null')
        if (cached?.articles?.length) {
          setArticles(cached.articles)
          setCachedAt(cached.cachedAt)
          setLoading(false)
          hasCached = true

          // Fresh enough — done, no API call
          if (Date.now() - new Date(cached.cachedAt).getTime() < CACHE_TTL) return

          // Stale — refresh in background without blocking the UI
          setRefreshing(true)
        }
      } catch {}

      if (!hasCached) setLoading(true)

      try {
        const r = await fetch('/api/vet-news')
        const data = await r.json()
        if (!mounted) return
        if (r.ok && data.articles?.length) {
          setArticles(data.articles)
          setCachedAt(data.cachedAt)
          setError('')
          try { localStorage.setItem(CACHE_KEY, JSON.stringify({ articles: data.articles, cachedAt: data.cachedAt })) } catch {}
        } else if (!hasCached) {
          setError(data.error || 'Could not load news.')
        }
      } catch {
        if (mounted && !hasCached) setError('Could not load veteran news. Please try again.')
      } finally {
        if (mounted) { setLoading(false); setRefreshing(false) }
      }
    }

    loadNews()
    return () => { mounted = false }
  }, [])

  function handleReadMore(url) {
    if (!user && supabaseEnabled) { setShowSignInHint(true); return }
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div>
      <p className="sec-title">Veteran news</p>
      <p className="sec-sub">
        Current news and policy updates affecting transitioning veterans — pulled from live sources
        and updated weekly. Sign in to read full articles.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, minHeight: 20 }}>
        {cachedAt && (
          <p style={{ fontSize: 11, color: '#b4b2a9' }}>
            Last updated: {new Date(cachedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        )}
        {refreshing && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span className="search-spinner" style={{ width: 10, height: 10, borderColor: 'rgba(192,122,40,.2)', borderTopColor: '#C07A28' }} />
            <p style={{ fontSize: 11, color: '#C07A28' }}>Refreshing…</p>
          </div>
        )}
      </div>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, alignItems: 'center', padding: '40px 0' }}>
          <span className="search-spinner" style={{ width: 16, height: 16, borderColor: 'rgba(26,26,24,.15)', borderTopColor: '#1B3A6B' }} />
          <p style={{ fontSize: 13, color: '#5f5e5a' }}>Searching for current veteran news…</p>
        </div>
      )}

      {error && !loading && <div className="warn"><p>{error}</p></div>}

      {showSignInHint && (
        <div className="warn" style={{ marginBottom: 16 }}>
          <p>Sign in to read full articles and access sources directly. Free accounts, no spam.</p>
        </div>
      )}

      {!loading && articles.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
          {articles.map((a, i) => (
            <div key={i} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 8 }}>
                <span className={CAT_CLS[a.category] || 'bb'} style={{ flexShrink: 0 }}>{a.category}</span>
                <span style={{ fontSize: 11, color: '#b4b2a9' }}>{a.sourceDate}</span>
              </div>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#1a1a18', lineHeight: 1.4, marginBottom: 8 }}>{a.title}</p>
              <p style={{ fontSize: 13, color: '#5f5e5a', lineHeight: 1.7, marginBottom: 12 }}>{a.summary}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <span style={{ fontSize: 11, color: '#b4b2a9', fontStyle: 'italic' }}>{a.source}</span>
                <button
                  onClick={() => handleReadMore(a.url)}
                  style={{
                    padding: '5px 16px', background: '#1B3A6B', border: 'none',
                    borderRadius: 8, color: '#fff', fontSize: 12, cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Read more →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && articles.length === 0 && (
        <div className="warn"><p>No articles found. Try refreshing the page.</p></div>
      )}

      <div className="insight" style={{ marginBottom: 24 }}>
        <p className="label">Stay informed</p>
        <p>
          Policy changes, benefit updates, and hiring programs can open or close quickly.
          Checking veteran news weekly puts you ahead of most job seekers who miss these windows.
        </p>
      </div>

      <AdUnit slot="3957268946" />
      <FunFact />
    </div>
  )
}
