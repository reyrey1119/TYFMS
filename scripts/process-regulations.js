#!/usr/bin/env node
/**
 * Reads PDF regulation files and loads them into Supabase regulation_chunks table.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_KEY=... node scripts/process-regulations.js
 *
 * Or create .env.local with those vars and run:
 *   node -r dotenv/config scripts/process-regulations.js dotenv_config_path=.env.local
 *
 * Install deps first: npm install --save-dev pdf-parse dotenv
 */

import { readFile, readdir } from 'fs/promises'
import path from 'path'
import os from 'os'

// Load .env.local if present
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

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY
const REGS_DIR = path.join(
  os.homedir(),
  'Library/Mobile Documents/com~apple~CloudDocs/tyfms-regulations'
)
const CHUNK_WORDS = 500
const OVERLAP_WORDS = 60

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌  Set SUPABASE_URL and SUPABASE_SERVICE_KEY (or VITE_ prefixed variants) before running.')
  process.exit(1)
}

const { createClient } = await import('@supabase/supabase-js')
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } })

// Dynamically import pdf-parse (CommonJS module)
const { default: pdfParse } = await import('pdf-parse')

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractPartInfo(filename) {
  const base = path.basename(filename, '.pdf').toLowerCase()
  // Match patterns: part3, part-3, part_3, cfr3, 38cfr3, p3
  const m = base.match(/part[\s_-]*(\d+)/i) || base.match(/cfr[\s_-]*(\d+)/) || base.match(/(\d+)$/)
  if (m) return { part: `Part ${m[1]}`, partNum: parseInt(m[1]) }
  return { part: path.basename(filename, '.pdf'), partNum: 0 }
}

function extractSectionLabel(line) {
  // § 3.340, Sec. 3.340, Section 3.1, or PART 3—TITLE
  const m = line.match(/^(§\s*[\d.]+|Sec\.\s*[\d.]+|Section\s+[\d.]+)/i)
  if (m) return m[1].replace(/\s+/, ' ').trim()
  return null
}

function chunkText(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 2)

  // Group lines into sections based on section markers
  const sections = []
  let currentSection = ''
  let currentLines = []

  for (const line of lines) {
    const secLabel = extractSectionLabel(line)
    if (secLabel && currentLines.length > 0) {
      sections.push({ section: currentSection, lines: currentLines })
      currentSection = secLabel
      currentLines = [line]
    } else {
      if (!currentSection && secLabel) currentSection = secLabel
      currentLines.push(line)
    }
  }
  if (currentLines.length > 0) sections.push({ section: currentSection, lines: currentLines })

  // Split each section into word-count chunks
  const chunks = []
  for (const { section, lines: sLines } of sections) {
    const words = sLines.join(' ').split(/\s+/).filter(Boolean)
    if (words.length === 0) continue

    if (words.length <= CHUNK_WORDS) {
      chunks.push({ section, content: words.join(' ') })
    } else {
      const step = CHUNK_WORDS - OVERLAP_WORDS
      for (let i = 0; i < words.length; i += step) {
        const slice = words.slice(i, i + CHUNK_WORDS).join(' ')
        chunks.push({ section: `${section} (cont.)`.replace('(cont.) (cont.)', '(cont.)'), content: slice })
        if (i + CHUNK_WORDS >= words.length) break
      }
    }
  }
  return chunks
}

// ── Main ─────────────────────────────────────────────────────────────────────

let files
try {
  const entries = await readdir(REGS_DIR)
  files = entries.filter(f => f.toLowerCase().endsWith('.pdf')).map(f => path.join(REGS_DIR, f))
} catch (e) {
  console.error(`❌  Cannot read regulations directory: ${REGS_DIR}\n   ${e.message}`)
  process.exit(1)
}

if (files.length === 0) {
  console.error('❌  No PDF files found in', REGS_DIR)
  process.exit(1)
}

console.log(`\n📂  Found ${files.length} PDF file(s) in ${REGS_DIR}\n`)

let totalChunks = 0

for (const filePath of files) {
  const filename = path.basename(filePath)
  const { part, partNum } = extractPartInfo(filename)
  console.log(`📄  Processing: ${filename}  →  ${part}`)

  let pdfData
  try {
    const buffer = await readFile(filePath)
    pdfData = await pdfParse(buffer)
  } catch (e) {
    console.error(`   ⚠️  Could not parse PDF: ${e.message}`)
    continue
  }

  const text = pdfData.text
  console.log(`   Pages: ${pdfData.numpages} | Characters: ${text.length.toLocaleString()}`)

  const chunks = chunkText(text)
  console.log(`   Chunks created: ${chunks.length}`)

  // Delete existing chunks for this source file before re-inserting
  const { error: delErr } = await supabase
    .from('regulation_chunks')
    .delete()
    .eq('source_file', filename)
  if (delErr) console.warn(`   ⚠️  Delete warning: ${delErr.message}`)

  // Batch insert (50 at a time)
  const rows = chunks.map((c, i) => ({
    source_file: filename,
    part,
    part_num: partNum,
    section: c.section || '',
    content: c.content,
    chunk_index: i,
  }))

  const BATCH = 50
  let inserted = 0
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH)
    const { error } = await supabase.from('regulation_chunks').insert(batch)
    if (error) {
      console.error(`   ❌  Insert error at chunk ${i}: ${error.message}`)
      break
    }
    inserted += batch.length
    process.stdout.write(`   Inserted ${inserted}/${rows.length} chunks\r`)
  }
  console.log(`   ✅  Done — ${inserted} chunks stored for ${part}`)
  totalChunks += inserted
}

console.log(`\n🎉  Finished — ${totalChunks} total chunks loaded into Supabase.\n`)
