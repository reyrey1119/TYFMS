#!/usr/bin/env node
/**
 * Accounts for EVERY code in the Army inventory: either it has an imported description (and which kind), or it has a
 * documented exception with the page that supports the reason. Nothing is dropped silently: a code with neither makes
 * this script (and the test that calls it) fail.
 *
 *   node scripts/reconcile-imported-coverage.js          # writes data/reference/corpus/coverage-reconciliation.{json,md}
 *   node scripts/reconcile-imported-coverage.js --check  # exit 1 if the committed files are out of date
 */
import { readFile, writeFile } from 'node:fs/promises'
import { parseArgs } from 'node:util'

const BUNDLE = { enlisted: 'army-611-21-enlisted-ch10c', warrant: 'army-611-21-warrant-ch8b', officer: 'army-611-21-officer-ch3' }
const CHAPTER = { enlisted: 'ch. 10c', warrant: 'ch. 8b', officer: 'ch. 3' }

// Reasons verified by reading the cited pages of DA PAM 611-21 (PDF page indices of the chapter file named).
const DESIGNATION_ONLY = {
  '17X': 'p. 51: "AOC 17X is for personnel classification only upon designation ... will not be used to code positions."',
  '37X': 'p. 74: "AOC 37X is used for personnel classification only ... not used to code positions."',
  '38X': 'p. 77: "AOC 38X is used for personnel classification only ... not used to code positions."',
  '46X': 'p. 83: "AOC 46X will be assigned upon designation as a FA 46 officer" (untrained public affairs officer).',
  '48X': 'p. 93: "AOC 48X is used to code positions only in Tables of ..." (immaterial; classifies newly designated FAOs).',
  '49W': 'p. 95: "AOC 49W will be assigned upon completion of ORSA MAC ... will not be used to code positions."',
  '49X': 'p. 95: "AOC 49X will be assigned upon designation as a FA 49 officer ... will not be used to code positions."',
  '56X': 'p. 105: "AOC 56X will be assigned upon designation of a Branch 56 officer" (chaplain candidate; retained until training is complete).',
}
// AOCs that only code positions any officer of the corps may fill: not a job specialty. Reasons verified on the cited pages.
const IMMATERIAL_POSITION = {
  '64Z': 'Veterinary Corps AOC-immaterial position code: DA PAM 611-21 lists it in the structure chart (p. 12, "Senior Veterinarian (Immaterial)") with no section; the DA PAM 600-4 Veterinary Corps chapter (17 Dec 2021) says positions "coded 64Z ... mean that VC officers of any AOC can fill these positions" (p. 6) and lists them as "Branch immaterial positions (Coded AOC 64Z)" (p. 16). It is a position code, not an occupation, so it has no duties to import.',
  '65X': 'Specialist Corps AOC-immaterial position code: DA PAM 611-21 lists it in the structure chart (p. 13, "Specialist Allied Operations") with no description; the DA PAM 600-4 Specialist Corps chapter (2 Feb 2022) lists "The coded AC SP AOC Immaterial (65X) positions" such as Corps Chief and Deputy Corps Chief (p. 8). It is a position code, not an occupation, so it has no duties to import.',
}
// Imported by mapping a section onto the AOC, with the reason.
const MAPPED_NOTE = {
  '50A': 'Description imported from DA PAM 611-21 section 3-50 "Force Management (50)", p. 98: the section describes functional area 50, and the structure chart (p. 19) gives FA 50 exactly one AOC, 50A, titled "Force Development" there. The FA50 career pamphlet (25 Apr 2024) calls the functional area "Force Management" and refers to "50A coded" positions, so the title difference is the functional-area name versus the AOC title; both are recorded.',
}
const MSC_AOCS = ['70A', '70B', '70C', '70D', '70E', '70F', '70H', '70K', '71A', '71B', '71E', '71F', '72A', '72B', '72C', '72D', '73A', '73B']
const MSC_REASON = 'Medical Service Corps functional-area AOC: the chapter names it in the branch description (p. 149: "will be further identified with branch code 67 (e.g., 70A67)"), the structure chart and a proponent table (pp. 21-23, 31-37), but gives no description of duties for it.'
const SENIOR_ONLY = { '35Z': 'Specification gives duties for the senior skill levels only (E-8, E-9).', '46Y': 'Specification gives duties for the senior skill levels only (E-8, E-9).' }

// Bundles that describe codes DA PAM 611-21 lists without a description. Their passages count for the register.
const SUPPLEMENTS = {
  officer: [{ id: 'army-600-4-20220223-medical-service-corps', note: 'Description imported from the DA PAM 600-4 Medical Service Corps chapter (file dated 23 Feb 2022), "Description of duties" for this AOC; DA PAM 611-21 lists the AOC without a description. The 2022 chapter is older than DA PAM 611-21 (Nov 2025).' }],
}
export async function loadReconciliationBundles(read = f => readFile(f, 'utf8')) {
  const bundles = {}
  for (const [cat, id] of Object.entries(BUNDLE)) bundles[cat] = JSON.parse(await read(`data/reference/bundles/${id}.bundle.json`))
  for (const [cat, list] of Object.entries(SUPPLEMENTS)) for (const sup of list) {
    const b = JSON.parse(await read(`data/reference/bundles/${sup.id}.bundle.json`))
    bundles[cat] = { ...bundles[cat], passages: [...bundles[cat].passages, ...b.passages.map(p => { const m = (p.heading || '').match(/the chapter titles this AOC "([^"]+)"/); return { ...p, _supplement: sup.note + (m ? ` The chapter titles this AOC "${m[1]}"; DA PAM 611-21 (Nov 2025) uses a different title, which is kept as the AOC's title.` : '') } })] }
  }
  return bundles
}

export function buildReconciliation(inventory, bundles) {
  const out = { as_of: inventory.as_of, categories: {}, rows: [], unaccounted: [] }
  for (const cat of ['enlisted', 'warrant', 'officer']) {
    const bundle = bundles[cat]
    const byCode = new Map()
    const viaSupplement = new Map()
    for (const p of bundle.passages) { if (!byCode.has(p.occupation_code)) byCode.set(p.occupation_code, new Set()); byCode.get(p.occupation_code).add(p.section_type); if (p._supplement && p.section_type === 'general_duties') viaSupplement.set(p.occupation_code, p._supplement) }
    const rows = inventory.codes.filter(c => c.category === cat)
    const crossBy = new Map()
    for (const x of bundle.report.crossReferences || []) { if (!crossBy.has(x.code)) crossBy.set(x.code, []); crossBy.get(x.code).push(x) }
    const crossText = code => crossBy.get(code).map(x => `${x.rank_band ? x.rank_band + ' ' : ''}"${x.text}" (${CHAPTER[cat]} p. ${x.pdf_page})`).join('; ')
    const tally = { register: rows.length, imported_description: 0, imported_not_served: 0, general_only: 0, exceptions: 0, by_status: {}, by_reason: {} }
    const bump = (k, n = 1) => { tally.by_reason[k] = (tally.by_reason[k] || 0) + n }
    for (const c of rows) {
      tally.by_status[c.status] = (tally.by_status[c.status] || 0) + 1
      const types = byCode.get(c.code) || new Set()
      const hasDesc = types.has('general_duties') || types.has('rank_duties')
      const row = { category: cat, code: c.code, title: c.titles[0] || null, status: c.status, imported: hasDesc ? [...types].sort().join('+') : null, exception: null, page: c.versions.find(v => v.page)?.page || null }
      if (c.status === 'special_reporting' || c.status === 'immaterial') {
        row.exception = `${c.status === 'immaterial' ? 'MOS/AOC-immaterial' : 'Special reporting / status'} code: a reporting or position-coding convention, not a job specialty, so it has no duties to import${hasDesc ? ' (the chapter does print a description, kept in the data but never served as a specialty reference)' : ''}.`
        bump('special_reporting_or_immaterial')
      } else if (c.status === 'rescinded' || c.status === 'future_effective') {
        row.exception = c.status === 'rescinded' ? `Not current: rescinded effective ${c.rescinded_from}.` : `Not current yet: effective ${c.effective_from}.`
        if (hasDesc) { tally.imported_not_served++ }
        bump(c.status)
      } else if (hasDesc) {
        tally.imported_description++
        if (cat === 'enlisted' && !types.has('rank_duties')) { tally.general_only++; row.exception = 'Description imported, but the pamphlet gives only general ("major") duties for this MOS, no per-grade text; answers say so and invent no rank scope.'; bump('general_duties_only') }
        if (SENIOR_ONLY[c.code]) row.exception = SENIOR_ONLY[c.code]
        if (MAPPED_NOTE[c.code]) { row.exception = MAPPED_NOTE[c.code]; bump('functional_area_section_mapped') }
        if (viaSupplement.get(c.code)) { row.exception = viaSupplement.get(c.code); bump('imported_from_supplement') }
        if (crossBy.has(c.code)) { row.exception = 'Description imported, but part of the pamphlet text only points elsewhere or introduces what follows, and gives no duties of its own (not stored): ' + crossText(c.code); bump('grade_cross_reference_only') }
      } else if (crossBy.has(c.code)) { row.exception = 'The pamphlet gives only a cross-reference for duties, no description: ' + crossText(c.code); bump('cross_reference_only') }
      else if (DESIGNATION_ONLY[c.code]) { row.exception = 'Designation / classification-only AOC, not a job: ' + DESIGNATION_ONLY[c.code]; bump('designation_only') }
      else if (IMMATERIAL_POSITION[c.code]) { row.exception = IMMATERIAL_POSITION[c.code]; bump('immaterial_position_code') }
      else if (MSC_AOCS.includes(c.code)) { row.exception = MSC_REASON; bump('medical_service_corps_no_description') }
      else { out.unaccounted.push(`${cat} ${c.code}`); row.exception = 'UNACCOUNTED' }
      if (row.exception && !hasDesc) tally.exceptions++
      out.rows.push(row)
    }
    // codes in the bundle that are not in the inventory (would be silently imported)
    const inRegister = new Set(rows.map(r => r.code))
    tally.imported_codes_not_in_register = [...byCode.keys()].filter(c => !inRegister.has(c))
    tally.codes_with_any_import = [...byCode.keys()].length
    if (tally.imported_codes_not_in_register.length) out.unaccounted.push(...tally.imported_codes_not_in_register.map(c => `${cat} ${c} (imported but not in register)`))
    out.categories[cat] = tally
  }
  return out
}

export function renderMarkdown(r) {
  const L = ['# Army code register vs imported descriptions', '', `As of ${r.as_of}. Generated by \`scripts/reconcile-imported-coverage.js\`; a test fails if any code is neither imported nor an explained exception.`, '',
    '| | Enlisted | Warrant | Officer |', '|---|--:|--:|--:|']
  const c = r.categories
  const row = (label, f) => L.push(`| ${label} | ${['enlisted', 'warrant', 'officer'].map(k => f(c[k])).join(' | ')} |`)
  row('Codes in the register', t => t.register)
  row('— current, description imported', t => t.imported_description)
  row('— of which general duties only (no per-grade text)', t => t.general_only)
  row('— current, no description (documented exception)', t => (t.by_status.current || 0) - t.imported_description)
  row('— rescinded / future-effective', t => (t.by_status.rescinded || 0) + (t.by_status.future_effective || 0))
  row('— special reporting / immaterial / status', t => (t.by_status.special_reporting || 0) + (t.by_status.immaterial || 0))
  row('Codes with any imported passage', t => t.codes_with_any_import)
  row('Imported but not served (not current)', t => t.imported_not_served)
  L.push('', '## Every exception', '', '| Category | Code | Title | Status | Reason |', '|---|---|---|---|---|')
  for (const x of r.rows.filter(x => x.exception && !(x.status === 'current' && x.imported && /^Description imported, but the pamphlet gives only general/.test(x.exception) && false)))
    L.push(`| ${x.category} | ${x.code} | ${String(x.title || '').replace(/\|/g, '/').slice(0, 60)} | ${x.status} | ${x.exception.replace(/\|/g, '/')} |`)
  L.push('')
  return L.join('\n')
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { values } = parseArgs({ options: { check: { type: 'boolean', default: false } } })
  const inventory = JSON.parse(await readFile('data/reference/corpus/army-code-inventory.json', 'utf8'))
  const bundles = await loadReconciliationBundles()
  const r = buildReconciliation(inventory, bundles)
  const json = JSON.stringify(r, null, 1) + '\n', md = renderMarkdown(r)
  if (values.check) {
    const same = (await readFile('data/reference/corpus/coverage-reconciliation.json', 'utf8').catch(() => '')) === json
    if (!same || r.unaccounted.length) { console.error('coverage reconciliation is out of date or has unaccounted codes:', r.unaccounted); process.exit(1) }
    console.log('coverage reconciliation is up to date'); process.exit(0)
  }
  await writeFile('data/reference/corpus/coverage-reconciliation.json', json)
  await writeFile('data/reference/corpus/coverage-reconciliation.md', md)
  console.log(md.split('\n').slice(0, 14).join('\n'))
  if (r.unaccounted.length) { console.error('UNACCOUNTED:', r.unaccounted); process.exit(1) }
}
