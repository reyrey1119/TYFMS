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
