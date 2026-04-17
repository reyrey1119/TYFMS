export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured.' })

  const { milestone, phase } = req.body
  if (!milestone) return res.status(400).json({ error: 'Milestone required.' })

  const prompt = `A veteran just completed this transition milestone: "${milestone}" in the "${phase}" phase of their transition roadmap.

Write exactly 2 sentences of genuine, specific encouragement. Reference the milestone directly. Make it feel earned, not generic. No emojis. Plain language only.`

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
        max_tokens: 120,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    const data = await r.json()
    if (data.error) return res.status(400).json({ error: data.error.message })
    const encouragement = (data.content || []).map(i => i.text || '').join('').trim()
    return res.status(200).json({ encouragement })
  } catch {
    return res.status(500).json({ error: 'Could not load encouragement.' })
  }
}
