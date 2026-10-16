import { test } from 'node:test'
import assert from 'node:assert/strict'
import { annotateUnsupportedClaims } from '../api/_lib/claimLint.js'

const FACTS = 'I tracked satellite passes in a training simulator and wrote down the times.'

test('quality and result words the person never used are annotated, not deleted', () => {
  const text = '• Tracked satellite passes in a simulator, recording findings accurately and ensuring consistent performance.'
  const { text: out, flagged } = annotateUnsupportedClaims(text, FACTS)
  assert.ok(out.startsWith(text), 'original text is kept')
  assert.match(out, /\[CONFIRM: you did not describe this as "accurately", "ensuring", "consistent"/)
  assert.equal(flagged.length, 1)
})

test('a claim word the person themselves used is not flagged', () => {
  const { flagged } = annotateUnsupportedClaims('• Recorded the pass times accurately during every simulator session.', 'I recorded pass times accurately in the simulator.')
  assert.deepEqual(flagged, [])
})

test('text already inside [ADD]/[CONFIRM] brackets, headers, and dividers are left alone', () => {
  const t = ['PROFESSIONAL EXPERIENCE', '─────────────────', '• [ADD: any results you can verify, such as errors reduced]', '[CONFIRM: Operations Analyst — if your work was effective]'].join('\n')
  const { text, flagged } = annotateUnsupportedClaims(t, FACTS)
  assert.equal(text, t)
  assert.deepEqual(flagged, [])
})

test('the job posting is not "supplied facts": a claim word that only appears there is still flagged', () => {
  const { flagged } = annotateUnsupportedClaims('• Tracked passes effectively in a simulator environment today.', FACTS /* posting text deliberately not included */)
  assert.equal(flagged.length, 1)
})
