import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const CATS = ['Career', 'Education', 'Identity', 'Benefits', 'Networking', 'Personal']
const CAT_CLASS = { Career: 'ba', Education: 'bg', Identity: 'bb', Benefits: 'bb', Networking: 'bg', Personal: 'ba' }

export default function TrackerTab() {
  const { user, supabaseEnabled } = useAuth()
  const [goals, setGoals] = useState([])
  const [title, setTitle] = useState('')
  const [cat, setCat] = useState('Career')

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
    if (useDb) {
      await supabase.from('goals').update({ done: newDone }).eq('id', goal.id)
      setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, done: newDone } : g))
    } else {
      const updated = goals.map(g => g.id === goal.id ? { ...g, done: newDone } : g)
      setGoals(updated)
      localStorage.setItem('vtg_goals', JSON.stringify(updated))
    }
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

  const done = goals.filter(g => g.done).length

  return (
    <div>
      <p className="sec-title">Progress tracker</p>
      <p className="sec-sub">
        {useDb
          ? 'Set goals for your transition and mark them off as you go. Your goals are saved to your account.'
          : 'Set goals for your transition and mark them off as you go. Sign in to sync your goals across devices.'}
      </p>

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
        <p style={{ fontSize: 12, color: '#5f5e5a' }}>
          {goals.length ? `${done} of ${goals.length} complete` : 'No goals yet'}
        </p>
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
            <p style={{
              fontSize: 14, fontWeight: 500, marginBottom: 4,
              ...(g.done ? { textDecoration: 'line-through', color: '#888' } : {})
            }}>
              {g.title}
            </p>
            <span className={CAT_CLASS[g.category || g.cat] || 'bb'} style={{ fontSize: 11, padding: '2px 8px' }}>
              {g.category || g.cat}
            </span>
          </div>
          <button className="goal-del" onClick={() => deleteGoal(g.id)}>×</button>
        </div>
      ))}
    </div>
  )
}
