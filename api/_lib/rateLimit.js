// Shared rate limiting for the public AI endpoints. Backed by the
// check_rate_limit() Postgres function from supabase/migrations/003_rate_limits.sql
// (atomic — safe under concurrent requests). Files under api/_lib/ are not
// deployed as their own Vercel Functions (Vercel ignores underscore-prefixed
// paths inside /api), so this is safe to import from handlers.

let cachedClient = null

async function getSupabaseAdmin() {
  if (cachedClient) return cachedClient
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
  if (!url || !key) return null
  try {
    const { createClient } = await import('@supabase/supabase-js')
    cachedClient = createClient(url, key, { auth: { persistSession: false } })
    return cachedClient
  } catch {
    return null
  }
}

export function clientIp(req) {
  const fwd = req.headers['x-forwarded-for']
  if (typeof fwd === 'string' && fwd.trim()) return fwd.split(',')[0].trim()
  return req.socket?.remoteAddress || 'unknown'
}

// Returns true if the request should proceed, false if it should be rejected.
// Fails OPEN (allows the request) if Supabase is unreachable — a rate limiter
// outage should never be why the whole site's AI features go down.
export async function checkRateLimit(bucket, req, { windowSeconds = 600, max = 20 } = {}) {
  const sb = await getSupabaseAdmin()
  if (!sb) return true
  try {
    const key = `${bucket}:${clientIp(req)}`
    const { data, error } = await sb.rpc('check_rate_limit', {
      p_key: key,
      p_window_seconds: windowSeconds,
      p_max_count: max,
    })
    if (error) return true
    return data !== false
  } catch {
    return true
  }
}

// Drop-in guard for handlers: call at the top of the function.
// Returns true if the request was rejected (caller should `return` immediately).
export async function rejectIfRateLimited(res, bucket, req, opts) {
  const ok = await checkRateLimit(bucket, req, opts)
  if (!ok) {
    res.status(429).json({ error: 'Too many requests. Please wait a few minutes and try again.' })
    return true
  }
  return false
}
