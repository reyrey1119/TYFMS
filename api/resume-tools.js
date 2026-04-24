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

async function milReference(apiKey, supabase, { branch, mos_afsc, rank }) {
  if (!mos_afsc?.trim() || !branch?.trim()) return { error: 'Branch and MOS/AFSC are required.' }

  const component = rank?.startsWith('O-') ? 'officer'
    : rank?.startsWith('W-') ? 'warrant_officer'
    : 'enlisted'

  const cacheKey = `${branch}_${component}_${mos_afsc.trim().toUpperCase()}_${rank || 'any'}`.replace(/[\s/]+/g, '_')

  // Check Supabase cache (30-day TTL)
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
    } catch {} // graceful degradation if table doesn't exist yet
  }

  const componentLabel = component === 'officer' ? 'Commissioned Officer'
    : component === 'warrant_officer' ? 'Warrant Officer'
    : 'Enlisted'

  const docSource = branch === 'Army'
    ? (component === 'enlisted' ? 'DA PAM 600-25' : 'DA PAM 600-3')
    : (component === 'enlisted' ? 'DAFECD (Oct 2025)' : 'DAFOCD (Oct 2025)')

  const prompt = `You are a military career analyst with expert knowledge of the following official U.S. military career management publications:
- DA PAM 600-3: Commissioned Officer Professional Development and Career Management
- DA PAM 600-25: U.S. Army Noncommissioned Officer Professional Development Guide
- DAFOCD: Air Force Developmental Category Officer Career Designation (Oct 2025)
- DAFECD: Air Force Developmental Category Enlisted Career Designation (Oct 2025)

Generate the official duty description for this service member, consistent with what these publications specify for this exact MOS/AFSC and rank:

Branch: ${branch}
Component: ${componentLabel}
MOS/AFSC: ${mos_afsc.trim()}
Rank: ${rank || 'Not specified'}
Source document: ${docSource}

Return ONLY a valid JSON object with these fields:
{
  "duty_title": "<official job title for this MOS/AFSC — use the real Army or Air Force designation>",
  "document_source": "${docSource}",
  "duties_and_responsibilities": "<5-7 specific duties performed at this rank level per the official publication. Name actual systems, equipment, doctrinal tasks, and organizational responsibilities authentic to this MOS/AFSC>",
  "key_skills": "<10-12 specific skills and technical competencies — name actual equipment, software, protocols, or methodologies used in this specialty, comma-separated>",
  "rank_specific_expectations": "<what a ${rank || 'service member'} in this MOS/AFSC is specifically expected to do — supervision scope, decision authority, leadership requirements per the official document>",
  "civilian_translation_hints": "<5-6 specific civilian job titles, industries, or certifications this MOS/AFSC maps to directly, with one sentence of explanation for each>"
}

Be specific and accurate. Every detail must be authentic to this exact MOS/AFSC — not generic military descriptions. Reference actual systems, doctrinal tasks, and terminology used in this specialty.`

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 1000, messages: [{ role: 'user', content: prompt }] }),
    })
    const data = await r.json()
    if (data.error) return { error: data.error.message }
    const text = (data.content || []).map(i => i.text || '').join('').trim()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return { error: 'Could not extract duty information.' }
    let result
    try { result = JSON.parse(jsonMatch[0]) } catch { return { error: 'Could not parse duty information.' } }

    // Cache in Supabase
    if (supabase) {
      try {
        await supabase.from('mil_reference_cache').upsert({
          cache_key: cacheKey,
          document_source: docSource,
          extracted_content: result,
          fetched_at: new Date().toISOString(),
        }, { onConflict: 'cache_key' })
      } catch {} // graceful degradation
    }

    return result
  } catch {
    return { error: 'Could not retrieve duty description. Please describe your primary duties below.' }
  }
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
    return res.status(400).json({ error: 'Unknown action.' })
  } catch {
    return res.status(500).json({ error: 'Request failed. Please try again.' })
  }
}
