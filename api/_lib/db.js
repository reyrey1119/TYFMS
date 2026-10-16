// Shared Supabase client for server handlers that read public reference data.
// Prefers the service role; falls back to the anon key (the reference tables
// are readable by it). Returns null when nothing is configured.

import { createClient } from '@supabase/supabase-js'

let client = null

export function getSupabase() {
  if (client) return client
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) return null
  try {
    client = createClient(url, key, { auth: { persistSession: false } })
    return client
  } catch {
    return null
  }
}
