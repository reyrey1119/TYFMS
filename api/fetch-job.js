// POST /api/fetch-job — fetch a job posting URL and extract structured info

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured.' })

  const { url } = req.body || {}
  if (!url?.trim()) return res.status(400).json({ error: 'URL is required.' })

  let pageText = ''
  try {
    const resp = await fetch(url.trim(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      signal: AbortSignal.timeout(10000),
      redirect: 'follow',
    })
    if (!resp.ok) {
      return res.status(400).json({ error: `Could not load the page (HTTP ${resp.status}). Try pasting the job description directly.` })
    }
    const html = await resp.text()
    pageText = html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 8000)
  } catch {
    return res.status(400).json({ error: 'Could not fetch that URL. Some job sites block automated access. Try pasting the job description directly.' })
  }

  if (!pageText.trim()) {
    return res.status(400).json({ error: 'No readable content found at that URL. Try pasting the job description directly.' })
  }

  const prompt = `Extract job posting information from this text. Return ONLY a valid JSON object with these keys:
- title: the job title (string)
- company: the company name (string)
- skills: comma-separated list of required skills, qualifications, and tools (string)
- responsibilities: 2-3 sentences summarizing the key responsibilities and what the person will do (string)

If a field cannot be determined from the text, use an empty string. No markdown, no commentary — only the raw JSON object.

Text:
${pageText}`

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    const data = await r.json()
    if (data.error) return res.status(400).json({ error: data.error.message })
    const text = (data.content || []).map(i => i.text || '').join('').trim()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return res.status(400).json({ error: 'Could not extract job information from that page.' })
    let jobData
    try { jobData = JSON.parse(jsonMatch[0]) } catch {
      return res.status(400).json({ error: 'Could not parse job information. Try pasting the description directly.' })
    }
    return res.status(200).json(jobData)
  } catch {
    return res.status(500).json({ error: 'Job extraction failed. Please try pasting the description directly.' })
  }
}
