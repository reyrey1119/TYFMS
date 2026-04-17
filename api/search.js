export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured on server.' })

  const { query } = req.body || {}
  if (!query?.trim()) return res.status(400).json({ error: 'Search query required.' })

  const prompt = `You are a helpful assistant for TYFMS, a veteran transition platform.

Available tabs:
- home: Overview and navigation
- translator: Skills translator — convert MOS/AFSC to civilian job titles, skills, career paths
- identity: Identity guide — 4 reflection modules on professional identity reconstruction
- network: Peer networking — connect with veteran mentors and mentees
- tracker: Progress tracker — set and track transition goals by category
- resources: Resources — VA benefits (va.gov, VR&E, eBenefits), Education (GI Bill, GoArmyEd, Student Veterans of America), Career tools (O*NET, Hiring Our Heroes, LinkedIn for Veterans), Mental health (Veterans Crisis Line 988, Make the Connection, Give an Hour)
- about: About TYFMS — the research and story behind the platform

Search query: "${query}"

Respond ONLY with valid JSON:
{"tab":"<tab_id>","summary":"<2-3 sentence answer directly addressing the query>","sectionHint":"<optional: specific section or resource within the tab>"}`

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
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    const data = await r.json()
    if (data.error) return res.status(400).json({ error: data.error.message })
    const txt = (data.content || []).map(i => i.text || '').join('').replace(/```json|```/g, '').trim()
    return res.status(200).json(JSON.parse(txt))
  } catch {
    return res.status(500).json({ error: 'Search failed. Please try again.' })
  }
}
