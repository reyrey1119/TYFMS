// POST /api/resume-tools — shared utilities for the resume builder
// action: "fetch-job" | "score-resume" | "mil-reference"

import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) return null
  try { return createClient(url, key) } catch { return null }
}

// ── fetch-job ─────────────────────────────────────────────────────────────────

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
    if (!resp.ok) return { error: `Could not load the page (HTTP ${resp.status}). Try pasting the job description directly.` }
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

// DA PAM 600-3 per-branch PDF routing table (Army officers & warrant officers)
// Exact MOS/AOC codes take priority; 2-digit numeric prefixes are fallbacks.
const ARMY_OFFICER_PDF_MAP = {
  // Exact codes — user-specified + common
  '11A': { branch: 'Infantry',                url: 'https://api.army.mil/e2/c/downloads/2022/09/01/21ecacfb/infantry-branch-da-pam-600-1-sep-22.pdf' },
  '12A': { branch: 'Corps of Engineers',      url: 'https://api.army.mil/e2/c/downloads/2024/04/25/6b2f9dbc/en-da-pam-600-3-25-april-24.pdf' },
  '13A': { branch: 'Field Artillery',         url: 'https://api.army.mil/e2/c/downloads/2024/04/03/1cf69906/field-artillery-da-pam-600-3.pdf' },
  '14A': { branch: 'Air Defense Artillery',   url: 'https://api.army.mil/e2/c/downloads/2022/08/03/ff2ecd1d/da-pam-600-3-ada-20210615.pdf' },
  '15A': { branch: 'Aviation',                url: 'https://api.army.mil/e2/c/downloads/2022/08/03/8d0a3936/1-av-branch-da-pam-600-3-as-of-20210630.pdf' },
  '19A': { branch: 'Armor',                   url: 'https://api.army.mil/e2/c/downloads/2022/08/03/2125724d/armor-da-pam-600-3-a.pdf' },
  '25A': { branch: 'Signal Corps',            url: 'https://api.army.mil/e2/c/downloads/2022/08/08/39bc9db1/signal-corps-8-aug-22.pdf' },
  '35D': { branch: 'Military Intelligence',   url: 'https://api.army.mil/e2/c/downloads/2025/03/20/f4ef3d31/mi-da-pam-600-3-20mar25.pdf' },
  '36A': { branch: 'Finance and Comptroller', url: 'https://api.army.mil/e2/c/downloads/2025/09/10/640a0b16/fc-10sep25.pdf' },
  '38A': { branch: 'Civil Affairs',           url: 'https://api.army.mil/e2/c/downloads/2024/02/01/7aa07281/da-pam-600-3-branch-38-civil-affairs-29sep23.pdf' },
  '42A': { branch: 'Adjutant General Corps',  url: 'https://api.army.mil/e2/c/downloads/2026/01/26/6d0dfce5/ag-da-pam-600-3-26-jan-26.pdf' },
  '42B': { branch: 'Finance and Comptroller', url: 'https://api.army.mil/e2/c/downloads/2025/09/10/640a0b16/fc-10sep25.pdf' },
  '42C': { branch: 'Finance and Comptroller', url: 'https://api.army.mil/e2/c/downloads/2025/09/10/640a0b16/fc-10sep25.pdf' },
  '65D': { branch: 'Army Medical Department', url: 'https://api.army.mil/e2/c/downloads/2022/08/08/6ef1bd02/1-amedd-da-pam-600-3.pdf' },
  // 2-digit prefix fallbacks
  '11': { branch: 'Infantry',                url: 'https://api.army.mil/e2/c/downloads/2022/09/01/21ecacfb/infantry-branch-da-pam-600-1-sep-22.pdf' },
  '12': { branch: 'Corps of Engineers',      url: 'https://api.army.mil/e2/c/downloads/2024/04/25/6b2f9dbc/en-da-pam-600-3-25-april-24.pdf' },
  '13': { branch: 'Field Artillery',         url: 'https://api.army.mil/e2/c/downloads/2024/04/03/1cf69906/field-artillery-da-pam-600-3.pdf' },
  '14': { branch: 'Air Defense Artillery',   url: 'https://api.army.mil/e2/c/downloads/2022/08/03/ff2ecd1d/da-pam-600-3-ada-20210615.pdf' },
  '15': { branch: 'Aviation',                url: 'https://api.army.mil/e2/c/downloads/2022/08/03/8d0a3936/1-av-branch-da-pam-600-3-as-of-20210630.pdf' },
  '19': { branch: 'Armor',                   url: 'https://api.army.mil/e2/c/downloads/2022/08/03/2125724d/armor-da-pam-600-3-a.pdf' },
  '25': { branch: 'Signal Corps',            url: 'https://api.army.mil/e2/c/downloads/2022/08/08/39bc9db1/signal-corps-8-aug-22.pdf' },
  '27': { branch: "Judge Advocate General's Corps", url: 'https://api.army.mil/e2/c/downloads/2022/08/08/4cbca29d/2-jag-corps-da-pam-600-3.pdf' },
  '35': { branch: 'Military Intelligence',   url: 'https://api.army.mil/e2/c/downloads/2025/03/20/f4ef3d31/mi-da-pam-600-3-20mar25.pdf' },
  '36': { branch: 'Finance and Comptroller', url: 'https://api.army.mil/e2/c/downloads/2025/09/10/640a0b16/fc-10sep25.pdf' },
  '38': { branch: 'Civil Affairs',           url: 'https://api.army.mil/e2/c/downloads/2024/02/01/7aa07281/da-pam-600-3-branch-38-civil-affairs-29sep23.pdf' },
  '42': { branch: 'Adjutant General Corps',  url: 'https://api.army.mil/e2/c/downloads/2026/01/26/6d0dfce5/ag-da-pam-600-3-26-jan-26.pdf' },
  '65': { branch: 'Army Medical Department', url: 'https://api.army.mil/e2/c/downloads/2022/08/08/6ef1bd02/1-amedd-da-pam-600-3.pdf' },
}

function getArmyOfficerPdfEntry(mos) {
  const n = mos.trim().toUpperCase().replace(/\s+/g, '')
  if (ARMY_OFFICER_PDF_MAP[n]) return ARMY_OFFICER_PDF_MAP[n]
  // Try first 3 chars (e.g. '42B'), then numeric prefix (e.g. '42'), then first 2 chars
  const t3 = n.slice(0, 3)
  if (ARMY_OFFICER_PDF_MAP[t3]) return ARMY_OFFICER_PDF_MAP[t3]
  const num2 = n.replace(/[A-Z]/g, '').slice(0, 2)
  if (num2 && ARMY_OFFICER_PDF_MAP[num2]) return ARMY_OFFICER_PDF_MAP[num2]
  const t2 = n.slice(0, 2)
  return ARMY_OFFICER_PDF_MAP[t2] || null
}

async function fetchPdfBase64(url) {
  try {
    const resp = await fetch(url, {
      headers: { 'Accept': 'application/pdf, */*', 'User-Agent': 'Mozilla/5.0 (compatible)' },
      signal: AbortSignal.timeout(12000),
      redirect: 'follow',
    })
    if (!resp.ok) return null
    const buf = await resp.arrayBuffer()
    if (buf.byteLength > 8 * 1024 * 1024) return null // skip PDFs > 8 MB
    return Buffer.from(buf).toString('base64')
  } catch {
    return null
  }
}

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

// Returns true only if the extracted result clearly corresponds to the requested MOS.
// Wrong data injected into a resume is worse than falling back to AI knowledge.
function milRefMatchesMos(result, mos) {
  if (!result || result.not_found) return false
  if (!result.duty_title || result.duty_title.length < 5) return false
  if (!result.duties_and_responsibilities || result.duties_and_responsibilities.length < 50) return false
  // The MOS code itself must appear somewhere in the extracted content.
  const haystack = JSON.stringify(result).toUpperCase()
  const needle = mos.replace(/[^A-Z0-9]/g, '')
  return haystack.includes(needle)
}

async function milReference(apiKey, supabase, { branch, mos_afsc, rank }) {
  if (!mos_afsc?.trim() || !branch?.trim()) return { error: 'Branch and MOS/AFSC are required.' }

  // Normalize to uppercase immediately — "42b" and "42B" must resolve identically.
  const mosCleaned = mos_afsc.trim().toUpperCase()

  const component = rank?.startsWith('O-') ? 'officer'
    : rank?.startsWith('W-') ? 'warrant_officer'
    : 'enlisted'

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
    : (component === 'enlisted' ? 'DAFECD (Oct 2025)' : 'DAFOCD (Oct 2025)')

  const jsonSchema = `{
  "duty_title": "<official job title — use the real Army or Air Force designation>",
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

  // ── Path 1: Fetch actual DA PAM 600-3 branch PDF (Army officers/WOs only) ──
  if (branch === 'Army' && component !== 'enlisted') {
    const pdfEntry = getArmyOfficerPdfEntry(mosCleaned)
    if (pdfEntry) {
      const pdfBase64 = await fetchPdfBase64(pdfEntry.url)
      if (pdfBase64) {
        try {
          const data = await callClaude(apiKey, [{
            role: 'user',
            content: [
              {
                type: 'document',
                source: { type: 'base64', media_type: 'application/pdf', data: pdfBase64 },
                title: `DA PAM 600-3 ${pdfEntry.branch} Branch`,
              },
              {
                type: 'text',
                text: `This is the official DA PAM 600-3 ${pdfEntry.branch} Branch document. Extract the duty description for exactly one MOS/AOC: ${mosCleaned}.

STEP 1 — LOCATE THE SECTION: Search for a section header that contains the exact string "${mosCleaned}" (e.g. "AOC ${mosCleaned}", "MOS ${mosCleaned}", a chapter heading beginning with "${mosCleaned}", or a paragraph number followed by "${mosCleaned}"). This must be an exact match on the MOS code — do not match adjacent or similar codes.

STEP 2 — EXTRACT ONLY THAT SECTION: Copy the content from that section header to the beginning of the next MOS/AOC section header. Do not include content from any other MOS or AOC section.

STEP 3 — IF NOT FOUND: If this document does not contain a section specifically for "${mosCleaned}", return exactly:
{"not_found": true, "document_source": "${docSource}"}

STEP 4 — IF FOUND: Return ONLY this JSON object, populated entirely from the extracted section text. The string "${mosCleaned}" must appear somewhere in your response to confirm the correct section was found. No markdown, no preamble:
${jsonSchema}`,
              },
            ],
          }], 1400)
          if (!data.error) {
            const result = parseJsonResult((data.content || []).map(i => i.text || '').join(''))
            // Validate: wrong data is worse than no data — only accept if MOS code appears in result
            if (milRefMatchesMos(result, mosCleaned)) return cacheAndReturn(result, 'pdf')
          }
        } catch {}
        // PDF extraction failed or validation rejected — fall through to knowledge path
      }
    }
  }

  // ── Path 2: Knowledge-based fallback (all branches, all components) ────────
  const knowledgePrompt = `You are a military career analyst with expert knowledge of U.S. military career management publications including DA PAM 600-3, DA PAM 600-25, DAFOCD, and DAFECD.

Generate the official duty description for this service member based on your knowledge of these publications:

Branch: ${branch}
Component: ${componentLabel}
MOS/AFSC: ${mosCleaned}
Rank: ${rank || 'Not specified'}
Source document: ${docSource}

Return ONLY a valid JSON object — no markdown, no preamble:
${jsonSchema}

Be specific and accurate. Reference actual systems, doctrinal tasks, and terminology authentic to ${mosCleaned}.`

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
    return res.status(400).json({ error: 'Unknown action.' })
  } catch {
    return res.status(500).json({ error: 'Request failed. Please try again.' })
  }
}
