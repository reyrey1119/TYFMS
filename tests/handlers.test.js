// Handler-level checks: bad input must be rejected BEFORE any paid model call,
// and the generation prompts must not license unconfirmed claims.
// The Anthropic API is stubbed; nothing here touches the network.

import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'

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
    civilianTranslation: [{ militarySkill: 's', civilianEquivalent: 'c', civilianFunctions: ['f'], verify: 'v' }],
    certifications: [{ name: 'Certified Maintenance Manager (CMM)', why: 'invented' }, { name: 'CMRP', why: 'real' }],
  }))
  const res = mockRes()
  await (await translate())(mockReq({ action: 'translate', branch: 'Army', mos: '91X', rank: 'E-7' }), res)
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
  assert.match(prompt, /Every experience bullet must be an \[ADD: \.\.\.\] prompt/)
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
  assert.match(prompt, /the ONLY source for experience bullets/)
  assert.ok(!/has not described any duties/.test(prompt))
})

test('full resume builder prompt forbids estimating numbers and listing certifications nobody provided', async () => {
  stubModel('resume text')
  const res = mockRes()
  await (await resume())(mockReq({ branch: 'Army', mos: '36B', rank: 'E-5', yos: '5–6 years' }), res)
  assert.equal(res.code, 200)
  const prompt = promptOf(modelCalls[0])
  assert.match(prompt, /ONLY if the person provided it/)
  assert.ok(!/credible estimates/.test(prompt))
  assert.match(prompt, /ADD YOUR CERTIFICATIONS HERE/)
  assert.ok(!/real civilian certifications directly relevant/.test(prompt))
})
