// POST /api/resume  — full resume builder (used by ResumeTab)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured on server.' })

  const {
    branch, mos, rank, yos, targetCompany, additionalSkills,
    clearance, awards, summaryTone, education, contact, prevJobs,
  } = req.body || {}

  if (!mos?.trim()) return res.status(400).json({ error: 'MOS, AFSC, or rate code is required.' })

  const companyContext = targetCompany?.trim()
    ? `The veteran is targeting: ${targetCompany.trim()}. Tailor tone, skills, ATS keywords, and language to that company's known culture, values, and priorities.`
    : 'Tailor for general civilian employment. Include broad ATS keywords relevant to the MOS and target industry.'

  const contactLine = contact
    ? [
        contact.name || '[YOUR NAME]',
        contact.location || '[City, State]',
        contact.email || '[email@example.com]',
        contact.phone || '[phone]',
        contact.linkedin || null,
      ].filter(Boolean).join(' | ')
    : '[YOUR NAME] | [City, State] | [email@example.com] | [phone]'

  const hasClearance = clearance && clearance !== 'None' && clearance !== ''
  const hasAwards = awards?.trim()
  const toneNote = summaryTone || 'Modern and direct'

  const educationEntries = Array.isArray(education)
    ? education.filter(e => e.school?.trim() || e.degreeType?.trim())
    : []
  const hasEducation = educationEntries.length > 0
  const educationBlock = hasEducation
    ? educationEntries.map(e =>
        `${e.degreeType || 'Degree'}${e.field ? `, ${e.field}` : ''} | ${e.school || 'Institution'} | ${e.gradYear || '[Year]'}${e.gpa ? ` | GPA: ${e.gpa}` : ''}`
      ).join('\n')
    : null

  const prevJobsBlock = Array.isArray(prevJobs) && prevJobs.filter(j => j.title?.trim()).length > 0
    ? '\n\nNon-military experience to include:\n' + prevJobs
        .filter(j => j.title?.trim())
        .map(j => `- ${j.title} at ${j.employer || 'N/A'} (${j.dates || 'N/A'}): ${j.description || ''}`)
        .join('\n')
    : ''

  const prompt = `You are an expert resume writer specializing in veteran-to-civilian career transitions. Create a complete, ATS-optimized civilian resume.

VETERAN PROFILE:
- Branch: ${branch || 'US Military'}
- MOS/AFSC/Rate: ${mos.trim()}
- Rank: ${rank?.trim() || 'Not specified'}
- Years of service: ${yos?.trim() || 'Not specified'}
- Additional skills: ${additionalSkills?.trim() || 'None listed'}${hasClearance ? `\n- Security clearance: ${clearance} — include prominently near the header as it is a major hiring advantage` : ''}${hasAwards ? `\n- Awards/decorations: ${awards.trim()} — translate each into a specific civilian achievement statement` : ''}

TARGET: ${companyContext}
SUMMARY TONE: ${toneNote}${prevJobsBlock}

CRITICAL RULES:
1. NEVER use military acronyms without civilian translation
2. Use strong action verbs: Led, Directed, Managed, Executed, Optimized, Deployed, Trained, Coordinated, Streamlined, Spearheaded
3. Quantify every bullet with realistic placeholders: [X%], [$X], [N personnel], [N months]
4. Include ATS keywords relevant to the target company/industry throughout the document
5. Professional summary MUST lead with the veteran's strongest civilian value proposition in ${toneNote} tone
6. Section headers use ─────────────────────────────────────────────── as dividers${hasClearance ? '\n7. Show clearance on its own line after contact info' : ''}${!hasEducation ? '\n8. EDUCATION section must show exactly: ADD YOUR EDUCATION HERE — never invent degrees' : ''}

OUTPUT — plain text only, no markdown, follow this exact format:

${contactLine}${hasClearance ? `\nCLEARANCE: ${clearance}` : ''}

─────────────────────────────────────────────────────
PROFESSIONAL SUMMARY
─────────────────────────────────────────────────────
[4–5 sentences in ${toneNote} tone. Lead with total years of experience + top value proposition. Make it specific to the target employer. End with a forward-looking statement about delivering results.]

─────────────────────────────────────────────────────
CORE COMPETENCIES
─────────────────────────────────────────────────────
[Skill 1]                    [Skill 2]                    [Skill 3]
[Skill 4]                    [Skill 5]                    [Skill 6]
[Skill 7]                    [Skill 8]                    [Skill 9]
[12–16 ATS-optimized skills in 3-column layout, matching target company priorities]

─────────────────────────────────────────────────────
PROFESSIONAL EXPERIENCE
─────────────────────────────────────────────────────

[Translated Civilian Job Title] | ${branch || 'U.S. Military'}
[Start Year] – [End Year]
• [Scope bullet: N personnel led, $X budget managed, geographic/operational scale]
• [Quantified achievement with strong action verb]
• [Quantified achievement with strong action verb]
• [Technical or systems competency relevant to target role]
• [Outcome or impact bullet with measurable result]

[Earlier Civilian Title] | ${branch || 'U.S. Military'}
[Start Year] – [End Year]
• [Achievement bullet]
• [Achievement bullet]
• [Achievement bullet]
${Array.isArray(prevJobs) && prevJobs.filter(j => j.title?.trim()).length > 0 ? '\n[Non-military roles: include each provided role with civilian job title, employer, dates, and 2–3 strong achievement bullets]\n' : ''}${hasAwards ? `
─────────────────────────────────────────────────────
HONORS & RECOGNITION
─────────────────────────────────────────────────────
[Translate each award into a civilian achievement statement — e.g., Bronze Star → "Recognized for exceptional leadership and decision-making under high-stakes conditions"]
` : ''}
─────────────────────────────────────────────────────
EDUCATION
─────────────────────────────────────────────────────
${hasEducation ? educationBlock : 'ADD YOUR EDUCATION HERE'}

─────────────────────────────────────────────────────
CERTIFICATIONS & TRAINING
─────────────────────────────────────────────────────
[Certification 1] | [Year or In Progress]
[Certification 2] | [Year or In Progress]
[2–4 real civilian certifications directly relevant to MOS and target role — include actual certification names, not generic descriptions]

Return only the resume text — no preamble, no commentary, no markdown.`

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2500,
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
