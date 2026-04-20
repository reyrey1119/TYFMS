#!/usr/bin/env node
/**
 * Pre-populates Supabase career_trends_cache for the current week.
 * Runs at build time so the first visitor never waits for AI generation.
 * Always exits 0 — a failure here must not break the build.
 */

import { readFile } from 'fs/promises'

// Load .env.local if present (local dev)
try {
  const env = await readFile('.env.local', 'utf-8')
  for (const line of env.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = val
  }
} catch {}

// SUPABASE_URL on Vercel may be a variable reference string — validate and fall back
const _rawUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_URL = (_rawUrl && _rawUrl.startsWith('http')) ? _rawUrl : process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !ANTHROPIC_API_KEY) {
  console.log('seed-trends: missing env vars — skipping pre-population')
  process.exit(0)
}

function getWeekStart() {
  const now = new Date()
  const day = now.getUTCDay()
  const diff = day === 0 ? -6 : 1 - day
  const mon = new Date(now)
  mon.setUTCDate(now.getUTCDate() + diff)
  mon.setUTCHours(0, 0, 0, 0)
  return mon.toISOString().slice(0, 10)
}

try {
  const weekStart = getWeekStart()
  console.log(`seed-trends: checking cache for week ${weekStart}`)

  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, { auth: { persistSession: false } })

  const { data: existing } = await supabase
    .from('career_trends_cache')
    .select('week_start')
    .eq('week_start', weekStart)
    .single()

  if (existing) {
    console.log(`seed-trends: cache exists for ${weekStart} — skipping`)
    process.exit(0)
  }

  console.log(`seed-trends: generating trends for ${weekStart}...`)

  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

  const prompt = `Today is ${today}. You are a veteran career advisor. Search the web for current civilian job market trends and veteran employment news from the past 2 weeks.

Search for: veteran employment news ${new Date().getFullYear()}, military to civilian careers hiring, defense contractor jobs veterans, federal hiring veterans, hot careers veterans transition.

Return exactly 4 trend cards as valid JSON reflecting real current market conditions. Include source name and publication date when available.

Use badgeCls "bg" for tech/growth roles, "ba" for trades/defense/manufacturing, "bb" for government/federal jobs, "bd" for healthcare/social services. Mix badge types.

score is 0-100 (how hot this trend is for veterans right now). Vary scores meaningfully. fullAnalysis is 3 sentences: context, veteran advantages, one concrete action step this week.

Response format — JSON array only, no extra text:
[
  {
    "title": "Short punchy headline (5-8 words)",
    "category": "Sector name",
    "description": "2-3 sentences explaining the trend and why it matters for veterans specifically.",
    "badgeCls": "bg",
    "score": 85,
    "fullAnalysis": "3 sentences: deeper context, veteran advantages, concrete action step.",
    "source": "Source name or null",
    "sourceDate": "Month Year or null"
  }
]`

  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'web-search-2025-03-05',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await r.json()
  if (data.error) throw new Error(data.error.message)

  const txt = (data.content || [])
    .filter(i => i.type === 'text')
    .map(i => i.text || '')
    .join('')
    .replace(/```json|```/g, '')
    .trim()

  const arrMatch = txt.match(/\[[\s\S]*\]/)
  if (!arrMatch) throw new Error('could not parse AI response')

  const trends = JSON.parse(arrMatch[0])
  if (!Array.isArray(trends) || trends.length === 0) throw new Error('empty trends array')

  const { error: insertErr } = await supabase.from('career_trends_cache').insert({
    week_start: weekStart, content: trends, generated_at: new Date().toISOString()
  })
  if (insertErr) throw new Error(insertErr.message)

  console.log(`seed-trends: cached ${trends.length} trends for ${weekStart}`)
} catch (err) {
  console.error(`seed-trends: warning — ${err.message}`)
}

process.exit(0)
