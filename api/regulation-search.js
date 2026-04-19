// GET/POST /api/regulation-search?q=... or { query: "..." }
// Full-text search against 38 CFR regulation chunks stored in Supabase.
// Returns top 3 hits formatted as "Per 38 CFR Part X, § X.X: [text]"

async function getSupabase() {
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const url = process.env.VITE_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY
    if (!url || !key) return null
    return createClient(url, key, { auth: { persistSession: false } })
  } catch { return null }
}

export async function searchRegulationChunks(query, limit = 3) {
  if (!query?.trim()) return []
  const supabase = await getSupabase()
  if (!supabase) return []
  try {
    // Use PostgreSQL websearch syntax — handles phrases, boolean operators, stemming
    const { data, error } = await supabase
      .from('regulation_chunks')
      .select('part, part_num, section, content, source_file')
      .textSearch('content_tsv', query, { type: 'websearch', config: 'english' })
      .order('part_num', { ascending: true })
      .limit(limit)
    if (error || !data?.length) return []
    return data
  } catch { return [] }
}

export default async function handler(req, res) {
  const query = req.method === 'POST'
    ? (req.body?.query || '')
    : (req.query?.q || '')

  if (!query.trim()) {
    return res.status(400).json({ error: 'query required' })
  }

  const chunks = await searchRegulationChunks(query)

  const results = chunks.map(c => ({
    citation: `38 CFR ${c.part}${c.section ? ', ' + c.section : ''}`,
    part: c.part,
    section: c.section || '',
    text: c.content,
    formatted: `Per 38 CFR ${c.part}${c.section ? ', ' + c.section : ''}: ${c.content.slice(0, 400)}${c.content.length > 400 ? '…' : ''}`,
  }))

  return res.status(200).json({ results, count: results.length })
}
