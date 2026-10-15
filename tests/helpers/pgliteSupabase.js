// A real Postgres (PGlite, in-process) behind the small slice of the Supabase
// query API that api/_lib/milReference.js uses. Queries run as the `anon` role,
// so the row-level-security policies in the migrations are genuinely enforced.

import { PGlite } from '@electric-sql/pglite'

export async function newDb() {
  const db = new PGlite()
  // Mirror what Supabase provides: an `anon` role with table privileges (RLS does the gating).
  await db.exec(`create role anon nologin; create role service_role nologin bypassrls;
                 grant usage on schema public to anon, service_role;
                 alter default privileges in schema public grant select on tables to anon;
                 alter default privileges in schema public grant all on tables to service_role;`)
  return db
}

export function supabaseOn(db, role = 'anon') {
  return {
    from: table => new Q(db, table, role),
  }
}

class Q {
  constructor(db, table, role) { Object.assign(this, { db, table, role, cols: '*', where: [], params: [], max: null, single: false }) }
  select(cols = '*') { this.cols = cols; return this }
  eq(c, v) { this.params.push(v); this.where.push(`"${c}" = $${this.params.length}`); return this }
  in(c, vals) { this.params.push(vals.map(String)); this.where.push(`"${c}"::text = any($${this.params.length}::text[])`); return this }
  is(c, v) { this.where.push(v === null ? `"${c}" is null` : `"${c}" = ${v}`); return this }
  like(c, p) { this.params.push(p); this.where.push(`"${c}" like $${this.params.length}`); return this }
  limit(n) { this.max = n; return this }
  maybeSingle() { this.single = true; return this }
  then(resolve, reject) { this.run().then(resolve, reject) }
  async run() {
    try {
      await this.db.exec(`set role ${this.role}`)
      // Serialize like PostgREST does (to_jsonb): date columns arrive as 'YYYY-MM-DD' strings,
      // timestamps as ISO strings. PGlite's own driver would return JS Date objects instead.
      const inner = `select ${this.cols} from public."${this.table}"${this.where.length ? ' where ' + this.where.join(' and ') : ''}${this.max ? ' limit ' + this.max : ''}`
      const res = await this.db.query(`select coalesce(jsonb_agg(to_jsonb(t)), '[]'::jsonb) as j from (${inner}) t`, this.params)
      const rows = res.rows[0].j
      await this.db.exec('reset role')
      if (this.single) return rows.length > 1 ? { data: null, error: { message: 'multiple rows returned' } } : { data: rows[0] ?? null, error: null }
      return { data: rows, error: null }
    } catch (e) {
      await this.db.exec('reset role').catch(() => {})
      const missing = /does not exist/.test(e.message)
      return { data: null, error: { message: e.message, ...(missing ? { code: '42P01' } : {}) } }
    }
  }
}
