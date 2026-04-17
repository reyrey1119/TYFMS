export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured.' })

  const { mos, branch, rank, trends } = req.body
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
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
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
    const matches = JSON.parse(jsonMatch[0])
    return res.status(200).json({ matches })
  } catch {
    return res.status(500).json({ error: 'Could not compute match scores.' })
  }
}
