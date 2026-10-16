#!/usr/bin/env node
// Reproducible random sample for post-deployment spot checks.
//   node scripts/random-audit-sample.js --seed <text> [--enlisted 3] [--officer 3] [--warrant 0]
// Pool: codes with status "current" in data/reference/corpus/army-code-inventory.json (sorted by code).
// Method: SHA-256(seed) -> first 32 bits seed mulberry32 -> Fisher-Yates shuffle of the sorted pool -> take the first N.
// Nothing is excluded or replaced afterwards. A sample is a supplement to a full audit, not a coverage claim.
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { parseArgs } from 'node:util'
const { values } = parseArgs({ options: { seed: { type: 'string' }, enlisted: { type: 'string', default: '3' }, officer: { type: 'string', default: '3' }, warrant: { type: 'string', default: '0' } } })
if (!values.seed) { console.error('--seed required'); process.exit(2) }
const inv = JSON.parse(await readFile('data/reference/corpus/army-code-inventory.json', 'utf8'))
const h = createHash('sha256').update(values.seed).digest()
let a = h.readUInt32BE(0)
const rnd = () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 }
const out = { seed: values.seed, seed_sha256: h.toString('hex'), inventory_as_of: inv.as_of, picks: {} }
for (const [cat, n] of [['enlisted', +values.enlisted], ['officer', +values.officer], ['warrant', +values.warrant]]) {
  const pool = inv.codes.filter(r => r.category === cat && r.status === 'current').map(r => r.code).sort()
  const idx = pool.map((_, i) => i)
  for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]] }
  out.picks[cat] = { pool_size: pool.length, selected: idx.slice(0, n).map(i => pool[i]) }
}
console.log(JSON.stringify(out, null, 1))
