#!/usr/bin/env node
/**
 * Pre-populates Supabase vet_news_cache so the first visitor never sees skeleton loading.
 * Skips if a fresh entry exists (within 7 days). Always exits 0 — must not break the build.
 *
 * Requires: SUPABASE_URL (or VITE_SUPABASE_URL), SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY
 */

import { readFile } from 'fs/promises'

// Load .env.local for local dev
try {
  const env = await readFile('.env.local', 'utf-8')
  for (const line of env.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const val = trimmed.slice(eq + 1).trim().replace(/^"|"$/g, '')
    if (!process.env[key]) process.env[key] = val
  }
} catch {}

// SUPABASE_URL on Vercel may be a reference string — validate and fall back
const _rawUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_URL = (_rawUrl && _rawUrl.startsWith('http')) ? _rawUrl : process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !ANTHROPIC_API_KEY) {
  console.log('seed-vet-news: missing env vars — skipping pre-population')
  process.exit(0)
}

try {
  console.log('seed-vet-news: checking cache freshness...')

  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, { auth: { persistSession: false } })

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 7)

  const { data: existing } = await supabase
    .from('vet_news_cache')
    .select('cached_at')
    .gte('cached_at', cutoff.toISOString())
    .order('cached_at', { ascending: false })
    .limit(1)
    .single()

  if (existing) {
    console.log(`seed-vet-news: fresh cache exists (${existing.cached_at}) — skipping`)
    process.exit(0)
  }

  console.log('seed-vet-news: generating veteran news via Claude + web search...')

  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

  const prompt = `Today is ${today}. Search the web for current U.S. veteran news articles published in the past 7 days. Focus on: VA benefits updates, veteran employment programs, GI Bill policy changes, veteran healthcare, veteran housing, military transition support.

Find 5 recent articles and return them as a JSON array. Use real URLs from your search results.

Return valid JSON only — a JSON array, nothing else:
[
  {
    "title": "Article headline",
    "category": "Benefits",
    "summary": "2-3 sentences explaining what happened and why it matters for transitioning veterans.",
    "source": "Publication name",
    "sourceDate": "Month Day, Year",
    "url": "https://..."
  }
]

Use one of these categories exactly: Benefits, Employment, Policy, Education, Health`

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

  const articles = JSON.parse(arrMatch[0])
  if (!Array.isArray(articles) || articles.length === 0) throw new Error('empty articles array')

  const now = new Date().toISOString()

  // Delete stale entries then insert fresh
  await supabase.from('vet_news_cache').delete().lt('cached_at', cutoff.toISOString())
  const { error: insertErr } = await supabase.from('vet_news_cache').insert({ content: articles, cached_at: now })
  if (insertErr) throw new Error(insertErr.message)

  console.log(`seed-vet-news: cached ${articles.length} articles`)
  articles.forEach((a, i) => console.log(`  ${i + 1}. [${a.category}] ${a.title}`))
} catch (err) {
  console.error(`seed-vet-news: warning — ${err.message}`)
}

process.exit(0)
