export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured on server.' })

  const { moduleTitle, theme, responses } = req.body || {}
  const filled = (responses || []).filter(r => r.response?.trim())
  if (!filled.length) return res.status(400).json({ error: 'No responses provided.' })

  const prompt = `You are a compassionate veteran transition counselor. A veteran just completed reflection exercises.

Module: "${moduleTitle}"
Theme: ${theme}

Their responses:
${filled.map(r => `Prompt: ${r.prompt}\nResponse: ${r.response}`).join('\n\n')}

Write personalized feedback in four short paragraphs:
1. Acknowledge what they shared — be specific to their actual words, not generic
2. Name a strength or insight that came through in their responses
3. Give 2-3 concrete next steps they can take this week, based specifically on what they wrote
4. One sentence of genuine encouragement — forward-looking, not a cliché

Rules: No military clichés. Plain, direct language. Under 220 words total. Be warm but not saccharine.`

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
        max_tokens: 600,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    const data = await r.json()
    if (data.error) return res.status(400).json({ error: data.error.message })
    const feedback = (data.content || []).map(i => i.text || '').join('')
    return res.status(200).json({ feedback })
  } catch {
    return res.status(500).json({ error: 'Feedback generation failed. Please try again.' })
  }
}
