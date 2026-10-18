// RETRIEVAL tests over REAL imported publication text.
//
// What these prove: given the real extracted passages (data/reference/bundles),
// the real retrieval code returns the right sections for the right grade and
// component, with their source and PDF page, and nothing else.
//
// What these do NOT prove: that the extraction is faithful to the PDF. That is a
// separate check — scripts/verify-reference-bundle.js and tests/pdfAccuracy.test.js
// — which needs the PDFs. The anchor phrases below were read off the PDF pages
// (and the rendered page images), not generated.
//
// Bundles import as 'unreviewed'. Approval is simulated here ONLY to exercise
// retrieval; nothing is served in production until a person approves a source.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { useBundledReference } from '../api/_lib/referenceStore.js'
useBundledReference(false)   // these tests exercise the Supabase registry path with their own data; see tests/bundledReference.test.js for the shipped data
import { retrieveReference, referencePromptBlock, clearReferenceCache, developmentGuidance } from '../api/_lib/milReference.js'
import { loadBundles, dbFromBundles, PILOT } from './helpers/bundleDb.js'

const NOW = Date.parse('2026-10-16T00:00:00Z')
const bundles = await loadBundles(PILOT)
const have = id => bundles.some(b => b.manifest_id.startsWith(id))
const get = async (mos, rank, component, branch = 'Army') => {
  clearReferenceCache()
  return retrieveReference({ supabase: dbFromBundles(bundles), now: NOW, body: { branch, mos_afsc: mos, rank, ...(component ? { component } : {}) } })
}
const text = r => r.sections.map(s => s.text).join('\n')
const pagesOf = (r, type) => r.sections.filter(s => s.section === type).map(s => s.pdfPages)
const firstPage = r => Math.min(...r.sections.filter(s => s.pdfPages).map(s => Number(String(s.pdfPages).split('-')[0])))

// ── CMF 42 / MOS 42A (enlisted) ──────────────────────────────────────────────
// Anchor = text unique to that rank's Chapter 4 "Institutional Training" section.
const RANK_ANCHORS_42A = {
  'E-4': { own: 'Promotion to Sergeant requires no PME', page4: 7 },
  'E-5': { own: 'Basic Leader Course. Promotion to SSG requires BLC graduation', page4: 8 },
  'E-6': { own: 'Advanced Leader Course; Promotion to SFC requires ALC graduation', page4: 8 },
  'E-7': { own: 'Senior Leader Course (SLC). Promotion to MSG requires SLC graduation', page4: 10 },
  'E-8': { own: 'Completion of the Sergeants Major Academy is a requirement to be considered for promotion to Sergeant Major', page4: 12 },
}
const MUSICIAN_OR_RECRUITER_ONLY = ['audition', 'Special Band', 'Station Commander', 'Field Band', 'Old Guard Fife', 'Talent Acquisition']

test('42A: E-4..E-8 each retrieve their own rank section and none of the others', { skip: !have('army-cmf42') }, async () => {
  const results = Object.fromEntries(await Promise.all(Object.keys(RANK_ANCHORS_42A).map(async r => [r, await get('42A', r)])))
  for (const [rank, r] of Object.entries(results)) {
    assert.equal(r.status, 'verified', rank)
    assert.match(r.training_recommendations, new RegExp(RANK_ANCHORS_42A[rank].own.replace(/[()]/g, '\\$&')), `${rank} has its own training section`)
    for (const [other, a] of Object.entries(RANK_ANCHORS_42A)) {
      if (other !== rank) assert.ok(!text(r).includes(a.own), `${rank} must not contain the ${other} section`)
    }
    // every rank-specific section is for this grade (or all grades), never another
    for (const s of r.sections) assert.ok(!s.rankBand || s.rankBand.includes(rank) || (s.rankBand === 'E-1..E-4' && rank === 'E-4'), `${rank}: stray band ${s.rankBand}`)
  }
})

test('42A: the rank section starts on the PDF page the document puts it on', { skip: !have('army-cmf42') }, async () => {
  // Verified against the PDF (and rendered page images): Ch.4 "1. Private" and "2. Sergeant" are on
  // p.7, "3. Staff Sergeant" p.8, "4. SFC" p.10, "5. MSG/1SG" p.11, "6. SGM/CSM" p.13.
  const ch4Start = async rank => { const r = await get('42A', rank); return Math.min(...r.sections.filter(s => s.chapter?.startsWith('Chapter 4') && s.rankBand).map(s => Number(s.pdfPages.split('-')[0]))) }
  assert.equal(await ch4Start('E-4'), 7)
  assert.equal(await ch4Start('E-5'), 7)
  assert.equal(await ch4Start('E-6'), 8)
  assert.equal(await ch4Start('E-7'), 10)
  assert.equal(await ch4Start('E-8'), 11)
  assert.equal(await ch4Start('E-9'), 13)
})

test('42A: each section reports its source and PDF page', { skip: !have('army-cmf42') }, async () => {
  const r = await get('42A', 'E-6')
  assert.equal(r.sources.length, 1)
  assert.equal(r.sources[0].publicationNumber, 'DA PAM 600-25')
  assert.equal(r.sources[0].url, 'https://api.army.mil/e2/c/downloads/2025/10/01/4a0dd790/cmf-42-da-pam-600-25-30-sep-25.pdf')
  assert.equal(r.sources[0].publicationDate, '2025-09-30')
  for (const s of r.sections) { assert.equal(s.sourceId, r.sources[0].id); assert.match(s.pdfPages, /^\d+(-\d+)?$/) }
  assert.deepEqual(pagesOf(r, 'assignments'), ['8', '8', '8'], 'Staff Sergeant operational/generating/broadening are on p.8')
  assert.deepEqual(pagesOf(r, 'credentials'), ['9'])
})

test('42A: duties, training, credentials and assignments stay in separate categories', { skip: !have('army-cmf42') }, async () => {
  const r = await get('42A', 'E-6')
  assert.match(r.duties_and_responsibilities, /HR specialist manages and performs HR functions/)
  assert.match(r.developmental_assignments, /Senior HR Sergeant in a TDA organization/)
  assert.match(r.training_recommendations, /Advanced Leader Course/)
  assert.match(r.credential_recommendations, /Associate Professional in Human Resources \(aPHR\); Certified Associate in Project Management \(CAPM\); Project Management Professional \(PMP\); Power BI Data Analyst Associate/)
  assert.ok(!/aPHR/.test(r.training_recommendations) && !/Advanced Leader Course/.test(r.credential_recommendations), 'categories are not mixed')
  const block = referencePromptBlock(r)
  // Recommended credentials, training and assignments are guidance for the person, not material to write from.
  assert.ok(!/aPHR|Advanced Leader Course|Senior HR Sergeant in a TDA/.test(block), 'recommendations never reach a generation prompt')
  assert.match(block, /HR specialist manages and performs HR functions/)
  const groups = developmentGuidance(r)
  assert.deepEqual(groups.map(g => g.section).filter(x => ['training', 'credentials', 'assignments'].includes(x)), ['training', 'credentials', 'assignments'])
  assert.match(groups.find(g => g.section === 'credentials').label, /recommends/)
})

test('42A: promotion-board criteria are stored but never returned or sent to a model', { skip: !have('army-cmf42') }, async () => {
  for (const rank of ['E-6', 'E-7', 'E-8', 'E-9']) {
    const r = await get('42A', rank)
    assert.ok(!/AFT score of/.test(JSON.stringify(r)), `${rank}: physical-fitness promotion thresholds must not appear`)
    assert.ok(!/Soldier Talent Profile/.test(referencePromptBlock(r)))
  }
})

test('42A: musician (42R/42S) and recruiter (42T) chapters never leak in', { skip: !have('army-cmf42') }, async () => {
  for (const rank of ['E-4', 'E-5', 'E-6', 'E-7', 'E-8', 'E-9']) for (const component of [undefined, 'active', 'reserve', 'guard']) {
    const r = await get('42A', rank, component)
    const all = JSON.stringify(r)
    for (const phrase of MUSICIAN_OR_RECRUITER_ONLY) assert.ok(!all.includes(phrase), `${rank}/${component}: leaked "${phrase}"`)
    for (const s of r.sections) assert.ok(/^Chapter [346]\./.test(s.chapter), `${rank}: section from ${s.chapter}`)
  }
  const mob = (await get('42A', 'E-6', 'reserve')).sections.find(s => s.heading === 'Mobilization')
  assert.ok(mob && !/Chapter 7|musician/i.test(mob.text), 'the Reserve chapter ends before Chapter 7 starts on the same PDF page')
})

test('42A: Reserve/Guard chapter appears only when the component is Reserve or Guard', { skip: !have('army-cmf42') }, async () => {
  const none = await get('42A', 'E-6')
  const active = await get('42A', 'E-6', 'active')
  const reserve = await get('42A', 'E-6', 'reserve')
  const guard = await get('42A', 'E-6', 'guard')
  const isRC = s => s.components === 'reserve,guard'
  assert.ok(!none.sections.some(isRC) && !active.sections.some(isRC))
  assert.equal(none.componentNote, null, 'the component choice was removed from the app, so no prompt is shown')
  assert.equal(active.componentNote, null)
  assert.ok(reserve.sections.some(isRC) && guard.sections.some(isRC))
  assert.match(text(reserve), /Garrison Operations|Battle Assemblies/)
})

test('42A: a grade the source has no rank section for is not given invented scope', { skip: !have('army-cmf42') }, async () => {
  const r = await get('42A', 'E-2')   // E-2 is inside the Private–Specialist/Corporal band
  assert.ok(r.sections.some(s => s.rankBand === 'E-1..E-4'))
  const w = await get('42A', 'W-2')   // no warrant guidance exists for 42A
  assert.equal(w.status, 'none')
  const o = await get('42A', 'O-3')
  assert.equal(o.status, 'none', 'an officer grade never reads the enlisted 42A chapter')
})

// ── CMF 36 / MOS 36B (enlisted Finance) ─────────────────────────────────────

test('36B: rank sections differ by grade and carry real pages', { skip: !have('army-cmf36') }, async () => {
  const e4 = await get('36B', 'E-4'), e5 = await get('36B', 'E-5'), e7 = await get('36B', 'E-7'), e9 = await get('36B', 'E-9')
  for (const r of [e4, e5, e7, e9]) { assert.equal(r.status, 'verified'); assert.equal(r.sources[0].publicationDate, '2024-07-19') }
  assert.match(e4.special_awards ?? text(e4), /Junior enlisted Soldiers are eligible to receive the following/)
  assert.match(text(e5), /SGTs are highly encouraged to complete the Advanced Leaders Course \(ALC\)/)
  assert.ok(!text(e5).includes('Junior enlisted Soldiers are eligible'))
  assert.ok(!text(e4).includes('SGTs are highly encouraged'))
  assert.notEqual(text(e7), text(e5))
  assert.notEqual(text(e9), text(e7))
  // the Reserve/Guard chapter is component-gated here too
  const rc = await get('36B', 'E-6', 'guard')
  assert.ok(rc.sections.some(s => s.components === 'reserve,guard' && /ARNG|National Guard/.test(s.text)))
  assert.ok(!(await get('36B', 'E-6', 'active')).sections.some(s => s.components))
})

test('36B: Guard-only text in the Reserve/Guard chapter never reaches an Army Reserve soldier', { skip: !have('army-cmf36') }, async () => {
  const reserve = await get('36B', 'E-6', 'reserve')
  const guard = await get('36B', 'E-6', 'guard')
  const ARNG_ONLY = [/ARNG has a unique dual mission/, /Title 32/, /ARNG Soldiers have no opportunity to serve in\s+Generating Force/, /Recruit Sustainment Program/, /dual mission of the ARNG/]
  for (const re of ARNG_ONLY) { assert.ok(!re.test(text(reserve)), `Reserve must not see ${re}`); assert.ok(re.test(text(guard)), `Guard must see ${re}`) }
  // text that applies to the whole Reserve Component reaches both
  for (const c of [reserve, guard]) assert.match(text(c), /To qualify for the 36B MOS, RC Soldiers must complete the Finance Technician Course/)
  assert.ok(guard.sections.filter(s => s.components === 'guard').length >= 3)
})

test('36B: Star Credentials / Proponent Recommended are returned as credentials, per rank', { skip: !have('army-cmf36') }, async () => {
  const e5 = await get('36B', 'E-5')
  assert.match(e5.credential_recommendations, /Proponent Recommended: Certified Government Financial Manager \(CGFM\)/)
  assert.ok(!/Proponent Recommended/.test(e5.training_recommendations))
})

// ── Finance and Comptroller officer guide (36A) — Active vs Reserve vs Guard ─

test('36A: Active, Reserve and Guard officers get their own sections', { skip: !have('army-fc-officer') }, async () => {
  const active = await get('36A', 'O-3', 'active')
  const reserve = await get('36A', 'O-3', 'reserve')
  const guard = await get('36A', 'O-3', 'guard')
  assert.match(text(active), /Completion of the FC Captains Career Course prepares the officer/)
  assert.ok(!/phase FC CCC–RC/.test(text(active)))
  assert.match(text(reserve), /three-\s?phase FC CCC–RC/)
  assert.match(text(guard), /ARNG/)
  // Text inside component-SPECIFIC sections never crosses over. (The all-components "Branch transfer"
  // section on p.2 legitimately points to both paragraph 5d and 6d, so it is excluded from this check.)
  const specific = r => r.sections.filter(s => s.components).map(s => s.text).join('\n')
  assert.ok(!/ARNG/.test(specific(reserve)), 'Reserve-specific sections never mention the Guard')
  assert.ok(!/Army Reserve officers who have completed/.test(specific(guard)), 'Guard-specific sections never mention Reserve text')
  assert.ok(reserve.sections.some(s => s.components === 'reserve') && guard.sections.some(s => s.components === 'guard'))
  for (const [name, r] of [['active', active], ['reserve', reserve], ['guard', guard]]) {
    for (const s of r.sections) assert.ok(!s.components || s.components === name, `${name} got a ${s.components} section`)
  }
})

test('36A: grades map to the document headings (Lieutenant, Captain, Major, LTC, Colonel)', { skip: !have('army-fc-officer') }, async () => {
  const phrase = {
    'O-1': /Lieutenants should serve in a KD position for 18 to 24 months/,
    'O-2': /Lieutenants should serve in a KD position for 18 to 24 months/,
    'O-3': /Captains should serve in a KD position for 18 to 24 months/,
    'O-4': /Majors should serve in a KD position for 18 to 24 months/,
    'O-5': /Lieutenant Colonels should serve in a KD position for 24/,
    'O-6': /Colonels must complete SSC/,
  }
  for (const [rank, re] of Object.entries(phrase)) {
    const r = await get('36A', rank, 'active')
    assert.match(text(r), re, rank)
    for (const [other, re2] of Object.entries(phrase)) {
      if (re2.source !== re.source) assert.ok(!re2.test(text(r)), `${rank} contains the ${other} section`)
    }
  }
})

test('36A: with no component chosen, nothing component-specific is shown', { skip: !have('army-fc-officer') }, async () => {
  const r = await get('36A', 'O-3')
  assert.ok(r.sections.every(s => !s.components))
  assert.equal(r.componentNote, null)
})

test('36A: warrant officers get the document\'s own statement that none exist, not made-up guidance', { skip: !have('army-fc-officer') }, async () => {
  const r = await get('36A', 'W-2')
  assert.equal(r.status, 'verified')
  assert.match(text(r), /There are no warrant officers in the FC branch\./)
  assert.equal(r.sections.length, 1)
})

test('36A: Reserve and Guard field-grade items written for one grade only reach that grade', { skip: !have('army-fc-officer') }, async () => {
  const maj = await get('36A', 'O-4', 'reserve'), ltc = await get('36A', 'O-5', 'reserve'), col = await get('36A', 'O-6', 'reserve')
  assert.match(text(maj), /2-Star Command Budget Officer/)
  assert.ok(!/FIBN Commander/.test(text(maj)))
  assert.match(text(ltc), /FIBN Commander/)
  assert.ok(!/2-Star Command Budget Officer/.test(text(ltc)))
  assert.match(text(col), /Brigade Command \(90A\/01A\)/)
  assert.ok(!/FIBN Commander/.test(text(col)))
})

// ── honesty about sources ────────────────────────────────────────────────────

test('real sources are labeled with their real dates, and not-yet-reviewed sources are never served', async () => {
  clearReferenceCache()
  const unreviewed = await retrieveReference({ supabase: dbFromBundles(bundles, { approved: false }), now: NOW, body: { branch: 'Army', mos_afsc: '42A', rank: 'E-6' }, aiSuggest: null })
  assert.equal(unreviewed.status, 'none', 'an imported-but-unapproved source must not be served')
  const stale = await retrieveReference({ supabase: dbFromBundles(bundles), now: Date.parse('2027-06-01T00:00:00Z'), body: { branch: 'Army', mos_afsc: '42A', rank: 'E-6' } })
  assert.equal(stale.status, 'stale', 'not re-checked for 7 months → stale, said plainly')
})

test('source limitations travel with the result (figures that were not extracted)', { skip: !have('army-fc-officer') }, async () => {
  const r = await get('36A', 'O-3', 'active')
  assert.match(r.sources[0].limitations, /Figures 1-4 \(PDF pages 8, 9, 12 and 13\) are images/)
  const e = await get('42A', 'E-6')
  assert.match(e.sources[0].limitations, /Only MOS 42A is included/)
})

test('reference numbers and named systems are fenced off from personal experience in the prompt', { skip: !have('army-cmf36') }, async () => {
  const r = await get('36B', 'E-6')
  assert.match(text(r), /five or more Soldiers/, 'the publication really does contain a typical team size')
  assert.match(referencePromptBlock(r), /Never copy any of them into this person's experience unless the person stated it themselves/)
})

test('36B: promotion-board thresholds (ACFT scores) are stored but never returned', { skip: !have('army-cmf36') }, async () => {
  for (const rank of ['E-5', 'E-6', 'E-7', 'E-8', 'E-9']) {
    const r = await get('36B', rank)
    assert.ok(!/ACFT Score/i.test(JSON.stringify(r)), rank)
    assert.ok(!/Most Qualified|\bMQ:/.test(referencePromptBlock(r)), rank)
  }
})
