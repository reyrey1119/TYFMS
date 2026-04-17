import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import FunFact from '../components/FunFact'

const BRANCHES = ['Army', 'Air Force', 'Navy', 'Marine Corps', 'Coast Guard', 'Space Force']
const ROLE_CLASS = { Mentor: 'bg', Mentee: 'bb', Both: 'ba' }

export default function NetworkTab() {
  const { user, supabaseEnabled } = useAuth()

  const [name, setName] = useState('')
  const [branch, setBranch] = useState('Army')
  const [mos, setMos] = useState('')
  const [role, setRole] = useState('Mentor')
  const [bio, setBio] = useState('')
  const [contact, setContact] = useState('')
  const [joinMsg, setJoinMsg] = useState(null)

  const [filterMos, setFilterMos] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [profiles, setProfiles] = useState([])
  const [searchDone, setSearchDone] = useState(false)
  const [searching, setSearching] = useState(false)

  const useDb = supabaseEnabled && !!supabase

  async function joinNetwork() {
    if (!name.trim() || !mos.trim() || !contact.trim()) {
      setJoinMsg({ error: true, text: 'Please fill in display name, MOS/AFSC, and contact info.' })
      return
    }
    const profile = { name: name.trim(), branch, mos: mos.trim().toUpperCase(), role, bio: bio.trim(), contact: contact.trim() }

    if (useDb && user) {
      const { error } = await supabase.from('profiles').upsert({ ...profile, user_id: user.id })
      if (error) { setJoinMsg({ error: true, text: error.message }); return }
    } else {
      const existing = JSON.parse(localStorage.getItem('vtg_network') || '[]')
      existing.push({ ...profile, id: Date.now(), ts: Date.now() })
      localStorage.setItem('vtg_network', JSON.stringify(existing))
    }

    setJoinMsg({ error: false, text: 'You are now in the network. Others can find you by searching your MOS/AFSC.' })
    setName(''); setMos(''); setBio(''); setContact('')
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
      setProfiles(error ? [] : (data || []))
    } else {
      const all = JSON.parse(localStorage.getItem('vtg_network') || '[]')
      const fmos = filterMos.trim().toUpperCase()
      setProfiles(
        all.filter(p => {
          const mosMatch = !fmos || p.mos.includes(fmos) || fmos.includes(p.mos)
          const roleMatch = !filterRole || p.role === filterRole || p.role === 'Both'
          return mosMatch && roleMatch
        }).sort((a, b) => b.ts - a.ts)
      )
    }
    setSearchDone(true)
    setSearching(false)
  }

  const canJoin = !useDb || !!user

  return (
    <div>
      <div style={{ width: '100%', maxHeight: 320, borderRadius: 12, marginBottom: 20, overflow: 'hidden', background: '#f5f4f0', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
        <img src="/networking.png" alt="Peer networking" style={{ width: '100%', maxHeight: 320, objectFit: 'contain', objectPosition: 'top', display: 'block' }} />
      </div>
      <p className="sec-title">Peer networking</p>
      <p className="sec-sub">
        Connect with veterans who share your MOS, AFSC, or rate. Join as a mentor if you are further
        along in your transition. Join as a mentee if you are looking for someone who has been where you are.
        {useDb && ' Profiles are shared across all TYFMS users.'}
      </p>

      {!useDb && (
        <div className="warn">
          <p>Your display name and contact info will be visible to others who use this tool on the same device or shared environment. Do not share information you are not comfortable making public.</p>
        </div>
      )}
      {useDb && !user && (
        <div className="warn">
          <p>Sign in to join the network and make your profile visible to other veterans. You can search without signing in.</p>
        </div>
      )}

      <div className="grid-2" style={{ gap: 16 }}>
        <div>
          <div className="card">
            <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 14 }}>Join the network</p>
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
            <label>Brief intro (100 chars max)</label>
            <input type="text" value={bio} onChange={e => setBio(e.target.value)} maxLength={100} placeholder="e.g. 11A, 8 years, now in cybersecurity" style={{ marginBottom: 10 }} />
            <label>How to reach you</label>
            <input type="text" value={contact} onChange={e => setContact(e.target.value)} placeholder="LinkedIn URL or email" style={{ marginBottom: 14 }} />
            <button className="btn-b" onClick={joinNetwork} disabled={!canJoin}>
              {!canJoin ? 'Sign in to join' : 'Join the network'}
            </button>
            {joinMsg && (
              <p style={{ fontSize: 12, marginTop: 8, color: joinMsg.error ? '#a32d2d' : '#0f6e56' }}>{joinMsg.text}</p>
            )}
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: 10 }}>
            <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Browse the network</p>
            <label>Filter by MOS / AFSC / Rate</label>
            <input
              type="text"
              value={filterMos}
              onChange={e => setFilterMos(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && searchNetwork()}
              placeholder="e.g. 11A, or leave blank for all"
              style={{ marginBottom: 8 }}
            />
            <label>Filter by role</label>
            <select value={filterRole} onChange={e => setFilterRole(e.target.value)} style={{ marginBottom: 12 }}>
              <option value="">All</option>
              <option value="Mentor">Mentors only</option>
              <option value="Mentee">Mentees only</option>
              <option value="Both">Open to both</option>
            </select>
            <button className="btn-g" onClick={searchNetwork} disabled={searching}>
              {searching ? 'Searching...' : 'Search'}
            </button>
          </div>

          {searchDone && profiles.length === 0 && (
            <p style={{ fontSize: 13, color: '#5f5e5a', padding: '.5rem 0' }}>
              No matches found. Try broadening your search, or be the first to join.
            </p>
          )}

          {profiles.map((p, i) => (
            <div key={p.id || i} className="card" style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{p.name}</p>
                  <p style={{ fontSize: 12, color: '#5f5e5a' }}>{p.branch} · {p.mos}</p>
                </div>
                <span className={ROLE_CLASS[p.role] || 'bb'}>{p.role}</span>
              </div>
              {p.bio && <p style={{ fontSize: 13, color: '#5f5e5a', marginBottom: 8, lineHeight: 1.5 }}>{p.bio}</p>}
              <p style={{ fontSize: 12, color: '#185fa5', wordBreak: 'break-all' }}>{p.contact}</p>
            </div>
          ))}
        </div>
      </div>

      <FunFact />
    </div>
  )
}
