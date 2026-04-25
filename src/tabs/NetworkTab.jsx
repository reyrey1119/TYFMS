import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import FunFact from '../components/FunFact'

// Supabase: ALTER TABLE profiles ADD COLUMN IF NOT EXISTS specialties jsonb DEFAULT '[]'::jsonb;

const BRANCHES = ['Army', 'Air Force', 'Navy', 'Marine Corps', 'Coast Guard', 'Space Force']
const ROLE_CLASS = { Mentor: 'bg', Mentee: 'bb', Both: 'ba' }
const SPECIALTIES = [
  'Cybersecurity', 'Logistics & Ops', 'Leadership & Mgmt',
  'Healthcare & Medical', 'Finance & Budget', 'Intelligence & Analysis',
  'Technology & IT', 'Project Management',
]
const AVATAR_COLORS = ['#1B3A6B', '#0A7868', '#C07A28', '#7B3F91', '#a32d2d', '#2d6a8a', '#4a7c59', '#8a4a2d']

function Avatar({ name, size = 44 }) {
  const initials = (name || '?').trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase()
  const color = AVATAR_COLORS[(name || ' ').charCodeAt(0) % AVATAR_COLORS.length]
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: color, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontSize: Math.round(size * 0.35), fontWeight: 700, letterSpacing: '.02em',
    }}>
      {initials}
    </div>
  )
}

function getContactLink(contact) {
  if (!contact) return null
  if (contact.includes('@')) return { href: `mailto:${contact}?subject=TYFMS Network — Connecting with a fellow veteran`, label: 'Send email', external: false }
  if (contact.startsWith('http')) return { href: contact, label: 'View profile', external: true }
  return null
}

export default function NetworkTab() {
  const { user, supabaseEnabled } = useAuth()
  const useDb = supabaseEnabled && !!supabase

  const [stats, setStats] = useState(null)
  const [name, setName] = useState('')
  const [branch, setBranch] = useState('Army')
  const [mos, setMos] = useState('')
  const [role, setRole] = useState('Mentor')
  const [bio, setBio] = useState('')
  const [contact, setContact] = useState('')
  const [specialties, setSpecialties] = useState([])
  const [joinMsg, setJoinMsg] = useState(null)
  const [joining, setJoining] = useState(false)

  const [filterMos, setFilterMos] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [filterSpecialty, setFilterSpecialty] = useState('')
  const [profiles, setProfiles] = useState([])
  const [searchDone, setSearchDone] = useState(false)
  const [searching, setSearching] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState(null)

  useEffect(() => {
    if (!useDb) return
    async function fetchStats() {
      try {
        const [mRes, tRes] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }).in('role', ['Mentor', 'Both']),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).in('role', ['Mentee', 'Both']),
        ])
        setStats({ mentors: mRes.count || 0, mentees: tRes.count || 0 })
      } catch {}
    }
    fetchStats()
  }, [useDb])

  function toggleSpecialty(s) {
    setSpecialties(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  async function joinNetwork() {
    if (!name.trim() || !mos.trim() || !contact.trim()) {
      setJoinMsg({ error: true, text: 'Please fill in display name, MOS/AFSC, and contact info.' })
      return
    }
    setJoining(true)
    const profile = {
      name: name.trim(), branch, mos: mos.trim().toUpperCase(),
      role, bio: bio.trim(), contact: contact.trim(), specialties,
    }

    if (useDb && user) {
      const { error } = await supabase.from('profiles').upsert({ ...profile, user_id: user.id })
      if (error) { setJoinMsg({ error: true, text: error.message }); setJoining(false); return }
    } else {
      const existing = JSON.parse(localStorage.getItem('vtg_network') || '[]')
      existing.push({ ...profile, id: Date.now(), ts: Date.now() })
      localStorage.setItem('vtg_network', JSON.stringify(existing))
    }

    setJoinMsg({ error: false, text: 'You are now in the network. Others can find you by searching your MOS/AFSC.' })
    setName(''); setMos(''); setBio(''); setContact(''); setSpecialties([])
    setJoining(false)
    // Refresh stats
    if (useDb) {
      const [mRes, tRes] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).in('role', ['Mentor', 'Both']),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).in('role', ['Mentee', 'Both']),
      ])
      setStats({ mentors: mRes.count || 0, mentees: tRes.count || 0 })
    }
  }

  async function searchNetwork() {
    setSearching(true)
    if (useDb) {
      let q = supabase.from('profiles').select('*')
      if (filterMos.trim()) q = q.ilike('mos', `%${filterMos.trim()}%`)
      if (filterRole) {
        if (filterRole === 'Both') q = q.eq('role', 'Both')
        else q = q.in('role', [filterRole, 'Both'])
      }
      const { data, error } = await q.order('created_at', { ascending: false })
      let results = error ? [] : (data || [])
      if (filterSpecialty) {
        results = results.filter(p => Array.isArray(p.specialties) && p.specialties.includes(filterSpecialty))
      }
      setProfiles(results)
    } else {
      const all = JSON.parse(localStorage.getItem('vtg_network') || '[]')
      const fmos = filterMos.trim().toUpperCase()
      setProfiles(
        all.filter(p => {
          const mosMatch = !fmos || p.mos.includes(fmos) || fmos.includes(p.mos)
          const roleMatch = !filterRole || p.role === filterRole || p.role === 'Both'
          const specMatch = !filterSpecialty || (Array.isArray(p.specialties) && p.specialties.includes(filterSpecialty))
          return mosMatch && roleMatch && specMatch
        }).sort((a, b) => b.ts - a.ts)
      )
    }
    setSearchDone(true)
    setSearching(false)
  }

  const canJoin = !useDb || !!user
  const mentorCount = profiles.filter(p => p.role === 'Mentor' || p.role === 'Both').length
  const menteeCount = profiles.filter(p => p.role === 'Mentee' || p.role === 'Both').length

  return (
    <div>
      {/* Intro section */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#b4b2a9', marginBottom: 4 }}>Building Your Support</p>
        <p className="sec-title">Find your people.</p>
        <p style={{ fontSize: 18, fontWeight: 700, color: '#1B3A6B', marginBottom: 14, lineHeight: 1.3 }}>
          Veterans who have been exactly where you are.
        </p>
        <p className="sec-sub" style={{ marginBottom: 20 }}>
          The TYFMS network connects veterans by MOS, AFSC, and rate — because the best transition
          advice comes from someone who wore the same uniform and made the same leap. Whether you
          are looking for a guide or ready to pay it forward, you belong here.
          {useDb && ' Profiles are shared across all TYFMS users.'}
        </p>

        {/* Benefit cards */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
          {[
            { icon: '🎯', title: 'Same MOS connections', desc: 'Find veterans who held your exact role and already made the transition' },
            { icon: '🗺️', title: 'Real career guidance', desc: 'Learn what actually worked — not textbook advice, but lived experience' },
            { icon: '💬', title: 'Veteran-to-veteran honesty', desc: 'No corporate fluff. Direct, practical, real talk from people who get it' },
          ].map(b => (
            <div key={b.title} style={{ flex: '1 1 160px', background: '#fff', border: '1px solid #E5E3DC', borderRadius: 12, padding: '14px 16px' }}>
              <p style={{ fontSize: 22, marginBottom: 8 }}>{b.icon}</p>
              <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, color: '#1a1a18' }}>{b.title}</p>
              <p style={{ fontSize: 12, color: '#5f5e5a', lineHeight: 1.55 }}>{b.desc}</p>
            </div>
          ))}
        </div>

        {/* Live stats */}
        {stats !== null && (stats.mentors > 0 || stats.mentees > 0) && (
          <div style={{ display: 'flex', background: '#fff', border: '1px solid #E5E3DC', borderRadius: 12, overflow: 'hidden' }}>
            {[
              { value: stats.mentors, label: 'Mentors', color: '#1B3A6B' },
              { value: stats.mentees, label: 'Mentees', color: '#0A7868' },
              { value: stats.mentors + stats.mentees, label: 'Total veterans', color: '#C07A28' },
            ].map((s, i) => (
              <div key={s.label} style={{ flex: 1, padding: '16px 12px', textAlign: 'center', borderLeft: i > 0 ? '1px solid #E5E3DC' : 'none' }}>
                <p style={{ fontSize: 28, fontWeight: 700, color: s.color, lineHeight: 1, marginBottom: 4 }}>{s.value}</p>
                <p style={{ fontSize: 11, color: '#5f5e5a' }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {!useDb && (
        <div className="warn">
          <p>Your display name and contact info will be visible to others. Do not share information you are not comfortable making public.</p>
        </div>
      )}
      {useDb && !user && (
        <div className="warn">
          <p>Sign in to join the network and make your profile visible to other veterans. You can search without signing in.</p>
        </div>
      )}

      <div className="grid-2" style={{ gap: 16 }}>
        {/* Join form */}
        <div>
          <div className="card">
            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Join the network</p>
            <label>Display name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. SSG Rodriguez (ret.)" style={{ marginBottom: 10 }} />
            <label>Branch</label>
            <select value={branch} onChange={e => setBranch(e.target.value)} style={{ marginBottom: 10 }}>
              {BRANCHES.map(b => <option key={b}>{b}</option>)}
            </select>
            <label>MOS / AFSC / Rate</label>
            <input type="text" value={mos} onChange={e => setMos(e.target.value)} placeholder="e.g. 11A, 6F0X1, IT" style={{ marginBottom: 10 }} />
            <label style={{ marginBottom: 6 }}>I am joining as</label>
            <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
              {['Mentor', 'Mentee', 'Both'].map(r => (
                <button key={r} className={`rbtn${role === r ? ' on' : ''}`} onClick={() => setRole(r)}>{r}</button>
              ))}
            </div>
            <label style={{ display: 'block', marginBottom: 6 }}>
              Specialties{' '}
              <span style={{ fontSize: 11, color: '#b4b2a9', fontWeight: 400 }}>(select all that apply)</span>
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
              {SPECIALTIES.map(s => (
                <button
                  key={s} type="button" onClick={() => toggleSpecialty(s)}
                  style={{
                    padding: '3px 9px', fontSize: 11, borderRadius: 20,
                    border: specialties.includes(s) ? '1px solid #1B3A6B' : '1px solid #d3d1c7',
                    background: specialties.includes(s) ? '#e8eef7' : '#fff',
                    color: specialties.includes(s) ? '#1B3A6B' : '#5f5e5a',
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            <label>Brief intro <span style={{ fontSize: 11, color: '#b4b2a9', fontWeight: 400 }}>(100 chars max)</span></label>
            <input type="text" value={bio} onChange={e => setBio(e.target.value)} maxLength={100} placeholder="e.g. 11A, 8 years, now in cybersecurity" style={{ marginBottom: 10 }} />
            <label>How to reach you</label>
            <input type="text" value={contact} onChange={e => setContact(e.target.value)} placeholder="LinkedIn URL or email address" style={{ marginBottom: 14 }} />
            <button className="btn-b" onClick={joinNetwork} disabled={!canJoin || joining}>
              {!canJoin ? 'Sign in to join' : joining ? 'Joining...' : 'Join the network'}
            </button>
            {joinMsg && (
              <p style={{ fontSize: 12, marginTop: 8, color: joinMsg.error ? '#a32d2d' : '#0A7868' }}>{joinMsg.text}</p>
            )}
          </div>
        </div>

        {/* Search */}
        <div>
          <div className="card" style={{ marginBottom: 10 }}>
            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Browse the network</p>
            <label>Filter by MOS / AFSC / Rate</label>
            <input
              type="text" value={filterMos}
              onChange={e => setFilterMos(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && searchNetwork()}
              placeholder="e.g. 11A, or leave blank for all"
              style={{ marginBottom: 8 }}
            />
            <label>Filter by role</label>
            <select value={filterRole} onChange={e => setFilterRole(e.target.value)} style={{ marginBottom: 8 }}>
              <option value="">All roles</option>
              <option value="Mentor">Mentors only</option>
              <option value="Mentee">Mentees only</option>
              <option value="Both">Open to both</option>
            </select>
            <label>Filter by specialty</label>
            <select value={filterSpecialty} onChange={e => setFilterSpecialty(e.target.value)} style={{ marginBottom: 12 }}>
              <option value="">All specialties</option>
              {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button className="btn-g" onClick={searchNetwork} disabled={searching}>
              {searching ? 'Searching...' : 'Search'}
            </button>
          </div>

          {searchDone && profiles.length > 0 && (
            <p style={{ fontSize: 11, color: '#b4b2a9', marginBottom: 10 }}>
              {mentorCount} mentor{mentorCount !== 1 ? 's' : ''} · {menteeCount} mentee{menteeCount !== 1 ? 's' : ''}
            </p>
          )}

          {searchDone && profiles.length === 0 && (
            <p style={{ fontSize: 13, color: '#5f5e5a', padding: '.5rem 0' }}>
              No matches found. Try broadening your search, or be the first to join.
            </p>
          )}

          {profiles.map((p, i) => {
            const link = getContactLink(p.contact)
            return (
              <div
                key={p.id || i}
                className="card"
                style={{ marginBottom: 8, cursor: 'pointer' }}
                onClick={() => setSelectedProfile(p)}
              >
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
                  <Avatar name={p.name} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a18', marginBottom: 2 }}>{p.name}</p>
                      <span className={ROLE_CLASS[p.role] || 'bb'} style={{ flexShrink: 0, fontSize: 10, padding: '2px 7px' }}>{p.role}</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#5f5e5a' }}>{p.branch} · {p.mos}</p>
                  </div>
                </div>
                {p.bio && <p style={{ fontSize: 13, color: '#5f5e5a', marginBottom: 8, lineHeight: 1.5 }}>{p.bio}</p>}
                {Array.isArray(p.specialties) && p.specialties.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                    {p.specialties.map(s => (
                      <span key={s} style={{ fontSize: 10, padding: '2px 7px', background: '#f0f4ff', color: '#1B3A6B', borderRadius: 20, border: '1px solid #d0dbf0' }}>{s}</span>
                    ))}
                  </div>
                )}
                {link && (
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    style={{ textDecoration: 'none' }}
                  >
                    <button style={{ padding: '5px 14px', background: '#1B3A6B', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                      {link.label}
                    </button>
                  </a>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <FunFact />

      {/* Profile detail modal */}
      {selectedProfile && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={() => setSelectedProfile(null)}
        >
          <div
            style={{ background: '#fff', borderRadius: 16, padding: '28px 24px', maxWidth: 420, width: '100%', maxHeight: '85vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16 }}>
              <Avatar name={selectedProfile.name} size={56} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 18, fontWeight: 700, color: '#1a1a18', marginBottom: 4 }}>{selectedProfile.name}</p>
                <p style={{ fontSize: 13, color: '#5f5e5a', marginBottom: 8 }}>{selectedProfile.branch} · {selectedProfile.mos}</p>
                <span className={ROLE_CLASS[selectedProfile.role] || 'bb'}>{selectedProfile.role}</span>
              </div>
              <button onClick={() => setSelectedProfile(null)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#888', lineHeight: 1, padding: 0, flexShrink: 0 }}>×</button>
            </div>

            {selectedProfile.bio && (
              <p style={{ fontSize: 14, color: '#1a1a18', lineHeight: 1.7, marginBottom: 16 }}>{selectedProfile.bio}</p>
            )}

            {Array.isArray(selectedProfile.specialties) && selectedProfile.specialties.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 11, color: '#b4b2a9', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Specialties</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {selectedProfile.specialties.map(s => (
                    <span key={s} style={{ fontSize: 11, padding: '3px 10px', background: '#f0f4ff', color: '#1B3A6B', borderRadius: 20, border: '1px solid #d0dbf0' }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {(() => {
              const link = getContactLink(selectedProfile.contact)
              if (!link) return null
              return (
                <a href={link.href} target={link.external ? '_blank' : undefined} rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <button style={{ width: '100%', padding: '11px', background: '#1B3A6B', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>
                    {link.label}
                  </button>
                </a>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
