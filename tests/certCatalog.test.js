// Certification recommendations may only come from the verified catalog.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { CERT_CATALOG, findCert, verifyRecommendations } from '../api/_lib/certCatalog.js'

test('an invented SMRP "Certified Maintenance Manager" is never recommended', () => {
  assert.equal(findCert('Certified Maintenance Manager'), null)
  assert.equal(findCert('Certified Maintenance Manager (CMM)'), null)
  const out = verifyRecommendations([{ name: 'Certified Maintenance Manager (CMM)', why: 'x' }, { name: 'CMRP', why: 'real one' }])
  assert.deepEqual(out.map(o => o.name), ['Certified Maintenance & Reliability Professional (CMRP)'])
})

test('SMRP offers exactly the CMRP and the CMRT', () => {
  assert.deepEqual(CERT_CATALOG.filter(c => c.provider === 'SMRP').map(c => c.name).sort(), [
    'Certified Maintenance & Reliability Professional (CMRP)',
    'Certified Maintenance & Reliability Technician (CMRT)',
  ])
})

test('held certifications are excluded and duplicates collapse; provider links are https', () => {
  const out = verifyRecommendations(
    [{ name: 'Security+', why: 'a' }, { name: 'CompTIA Network+', why: 'b' }, { name: 'Network+', why: 'dup' }],
    ['CompTIA Security+'],
  )
  assert.deepEqual(out.map(o => o.name), ['CompTIA Network+'])
  for (const c of CERT_CATALOG) assert.match(c.url, /^https:\/\//, c.name)
})

test('the former CASP+ name resolves to the current SecurityX entry', () => {
  assert.equal(findCert('CASP+').name, 'CompTIA SecurityX')
})

test('credential levels are separate entries: holding one never hides another', () => {
  const rec = names => names.map(name => ({ name, why: 'x' }))
  const hrOut = verifyRecommendations(rec(['aPHR', 'PHR', 'SPHR']), ['PHR'])
  assert.deepEqual(hrOut.map(o => o.name), ['Associate Professional in Human Resources (aPHR)', 'Senior Professional in Human Resources (SPHR)'])
  const emsOut = verifyRecommendations(rec(['EMT-Basic', 'EMT-Advanced', 'Paramedic (NREMT-P)']), ['EMT-Basic'])
  assert.deepEqual(emsOut.map(o => o.name), ['Advanced Emergency Medical Technician (AEMT)', 'Paramedic'])
  const shrm = verifyRecommendations(rec(['SHRM-CP', 'SHRM-SCP']), ['SHRM-CP'])
  assert.deepEqual(shrm.map(o => o.name), ['SHRM Senior Certified Professional (SHRM-SCP)'])
})

test('no catalog entry combines credentials, and every alias resolves to exactly one entry', () => {
  for (const c of CERT_CATALOG) {
    assert.ok(!/\s\/\s/.test(c.name), `combined name: ${c.name}`)
    assert.ok(!/\b(PHR|SHRM-CP|EMT).*\b(SPHR|SHRM-SCP|Paramedic)\b/.test(c.name), `combined levels: ${c.name}`)
  }
  const owner = {}
  for (const c of CERT_CATALOG) for (const key of [c.name, ...c.aliases]) {
    const k = key.toLowerCase()
    assert.ok(!owner[k] || owner[k] === c.name, `"${key}" maps to both "${owner[k]}" and "${c.name}"`)
    owner[k] = c.name
  }
})

test('a shared provider page is disclosed rather than implied to be level-specific', () => {
  const shared = CERT_CATALOG.filter(c => c.provider === 'NREMT')
  assert.ok(shared.length === 3 && shared.every(c => c.urlNote), 'each NREMT entry says its page also covers another level')
})
