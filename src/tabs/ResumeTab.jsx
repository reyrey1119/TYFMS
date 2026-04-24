import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import AdUnit from '../components/AdUnit'

// ── Constants ─────────────────────────────────────────────────────────────────

const BRANCHES = ['Army', 'Air Force', 'Navy', 'Marine Corps', 'Coast Guard', 'Space Force']
const YOS_OPTS = ['', 'Less than 1 year', '1–2 years', '3–4 years', '5–6 years', '7–8 years', '9–10 years', '11–15 years', '16–20 years', '20+ years']
const RANKS = { Enlisted: ['E-1','E-2','E-3','E-4','E-5','E-6','E-7','E-8','E-9'], Warrant: ['W-1','W-2','W-3','W-4','W-5'], Officer: ['O-1','O-2','O-3','O-4','O-5','O-6','O-7','O-8','O-9','O-10'] }
const DEGREES = ['High School Diploma', 'Some College', 'Associate', 'Bachelor', 'Master', 'Doctoral', 'Professional']
const TEMPLATES = [
  { id: 'classic', label: 'Classic', desc: 'Two-column header, clean section rules, conservative' },
  { id: 'modern',  label: 'Modern',  desc: 'Navy accent bar, bold headings, skills as tags' },
  { id: 'federal', label: 'Federal', desc: 'USAJobs format, detailed and formal' },
]
const STEPS = [
  { n: 1, label: 'Personal' }, { n: 2, label: 'Target Job' }, { n: 3, label: 'Military' },
  { n: 4, label: 'Experience' }, { n: 5, label: 'Education' }, { n: 6, label: 'Skills' },
  { n: 7, label: 'Summary' }, { n: 8, label: 'Review' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

const eid = () => Date.now() + Math.random()
const emptyJob = () => ({ id: eid(), title: '', employer: '', dates: '', description: '' })
const emptyEdu = () => ({ id: eid(), school: '', degreeType: '', field: '', gradYear: '', gpa: '' })

function initForm(prefill) {
  return {
    name: '', email: '', phone: '', location: '', linkedin: '',
    jobUrl: '', jobDescription: '',
    branch: prefill?.branch || 'Army',
    mos: prefill?.mos || '',
    rank: prefill?.rank || '',
    yos: prefill?.yos || '',
    clearance: '',
    targetTitle: '', targetCompany: '', prevJobs: [],
    education: [],
    awards: '', additionalSkills: '', certifications: '',
    summaryTone: '', additionalContext: '',
  }
}

function parseSections(text) {
  if (!text) return null
  const DIVIDER = /^─{5,}$/
  const lines = text.split('\n')
  let header = [], sections = [], i = 0
  while (i < lines.length && !DIVIDER.test(lines[i].trim())) { header.push(lines[i]); i++ }
  while (i < lines.length) {
    if (DIVIDER.test(lines[i].trim())) {
      i++
      if (i >= lines.length) break
      const title = lines[i].trim(); i++
      if (i < lines.length && DIVIDER.test(lines[i].trim())) i++
      const contentLines = []
      while (i < lines.length && !DIVIDER.test(lines[i].trim())) { contentLines.push(lines[i]); i++ }
      if (title) sections.push({ title, content: contentLines.join('\n').trim() })
    } else i++
  }
  return { header: header.filter(l => l.trim()), sections }
}

// ── Template Renderers ────────────────────────────────────────────────────────

function ClassicResume({ parsed, form }) {
  const { header = [], sections = [] } = parsed || {}
  const name = header[0] || form.name || '[YOUR NAME]'
  const contact = header.slice(1).filter(Boolean).join('\n')
  return (
    <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: '#1a1a18', fontSize: 10, lineHeight: 1.45 }}>
      <div style={{ textAlign: 'center', borderBottom: '2px solid #1a1a18', paddingBottom: 10, marginBottom: 12 }}>
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-.01em', marginBottom: 3 }}>{name}</div>
        {contact && <div style={{ fontSize: 9.5, color: '#555', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{contact}</div>}
      </div>
      {sections.map(sec => (
        <div key={sec.title} style={{ marginBottom: 11 }}>
          <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', borderBottom: '1px solid #1a1a18', paddingBottom: 2, marginBottom: 5 }}>{sec.title}</div>
          <div style={{ fontSize: 9.5, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{sec.content}</div>
        </div>
      ))}
    </div>
  )
}

function ModernResume({ parsed, form }) {
  const { header = [], sections = [] } = parsed || {}
  const name = header[0] || form.name || '[YOUR NAME]'
  const contact = header.slice(1).filter(Boolean).join(' · ')
  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: '#1a1a18', fontSize: 10, lineHeight: 1.45, borderLeft: '4px solid #1B3A6B', paddingLeft: 14 }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#1B3A6B', letterSpacing: '-.02em', marginBottom: 2 }}>{name}</div>
        {contact && <div style={{ fontSize: 9.5, color: '#5f5e5a' }}>{contact}</div>}
        <div style={{ borderTop: '1.5px solid #1B3A6B', marginTop: 8 }} />
      </div>
      {sections.map(sec => (
        <div key={sec.title} style={{ marginBottom: 11 }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.12em', color: '#1B3A6B', marginBottom: 5 }}>{sec.title}</div>
          {sec.title === 'CORE COMPETENCIES' ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {sec.content.split('\n').flatMap(l => l.split(/\s{3,}/).map(s => s.trim())).filter(Boolean).map((skill, i) => (
                <span key={i} style={{ background: '#EEF3FC', color: '#1B3A6B', fontSize: 8.5, padding: '2px 6px', borderRadius: 4 }}>{skill}</span>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: 9.5, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{sec.content}</div>
          )}
        </div>
      ))}
    </div>
  )
}

function FederalResume({ parsed, form }) {
  const { header = [], sections = [] } = parsed || {}
  const name = header[0] || form.name || '[YOUR NAME]'
  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: '#1a1a18', fontSize: 10, lineHeight: 1.5 }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{name}</div>
        {header.slice(1).filter(Boolean).map((l, i) => <div key={i} style={{ fontSize: 9.5, color: '#333' }}>{l}</div>)}
        {form.clearance && form.clearance !== '' && (
          <div style={{ fontSize: 9.5, fontWeight: 700, color: '#1B3A6B', marginTop: 2 }}>Security Clearance: {form.clearance}</div>
        )}
      </div>
      <div style={{ borderTop: '1px solid #333', marginBottom: 10 }} />
      {sections.map(sec => (
        <div key={sec.title} style={{ marginBottom: 11 }}>
          <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', background: '#f0f0f0', padding: '2px 6px', marginBottom: 5, display: 'inline-block' }}>{sec.title}</div>
          <div style={{ fontSize: 9.5, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{sec.content}</div>
        </div>
      ))}
    </div>
  )
}

function SkeletonPreview({ form, template }) {
  const isModern = template === 'modern'
  const isFederal = template === 'federal'
  const accentColor = isModern ? '#1B3A6B' : '#1a1a18'
  return (
    <div style={{ fontFamily: isModern ? '-apple-system, sans-serif' : 'Georgia, serif', color: '#1a1a18', fontSize: 10, lineHeight: 1.45, ...(isModern ? { borderLeft: '4px solid #1B3A6B', paddingLeft: 14 } : {}) }}>
      <div style={{ textAlign: isModern || isFederal ? 'left' : 'center', marginBottom: 12, borderBottom: `${isFederal ? 1 : 2}px solid ${accentColor}`, paddingBottom: 10 }}>
        <div style={{ fontSize: isFederal ? 13 : 18, fontWeight: 700, color: isModern ? '#1B3A6B' : '#1a1a18', marginBottom: 3 }}>
          {form.name || <span style={{ color: '#d3d1c7' }}>Your Name</span>}
        </div>
        <div style={{ fontSize: 9.5, color: '#999', lineHeight: 1.5 }}>
          {[form.location, form.email, form.phone].filter(Boolean).join(' · ') || <span style={{ color: '#d3d1c7' }}>City, State · email · phone</span>}
        </div>
        {(form.branch || form.mos) && (
          <div style={{ fontSize: 9.5, color: isModern ? '#1B3A6B' : '#555', marginTop: 3, fontStyle: isFederal ? 'normal' : 'italic' }}>
            {form.branch}{form.mos ? ` · ${form.mos}` : ''}{form.rank ? ` · ${form.rank}` : ''}
          </div>
        )}
      </div>
      {['Immediate Value Offered', 'Professional Summary', 'Core Competencies', 'Professional Experience', 'Education'].map((sec, si) => (
        <div key={sec} style={{ marginBottom: 11 }}>
          <div style={{
            fontSize: isFederal ? 9 : 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em',
            color: isModern ? '#1B3A6B' : accentColor, marginBottom: 4,
            ...(isFederal ? { background: '#f0f0f0', padding: '2px 6px', display: 'inline-block' } : { borderBottom: `1px solid ${accentColor}`, paddingBottom: 2 }),
          }}>{sec}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[75, 90, si % 2 === 0 ? 60 : 80].map((w, i) => (
              <div key={i} className="skeleton-block" style={{ height: 7, width: `${w}%`, borderRadius: 3 }} />
            ))}
          </div>
        </div>
      ))}
      <div style={{ marginTop: 16, padding: '10px', background: '#FAFAF8', borderRadius: 8, border: '1px dashed #d3d1c7', textAlign: 'center' }}>
        <p style={{ fontSize: 9.5, color: '#b4b2a9' }}>Complete all steps, then Generate to see your full resume here</p>
      </div>
    </div>
  )
}

function ResumePreviewPanel({ form, template, resume }) {
  const parsed = resume ? parseSections(resume) : null
  const content = () => {
    if (!parsed) return <SkeletonPreview form={form} template={template} />
    if (template === 'modern') return <ModernResume parsed={parsed} form={form} />
    if (template === 'federal') return <FederalResume parsed={parsed} form={form} />
    return <ClassicResume parsed={parsed} form={form} />
  }
  return (
    <div>
      <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#b4b2a9', marginBottom: 10 }}>
        Preview · {TEMPLATES.find(t => t.id === template)?.label || 'Classic'}
      </p>
      <div
        id="resume-print-target"
        style={{ background: '#fff', border: '1px solid #E5E3DC', borderRadius: 12, padding: '20px 22px', maxHeight: 720, overflowY: 'auto', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
      >
        {content()}
      </div>
    </div>
  )
}

// ── Progress Bar ──────────────────────────────────────────────────────────────

function ProgressBar({ step, onStep }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', marginBottom: 6 }}>
        {STEPS.map(s => (
          <div
            key={s.n}
            onClick={() => s.n < step && onStep(s.n)}
            style={{
              flex: 1, textAlign: 'center', fontSize: 10,
              fontWeight: step === s.n ? 700 : 400,
              color: step > s.n ? '#1B3A6B' : step === s.n ? '#C07A28' : '#b4b2a9',
              cursor: s.n < step ? 'pointer' : 'default',
            }}
          >
            {s.label}
          </div>
        ))}
      </div>
      <div style={{ height: 5, background: '#E5E3DC', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${((step - 1) / (STEPS.length - 1)) * 100}%`,
          background: 'linear-gradient(90deg, #1B3A6B 0%, #C07A28 100%)',
          borderRadius: 3, transition: 'width 0.4s ease',
        }} />
      </div>
    </div>
  )
}

// ── Field wrapper ─────────────────────────────────────────────────────────────

function F({ label, hint, children, mb = 14 }) {
  return (
    <div style={{ marginBottom: mb }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, fontSize: 12, color: '#5f5e5a' }}>
        {label}
        {hint && <span style={{ fontSize: 10, color: '#b4b2a9', fontWeight: 400 }}>{hint}</span>}
      </label>
      {children}
    </div>
  )
}

// ── Score Card ────────────────────────────────────────────────────────────────

function ScoreCard({ score }) {
  const { overall, keyword_match, experience_alignment, ats_compatibility, suggestions = [] } = score
  const color = overall >= 80 ? '#16A34A' : overall >= 60 ? '#D97706' : '#DC2626'
  const matchLabel = overall >= 80 ? 'Strong Match' : overall >= 60 ? 'Moderate Match' : 'Needs Work'
  const matchDesc = overall >= 80
    ? 'High likelihood of an interview callback. Your background aligns well with this role.'
    : overall >= 60
    ? 'Some gaps to address before applying. Review the suggestions below.'
    : 'Significant gaps between your resume and this role. Focus on the suggestions below.'
  const r = 45
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - overall / 100)
  return (
    <div style={{ background: '#fff', border: '1px solid #E5E3DC', borderRadius: 16, padding: '24px 22px', marginTop: 20 }}>
      <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#b4b2a9', marginBottom: 18 }}>Resume Score</p>
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <svg viewBox="0 0 110 110" width={110} height={110}>
            <circle cx="55" cy="55" r={r} fill="none" stroke="#E5E3DC" strokeWidth={9} />
            <circle
              cx="55" cy="55" r={r} fill="none"
              stroke={color} strokeWidth={9}
              strokeDasharray={circ} strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '55px 55px', transition: 'stroke-dashoffset .8s ease' }}
            />
            <text x="55" y="51" textAnchor="middle" fill="#1a1a18" fontSize="22" fontWeight="700" fontFamily="-apple-system, sans-serif">{overall}</text>
            <text x="55" y="66" textAnchor="middle" fill="#b4b2a9" fontSize="10" fontFamily="-apple-system, sans-serif">/ 100</text>
          </svg>
          <p style={{ fontSize: 12, fontWeight: 700, color, marginTop: 2 }}>{matchLabel}</p>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <p style={{ fontSize: 12, color: '#5f5e5a', lineHeight: 1.6, marginBottom: 14 }}>{matchDesc}</p>
          {[
            { label: 'Keyword Match', val: keyword_match },
            { label: 'Experience Alignment', val: experience_alignment },
            { label: 'ATS Compatibility', val: ats_compatibility },
          ].map(s => {
            const c = s.val >= 80 ? '#16A34A' : s.val >= 60 ? '#D97706' : '#DC2626'
            return (
              <div key={s.label} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: '#5f5e5a' }}>{s.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: c }}>{s.val}/100</span>
                </div>
                <div style={{ height: 5, background: '#E5E3DC', borderRadius: 3 }}>
                  <div style={{ height: '100%', width: `${s.val}%`, background: c, borderRadius: 3, transition: 'width .6s ease' }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {suggestions.length > 0 && (
        <div style={{ background: '#FAFAF8', borderRadius: 10, padding: '14px 16px', borderLeft: '3px solid #C07A28' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#5f5e5a', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>To improve your score, we recommend:</p>
          {suggestions.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: i < suggestions.length - 1 ? 10 : 0, alignItems: 'flex-start' }}>
              <span style={{ color: '#C07A28', fontSize: 13, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}.</span>
              <p style={{ fontSize: 12, color: '#1a1a18', lineHeight: 1.65 }}>{s}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ResumeTab({ prefill }) {
  const { user, supabaseEnabled } = useAuth()
  const useDb = supabaseEnabled && !!supabase && !!user

  const [step, setStep] = useState(() => prefill ? 2 : 1)
  const [form, setForm] = useState(() => initForm(prefill))
  const [template, setTemplate] = useState('classic')
  const [loading, setLoading] = useState(false)
  const [resume, setResume] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [draftMsg, setDraftMsg] = useState('')
  const [jobData, setJobData] = useState(null)
  const [jobFetching, setJobFetching] = useState(false)
  const [jobFetchError, setJobFetchError] = useState('')
  const [scoreData, setScoreData] = useState(null)
  const [scoringLoading, setScoringLoading] = useState(false)

  useEffect(() => {
    if (!prefill) return
    setForm(prev => ({ ...prev, branch: prefill.branch || 'Army', mos: prefill.mos || prev.mos, rank: prefill.rank || prev.rank, yos: prefill.yos || prev.yos }))
    setStep(2)
  }, [prefill])

  function set(field, val) { setForm(prev => ({ ...prev, [field]: val })) }
  function setJob(id, f, v) { setForm(prev => ({ ...prev, prevJobs: prev.prevJobs.map(j => j.id === id ? { ...j, [f]: v } : j) })) }
  function setEdu(id, f, v) { setForm(prev => ({ ...prev, education: prev.education.map(e => e.id === id ? { ...e, [f]: v } : e) })) }

  async function fetchJobFromUrl() {
    if (!form.jobUrl.trim()) return
    setJobFetching(true); setJobFetchError(''); setJobData(null)
    try {
      const r = await fetch('/api/fetch-job', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: form.jobUrl.trim() }),
      })
      const data = await r.json()
      if (!r.ok) { setJobFetchError(data.error || 'Could not extract the job posting.'); return }
      setJobData(data)
      if (data.company && !form.targetCompany) set('targetCompany', data.company)
      if (data.title && !form.targetTitle) set('targetTitle', data.title)
    } catch { setJobFetchError('Could not reach the server. Try pasting the job description directly.') }
    finally { setJobFetching(false) }
  }

  async function generate() {
    if (!form.mos.trim()) { setError('Please enter your MOS, AFSC, or rate code in Step 3.'); return }
    setError(''); setResume(''); setScoreData(null); setLoading(true)
    const jobContext = form.jobDescription.trim() || (jobData
      ? `Job Title: ${jobData.title || ''}\nCompany: ${jobData.company || ''}\nRequired Skills: ${jobData.skills || ''}\nKey Responsibilities: ${jobData.responsibilities || ''}`
      : '')
    try {
      const r = await fetch('/api/resume', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch: form.branch, mos: form.mos.trim(), rank: form.rank, yos: form.yos,
          targetCompany: form.targetCompany.trim() || form.targetTitle.trim(),
          additionalSkills: [form.additionalSkills, form.certifications].filter(Boolean).join('\n'),
          clearance: form.clearance, awards: form.awards.trim(),
          summaryTone: form.summaryTone,
          additionalContext: form.additionalContext.trim(),
          jobDescription: jobContext,
          education: form.education.filter(e => e.school.trim() || e.degreeType),
          contact: { name: form.name, email: form.email, phone: form.phone, location: form.location, linkedin: form.linkedin },
          prevJobs: form.prevJobs.filter(j => j.title.trim()),
        }),
      })
      const data = await r.json()
      if (!r.ok) { setError(data.error || 'Something went wrong.'); return }
      setResume(data.resume)
      if (jobContext) {
        setScoringLoading(true)
        try {
          const sr = await fetch('/api/score-resume', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resume: data.resume, jobDescription: jobContext }),
          })
          const sd = await sr.json()
          if (sr.ok && sd.overall !== undefined) setScoreData(sd)
        } catch {} finally { setScoringLoading(false) }
      }
    } catch { setError('Could not reach the server. Try again.') }
    finally { setLoading(false) }
  }

  function downloadPDF() { window.print() }

  function copyText() {
    navigator.clipboard.writeText(resume).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  async function saveDraft() {
    if (!useDb) return; setSaving(true)
    const { error: e } = await supabase.from('resume_drafts').upsert({ user_id: user.id, data: form, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
    setSaving(false); setDraftMsg(e ? 'Could not save.' : 'Draft saved.'); setTimeout(() => setDraftMsg(''), 2500)
  }

  async function loadDraft() {
    if (!useDb) return
    const { data, error: e } = await supabase.from('resume_drafts').select('data').eq('user_id', user.id).single()
    if (e || !data?.data) { setDraftMsg('No draft found.'); setTimeout(() => setDraftMsg(''), 2500); return }
    setForm(prev => ({ ...initForm(), ...data.data })); setDraftMsg('Draft loaded.'); setTimeout(() => setDraftMsg(''), 2500)
  }

  // ── Step renderers ──────────────────────────────────────────────────────────

  function renderStep() {
    const cardStyle = { background: '#fff', border: '1px solid #E5E3DC', borderRadius: 16, padding: '24px 22px' }

    switch (step) {
      case 1: return (
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a18', marginBottom: 4 }}>Personal information</h2>
          <p style={{ fontSize: 13, color: '#5f5e5a', marginBottom: 16, lineHeight: 1.6 }}>This appears in your resume header.</p>
          <div style={cardStyle}>
            <F label="Full name">
              <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Smith" autoFocus />
            </F>
            <div className="grid-2">
              <F label="Email"><input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@example.com" /></F>
              <F label="Phone"><input type="text" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(555) 555-5555" /></F>
            </div>
            <F label="City, State">
              <input type="text" value={form.location} onChange={e => set('location', e.target.value)} placeholder="Austin, TX" />
            </F>
            <F label="LinkedIn URL" hint="(optional)" mb={0}>
              <input type="text" value={form.linkedin} onChange={e => set('linkedin', e.target.value)} placeholder="linkedin.com/in/yourname" />
            </F>
          </div>
        </div>
      )

      case 2: return (
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a18', marginBottom: 4 }}>Target job</h2>
          <p style={{ fontSize: 13, color: '#5f5e5a', marginBottom: 16, lineHeight: 1.6 }}>
            Give the AI a specific role to target — your resume and score will be tailored to it.{' '}
            <span style={{ color: '#b4b2a9' }}>Skip this step to generate a general resume.</span>
          </p>
          <div style={cardStyle}>
            <F label="Paste a job posting URL">
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="url"
                  value={form.jobUrl}
                  onChange={e => { set('jobUrl', e.target.value); setJobData(null); setJobFetchError('') }}
                  placeholder="https://jobs.example.com/posting/12345"
                  style={{ flex: 1 }}
                />
                <button
                  onClick={fetchJobFromUrl}
                  disabled={jobFetching || !form.jobUrl.trim()}
                  style={{
                    padding: '8px 16px',
                    background: jobFetching || !form.jobUrl.trim() ? '#d3d1c7' : '#1B3A6B',
                    border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 600,
                    cursor: jobFetching || !form.jobUrl.trim() ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0,
                  }}
                >
                  {jobFetching ? 'Fetching…' : 'Fetch →'}
                </button>
              </div>
            </F>

            {jobFetchError && (
              <p style={{ fontSize: 12, color: '#a32d2d', marginBottom: 14, marginTop: -8 }}>{jobFetchError}</p>
            )}

            {jobData && (
              <div style={{ background: '#F0F7EE', borderRadius: 10, padding: '12px 14px', marginBottom: 16, border: '1px solid #9DC99A' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#1a6614', marginBottom: 4 }}>✓ Job extracted</p>
                {jobData.title && (
                  <p style={{ fontSize: 12, color: '#1a1a18', fontWeight: 600 }}>
                    {jobData.title}{jobData.company ? ` at ${jobData.company}` : ''}
                  </p>
                )}
                {jobData.skills && (
                  <p style={{ fontSize: 11, color: '#5f5e5a', marginTop: 4, lineHeight: 1.5 }}>Skills: {jobData.skills}</p>
                )}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ flex: 1, height: 1, background: '#E5E3DC' }} />
              <span style={{ fontSize: 11, color: '#b4b2a9', flexShrink: 0 }}>OR paste the job description</span>
              <div style={{ flex: 1, height: 1, background: '#E5E3DC' }} />
            </div>

            <F label="Job description" hint="(paste full text)" mb={0}>
              <textarea
                value={form.jobDescription}
                onChange={e => set('jobDescription', e.target.value)}
                placeholder="Paste the full job description here. The AI will tailor your resume to this role and score your match against it."
                style={{ minHeight: 140 }}
              />
            </F>

            {!form.jobDescription.trim() && !jobData && (
              <p style={{ fontSize: 11, color: '#b4b2a9', marginTop: 8, lineHeight: 1.6 }}>
                No specific role yet? Skip this step. Your resume will be tailored for general civilian employment based on your MOS.
              </p>
            )}
          </div>
        </div>
      )

      case 3: return (
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a18', marginBottom: 4 }}>Military background</h2>
          <p style={{ fontSize: 13, color: '#5f5e5a', marginBottom: 16, lineHeight: 1.6 }}>Your MOS is the foundation — the AI translates it into civilian language.</p>
          <div style={cardStyle}>
            <div className="grid-2">
              <F label="Branch of service">
                <select value={form.branch} onChange={e => set('branch', e.target.value)}>
                  {BRANCHES.map(b => <option key={b}>{b}</option>)}
                </select>
              </F>
              <F label="MOS / AFSC / Rate / NEC">
                <input type="text" value={form.mos} onChange={e => set('mos', e.target.value)} placeholder="e.g. 25U, 6F0X1, IT" autoFocus />
              </F>
            </div>
            <div className="grid-2">
              <F label="Rank" hint="(optional)">
                <select value={form.rank} onChange={e => set('rank', e.target.value)}>
                  <option value="">Select rank</option>
                  {Object.entries(RANKS).map(([group, ranks]) => (
                    <optgroup key={group} label={group}>
                      {ranks.map(r => <option key={r}>{r}</option>)}
                    </optgroup>
                  ))}
                </select>
              </F>
              <F label="Years of service" hint="(optional)">
                <select value={form.yos} onChange={e => set('yos', e.target.value)}>
                  {YOS_OPTS.map(y => <option key={y} value={y}>{y || 'Select years'}</option>)}
                </select>
              </F>
            </div>
            <F label="Security clearance" mb={0}>
              <select value={form.clearance} onChange={e => set('clearance', e.target.value)}>
                <option value="">None / Not applicable</option>
                <option>Confidential</option><option>Secret</option>
                <option>Top Secret</option><option>TS/SCI</option>
              </select>
            </F>
          </div>
        </div>
      )

      case 4: return (
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a18', marginBottom: 4 }}>Work experience</h2>
          <p style={{ fontSize: 13, color: '#5f5e5a', marginBottom: 16, lineHeight: 1.6 }}>Add any civilian experience you already have.</p>
          <div style={cardStyle}>
            <div className="grid-2">
              <F label="Target job title" hint="(optional)">
                <input type="text" value={form.targetTitle} onChange={e => set('targetTitle', e.target.value)} placeholder="Program Manager, IT Specialist…" autoFocus />
              </F>
              <F label="Target company or industry">
                <input type="text" value={form.targetCompany} onChange={e => set('targetCompany', e.target.value)} placeholder="Amazon, VA, Lockheed Martin…" />
              </F>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, marginBottom: 10 }}>
              <p style={{ fontSize: 12, fontWeight: 500, color: '#5f5e5a' }}>Non-military experience <span style={{ color: '#b4b2a9', fontWeight: 400 }}>(optional)</span></p>
              <button onClick={() => set('prevJobs', [...form.prevJobs, emptyJob()])} style={{ padding: '5px 12px', background: '#1B3A6B', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                + Add role
              </button>
            </div>
            {form.prevJobs.length === 0 && <p style={{ fontSize: 12, color: '#b4b2a9' }}>Civilian jobs, internships, SkillBridge experience.</p>}
            {form.prevJobs.map(job => (
              <div key={job.id} style={{ border: '1px solid #e8e5de', borderRadius: 10, padding: '12px 14px', marginBottom: 10 }}>
                <div className="grid-2" style={{ marginBottom: 8 }}>
                  <F label="Job title" mb={0}><input type="text" value={job.title} onChange={e => setJob(job.id, 'title', e.target.value)} placeholder="Project Manager Intern" /></F>
                  <F label="Employer" mb={0}><input type="text" value={job.employer} onChange={e => setJob(job.id, 'employer', e.target.value)} placeholder="Company name" /></F>
                </div>
                <F label="Dates" mb={8}><input type="text" value={job.dates} onChange={e => setJob(job.id, 'dates', e.target.value)} placeholder="Jan 2023 – Jun 2023" /></F>
                <F label="Key responsibilities" mb={6}><textarea value={job.description} onChange={e => setJob(job.id, 'description', e.target.value)} placeholder="What did you do and accomplish?" style={{ minHeight: 52 }} /></F>
                <button onClick={() => set('prevJobs', form.prevJobs.filter(j => j.id !== job.id))} style={{ background: 'none', border: 'none', color: '#a32d2d', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>Remove</button>
              </div>
            ))}
          </div>
        </div>
      )

      case 5: return (
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a18', marginBottom: 4 }}>Education</h2>
          <p style={{ fontSize: 13, color: '#5f5e5a', marginBottom: 16, lineHeight: 1.6 }}>Add degrees or diplomas. Skip this step if you have no formal education to list.</p>
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: form.education.length > 0 ? 14 : 0 }}>
              <button onClick={() => set('education', [...form.education, emptyEdu()])} style={{ padding: '6px 14px', background: '#1B3A6B', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                + Add education
              </button>
            </div>
            {form.education.length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px 16px', color: '#b4b2a9' }}>
                <p style={{ fontSize: 28, marginBottom: 10 }}>🎓</p>
                <p style={{ fontSize: 13 }}>No education added. Click "Add education" above, or click "Skip" below.</p>
              </div>
            )}
            {form.education.map(edu => (
              <div key={edu.id} style={{ border: '1px solid #e8e5de', borderRadius: 10, padding: '12px 14px', marginBottom: 10 }}>
                <div className="grid-2" style={{ marginBottom: 8 }}>
                  <F label="School name" mb={0}><input type="text" value={edu.school} onChange={e => setEdu(edu.id, 'school', e.target.value)} placeholder="University or institution" /></F>
                  <F label="Degree type" mb={0}>
                    <select value={edu.degreeType} onChange={e => setEdu(edu.id, 'degreeType', e.target.value)}>
                      <option value="">Select degree</option>
                      {DEGREES.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </F>
                </div>
                <div className="grid-2" style={{ marginBottom: 8 }}>
                  <F label="Field of study" mb={0}><input type="text" value={edu.field} onChange={e => setEdu(edu.id, 'field', e.target.value)} placeholder="Business Administration" /></F>
                  <F label="Graduation year" mb={0}><input type="text" value={edu.gradYear} onChange={e => setEdu(edu.id, 'gradYear', e.target.value)} placeholder="2022 or In Progress" /></F>
                </div>
                <F label="GPA" hint="(optional)" mb={6}><input type="text" value={edu.gpa} onChange={e => setEdu(edu.id, 'gpa', e.target.value)} placeholder="3.8" style={{ maxWidth: 100 }} /></F>
                <button onClick={() => set('education', form.education.filter(e => e.id !== edu.id))} style={{ background: 'none', border: 'none', color: '#a32d2d', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>Remove</button>
              </div>
            ))}
          </div>
        </div>
      )

      case 6: return (
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a18', marginBottom: 4 }}>Skills and awards</h2>
          <p style={{ fontSize: 13, color: '#5f5e5a', marginBottom: 16, lineHeight: 1.6 }}>Military awards get translated into civilian achievement language automatically.</p>
          <div style={cardStyle}>
            <F label="Military awards and decorations" hint="(AI translates)">
              <textarea value={form.awards} onChange={e => set('awards', e.target.value)} placeholder="e.g. Army Commendation Medal, Bronze Star, Good Conduct Medal…" style={{ minHeight: 64 }} autoFocus />
            </F>
            <F label="Additional skills" hint="languages, software, technical">
              <textarea value={form.additionalSkills} onChange={e => set('additionalSkills', e.target.value)} placeholder="Python, bilingual Spanish, Adobe Suite, Agile/Scrum…" style={{ minHeight: 64 }} />
            </F>
            <F label="Certifications" hint="(optional)" mb={0}>
              <textarea value={form.certifications} onChange={e => set('certifications', e.target.value)} placeholder="PMP, CompTIA Security+, Six Sigma Green Belt…" style={{ minHeight: 52 }} />
            </F>
          </div>
        </div>
      )

      case 7: return (
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a18', marginBottom: 4 }}>Summary preferences</h2>
          <p style={{ fontSize: 13, color: '#5f5e5a', marginBottom: 16, lineHeight: 1.6 }}>Tell the AI how your resume should sound. Optional but improves output quality.</p>
          <div style={cardStyle}>
            <F label="Professional summary tone">
              <select value={form.summaryTone} onChange={e => set('summaryTone', e.target.value)} autoFocus>
                <option value="">Modern and direct (recommended)</option>
                <option>Conservative and formal</option>
                <option>Leadership focused</option>
                <option>Technical focused</option>
              </select>
            </F>
            <F label="Additional context for the AI" hint="(optional)" mb={0}>
              <textarea value={form.additionalContext} onChange={e => set('additionalContext', e.target.value)} placeholder="Career gap explanation, specific accomplishment to highlight, something unique about your background…" style={{ minHeight: 100 }} />
            </F>
            {useDb && (
              <div style={{ display: 'flex', gap: 8, marginTop: 16, alignItems: 'center' }}>
                <button onClick={saveDraft} disabled={saving} style={{ padding: '6px 14px', background: '#1B3A6B', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', opacity: saving ? 0.6 : 1 }}>
                  {saving ? 'Saving…' : 'Save draft'}
                </button>
                <button onClick={loadDraft} style={{ padding: '6px 14px', background: '#fff', border: '1px solid #d3d1c7', borderRadius: 8, color: '#5f5e5a', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Load draft
                </button>
                {draftMsg && <p style={{ fontSize: 11, color: '#0A7868' }}>{draftMsg}</p>}
              </div>
            )}
          </div>
        </div>
      )

      case 8: return (
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a18', marginBottom: 4 }}>Review and generate</h2>
          <p style={{ fontSize: 13, color: '#5f5e5a', marginBottom: 16, lineHeight: 1.6 }}>Confirm your details, pick a template, then generate.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
            {[
              { label: 'Name', val: form.name || '—', s: 1 },
              { label: 'Contact', val: [form.email, form.phone, form.location].filter(Boolean).join(' · ') || '—', s: 1 },
              { label: 'Job Target', val: jobData ? `${jobData.title || ''}${jobData.company ? ` at ${jobData.company}` : ''}` : (form.jobDescription.trim() ? 'Job description provided' : '—'), s: 2 },
              { label: 'Branch & MOS', val: `${form.branch}${form.mos ? ' · ' + form.mos : ''}`, s: 3 },
              { label: 'Rank / YOS', val: [form.rank, form.yos].filter(Boolean).join(' · ') || '—', s: 3 },
              { label: 'Clearance', val: form.clearance || 'None', s: 3 },
              { label: 'Target', val: form.targetCompany || form.targetTitle || '—', s: 4 },
              { label: 'Experience', val: form.prevJobs.length > 0 ? `${form.prevJobs.length} role(s)` : 'Military only', s: 4 },
              { label: 'Education', val: form.education.length > 0 ? `${form.education.length} entr${form.education.length > 1 ? 'ies' : 'y'}` : 'None added', s: 5 },
              { label: 'Awards', val: form.awards ? form.awards.slice(0, 40) + (form.awards.length > 40 ? '…' : '') : '—', s: 6 },
              { label: 'Summary tone', val: form.summaryTone || 'Modern and direct', s: 7 },
            ].map(item => (
              <div key={item.label} style={{ background: '#fff', border: '1px solid #E5E3DC', borderRadius: 10, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 9.5, color: '#b4b2a9', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2 }}>{item.label}</p>
                  <p style={{ fontSize: 12, color: '#1a1a18', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.val}</p>
                </div>
                <button onClick={() => setStep(item.s)} style={{ background: 'none', border: 'none', color: '#C07A28', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', padding: 0, fontWeight: 600, flexShrink: 0 }}>Edit</button>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#5f5e5a', marginBottom: 10 }}>Choose a template</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 22 }}>
            {TEMPLATES.map(t => (
              <button key={t.id} onClick={() => setTemplate(t.id)} style={{
                padding: '14px 12px', border: `2px solid ${template === t.id ? '#1B3A6B' : '#E5E3DC'}`,
                borderRadius: 10, background: template === t.id ? '#EEF3FC' : '#fff',
                cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'all .15s',
              }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: template === t.id ? '#1B3A6B' : '#1a1a18', marginBottom: 3 }}>{t.label}</p>
                <p style={{ fontSize: 10.5, color: '#5f5e5a', lineHeight: 1.4 }}>{t.desc}</p>
              </button>
            ))}
          </div>

          {error && <p style={{ color: '#a32d2d', fontSize: 13, marginBottom: 10 }}>{error}</p>}

          <button
            onClick={generate}
            disabled={loading}
            style={{
              width: '100%', padding: '14px 20px',
              background: loading ? '#d3d1c7' : 'linear-gradient(135deg, #C07A28 0%, #9A5F1A 100%)',
              border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              marginBottom: 8, minHeight: 52,
            }}
          >
            {loading
              ? <><span className="search-spinner" style={{ borderColor: 'rgba(255,255,255,.3)', borderTopColor: '#fff' }} />Building your resume…</>
              : 'Generate my resume →'}
          </button>

          {resume && (
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
                <button
                  onClick={downloadPDF}
                  style={{ flex: '1 1 160px', padding: '13px 20px', background: '#1B3A6B', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  ⬇ Download PDF
                </button>
                <button
                  onClick={copyText}
                  style={{ flex: '0 1 130px', padding: '13px 18px', background: copied ? '#0A7868' : '#fff', border: '1px solid #d3d1c7', borderRadius: 10, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: copied ? '#fff' : '#5f5e5a', transition: 'all .15s' }}
                >
                  {copied ? '✓ Copied' : 'Copy text'}
                </button>
                <button
                  onClick={() => { setResume(''); setScoreData(null) }}
                  style={{ flex: '0 1 auto', padding: '13px 14px', background: '#fff', border: '1px solid #d3d1c7', borderRadius: 10, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: '#5f5e5a' }}
                >
                  Regenerate
                </button>
              </div>
              <div style={{ padding: '10px 14px', background: '#faeeda', borderRadius: 8 }}>
                <p style={{ fontSize: 12, color: '#633806', lineHeight: 1.6 }}>Replace all bracketed placeholders [ ] with your actual information before using.</p>
              </div>

              {scoringLoading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, padding: '12px 16px', background: '#fff', border: '1px solid #E5E3DC', borderRadius: 12 }}>
                  <span className="search-spinner" />
                  <p style={{ fontSize: 13, color: '#5f5e5a' }}>Scoring your resume against the job description…</p>
                </div>
              )}

              {scoreData && <ScoreCard score={scoreData} />}

              <div className="resume-mobile-output" style={{ marginTop: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#b4b2a9', marginBottom: 10 }}>
                  Your resume · {TEMPLATES.find(t => t.id === template)?.label}
                </p>
                <div
                  id="resume-print-target-mobile"
                  style={{ background: '#fff', border: '1px solid #E5E3DC', borderRadius: 12, padding: '20px', overflowX: 'auto' }}
                >
                  {template === 'modern' ? <ModernResume parsed={parseSections(resume)} form={form} /> :
                   template === 'federal' ? <FederalResume parsed={parseSections(resume)} form={form} /> :
                   <ClassicResume parsed={parseSections(resume)} form={form} />}
                </div>
              </div>
            </div>
          )}
        </div>
      )

      default: return null
    }
  }

  // ── Navigation ──────────────────────────────────────────────────────────────

  function renderNav() {
    if (step === 8) return null
    const isSkipStep = step === 5 && form.education.length === 0
    const nextLabel = isSkipStep ? 'Skip →' : `Next: ${STEPS[step]?.label || 'Review'} →`
    return (
      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        {step > 1 && (
          <button
            onClick={() => setStep(s => s - 1)}
            style={{ flex: '0 1 auto', padding: '12px 22px', background: '#fff', border: '1px solid #d3d1c7', borderRadius: 10, color: '#5f5e5a', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            ← Back
          </button>
        )}
        <button
          onClick={() => setStep(s => s + 1)}
          style={{ flex: 1, padding: '12px 20px', background: 'linear-gradient(135deg, #1B3A6B 0%, #0f2857 100%)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          {nextLabel}
        </button>
      </div>
    )
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div>
      <ProgressBar step={step} onStep={setStep} />

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 0', minWidth: 0 }}>
          {renderStep()}
          {renderNav()}
        </div>

        <div className="resume-preview-col">
          <ResumePreviewPanel form={form} template={template} resume={resume} />
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
        <AdUnit slot="6514090037" />
      </div>
    </div>
  )
}
