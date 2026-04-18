/*
 * GET  /api/trends        — load career trends (Supabase cache → AI fallback)
 * POST /api/trends  { action: 'match', mos, branch, rank, trends }
 *
 * Supabase table (create if not exists):
 * CREATE TABLE career_trends_cache (
 *   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 *   week_start date UNIQUE NOT NULL,
 *   content jsonb NOT NULL,
 *   generated_at timestamptz NOT NULL DEFAULT now()
 * );
 * Env vars: SUPABASE_URL, SUPABASE_SERVICE_KEY, ANTHROPIC_API_KEY
 */

function getWeekStart() {
  const now = new Date()
  const day = now.getUTCDay()
  const diff = day === 0 ? -6 : 1 - day
  const mon = new Date(now)
  mon.setUTCDate(now.getUTCDate() + diff)
  mon.setUTCHours(0, 0, 0, 0)
  return mon.toISOString().slice(0, 10)
}

async function getSupabaseAdmin() {
  try {
    const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_KEY
    if (!url || !key) return null
    const { createClient } = await import('@supabase/supabase-js')
    return createClient(url, key, { auth: { persistSession: false } })
  } catch {
    return null
  }
}

async function generateTrends(weekStart, apiKey) {
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
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1200,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  const data = await r.json()
  if (data.error) throw new Error(data.error.message)
  const txt = (data.content || []).map(i => i.text || '').join('').replace(/```json|```/g, '').trim()

  // 3-strategy JSON extraction
  const arrMatch = txt.match(/\[[\s\S]*\]/)
  if (arrMatch) {
    try { return JSON.parse(arrMatch[0]) } catch {}
  }
  // Try finding last complete ]
  const lastBracket = txt.lastIndexOf(']')
  const firstBracket = txt.indexOf('[')
  if (firstBracket !== -1 && lastBracket !== -1) {
    try { return JSON.parse(txt.slice(firstBracket, lastBracket + 1)) } catch {}
  }
  throw new Error('Could not parse AI response.')
}

const FALLBACK_TRENDS = [
  {
    title: 'Federal Cybersecurity Demand Surges',
    category: 'Technology',
    description: 'Federal agencies and defense contractors are hiring thousands of cybersecurity professionals. Veterans with security clearances and IT training are first in line.',
    badgeCls: 'bg',
    score: 92,
    fullAnalysis: 'The federal government has mandated a dramatic expansion of its cybersecurity workforce following recent high-profile incidents. Veterans with any IT or signals background have an immediate advantage due to existing clearances and familiarity with classified systems. This week: search USAJobs for "cybersecurity" filtered to your clearance level — many roles are open now.',
  },
  {
    title: 'Logistics & Supply Chain Still Hot',
    category: 'Operations',
    description: 'Companies rebuilding supply chains after global disruptions need leaders who can manage complexity under pressure — exactly what military logistics veterans do.',
    badgeCls: 'ba',
    score: 85,
    fullAnalysis: 'Domestic manufacturing and reshoring have created sustained demand for logistics managers and operations directors. Veterans from supply, transportation, and ordnance MOSs translate directly into roles like warehouse director, fleet manager, and operations VP. Action: search LinkedIn for "supply chain manager veteran" — many companies actively source from military talent programs.',
  },
  {
    title: 'Healthcare Needs Military Medics',
    category: 'Healthcare',
    description: 'Hospitals and urgent care networks are offering accelerated licensing pathways for former military medics and corpsmen to fill critical nursing and PA shortages.',
    badgeCls: 'bd',
    score: 78,
    fullAnalysis: 'The nursing shortage has prompted 30+ states to pass bridge licensing laws specifically for military medical personnel. A former 68W or HM can often qualify for LPN licensure with minimal additional coursework. This week: visit your state\'s Board of Nursing website and search "military bridge program" to see what credits transfer.',
  },
  {
    title: 'Project Management Certification ROI',
    category: 'Business',
    description: 'PMP certification remains one of the highest-ROI credentials for veterans — it codifies leadership skills you already have into language civilian employers recognize.',
    badgeCls: 'bb',
    score: 70,
    fullAnalysis: 'Project managers with PMP certification command salaries 20%+ above non-certified peers, and military experience counts toward the required 36 months of project leadership. Veterans often pass the exam faster than civilians because military operations are essentially project management at scale. Action: PMI offers a military discount — apply at pmi.org/military this week.',
  },
]

export default async function handler(req, res) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return res.status(500).json({ error: 'API key not configured.' })

    // ── GET: load career trends ───────────────────────────────────────────────
    if (req.method === 'GET') {
      const weekStart = getWeekStart()
      const db = await getSupabaseAdmin()

      // 1. Supabase cache
      if (db) {
        try {
          const { data } = await db
            .from('career_trends_cache')
            .select('content, generated_at')
            .eq('week_start', weekStart)
            .single()

          if (data?.content && Array.isArray(data.content)) {
            return res.status(200).json({ trends: data.content, weekStart, source: 'cache', generatedAt: data.generated_at })
          }
        } catch { /* cache miss — continue */ }
      }

      // 2. AI generation
      try {
        const trends = await generateTrends(weekStart, apiKey)
        if (db) {
          try {
            await db.from('career_trends_cache').upsert(
              { week_start: weekStart, content: trends, generated_at: new Date().toISOString() },
              { onConflict: 'week_start' }
            )
          } catch { /* non-fatal */ }
        }
        return res.status(200).json({ trends, weekStart, source: 'generated' })
      } catch { /* AI failed — use fallback */ }

      // 3. Static fallback — always returns something
      return res.status(200).json({ trends: FALLBACK_TRENDS, weekStart, source: 'fallback' })
    }

    // ── POST: trend match ─────────────────────────────────────────────────────
    if (req.method === 'POST') {
      const { action, mos, branch, rank, trends } = req.body || {}

      if (action === 'match') {
        if (!mos || !Array.isArray(trends) || trends.length === 0) {
          return res.status(400).json({ error: 'MOS and trends required.' })
        }

        const prompt = `A veteran with the following background is viewing civilian career trends:
- Branch: ${branch || 'U.S. Military'}
- MOS / AFSC / Rate: ${mos}
- Rank: ${rank || 'not specified'}

Career trends to evaluate:
${trends.map((t, i) => `${i + 1}. ${t.title} (${t.category})`).join('\n')}

For each trend, provide:
1. matchScore: 0–100, how well this veteran's specific MOS and background aligns with this opportunity. Be specific — infantry aligns poorly with healthcare but well with security management.
2. matchReason: one sentence specific to their MOS explaining why this is or isn't a strong match. Do not write generic veteran language.

Return valid JSON only — a JSON array, nothing else:
[
  {"idx": 0, "matchScore": 85, "matchReason": "One sentence specific to their MOS."},
  {"idx": 1, "matchScore": 60, "matchReason": "One sentence."},
  {"idx": 2, "matchScore": 45, "matchReason": "One sentence."},
  {"idx": 3, "matchScore": 72, "matchReason": "One sentence."}
]`

        try {
          const r = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
            body: JSON.stringify({
              model: 'claude-sonnet-4-6',
              max_tokens: 500,
              messages: [{ role: 'user', content: prompt }],
            }),
          })
          const data = await r.json()
          if (data.error) return res.status(400).json({ error: data.error.message })
          const txt = (data.content || []).map(i => i.text || '').join('').replace(/```json|```/g, '').trim()
          const jsonMatch = txt.match(/\[[\s\S]*\]/)
          if (!jsonMatch) return res.status(500).json({ error: 'Could not parse match scores.' })
          return res.status(200).json({ matches: JSON.parse(jsonMatch[0]) })
        } catch {
          return res.status(500).json({ error: 'Could not compute match scores.' })
        }
      }

      return res.status(400).json({ error: 'Unknown action.' })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'Internal server error.' })
  }
}
