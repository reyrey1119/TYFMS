export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured on server.' })

  const { goals } = req.body || {}
  if (!Array.isArray(goals) || goals.length === 0) {
    return res.status(400).json({ error: 'Goals required.' })
  }

  const doneGoals = goals.filter(g => g.done)
  const pendingGoals = goals.filter(g => !g.done)
  const pct = Math.round((doneGoals.length / goals.length) * 100)

  const prompt = `You are a veteran transition coach. A veteran is tracking their transition goals.

Progress: ${doneGoals.length} of ${goals.length} goals complete (${pct}%)
Completed: ${doneGoals.map(g => g.title || g.category || 'a goal').join(', ') || 'none yet'}
Still working on: ${pendingGoals.map(g => g.title || g.category || 'a goal').join(', ') || 'all complete'}

Write a brief, personalized weekly encouragement message (3-4 sentences) that:
1. Acknowledges their specific progress by name — not generic praise
2. Names the pattern or momentum you see in the goals they chose
3. Gives one concrete action they can take this week based on what's pending
4. Ends with one forward-looking sentence that is specific, not a cliché

Plain language. Warm but direct. Under 100 words. No military clichés like "mission" or "deploy".`

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
        max_tokens: 220,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    const data = await r.json()
    if (data.error) return res.status(400).json({ error: data.error.message })
    const encouragement = (data.content || []).map(i => i.text || '').join('')
    return res.status(200).json({ encouragement })
  } catch {
    return res.status(500).json({ error: 'Encouragement generation failed. Please try again.' })
  }
}
