const ADMIN_EMAIL = 'reyrey1119@gmail.com'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const token = (req.headers.authorization || '').replace('Bearer ', '').trim()
  if (!token) return res.status(401).json({ error: 'Missing auth token.' })

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({ error: 'Not configured.' })
  }

  try {
    const verifyRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { 'Authorization': `Bearer ${token}`, 'apikey': serviceKey },
    })
    if (!verifyRes.ok) return res.status(401).json({ error: 'Invalid or expired session.' })

    const userInfo = await verifyRes.json()
    if (userInfo.email !== ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Forbidden.' })
    }

    const dataRes = await fetch(
      `${supabaseUrl}/rest/v1/user_feedback?select=*&order=created_at.desc`,
      {
        headers: {
          'Authorization': `Bearer ${serviceKey}`,
          'apikey': serviceKey,
          'Content-Type': 'application/json',
        },
      }
    )
    if (!dataRes.ok) throw new Error('DB query failed')

    return res.status(200).json(await dataRes.json())
  } catch {
    return res.status(500).json({ error: 'Could not load feedback.' })
  }
}
