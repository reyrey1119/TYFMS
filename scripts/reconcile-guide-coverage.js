#!/usr/bin/env node
/**
 * Career-guide coverage: for every CURRENT specialty, which approved career guide gives it grade-by-grade development
 * guidance, and for those without, the reason. Only APPROVED bundles count (what a user can actually be shown).
 * This is about development guidance (training, assignments, self-development); duties come from DA PAM 611-21 and are
 * reconciled in coverage-reconciliation.{json,md}.
 *
 *   node scripts/reconcile-guide-coverage.js          # writes data/reference/corpus/guide-coverage-reconciliation.{json,md}
 *   node scripts/reconcile-guide-coverage.js --check
 */
import { readFile, writeFile, readdir } from 'node:fs/promises'
import { parseArgs } from 'node:util'

const ORDER = ['E-1..E-4', 'E-5', 'E-6', 'E-7', 'E-8', 'E-9']

// Enlisted codes that no imported guide covers, each with the reason (verified against the guides' text and chapter lists).
const ENLISTED_NONE = {
  '08H': 'No DA PAM 600-25 guide for CMF 08 (Army Equestrian) is in the downloaded collection.',
  '79R': 'The 9 Sep 2026 CMF 79 guide has chapters for 42T, 79S, 79T and 79V and none for 79R; DA PAM 611-21 gives 79R and 42T the same duties text.',
  '88P': 'USAR-only MOS (Railway Equipment Repairer): the CMF 88 guide has no 88P chapter (it names only 88U as USAR-only).',
  '42S': 'WITHHELD: the guide has four unit-specific chapters for 42S (U.S. Army Band, Field Band, Old Guard Fife and Drum Corps, U.S. Military Academy Band) that repeat the same grades and cannot be told apart.',
  '79T': 'WITHHELD: the chapter gives every grade twice, once for each Active Guard/Reserve track (AGR T-32 and AGR T-10), which cannot be told apart.',
}
const OFFICER_NONE_BY_PREFIX = {
  '00': 'Special reporting / status code, not a job specialty.', '01': 'AOC-immaterial position code, not a job specialty.', '02': 'AOC-immaterial position code, not a job specialty.',
}

export async function build(read = f => readFile(f, 'utf8'), listDir = d => readdir(d)) {
  const inv = JSON.parse(await read('data/reference/corpus/army-code-inventory.json'))
  const approvals = JSON.parse(await read('data/reference/approvals.json')).approvals.map(a => a.manifest_id)
  const files = (await listDir('data/reference/bundles')).filter(f => f.endsWith('.bundle.json')).map(f => f.replace(/\.bundle\.json$/, ''))
  const guideIds = files.filter(id => /^army-600-25-|^army-600-4-|^army-cmf36|^army-cmf42|^army-600-3-|^army-fc-officer/.test(id))
  const bandsBy = { enlisted: new Map(), officer: new Map() }
  const unapproved = []
  for (const id of guideIds) {
    if (!approvals.includes(id)) { unapproved.push(id); continue }
    const b = JSON.parse(await read(`data/reference/bundles/${id}.bundle.json`))
    const cat = b.source.personnel_category
    if (!bandsBy[cat]) continue
    for (const p of b.passages) {
      if (!p.rank_band || p.section_type === 'promotion_criteria' || /applies to every MOS/.test(p.heading || '')) continue
      const m = bandsBy[cat]
      if (!m.has(p.occupation_code)) m.set(p.occupation_code, { bands: new Set(), guides: new Set() })
      m.get(p.occupation_code).bands.add(p.rank_band === 'E-4..E-5' ? 'E-5' : p.rank_band); m.get(p.occupation_code).guides.add(id)
    }
  }
  // grades DA PAM 611-21 gives rank duties for (enlisted), to show which grades the guide lacks
  const spec = JSON.parse(await read('data/reference/bundles/army-611-21-enlisted-ch10c.bundle.json'))
  const live = p => (!p.effective_from || p.effective_from <= inv.as_of) && (!p.effective_to || p.effective_to > inv.as_of)
  const want = new Map()
  for (const p of spec.passages.filter(p => p.section_type === 'rank_duties' && live(p))) { if (!want.has(p.occupation_code)) want.set(p.occupation_code, new Set()); want.get(p.occupation_code).add(p.rank_band) }
  // pamphlet manifests for the officer reasons
  const mdir = 'data/reference/guide-manifests-600-3'
  const pamph = []
  for (const f of (await listDir(mdir)).filter(f => f.endsWith('.json'))) pamph.push({ file: f.replace('.json', '.pdf'), ...JSON.parse(await read(`${mdir}/${f}`)) })
  const reasonFor = code => {
    const p = pamph.find(x => x.skip && (x.codes || []).includes(code))
    return p ? `${p.file}: ${p.skip}` : null
  }
  const out = { as_of: inv.as_of, unapproved_guide_bundles: unapproved, rows: [], summary: {} }
  for (const cat of ['enlisted', 'officer']) {
    const rows = inv.codes.filter(c => c.category === cat && (c.status === 'current' || (cat === 'enlisted' && c.status === 'future_effective')))
    let withGuide = 0
    for (const c of rows) {
      const got = bandsBy[cat].get(c.code)
      const row = { category: cat, code: c.code, title: c.titles[0] || null, status: c.status }
      if (got) {
        withGuide++
        row.guide_grades = [...got.bands].sort((a, b) => (ORDER.indexOf(a) - ORDER.indexOf(b)) || a.localeCompare(b)).join(' ')
        row.guides = [...got.guides].sort()
        if (cat === 'enlisted') {
          const missing = [...(want.get(c.code) || [])].filter(b => !got.bands.has(b))
          if (missing.length) row.grades_611_lists_without_guide_section = missing.sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b)).join(' ')
        }
      } else if (cat === 'enlisted') row.exception = ENLISTED_NONE[c.code] || 'UNACCOUNTED'
      else {
        const pre = c.code.slice(0, 2)
        if (/X$/.test(c.code) || /^(17X|37X|38X|46X|48X|49W|49X|56X)$/.test(c.code)) row.exception = 'Designation / classification-only AOC, not a job: no career guide applies.'
        else if (['64Z', '65X'].includes(c.code)) row.exception = 'No description in DA PAM 611-21 and no guide: see coverage-reconciliation.md.'
        else if (/^(6[0-9]|7[0-3])/.test(c.code) && Number(pre) >= 60 && Number(pre) <= 73) row.exception = 'Army Medical Department AOC: the DA PAM 600-3 AMEDD chapter (one page, June 2017) refers to DA PAM 600-4; the per-corps DA PAM 600-4 chapters are not imported as approved guidance because their currency could not be confirmed (the Medical Service Corps chapter is imported but unapproved).'
        else row.exception = reasonFor(c.code) || 'No DA PAM 600-3 pamphlet or functional-area chapter for this AOC is in the downloaded collection, or none was imported (see the pamphlet list).'
      }
      out.rows.push(row)
    }
    out.summary[cat] = { current_in_register: rows.length, with_approved_guide_grades: withGuide, without: rows.length - withGuide }
  }
  out.pamphlets = pamph.map(p => ({ file: p.file, codes: p.codes || [], imported: !p.skip, reason: p.skip || null })).sort((a, b) => a.file.localeCompare(b.file))
  out.warrant = 'No warrant-officer development guidance is imported: the warrant sections of the DA PAM 600-3 pamphlets and the warrant/officer career charts (da-pam-600-3-career-charts-wo-od-fy25.pdf, figures) are not imported. Warrant specialties are served from DA PAM 611-21 duties only.'
  return out
}

export function render(r) {
  const L = ['# Career-guide coverage (development guidance)', '', `As of ${r.as_of}. Generated by \`scripts/reconcile-guide-coverage.js\`. Only **approved** bundles count. Duties are covered separately (\`coverage-reconciliation.md\`).`, '',
    '| | Enlisted | Officer |', '|---|--:|--:|']
  L.push(`| Current specialties in the register (enlisted includes 79S, effective 1 Oct 2027) | ${r.summary.enlisted.current_in_register} | ${r.summary.officer.current_in_register} |`)
  L.push(`| With approved guide guidance for at least one grade | ${r.summary.enlisted.with_approved_guide_grades} | ${r.summary.officer.with_approved_guide_grades} |`)
  L.push(`| Without (each listed below with its reason) | ${r.summary.enlisted.without} | ${r.summary.officer.without} |`, '')
  L.push('**Warrant officers:** ' + r.warrant, '')
  if (r.unapproved_guide_bundles.length) L.push('**Imported but not approved (not served):** ' + r.unapproved_guide_bundles.join(', '), '')
  L.push('## Enlisted MOS without guide guidance', '', '| Code | Title | Reason |', '|---|---|---|')
  for (const x of r.rows.filter(x => x.category === 'enlisted' && x.exception)) L.push(`| ${x.code} | ${String(x.title || '').replace(/\|/g, '/')} | ${x.exception.replace(/\|/g, '/')} |`)
  L.push('', '## Enlisted MOS whose guide has no section for a grade DA PAM 611-21 lists', '', '| Code | Guide grades | Grades with no guide section |', '|---|---|---|')
  for (const x of r.rows.filter(x => x.grades_611_lists_without_guide_section)) L.push(`| ${x.code} | ${x.guide_grades} | ${x.grades_611_lists_without_guide_section} |`)
  L.push('', '## Officer AOCs without guide guidance', '', '| Code | Title | Reason |', '|---|---|---|')
  for (const x of r.rows.filter(x => x.category === 'officer' && x.exception)) L.push(`| ${x.code} | ${String(x.title || '').replace(/\|/g, '/')} | ${x.exception.replace(/\|/g, '/')} |`)
  L.push('', '## Officer pamphlets (DA PAM 600-3 and functional-area chapters)', '', '| File | AOCs | Imported | Reason not imported |', '|---|---|---|---|')
  for (const p of r.pamphlets) L.push(`| ${p.file} | ${p.codes.join(', ')} | ${p.imported ? 'yes' : 'no'} | ${(p.reason || '').replace(/\|/g, '/')} |`)
  L.push('')
  return L.join('\n')
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { values } = parseArgs({ options: { check: { type: 'boolean', default: false } } })
  const r = await build()
  const json = JSON.stringify(r, null, 1) + '\n', md = render(r)
  const bad = r.rows.filter(x => x.exception === 'UNACCOUNTED')
  if (values.check) {
    const same = (await readFile('data/reference/corpus/guide-coverage-reconciliation.json', 'utf8').catch(() => '')) === json
    if (!same || bad.length) { console.error('guide coverage report is out of date or has unaccounted codes', bad.map(x => x.code)); process.exit(1) }
    console.log('guide coverage report is up to date'); process.exit(0)
  }
  await writeFile('data/reference/corpus/guide-coverage-reconciliation.json', json)
  await writeFile('data/reference/corpus/guide-coverage-reconciliation.md', md)
  console.log(JSON.stringify(r.summary)); if (bad.length) { console.error('UNACCOUNTED', bad.map(x => x.code)); process.exit(1) }
}
