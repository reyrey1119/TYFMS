export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured on server.' })

  const { branch, mos, rank, yos, civilianTitles, transferableSkills, careerPaths, targetIndustries } = req.body || {}
  if (!mos) return res.status(400).json({ error: 'Military background required.' })

  const prompt = `You are an expert resume writer specializing in military-to-civilian transitions. Create a complete, professional resume draft.

Military background:
- Branch: ${branch}
- Occupational code: ${mos}
${rank ? `- Rank: ${rank}` : ''}
${yos ? `- Years of service: ${yos}` : ''}

Civilian profile (AI-translated):
- Target titles: ${(civilianTitles || []).join(', ')}
- Key skills: ${(transferableSkills || []).join(', ')}
- Career paths: ${(careerPaths || []).map(p => p.title).join(', ')}
- Target industries: ${(targetIndustries || []).join(', ')}

Write a complete resume with these exact sections, separated by blank lines:

[YOUR NAME]
[City, State] | [Phone] | [Email] | [LinkedIn URL]

PROFESSIONAL SUMMARY
3-4 sentences. Civilian language only. No military jargon. Lead with years of experience and top value.

CORE COMPETENCIES
List 12 skills relevant to the target roles, formatted as three columns of four (use " | " to separate columns).

PROFESSIONAL EXPERIENCE
[Civilian Job Title equivalent] | [Branch of Service]
[Start Year] – [End Year]
• 5-6 bullet points with strong action verbs and quantified achievements using placeholder numbers like [X]% or [N] team members

EDUCATION & TRAINING
[Your Degree, if applicable] | [Institution] | [Year]
[Relevant Military Training/School] | [Year]

CERTIFICATIONS & CLEARANCES
• [Security Clearance Level] Security Clearance (if applicable based on MOS)
• [Relevant Certification] — list 2-3 likely certifications for this MOS

Return only the resume text. No markdown, no extra commentary.`

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
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    const data = await r.json()
    if (data.error) return res.status(400).json({ error: data.error.message })
    const resume = (data.content || []).map(i => i.text || '').join('')
    return res.status(200).json({ resume })
  } catch {
    return res.status(500).json({ error: 'Resume generation failed. Please try again.' })
  }
}
