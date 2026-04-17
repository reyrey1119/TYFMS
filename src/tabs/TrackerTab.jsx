import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import FunFact from '../components/FunFact'

const CATS = ['Career', 'Education', 'Identity', 'Benefits', 'Networking', 'Personal']
const CAT_CLASS = { Career: 'ba', Education: 'bg', Identity: 'bb', Benefits: 'bb', Networking: 'bg', Personal: 'ba' }

const MILESTONES = [
  { pct: 25, emoji: '🌱', msg: "You're building momentum — 25% complete. The hardest part is starting, and you already did." },
  { pct: 50, emoji: '⚡', msg: "Halfway there. 50% done — you are doing the real work of transition." },
  { pct: 75, emoji: '🔥', msg: "75% complete. You can see the finish line. Keep going." },
  { pct: 100, emoji: '🎖️', msg: "Mission accomplished. Every goal checked off. This is what owning your transition looks like." },
]

export default function TrackerTab() {
  const { user, supabaseEnabled } = useAuth()
  const [goals, setGoals] = useState([])
  const [title, setTitle] = useState('')
  const [cat, setCat] = useState('Career')
  const [milestone, setMilestone] = useState(null)
  const [lastMilestonePct, setLastMilestonePct] = useState(null)
  const [encouragement, setEncouragement] = useState('')
  const [encLoading, setEncLoading] = useState(false)

  const useDb = supabaseEnabled && !!supabase && !!user

  const loadGoals = useCallback(async () => {
    if (useDb) {
      const { data } = await supabase.from('goals').select('*').eq('user_id', user.id).order('created_at', { ascending: true })
      setGoals(data || [])
    } else {
      setGoals(JSON.parse(localStorage.getItem('vtg_goals') || '[]'))
    }
  }, [useDb, user])

  useEffect(() => { loadGoals() }, [loadGoals])

  function checkMilestone(updatedGoals) {
    if (updatedGoals.length < 2) return
    const done = updatedGoals.filter(g => g.done).length
    const pct = Math.round((done / updatedGoals.length) * 100)
    const hit = MILESTONES.find(m => m.pct === pct)
    if (hit && pct !== lastMilestonePct) {
      setMilestone(hit)
      setLastMilestonePct(pct)
    }
  }

  async function addGoal() {
    if (!title.trim()) return
    const payload = { title: title.trim(), category: cat, done: false }
    if (useDb) {
      const { data } = await supabase.from('goals').insert({ ...payload, user_id: user.id }).select().single()
      if (data) setGoals(prev => [...prev, data])
    } else {
      const g = { ...payload, id: Date.now(), cat }
      const updated = [...goals, g]
      setGoals(updated)
      localStorage.setItem('vtg_goals', JSON.stringify(updated))
    }
    setTitle('')
  }

  async function toggleGoal(goal) {
    const newDone = !goal.done
    let updated
    if (useDb) {
      await supabase.from('goals').update({ done: newDone }).eq('id', goal.id)
      updated = goals.map(g => g.id === goal.id ? { ...g, done: newDone } : g)
      setGoals(updated)
    } else {
      updated = goals.map(g => g.id === goal.id ? { ...g, done: newDone } : g)
      setGoals(updated)
      localStorage.setItem('vtg_goals', JSON.stringify(updated))
    }
    if (newDone) checkMilestone(updated)
  }

  async function deleteGoal(id) {
    if (useDb) {
      await supabase.from('goals').delete().eq('id', id)
      setGoals(prev => prev.filter(g => g.id !== id))
    } else {
      const updated = goals.filter(g => g.id !== id)
      setGoals(updated)
      localStorage.setItem('vtg_goals', JSON.stringify(updated))
    }
  }

  async function getEncouragement() {
    setEncLoading(true)
    setEncouragement('')
    try {
      const r = await fetch('/api/encouragement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goals: goals.map(g => ({ done: g.done, title: g.title })) }),
      })
      const data = await r.json()
      if (data.encouragement) setEncouragement(data.encouragement)
    } catch {}
    setEncLoading(false)
  }

  const done = goals.filter(g => g.done).length
  const pct = goals.length ? Math.round((done / goals.length) * 100) : 0

  return (
    <div>
      <p className="sec-title">Progress tracker</p>
      <p className="sec-sub">
        {useDb
          ? 'Set goals for your transition and mark them off as you go. Your goals are saved to your account.'
          : 'Set goals for your transition and mark them off as you go. Sign in to sync your goals across devices.'}
      </p>

      {/* Milestone celebration */}
      {milestone && (
        <div style={{
          background: '#0f6e56', color: '#fff', borderRadius: 12, padding: '16px 20px',
          marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <span style={{ fontSize: 32, flexShrink: 0 }}>{milestone.emoji}</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>Milestone reached!</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.88)', lineHeight: 1.5 }}>{milestone.msg}</p>
          </div>
          <button
            onClick={() => setMilestone(null)}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 22, lineHeight: 1, flexShrink: 0 }}
          >×</button>
        </div>
      )}

      {/* Progress bar */}
      {goals.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <p style={{ fontSize: 13, fontWeight: 500 }}>Overall completion</p>
            <p style={{ fontSize: 14, fontWeight: 700, color: pct === 100 ? '#0f6e56' : '#1a1a18' }}>
              {pct}%
            </p>
          </div>
          <div style={{ height: 12, background: '#f5f4f0', borderRadius: 8, overflow: 'hidden', marginBottom: 6 }}>
            <div style={{
              height: '100%',
              width: `${pct}%`,
              background: pct === 100
                ? 'linear-gradient(90deg, #0f6e56, #22c55e)'
                : 'linear-gradient(90deg, #0f6e56, #34d399)',
              borderRadius: 8,
              transition: 'width 0.5s ease',
            }} />
          </div>
          <p style={{ fontSize: 12, color: '#5f5e5a' }}>{done} of {goals.length} goals complete</p>
        </div>
      )}

      <div className="card" style={{ marginBottom: 14 }}>
        <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Add a new goal</p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addGoal()}
            placeholder="Describe your goal..."
            style={{ flex: 1, minWidth: 180 }}
          />
          <select value={cat} onChange={e => setCat(e.target.value)} style={{ minWidth: 130 }}>
            {CATS.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button className="btn-a" onClick={addGoal}>Add goal</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <p style={{ fontSize: 13, fontWeight: 500 }}>Your goals</p>
        {goals.length === 0 && <p style={{ fontSize: 12, color: '#5f5e5a' }}>No goals yet</p>}
      </div>

      {goals.length === 0 && (
        <p style={{ fontSize: 14, color: '#5f5e5a', textAlign: 'center', padding: '2rem 0' }}>
          Add your first goal to start tracking your transition.
        </p>
      )}

      {goals.map(g => (
        <div key={g.id} className="goal-item" style={{ opacity: g.done ? 0.55 : 1 }}>
          <button className={`goal-check${g.done ? ' done' : ''}`} onClick={() => toggleGoal(g)}>
            {g.done ? '✓' : ''}
          </button>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, ...(g.done ? { textDecoration: 'line-through', color: '#888' } : {}) }}>
              {g.title}
            </p>
            <span className={CAT_CLASS[g.category || g.cat] || 'bb'} style={{ fontSize: 11, padding: '2px 8px' }}>
              {g.category || g.cat}
            </span>
          </div>
          <button className="goal-del" onClick={() => deleteGoal(g.id)}>×</button>
        </div>
      ))}

      {/* AI weekly encouragement */}
      {goals.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <button className="btn-b" onClick={getEncouragement} disabled={encLoading}>
            {encLoading ? 'Writing your encouragement...' : "Get this week's encouragement"}
          </button>
          {encouragement && (
            <div className="ai-feedback" style={{ marginTop: 12 }}>
              <p className="label">Weekly encouragement</p>
              <p>{encouragement}</p>
            </div>
          )}
        </div>
      )}

      <FunFact />
    </div>
  )
}
