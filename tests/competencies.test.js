// CORE COMPETENCIES are only what the person selected (from the suggestions shown) or typed. Nothing the model writes there survives.
import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { parseSkillList, selectedFromSuggestions, competencyLines, applyCompetencies, NO_COMPETENCIES_LINE } from '../api/_lib/competencies.js'

test('selection counts only for suggestions that were shown (case-insensitive), nothing else', () => {
  assert.deepEqual(selectedFromSuggestions(['budgeting', 'Hacking', 'Logistics'], ['Budgeting', 'Logistics', 'Training']), ['Budgeting', 'Logistics'])
  assert.deepEqual(selectedFromSuggestions(['Budgeting'], undefined), [])
  assert.deepEqual(selectedFromSuggestions(undefined, ['Budgeting']), [])
})

test('typed skills are split, trimmed, de-duplicated; brackets and long text are dropped', () => {
  assert.deepEqual(parseSkillList('Python, bilingual Spanish\nPython; [ADD: x] • Agile'), ['Python', 'bilingual Spanish', 'Agile'])
  assert.deepEqual(parseSkillList('x'.repeat(161)), [])
  const long = 'System and network administration in classified and unclassified environments'
  assert.deepEqual(selectedFromSuggestions([long], [long, 'Budgeting']), [long], 'a long suggested phrase is kept when selected')
})

test('no choice gives one [ADD] line, never invented competencies', () => {
  assert.deepEqual(competencyLines({}), [NO_COMPETENCIES_LINE])
})

test('chosen skills fill three columns and a short list is padded with an [ADD] prompt', () => {
  const rows = competencyLines({ selected: ['A', 'B', 'C', 'D'], own: ['E'] })
  assert.equal(rows[0], 'A | B | C')
  assert.equal(rows[1], 'D | E')
  assert.match(rows.at(-1), /^\[ADD:/)
  assert.ok(!competencyLines({ selected: ['1', '2', '3', '4', '5', '6'] }).some(l => l.startsWith('[ADD')))
})

test('applyCompetencies replaces whatever the model wrote and leaves the other sections alone', () => {
  const text = 'SUMMARY\nx\n\nCORE COMPETENCIES\nInvented Skill | Another Invention\n\nPROFESSIONAL EXPERIENCE\n• kept'
  const out = applyCompetencies(text, { selected: ['Budgeting'] })
  assert.ok(!/Invented/.test(out) && !/Another Invention/.test(out))
  assert.match(out, /CORE COMPETENCIES\nBudgeting\n\[ADD: additional competency/)
  assert.match(out, /PROFESSIONAL EXPERIENCE\n• kept/)
  const dividers = '──────────\nCORE COMPETENCIES\n──────────\nInvented\n\n──────────\nPROFESSIONAL EXPERIENCE\n──────────\n• kept'
  const out2 = applyCompetencies(dividers, {})
  assert.ok(!/Invented/.test(out2)); assert.ok(out2.includes(NO_COMPETENCIES_LINE)); assert.match(out2, /PROFESSIONAL EXPERIENCE\n──────────\n• kept/)
  assert.equal(applyCompetencies('no such section', { selected: ['x'] }), 'no such section')
})

// ── handlers ──────────────────────────────────────────────────────────────────
const realFetch = globalThis.fetch
const realEnv = { ...process.env }
let modelCalls
const MODEL_TEXT = 'PROFESSIONAL SUMMARY\n[CONFIRM] Army 25B.\n\nCORE COMPETENCIES\nModel Invented Skill | Another Invented Skill\n\nPROFESSIONAL EXPERIENCE\nSPECIALTY SCOPE (x)\n• [CONFIRM] Sets up networks\nEDUCATION\n[ADD]'
beforeEach(() => {
  modelCalls = []
  process.env.ANTHROPIC_API_KEY = 'test-key-not-real'
  for (const k of ['SUPABASE_URL', 'VITE_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_SERVICE_KEY', 'SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY']) delete process.env[k]
  globalThis.fetch = async (url, opts) => { modelCalls.push(JSON.parse(opts.body)); return { json: async () => ({ content: [{ type: 'text', text: MODEL_TEXT }] }) } }
})
afterEach(() => { globalThis.fetch = realFetch; process.env = { ...realEnv } })
const mockRes = () => ({ code: 200, body: null, status(c) { this.code = c; return this }, json(b) { this.body = b; return this } })
const mockReq = body => ({ method: 'POST', headers: {}, socket: { remoteAddress: '203.0.113.' + (Math.floor(Math.random() * 200) + 1) }, body })
const prompt = i => modelCalls[i].messages[0].content

test('translator resume: unselected suggestions never reach the resume; selected ones do; model-written competencies are discarded', async () => {
  const handler = (await import('../api/translate.js')).default
  const base = { action: 'resume', branch: 'Army', mos: '25B', rank: 'E-6', transferableSkills: ['Network Administration', 'Budgeting', 'Training Design'] }
  const none = mockRes(); await handler(mockReq(base), none)
  assert.equal(none.code, 200)
  assert.ok(!/Network Administration|Budgeting|Training Design/.test(none.body.resume.split('PROFESSIONAL EXPERIENCE')[0].split('CORE COMPETENCIES')[1]))
  assert.match(none.body.resume, /CORE COMPETENCIES\n\[ADD: skills you can demonstrate/)
  assert.ok(!/Invented/.test(none.body.resume))
  assert.equal(none.body.competenciesSelected, 0)
  assert.match(prompt(0), /Skills the person selected: none/)
  assert.ok(!/Network Administration/.test(prompt(0)))

  const some = mockRes(); await handler(mockReq({ ...base, selectedSkills: ['budgeting', 'Not A Suggestion'] }), some)
  const section = some.body.resume.split('CORE COMPETENCIES')[1].split('PROFESSIONAL EXPERIENCE')[0]
  assert.match(section, /Budgeting/); assert.ok(!/Network Administration|Not A Suggestion|Invented/.test(section))
  assert.equal(some.body.competenciesSelected, 1)
})

test('translator resume: rank and MOS alone are enough for a publication-based draft (no selection needed)', async () => {
  const handler = (await import('../api/translate.js')).default
  const res = mockRes(); await handler(mockReq({ action: 'resume', branch: 'Army', mos: '25B', rank: 'E-6' }), res)
  assert.equal(res.code, 200); assert.ok(res.body.resume.length > 0)
  assert.match(res.body.resume, /SPECIALTY SCOPE/)
})

test('full resume builder: only selected suggestions and typed skills appear under CORE COMPETENCIES', async () => {
  const handler = (await import('../api/resume.js')).default
  const body = { branch: 'Army', mos: '25B', rank: 'E-6', yos: '10', suggestedSkills: ['Network Administration', 'Budgeting'], selectedSkills: ['Budgeting', 'Invented By Browser'], ownSkills: 'Python, Agile' }
  const res = mockRes(); await handler(mockReq(body), res)
  assert.equal(res.code, 200)
  const section = res.body.resume.split('CORE COMPETENCIES')[1].split('PROFESSIONAL EXPERIENCE')[0]
  assert.match(section, /Budgeting \| Python \| Agile/)
  assert.ok(!/Network Administration|Invented/.test(section))
  assert.ok(!/Network Administration/.test(prompt(0)), 'unselected suggestions are not even sent to the model')
  const none = mockRes(); await handler(mockReq({ branch: 'Army', mos: '25B', rank: 'E-6', suggestedSkills: ['Budgeting'] }), none)
  assert.match(none.body.resume, /CORE COMPETENCIES\n\[ADD: skills you can demonstrate/)
  assert.ok(!/Budgeting/.test(none.body.resume))
})
