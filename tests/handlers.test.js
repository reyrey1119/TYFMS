// Handler-level checks: bad input must be rejected BEFORE any paid model call,
// and the generation prompts must not license unconfirmed claims.
// The Anthropic API is stubbed; nothing here touches the network.

import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { useBundledReference } from '../api/_lib/referenceStore.js'
useBundledReference(false)   // these tests exercise the Supabase registry path with their own data; see tests/bundledReference.test.js for the shipped data

const realFetch = globalThis.fetch
const realEnv = { ...process.env }
let modelCalls

function stubModel(replyText) {
  globalThis.fetch = async (url, opts) => {
    if (String(url).includes('api.anthropic.com')) {
      modelCalls.push(JSON.parse(opts.body))
      return { json: async () => ({ content: [{ type: 'text', text: replyText }] }) }
    }
    return realFetch(url, opts)
  }
}
const mockRes = () => ({ code: 200, body: null, status(c) { this.code = c; return this }, json(b) { this.body = b; return this } })
const mockReq = body => ({ method: 'POST', headers: {}, socket: { remoteAddress: '203.0.113.9' }, body })
const promptOf = call => call.messages[0].content

beforeEach(() => {
  modelCalls = []
  process.env.ANTHROPIC_API_KEY = 'test-key-not-real'
  for (const k of ['SUPABASE_URL', 'VITE_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_SERVICE_KEY', 'SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY']) delete process.env[k]
})
afterEach(() => { globalThis.fetch = realFetch; process.env = { ...realEnv } })

const translate = async () => (await import('../api/translate.js')).default
const resume = async () => (await import('../api/resume.js')).default
const tools = async () => (await import('../api/resume-tools.js')).default

// ── finding 1: reject before any paid call ───────────────────────────────────

for (const [label, patch] of [
  ['missing rank', { rank: '' }],
  ['impossible rank (E-10)', { rank: 'E-10' }],
  ['nonsense rank', { rank: 'sergeant' }],
  ['Guard sent as a branch', { branch: 'National Guard' }],
  ['invalid component', { component: 'space' }],
]) {
  for (const [name, load, extra] of [
    ['translate', translate, { action: 'translate' }],
    ['translate quick resume', translate, { action: 'resume' }],
    ['resume builder', resume, {}],
  ]) {
    test(`${name}: ${label} is rejected with no model call`, async () => {
      stubModel('{}')
      const res = mockRes()
      await (await load())(mockReq({ branch: 'Army', mos: '36B', rank: 'E-5', ...extra, ...patch }), res)
      assert.equal(res.code, 400)
      assert.match(res.body.error, /\S/)
      assert.equal(modelCalls.length, 0, 'no paid call may be made')
    })
  }
}

test('mil-reference: a missing rank asks the user and never calls the model', async () => {
  stubModel('{"duty_title":"x"}')
  const res = mockRes()
  await (await tools())(mockReq({ action: 'mil-reference', branch: 'Army', mos_afsc: '36B' }), res)
  assert.equal(res.code, 200)
  assert.equal(res.body.status, 'needs_input')
  assert.deepEqual(res.body.missing, ['rank'])
  assert.equal(modelCalls.length, 0)
})

test('a valid translation still reaches the model once, and invented certifications are dropped', async () => {
  stubModel(JSON.stringify({
    civilianTitles: ['a'], transferableSkills: ['b'], careerPaths: [], targetIndustries: [], identityTip: 't',
    civilianTranslation: [{ basis: 'personal', evidence: 'I inspected maintenance records', militarySkill: 's', civilianEquivalent: 'c', civilianFunctions: ['f'], verify: 'v' }],
    certifications: [{ name: 'Certified Maintenance Manager (CMM)', why: 'invented' }, { name: 'CMRP', why: 'real' }],
  }))
  const res = mockRes()
  await (await translate())(mockReq({ action: 'translate', branch: 'Army', mos: '91X', rank: 'E-7', milDuties: 'I inspected maintenance records.' }), res)
  assert.equal(res.code, 200)
  assert.equal(modelCalls.length, 1)
  assert.deepEqual(res.body.certifications.map(c => c.name), ['Certified Maintenance & Reliability Professional (CMRP)'])
  assert.ok(res.body.certifications[0].url.startsWith('https://'))
})

// ── finding 4: no duties from the occupation code ────────────────────────────

test('quick resume draft with no described duties tells the model to write none', async () => {
  stubModel('draft')
  const res = mockRes()
  await (await translate())(mockReq({ action: 'resume', branch: 'Army', mos: '36B', rank: 'E-5', civilianTitles: ['Accountant'], transferableSkills: ['Budgeting'] }), res)
  assert.equal(res.code, 200)
  const prompt = promptOf(modelCalls[0])
  assert.match(prompt, /has not described any duties/)
  assert.match(prompt, /write only \[ADD: \.\.\.\] prompts/)
  assert.match(prompt, /Never infer a duty, task, system, supervisory role, or accomplishment from the occupational code/)
  assert.ok(!/common to the specialty/i.test(prompt), 'the old "duties common to the specialty" license is gone')
  assert.ok(!/implies/i.test(prompt))
})

test('quick resume draft with described duties uses only those as experience source', async () => {
  stubModel('draft')
  const res = mockRes()
  await (await translate())(mockReq({ action: 'resume', branch: 'Army', mos: '36B', rank: 'E-5', milDuties: 'Processed travel vouchers for a 40-person unit.', civilianTitles: ['Accountant'] }), res)
  const prompt = promptOf(modelCalls[0])
  assert.match(prompt, /Processed travel vouchers for a 40-person unit\./)
  assert.match(prompt, /WHAT THE PERSON DESCRIBED \(their own words\)/)
  assert.ok(!/has not described any duties/.test(prompt))
})

test('full resume builder prompt forbids estimating numbers and listing certifications nobody provided', async () => {
  stubModel('resume text')
  const res = mockRes()
  await (await resume())(mockReq({ branch: 'Army', mos: '36B', rank: 'E-5', yos: '5–6 years' }), res)
  assert.equal(res.code, 200)
  const prompt = promptOf(modelCalls[0])
  assert.match(prompt, /ONLY if the person provided it/)
  assert.match(prompt, /never copy one into this person's experience unless they gave it to you/)
  assert.ok(!/credible estimates/.test(prompt))
  assert.match(prompt, /ADD YOUR CERTIFICATIONS HERE/)
  assert.ok(!/real civilian certifications directly relevant/.test(prompt))
})


test('translator with no reviewed reference or personal facts stops before a paid call', async () => {
  stubModel('{}')
  const res = mockRes()
  await (await translate())(mockReq({ branch: 'Army', mos: '91X', rank: 'E-7' }), res)
  assert.equal(res.code, 422)
  assert.equal(res.body.status, 'needs_experience')
  assert.deepEqual(res.body.missing, ['milDuties'])
  assert.equal(modelCalls.length, 0)
})

test('translator can use personal facts when source coverage is missing, without guessing code-based duties', async () => {
  stubModel(JSON.stringify({ civilianTranslation: [{ basis: 'personal', evidence: 'I reconciled maintenance records', militarySkill: 'Reconciled records', civilianEquivalent: 'Records reconciliation', civilianFunctions: [], verify: 'v' }], certifications: [] }))
  const res = mockRes()
  await (await translate())(mockReq({ branch: 'Army', mos: '91X', rank: 'E-7', milDuties: 'I reconciled maintenance records.' }), res)
  assert.equal(res.code, 200)
  assert.equal(modelCalls.length, 1)
  const prompt = promptOf(modelCalls[0])
  assert.match(prompt, /Do not infer duties, skills, systems, training, leadership scope or credentials from the occupational code or rank/)
  assert.match(prompt, /I reconciled maintenance records/)
})

test('resume builder without a reviewed reference explicitly forbids code-based experience', async () => {
  stubModel('draft')
  const res = mockRes()
  await (await resume())(mockReq({ branch: 'Army', mos: '36B', rank: 'E-5' }), res)
  assert.equal(res.code, 200)
  assert.match(promptOf(modelCalls[0]), /Do not infer duties, skills, systems, training, leadership scope or credentials from the occupational code or rank/)
})

// ── lookups never call a model just to produce reference text ───────────────────────────────

test('mil-reference for an unknown code makes no model call by default (AI drafts are opt-in)', async () => {
  delete process.env.ENABLE_AI_DRAFTS
  stubModel('{"duty_title":"Invented"}')
  const res = mockRes()
  await (await tools())(mockReq({ action: 'mil-reference', branch: 'Army', mos_afsc: 'ZZZ9', rank: 'E-5' }), res)
  assert.equal(res.code, 200)
  assert.equal(res.body.status, 'none')
  assert.equal(modelCalls.length, 0)
})

test('a repeat lookup of a rescinded code makes no model call and no outside request', async () => {
  const outside = []
  const real = globalThis.fetch
  globalThis.fetch = async (url, opts) => { outside.push(String(url)); return real(url, opts) }
  const res = mockRes()
  await (await tools())(mockReq({ action: 'mil-reference', branch: 'Army', mos_afsc: '15E', rank: 'E-5' }), res)
  await (await tools())(mockReq({ action: 'mil-reference', branch: 'Army', mos_afsc: '15E', rank: 'E-5' }), res)
  assert.equal(res.body.status, 'historical')
  assert.deepEqual(outside, [], 'no PDF download, no model call, no outside request of any kind')
})

// ── with no reviewed reference, a code's identity is its OFFICIAL title and nothing from memory ──

test('translator grounds an uncovered code in its official title and forbids guessing (15M is the MQ-1 Repairer)', async () => {
  stubModel('{}')
  const res = mockRes()
  await (await translate())(mockReq({ action: 'translate', branch: 'Army', mos: '15M', rank: 'E-4', milDuties: 'SYNTHETIC: followed a checklist in a class.' }), res)
  const prompt = promptOf(modelCalls[0])
  assert.match(prompt, /OFFICIAL TITLE of Army occupational code 15M \(DA PAM 611-21\): "MQ-1 Repairer"/)
  assert.match(prompt, /only verified fact about what the code is/)
  assert.match(prompt, /Do not add results, effects, qualities or benefits/)
  assert.match(prompt, /do not name specific regulations, forms, systems or equipment/)
  assert.match(prompt, /requires several years of qualifying experience \(for example PMP or CISSP\)/)
  assert.ok(!/UH-72/.test(prompt))
})

test('resume builder states the official military title on the position line, with a civilian title only as [CONFIRM]', async () => {
  stubModel('resume')
  const res = mockRes()
  await (await resume())(mockReq({ branch: 'Army', mos: '40A', rank: 'O-3', milDuties: 'SYNTHETIC: tracked passes in a simulator.' }), res)
  const prompt = promptOf(modelCalls[0])
  assert.match(prompt, /SPACE OPERATIONS \(40A\) \[optional: add a civilian-equivalent title ONLY as \[CONFIRM: \.\.\.\]\] \| Army/)
  assert.ok(!/\[Translated Civilian Job Title\]/.test(prompt), 'the template no longer asks the model to invent a civilian job title')
  assert.match(prompt, /OFFICIAL TITLE of Army occupational code 40A/)
  assert.match(prompt, /Do not invent a civilian job title as if the person held it/)
})

test('a code with no official title in the classification gets an ADD prompt, not a guess', async () => {
  stubModel('resume')
  const res = mockRes()
  await (await resume())(mockReq({ branch: 'Army', mos: 'ZZZ9', rank: 'E-5', milDuties: 'SYNTHETIC.' }), res)
  const prompt = promptOf(modelCalls[0])
  assert.match(prompt, /\[ADD: your military job title\] \(ZZZ9\) \| Army/)
  assert.ok(!/OFFICIAL TITLE of Army occupational code ZZZ9/.test(prompt))
})
