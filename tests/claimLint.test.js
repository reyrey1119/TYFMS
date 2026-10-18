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

test('"recognized for ..." is flagged unless the person said they were recognized', () => {
  const line = 'Army-trained specialist recognized for training new team members on standardized shift procedures.'
  assert.equal(annotateUnsupportedClaims(line, 'I trained eleven new team members on the shift handoff checklist.').flagged.length, 1)
  assert.deepEqual(annotateUnsupportedClaims(line, 'I was recognized by my section chief for training new team members.').flagged, [])
})

test('quality and timing embellishments of a personal fact are flagged (clearly, on schedule, without gaps, detail-oriented)', () => {
  const facts = 'I wrote the weekly status summary for the section chief. I kept the shift log for a year.'
  for (const line of [
    '• Wrote the weekly status summary for the section chief, communicating updates clearly and on schedule',
    '• Maintained a complete shift log for a full year without gaps or missed entries',
    'Brings a disciplined, detail-oriented work ethic to every clinical support role.',
  ]) assert.equal(annotateUnsupportedClaims(line, facts).flagged.length, 1, line)
  // the person's own words are not flagged, phrases included
  assert.deepEqual(annotateUnsupportedClaims('• Delivered the weekly report on schedule every Friday to the section chief.', 'I delivered the weekly report on schedule every Friday.').flagged, [])
})
