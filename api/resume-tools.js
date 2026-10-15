// POST /api/resume-tools — shared utilities for the resume builder
// action: "fetch-job" | "score-resume" | "mil-reference" | "interview-prep" | "answer-feedback" | "cover-letter" | "linkedin-optimizer"

import { createClient } from '@supabase/supabase-js'
import { rejectIfRateLimited } from './_lib/rateLimit.js'
import { retrieveReference } from './_lib/milReference.js'

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
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


// Retrieval (rank-aware, versioned, honestly labeled) lives in
// api/_lib/milReference.js. This file only supplies the optional AI draft used
// when nothing is stored for a code.
async function aiSuggestDraft(apiKey, { branch, occupation, category }) {
  const prompt = `You are drafting a SHORT, general description of a military specialty so a person can edit it into their own words.

Branch: ${branch}
Personnel category: ${category}
Specialty code: ${occupation}

Rules:
- Describe only what you are confident this exact code is. If you are not confident the code exists in this branch, return {"unknown": true} and nothing else.
- Do NOT name, cite, or imply any specific publication, regulation, or "official" source.
- Do NOT state rank-level scope, number of people led, budgets, or command responsibilities.
- Describe typical tasks for the specialty in general, in plain language.

Return ONLY valid JSON, no markdown:
{"duty_title": "<title for ${occupation}>", "duties_and_responsibilities": "<4-6 typical tasks, one sentence each>", "key_skills": "<8-10 skills, comma-separated>"}`
  const data = await callClaude(apiKey, [{ role: 'user', content: prompt }], 700)
  if (data.error) return null
  const result = parseJsonResult((data.content || []).map(i => i.text || '').join(''))
  if (!result || result.unknown || !result.duty_title) return null
  return result
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
  const isJst = documentType === 'jst'

  const summaryPrompt = isJst
    ? `You are analyzing a Joint Service Transcript (JST) — an official U.S. military education and training record.

DOCUMENT TEXT:
${extractedText.slice(0, 8000)}

Extract ALL of the following. Return ONLY a valid JSON object — no markdown, no preamble:
{
  "veteranName": "<full name if found, else null>",
  "rank": "<military rank or pay grade if found, else null>",
  "coursesFound": <integer count of all military courses listed>,
  "occupationsFound": <integer count of all military occupations/MOS entries listed>,
  "totalAceHours": <total ACE-recommended semester hours as a number, or null if not determinable>,
  "mosCodes": [<array of MOS/AFSC/rate codes found in the occupations section, e.g. ["11B", "42A"]>],
  "courses": [<array of up to 20 course objects: {"courseId": "...", "title": "...", "location": "...", "dates": "...", "aceRecommendation": "..."}>],
  "occupations": [<array of all occupation objects: {"mosCode": "...", "title": "...", "datesHeld": "..."}>]
}`
    : `You are analyzing extracted text from a veteran's ${docLabel} military document. Identify and extract key information.

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

  const summaryData = await callClaude(apiKey, [{ role: 'user', content: summaryPrompt }], isJst ? 2000 : 1200)
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
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
    if (await rejectIfRateLimited(res, 'resume-tools', req, { windowSeconds: 600, max: 40 })) return

    const apiKey = process.env.ANTHROPIC_API_KEY
    const { action, ...params } = req.body || {}
    console.log('[resume-tools] action:', action, '| apiKey present:', !!apiKey, '| env keys:', {
      ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY,
      SUPABASE_URL: !!process.env.SUPABASE_URL,
      VITE_SUPABASE_URL: !!process.env.VITE_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    })

    // Stored references need no AI key; the key only enables the labeled AI draft.
    if (action === 'mil-reference') {
      const result = await retrieveReference({
        supabase: getSupabase(),
        body: params,
        aiSuggest: apiKey ? req => aiSuggestDraft(apiKey, req) : null,
      })
      return res.status(200).json(result)
    }

    if (!apiKey) return res.status(500).json({ error: 'API key not configured.' })

    if (action === 'fetch-job') {
      const result = await fetchJob(apiKey, params)
      return result.error ? res.status(400).json(result) : res.status(200).json(result)
    }
    if (action === 'score-resume') {
      const result = await scoreResume(apiKey, params)
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
  } catch (err) {
    console.error('[resume-tools] unhandled error:', err.message, err.stack)
    return res.status(500).json({ error: 'Request failed. Please try again.' })
  }
}
