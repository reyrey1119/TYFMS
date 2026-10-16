#!/usr/bin/env node
// Production spot check using ONLY clearly synthetic personal experience.
//   node scripts/production-spot-check.mjs --base https://www.tyfms.com --plan data/reference/audits/spot-plan.json --out data/reference/audits/spot-results.json [--generate]
//
// Without --generate it only performs reference lookups (free, no AI). With --generate it also calls the
// translator and the resume builder (paid model calls) and checks the output for numbers and credentials that
// were not supplied. A sample like this supplements a full audit; it does not establish coverage.
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { parseArgs } from 'node:util'

const { values } = parseArgs({ options: { base: { type: 'string', default: 'https://www.tyfms.com' }, plan: { type: 'string' }, out: { type: 'string' }, generate: { type: 'boolean', default: false } } })
const plan = JSON.parse(await readFile(values.plan, 'utf8'))
const sleep = ms => new Promise(r => setTimeout(r, ms))

// The public endpoints are rate limited per IP (translate 15 / 10 min, resume 12 / 10 min). Stay under both.
const LIMITS = { '/api/translate': 13, '/api/resume': 10, '/api/resume-tools': 35 }
const sent = {}
async function pace(route) {
  const max = LIMITS[route] ?? 30
  for (;;) {
    const now = Date.now()
    sent[route] = (sent[route] || []).filter(t => now - t < 605_000)
    if (sent[route].length < max) { sent[route].push(now); return }
    await sleep(605_000 - (now - sent[route][0]) + 500)
  }
}

async function post(route, body) {
  await pace(route)
  const t0 = Date.now()
  const r = await fetch(values.base + route, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  const text = await r.text()
  let json = null; try { json = JSON.parse(text) } catch {}
  return { http: r.status, ms: Date.now() - t0, json, text }
}

const CERT_WORDS = /\b(Security\+|Network\+|CISSP|CISM|PMP|CAPM|CompTIA|Six Sigma|CDFM|CGFM|aPHR|PHR|SHRM|CPA|Series 7|AWS Certified|Azure|CCNA|ITIL|Scrum|CPMR|CMRP|NREMT|Paramedic license|security clearance|Top Secret|TS\/SCI|Secret clearance|CDL)\b/gi
const digitsIn = s => new Set((String(s).match(/\d+(?:[.,]\d+)?%?/g) || []))
const stripTemplate = s => String(s).replace(/\[[^\]]*\]/g, ' ')   // [ADD: ...] placeholders are not claims

function inventionCheck({ input, output, label }) {
  const allowed = digitsIn(input)
  const claimed = [...digitsIn(stripTemplate(output))].filter(d => !allowed.has(d))
  const certClaims = [...new Set((stripTemplate(output).match(CERT_WORDS) || []).map(x => x.toLowerCase()))]
  return { label, numbersNotInInput: claimed, credentialWordsInText: certClaims }
}

const results = { base: values.base, ran_at: new Date().toISOString(), generate: values.generate, codes: [] }
for (const c of plan.codes) {
  const row = { category: c.category, code: c.code, title: c.title, lookups: [], generation: [] }
  for (const l of c.lookups) {
    const body = { action: 'mil-reference', branch: 'Army', mos_afsc: c.code, rank: l.rank, ...(l.component ? { component: l.component } : {}) }
    const a = await post('/api/resume-tools', body)
    const b = await post('/api/resume-tools', body)                     // repeat lookup
    const j = a.json || {}
    row.lookups.push({
      rank: l.rank, component: l.component || null, http: a.http, status: j.status, origin: j._origin,
      sections: (j.sections || []).length, sources: (j.sources || []).map(s => `${s.publicationNumber} ${s.publicationDate}`),
      message: (j.message || '').slice(0, 160), componentNote: j.componentNote || null, codeNote: j.codeNote || null,
      repeat_same: JSON.stringify(a.json) === JSON.stringify(b.json), ms: [a.ms, b.ms],
      ai_origin: j._origin === 'ai',
    })
  }
  if (values.generate) {
    for (const g of c.generate) {
      const base = { branch: 'Army', mos: c.code, rank: g.rank, yos: g.yos || '', ...(g.component ? { component: g.component } : {}) }
      // 1. translator with NO personal facts must refuse before any paid call
      const refuse = await post('/api/translate', { action: 'translate', ...base })
      // 2. translator with synthetic personal facts
      await sleep(1500)
      const tr = await post('/api/translate', { action: 'translate', ...base, milDuties: c.synthetic })
      // 3. the handoff: resume builder with the same fields plus the duties (what the UI sends after "Build my resume with these results")
      await sleep(1500)
      const rs = await post('/api/resume', { ...base, milDuties: c.synthetic, contact: { name: 'Synthetic Tester', email: 'synthetic@example.invalid', phone: '', location: 'Nowhere, XX', linkedin: '' }, format: 'resume' })
      const resumeText = rs.json?.resume || ''
      row.generation.push({
        rank: g.rank, component: g.component || null,
        translator_without_facts: { http: refuse.http, status: refuse.json?.status, refused_before_model_call: refuse.http === 422 || refuse.http === 400 },
        translator_with_synthetic: { http: tr.http, ms: tr.ms, fields: tr.json ? Object.keys(tr.json) : null, referenceStatus: tr.json?.referenceStatus ?? null, error: tr.json?.error || null },
        resume: { http: rs.http, ms: rs.ms, chars: resumeText.length, add_prompts: (resumeText.match(/\[ADD[^\]]*\]/g) || []).length },
        checks: [
          inventionCheck({ label: 'translator', input: `${base.mos} ${base.rank} ${base.yos} ${c.synthetic}`, output: tr.text }),
          inventionCheck({ label: 'resume', input: `${base.mos} ${base.rank} ${base.yos} ${c.synthetic} Synthetic Tester Nowhere XX`, output: resumeText }),
        ],
        translator_text: tr.json ? JSON.stringify({ civilianTitles: tr.json.civilianTitles, transferableSkills: tr.json.transferableSkills, certifications: (tr.json.certifications || []).map(x => x.name), civilianTranslation: tr.json.civilianTranslation }) : tr.text.slice(0, 300),
        resume_text: resumeText,
      })
      await sleep(2500)
    }
  }
  results.codes.push(row)
}
await mkdir(path.dirname(values.out), { recursive: true })
await writeFile(values.out, JSON.stringify(results, null, 1) + '\n')
console.log('wrote', values.out)
