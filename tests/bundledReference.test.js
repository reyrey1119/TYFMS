// The reference data that ships with the app (DA PAM 611-21 and the three reviewed career guides), end to end:
//   * the shipped data is exactly the reviewed data (fingerprints),
//   * a MOS/AOC + rank alone produces a translation from the official publication, with the personal-duties field EMPTY,
//   * optional personal bullets and uploaded records add personalization, kept apart from the publication text,
//   * resumes keep SPECIALTY SCOPE ([CONFIRM], from the publication) apart from YOUR ACCOMPLISHMENTS,
//   * coverage of every current Army code is measured, and the exact gaps are pinned so a change must be deliberate.
//
// The model is stubbed. The stub quotes real sentences out of the prompt's REFERENCE_DATA block, so the server's
// provenance check runs against real publication text. Nothing here touches the network.

import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { retrieveReference, clearReferenceCache } from '../api/_lib/milReference.js'
import { bundleContentHash } from '../scripts/lib/bundleSql.js'
import { buildStore } from '../scripts/build-reference-store.js'
import { REFERENCE_STORE_SOURCES } from '../api/_lib/referenceStore.data.js'
import { markScopeBullets, unmarkedScopeBullets } from '../api/_lib/scopeMarkers.js'
import { buildReconciliation, renderMarkdown, loadReconciliationBundles } from '../scripts/reconcile-imported-coverage.js'

const NOW = Date.parse('2026-10-16T12:00:00Z')
const root = new URL('../', import.meta.url)
const inventory = JSON.parse(await readFile(new URL('data/reference/corpus/army-code-inventory.json', root), 'utf8'))
const approvals = JSON.parse(await readFile(new URL('data/reference/approvals.json', root), 'utf8')).approvals

const realFetch = globalThis.fetch
const realEnv = { ...process.env }
let modelCalls
const mockRes = () => ({ code: 200, body: null, status(c) { this.code = c; return this }, json(b) { this.body = b; return this } })
const mockReq = body => ({ method: 'POST', headers: {}, socket: { remoteAddress: '203.0.113.9' }, body })
const promptOf = call => call.messages[0].content
const translate = async () => (await import('../api/translate.js')).default
const resume = async () => (await import('../api/resume.js')).default

beforeEach(() => {
  modelCalls = []
  clearReferenceCache()
  process.env.ANTHROPIC_API_KEY = 'test-key-not-real'
  for (const k of ['SUPABASE_URL', 'VITE_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_SERVICE_KEY', 'SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY']) delete process.env[k]
})
afterEach(() => { globalThis.fetch = realFetch; process.env = { ...realEnv } })

// A stub model that behaves like a faithful writer: it quotes `nPublication` sentences from the REFERENCE_DATA block
// and `personal` quotes from the person's own text. `reply` can override entries to test the server's checks.
function stubModel({ nPublication = 3, personalQuotes = [], extraEntries = [] } = {}) {
  globalThis.fetch = async (url, opts) => {
    if (!String(url).includes('api.anthropic.com')) return realFetch(url, opts)
    const body = JSON.parse(opts.body)
    modelCalls.push(body)
    const prompt = promptOf(body)
    const block = (prompt.match(/<<<REFERENCE_DATA\n([\s\S]*?)\nREFERENCE_DATA>>>/) || [])[1] || ''
    const lines = block.split('\n').filter(l => /^\[S\d/.test(l))
    const entries = []
    for (const l of lines.slice(0, nPublication)) {
      const text = l.replace(/^\[[^\]]*\](?:\s*\[[^\]]*\])?\s*[^:]*:\s*/, '')
      const words = text.split(/\s+/).filter(Boolean)
      if (words.length < 8) continue
      entries.push({ basis: 'publication', evidence: words.slice(0, 12).join(' '), militarySkill: words.slice(0, 6).join(' '), civilianEquivalent: 'civilian description', civilianFunctions: ['f'], verify: 'Check whether you performed this.' })
    }
    for (const q of personalQuotes) entries.push({ basis: 'personal', evidence: q, militarySkill: q, civilianEquivalent: 'civilian description of ' + q, civilianFunctions: ['f'], verify: 'v' })
    entries.push(...extraEntries)
    const reply = JSON.stringify({ civilianTitles: ['t'], transferableSkills: ['s'], careerPaths: [], targetIndustries: [], identityTip: 't', civilianTranslation: entries, certifications: [] })
    return { json: async () => ({ content: [{ type: 'text', text: /Respond ONLY with valid JSON/.test(prompt) ? reply : 'RESUME TEXT' }] }) }
  }
}

// ── the shipped data is the reviewed data ─────────────────────────────────────────────────────

test('every shipped source has a review record whose fingerprint matches its bundle', async () => {
  assert.ok(approvals.length >= 6)
  for (const a of approvals) {
    const bundle = JSON.parse(await readFile(new URL(`data/reference/bundles/${a.manifest_id}.bundle.json`, root), 'utf8'))
    assert.equal(bundleContentHash(bundle), a.fingerprint, `${a.manifest_id} changed after review`)
    assert.ok(a.reviewer && /Rey Rodriguez/.test(a.reviewer), 'the reviewer and authorizer are recorded')
    assert.ok(a.method && a.scope, 'what was reviewed is recorded')
    const shipped = REFERENCE_STORE_SOURCES.find(s => s.id === bundle.source.id)
    assert.equal(shipped.content_sha256, a.fingerprint)
    assert.equal(shipped.review_status, 'approved')
  }
})

test('api/_lib/referenceStore.data.js is exactly what the approvals and bundles produce', async () => {
  const committed = await readFile(new URL('api/_lib/referenceStore.data.js', root), 'utf8')
  assert.equal(committed, await buildStore(), 'run: node scripts/build-reference-store.js')
})

test('the shipped DA PAM 611-21 sources carry the publication date, official URL and checksum', () => {
  const s = REFERENCE_STORE_SOURCES.filter(x => x.publication_number === 'DA PAM 611-21')
  assert.equal(s.length, 3)
  for (const x of s) {
    assert.equal(x.publication_date, '2025-11-01')
    assert.match(x.official_url, /^https:\/\/api\.army\.mil\//)
    assert.match(x.checksum_sha256, /^[0-9a-f]{64}$/)
    assert.match(x.notes, /LIMITATIONS:/)
  }
})

// ── rank + MOS/AOC alone is enough ────────────────────────────────────────────────────────────

const CASES = [
  ['Army', '25B', 'E-6'], ['Army', '42A', 'E-5'], ['Army', '11B', 'E-8'], ['Army', '92Y', 'E-4'],
  ['Army', '17A', 'O-3'], ['Army', '36A', 'O-4'], ['Army', '63N', 'O-4'],
  ['Army', '170A', 'W-3'], ['Army', '351L', 'W-4'], ['Army', '270A', 'W-2'],
]

for (const [branch, mos, rank] of CASES) {
  test(`${mos} at ${rank}: translation from the official publication with the personal-duties field EMPTY`, async () => {
    stubModel()
    const res = mockRes()
    await (await translate())(mockReq({ action: 'translate', branch, mos, rank, milDuties: '' }), res)
    assert.equal(res.code, 200, JSON.stringify(res.body))
    assert.equal(modelCalls.length, 1)
    const prompt = promptOf(modelCalls[0])
    assert.match(prompt, /<<<REFERENCE_DATA/, 'the official text for this specialty and grade is in the prompt')
    assert.match(prompt, /DA PAM 611-21/)
    assert.ok(!/No reviewed, recently checked reference is available/.test(prompt))
    const t = res.body.civilianTranslation
    assert.ok(t.length >= 1 && t.every(e => e.basis === 'publication'), 'with no personal details every entry is the publication, never the person')
    assert.ok(t.every(e => e.source?.publication && e.evidence), 'each entry says where it comes from')
    assert.equal(res.body.translationBasis.personal, 0)
    assert.equal(res.body.referenceStatus, 'verified')
  })
}

test('a rank selects its own text: E-5 and E-8 of the same MOS get different official sections', async () => {
  const a = await retrieveReference({ supabase: null, now: NOW, body: { branch: 'Army', mos_afsc: '25B', rank: 'E-5' } })
  clearReferenceCache()
  const b = await retrieveReference({ supabase: null, now: NOW, body: { branch: 'Army', mos_afsc: '25B', rank: 'E-7' } })
  const own = r => r.sections.filter(s => s.section === 'rank_duties' && !s.includedForLowerLevel).map(s => s.rankBand)
  assert.deepEqual(own(a), ['E-5'])
  assert.deepEqual(own(b), ['E-7'])
  assert.notEqual(a.rank_specific_expectations, b.rank_specific_expectations)
})

test('a rank the publication gives no text for says so instead of inventing scope', async () => {
  const r = await retrieveReference({ supabase: null, now: NOW, body: { branch: 'Army', mos_afsc: '919A', rank: 'W-3' } })
  assert.equal(r.status, 'none')
  assert.match(r.message, /gives no duties text for W-3/)
  const res = mockRes()
  stubModel()
  await (await translate())(mockReq({ action: 'translate', branch: 'Army', mos: '919A', rank: 'W-3' }), res)
  assert.equal(res.code, 422, 'no reference and no personal details: ask for them, never call the model')
  assert.equal(modelCalls.length, 0)
})

test('cumulative skill-level text brings the lower level along, with the lower level marked as included for it', async () => {
  const r = await retrieveReference({ supabase: null, now: NOW, body: { branch: 'Army', mos_afsc: '35F', rank: 'E-6' } })
  const own = r.sections.find(s => s.rankBand === 'E-6')
  const lower = r.sections.filter(s => s.includedForLowerLevel)
  assert.ok(own && lower.length >= 1)
  assert.ok(lower.every(s => s.rankBand !== 'E-6'))
})

test('a specification that takes effect on a stated date applies only from that date (92Y)', async () => {
  const before = await retrieveReference({ supabase: null, now: Date.parse('2026-01-15T00:00:00Z'), body: { branch: 'Army', mos_afsc: '92Y', rank: 'E-5' } })
  clearReferenceCache()
  const after = await retrieveReference({ supabase: null, now: NOW, body: { branch: 'Army', mos_afsc: '92Y', rank: 'E-5' } })
  const e5 = r => r.sections.filter(s => s.section === 'rank_duties' && s.rankBand === 'E-5' && !s.includedForLowerLevel)
  assert.equal(e5(before).length, 1)
  assert.equal(e5(after).length, 1)
  assert.notEqual(e5(before)[0].text, e5(after)[0].text)
})

test('officer AOCs are described in general, with the authorized grade range and an honest note', async () => {
  const r = await retrieveReference({ supabase: null, now: NOW, body: { branch: 'Army', mos_afsc: '17A', rank: 'O-3' } })
  assert.equal(r.status, 'verified')
  assert.match(r.rank_note, /rather than grade by grade/)
  assert.match(r.rank_note, /O-2 to O-6/)
  clearReferenceCache()
  const low = await retrieveReference({ supabase: null, now: NOW, body: { branch: 'Army', mos_afsc: '17A', rank: 'O-1' } })
  assert.match(low.rank_note, /outside the grades DA PAM 611-21 lists/)
})

test('rescinded, special and uncovered codes never get a made-up specialty reference', async () => {
  for (const code of ['00D', '15E']) {
    clearReferenceCache()
    const r = await retrieveReference({ supabase: null, now: NOW, body: { branch: 'Army', mos_afsc: code, rank: 'E-5' } })
    assert.ok(!r.sections.length && r.status !== 'verified', code)
  }
})

// ── optional personal bullets and uploaded records improve personalization ────────────────────

test('personal bullets add personal entries, kept separate from the publication entries', async () => {
  const mine = 'I trained twelve new radio operators on antenna setup'
  stubModel({ personalQuotes: [mine] })
  const res = mockRes()
  await (await translate())(mockReq({ action: 'translate', branch: 'Army', mos: '25B', rank: 'E-6', milDuties: mine + '.' }), res)
  assert.equal(res.code, 200)
  const t = res.body.civilianTranslation
  assert.ok(t.some(e => e.basis === 'personal' && e.from === 'what you described'))
  assert.ok(t.some(e => e.basis === 'publication'))
  assert.equal(res.body.translationBasis.personal, 1)
  assert.match(promptOf(modelCalls[0]), /at least half of the entries must be basis "personal"/)
})

test('uploaded Vault records personalize the result without the person retyping them', async () => {
  const record = 'NCOER: Led the battalion communications section through two field exercises and a certification inspection.'
  stubModel({ personalQuotes: ['Led the battalion communications section through two field exercises'] })
  const res = mockRes()
  await (await translate())(mockReq({ action: 'translate', branch: 'Army', mos: '25B', rank: 'E-6', milDuties: '', vaultContext: record }), res)
  assert.equal(res.code, 200)
  const mineEntries = res.body.civilianTranslation.filter(e => e.basis === 'personal')
  assert.equal(mineEntries.length, 1)
  assert.equal(mineEntries[0].from, 'your uploaded records')
  assert.equal(res.body.translationBasis.usedUploadedRecords, true)
  assert.match(promptOf(modelCalls[0]), /Led the battalion communications section/)
})

test('an entry whose quote is in neither the publication nor the person\'s words is dropped', async () => {
  stubModel({ nPublication: 1, extraEntries: [{ basis: 'personal', evidence: 'Managed a multimillion dollar budget for the brigade', militarySkill: 'x', civilianEquivalent: 'y', civilianFunctions: [], verify: 'v' }] })
  const res = mockRes()
  await (await translate())(mockReq({ action: 'translate', branch: 'Army', mos: '25B', rank: 'E-6' }), res)
  assert.equal(res.code, 200)
  assert.ok(res.body.civilianTranslation.every(e => !/budget/i.test(e.militarySkill + e.evidence)))
  assert.equal(res.body.translationBasis.discarded, 1)
})

test('a person-labelled entry cannot be built from the publication text, and the reverse', async () => {
  // The model claims "personal" for words that only the publication contains: the server relabels by where the words are.
  stubModel({ nPublication: 0 })
  const ref = await retrieveReference({ supabase: null, now: NOW, body: { branch: 'Army', mos_afsc: '25B', rank: 'E-6' } })
  const quote = ref.sections.find(s => s.section === 'rank_duties').text.split(/\s+/).slice(0, 12).join(' ')
  globalThis.fetch = async (url, opts) => {
    modelCalls.push(JSON.parse(opts.body))
    return { json: async () => ({ content: [{ type: 'text', text: JSON.stringify({ civilianTranslation: [{ basis: 'personal', evidence: quote, militarySkill: 'm', civilianEquivalent: 'c', civilianFunctions: [], verify: 'v' }], certifications: [] }) }] }) }
  }
  const res = mockRes()
  await (await translate())(mockReq({ action: 'translate', branch: 'Army', mos: '25B', rank: 'E-6' }), res)
  assert.equal(res.code, 200)
  assert.equal(res.body.civilianTranslation[0].basis, 'publication', 'the person did not write it, so it is never labeled as theirs')
})

test('if nothing the model wrote can be traced, the server refuses rather than showing ungrounded text', async () => {
  globalThis.fetch = async (url, opts) => { modelCalls.push(JSON.parse(opts.body)); return { json: async () => ({ content: [{ type: 'text', text: JSON.stringify({ civilianTranslation: [{ basis: 'publication', evidence: 'made up words that appear nowhere', militarySkill: 'x', civilianEquivalent: 'y' }] }) }] }) } }
  const res = mockRes()
  await (await translate())(mockReq({ action: 'translate', branch: 'Army', mos: '25B', rank: 'E-6' }), res)
  assert.equal(res.code, 502)
})

test('a reply that is cut off or not JSON is retried once, then fails cleanly', async () => {
  let n = 0
  const good = JSON.stringify({ civilianTranslation: [], certifications: [] })
  globalThis.fetch = async (url, opts) => { n++; modelCalls.push(JSON.parse(opts.body)); return { json: async () => ({ stop_reason: 'max_tokens', content: [{ type: 'text', text: '{"civilianTitles":["a"' }] }) } }
  const res = mockRes()
  await (await translate())(mockReq({ action: 'translate', branch: 'Army', mos: '25B', rank: 'E-6' }), res)
  assert.equal(res.code, 500)
  assert.equal(n, 2, 'one retry, not a loop')
  assert.ok(modelCalls.every(c => c.max_tokens >= 4000), 'room for the quotes')
})

test('if nothing in the first reply can be traced, the model is asked once more before giving up', async () => {
  const ref = await retrieveReference({ supabase: null, now: NOW, body: { branch: 'Army', mos_afsc: '25B', rank: 'E-6' } })
  const quote = ref.sections.find(s => s.section === 'rank_duties').text.split(/\s+/).slice(0, 12).join(' ')
  const replies = [
    { civilianTranslation: [{ basis: 'publication', evidence: 'words that appear nowhere in the publication', militarySkill: 'x', civilianEquivalent: 'y' }] },
    { civilianTranslation: [{ basis: 'publication', evidence: quote, militarySkill: 'x', civilianEquivalent: 'y' }], certifications: [] },
  ]
  let n = 0
  globalThis.fetch = async (url, opts) => { modelCalls.push(JSON.parse(opts.body)); return { json: async () => ({ content: [{ type: 'text', text: JSON.stringify(replies[Math.min(n++, 1)]) }] }) } }
  const res = mockRes()
  await (await translate())(mockReq({ action: 'translate', branch: 'Army', mos: '25B', rank: 'E-6' }), res)
  assert.equal(res.code, 200)
  assert.equal(n, 2)
  assert.equal(res.body.civilianTranslation.length, 1)
})

// ── resumes keep scope and accomplishments apart ──────────────────────────────────────────────

test('quick resume: publication entries become SPECIALTY SCOPE, personal ones become YOUR ACCOMPLISHMENTS, and the server re-checks the labels', async () => {
  const ref = await retrieveReference({ supabase: null, now: NOW, body: { branch: 'Army', mos_afsc: '25B', rank: 'E-6' } })
  const sec = ref.sections.find(s => s.section === 'rank_duties')
  const pubQuote = sec.text.split(/\s+/).slice(0, 12).join(' ')
  const mine = 'I trained twelve new radio operators on antenna setup'
  globalThis.fetch = async (url, opts) => { modelCalls.push(JSON.parse(opts.body)); return { json: async () => ({ content: [{ type: 'text', text: 'PROFESSIONAL EXPERIENCE\nSPECIALTY SCOPE (x)\n• Sets up networks\nYOUR ACCOMPLISHMENTS\n• Trained operators\nEDUCATION' }] }) } }
  const res = mockRes()
  await (await translate())(mockReq({
    action: 'resume', branch: 'Army', mos: '25B', rank: 'E-6', milDuties: mine,
    civilianTranslation: [
      { basis: 'personal', evidence: pubQuote, militarySkill: 'Pub skill relabeled as personal', civilianEquivalent: 'civ' },   // relabel attempt
      { basis: 'personal', evidence: mine, militarySkill: 'Trained operators', civilianEquivalent: 'civ2' },
    ],
  }), res)
  assert.equal(res.code, 200)
  const prompt = promptOf(modelCalls[0])
  const scope = prompt.match(/SPECIALTY SCOPE ENTRIES[^\n]*\n([\s\S]*?)\n\nACCOMPLISHMENT ENTRIES/)[1]
  const accomplishments = prompt.match(/ACCOMPLISHMENT ENTRIES[^\n]*\n([\s\S]*?)\n\nCivilian profile/)[1]
  assert.match(scope, /Pub skill relabeled as personal/, 'text found only in the publication is scope, whatever the browser claimed')
  assert.ok(!/Pub skill relabeled/.test(accomplishments))
  assert.match(accomplishments, /Trained operators/)
  assert.equal(unmarkedScopeBullets(res.body.resume), 0, 'every scope bullet is marked [CONFIRM] even if the model forgot')
  assert.match(res.body.resume, /• \[CONFIRM\] Sets up networks/)
  assert.match(res.body.resume, /YOUR ACCOMPLISHMENTS\n• Trained operators/)
})

test('full resume builder with a reference: two-part experience entry, scope marked [CONFIRM], official title on the position line', async () => {
  globalThis.fetch = async (url, opts) => { modelCalls.push(JSON.parse(opts.body)); return { json: async () => ({ content: [{ type: 'text', text: 'PROFESSIONAL EXPERIENCE\nSPECIALTY SCOPE (from DA PAM 611-21)\n• Operates systems\n• [CONFIRM] Supervises teams\nYOUR ACCOMPLISHMENTS (only what you told us)\n• [ADD: a task you performed]\nEDUCATION' }] }) } }
  const res = mockRes()
  await (await resume())(mockReq({ branch: 'Army', mos: '25B', rank: 'E-6', yos: '10', milDuties: '' }), res)
  assert.equal(res.code, 200)
  const prompt = promptOf(modelCalls[0])
  assert.match(prompt, /<<<REFERENCE_DATA/)
  assert.match(prompt, /SPECIALTY SCOPE \(from DA PAM 611-21/)
  assert.match(prompt, /YOUR ACCOMPLISHMENTS \(only what you told us or your records show\)/)
  assert.match(prompt, /Never move a SPECIALTY SCOPE line into YOUR ACCOMPLISHMENTS/)
  assert.match(prompt, /Information Technology Specialist/, 'the official title is on the position line')
  assert.equal(res.body.hasSpecialtyScope, true)
  assert.equal(unmarkedScopeBullets(res.body.resume), 0)
})

test('full resume builder without a reference keeps the old single-part entry', async () => {
  globalThis.fetch = async (url, opts) => { modelCalls.push(JSON.parse(opts.body)); return { json: async () => ({ content: [{ type: 'text', text: 'resume' }] }) } }
  const res = mockRes()
  await (await resume())(mockReq({ branch: 'Army', mos: '00D', rank: 'E-6' }), res)
  assert.equal(res.code, 200)
  assert.ok(!/SPECIALTY SCOPE/.test(promptOf(modelCalls[0])))
  assert.equal(res.body.hasSpecialtyScope, false)
})

test('scope bullets get [CONFIRM] added if the model leaves it off; accomplishments are untouched', () => {
  const out = markScopeBullets('SPECIALTY SCOPE (x)\n• one\n- two\nYOUR ACCOMPLISHMENTS\n• mine\nEDUCATION\n• not touched')
  assert.equal(out, 'SPECIALTY SCOPE (x)\n• [CONFIRM] one\n- [CONFIRM] two\nYOUR ACCOMPLISHMENTS\n• mine\nEDUCATION\n• not touched')
})

// ── coverage of every current Army code, measured ─────────────────────────────────────────────

const current = cat => inventory.codes.filter(c => c.category === cat && c.status === 'current')

async function lookup(mos, rank) {
  clearReferenceCache()
  return retrieveReference({ supabase: null, now: NOW, body: { branch: 'Army', mos_afsc: mos, rank } })
}

test('every current enlisted MOS has an official description, and each stored skill level answers at its own grade', async () => {
  const none = []
  for (const c of current('enlisted')) {
    let found = false
    for (const g of ['E-4', 'E-5', 'E-6', 'E-7', 'E-8', 'E-9']) { const r = await lookup(c.code, g); if (r.status === 'verified') { found = true; if (r.sections.some(s => s.rankBand && s.section === 'rank_duties')) continue } }
    if (!found) none.push(c.code)
  }
  assert.deepEqual(none, [], 'current enlisted MOS with no official description')
  // Grade-level answers: the grade of every stored skill level returns that skill level's own text.
  const bundle = JSON.parse(await readFile(new URL('data/reference/bundles/army-611-21-enlisted-ch10c.bundle.json', root), 'utf8'))
  const SL = { 1: 'E-4', 2: 'E-5', 3: 'E-6', 4: 'E-7', 5: 'E-8', 6: 'E-9' }
  let checked = 0
  for (const c of current('enlisted')) {
    const levels = [...new Set(bundle.passages.filter(p => p.occupation_code === c.code && p.skill_level && (!p.effective_to || p.effective_to > '2026-10-16') && (!p.effective_from || p.effective_from <= '2026-10-16')).map(p => p.skill_level))]
    for (const lv of levels) { const r = await lookup(c.code, SL[lv]); assert.ok(r.sections.some(s => s.skillLevel === lv && !s.includedForLowerLevel), `${c.code} ${SL[lv]}`); checked++ }
  }
  assert.ok(checked > 450, `only ${checked} skill levels checked`)
})

test('every current warrant specialty answers at each grade in its range, except the pinned cross-reference gaps', async () => {
  const gaps = []
  for (const c of current('warrant')) {
    // 280A, 390A and 490B are in the specifications but not in the (older) structure chart, so they have no listed range: W-2..W-5.
    const [lo, hi] = (c.grades || 'W-2..W-5').split('..').map(x => +x.split('-')[1])
    for (let n = lo; n <= hi; n++) { const r = await lookup(c.code, `W-${n}`); if (r.status !== 'verified' || !r.sections.some(s => s.rankBand)) gaps.push(`${c.code}@W-${n}`) }
  }
  // The publication gives no duties text of its own for these: 351Y (only "(see AR 614-115)"), 915E CW4 ("see feeder MOS
  // qualifications"), 919A CW3 ("See MOS 915T"), 948E CW2-CW4 is outside its listed range (W-5 only).
  assert.deepEqual(gaps, ['351Y@W-2', '351Y@W-3', '351Y@W-4', '351Y@W-5', '915E@W-4', '919A@W-3'])
})

test('officer AOCs: exactly these current AOCs have no description in any imported publication (pinned; a change must be deliberate)', async () => {
  const none = []
  for (const c of current('officer')) { const r = await lookup(c.code, 'O-3'); if (r.status !== 'verified') none.push(c.code) }
  assert.deepEqual(none, ['17X', '37X', '38X', '46X', '48X', '49W', '49X', '56X', '64Z', '65X'])   // 8 designation-only codes + 2 AOC-immaterial position codes (64Z, 65X)
  assert.equal(current('officer').length - none.length, 179)
})

test('shipped data covers the counts the report states', () => {
  assert.equal(current('enlisted').length, 178)
  assert.equal(current('warrant').length, 75)
  assert.equal(current('officer').length, 189)
})

test('publication-only resume: the summary and competencies are marked as written from the role description', async () => {
  globalThis.fetch = async (url, opts) => { modelCalls.push(JSON.parse(opts.body)); return { json: async () => ({ content: [{ type: 'text', text: 'resume' }] }) } }
  const res = mockRes()
  await (await resume())(mockReq({ branch: 'Army', mos: '25B', rank: 'E-6' }), res)
  assert.match(promptOf(modelCalls[0]), /PUBLICATION-ONLY DRAFT/)
  modelCalls.length = 0
  await (await resume())(mockReq({ branch: 'Army', mos: '25B', rank: 'E-6', milDuties: 'I trained twelve new radio operators.' }), mockRes())
  assert.ok(!/PUBLICATION-ONLY DRAFT/.test(promptOf(modelCalls[0])), 'with the person\'s own details the summary may use them')
})

// ── every code in the register is imported or explained ───────────────────────────────────────

const bundleOf = async id => JSON.parse(await readFile(new URL(`data/reference/bundles/${id}.bundle.json`, root), 'utf8'))

test('every code in the register has an imported description or a documented exception, and the committed reconciliation is current', async () => {
  const bundles = await loadReconciliationBundles(f => readFile(new URL(f, root), 'utf8'))
  const r = buildReconciliation(inventory, bundles)
  assert.deepEqual(r.unaccounted, [], 'codes that are neither imported nor explained')
  assert.equal(await readFile(new URL('data/reference/corpus/coverage-reconciliation.json', root), 'utf8'), JSON.stringify(r, null, 1) + '\n', 'run: node scripts/reconcile-imported-coverage.js')
  assert.equal(await readFile(new URL('data/reference/corpus/coverage-reconciliation.md', root), 'utf8'), renderMarkdown(r))
  const c = r.categories
  // the numbers the report states
  assert.deepEqual([c.enlisted.register, c.warrant.register, c.officer.register], [212, 84, 217])
  assert.deepEqual([c.enlisted.imported_description, c.warrant.imported_description, c.officer.imported_description], [178, 74, 179])
  assert.equal(c.enlisted.imported_codes_not_in_register.length + c.warrant.imported_codes_not_in_register.length + c.officer.imported_codes_not_in_register.length, 0)
  // register = specification headings + reporting/status codes defined in other chapters
  assert.equal(c.enlisted.codes_with_any_import, 194)
  assert.equal(c.warrant.codes_with_any_import, 74)
  assert.equal(c.officer.codes_with_any_import, 184)
})

// ── the translator, personal-duties field empty, no Vault: every code at every grade ──────────

const GRADES = { enlisted: [1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `E-${n}`), warrant: [1, 2, 3, 4, 5].map(n => `W-${n}`), officer: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => `O-${n}`) }
const bandHas = (band, rank) => {
  if (!band) return true
  const n = +rank.split('-')[1]
  return band.split(',').some(part => { const [lo, hi] = part.split('..').map(x => +x.split('-')[1]); return n >= lo && n <= (hi ?? lo) })
}
const squashT = x => String(x).toLowerCase().replace(/[^a-z0-9]+/g, '')

test('EXHAUSTIVE: every current code at every grade, empty duties and no Vault, gets only its own code\'s official text for that grade', async () => {
  const bundles = { enlisted: await bundleOf('army-611-21-enlisted-ch10c'), warrant: await bundleOf('army-611-21-warrant-ch8b'), officer: await bundleOf('army-611-21-officer-ch3') }
  const guides = (await readdir(new URL('data/reference/bundles/', root))).filter(f => /^army-600-25-.*\.bundle\.json$/.test(f)).map(f => f.replace(/\.bundle\.json$/, ''))
  const pilot = [await bundleOf('army-cmf42-dapam600-25-2025-09-30'), await bundleOf('army-cmf36-dapam600-25-2024-07-19'), await bundleOf('army-fc-officer-2025-09-10'), await bundleOf('army-600-4-20220223-medical-service-corps'), ...await Promise.all(guides.map(bundleOf))]
  const pilotFor = cat => pilot.flatMap(b => b.passages).filter(p => p.personnel_category === cat)
  const byCode = {}
  for (const cat of Object.keys(bundles)) { byCode[cat] = new Map(); for (const p of [...bundles[cat].passages, ...pilotFor(cat)]) { if (!byCode[cat].has(p.occupation_code)) byCode[cat].set(p.occupation_code, []); byCode[cat].get(p.occupation_code).push(p) } }
  const handler = await translate()
  const stats = { calls: 0, translated: 0, askedForDetails: 0, generalOnly: 0, withGradeText: 0 }
  const problems = []
  let lastPrompt = ''
  globalThis.fetch = async (url, opts) => {
    const body = JSON.parse(opts.body); lastPrompt = promptOf(body)
    const block = (lastPrompt.match(/<<<REFERENCE_DATA\n([\s\S]*?)\nREFERENCE_DATA>>>/) || [])[1] || ''
    const lines = block.split(/\n(?=\[S\d)/).filter(l => /^\[S\d/.test(l))
    const words = lines[0].replace(/^\[[^\]]*\](?:\s*\[[^\]]*\])?\s*[^:]*:\s*/, '').split(/\s+/).slice(0, 12).join(' ')
    return { json: async () => ({ content: [{ type: 'text', text: JSON.stringify({ civilianTranslation: [{ basis: 'publication', evidence: words, militarySkill: 'm', civilianEquivalent: 'c', civilianFunctions: [], verify: 'v' }], certifications: [] }) }] }) }
  }
  for (const cat of ['enlisted', 'warrant', 'officer']) {
    for (const row of inventory.codes.filter(c => c.category === cat && c.status === 'current')) {
      const mine = byCode[cat].get(row.code) || []
      for (const rank of GRADES[cat]) {
        stats.calls++
        const res = mockRes()
        lastPrompt = ''
        await handler(mockReq({ action: 'translate', branch: 'Army', mos: row.code, rank, milDuties: '', vaultContext: '' }), res)
        const where = `${row.code}@${rank}`
        // what the register says should be available at this grade, as of the test date
        const live = mine.filter(p => !p.components && (!p.effective_from || p.effective_from <= '2026-10-16') && (!p.effective_to || p.effective_to > '2026-10-16'))
        const haveGradeText = live.some(p => p.section_type === 'rank_duties' && bandHas(p.rank_band, rank))
        const haveGeneral = live.some(p => p.section_type === 'general_duties')
        if (res.code === 422) {
          stats.askedForDetails++
          if (haveGradeText || haveGeneral) problems.push(`${where}: asked for details although the publication has text`)
          continue
        }
        if (res.code !== 200) { problems.push(`${where}: HTTP ${res.code}`); continue }
        stats.translated++
        if (!haveGradeText && !haveGeneral) { problems.push(`${where}: translated with no official text`); continue }
        const lines = (lastPrompt.match(/<<<REFERENCE_DATA\n([\s\S]*?)\nREFERENCE_DATA>>>/) || [])[1].split(/\n(?=\[S\d)/).filter(l => /^\[S\d/.test(l))
        let sawGrade = false
        for (const l of lines) {
          const band = (l.match(/^\[S\d[^\]]*\]\s*(?:\[([EWO]-\d[^\]]*)\])?/) || [])[1] || null
          const isRank = /Expected at this grade/.test(l)
          const includedLower = /included because the .* text also covers the lower level/.test(l)
          if (isRank) {
            if (!band) problems.push(`${where}: rank section with no grade label`)
            else if (!includedLower && !bandHas(band, rank)) problems.push(`${where}: shows ${band} text`)
            else if (!includedLower) sawGrade = true
          }
          // the text must be this code's own text
          const text = l.replace(/^\[[^\]]*\](?:\s*\[[^\]]*\])?\s*[^:]*:\s*/, '')
          if (!mine.some(p => squashT(p.body).includes(squashT(text).slice(0, 80)))) problems.push(`${where}: a line that is not this code's text: ${text.slice(0, 50)}`)
        }
        if (sawGrade) stats.withGradeText++
        else {
          stats.generalOnly++
          // nothing grade-specific exists, so none may be shown or implied
          if (haveGradeText) problems.push(`${where}: grade text exists but was not shown`)
          if (lines.some(l => /Expected at this grade/.test(l) && !/included because/.test(l))) problems.push(`${where}: rank-specific text shown for a grade without any`)
          if (!/no separate duties for|rather than grade by grade|outside the grades/.test(lastPrompt)) problems.push(`${where}: general-only answer without the note saying so`)
        }
        // the specialty named in the prompt is the one asked for
        if (!new RegExp(`Occupational code: ${row.code}\\b`).test(lastPrompt)) problems.push(`${where}: wrong code in prompt`)
      }
    }
  }
  console.log('EXHAUSTIVE', JSON.stringify(stats))
  assert.deepEqual(problems.slice(0, 20), [], `${problems.length} problems`)
  assert.ok(stats.calls > 3500, JSON.stringify(stats))
  assert.ok(stats.withGradeText > 1000 && stats.generalOnly > 500, JSON.stringify(stats))
})

// ── recommendations are never material for the generators ─────────────────────────────────────

test('recommended training, credentials, assignments and self-development never reach a prompt, and are returned only as guidance', async () => {
  const guides = (await readdir(new URL('data/reference/bundles/', root))).filter(f => /^army-600-25-.*\.bundle\.json$/.test(f)).map(f => f.replace(/\.bundle\.json$/, ''))
  const all = [...await Promise.all(guides.map(bundleOf)), await bundleOf('army-cmf42-dapam600-25-2025-09-30'), await bundleOf('army-cmf36-dapam600-25-2024-07-19'), await bundleOf('army-600-4-20220223-medical-service-corps')].flatMap(b => b.passages)
  const DUTY = new Set(['general_duties', 'rank_duties', 'skills'])
  const prompts = []
  globalThis.fetch = async (url, opts) => {
    const body = JSON.parse(opts.body); prompts.push(promptOf(body))
    const block = (promptOf(body).match(/<<<REFERENCE_DATA\n([\s\S]*?)\nREFERENCE_DATA>>>/) || [])[1] || ''
    const first = (block.split(/\n(?=\[S\d)/).find(l => /^\[S\d/.test(l)) || '').replace(/^\[[^\]]*\](?:\s*\[[^\]]*\])?\s*[^:]*:\s*/, '').split(/\s+/).slice(0, 12).join(' ')
    return { json: async () => ({ content: [{ type: 'text', text: JSON.stringify({ civilianTranslation: [{ basis: 'publication', evidence: first, militarySkill: 'm', civilianEquivalent: 'c', civilianFunctions: [], verify: 'v' }], certifications: [], summary: 's' }) }] }) }
  }
  for (const [code, rank] of [['25B', 'E-6'], ['68W', 'E-5'], ['38B', 'E-6'], ['11B', 'E-7'], ['27D', 'E-7'], ['40D', 'E-8']]) {
    clearReferenceCache(); prompts.length = 0
    const res = mockRes()
    await (await translate())(mockReq({ action: 'translate', branch: 'Army', mos: code, rank, milDuties: '', vaultContext: '' }), res)
    assert.equal(res.code, 200, `${code}@${rank}`)
    const prompt = squashT(prompts.join('\n'))
    // the guide's own opening description of the specialty can repeat a duties sentence word for word; such text is the duty text
    const dutyText = squashT([...all, ...(await bundleOf('army-611-21-enlisted-ch10c')).passages, ...(await bundleOf('army-611-21-officer-ch3')).passages].filter(p => p.occupation_code === code && DUTY.has(p.section_type)).map(p => p.body).join(' '))
    const recs = all.filter(p => p.occupation_code === code && !DUTY.has(p.section_type) && p.body.length > 60 && !dutyText.includes(squashT(p.body).slice(0, 70)))
    assert.ok(recs.length > 0, `${code} has recommendation passages to test with`)
    for (const p of recs) assert.ok(!prompt.includes(squashT(p.body).slice(0, 70)), `${code}@${rank}: a ${p.section_type} passage reached the prompt: ${p.body.slice(0, 50)}`)
    // they come back as guidance, labelled as suggestions
    assert.ok(Array.isArray(res.body.developmentGuidance) && res.body.developmentGuidance.length > 0, `${code} guidance panel`)
    for (const g of res.body.developmentGuidance) for (const it of g.items) assert.ok(it.source?.publication && it.text, 'every guidance item names its source')
    // and none of the evidence the entries cite is a recommendation
    for (const e of res.body.civilianTranslation) assert.equal(e.basis, 'publication')
    assert.ok(res.body.civilianTranslation.every(e => !recs.some(p => squashT(p.body).includes(squashT(e.evidence)))), `${code}@${rank}: an entry was grounded in a recommendation`)
    // the resume builder: quick (translator) and full builder prompts carry no recommendation either
    prompts.length = 0
    const saved = globalThis.fetch
    globalThis.fetch = async (url, opts) => { prompts.push(promptOf(JSON.parse(opts.body))); return { json: async () => ({ content: [{ type: 'text', text: 'resume text' }] }) } }
    await (await resume())(mockReq({ branch: 'Army', mos: code, rank }), mockRes())
    await (await resume())(mockReq({ branch: 'Army', mos: code, rank, name: 'A B', targetRole: 'Operations Manager' }), mockRes())
    globalThis.fetch = saved
    const rp = squashT(prompts.join('\n'))
    assert.ok(prompts.length >= 1, `${code}: resume prompt captured`)
    for (const p of recs) assert.ok(!rp.includes(squashT(p.body).slice(0, 70)), `${code}@${rank}: a ${p.section_type} passage reached the resume prompt`)
  }
})
