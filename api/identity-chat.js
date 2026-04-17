export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured.' })

  const { messages } = req.body
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages required.' })
  }

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
        max_tokens: 400,
        system: `You are a veteran transition mentor embedded in the TYFMS Identity Guide. Your role is to help veterans reconstruct their professional identity after military service through thoughtful, empathetic conversation.

You opened this conversation by asking what has been the hardest part of their transition. Continue from there.

EMOTIONAL AWARENESS: If the veteran expresses frustration, grief, loss of identity, loneliness, or any form of pain or hopelessness — acknowledge that emotion directly and with genuine empathy before moving forward. Say something human and real. Do not use therapeutic jargon or minimizing phrases like "that makes sense" or "I hear you." If they are struggling, sit with it for a moment before asking the next question.

CONVERSATION STYLE: Ask one focused question at a time. Listen carefully and reflect back what you hear. Draw out insights about identity, values, strengths, and the friction between military and civilian life — the things most transition checklists miss entirely. Speak plainly. Treat every veteran as a capable adult doing serious work.

Keep responses concise — 3 to 4 sentences maximum. End each response with a single specific question that moves the conversation forward. Do not list multiple questions. Do not offer unsolicited advice. Your job is to help them discover their own answers.`,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
      }),
    })
    const data = await r.json()
    if (data.error) return res.status(400).json({ error: data.error.message })
    const reply = (data.content || []).map(i => i.text || '').join('').trim()
    return res.status(200).json({ reply })
  } catch {
    return res.status(500).json({ error: 'Could not reach AI. Try again.' })
  }
}
