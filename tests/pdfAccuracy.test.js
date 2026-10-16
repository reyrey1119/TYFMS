// PUBLICATION ACCURACY tests — stored passages vs. the actual PDF files.
//
// This is a different question from tests/realdata.test.js (which tests the
// retrieval LOGIC over the stored data). Here the PDFs are re-read independently
// and compared with what was stored. Needs the PDFs:
//
//   CMF42_PDF=~/Downloads/cmf-42-da-pam-600-25-30-sep-25.pdf \
//   CMF36_PDF=/path/cmf-36-da-pam-600-25-19-jul-24.pdf \
//   FC_PDF=/path/fc-10sep25.pdf  npm test
//
//   CLASS611_DIR=/path/to/Classification-611-21  npm test     (DA PAM 611-21 chapters 10c, 8b and 3)
//
// Without a PDF its tests are SKIPPED (shown as skipped, never as passed).

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { extractPages, normalizeSpace } from '../scripts/lib/pdfLines.js'

const DOCS = [
  { env: 'CMF42_PDF', bundle: 'army-cmf42-dapam600-25-2025-09-30',
    // Rank-section headings, located by searching the PDF itself (not the parser).
    headings: [['1. Private - Specialist/Corporal', 7], ['2. Sergeant', 7], ['3. Staff Sergeant', 8], ['4. Sergeant First Class', 10], ['5. Master Sergeant / First Sergeant', 11], ['6. Sergeant Major/Command Sergeant Major', 13]],
    bandOf: { '1. Private': 'E-1..E-4', '2. Sergeant': 'E-5', '3. Staff': 'E-6', '4. Sergeant First': 'E-7', '5. Master': 'E-8', '6. Sergeant Major': 'E-9' } },
  { env: 'CMF36_PDF', bundle: 'army-cmf36-dapam600-25-2024-07-19', headings: [], bandOf: {} },
  { env: 'FC_PDF', bundle: 'army-fc-officer-2025-09-10', headings: [], bandOf: {} },
]

// DA PAM 611-21: three chapter PDFs in one folder.
const CLASS611 = process.env.CLASS611_DIR
for (const [bundle, file] of [['army-611-21-enlisted-ch10c', 'chapter-10c-enlisted-mos-specifications.pdf'], ['army-611-21-warrant-ch8b', 'chapter-8b-wo-specifications.pdf'], ['army-611-21-officer-ch3', 'chapter-3-officer-branches-and-fas.pdf']]) {
  test(`${bundle}: PDF is the exact file that was imported, and every passage is verbatim on the pages it cites`, { skip: !CLASS611 && 'set CLASS611_DIR to the Classification-611-21 folder to run this' }, () => {
    const r = spawnSync(process.execPath, ['scripts/verify-reference-bundle.js', '--bundle', `data/reference/bundles/${bundle}.bundle.json`, '--pdf', `${CLASS611}/${file}`, '--out', '/tmp/tyfms-verify'], { encoding: 'utf8' })
    assert.equal(r.status, 0, r.stdout.slice(-1500) + r.stderr)
    assert.match(r.stdout, /PDF checksum matches bundle: true/)
    const m = r.stdout.match(/passages verbatim on claimed PDF pages: (\d+)\/(\d+)/)
    assert.ok(m && m[1] === m[2], `every passage must be verbatim: ${m && m[0]}`)
    assert.match(r.stdout, /duplicate passages: 0/)
  })
}

for (const d of DOCS) {
  const path = process.env[d.env]
  const skip = !path && `set ${d.env} to the PDF path to run this`

  test(`${d.bundle}: PDF is the exact file that was imported, and passes the independent verifier`, { skip }, async () => {
    const r = spawnSync(process.execPath, ['scripts/verify-reference-bundle.js', '--bundle', `data/reference/bundles/${d.bundle}.bundle.json`, '--pdf', path, '--out', '/tmp/tyfms-verify'], { encoding: 'utf8' })
    assert.equal(r.status, 0, r.stdout.slice(-1500) + r.stderr)
    assert.match(r.stdout, /PDF checksum matches bundle: true/)
    const m = r.stdout.match(/passages verbatim on claimed PDF pages: (\d+)\/(\d+)/)
    assert.ok(m && m[1] === m[2], `every passage must be verbatim: ${m && m[0]}`)
  })

  if (d.headings.length) {
    test(`${d.bundle}: each rank section starts on the PDF page where the PDF itself prints its heading`, { skip }, async () => {
      const pages = await extractPages(await readFile(path))
      const bundle = JSON.parse(await readFile(`data/reference/bundles/${d.bundle}.bundle.json`, 'utf8'))
      for (const [heading, expectedPage] of d.headings) {
        const found = pages.find(p => normalizeSpace(p.text).includes(normalizeSpace(heading)) && p.num >= 6)
        assert.equal(found?.num, expectedPage, `PDF prints "${heading}" on page ${found?.num}, expected ${expectedPage}`)
        const key = Object.keys(d.bandOf).find(k => heading.startsWith(k))
        const stored = bundle.passages.filter(p => p.chapter.startsWith('Chapter 4') && p.rank_band === d.bandOf[key])
        assert.ok(stored.length >= 5, `${heading}: stored passages`)
        assert.equal(Math.min(...stored.map(p => p.pdf_page_start)), expectedPage, `${heading}: stored section starts on the printed page`)
      }
    })
  }
}
