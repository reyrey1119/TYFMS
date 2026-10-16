#!/usr/bin/env node
/**
 * Cross-checks every career-guide bundle against DA PAM 611-21: for each MOS, which grades does the guide give
 * rank-specific text for, and which grades does 611-21 say the MOS exists at? Differences are listed, not hidden:
 * a grade missing from the guide may be a heading the parser did not recognise, or a real gap in the guide.
 *
 *   node scripts/check-guide-coverage.js [--dir data/reference/bundles] [--write]
 */
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { parseArgs } from 'node:util'
const { values } = parseArgs({ options: { dir: { type: 'string', default: 'data/reference/bundles' }, write: { type: 'boolean', default: false } } })
const SL_BAND = { 1: 'E-1..E-4', 2: 'E-5', 3: 'E-6', 4: 'E-7', 5: 'E-8', 6: 'E-9' }
const files = (await readdir(values.dir)).filter(f => f.endsWith('.bundle.json'))
const spec = JSON.parse(await readFile(`${values.dir}/army-611-21-enlisted-ch10c.bundle.json`, 'utf8'))
const live = p => (!p.effective_from || p.effective_from <= '2026-10-16') && (!p.effective_to || p.effective_to > '2026-10-16')
const specBands = new Map()
for (const p of spec.passages.filter(p => p.section_type === 'rank_duties' && live(p))) { if (!specBands.has(p.occupation_code)) specBands.set(p.occupation_code, new Set()); specBands.get(p.occupation_code).add(p.rank_band) }
const rows = []
for (const f of files.filter(f => f.startsWith('army-600-25-') || f.startsWith('army-cmf'))) {
  const b = JSON.parse(await readFile(`${values.dir}/${f}`, 'utf8'))
  if (b.source.personnel_category !== 'enlisted') continue
  const byMos = new Map()
  for (const p of b.passages.filter(p => p.rank_band && !/applies to every MOS/.test(p.heading || '') && p.section_type !== 'promotion_criteria')) { if (!byMos.has(p.occupation_code)) byMos.set(p.occupation_code, new Set()); byMos.get(p.occupation_code).add(p.rank_band) }
  for (const [code, bands] of byMos) {
    const want = specBands.get(code) || new Set()
    if (bands.has('E-4..E-5')) bands.add('E-5')
    const missing = [...want].filter(x => !bands.has(x)), extra = [...bands].filter(x => !want.has(x) && !(x === 'E-4..E-5'))
    rows.push({ guide: f.replace(/\.bundle\.json$/, ''), code, guide_bands: [...bands].join(' '), missing_vs_611: missing.join(' '), extra_vs_611: extra.join(' ') })
  }
}
const diff = rows.filter(r => r.missing_vs_611 || r.extra_vs_611)
console.log(`${rows.length} MOS rows; ${diff.length} differ from DA PAM 611-21 grades`)
for (const r of diff) console.log(`${r.guide.slice(0, 40).padEnd(40)} ${r.code}  guide: ${r.guide_bands.padEnd(40)} missing: ${r.missing_vs_611 || '-'}  extra: ${r.extra_vs_611 || '-'}`)
if (values.write) await writeFile('data/reference/corpus/guide-grade-crosscheck.json', JSON.stringify({ rows }, null, 1) + '\n')
