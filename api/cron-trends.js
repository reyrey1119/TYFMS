/*
 * Vercel cron job — runs every Monday at 00:00 UTC.
 * Pre-generates and caches the week's career trends before any user opens the tab.
 *
 * Configured in vercel.json:
 *   { "path": "/api/cron-trends", "schedule": "0 0 * * 1" }
 *
 * Required env var: CRON_SECRET — set in Vercel dashboard (any random string).
 * Vercel sends: Authorization: Bearer <CRON_SECRET>
 *
 * Also requires: SUPABASE_URL, SUPABASE_SERVICE_KEY, ANTHROPIC_API_KEY
 */

import { createClient } from '@supabase/supabase-js'

function getWeekStart() {
  const now = new Date()
  const day = now.getUTCDay()
  const diff = day === 0 ? -6 : 1 - day
  const mon = new Date(now)
  mon.setUTCDate(now.getUTCDate() + diff)
  mon.setUTCHours(0, 0, 0, 0)
  return mon.toISOString().slice(0, 10)
}

async function generateTrends(weekStart) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured.')

  const weekLabel = new Date(weekStart + 'T12:00:00Z').toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  })

  const prompt = `You are a veteran career advisor tracking civilian job market trends. Generate a "This week in civilian careers" briefing for veterans transitioning from military service. This content is for the week of ${weekLabel}.

Return exactly 4 trend cards as valid JSON. Each card highlights a real, current trend in the civilian job market relevant to veterans — booming industries, high-demand roles, major hiring surges, or skills gaps veterans can uniquely fill.

Use badgeCls "bg" for tech/growth roles, "ba" for trades/defense/manufacturing, "bb" for government/federal jobs, "bd" for healthcare/social services. Mix the badge types.

score is 0-100 representing how hot this trend is right now for veterans (higher = more urgent opportunity). Vary the scores meaningfully.

fullAnalysis is 3 sentences: deeper context on the trend, specific veteran advantages in this space, and one concrete action step veterans can take this week.

Response format — a JSON array, nothing else:
[
  {
    "title": "Short punchy headline (5-8 words)",
    "category": "Sector name",
    "description": "2-3 sentences explaining the trend and why it matters for veterans specifically.",
    "badgeCls": "bg",
    "score": 85,
    "fullAnalysis": "3 sentences of deeper analysis, veteran advantages, and a concrete action step."
  }
]`

  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1200,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await r.json()
  if (data.error) throw new Error(data.error.message)

  const txt = (data.content || []).map(i => i.text || '').join('').replace(/```json|```/g, '').trim()
  const match = txt.match(/\[[\s\S]*\]/)
  if (!match) throw new Error('Could not parse AI response.')
  return JSON.parse(match[0])
}

export default async function handler(req, res) {
  // Verify this is called by Vercel cron (or an authorized admin)
  const cronSecret = process.env.CRON_SECRET
  const authHeader = req.headers.authorization || ''
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
  if (!url || !key) {
    return res.status(500).json({ error: 'Supabase not configured.' })
  }

  const db = createClient(url, key, { auth: { persistSession: false } })
  const weekStart = getWeekStart()

  try {
    // Check if already cached for this week (avoid redundant AI call)
    const { data: existing } = await db
      .from('career_trends_cache')
      .select('week_start')
      .eq('week_start', weekStart)
      .single()

    if (existing) {
      return res.status(200).json({ message: `Cache already current for week ${weekStart}.`, weekStart })
    }

    // Generate fresh trends
    const trends = await generateTrends(weekStart)

    // Save to cache
    const { error: upsertErr } = await db
      .from('career_trends_cache')
      .insert({ week_start: weekStart, content: trends, generated_at: new Date().toISOString() })

    if (upsertErr) throw new Error(upsertErr.message)

    return res.status(200).json({
      message: `Career trends cached for week ${weekStart}.`,
      weekStart,
      trendCount: trends.length,
    })
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Cron job failed.' })
  }
}
