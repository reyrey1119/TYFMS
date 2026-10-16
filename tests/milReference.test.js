// Regression tests for rank-aware reference retrieval.
//
// ALL fixture text below is SYNTHETIC. It exists to prove the retrieval logic
// picks the right section for the right rank and labels it honestly. It is not
// publication content and says nothing about what any real MOS/AOC involves.
//
// Run: npm test

import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { useBundledReference } from '../api/_lib/referenceStore.js'
useBundledReference(false)   // these tests exercise the Supabase registry path with their own data; see tests/bundledReference.test.js for the shipped data
import {
  parsePayGrade, normalizeOccupation, rankBandContains, buildCacheKey,
  validateReferenceRequest, retrieveReference, referencePromptBlock,
  clearReferenceCache, STALE_AFTER_DAYS,
} from '../api/_lib/milReference.js'
import { makeLatestGuard, makeSingleFlight } from '../src/lib/latestOnly.js'
import { fakeSupabase } from './helpers/fakeSupabase.js'

const NOW = Date.parse('2026-10-15T12:00:00Z')
const daysAgo = n => new Date(NOW - n * 86_400_000).toISOString()

function source(over = {}) {
  return {
    id: 'src-1', branch: 'Army', personnel_category: 'enlisted',
    publication_number: 'SYNTHETIC PAM 1', title: 'Synthetic career guide', chapter: 'Chapter 4',
    official_url: 'https://example.army.mil/synthetic.pdf', publication_date: '2024-07-19',
    effective_date: null, last_checked_at: daysAgo(10), reviewed_at: daysAgo(10),
    checksum_sha256: 'aaa', review_status: 'approved', superseded_by: null, ...over,
  }
}
function passage(over = {}) {
  return {
    source_id: 'src-1', branch: 'Army', personnel_category: 'enlisted', occupation_code: '36B',
    occupation_title: 'Synthetic Specialist', section_type: 'general_duties', rank_band: null,
    heading: null, body: 'General duty text.', pdf_page_start: over.pdf_page_start ?? 7, pdf_page_end: over.pdf_page_start ?? 7,
    printed_page: null, sort_order: 0, ...over,
  }
}
const body = (rank, mos = '36B', branch = 'Army') => ({ branch, mos_afsc: mos, rank })
const run = (db, b, extra = {}) => retrieveReference({ supabase: db, body: b, now: NOW, ...extra })

beforeEach(() => clearReferenceCache())

// ── pay grades, bands, keys ───────────────────────────────────────────────────

test('parsePayGrade accepts real grades and rejects impossible ones', () => {
  assert.equal(parsePayGrade('E-5').payGrade, 'E-5')
  assert.equal(parsePayGrade(' e5 ').payGrade, 'E-5')
  assert.equal(parsePayGrade('W-3').category, 'warrant')
  assert.equal(parsePayGrade('O-10').category, 'officer')
  for (const bad of ['E-10', 'W-6', 'O-11', 'E-0', 'X-1', '', 'sergeant', null, undefined]) assert.equal(parsePayGrade(bad), null, String(bad))
})

test('rankBandContains handles null, single, range and list bands', () => {
  assert.equal(rankBandContains(null, 'E-9'), true)
  assert.equal(rankBandContains('E-1..E-4', 'E-3'), true)
  assert.equal(rankBandContains('E-1..E-4', 'E-5'), false)
  assert.equal(rankBandContains('E-5,E-6', 'E-6'), true)
  assert.equal(rankBandContains('E-6', 'E-7'), false)
  assert.equal(rankBandContains('E-1..E-4', 'O-2'), false, 'bands never cross enlisted/officer')
  assert.equal(rankBandContains('garbage', 'E-5'), false)
})

test('cache keys separate rank, component, category, occupation and source version', () => {
  const base = { branch: 'Army', component: 'active', category: 'enlisted', occupation: '36B', payGrade: 'E-5', sourceVersion: 'v1' }
  const k = buildCacheKey(base)
  assert.equal(k, buildCacheKey({ ...base }))
  for (const change of [{ payGrade: 'E-7' }, { component: 'guard' }, { category: 'officer' }, { occupation: '36A' }, { sourceVersion: 'v2' }, { branch: 'Navy' }]) {
    assert.notEqual(k, buildCacheKey({ ...base, ...change }), JSON.stringify(change))
  }
})

// ── validation: never guess ───────────────────────────────────────────────────

test('missing rank is a question, not a silent "enlisted"', async () => {
  const r = await run(fakeSupabase({}), { branch: 'Army', mos_afsc: '36B' })
  assert.equal(r.status, 'needs_input')
  assert.deepEqual(r.missing, ['rank'])
})

test('Guard and Reserve are components, not branches', () => {
  const v = validateReferenceRequest({ branch: 'National Guard', mos_afsc: '36B', rank: 'E-5' })
  assert.equal(v.ok, false)
  assert.deepEqual(v.result.missing, ['branch'])
  assert.match(v.result.message, /components, not branches/)
  assert.equal(validateReferenceRequest({ ...body('E-5'), component: 'guard' }).req.component, 'guard')
  assert.equal(validateReferenceRequest({ ...body('E-5'), component: 'space' }).ok, false)
})

test('invalid occupation codes and rank/category conflicts are rejected', () => {
  assert.equal(normalizeOccupation('36 b'), '36B')
  assert.equal(normalizeOccupation('<script>'), null)
  assert.equal(normalizeOccupation('A'.repeat(30)), null)
  assert.equal(validateReferenceRequest(body('E-5', '!!!')).result.status, 'invalid_input')
  assert.equal(validateReferenceRequest({ ...body('E-5'), category: 'officer' }).result.status, 'invalid_input')
  assert.equal(validateReferenceRequest(body('sergeant')).result.status, 'invalid_input')
})

// ── rank-aware retrieval ──────────────────────────────────────────────────────

const financeEnlisted = () => fakeSupabase({
  reference_sources: [source()],
  reference_passages: [
    passage({ body: 'Shared finance duties.' }),
    passage({ section_type: 'rank_duties', rank_band: 'E-1..E-4', heading: 'Junior enlisted', body: 'Learn the basics.', pdf_page_start: 7 }),
    passage({ section_type: 'rank_duties', rank_band: 'E-5', heading: 'Sergeant', body: 'Supervise a small team.', pdf_page_start: 7 }),
    passage({ section_type: 'rank_duties', rank_band: 'E-7', heading: 'Sergeant First Class', body: 'Lead a section.', pdf_page_start: 10 }),
    passage({ section_type: 'training', rank_band: 'E-7', heading: 'Training', body: 'Attend the senior course (recommended).', pdf_page_start: 10 }),
    passage({ section_type: 'credentials', rank_band: 'E-7', body: 'Consider a professional certification.' }),
    passage({ section_type: 'assignments', rank_band: 'E-7', body: 'Possible assignment: detachment sergeant.' }),
  ],
})

test('the same specialty returns different, correct sections at E-5 and E-7', async () => {
  const db = financeEnlisted()
  const e5 = await run(db, body('E-5'))
  const e7 = await run(db, body('E-7'))
  assert.equal(e5.status, 'verified')
  assert.equal(e5.rank_specific_expectations, 'Sergeant: Supervise a small team.')
  assert.equal(e7.rank_specific_expectations, 'Sergeant First Class: Lead a section.')
  assert.ok(!e5.rank_specific_expectations.includes('Lead a section'))
  assert.ok(!e7.rank_specific_expectations.includes('small team'))
  assert.equal(e5.duties_and_responsibilities, 'Shared finance duties.')
  assert.equal(e7.duties_and_responsibilities, 'Shared finance duties.')
})

test('training, credentials and assignments stay distinct and rank-gated', async () => {
  const db = financeEnlisted()
  const e7 = await run(db, body('E-7'))
  assert.equal(e7.training_recommendations, 'Training: Attend the senior course (recommended).')
  assert.equal(e7.credential_recommendations, 'Consider a professional certification.')
  assert.equal(e7.developmental_assignments, 'Possible assignment: detachment sergeant.')
  const e5 = await run(db, body('E-5'))
  assert.equal(e5.training_recommendations, '')
  assert.equal(e5.developmental_assignments, '')
})

test('provenance (source, version, URL, PDF page) reaches the caller, per section', async () => {
  const r = await run(financeEnlisted(), body('E-7'))
  assert.equal(r.sources[0].publicationNumber, 'SYNTHETIC PAM 1')
  assert.equal(r.sources[0].url, 'https://example.army.mil/synthetic.pdf')
  assert.equal(r.sources[0].publicationDate, '2024-07-19')
  assert.ok(r.sources[0].lastChecked)
  const rankSection = r.sections.find(sec => sec.section === 'rank_duties')
  assert.equal(rankSection.pdfPages, '10')
  assert.equal(rankSection.sourceId, r.sources[0].id)
  assert.equal(rankSection.sourceRef, 'S1')
})

test('a grade with no stored section gets no invented rank scope', async () => {
  const r = await run(financeEnlisted(), body('E-9'))
  assert.equal(r.status, 'verified')
  assert.equal(r.rank_specific_expectations, '')
  assert.match(r.rank_note, /gives no separate duties for E-9/)
})

test('Finance officer: O-2 and O-5 resolve to their own bands', async () => {
  const db = fakeSupabase({
    reference_sources: [source({ id: 'src-fo', personnel_category: 'officer' })],
    reference_passages: [
      passage({ source_id: 'src-fo', personnel_category: 'officer', occupation_code: '36A', rank_band: 'O-1..O-3', section_type: 'rank_duties', body: 'Company-grade finance work.' }),
      passage({ source_id: 'src-fo', personnel_category: 'officer', occupation_code: '36A', rank_band: 'O-4..O-5', section_type: 'rank_duties', body: 'Field-grade finance work.' }),
    ],
  })
  const o2 = await run(db, body('O-2', '36A'))
  const o5 = await run(db, body('O-5', '36A'))
  assert.equal(o2.rank_specific_expectations, 'Company-grade finance work.')
  assert.equal(o5.rank_specific_expectations, 'Field-grade finance work.')
})

test('42B at O-2 never receives O-5 scope; 91X at E-7 gets E-7', async () => {
  const db = fakeSupabase({
    reference_sources: [source({ id: 'ag', personnel_category: 'officer' }), source({ id: 'ord', branch: 'Army', personnel_category: 'enlisted' })],
    reference_passages: [
      passage({ source_id: 'ag', personnel_category: 'officer', occupation_code: '42B', rank_band: 'O-1..O-3', section_type: 'rank_duties', body: 'Junior officer tasks.' }),
      passage({ source_id: 'ag', personnel_category: 'officer', occupation_code: '42B', rank_band: 'O-5', section_type: 'rank_duties', body: 'Command-level tasks.' }),
      passage({ source_id: 'ord', occupation_code: '91X', rank_band: 'E-7', section_type: 'rank_duties', body: 'Senior maintenance leader tasks.' }),
    ],
  })
  const o2 = await run(db, body('O-2', '42B'))
  assert.ok(!/Command-level/.test(JSON.stringify(o2)), 'O-2 result must not contain O-5 scope')
  assert.equal(o2.rank_specific_expectations, 'Junior officer tasks.')
  assert.equal((await run(db, body('E-7', '91X'))).rank_specific_expectations, 'Senior maintenance leader tasks.')
})

test('an enlisted grade never reads officer passages for the same code', async () => {
  const db = fakeSupabase({
    reference_sources: [source({ id: 'ag', personnel_category: 'officer' })],
    reference_passages: [passage({ source_id: 'ag', personnel_category: 'officer', occupation_code: '42B', section_type: 'general_duties', body: 'Officer-only text.' })],
  })
  const r = await run(db, body('E-5', '42B'), { aiSuggest: null })
  assert.equal(r.status, 'none')
})

// ── source status and versions ────────────────────────────────────────────────

test('status is verified when recently checked and stale when not', async () => {
  const mk = days => fakeSupabase({ reference_sources: [source({ last_checked_at: daysAgo(days) })], reference_passages: [passage()] })
  assert.equal((await run(mk(30), body('E-5'))).status, 'verified')
  assert.equal((await run(mk(STALE_AFTER_DAYS + 5), body('E-5'))).status, 'stale')
})

test('unreviewed and rejected sources are never served', async () => {
  for (const review_status of ['unreviewed', 'rejected']) {
    clearReferenceCache()
    const db = fakeSupabase({ reference_sources: [source({ review_status })], reference_passages: [passage()] })
    assert.equal((await run(db, body('E-5'))).status, 'none', review_status)
  }
})

test('an approved future-effective source stays hidden until its effective date', async () => {
  const db = fakeSupabase({
    reference_sources: [source({ effective_date: '2026-10-16' })],
    reference_passages: [passage()],
  })
  assert.equal((await run(db, body('E-5'))).status, 'none')
  const effective = await retrieveReference({ supabase: db, body: body('E-5'), now: Date.parse('2026-10-16T00:00:00Z') })
  assert.equal(effective.status, 'verified')
})

test('a revised source supersedes the old one', async () => {
  const db = fakeSupabase({
    reference_sources: [
      source({ id: 'old', superseded_by: 'new', checksum_sha256: 'old-hash' }),
      source({ id: 'new', checksum_sha256: 'new-hash', publication_date: '2025-09-10' }),
    ],
    reference_passages: [
      passage({ source_id: 'old', body: 'Old edition text.' }),
      passage({ source_id: 'new', body: 'New edition text.' }),
    ],
  })
  const r = await run(db, body('E-5'))
  assert.equal(r.duties_and_responsibilities, 'New edition text.')
  assert.equal(r.sources.length, 1)
  assert.equal(r.sources[0].publicationDate, '2025-09-10')
})

test('stale cache: a revised source is never answered from the old cache entry', async () => {
  const tables = { reference_sources: [source({ checksum_sha256: 'v1' })], reference_passages: [passage({ body: 'Edition one.' })] }
  const first = await run(fakeSupabase(tables), body('E-5'))
  assert.equal(first.duties_and_responsibilities, 'Edition one.')
  // Publication re-imported: same source row, new checksum, new text.
  tables.reference_sources = [source({ checksum_sha256: 'v2' })]
  tables.reference_passages = [passage({ body: 'Edition two.' })]
  const second = await run(fakeSupabase(tables), body('E-5'))
  assert.equal(second.duties_and_responsibilities, 'Edition two.')
})

test('cache serves repeat requests without re-reading passages, per rank', async () => {
  const db = financeEnlisted()
  await run(db, body('E-5'))
  const before = db.calls.filter(c => c === 'reference_passages').length
  await run(db, body('E-5'))
  const after = db.calls.filter(c => c === 'reference_passages').length
  assert.equal(after - before, 1, 'repeat hit re-checks which sources apply (1 call) but skips the full passage read')
  const e7 = await run(db, body('E-7'))
  assert.equal(e7.rank_specific_expectations, 'Sergeant First Class: Lead a section.', 'E-5 cache entry is never reused for E-7')
})

test('a broken source is reported as a gap, never papered over with an AI answer', async () => {
  let aiCalled = false
  const db = fakeSupabase({ reference_sources: [source()], reference_passages: [passage()] }, { failing: ['reference_sources'] })
  const r = await run(db, body('E-5'), { aiSuggest: async () => { aiCalled = true; return { duty_title: 'x' } } })
  assert.equal(r.status, 'source_error')
  assert.equal(aiCalled, false)
})

test('registry migration not applied yet: falls back to the legacy row, labeled unverified', async () => {
  const db = fakeSupabase(
    { mos_reference_enlisted: [{ mos_code: '36B', title: 'Legacy title', duties: 'Legacy duties.', goals: 'Legacy goals.' }] },
    { missing: ['reference_passages', 'reference_code_aliases'] },
  )
  const r = await run(db, body('E-5'))
  assert.equal(r.status, 'unverified')
  assert.match(r.document_source, /version not recorded/)
  assert.equal(r.duties_and_responsibilities, 'Legacy duties.')
  assert.equal(r.development_notes, 'Legacy goals.')
  assert.equal(r.key_skills, '', 'a stored "goals" column is not relabeled as skills')
  assert.match(r.rank_note, /not specific to E-5/)
})

// ── exact matching, near-misses, historical codes ────────────────────────────

test('an Army officer code with no exact match is never replaced by a prefix neighbor', async () => {
  let aiCalled = false
  const db = fakeSupabase({
    aoc_reference_officer: [
      { aoc_code: '42A', title: 'Neighbor A', characteristics: 'A text', development: '' },
      { aoc_code: '42B', title: 'Neighbor B', characteristics: 'B text', development: '' },
    ],
  })
  const r = await run(db, body('O-2', '42Z'), { aiSuggest: async () => { aiCalled = true; return null } })
  assert.equal(r.status, 'none')
  assert.equal(r.duties_and_responsibilities, '')
  assert.deepEqual(r.similar.map(s => s.code), ['42A', '42B'])
  assert.equal(aiCalled, false)
})

test('a historical code resolves to the current reference without overwriting the user code', async () => {
  const db = fakeSupabase({
    reference_sources: [source()],
    reference_passages: [passage({ occupation_code: '36B', body: 'Current-code duties.' })],
    reference_code_aliases: [{ branch: 'Army', personnel_category: 'enlisted', historical_code: '73C', current_code: '36B', effective_from: '1990-01-01', effective_to: '2005-09-30', note: null }],
  })
  const r = await run(db, body('E-5', '73C'))
  assert.equal(r.request.occupation, '73C')
  assert.equal(r.duties_and_responsibilities, 'Current-code duties.')
  assert.match(r.codeNote, /73C is a historical code \(1990-01-01 to 2005-09-30\)/)
})

// ── no source: honest labels ─────────────────────────────────────────────────

test('with nothing stored, an AI draft is labeled ai_only and never presented as official', async () => {
  const r = await run(fakeSupabase({}), body('E-3', 'IT', 'Navy'), {
    aiSuggest: async () => ({ duty_title: 'Draft title', duties_and_responsibilities: 'Draft tasks.', key_skills: 'a, b' }),
  })
  assert.equal(r.status, 'ai_only')
  assert.match(r.document_source, /not from an official publication/)
  assert.deepEqual(r.sources, [])
  assert.equal(referencePromptBlock(r), '', 'AI drafts never become authoritative prompt data')
})

test('an AI model is not called when a stored record exists', async () => {
  let aiCalled = false
  const r = await run(financeEnlisted(), body('E-5'), { aiSuggest: async () => { aiCalled = true; return null } })
  assert.equal(r.status, 'verified')
  assert.equal(aiCalled, false)
})

test('no stored record and no usable draft: explain the gap and ask for duties', async () => {
  const r = await run(fakeSupabase({}), body('E-5', 'ZZZ9'), { aiSuggest: async () => null })
  assert.equal(r.status, 'none')
  assert.match(r.message, /Describe your own duties/)
})

// ── prompt block ─────────────────────────────────────────────────────────────

test('prompt block treats reference as typical, not as what the person did', async () => {
  const ref = await run(financeEnlisted(), body('E-7'))
  const unconfirmed = referencePromptBlock(ref)
  assert.match(unconfirmed, /NOT a record of what this person did/)
  assert.match(unconfirmed, /NOT confirmed/)
  assert.match(unconfirmed, /Recommended training \(not proof it was completed\)/)
  assert.match(unconfirmed, /Possible assignments \(not confirmed\)/)
  assert.match(unconfirmed, /\[S1 p\.10\]/, 'each line cites its own source and page')
  assert.match(unconfirmed, /<<<REFERENCE_DATA/)
  assert.match(referencePromptBlock(ref, { confirmed: true }), /CONFIRMED they performed/)
})

// ── components (Active / Reserve / Guard) ────────────────────────────────────

const officerWithComponents = () => fakeSupabase({
  reference_sources: [source({ id: 'fc', personnel_category: 'officer' })],
  reference_passages: [
    passage({ source_id: 'fc', personnel_category: 'officer', occupation_code: '36A', rank_band: null, components: null, section_type: 'general_duties', body: 'Branch-wide text.' }),
    passage({ source_id: 'fc', personnel_category: 'officer', occupation_code: '36A', rank_band: 'O-3', components: 'active', section_type: 'assignments', body: 'Active Captain assignments.' }),
    passage({ source_id: 'fc', personnel_category: 'officer', occupation_code: '36A', rank_band: 'O-1..O-3', components: 'reserve', section_type: 'assignments', body: 'Reserve company-grade assignments.' }),
    passage({ source_id: 'fc', personnel_category: 'officer', occupation_code: '36A', rank_band: 'O-1..O-3', components: 'guard', section_type: 'assignments', body: 'Guard company-grade assignments.' }),
    passage({ source_id: 'fc', personnel_category: 'officer', occupation_code: '36A', rank_band: 'O-1..O-3', components: 'reserve,guard', section_type: 'general_duties', heading: 'RC', body: 'Both Reserve and Guard.' }),
  ],
})
const offBody = (rank, component) => ({ branch: 'Army', mos_afsc: '36A', rank, ...(component ? { component } : {}) })

test('each component gets only its own passages', async () => {
  const db = officerWithComponents()
  const active = await run(db, offBody('O-3', 'active'))
  const reserve = await run(db, offBody('O-3', 'reserve'))
  const guard = await run(db, offBody('O-3', 'guard'))
  assert.match(active.developmental_assignments, /Active Captain/)
  assert.ok(!/Reserve company|Guard company/.test(active.developmental_assignments))
  assert.equal(reserve.developmental_assignments, 'Reserve company-grade assignments.')
  assert.equal(guard.developmental_assignments, 'Guard company-grade assignments.')
  assert.match(reserve.duties_and_responsibilities, /Both Reserve and Guard/)
  assert.match(guard.duties_and_responsibilities, /Both Reserve and Guard/)
  assert.ok(!/Both Reserve and Guard/.test(active.duties_and_responsibilities))
})

test('no component chosen: only passages that apply to every component (the component choice was removed from the app, so no prompt is shown)', async () => {
  const r = await run(officerWithComponents(), offBody('O-3'))
  assert.equal(r.duties_and_responsibilities, 'Branch-wide text.')
  assert.equal(r.developmental_assignments, '')
  assert.equal(r.componentNote, null)
})

test('promotion criteria are stored but never returned or sent to a model', async () => {
  const db = fakeSupabase({
    reference_sources: [source()],
    reference_passages: [
      passage({ body: 'Duties.' }),
      passage({ section_type: 'promotion_criteria', rank_band: 'E-6', body: 'Board selection indicators.' }),
    ],
  })
  const r = await run(db, body('E-6'))
  assert.ok(!JSON.stringify(r).includes('Board selection indicators'))
  assert.ok(!referencePromptBlock(r).includes('Board selection indicators'))
})

// ── every displayed section maps to ITS source ───────────────────────────────

test('with two sources, each section is attributed to the source it came from', async () => {
  const db = fakeSupabase({
    reference_sources: [
      source({ id: 'aaa', publication_number: 'PAM ONE', official_url: 'https://example.army.mil/one.pdf', publication_date: '2024-07-19', last_checked_at: daysAgo(5) }),
      source({ id: 'bbb', publication_number: 'PAM TWO', official_url: 'https://example.army.mil/two.pdf', publication_date: '2025-09-10', last_checked_at: daysAgo(300) }),
    ],
    reference_passages: [
      passage({ source_id: 'aaa', section_type: 'general_duties', body: 'From the first.', pdf_page_start: 7 }),
      passage({ source_id: 'bbb', section_type: 'training', rank_band: 'E-5', body: 'From the second.', pdf_page_start: 12 }),
    ],
  })
  const r = await run(db, body('E-5'))
  const first = r.sections.find(s => s.text === 'From the first.')
  const second = r.sections.find(s => s.text === 'From the second.')
  const srcOf = sec => r.sources.find(s => s.id === sec.sourceId)
  assert.equal(srcOf(first).publicationNumber, 'PAM ONE')
  assert.equal(srcOf(first).url, 'https://example.army.mil/one.pdf')
  assert.equal(first.pdfPages, '7')
  assert.equal(srcOf(second).publicationNumber, 'PAM TWO')
  assert.equal(srcOf(second).url, 'https://example.army.mil/two.pdf')
  assert.equal(second.pdfPages, '12')
  assert.notEqual(first.sourceRef, second.sourceRef)
  assert.equal(srcOf(first).status, 'verified')
  assert.equal(srcOf(second).status, 'stale', 'status is reported per source')
  assert.equal(r.status, 'stale', 'overall status is the worst of its sources')
  const block = referencePromptBlock(r)
  assert.match(block, new RegExp(`\\[${first.sourceRef} p\\.7\\].*From the first`))
  assert.match(block, new RegExp(`\\[${second.sourceRef} p\\.12\\].*From the second`))
})

test('a source that contributes no displayed section is not reported', async () => {
  const db = fakeSupabase({
    reference_sources: [source({ id: 'aaa' }), source({ id: 'bbb', publication_number: 'UNUSED' })],
    reference_passages: [
      passage({ source_id: 'aaa', body: 'Used.' }),
      passage({ source_id: 'bbb', section_type: 'training', rank_band: 'E-9', body: 'Not for E-5.' }),
    ],
  })
  const r = await run(db, body('E-5'))
  assert.deepEqual(r.sources.map(s => s.publicationNumber), ['SYNTHETIC PAM 1'])
})

// ── client guards ────────────────────────────────────────────────────────────

test('out-of-order responses: only the newest ticket may write state', () => {
  const g = makeLatestGuard()
  const slow = g.next()
  const fast = g.next()
  assert.equal(g.isCurrent(slow), false)
  assert.equal(g.isCurrent(fast), true)
  g.invalidate() // inputs changed while `fast` was still in flight
  assert.equal(g.isCurrent(fast), false)
})

test('duplicate submit: a second click while one is running does nothing', async () => {
  const run1 = makeSingleFlight()
  let calls = 0
  const work = async () => { calls++; await new Promise(r => setTimeout(r, 10)); return 'done' }
  const [a, b] = await Promise.all([run1(work), run1(work)])
  assert.equal(calls, 1)
  assert.equal(a, 'done')
  assert.equal(b, undefined)
  assert.equal(await run1(work), 'done', 'usable again once the first run finishes')
})

// ── DA PAM 611-21 code status (rescinded / future-effective / special codes) ─────────────────

test('a rescinded enlisted MOS (15E) gets no current reference and says why, with the page', async () => {
  let aiCalled = false
  const db = fakeSupabase({ mos_reference_enlisted: [{ mos_code: '15E', title: 'Legacy 15E row', duties: 'Legacy duties.' }] })
  const r = await run(db, body('E-5', '15E'), { aiSuggest: async () => { aiCalled = true; return { duty_title: 'x' } } })
  assert.equal(r.status, 'historical')
  assert.match(r.message, /rescinded effective October 2026/)
  assert.match(r.message, /DA PAM 611-21, ch\. 10c, PDF p\. 81/)
  assert.match(r.message, /still use it to describe past service/)
  assert.deepEqual(r.sections, [])
  assert.equal(aiCalled, false)
  assert.equal(db.calls.length, 0, 'the stored table is not even consulted for a code that is not in force')
})

test('the same code string in another category is judged separately (officer 92A rescinded, enlisted 92A not)', async () => {
  const off = await run(fakeSupabase({}), body('O-3', '92A'), { aiSuggest: null })
  assert.equal(off.status, 'historical')
  assert.match(off.message, /Logistics branch \(90\) effective October 2026/)
  const enl = await run(fakeSupabase({}), body('E-5', '92A'), { aiSuggest: null })
  assert.notEqual(enl.status, 'historical')
})

test('a future-effective MOS (79S) is not shown as current', async () => {
  const r = await run(fakeSupabase({}), body('E-6', '79S'), { aiSuggest: null })
  assert.equal(r.status, 'future_effective')
  assert.match(r.message, /takes effect October 2027/)
})

test('special reporting and immaterial codes are explained as such', async () => {
  const src = await run(fakeSupabase({}), body('E-7', '00D'), { aiSuggest: null })
  assert.equal(src.status, 'special_code')
  assert.match(src.message, /special reporting code/)
  const imm = await run(fakeSupabase({}), body('E-8', '00M'), { aiSuggest: null })
  assert.match(imm.message, /MOS-immaterial/)
})

test('a current code with a scheduled change still returns normally, with the change noted', async () => {
  const r = await run(fakeSupabase({}), { branch: 'Army', mos_afsc: '420T', rank: 'W-3' }, { aiSuggest: null })
  assert.equal(r.status, 'none')
  assert.match(r.codeNote, /change to 420T takes effect October 2027/)
})

test('other branches are not affected by Army code status', async () => {
  const r = await run(fakeSupabase({}), body('E-5', '15E', 'Navy'), { aiSuggest: null })
  assert.notEqual(r.status, 'historical')
})
