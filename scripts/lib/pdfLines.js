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

// Running headers and footers ("Army Medical Department (CMF 68) Career Progression Plan", "... Effective FY27 18"): a line whose
// text (digits masked) is the same at the same position from the top or bottom of at least a quarter of the pages. They are not part
// of any paragraph, but the PDF text layer puts them in the middle of a passage that crosses a page break.
const maskRunning = s => normalizeSpace(s).replace(/\d+/g, '#')
const EDGE_TOP = 4, EDGE_BOTTOM = 3
export function findRunningLines(pages) {
  const counts = new Map()
  for (const page of pages) {
    const lines = page.text.split('\n').map(normalizeSpace).filter(Boolean)
    lines.forEach((l, i) => {
      const side = i < EDGE_TOP ? `T${i}` : lines.length - 1 - i < EDGE_BOTTOM ? `B${lines.length - 1 - i}` : null
      if (side) { const k = `${side}|${maskRunning(l)}`; counts.set(k, (counts.get(k) || 0) + 1) }
    })
  }
  const need = Math.max(4, Math.ceil(pages.length * 0.25))
  return [...counts].filter(([, c]) => c >= need).map(([k]) => k).sort()
}
export function dropRunningLines(lines, running) {
  if (!running?.length) return { kept: lines, dropped: [] }
  const set = new Set(running)
  const kept = [], dropped = []
  lines.forEach((l, i) => {
    const side = i < EDGE_TOP ? `T${i}` : lines.length - 1 - i < EDGE_BOTTOM ? `B${lines.length - 1 - i}` : null
    if (side && set.has(`${side}|${maskRunning(l)}`)) dropped.push(l); else kept.push(l)
  })
  return { kept, dropped }
}

export function toLines(pages, { skipLinePatterns = [], skipRawPatterns = [], skipRegions = [], runningLines = [] } = {}) {
  const skips = skipLinePatterns.map(p => new RegExp(p, 'i'))
  // tested on the line as extracted, with its tab characters (table cells are separated by tabs)
  const rawSkips = skipRawPatterns.map(p => new RegExp(p))
  const lines = []
  const printedPages = {}
  const skipped = []
  for (const page of pages) {
    // A table whose cells cannot be told apart once flattened: skip from the line matching `from` up to (not including) `until`.
    let inRegion = null
    const regionFilter = l => {
      if (!inRegion) { const r = skipRegions.find(r => r.page === page.num && new RegExp(r.from).test(l)); if (r) inRegion = r; else return true }
      if (new RegExp(inRegion.until).test(l) && !new RegExp(inRegion.from).test(l)) { inRegion = null; return true }
      skipped.push({ page: page.num, text: normalizeSpace(l), why: 'table row' })
      return false
    }
    const raw = page.text.split('\n').filter(regionFilter).filter(l => { if (rawSkips.some(re => re.test(l))) { skipped.push({ page: page.num, text: normalizeSpace(l), why: 'table row' }); return false } return true }).map(normalizeSpace).filter(Boolean)
    const rr = dropRunningLines(raw, runningLines)
    // a lone number at the top of a page that repeats on the pages is the printed page number (kept for citations)
    if (raw.length && /^\d{1,3}$/.test(raw[0]) && rr.dropped.includes(raw[0])) printedPages[page.num] = raw[0]
    for (const d of rr.dropped) if (!(/^\d{1,3}$/.test(d) && printedPages[page.num] === d)) skipped.push({ page: page.num, text: d, why: 'running header/footer' })
    let list = rr.kept
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
