import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import FunFact from '../components/FunFact'

const ROADMAP = [
  {
    id: 'p1', num: 1, range: 'Month 1', title: 'Paperwork & Benefits', color: '#1B3A6B', weight: 1,
    milestones: [
      { id: 'm1', text: 'File your VA disability claim at va.gov' },
      { id: 'm2', text: 'Obtain certified copies of your DD-214' },
      { id: 'm3', text: 'Set up your eBenefits / VA.gov account' },
      { id: 'm4', text: 'Apply for VA healthcare enrollment' },
      { id: 'm5', text: 'Review TRICARE transition options' },
    ],
  },
  {
    id: 'p2', num: 2, range: 'Months 2–3', title: 'Identity & Skills Inventory', color: '#C07A28', weight: 2,
    milestones: [
      { id: 'm6', text: 'Complete the Identity Guide conversation' },
      { id: 'm7', text: 'Use the Skills Translator to map your MOS to civilian roles' },
      { id: 'm8', text: 'Update your LinkedIn profile with translated experience' },
      { id: 'm9', text: 'Research 2–3 target industries or sectors' },
      { id: 'm10', text: 'Connect with veterans 6–12 months ahead in transition' },
    ],
  },
  {
    id: 'p3', num: 3, range: 'Months 3–6', title: 'Education or Job Search', color: '#ba7517', weight: 1,
    milestones: [
      { id: 'm11', text: 'Apply to GI Bill schools or target companies' },
      { id: 'm12', text: 'Attend one career fair or veteran hiring event' },
      { id: 'm13', text: 'Join a Student Veterans of America chapter or veteran network' },
      { id: 'm14', text: 'Set daily job search or study targets' },
      { id: 'm15', text: 'Complete 5 informational interviews in your target field' },
    ],
  },
  {
    id: 'p4', num: 4, range: 'Months 6–12', title: 'First Civilian Role', color: '#7c3aad', weight: 1,
    milestones: [
      { id: 'm16', text: 'Set 30-60-90 day goals in your new role' },
      { id: 'm17', text: 'Find a mentor inside or outside the organization' },
      { id: 'm18', text: 'Build one meaningful peer relationship in your new field' },
      { id: 'm19', text: 'Complete your first performance review or check-in' },
      { id: 'm20', text: 'Stay connected with your veteran network monthly' },
    ],
  },
  {
    id: 'p5', num: 5, range: 'Months 12–18+', title: 'Long-term Growth', color: '#a32d2d', weight: 1,
    milestones: [
      { id: 'm21', text: 'Reflect on how your professional identity has evolved' },
      { id: 'm22', text: 'Celebrate concrete wins and milestones achieved' },
      { id: 'm23', text: 'Mentor a veteran who is a few months behind you' },
      { id: 'm24', text: 'Update your goals for the next phase of growth' },
      { id: 'm25', text: 'Share your story in a veteran community or network' },
    ],
  },
]

const TOTAL_WEIGHT = ROADMAP.reduce((sum, p) => sum + p.milestones.length * p.weight, 0)

const CATS = ['Career', 'Education', 'Identity', 'Benefits', 'Networking', 'Personal']
const CAT_CLASS = { Career: 'ba', Education: 'bg', Identity: 'bb', Benefits: 'bb', Networking: 'bg', Personal: 'ba' }

export default function TrackerTab() {
  const { user, supabaseEnabled } = useAuth()
  const useDb = supabaseEnabled && !!supabase && !!user

  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vtg_roadmap_checks') || '[]') } catch { return [] }
  })
  const [encourage, setEncourage] = useState(null) // { text, milestone }
  const [encLoading, setEncLoading] = useState(false)

  const [goals, setGoals] = useState([])
  const [title, setTitle] = useState('')
  const [cat, setCat] = useState('Career')

  const loadGoals = useCallback(async () => {
    if (useDb) {
      const { data } = await supabase.from('goals').select('*').eq('user_id', user.id).order('created_at', { ascending: true })
      setGoals(data || [])
    } else {
      setGoals(JSON.parse(localStorage.getItem('vtg_goals') || '[]'))
    }
  }, [useDb, user])

  useEffect(() => { loadGoals() }, [loadGoals])

  function saveChecked(next) {
    setChecked(next)
    try { localStorage.setItem('vtg_roadmap_checks', JSON.stringify(next)) } catch {}
  }

  async function toggleMilestone(milestone, phase) {
    const isChecked = checked.includes(milestone.id)
    const next = isChecked
      ? checked.filter(id => id !== milestone.id)
      : [...checked, milestone.id]
    saveChecked(next)

    if (!isChecked) {
      setEncLoading(true)
      setEncourage(null)
      try {
        const r = await fetch('/api/tracker', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'milestone', milestone: milestone.text, phase: phase.title }),
        })
        const data = await r.json()
        if (data.encouragement) setEncourage({ text: data.encouragement, milestone: milestone.text })
      } catch {}
      setEncLoading(false)
    }
  }

  const doneWeight = ROADMAP.reduce((sum, phase) => {
    const phaseDone = phase.milestones.filter(m => checked.includes(m.id)).length
    return sum + phaseDone * phase.weight
  }, 0)
  const readinessPct = Math.round((doneWeight / TOTAL_WEIGHT) * 100)

  const totalDone = checked.length

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

  return (
    <div>
      <p className="sec-title">Progress tracker</p>
      <p className="sec-sub">
        Your structured transition roadmap — 25 milestones across 5 phases. Check them off as you go.
        Phase 2 (Identity &amp; Skills) carries double weight in your readiness score because it's the
        work most veterans skip and most regret skipping.
      </p>

      {/* Readiness score */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600 }}>Transition readiness score</p>
            <p style={{ fontSize: 11, color: '#5f5e5a' }}>{totalDone} of 25 milestones complete</p>
          </div>
          <p style={{ fontSize: 26, fontWeight: 800, color: readinessPct === 100 ? '#C07A28' : '#1a1a18', letterSpacing: '-.02em' }}>
            {readinessPct}%
          </p>
        </div>
        <div style={{ height: 10, background: '#f5f4f0', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${readinessPct}%`,
            background: readinessPct === 100
              ? '#C07A28'
              : 'linear-gradient(90deg, #C07A28, #e8972e)',
            borderRadius: 8,
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      {/* Encouragement banner */}
      {(encourage || encLoading) && (
        <div style={{
          background: '#1B3A6B', borderRadius: 12, padding: '14px 18px',
          marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <div style={{ flex: 1 }}>
            {encLoading ? (
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>Writing your encouragement…</p>
            ) : (
              <>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>
                  Milestone complete
                </p>
                <p style={{ fontSize: 13, color: '#fff', lineHeight: 1.7 }}>{encourage.text}</p>
              </>
            )}
          </div>
          {!encLoading && (
            <button
              onClick={() => setEncourage(null)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.65)', cursor: 'pointer', fontSize: 20, lineHeight: 1, flexShrink: 0, padding: 0 }}
            >×</button>
          )}
        </div>
      )}

      {/* Roadmap phases */}
      {ROADMAP.map(phase => {
        const phaseDone = phase.milestones.filter(m => checked.includes(m.id)).length
        return (
          <div key={phase.id} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{
                width: 28, height: 28, borderRadius: '50%', background: phase.color,
                color: '#fff', fontWeight: 700, fontSize: 13, display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {phase.num}
              </span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, color: phase.color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                  {phase.range}{phase.weight > 1 ? ' · 2× weight' : ''}
                </p>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a18' }}>{phase.title}</p>
              </div>
              <span style={{ fontSize: 12, color: '#5f5e5a', flexShrink: 0 }}>{phaseDone}/{phase.milestones.length}</span>
            </div>

            <div className="card" style={{ borderLeft: `3px solid ${phase.color}`, borderRadius: '0 12px 12px 0', padding: '12px 16px' }}>
              {phase.milestones.map(m => {
                const done = checked.includes(m.id)
                return (
                  <div
                    key={m.id}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid #f0ede6', cursor: 'pointer' }}
                    onClick={() => toggleMilestone(m, phase)}
                  >
                    <div className={`goal-check${done ? ' done' : ''}`} style={{ cursor: 'pointer' }}>
                      {done ? '✓' : ''}
                    </div>
                    <p style={{
                      fontSize: 13, color: done ? '#b4b2a9' : '#1a1a18', lineHeight: 1.5,
                      textDecoration: done ? 'line-through' : 'none', flex: 1,
                    }}>
                      {m.text}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* 4S Schlossberg self-assessment */}
      <div style={{ marginTop: 28, marginBottom: 8, borderTop: '1px solid #d3d1c7', paddingTop: 24 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a18', marginBottom: 4 }}>4S Framework progress</p>
        <p style={{ fontSize: 13, color: '#5f5e5a', marginBottom: 16, lineHeight: 1.6 }}>
          Schlossberg's four factors — the backbone of this app. Check each one as you address it.
        </p>
      </div>
      {[
        {
          id: 's-situation', factor: 'Situation', color: '#1B3A6B', icon: '🧭',
          desc: 'You understand where you are in your transition.',
          items: [
            { id: 'ss1', text: 'Named what has changed most since separation' },
            { id: 'ss2', text: 'Identified your 3 biggest transition stressors' },
            { id: 'ss3', text: 'Completed the "Find Your Path" archetype assessment' },
          ],
        },
        {
          id: 's-self', factor: 'Self', color: '#C07A28', icon: '💬',
          desc: 'You know your identity, values, and strengths beyond your rank.',
          items: [
            { id: 'se1', text: 'Completed at least one Identity Guide conversation' },
            { id: 'se2', text: 'Generated your professional identity statement' },
            { id: 'se3', text: 'Used the Skills Translator to map your MOS to civilian roles' },
          ],
        },
        {
          id: 's-support', factor: 'Support', color: '#0A7868', icon: '🤝',
          desc: 'You have people around you who can help.',
          items: [
            { id: 'su1', text: 'Identified at least one civilian advocate in your corner' },
            { id: 'su2', text: 'Connected with one veteran ahead of you in transition' },
            { id: 'su3', text: 'Joined or browsed the TYFMS Veteran Network' },
          ],
        },
        {
          id: 's-strategies', factor: 'Strategies', color: '#7c3aad', icon: '📋',
          desc: 'You are taking concrete action with the right tools.',
          items: [
            { id: 'st1', text: 'Built at least one version of your civilian resume' },
            { id: 'st2', text: 'Submitted at least one job or education application' },
            { id: 'st3', text: 'Scheduled or completed one informational interview' },
          ],
        },
      ].map(factor => {
        const factorDone = factor.items.filter(m => checked.includes(m.id)).length
        return (
          <div key={factor.id} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{factor.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, color: factor.color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                  {factor.factor}
                </p>
                <p style={{ fontSize: 13, color: '#5f5e5a', lineHeight: 1.4 }}>{factor.desc}</p>
              </div>
              <span style={{ fontSize: 12, color: '#5f5e5a', flexShrink: 0 }}>{factorDone}/{factor.items.length}</span>
            </div>
            <div className="card" style={{ borderLeft: `3px solid ${factor.color}`, borderRadius: '0 12px 12px 0', padding: '12px 16px' }}>
              {factor.items.map(m => {
                const done = checked.includes(m.id)
                return (
                  <div
                    key={m.id}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid #f0ede6', cursor: 'pointer' }}
                    onClick={() => {
                      const next = done ? checked.filter(id => id !== m.id) : [...checked, m.id]
                      saveChecked(next)
                    }}
                  >
                    <div className={`goal-check${done ? ' done' : ''}`} style={{ cursor: 'pointer' }}>
                      {done ? '✓' : ''}
                    </div>
                    <p style={{
                      fontSize: 13, color: done ? '#b4b2a9' : '#1a1a18', lineHeight: 1.5,
                      textDecoration: done ? 'line-through' : 'none', flex: 1,
                    }}>
                      {m.text}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Custom goals */}
      <div style={{ marginTop: 28, marginBottom: 8, borderTop: '1px solid #d3d1c7', paddingTop: 24 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a18', marginBottom: 4 }}>Custom goals</p>
        <p style={{ fontSize: 13, color: '#5f5e5a', marginBottom: 16 }}>
          Add goals specific to your situation — things the roadmap above doesn't cover.
          {!useDb && ' Sign in to sync these across devices.'}
        </p>
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
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

      {goals.length === 0 && (
        <p style={{ fontSize: 13, color: '#b4b2a9', marginBottom: 20 }}>No custom goals yet.</p>
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

      <FunFact />
    </div>
  )
}
