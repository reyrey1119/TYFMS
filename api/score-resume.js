// POST /api/score-resume — score a resume against a job description

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured.' })

  const { resume, jobDescription } = req.body || {}
  if (!resume?.trim() || !jobDescription?.trim()) {
    return res.status(400).json({ error: 'Resume and job description are required.' })
  }

  const prompt = `You are an expert ATS resume analyst and veteran hiring consultant. Score this resume against the job description on three dimensions.

RESUME:
${resume.slice(0, 3500)}

JOB DESCRIPTION:
${jobDescription.slice(0, 2000)}

Return ONLY a valid JSON object with these exact fields:
{
  "overall": <integer 0-100, weighted average: keyword_match 40% + experience_alignment 40% + ats_compatibility 20%>,
  "keyword_match": <integer 0-100, how well resume keywords, skills, and terminology match what the job description asks for>,
  "experience_alignment": <integer 0-100, how well the veteran's experience level, accomplishments, and background match what the role needs>,
  "ats_compatibility": <integer 0-100, clean formatting, standard section headers, no tables or columns that confuse ATS parsers>,
  "suggestions": [
    "<specific actionable improvement — reference actual content from the job description and resume, not generic advice>",
    "<specific actionable improvement — reference actual content from the job description and resume, not generic advice>",
    "<specific actionable improvement — reference actual content from the job description and resume, not generic advice>"
  ]
}

Score benchmarks: 80-100 = strong match, high callback likelihood. 60-79 = moderate match, gaps exist. 0-59 = significant gaps.

Suggestions must name specific skills, keywords, or experience gaps. Do not write generic advice like "add more keywords."

No markdown, no preamble — only the JSON object.`

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 700,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    const data = await r.json()
    if (data.error) return res.status(400).json({ error: data.error.message })
    const text = (data.content || []).map(i => i.text || '').join('').trim()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return res.status(400).json({ error: 'Could not generate score.' })
    let scoreData
    try { scoreData = JSON.parse(jsonMatch[0]) } catch {
      return res.status(400).json({ error: 'Invalid score format returned.' })
    }
    return res.status(200).json(scoreData)
  } catch {
    return res.status(500).json({ error: 'Resume scoring failed. Please try again.' })
  }
}
