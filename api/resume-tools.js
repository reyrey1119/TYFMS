// POST /api/resume-tools — shared utilities for the resume builder
// action: "fetch-job" | "score-resume" | "mil-reference" | "interview-prep" | "answer-feedback" | "cover-letter" | "linkedin-optimizer"

import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) return null
  try { return createClient(url, key) } catch { return null }
}

// ── fetch-job ─────────────────────────────────────────────────────────────────

const JOB_BOARD_DOMAINS = ['indeed.com', 'linkedin.com', 'glassdoor.com', 'ziprecruiter.com', 'monster.com', 'careerbuilder.com', 'simplyhired.com', 'usajobs.gov', 'dice.com']

function isJobBoard(url) {
  try { return JOB_BOARD_DOMAINS.some(d => new URL(url).hostname.includes(d)) } catch { return false }
}

async function fetchJob(apiKey, { url }) {
  if (!url?.trim()) return { error: 'URL is required.' }

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
      if (isJobBoard(url.trim())) {
        return { error: 'This job board blocks automatic fetching. Please copy and paste the job description text directly into the field below.' }
      }
      return { error: `Could not load the page (HTTP ${resp.status}). Try pasting the job description directly.` }
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
    if (isJobBoard(url.trim())) {
      return { error: 'This job board blocks automatic fetching. Please copy and paste the job description text directly into the field below.' }
    }
    return { error: 'Could not fetch that URL. Some job sites block automated access. Try pasting the job description directly.' }
  }

  if (!pageText.trim()) return { error: 'No readable content found at that URL. Try pasting the job description directly.' }

  const prompt = `Extract job posting information from this text. Return ONLY a valid JSON object with these keys:
- title: the job title (string)
- company: the company name (string)
- skills: comma-separated list of required skills, qualifications, and tools (string)
- responsibilities: 2-3 sentences summarizing the key responsibilities (string)

If a field cannot be determined, use an empty string. No markdown, no commentary — only the raw JSON object.

Text:
${pageText}`

  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 500, messages: [{ role: 'user', content: prompt }] }),
  })
  const data = await r.json()
  if (data.error) return { error: data.error.message }
  const text = (data.content || []).map(i => i.text || '').join('').trim()
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return { error: 'Could not extract job information from that page.' }
  try { return JSON.parse(jsonMatch[0]) } catch { return { error: 'Could not parse job information. Try pasting the description directly.' } }
}

// ── score-resume ──────────────────────────────────────────────────────────────

async function scoreResume(apiKey, { resume, jobDescription }) {
  if (!resume?.trim() || !jobDescription?.trim()) return { error: 'Resume and job description are required.' }

  const prompt = `You are an expert ATS resume analyst and veteran hiring consultant. Score this resume against the job description on three dimensions.

RESUME:
${resume.slice(0, 3500)}

JOB DESCRIPTION:
${jobDescription.slice(0, 2000)}

Return ONLY a valid JSON object with these exact fields:
{
  "overall": <integer 0-100, weighted: keyword_match 40% + experience_alignment 40% + ats_compatibility 20%>,
  "keyword_match": <integer 0-100, how well resume keywords match the job requirements>,
  "experience_alignment": <integer 0-100, how well the veteran's background matches what the role needs>,
  "ats_compatibility": <integer 0-100, clean formatting, standard headers, ATS-parseable>,
  "suggestions": [
    "<specific actionable improvement referencing actual job description content — not generic advice>",
    "<specific actionable improvement referencing actual job description content — not generic advice>",
    "<specific actionable improvement referencing actual job description content — not generic advice>"
  ]
}

Score benchmarks: 80-100 = strong match. 60-79 = moderate. 0-59 = significant gaps.
No markdown, no preamble — only the JSON object.`

  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 700, messages: [{ role: 'user', content: prompt }] }),
  })
  const data = await r.json()
  if (data.error) return { error: data.error.message }
  const text = (data.content || []).map(i => i.text || '').join('').trim()
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return { error: 'Could not generate score.' }
  try { return JSON.parse(jsonMatch[0]) } catch { return { error: 'Invalid score format returned.' } }
}

// ── mil-reference ─────────────────────────────────────────────────────────────

async function callClaude(apiKey, messages, maxTokens = 1200) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: maxTokens, messages }),
  })
  return r.json()
}

function parseJsonResult(text) {
  const m = text.trim().match(/\{[\s\S]*\}/)
  if (!m) return null
  try { return JSON.parse(m[0]) } catch { return null }
}


async function milReference(apiKey, supabase, { branch, mos_afsc, rank }) {
  if (!mos_afsc?.trim() || !branch?.trim()) return { error: 'Branch and MOS/AFSC are required.' }

  const mosCleaned = mos_afsc.trim().toUpperCase()

  const rankUpper = (rank || '').toUpperCase().trim()
  const isEnlisted = rankUpper.startsWith('E-') ||
    ['E1','E2','E3','E4','E5','E6','E7','E8','E9'].includes(rankUpper.replace('-',''))
  const isWarrant = rankUpper.startsWith('W-') ||
    ['W1','W2','W3','W4','W5'].includes(rankUpper.replace('-',''))
  const isOfficer = rankUpper.startsWith('O-') ||
    ['O1','O2','O3','O4','O5','O6','O7','O8','O9','O10'].includes(rankUpper.replace('-',''))
  console.log('[mil-reference] rank:', rank, '| rankUpper:', rankUpper, '| isEnlisted:', isEnlisted, '| isWarrant:', isWarrant, '| isOfficer:', isOfficer)

  const component = isOfficer ? 'officer'
    : isWarrant ? 'warrant_officer'
    : 'enlisted'

  // ── Supabase client diagnostics ───────────────────────────────────────────
  console.log('[mil-reference] supabase client:', supabase ? 'connected' : 'NULL — all DB paths will be skipped')
  console.log('[mil-reference] env keys present:', {
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    VITE_SUPABASE_URL: !!process.env.VITE_SUPABASE_URL,
    SUPABASE_SERVICE_KEY: !!process.env.SUPABASE_SERVICE_KEY,
    SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
    VITE_SUPABASE_ANON_KEY: !!process.env.VITE_SUPABASE_ANON_KEY,
  })

  if (supabase) {
    const test = await supabase.from('mos_reference_enlisted').select('mos_code').limit(3)
    console.log('[mil-reference] TABLE TEST mos_reference_enlisted:', JSON.stringify({ data: test.data, error: test.error }))
  }

  const cacheKey = `${branch}_${component}_${mosCleaned}_${rank || 'any'}`.replace(/[\s/]+/g, '_')

  if (supabase) {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      const { data: cached } = await supabase
        .from('mil_reference_cache')
        .select('extracted_content')
        .eq('cache_key', cacheKey)
        .gte('fetched_at', thirtyDaysAgo)
        .maybeSingle()
      if (cached?.extracted_content) return cached.extracted_content
    } catch {}
  }

  const componentLabel = component === 'officer' ? 'Commissioned Officer'
    : component === 'warrant_officer' ? 'Warrant Officer'
    : 'Enlisted'

  const docSource = branch === 'Army'
    ? (component === 'enlisted' ? 'DA PAM 600-25' : 'DA PAM 600-3')
    : branch === 'Air Force'
    ? (component === 'enlisted' ? 'DAFECD (Oct 2025)' : 'DAFOCD (Oct 2025)')
    : branch === 'Marine Corps'
    ? 'MCBUL 1200 MOS Manual'
    : branch === 'Navy'
    ? 'Navy Rating Manual / MILPERSMAN'
    : 'Military Career Management Publication'

  const jsonSchema = `{
  "duty_title": "<official job title — use the real ${branch} designation for ${mosCleaned}>",
  "document_source": "${docSource}",
  "duties_and_responsibilities": "<5-7 specific duties at this rank level. Name actual systems, equipment, doctrinal tasks, and organizational responsibilities>",
  "key_skills": "<10-12 specific skills and technical competencies, comma-separated>",
  "rank_specific_expectations": "<supervision scope, decision authority, and leadership requirements for a ${rank || 'service member'} in this specialty>",
  "civilian_translation_hints": "<5-6 civilian job titles, industries, or certifications this maps to, with one sentence each>"
}`

  async function cacheAndReturn(result, source) {
    const tagged = { ...result, _source: source }
    if (supabase) {
      try {
        await supabase.from('mil_reference_cache').upsert({
          cache_key: cacheKey, document_source: docSource,
          extracted_content: tagged, fetched_at: new Date().toISOString(),
        }, { onConflict: 'cache_key' })
      } catch {}
    }
    return tagged
  }

  // ── Path 1a: Query aoc_reference_officer table (Army officers/WOs) ──────────
  if (branch === 'Army' && component !== 'enlisted' && supabase) {
    try {
      let { data: row } = await supabase
        .from('aoc_reference_officer')
        .select('title, branch, characteristics, development')
        .eq('aoc_code', mosCleaned)
        .maybeSingle()
      if (!row) {
        const prefix = mosCleaned.slice(0, 2)
        const { data: rows } = await supabase
          .from('aoc_reference_officer')
          .select('title, branch, characteristics, development')
          .like('aoc_code', `${prefix}%`)
          .limit(1)
        row = rows?.[0] || null
      }
      if (row) {
        const result = {
          duty_title: row.title,
          document_source: 'DA PAM 600-3',
          duties_and_responsibilities: row.characteristics || '',
          key_skills: row.development || '',
          rank_specific_expectations: '',
          civilian_translation_hints: '',
        }
        return cacheAndReturn(result, 'database')
      }
    } catch {}
  }

  // ── Path 1b: Query mos_reference_enlisted table (Army enlisted) ──────────
  if (branch === 'Army' && component === 'enlisted' && supabase) {
    const { data: row, error: enlErr } = await supabase
      .from('mos_reference_enlisted')
      .select('title, duties, goals')
      .eq('mos_code', mosCleaned)
      .maybeSingle()
    console.log('[mil-reference] enlisted lookup mos_code=' + mosCleaned + ':', JSON.stringify({ found: !!row, error: enlErr }))
    if (enlErr) console.error('[mil-reference] enlisted Supabase error:', JSON.stringify(enlErr))
    if (row) {
      const result = {
        duty_title: row.title,
        document_source: 'DA PAM 600-25',
        duties_and_responsibilities: row.duties || '',
        key_skills: row.goals || '',
        rank_specific_expectations: '',
        civilian_translation_hints: '',
      }
      return cacheAndReturn(result, 'database')
    }
  }

  // ── Path 2: Knowledge-based fallback (all branches, all components) ────────
  const branchPubRef = branch === 'Army'
    ? (isEnlisted ? 'DA PAM 600-25' : 'DA PAM 600-3')
    : branch === 'Air Force'
    ? (isEnlisted ? 'DAFECD' : 'DAFOCD')
    : branch === 'Marine Corps'
    ? 'MCBUL 1200 Marine Corps MOS Manual'
    : branch === 'Navy'
    ? 'Navy Rating manuals and MILPERSMAN'
    : 'applicable career management publications'

  const knowledgePrompt = `You are a military career analyst with expert knowledge of U.S. military career management publications including DA PAM 600-3, DA PAM 600-25, DAFOCD, DAFECD, MCBUL 1200, and Navy rating manuals.

CRITICAL: You are describing ONLY the specific MOS/AFSC/Rating code "${mosCleaned}" in the ${branch}. Do NOT substitute a different MOS code. Do NOT describe any adjacent, similar, or default MOS. The duty_title field MUST be the official title for "${mosCleaned}" specifically.

DOCUMENT SELECTION: The rank is ${rank || 'not specified'} — this is a ${componentLabel}. You MUST use ${branchPubRef} exclusively. Do NOT reference any other career management publication.

Describe the official duties, key skills, and rank-level expectations for ${mosCleaned} at rank ${rank || 'not specified'} in the ${branch} based on ${branchPubRef}.

Branch: ${branch}
Component: ${componentLabel}
MOS/AFSC/Rating: ${mosCleaned}
Rank: ${rank || 'Not specified'}
Source document: ${docSource}

Return ONLY a valid JSON object — no markdown, no preamble. The duty_title MUST reference "${mosCleaned}" explicitly:
${jsonSchema}

Be specific and accurate. Reference actual systems, doctrinal tasks, equipment, and terminology authentic to ${mosCleaned} in the ${branch}. Do not invent duties that are not associated with this specific code.`

  try {
    const data = await callClaude(apiKey, [{ role: 'user', content: knowledgePrompt }])
    if (data.error) return { error: data.error.message }
    const result = parseJsonResult((data.content || []).map(i => i.text || '').join(''))
    if (!result) return { error: 'Could not extract duty information.' }
    return cacheAndReturn(result, 'knowledge')
  } catch {
    return { error: 'Could not retrieve duty description. Please describe your primary duties below.' }
  }
}

// ── interview-prep ────────────────────────────────────────────────────────────

async function interviewPrep(apiKey, { resume, jobDescription, jobTitle, company }) {
  const hasJob = !!(jobDescription?.trim() || jobTitle?.trim())
  const context = jobDescription?.trim()
    ? jobDescription.slice(0, 2000)
    : `Role: ${jobTitle || 'unspecified'}\nCompany: ${company || 'unspecified'}`

  const prompt = `You are an expert career coach specializing in military-to-civilian transitions. Generate exactly 5 likely interview questions for this veteran, with coaching notes showing how to answer each using their military background.

RESUME:
${resume?.slice(0, 2500) || '[No resume provided — use general veteran background]'}

${hasJob ? `ROLE / JOB DESCRIPTION:\n${context}` : 'No specific job provided — generate general behavioral and competency questions for civilian roles suited to this military background.'}

Return ONLY a valid JSON array of exactly 5 objects — no markdown, no preamble:
[{"question":"<likely interview question specific to this role>","coaching":"<2-3 sentence coaching note: how this veteran answers using their specific military experience. Be concrete, reference real items from the resume. Active voice, no jargon, no em dashes."}]`

  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 1600, messages: [{ role: 'user', content: prompt }] }),
  })
  const data = await r.json()
  if (data.error) return { error: data.error.message }
  const text = (data.content || []).map(i => i.text || '').join('').trim()
  const match = text.match(/\[[\s\S]*\]/)
  if (!match) return { error: 'Could not generate interview questions.' }
  try { return { questions: JSON.parse(match[0]) } }
  catch { return { error: 'Could not parse interview questions.' } }
}

// ── answer-feedback ───────────────────────────────────────────────────────────

async function answerFeedback(apiKey, { question, answer, resume }) {
  if (!question?.trim() || !answer?.trim()) return { error: 'Question and answer are required.' }

  const prompt = `You are a career coach reviewing a veteran's practice interview answer. Give specific, actionable feedback.

INTERVIEW QUESTION: ${question}

VETERAN'S ANSWER: ${answer.slice(0, 1200)}

${resume ? `RESUME CONTEXT (first 800 chars):\n${resume.slice(0, 800)}` : ''}

Return ONLY a valid JSON object — no markdown, no preamble:
{
  "rating": "<Strong / Solid / Needs Work>",
  "clarity": "<1-2 sentences on the clarity and structure of the answer>",
  "relevance": "<1-2 sentences on how well it addresses what the interviewer wants to hear>",
  "translation": "<1-2 sentences on how well it converts military experience into civilian language>",
  "improve": "<One concrete, specific change to make this answer stronger>"
}`

  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 600, messages: [{ role: 'user', content: prompt }] }),
  })
  const data = await r.json()
  if (data.error) return { error: data.error.message }
  const text = (data.content || []).map(i => i.text || '').join('').trim()
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) return { error: 'Could not generate feedback.' }
  try { return JSON.parse(match[0]) }
  catch { return { error: 'Could not parse feedback.' } }
}

// ── cover-letter ──────────────────────────────────────────────────────────────

async function generateCoverLetter(apiKey, { resume, jobDescription, company, jobTitle, veteranName }) {
  const targetLine = company ? `${company}` : (jobTitle || 'this opportunity')
  const prompt = `You are an expert career coach writing a tailored cover letter for a veteran transitioning to a civilian role.

VETERAN'S RESUME:
${resume?.slice(0, 2500) || '[Resume not provided]'}

${jobDescription?.trim() ? `JOB DESCRIPTION:\n${jobDescription.slice(0, 2000)}` : (jobTitle ? `TARGET ROLE: ${jobTitle}${company ? ` at ${company}` : ''}` : 'General civilian employment')}

Write a professional 3-paragraph cover letter with this exact structure:
- Opening line: "Dear ${company ? company + ' Team' : 'Hiring Team'},"
- Paragraph 1 (4-5 sentences): Strong hook connecting the veteran's specific military background to ${targetLine}. Lead with the most compelling aspect of their service. No generic opener.
- Paragraph 2 (4-5 sentences): Highlight 2-3 specific accomplishments from their service record that directly address the role requirements. Each accomplishment must be concrete, using real metrics from the resume or credible specific placeholders.
- Paragraph 3 (2-3 sentences): Confident call to action. Express specific interest in contributing to ${targetLine}. No cliche closers.
- Closing: "Respectfully," then the name: ${veteranName || '[YOUR NAME]'}

ANTI-AI RULES: No em dashes. No: leverage, utilize, synergize, robust, holistic, going forward, moving forward, excited to, passionate about. Active voice. Short and confident sentences. Sound like a real person, not a template.

Return ONLY the cover letter text — no preamble, no commentary, no markdown.`

  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 1200, messages: [{ role: 'user', content: prompt }] }),
  })
  const data = await r.json()
  if (data.error) return { error: data.error.message }
  const text = (data.content || []).map(i => i.text || '').join('')
  return { coverLetter: text }
}

// ── linkedin-optimizer ────────────────────────────────────────────────────────

async function linkedInOptimizer(apiKey, { resume, milPositions, branch, mos, rank }) {
  const positionsText = Array.isArray(milPositions) && milPositions.filter(p => p.mos?.trim()).length > 0
    ? milPositions.filter(p => p.mos?.trim()).map((p, i) =>
        `Position ${i + 1}: ${p.mos}${p.unit ? ` | ${p.unit}` : ''}${p.location ? ` | ${p.location}` : ''} | ${p.startDate || '[Start]'} – ${p.present ? 'Present' : (p.endDate || '[End]')}`
      ).join('\n')
    : `Primary: ${mos || 'Military service'}${rank ? ` | ${rank}` : ''} | ${branch || 'U.S. Military'}`

  const prompt = `You are a LinkedIn profile optimizer specializing in military-to-civilian career transitions.

VETERAN'S RESUME:
${resume?.slice(0, 2500) || '[Resume not provided]'}

MILITARY POSITIONS:
${positionsText}

Generate two distinct sections:

SECTION A — LINKEDIN ABOUT:
Write 3-4 short paragraphs in FIRST PERSON. Tell the veteran's professional story from military to civilian. Lead with who they are and what they bring, not their rank. Connect specific military achievements to civilian value. End with what kind of opportunity they are seeking. Max 280 words. Sound confident, specific, human.

SECTION B — EXPERIENCE BULLETS:
For each military position listed above, write 3 civilian-language achievement bullets. Strong action verbs. Include specific metrics from the resume or credible specific placeholders. Translate military terminology to civilian equivalents.

ANTI-AI RULES: No em dashes. No: leverage, utilize, synergize, robust, holistic, excited to. Active voice. Vary sentence length.

Return ONLY a valid JSON object — no markdown:
{
  "about": "<LinkedIn About section text, 3-4 paragraphs>",
  "experienceBullets": [
    {"position": "<position title from above>", "bullets": ["<bullet 1>", "<bullet 2>", "<bullet 3>"]}
  ]
}`

  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 1500, messages: [{ role: 'user', content: prompt }] }),
  })
  const data = await r.json()
  if (data.error) return { error: data.error.message }
  const text = (data.content || []).map(i => i.text || '').join('')
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) return { error: 'Could not generate LinkedIn content.' }
  try { return JSON.parse(match[0]) }
  catch { return { error: 'Could not parse LinkedIn content.' } }
}

// ── vault-extract ─────────────────────────────────────────────────────────────

async function vaultExtract(apiKey, { storagePath, contentType, documentType, accessToken }) {
  if (!storagePath || !accessToken) return { error: 'Missing required parameters.' }

  // Verify the caller owns this path (path must start with their user_id)
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !anonKey) return { error: 'Supabase not configured.' }

  // Verify user identity via their JWT
  const { createClient } = await import('@supabase/supabase-js')
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  })
  const { data: { user }, error: authErr } = await userClient.auth.getUser()
  if (authErr || !user) return { error: 'Not authenticated.' }

  // Verify path belongs to this user
  if (!storagePath.startsWith(user.id + '/')) return { error: 'Access denied.' }

  // Download file using service role key (or anon key for storage if policies allow)
  const storageKey = serviceKey || anonKey
  const storageClient = createClient(supabaseUrl, storageKey)
  const { data: fileBlob, error: dlErr } = await storageClient.storage
    .from('document-vault')
    .download(storagePath)

  if (dlErr || !fileBlob) return { error: 'Could not download document. Check storage policies.' }

  const arrayBuffer = await fileBlob.arrayBuffer()
  const bytes = Buffer.from(arrayBuffer)

  if (bytes.length > 15 * 1024 * 1024) return { error: 'File too large for extraction (max 15 MB).' }

  const docLabel = documentType?.toUpperCase().replace(/_/g, ' ') || 'SERVICE DOCUMENT'
  let extractedText = ''

  // ── PDF → Claude document API ──────────────────────────────────────────────
  if (contentType === 'application/pdf' || storagePath.endsWith('.pdf')) {
    const base64 = bytes.toString('base64')
    const data = await callClaude(apiKey, [{
      role: 'user',
      content: [
        {
          type: 'document',
          source: { type: 'base64', media_type: 'application/pdf', data: base64 },
          title: `${docLabel} — ${storagePath.split('/').pop()}`,
        },
        {
          type: 'text',
          text: `Extract ALL text from this ${docLabel} military document. Return the complete text exactly as it appears, preserving structure, bullet points, ratings, names, dates, unit designations, and award citations. Do not summarize — return the full extracted text verbatim.`,
        },
      ],
    }], 4096)
    if (data.error) return { error: data.error.message || 'Claude extraction failed.' }
    extractedText = (data.content || []).map(i => i.text || '').join('')

  // ── Image → Claude vision ──────────────────────────────────────────────────
  } else if (contentType?.startsWith('image/') || /\.(jpg|jpeg|png)$/i.test(storagePath)) {
    const mediaType = contentType?.startsWith('image/png') ? 'image/png' : 'image/jpeg'
    const base64 = bytes.toString('base64')
    const data = await callClaude(apiKey, [{
      role: 'user',
      content: [
        {
          type: 'image',
          source: { type: 'base64', media_type: mediaType, data: base64 },
        },
        {
          type: 'text',
          text: `This is a scanned military document (${docLabel}). Extract ALL visible text from this image. Return the complete text exactly as it appears, preserving all details, ratings, names, dates, bullet points, award names, and unit designations. Do not summarize — return the full text verbatim.`,
        },
      ],
    }], 4096)
    if (data.error) return { error: data.error.message || 'Claude vision extraction failed.' }
    extractedText = (data.content || []).map(i => i.text || '').join('')

  // ── DOCX → mammoth text extraction ────────────────────────────────────────
  } else if (
    contentType?.includes('wordprocessingml') ||
    contentType?.includes('msword') ||
    /\.docx?$/i.test(storagePath)
  ) {
    try {
      const mammoth = await import('mammoth')
      const result = await mammoth.extractRawText({ buffer: bytes })
      extractedText = result.value || ''
    } catch {
      return { error: 'Could not parse DOCX file. Try uploading a PDF version instead.' }
    }
  } else {
    return { error: 'Unsupported file type. Upload a PDF, DOCX, JPG, or PNG.' }
  }

  if (!extractedText.trim()) return { error: 'No text could be extracted from this document.' }

  // ── Generate structured summary ────────────────────────────────────────────
  const summaryPrompt = `You are analyzing extracted text from a veteran's ${docLabel} military document. Identify and extract key information.

DOCUMENT TEXT:
${extractedText.slice(0, 6000)}

Return ONLY a valid JSON object — no markdown, no preamble:
{
  "docType": "${docLabel}",
  "veteranName": "<full name if found, else null>",
  "rank": "<military rank if found, else null>",
  "unit": "<unit/organization if found, else null>",
  "ratingOverall": "<for OER/NCOER: the overall rating such as 'Among the Best', 'Most Qualified', 'Highly Qualified', 'Fully Capable' — null if this is not an evaluation report>",
  "awards": [<array of award names found, e.g. ["ARCOM", "AAM", "MSM"] — empty array if none>],
  "keyBullets": [<array of up to 5 strongest achievement statements extracted verbatim or near-verbatim from the document. These are the most specific, impressive accomplishments with concrete actions and outcomes. Include metrics when present.>],
  "period": "<date range covered, e.g. '2020-2022' — null if not determinable>"
}`

  const summaryData = await callClaude(apiKey, [{ role: 'user', content: summaryPrompt }], 1200)
  const summaryText = (summaryData.content || []).map(i => i.text || '').join('')
  let summary = null
  try {
    const match = summaryText.match(/\{[\s\S]*\}/)
    if (match) summary = JSON.parse(match[0])
  } catch {}

  return { extractedText: extractedText.slice(0, 20000), summary }
}

// ── Handler ───────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured.' })

  const { action, ...params } = req.body || {}

  try {
    if (action === 'fetch-job') {
      const result = await fetchJob(apiKey, params)
      return result.error ? res.status(400).json(result) : res.status(200).json(result)
    }
    if (action === 'score-resume') {
      const result = await scoreResume(apiKey, params)
      return result.error ? res.status(400).json(result) : res.status(200).json(result)
    }
    if (action === 'mil-reference') {
      const supabase = getSupabase()
      if (supabase) {
        try { await supabase.from('mil_reference_cache').delete().neq('cache_key', '') } catch {}
      }
      const result = await milReference(apiKey, supabase, params)
      return result.error ? res.status(400).json(result) : res.status(200).json(result)
    }
    if (action === 'interview-prep') {
      const result = await interviewPrep(apiKey, params)
      return result.error ? res.status(400).json(result) : res.status(200).json(result)
    }
    if (action === 'answer-feedback') {
      const result = await answerFeedback(apiKey, params)
      return result.error ? res.status(400).json(result) : res.status(200).json(result)
    }
    if (action === 'cover-letter') {
      const result = await generateCoverLetter(apiKey, params)
      return result.error ? res.status(400).json(result) : res.status(200).json(result)
    }
    if (action === 'linkedin-optimizer') {
      const result = await linkedInOptimizer(apiKey, params)
      return result.error ? res.status(400).json(result) : res.status(200).json(result)
    }
    if (action === 'vault-extract') {
      const result = await vaultExtract(apiKey, params)
      return result.error ? res.status(400).json(result) : res.status(200).json(result)
    }
    return res.status(400).json({ error: 'Unknown action.' })
  } catch {
    return res.status(500).json({ error: 'Request failed. Please try again.' })
  }
}
