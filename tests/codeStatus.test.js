// Rules for reading DA PAM 611-21's dated markers. The cases are the REAL ones found in the
// classification chapters (MOS 15E/15W/15X, 92A, 79S, 12M, 91S; officer 88A/91A/92A).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseMarkers, statusOf } from '../scripts/lib/codeStatus.js'

const AS_OF = '2026-10-15'
const v = text => parseMarkers(text)
const status = (headings, kind = null, inherited = []) => statusOf(headings.map(v), kind, inherited, AS_OF)

test('markers: YYYYMM effective/rescind, including a rescind marker wrapped onto the next line', () => {
  assert.equal(v('MOS 15X (Effective 202610)').effective_from, '2026-10-01')
  assert.equal(v('MOS 15W (Rescind 202610)').rescinded_from, '2026-10-01')
  assert.equal(v('MOS 15W (Rescind 202610)\n(Army Civilian Acquired Skills)').rescinded_from, '2026-10-01')
  assert.equal(v('MOS 25Z (Eff 202510)').effective_from, '2025-10-01')
  assert.equal(v('MOS 12M--Firefighter, CMF 12 (Rescind) 202510)').rescinded_from, '2025-10-01', 'the document writes "(Rescind) 202510)"')
})

test('markers: chart notation del/add', () => {
  assert.equal(v('TRANSPORTATION, GENERAL( del 2610 / 2510 - 05 )').rescinded_from, '2026-10-01')
  assert.equal(v('STRYKER MAINTENANCE WARRANT OFFICER( add 2510 / 2310 - 08 )').effective_from, '2025-10-01')
})

test('markers: odd formats are kept but flagged, never silently trusted', () => {
  const m = v('MOS 91S (Effective 251010)')
  assert.equal(m.effective_from, '2025-10-10')
  assert.ok(m.flags.some(f => /nonstandard/.test(f)))
  assert.ok(v('MOS 92A (Effective 202610) (ACASP) (Effective 202510)').flags.some(f => /more than one effective/.test(f)))
  assert.equal(v('(Effective 209913)').effective_from, null, 'month 13 is not a date')
})

test('markers: component restrictions are captured', () => {
  assert.equal(v('MOS 38R (Active Component Only), CMF 38').component_restriction, 'Active Component Only')
  assert.equal(v('MOS 92S (RC Only) (Eff 202510)').component_restriction, 'RC Only')
  assert.match(v('(COMPO 2 and 3 Only) (Effective 202610)').component_restriction, /COMPO 2 and 3 Only/)
})

test('status: a code with an older spec and a later rescission is rescinded (15E, 15W)', () => {
  const s = status(['MOS 15E TUAS Repairer (Effective 202510)', 'MOS 15E TUAS Repairer (Rescind 202610)'])
  assert.equal(s.status, 'rescinded')
  assert.equal(s.rescinded_from, '2026-10-01')
})

test('status: a rescission with no replacement is historical (12M)', () => {
  assert.equal(status(['MOS 12M Firefighter (Rescind) 202510)']).status, 'rescinded')
})

test('status: the new version that has already taken effect is current (15X, 40D, 92A)', () => {
  assert.equal(status(['MOS 15X (Effective 202610)']).status, 'current')
  assert.equal(status(['MOS 92A (Effective 202610) (ACASP) (Effective 202510)', 'MOS 92A (Eff 202510)']).status, 'current')
})

test('status: a not-yet-effective code is future_effective and carries its date (79S)', () => {
  const s = status(['MOS 79S Career Counselor (Active Component), CMF 79 (Effective 202710)'])
  assert.equal(s.status, 'future_effective')
  assert.equal(s.effective_from, '2027-10-01')
})

test('status: rescind and re-establish in the same month (a retitle, 47U) stays current', () => {
  assert.equal(status(['(47U). (Rescind 202310)', '(47U). (Effective 202310)']).status, 'current')
})

test('status: a scheduled rescission keeps the code current today and says so', () => {
  const s = status(['MOS 99X (Effective 202401)', 'MOS 99X (Rescind 202801)'])
  assert.equal(s.status, 'current')
  assert.equal(s.scheduled_rescission, '2028-01-01')
})

test('status: a pending change on a current code is reported as scheduled_change (420T)', () => {
  const s = status(['420T (Effective 202301)', '420T (Effective 202710)'])
  assert.equal(s.status, 'current')
  assert.equal(s.scheduled_change, '2027-10-01')
})

test('status: with no dated marker the code is current ONLY on the basis that it is listed — and says so', () => {
  const s = status(['MOS 11B Infantryman'])
  assert.equal(s.status, 'current')
  assert.equal(s.basis, 'listed_without_dated_marker')
})

test('status: branch-level markers are used only when the code has none of its own (officer 92A under Quartermaster)', () => {
  const inherited = [{ date: '2026-10-01', type: 'rescind' }]
  assert.equal(status(['QUARTERMASTER, GENERAL'], null, inherited).status, 'rescinded')
  const own = status(['MOS X (Effective 202401)'], null, inherited)
  assert.equal(own.status, 'current', "the code's own dated marker wins over the branch's")
  assert.equal(own.basis, 'dated_marker_on_code')
})

test('status: special reporting and immaterial codes are never presented as job specialties', () => {
  assert.equal(status(['Position Special Reporting Code (SRC) 00D'], 'special_reporting').status, 'special_reporting')
  assert.equal(status(['SRC 00F MOS Immaterial'], 'immaterial').status, 'immaterial')
})
