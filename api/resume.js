// POST /api/resume  — full resume builder (used by ResumeTab)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured on server.' })

  const {
    branch, mos, rank, yos, targetCompany, additionalSkills,
    clearance, awards, summaryTone, education, contact, prevJobs,
    additionalContext, jobDescription, milReference, milDuties,
    format, cvExtras, milPositions, vaultContext,
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

  const additionalContextBlock = additionalContext?.trim()
    ? `\nADDITIONAL CONTEXT: ${additionalContext.trim()}`
    : ''

  const jobDescBlock = jobDescription?.trim()
    ? `\n\nJOB DESCRIPTION (tailor the entire resume to match this specific role):\n${jobDescription.trim().slice(0, 2500)}`
    : ''

  const milRefBlock = milReference && !milReference.error
    ? `\n\nOFFICIAL DUTY DESCRIPTION (source: ${milReference.document_source || 'military career management publication'}):\nDuty Title: ${milReference.duty_title || ''}\nDuties and Responsibilities: ${milReference.duties_and_responsibilities || ''}\nKey Skills: ${milReference.key_skills || ''}\nRank-Specific Expectations: ${milReference.rank_specific_expectations || ''}\nCivilian Translation Hints: ${milReference.civilian_translation_hints || ''}\n\nIMPORTANT: Use this official duty description as the authoritative source for what this veteran did. Translate military terminology into civilian language. Base resume bullets on these documented duties — do not invent responsibilities not listed here.`
    : (milDuties?.trim()
      ? `\n\nVETERAN-DESCRIBED DUTIES:\n${milDuties.trim()}\n\nUse these described duties as the primary source for the Professional Experience section.`
      : '')

  // Build military positions block for multi-position experience
  const validMilPositions = Array.isArray(milPositions)
    ? milPositions.filter(p => p.mos?.trim() || p.title?.trim())
    : []

  const milPositionsBlock = validMilPositions.length > 0
    ? '\n\nMILITARY SERVICE POSITIONS (most recent first — generate one experience entry per position):\n' +
      validMilPositions.map((p, i) =>
        `Position ${i + 1}: ${p.mos || p.title}${p.unit ? ` | Unit: ${p.unit}` : ''}${p.location ? ` | Location: ${p.location}` : ''} | ${p.startDate || '[Start]'} – ${p.present ? 'Present' : (p.endDate || '[End]')}${p.duties?.trim() ? `\n  Duties: ${p.duties.trim().slice(0, 300)}` : ''}`
      ).join('\n')
    : ''

  const vaultBlock = vaultContext?.trim()
    ? `\n\n${'═'.repeat(60)}\nOFFICIAL SERVICE RECORD — HIGHEST PRIORITY SOURCE\n${'═'.repeat(60)}\nThe following content is extracted directly from this veteran's official service documents including evaluation reports, award citations, and discharge records. This is their actual recorded performance — not a generic MOS description.\n\nCRITICAL INSTRUCTION: Prioritize this information above all other sources. Use specific accomplishments, ratings, and language found in these documents. Every bullet point on this resume should be traceable to something in their actual record. Use the veteran's exact wording where possible, then translate military terminology to civilian language.\n\n${vaultContext.trim().slice(0, 10000)}\n${'═'.repeat(60)}`
    : ''

  const targetLabel = targetCompany?.trim() || 'this employer'

  // Build the experience section template
  const experienceTemplate = validMilPositions.length > 0
    ? validMilPositions.map(p =>
        `[Translate "${p.mos || p.title}" to civilian job title] | ${branch || 'U.S. Military'}
${p.startDate || '[Start Year]'} – ${p.present ? 'Present' : (p.endDate || '[End Year]')}
• [Scope bullet: N personnel led, $X budget managed, geographic/operational scale]
• [Quantified achievement with strong action verb]
• [Quantified achievement with strong action verb]
• [Technical or systems competency relevant to target role]
• [Outcome or impact bullet with measurable result]`
      ).join('\n\n')
    : `[Translated Civilian Job Title] | ${branch || 'U.S. Military'}
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
• [Achievement bullet]`

  const prompt = `You are an expert resume writer specializing in veteran-to-civilian career transitions. Create a complete, ATS-optimized civilian resume.

VETERAN PROFILE:
- Branch: ${branch || 'US Military'}
- MOS/AFSC/Rate: ${mos.trim()}
- Rank: ${rank?.trim() || 'Not specified'}
- Years of service: ${yos?.trim() || 'Not specified'}
- Additional skills: ${additionalSkills?.trim() || 'None listed'}${hasClearance ? `\n- Security clearance: ${clearance} — include prominently near the header as it is a major hiring advantage` : ''}${hasAwards ? `\n- Awards/decorations: ${awards.trim()} — translate each into a specific civilian achievement statement` : ''}

TARGET: ${companyContext}
SUMMARY TONE: ${toneNote}${prevJobsBlock}${additionalContextBlock}${jobDescBlock}${milRefBlock}${milPositionsBlock}${vaultBlock}

CRITICAL RULES:
1. NEVER use military acronyms without civilian translation
2. Use strong action verbs: Led, Directed, Managed, Executed, Optimized, Trained, Coordinated, Built, Cut, Grew, Delivered
3. Quantify every bullet with specific numbers drawn from the duty description or credible estimates for the rank/role
4. Include ATS keywords relevant to the target company/industry throughout the document
5. PROFESSIONAL SUMMARY: One flowing paragraph of 4-5 sentences in ${toneNote} tone. Open with the veteran's core identity and total years of experience. Connect their background directly to the target role and company. Close with one confident statement about what they will deliver. No bullets. No placeholder tokens like [N]. Written like a confident, experienced professional — not an AI.
6. Section headers use ─────────────────────────────────────────────── as dividers${hasClearance ? '\n7. Show clearance on its own line after contact info' : ''}${!hasEducation ? '\n8. EDUCATION section must show exactly: ADD YOUR EDUCATION HERE — never invent degrees' : ''}
9. ANTI-AI LANGUAGE: Never use em dashes — replace with commas or periods. Never use: leverage, utilize, synergize, robust, holistic, in order to, it is worth noting, as previously mentioned, going forward, moving forward. Active voice throughout.
10. VARY SENTENCE LENGTH: Mix short punchy statements (6-8 words) with longer detailed ones (15-20 words). Every metric must be specific — never "significantly improved," always a real number.

OUTPUT — plain text only, no markdown, follow this exact format:

${contactLine}${hasClearance ? `\nCLEARANCE: ${clearance}` : ''}

─────────────────────────────────────────────────────
PROFESSIONAL SUMMARY
─────────────────────────────────────────────────────
[Single paragraph, 4-5 sentences in ${toneNote} tone: open with core identity and years of experience, connect background to target role, close with what you will deliver. No bullets. No placeholders. Confident and specific.]

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

${experienceTemplate}
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

  // ── CV format override ────────────────────────────────────────────────────────
  let activePrompt = prompt
  let activeMaxTokens = 3000

  if (format === 'cv') {
    const pubBlock = Array.isArray(cvExtras?.publications) && cvExtras.publications.filter(p => p.title?.trim()).length > 0
      ? '\n\nPUBLICATIONS & RESEARCH:\n' + cvExtras.publications.filter(p => p.title?.trim()).map(p => `${p.title} | ${p.journal || 'Journal/Conference'} | ${p.year || '[Year]'}`).join('\n')
      : ''
    const presBlock = Array.isArray(cvExtras?.presentations) && cvExtras.presentations.filter(p => p.title?.trim()).length > 0
      ? '\n\nPRESENTATIONS:\n' + cvExtras.presentations.filter(p => p.title?.trim()).map(p => `${p.title} | ${p.event || 'Event'} | ${p.year || '[Year]'}`).join('\n')
      : ''
    const pdBlock = cvExtras?.pdCourses?.trim() ? `\n\nPROFESSIONAL DEVELOPMENT COURSES:\n${cvExtras.pdCourses.trim()}` : ''
    const volBlock = cvExtras?.volunteerService?.trim() ? `\n\nVOLUNTEER & COMMUNITY SERVICE:\n${cvExtras.volunteerService.trim()}` : ''
    const memBlock = cvExtras?.memberships?.trim() ? `\n\nPROFESSIONAL MEMBERSHIPS:\n${cvExtras.memberships.trim()}` : ''
    const teachBlock = cvExtras?.teachingExp?.trim() ? `\n\nTEACHING & TRAINING EXPERIENCE:\n${cvExtras.teachingExp.trim()}` : ''

    const cvExperienceTemplate = validMilPositions.length > 0
      ? validMilPositions.map(p =>
          `[Translate "${p.mos || p.title}" to civilian job title] | ${branch || 'U.S. Military'}
${p.startDate || '[Start Year]'} – ${p.present ? 'Present' : (p.endDate || '[End Year]')}
• [Scope bullet: personnel led, budget managed, geographic scale]
• [Quantified achievement]
• [Quantified achievement]
• [Technical or systems competency]
• [Leadership or policy outcome]
• [Outcome or impact bullet]`
        ).join('\n\n')
      : `[Translated Civilian Job Title] | ${branch || 'U.S. Military'}
[Start Year] – [End Year]
• [Scope bullet: personnel led, budget managed, geographic scale]
• [Quantified achievement]
• [Quantified achievement]
• [Technical or systems competency]
• [Leadership or policy outcome]
• [Outcome or impact bullet]

[Earlier Title] | ${branch || 'U.S. Military'}
[Start Year] – [End Year]
• [Achievement bullet]
• [Achievement bullet]
• [Achievement bullet]`

    activeMaxTokens = 4000
    activePrompt = `You are an expert CV writer specializing in veteran-to-civilian career transitions for federal government, academic, and senior leadership roles. Create a comprehensive, ATS-optimized civilian CV.

DOCUMENT TYPE: Curriculum Vitae (CV) — NOT a resume. Optimized for GS federal positions, academic roles, and senior leadership applications. CVs are longer and more comprehensive than resumes.

VETERAN PROFILE:
- Branch: ${branch || 'US Military'}
- MOS/AFSC/Rate: ${mos.trim()}
- Rank: ${rank?.trim() || 'Not specified'}
- Years of service: ${yos?.trim() || 'Not specified'}
- Additional skills: ${additionalSkills?.trim() || 'None listed'}${hasClearance ? `\n- Security clearance: ${clearance} — include prominently; critical for federal roles` : ''}${hasAwards ? `\n- Awards/decorations: ${awards.trim()}` : ''}

TARGET: ${companyContext}${prevJobsBlock}${additionalContextBlock}${jobDescBlock}${milRefBlock}${milPositionsBlock}${vaultBlock}${pubBlock}${presBlock}${pdBlock}${volBlock}${memBlock}${teachBlock}

CRITICAL RULES:
1. NEVER use military acronyms without civilian translation
2. Use strong action verbs throughout
3. Quantify achievements with specific numbers
4. NO em dashes — use commas or periods instead
5. NO filler words: leverage, utilize, synergize, robust, holistic
6. Active voice throughout
7. PROFESSIONAL SUMMARY: One flowing paragraph of 5-6 sentences. Open with core identity and years of experience. Tailor to federal/academic/senior leadership context. End with a forward-looking statement. No bullets, no placeholders.
8. Section headers use ─────────────────────────────────────────────── as dividers${hasClearance ? '\n9. Show clearance prominently after contact info' : ''}

OUTPUT — plain text only, no markdown, follow this exact format:

${contactLine}${hasClearance ? `\nCLEARANCE: ${clearance}` : ''}

─────────────────────────────────────────────────────
PROFESSIONAL SUMMARY
─────────────────────────────────────────────────────
[Single paragraph, 5-6 sentences. Core identity + years of experience. Target context. Forward-looking close. Confident, specific, human.]

─────────────────────────────────────────────────────
CORE COMPETENCIES
─────────────────────────────────────────────────────
[Skill 1]                    [Skill 2]                    [Skill 3]
[Skill 4]                    [Skill 5]                    [Skill 6]
[Skill 7]                    [Skill 8]                    [Skill 9]
[14–18 competencies in 3-column layout]

─────────────────────────────────────────────────────
PROFESSIONAL EXPERIENCE
─────────────────────────────────────────────────────

${cvExperienceTemplate}
${Array.isArray(prevJobs) && prevJobs.filter(j => j.title?.trim()).length > 0 ? '\n[Non-military roles: include each with civilian title, employer, dates, 3–4 achievement bullets]\n' : ''}${hasAwards ? `
─────────────────────────────────────────────────────
HONORS & RECOGNITION
─────────────────────────────────────────────────────
[Translate each award into a civilian achievement statement]
` : ''}
─────────────────────────────────────────────────────
EDUCATION
─────────────────────────────────────────────────────
${hasEducation ? educationBlock : 'ADD YOUR EDUCATION HERE'}

─────────────────────────────────────────────────────
CERTIFICATIONS & LICENSES
─────────────────────────────────────────────────────
[Certification | Year]
[Include all relevant certifications with dates; federal roles require specific certs]

─────────────────────────────────────────────────────
PROFESSIONAL DEVELOPMENT
─────────────────────────────────────────────────────
${cvExtras?.pdCourses?.trim() ? cvExtras.pdCourses.trim() : '[Military and civilian professional development courses, schools, and training programs with years]'}
${pubBlock ? `
─────────────────────────────────────────────────────
PUBLICATIONS & RESEARCH
─────────────────────────────────────────────────────
${cvExtras.publications.filter(p => p.title?.trim()).map(p => `${p.title} | ${p.journal || 'Journal/Conference'} | ${p.year || '[Year]'}`).join('\n')}
` : ''}${presBlock ? `
─────────────────────────────────────────────────────
PRESENTATIONS
─────────────────────────────────────────────────────
${cvExtras.presentations.filter(p => p.title?.trim()).map(p => `${p.title} | ${p.event || 'Event'} | ${p.year || '[Year]'}`).join('\n')}
` : ''}${volBlock ? `
─────────────────────────────────────────────────────
VOLUNTEER & COMMUNITY SERVICE
─────────────────────────────────────────────────────
${cvExtras.volunteerService.trim()}
` : ''}${memBlock ? `
─────────────────────────────────────────────────────
PROFESSIONAL MEMBERSHIPS
─────────────────────────────────────────────────────
${cvExtras.memberships.trim()}
` : ''}${teachBlock ? `
─────────────────────────────────────────────────────
TEACHING & TRAINING EXPERIENCE
─────────────────────────────────────────────────────
${cvExtras.teachingExp.trim()}
` : ''}
Return only the CV text — no preamble, no commentary, no markdown.`
  }

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: activeMaxTokens,
        messages: [{ role: 'user', content: activePrompt }],
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
