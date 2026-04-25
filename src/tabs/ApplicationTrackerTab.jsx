import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const STATUSES = ['Applied', 'Phone Screen', 'Interview Scheduled', 'Offer', 'Rejected', 'No Response']
const STATUS_COLORS = {
  'Applied':              { bg: '#EEF3FC', color: '#1B3A6B' },
  'Phone Screen':         { bg: '#FFF8EC', color: '#8a5100' },
  'Interview Scheduled':  { bg: '#E8F5F3', color: '#0A7868' },
  'Offer':                { bg: '#F0F7EE', color: '#1a6614' },
  'Rejected':             { bg: '#FDF2F2', color: '#7a2d2d' },
  'No Response':          { bg: '#f5f4f0', color: '#5f5e5a' },
}

const LS_KEY = 'tyfms_job_apps'

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]') } catch { return [] }
}
function saveLocal(apps) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(apps)) } catch {}
}

const emptyApp = () => ({
  id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
  company: '', job_title: '', date_applied: new Date().toISOString().slice(0, 10),
  status: 'Applied', follow_up_date: '', notes: '',
})

export default function ApplicationTrackerTab() {
  const { user, supabaseEnabled } = useAuth()
  const useDb = supabaseEnabled && !!supabase && !!user

  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(null)
  const [addingNew, setAddingNew] = useState(false)
  const [newForm, setNewForm] = useState(emptyApp)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    loadApps()
  }, [useDb, user])

  async function loadApps() {
    setLoading(true)
    if (useDb) {
      try {
        const { data, error } = await supabase
          .from('job_applications')
          .select('*')
          .eq('user_id', user.id)
          .order('date_applied', { ascending: false })
        if (!error && data) { setApps(data); setLoading(false); return }
      } catch {}
    }
    setApps(loadLocal())
    setLoading(false)
  }

  async function saveApp(app) {
    setSaving(true)
    if (useDb) {
      try {
        const { data, error } = await supabase.from('job_applications').upsert({
          ...app, user_id: user.id, created_at: app.created_at || new Date().toISOString(),
        }, { onConflict: 'id' }).select().single()
        if (!error && data) {
          setApps(prev => prev.find(a => a.id === data.id)
            ? prev.map(a => a.id === data.id ? data : a)
            : [data, ...prev])
          setSaving(false); return
        }
      } catch {}
    }
    const updated = apps.find(a => a.id === app.id)
      ? apps.map(a => a.id === app.id ? app : a)
      : [app, ...apps]
    setApps(updated)
    saveLocal(updated)
    setSaving(false)
  }

  async function deleteApp(id) {
    if (useDb) {
      try { await supabase.from('job_applications').delete().eq('id', id).eq('user_id', user.id) } catch {}
    }
    const updated = apps.filter(a => a.id !== id)
    setApps(updated)
    saveLocal(updated)
    setDeleteConfirm(null)
  }

  function startEdit(app) {
    setEditingId(app.id)
    setEditForm({ ...app })
  }

  async function saveEdit() {
    if (!editForm) return
    await saveApp(editForm)
    setEditingId(null); setEditForm(null)
  }

  async function addNew() {
    await saveApp({ ...newForm })
    setNewForm(emptyApp())
    setAddingNew(false)
  }

  const totalApps = apps.length
  const interviews = apps.filter(a => a.status === 'Interview Scheduled').length
  const offers = apps.filter(a => a.status === 'Offer').length
  const pending = apps.filter(a => a.status === 'Applied' || a.status === 'Phone Screen' || a.status === 'No Response').length

  const fieldStyle = {
    width: '100%', fontSize: 12, borderRadius: 6, border: '1px solid #d3d1c7',
    padding: '5px 8px', fontFamily: 'inherit', boxSizing: 'border-box', background: '#fff',
  }

  return (
    <div>
      <p className="sec-title">Application tracker</p>
      <p className="sec-sub">
        Log every application. Track where you stand. Never lose a follow-up date.
      </p>

      {/* Summary bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Total applied', val: totalApps, color: '#1B3A6B' },
          { label: 'In progress', val: pending, color: '#C07A28' },
          { label: 'Interviews', val: interviews, color: '#0A7868' },
          { label: 'Offers', val: offers, color: '#16A34A' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #E5E3DC', borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
            <p style={{ fontSize: 24, fontWeight: 800, color: s.color, lineHeight: 1, marginBottom: 4 }}>{s.val}</p>
            <p style={{ fontSize: 11, color: '#5f5e5a' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Add new button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        <button
          onClick={() => { setAddingNew(true); setNewForm(emptyApp()) }}
          style={{ padding: '9px 20px', background: '#1B3A6B', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          + Log application
        </button>
      </div>

      {/* Add new row */}
      {addingNew && (
        <div style={{ background: '#EEF3FC', border: '1px solid #B8C9E8', borderRadius: 12, padding: '16px', marginBottom: 14 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#1B3A6B', marginBottom: 12 }}>New application</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <div>
              <label style={{ fontSize: 11, color: '#5f5e5a', display: 'block', marginBottom: 3 }}>Company *</label>
              <input style={fieldStyle} value={newForm.company} onChange={e => setNewForm(p => ({ ...p, company: e.target.value }))} placeholder="Company name" />
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#5f5e5a', display: 'block', marginBottom: 3 }}>Job title *</label>
              <input style={fieldStyle} value={newForm.job_title} onChange={e => setNewForm(p => ({ ...p, job_title: e.target.value }))} placeholder="Job title" />
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#5f5e5a', display: 'block', marginBottom: 3 }}>Date applied</label>
              <input type="date" style={fieldStyle} value={newForm.date_applied} onChange={e => setNewForm(p => ({ ...p, date_applied: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#5f5e5a', display: 'block', marginBottom: 3 }}>Status</label>
              <select style={fieldStyle} value={newForm.status} onChange={e => setNewForm(p => ({ ...p, status: e.target.value }))}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#5f5e5a', display: 'block', marginBottom: 3 }}>Follow-up date</label>
              <input type="date" style={fieldStyle} value={newForm.follow_up_date} onChange={e => setNewForm(p => ({ ...p, follow_up_date: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#5f5e5a', display: 'block', marginBottom: 3 }}>Notes</label>
              <input style={fieldStyle} value={newForm.notes} onChange={e => setNewForm(p => ({ ...p, notes: e.target.value }))} placeholder="Recruiter name, salary range, etc." />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={addNew} disabled={!newForm.company.trim() || saving} style={{ padding: '7px 18px', background: '#1B3A6B', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={() => setAddingNew(false)} style={{ padding: '7px 14px', background: '#fff', border: '1px solid #d3d1c7', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', color: '#5f5e5a' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '32px 16px', color: '#b4b2a9' }}>
          <p style={{ fontSize: 13 }}>Loading applications…</p>
        </div>
      ) : apps.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 16px', background: '#fff', border: '1px solid #E5E3DC', borderRadius: 16 }}>
          <p style={{ fontSize: 28, marginBottom: 10 }}>📋</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a18', marginBottom: 6 }}>No applications logged yet</p>
          <p style={{ fontSize: 13, color: '#5f5e5a', lineHeight: 1.6 }}>Click "Log application" to start tracking your job search.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {apps.map(app => (
            <div key={app.id} style={{ background: '#fff', border: '1px solid #E5E3DC', borderRadius: 12, padding: '14px 16px' }}>
              {editingId === app.id ? (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                    <input style={fieldStyle} value={editForm.company} onChange={e => setEditForm(p => ({ ...p, company: e.target.value }))} placeholder="Company" />
                    <input style={fieldStyle} value={editForm.job_title} onChange={e => setEditForm(p => ({ ...p, job_title: e.target.value }))} placeholder="Job title" />
                    <input type="date" style={fieldStyle} value={editForm.date_applied} onChange={e => setEditForm(p => ({ ...p, date_applied: e.target.value }))} />
                    <select style={fieldStyle} value={editForm.status} onChange={e => setEditForm(p => ({ ...p, status: e.target.value }))}>
                      {STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                    <input type="date" style={fieldStyle} value={editForm.follow_up_date || ''} onChange={e => setEditForm(p => ({ ...p, follow_up_date: e.target.value }))} placeholder="Follow-up date" />
                    <input style={fieldStyle} value={editForm.notes || ''} onChange={e => setEditForm(p => ({ ...p, notes: e.target.value }))} placeholder="Notes" />
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={saveEdit} disabled={saving} style={{ padding: '5px 14px', background: '#1B3A6B', border: 'none', borderRadius: 7, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                      {saving ? 'Saving…' : 'Save'}
                    </button>
                    <button onClick={() => setEditingId(null)} style={{ padding: '5px 12px', background: '#fff', border: '1px solid #d3d1c7', borderRadius: 7, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', color: '#5f5e5a' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1a18' }}>{app.job_title || '—'}</p>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: STATUS_COLORS[app.status]?.bg || '#f5f4f0', color: STATUS_COLORS[app.status]?.color || '#5f5e5a', fontWeight: 600 }}>{app.status}</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#5f5e5a', marginBottom: 2 }}>{app.company || '—'}</p>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      {app.date_applied && <p style={{ fontSize: 11, color: '#b4b2a9' }}>Applied: {app.date_applied}</p>}
                      {app.follow_up_date && <p style={{ fontSize: 11, color: '#C07A28' }}>Follow-up: {app.follow_up_date}</p>}
                      {app.notes && <p style={{ fontSize: 11, color: '#5f5e5a', fontStyle: 'italic' }}>{app.notes.slice(0, 80)}{app.notes.length > 80 ? '…' : ''}</p>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button onClick={() => startEdit(app)} style={{ padding: '4px 10px', background: '#fff', border: '1px solid #d3d1c7', borderRadius: 7, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', color: '#5f5e5a' }}>Edit</button>
                    {deleteConfirm === app.id ? (
                      <>
                        <button onClick={() => deleteApp(app.id)} style={{ padding: '4px 10px', background: '#a32d2d', border: 'none', borderRadius: 7, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', color: '#fff', fontWeight: 700 }}>Delete</button>
                        <button onClick={() => setDeleteConfirm(null)} style={{ padding: '4px 8px', background: '#fff', border: '1px solid #d3d1c7', borderRadius: 7, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', color: '#5f5e5a' }}>Cancel</button>
                      </>
                    ) : (
                      <button onClick={() => setDeleteConfirm(app.id)} style={{ padding: '4px 8px', background: '#fff', border: '1px solid #d3d1c7', borderRadius: 7, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', color: '#a32d2d' }}>×</button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!useDb && (
        <p style={{ fontSize: 11, color: '#b4b2a9', marginTop: 16, lineHeight: 1.6, textAlign: 'center' }}>
          Sign in to sync applications across devices. Data is currently saved locally to this browser.
        </p>
      )}
    </div>
  )
}
