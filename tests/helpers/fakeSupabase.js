// Minimal in-memory stand-in for the slice of the Supabase query builder that
// api/_lib/milReference.js uses: select/eq/in/is/like/limit/maybeSingle, awaited.

export function fakeSupabase(tables, { missing = [], failing = [] } = {}) {
  const calls = []
  return {
    calls,
    from(name) {
      return new Query(name, tables, missing, failing, calls)
    },
  }
}

class Query {
  constructor(name, tables, missing, failing, calls) {
    this.name = name
    this.tables = tables
    this.missing = missing
    this.failing = failing
    this.calls = calls
    this.filters = []
    this.max = null
    this.single = false
  }
  select() { return this }
  eq(col, val) { this.filters.push(r => r[col] === val); return this }
  in(col, vals) { this.filters.push(r => vals.includes(r[col])); return this }
  is(col, val) { this.filters.push(r => (val === null ? r[col] == null : r[col] === val)); return this }
  like(col, pattern) {
    const prefix = pattern.replace(/%$/, '')
    this.filters.push(r => String(r[col] || '').startsWith(prefix))
    return this
  }
  limit(n) { this.max = n; return this }
  maybeSingle() { this.single = true; return this }
  then(resolve, reject) {
    try { resolve(this.run()) } catch (e) { reject(e) }
  }
  run() {
    this.calls.push(this.name)
    if (this.missing.includes(this.name)) return { data: null, error: { code: '42P01', message: `relation "${this.name}" does not exist` } }
    if (this.failing.includes(this.name)) return { data: null, error: { message: 'connection reset' } }
    let rows = (this.tables[this.name] || []).filter(r => this.filters.every(f => f(r)))
    if (this.max != null) rows = rows.slice(0, this.max)
    if (this.single) {
      if (rows.length > 1) return { data: null, error: { message: 'multiple rows returned' } }
      return { data: rows[0] || null, error: null }
    }
    return { data: rows, error: null }
  }
}
