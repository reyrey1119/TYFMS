// PDF → normalized lines, with page provenance.
//
// Admin-time only. Nothing in the app's request path imports this file.
//
// Fidelity rules:
//   * Text is never rewritten. The only changes are whitespace normalization
//     (tabs and non-breaking spaces become single spaces) and dropping a lone
//     number at the top of a page, which is the printed page number.
//   * Every line keeps the PDF page index it came from. Page numbers stored in
//     the registry are PDF page indices, not printed page numbers.

import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'

export async function readPdf(path) {
  const buffer = await readFile(path)
  return { buffer, sha256: createHash('sha256').update(buffer).digest('hex') }
}

export async function extractPages(buffer) {
  const { PDFParse } = await import('pdf-parse')
  const parser = new PDFParse({ data: new Uint8Array(buffer) })
  const res = await parser.getText()
  return res.pages.map(p => ({ num: p.num, text: p.text }))
}

// One canonical whitespace form, used by BOTH the importer and the verifier so
// "the passage appears in the PDF" means exactly the same thing in each.
export function normalizeSpace(s) {
  return String(s).replace(/[\t ]+/g, ' ').replace(/\s+/g, ' ').trim()
}

export function toLines(pages, { skipLinePatterns = [] } = {}) {
  const skips = skipLinePatterns.map(p => new RegExp(p, 'i'))
  const lines = []
  const printedPages = {}
  const skipped = []
  for (const page of pages) {
    const raw = page.text.split('\n').map(normalizeSpace).filter(Boolean)
    let list = raw
    // A lone 1-3 digit number as the first line of a page is its printed page number.
    if (list.length && /^\d{1,3}$/.test(list[0])) {
      printedPages[page.num] = list[0]
      list = list.slice(1)
    }
    for (const text of list) {
      if (skips.some(re => re.test(text))) { skipped.push({ page: page.num, text }); continue }
      lines.push({ page: page.num, text })
    }
  }
  return { lines, printedPages, skipped }
}

// The whole document as one normalized string per PDF page (used to verify that
// every stored passage really appears in the source).
export function pageTexts(pages) {
  return Object.fromEntries(pages.map(p => [p.num, normalizeSpace(p.text.replace(/^\s*\d{1,3}\s*\n/, ''))]))
}
