// POST /api/resume  — full resume builder (used by ResumeTab)
// Body: { branch, mos, rank, yos, targetCompany, additionalSkills, contact, prevJobs }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured on server.' })

  const { branch, mos, rank, yos, targetCompany, additionalSkills, contact, prevJobs } = req.body || {}
  if (!mos?.trim()) return res.status(400).json({ error: 'MOS, AFSC, or rate code is required.' })

  const companyContext = targetCompany?.trim()
    ? `The veteran is targeting: ${targetCompany.trim()}. Tailor the tone, skills emphasis, and language to that company's culture and values.`
    : 'Tailor for general civilian employment in the private sector.'

  const contactBlock = contact
    ? `Name: ${contact.name || '[YOUR NAME]'} | Email: ${contact.email || '[email]'} | Phone: ${contact.phone || '[phone]'} | Location: ${contact.location || '[City, State]'}${contact.linkedin ? ' | ' + contact.linkedin : ''}`
    : '[YOUR NAME] | [City, State] | [email@example.com] | [LinkedIn URL] | [Phone]'

  const prevJobsBlock = Array.isArray(prevJobs) && prevJobs.filter(j => j.title?.trim()).length > 0
    ? '\n\nNon-military experience to include:\n' + prevJobs
        .filter(j => j.title?.trim())
        .map(j => `- ${j.title} at ${j.employer || 'N/A'} (${j.dates || 'N/A'}): ${j.description || ''}`)
        .join('\n')
    : ''

  const prompt = `You are an expert resume writer who specializes in veteran-to-civilian career transitions. Create a complete, polished one-page civilian resume.

Veteran profile:
- Branch: ${branch || 'US Military'}
- MOS / AFSC / Rate: ${mos.trim()}
- Rank: ${rank?.trim() || 'Not specified'}
- Years of service: ${yos?.trim() || 'Not specified'}
- Additional skills: ${additionalSkills?.trim() || 'None listed'}

Target: ${companyContext}${prevJobsBlock}

Generate the full resume in plain text. Include every section below. Translate ALL military terminology into civilian language — never use acronyms without explanation. Quantify results with realistic bracketed placeholders like [X%], [N people], [$X], [N years].

Format exactly as follows:

${contactBlock}

PROFESSIONAL SUMMARY
3-4 sentence summary tailored to the target company, leading with years of experience and top value proposition.

CORE COMPETENCIES
12-16 skills in a 3-column list, matched to the target company's known priorities.

PROFESSIONAL EXPERIENCE

[Job Title translated from MOS] | [Equivalent civilian employer name]
[Start Year] – [End Year]
• 4-5 bullet points with quantified achievements, leadership scope, and impact
• Use strong action verbs. No military jargon.

[Second Job Title] | [Branch of Service, abbreviated]
[Start Year] – [End Year]
• 3-4 bullet points for an earlier role or different function within service
${prevJobs?.filter(j => j.title?.trim()).length > 0 ? `
[Non-military roles — include each provided above with title, employer, dates, and 2-3 bullets translating their civilian experience]` : ''}

EDUCATION
[Degree or In Progress] | [Institution]
Expected [Year] or [Year]
Relevant coursework or training programs translated from military.

CERTIFICATIONS & TRAINING
List 2-4 relevant certifications based on MOS (real civilian equivalents where they exist).

Return only the resume text — no preamble, no commentary.`

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
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
