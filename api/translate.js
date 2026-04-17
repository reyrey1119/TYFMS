export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server.' })
  }

  const { branch, mos, rank, yos } = req.body || {}
  if (!mos) {
    return res.status(400).json({ error: 'MOS/AFSC is required.' })
  }

  const prompt = `You are a career counselor specializing in military-to-civilian transitions. Translate this veteran's military background into civilian career terms.

Branch: ${branch}
Occupational code: ${mos}
${rank ? 'Rank: ' + rank : ''}
${yos ? 'Years of service: ' + yos : ''}

Respond ONLY with valid JSON, no markdown, no extra text:
{"civilianTitles":["t1","t2","t3"],"transferableSkills":["s1","s2","s3","s4","s5","s6"],"careerPaths":[{"title":"path","description":"why it fits"},{"title":"path","description":"why it fits"},{"title":"path","description":"why it fits"}],"targetIndustries":["i1","i2","i3","i4"],"identityTip":"one specific actionable tip for identity transition from this background"}`

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
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await r.json()
    if (data.error) {
      return res.status(400).json({ error: data.error.message })
    }

    const txt = (data.content || [])
      .map(i => i.text || '')
      .join('')
      .replace(/```json|```/g, '')
      .trim()

    return res.status(200).json(JSON.parse(txt))
  } catch (e) {
    return res.status(500).json({ error: 'Translation failed. Please try again.' })
  }
}
