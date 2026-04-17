export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured.' })

  const { messages } = req.body
  if (!Array.isArray(messages) || messages.length < 3) {
    return res.status(400).json({ error: 'More conversation needed to generate a statement.' })
  }

  const responses = messages
    .filter(m => m.role === 'user')
    .map(m => m.content)
    .join('\n\n')

  const prompt = `Based on this veteran's reflections in an identity coaching conversation, write a professional identity statement they can use in job interviews, LinkedIn profiles, and networking introductions.

The statement must:
- Be 2 to 3 sentences
- Lead with their military background translated into civilian value
- Capture their core professional identity and what drives them
- Sound like something a real person would actually say, not polished corporate language
- Be specific to what they shared — not generic veteran boilerplate

Veteran's conversation responses:
${responses}

Write only the identity statement. No preamble, no explanation, no quotation marks.`

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
    const statement = (data.content || []).map(i => i.text || '').join('').trim()
    return res.status(200).json({ statement })
  } catch {
    return res.status(500).json({ error: 'Could not generate statement. Try again.' })
  }
}
