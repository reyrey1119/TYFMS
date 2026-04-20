// GET /api/vet-news — current veteran news via web search, cached 7 days
//
// Supabase table — see supabase/migrations/002_fix_vet_news_cache.sql
// Column: generated_at (not generated_at)

async function getSupabaseAdmin() {
  try {
    const rawUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
    const url = (rawUrl && rawUrl.startsWith('http')) ? rawUrl : process.env.VITE_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
    if (!url || !key) return null
    const { createClient } = await import('@supabase/supabase-js')
    return createClient(url, key, { auth: { persistSession: false } })
  } catch {
    return null
  }
}

async function fetchLiveNews(apiKey) {
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

  const prompt = `Today is ${today}. Search the web for current U.S. veteran news articles published in the past 7 days. Focus on: VA benefits updates, veteran employment programs, GI Bill policy changes, veteran healthcare, veteran housing, military transition support.

Find 5 recent articles and return them as a JSON array. Use real URLs from your search results.

Return valid JSON only — a JSON array, nothing else:
[
  {
    "title": "Article headline",
    "category": "Benefits",
    "summary": "2-3 sentences explaining what happened and why it matters for transitioning veterans.",
    "source": "Publication name",
    "sourceDate": "Month Day, Year",
    "url": "https://..."
  }
]

Use one of these categories exactly: Benefits, Employment, Policy, Education, Health`

  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'web-search-2025-03-05',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await r.json()
  if (data.error) throw new Error(data.error.message)

  const txt = (data.content || [])
    .filter(i => i.type === 'text')
    .map(i => i.text || '')
    .join('')
    .replace(/```json|```/g, '')
    .trim()

  const arrMatch = txt.match(/\[[\s\S]*\]/)
  if (arrMatch) {
    try { return JSON.parse(arrMatch[0]) } catch {}
  }
  const lastBracket = txt.lastIndexOf(']')
  const firstBracket = txt.indexOf('[')
  if (firstBracket !== -1 && lastBracket !== -1) {
    try { return JSON.parse(txt.slice(firstBracket, lastBracket + 1)) } catch {}
  }
  throw new Error('Could not parse news response.')
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return res.status(500).json({ error: 'API key not configured.' })

    const db = await getSupabaseAdmin()
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 7)

    // 1. Supabase cache (7-day freshness)
    if (db) {
      try {
        const { data } = await db
          .from('vet_news_cache')
          .select('content, generated_at')
          .gte('generated_at', cutoff.toISOString())
          .order('generated_at', { ascending: false })
          .limit(1)
          .single()

        if (data?.content && Array.isArray(data.content)) {
          return res.status(200).json({ articles: data.content, cachedAt: data.generated_at, source: 'cache' })
        }
      } catch { /* cache miss */ }
    }

    // 2. Live web search
    const articles = await fetchLiveNews(apiKey)
    const now = new Date().toISOString()

    if (db) {
      try {
        await db.from('vet_news_cache').delete().lt('generated_at', cutoff.toISOString())
        await db.from('vet_news_cache').insert({ content: articles, generated_at: now })
      } catch { /* non-fatal */ }
    }

    return res.status(200).json({ articles, cachedAt: now, source: 'live' })
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'Could not load veteran news.' })
  }
}
