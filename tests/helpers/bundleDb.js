// Loads REAL import bundles (data/reference/bundles) into the in-memory fake
// Supabase so the real retrieval code can run against real extracted text.
//
// NOTE: bundles import as 'unreviewed' (never served). These helpers mark the
// source 'approved' purely to exercise retrieval; production rows stay
// unreviewed until a person approves them.

import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fakeSupabase } from './fakeSupabase.js'

const BUNDLES = new URL('../../data/reference/bundles/', import.meta.url).pathname

// The three career-guide sources that existed before DA PAM 611-21 was imported (42A, 36B, 36A).
export const PILOT = ['army-cmf42', 'army-cmf36', 'army-fc']

export async function loadBundles(ids) {
  const files = (await readdir(BUNDLES)).filter(f => f.endsWith('.bundle.json')).filter(f => !ids || ids.some(id => f.startsWith(id)))
  return Promise.all(files.map(async f => JSON.parse(await readFile(path.join(BUNDLES, f), 'utf8'))))
}

export function dbFromBundles(bundles, { approved = true, checkedAt = '2026-10-15T00:00:00Z' } = {}) {
  const reference_sources = bundles.map(b => ({ ...b.source, review_status: approved ? 'approved' : 'unreviewed', reviewed_at: checkedAt, superseded_by: null }))
  const reference_passages = bundles.flatMap(b => b.passages.map(p => ({ ...p, source_id: b.source.id })))
  return fakeSupabase({ reference_sources, reference_passages })
}
