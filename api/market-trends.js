export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured.' })

  const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000))

  const prompt = `You are a veteran career advisor tracking civilian job market trends. Generate a "This week in civilian careers" briefing for veterans transitioning from military service. This content is for week ${weekNum}.

Return exactly 4 trend cards as valid JSON. Each card highlights a real, current trend in the civilian job market relevant to veterans — booming industries, high-demand roles, major hiring surges, or skills gaps veterans can uniquely fill.

Use badgeCls "bg" for tech/growth roles, "ba" for trades/defense/manufacturing, "bb" for government/federal jobs, "bd" for healthcare/social services. Mix the badge types.

Response format — a JSON array, nothing else:
[
  {
    "title": "Short punchy headline (5-8 words)",
    "category": "Sector name",
    "description": "2-3 sentences explaining the trend and why it matters for veterans specifically.",
    "badgeCls": "bg"
  }
]`

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 800,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    const data = await r.json()
    if (data.error) return res.status(400).json({ error: data.error.message })
    const txt = (data.content || []).map(i => i.text || '').join('').replace(/```json|```/g, '').trim()
    const jsonMatch = txt.match(/\[[\s\S]*\]/)
    if (!jsonMatch) return res.status(500).json({ error: 'Could not parse trends.' })
    const trends = JSON.parse(jsonMatch[0])
    return res.status(200).json({ trends, week: weekNum })
  } catch {
    return res.status(500).json({ error: 'Could not load market trends.' })
  }
}
