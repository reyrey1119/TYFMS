export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const token = (req.headers.authorization || '').replace('Bearer ', '').trim()
  if (!token) return res.status(401).json({ error: 'Missing auth token.' })

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({ error: 'Account deletion not configured on this server.' })
  }

  try {
    // Verify token and resolve user ID
    const verifyRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { 'Authorization': `Bearer ${token}`, 'apikey': serviceKey },
    })
    if (!verifyRes.ok) return res.status(401).json({ error: 'Invalid or expired session.' })
    const { id: userId } = await verifyRes.json()
    if (!userId) return res.status(401).json({ error: 'Could not verify user.' })

    // Hard-delete via Supabase admin API
    const deleteRes = await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${serviceKey}`, 'apikey': serviceKey },
    })

    if (!deleteRes.ok) {
      const err = await deleteRes.json().catch(() => ({}))
      return res.status(500).json({ error: err.message || 'Could not delete account.' })
    }

    return res.status(200).json({ success: true })
  } catch {
    return res.status(500).json({ error: 'Could not delete account. Try again.' })
  }
}
