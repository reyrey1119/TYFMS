import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import FunFact from '../components/FunFact'
import AdUnit from '../components/AdUnit'

const BRANCHES = ['Army', 'Air Force', 'Navy', 'Marine Corps', 'Coast Guard', 'Space Force']

const YOS_OPTIONS = [
  '', 'Less than 1 year', '1–2 years', '3–4 years', '5–6 years',
  '7–8 years', '9–10 years', '11–15 years', '16–20 years', '20+ years',
]

const COMPANY_EXAMPLES = [
  'Apple', 'Google', 'Amazon', 'Microsoft', 'Meta',
  'VA', 'DoD', 'FBI', 'FEMA', 'TSA',
  'Lockheed Martin', 'Boeing', 'Raytheon', 'SAIC',
  'JPMorgan Chase', 'Deloitte', 'McKinsey',
  'Local government', 'Nonprofit', 'Startup',
]

function emptyJob() {
  return { id: Date.now() + Math.random(), title: '', employer: '', dates: '', description: '' }
}

export default function ResumeTab({ prefill }) {
  const { user, supabaseEnabled } = useAuth()
  const useDb = supabaseEnabled && !!supabase && !!user

  // Contact info
  const [contact, setContact] = useState({ name: '', email: '', phone: '', location: '', linkedin: '' })

  // Military background
  const [branch, setBranch] = useState(() => prefill?.branch || 'Army')
  const [mos, setMos] = useState(() => prefill?.mos || '')
  const [rank, setRank] = useState(() => prefill?.rank || '')
  const [yos, setYos] = useState(() => prefill?.yos || '')
  const [targetCompany, setTargetCompany] = useState('')
  const [additionalSkills, setAdditionalSkills] = useState('')
  const [clearance, setClearance] = useState('')
  const [awards, setAwards] = useState('')
  const [summaryTone, setSummaryTone] = useState('')
  const [education, setEducation] = useState([])

  // Non-military experience
  const [prevJobs, setPrevJobs] = useState([])

  // Resume output
  const [loading, setLoading] = useState(false)
  const [resume, setResume] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  // Save/load state
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [loadMsg, setLoadMsg] = useState('')

  useEffect(() => {
    if (!prefill) return
    setBranch(prefill.branch || 'Army')
    if (prefill.mos) setMos(prefill.mos)
    if (prefill.rank) setRank(prefill.rank)
    if (prefill.yos) setYos(prefill.yos)
  }, [prefill])

  function updateContact(field, val) {
    setContact(prev => ({ ...prev, [field]: val }))
  }

  function addJob() {
    setPrevJobs(prev => [...prev, emptyJob()])
  }

  function updateJob(id, field, val) {
    setPrevJobs(prev => prev.map(j => j.id === id ? { ...j, [field]: val } : j))
  }

  function removeJob(id) {
    setPrevJobs(prev => prev.filter(j => j.id !== id))
  }

  function emptyEdu() {
    return { id: Date.now() + Math.random(), school: '', degreeType: '', field: '', gradYear: '', gpa: '' }
  }
  function addEdu() { setEducation(prev => [...prev, emptyEdu()]) }
  function updateEdu(id, field, val) { setEducation(prev => prev.map(e => e.id === id ? { ...e, [field]: val } : e)) }
  function removeEdu(id) { setEducation(prev => prev.filter(e => e.id !== id)) }

  async function generateResume() {
    if (!mos.trim()) { setError('Please enter your MOS, AFSC, or rate code.'); return }
    setError('')
    setResume('')
    setLoading(true)
    try {
      const r = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch, mos: mos.trim(), rank, yos,
          targetCompany: targetCompany.trim(),
          additionalSkills: additionalSkills.trim(),
          clearance,
          awards: awards.trim(),
          summaryTone,
          education: education.filter(e => e.school.trim() || e.degreeType),
          contact,
          prevJobs: prevJobs.filter(j => j.title.trim()),
        }),
      })
      const data = await r.json()
      if (!r.ok) { setError(data.error || 'Something went wrong.'); return }
      setResume(data.resume)
    } catch {
      setError('Could not reach the server. Try again.')
    } finally {
      setLoading(false)
    }
  }

  function copyResume() {
    navigator.clipboard.writeText(resume).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function downloadResume() {
    const blob = new Blob([resume], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `resume-${(targetCompany || mos).replace(/\s+/g, '-').toLowerCase() || 'veteran'}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  async function saveDraft() {
    if (!useDb) return
    setSaving(true)
    setSaveMsg('')
    const data = { branch, mos, rank, yos, targetCompany, additionalSkills, clearance, awards, summaryTone, education, contact, prevJobs }
    const { error: dbError } = await supabase
      .from('resume_drafts')
      .upsert({ user_id: user.id, data, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
    setSaving(false)
    setSaveMsg(dbError ? 'Could not save draft.' : 'Draft saved.')
    setTimeout(() => setSaveMsg(''), 3000)
  }

  async function loadDraft() {
    if (!useDb) return
    setLoadMsg('')
    const { data, error: dbError } = await supabase
      .from('resume_drafts')
      .select('data')
      .eq('user_id', user.id)
      .single()
    if (dbError || !data) { setLoadMsg('No saved draft found.'); setTimeout(() => setLoadMsg(''), 3000); return }
    const d = data.data
    if (d.branch) setBranch(d.branch)
    if (d.mos) setMos(d.mos)
    if (d.rank) setRank(d.rank)
    if (d.yos) setYos(d.yos)
    if (d.targetCompany) setTargetCompany(d.targetCompany)
    if (d.additionalSkills) setAdditionalSkills(d.additionalSkills)
    if (d.clearance !== undefined) setClearance(d.clearance)
    if (d.awards) setAwards(d.awards)
    if (d.summaryTone) setSummaryTone(d.summaryTone)
    if (d.education) setEducation(d.education)
    if (d.contact) setContact(d.contact)
    if (d.prevJobs) setPrevJobs(d.prevJobs)
    setLoadMsg('Draft loaded.')
    setTimeout(() => setLoadMsg(''), 3000)
  }

  return (
    <div>
      <p className="sec-title">Resume builder</p>
      <p className="sec-sub">
        Enter your military background and target employer. The AI will generate a complete, tailored
        civilian resume — professional summary, experience translated from military language, skills
        matched to the company's culture, and education placeholder.
      </p>

      {/* Contact info */}
      <div className="card" style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 14 }}>Contact information</p>
        <div className="grid-2" style={{ marginBottom: 12 }}>
          <div>
            <label>Full name</label>
            <input type="text" value={contact.name} onChange={e => updateContact('name', e.target.value)} placeholder="Jane Smith" />
          </div>
          <div>
            <label>Email</label>
            <input type="email" value={contact.email} onChange={e => updateContact('email', e.target.value)} placeholder="jane@example.com" />
          </div>
        </div>
        <div className="grid-2" style={{ marginBottom: 12 }}>
          <div>
            <label>Phone</label>
            <input type="text" value={contact.phone} onChange={e => updateContact('phone', e.target.value)} placeholder="(555) 555-5555" />
          </div>
          <div>
            <label>City, State</label>
            <input type="text" value={contact.location} onChange={e => updateContact('location', e.target.value)} placeholder="Austin, TX" />
          </div>
        </div>
        <div>
          <label>LinkedIn URL (optional)</label>
          <input type="text" value={contact.linkedin} onChange={e => updateContact('linkedin', e.target.value)} placeholder="linkedin.com/in/janesmith" />
        </div>
      </div>

      {/* Military background */}
      <div className="card" style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 14 }}>Military background</p>

        <div className="grid-2" style={{ marginBottom: 12 }}>
          <div>
            <label>Branch of service</label>
            <select value={branch} onChange={e => setBranch(e.target.value)}>
              {BRANCHES.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label>MOS / AFSC / Rate / NEC</label>
            <input
              type="text"
              value={mos}
              onChange={e => setMos(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generateResume()}
              placeholder="e.g. 25U, 6F0X1, IT, 0311"
            />
          </div>
        </div>

        <div className="grid-2" style={{ marginBottom: 12 }}>
          <div>
            <label>Rank (optional)</label>
            <select value={rank} onChange={e => setRank(e.target.value)}>
              <option value="">Select rank</option>
              <optgroup label="Enlisted">
                <option>E-1</option><option>E-2</option><option>E-3</option>
                <option>E-4</option><option>E-5</option><option>E-6</option>
                <option>E-7</option><option>E-8</option><option>E-9</option>
              </optgroup>
              <optgroup label="Warrant">
                <option>W-1</option><option>W-2</option><option>W-3</option>
                <option>W-4</option><option>W-5</option>
              </optgroup>
              <optgroup label="Officer">
                <option>O-1</option><option>O-2</option><option>O-3</option>
                <option>O-4</option><option>O-5</option><option>O-6</option>
                <option>O-7</option><option>O-8</option><option>O-9</option>
                <option>O-10</option>
              </optgroup>
            </select>
          </div>
          <div>
            <label>Years of service (optional)</label>
            <select value={yos} onChange={e => setYos(e.target.value)}>
              {YOS_OPTIONS.map(y => (
                <option key={y} value={y}>{y || 'Select years of service'}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Security clearance</label>
          <select value={clearance} onChange={e => setClearance(e.target.value)}>
            <option value="">None / Not applicable</option>
            <option>Confidential</option>
            <option>Secret</option>
            <option>Top Secret</option>
            <option>TS/SCI</option>
          </select>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Target company or industry</label>
          <input
            type="text"
            value={targetCompany}
            onChange={e => setTargetCompany(e.target.value)}
            placeholder="e.g. Amazon, VA, Lockheed Martin, local government, nonprofit..."
          />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
            {COMPANY_EXAMPLES.map(c => (
              <button
                key={c}
                onClick={() => setTargetCompany(c)}
                style={{
                  padding: '3px 10px', border: '1px solid #d3d1c7', borderRadius: 8,
                  background: targetCompany === c ? '#1B3A6B' : '#fff',
                  color: targetCompany === c ? '#fff' : '#5f5e5a',
                  fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            Additional skills (optional){' '}
            <span style={{ fontSize: 11, color: '#b4b2a9', fontWeight: 400 }}>languages, software, technical</span>
          </label>
          <textarea
            value={additionalSkills}
            onChange={e => setAdditionalSkills(e.target.value)}
            placeholder="Languages, software, technical skills — e.g. Python, bilingual Spanish, Adobe Suite, ITIL..."
            style={{ minHeight: 60 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            Awards and decorations{' '}
            <span style={{ fontSize: 11, color: '#b4b2a9', fontWeight: 400 }}>(optional — AI translates into civilian language)</span>
          </label>
          <input
            type="text"
            value={awards}
            onChange={e => setAwards(e.target.value)}
            placeholder="e.g. Army Commendation Medal, Bronze Star, Good Conduct Medal..."
          />
        </div>

        <div>
          <label>Resume summary tone</label>
          <select value={summaryTone} onChange={e => setSummaryTone(e.target.value)}>
            <option value="">Modern and direct (default)</option>
            <option>Conservative and formal</option>
            <option>Leadership focused</option>
            <option>Technical focused</option>
          </select>
        </div>
      </div>

      {/* Education */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <p style={{ fontSize: 13, fontWeight: 500 }}>Education (optional)</p>
          <button
            onClick={addEdu}
            style={{
              padding: '5px 12px', background: '#1B3A6B', border: 'none',
              borderRadius: 8, color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            + Add education
          </button>
        </div>

        {education.length === 0 && (
          <p style={{ fontSize: 13, color: '#b4b2a9' }}>
            Add degrees or diplomas. Leave blank and the resume will show a placeholder for you to fill in.
          </p>
        )}

        {education.map(edu => (
          <div key={edu.id} style={{ border: '1px solid #e8e5de', borderRadius: 10, padding: '14px 16px', marginBottom: 12 }}>
            <div className="grid-2" style={{ marginBottom: 10 }}>
              <div>
                <label>School name</label>
                <input type="text" value={edu.school} onChange={e => updateEdu(edu.id, 'school', e.target.value)} placeholder="University or institution" />
              </div>
              <div>
                <label>Degree type</label>
                <select value={edu.degreeType} onChange={e => updateEdu(edu.id, 'degreeType', e.target.value)}>
                  <option value="">Select degree</option>
                  <option>High School Diploma</option>
                  <option>Some College</option>
                  <option>Associate</option>
                  <option>Bachelor</option>
                  <option>Master</option>
                  <option>Doctoral</option>
                  <option>Professional</option>
                </select>
              </div>
            </div>
            <div className="grid-2" style={{ marginBottom: 10 }}>
              <div>
                <label>Field of study</label>
                <input type="text" value={edu.field} onChange={e => updateEdu(edu.id, 'field', e.target.value)} placeholder="e.g. Business Administration" />
              </div>
              <div>
                <label>Graduation year</label>
                <input type="text" value={edu.gradYear} onChange={e => updateEdu(edu.id, 'gradYear', e.target.value)} placeholder="e.g. 2022 or In Progress" />
              </div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <label>GPA (optional)</label>
              <input type="text" value={edu.gpa} onChange={e => updateEdu(edu.id, 'gpa', e.target.value)} placeholder="e.g. 3.8" style={{ maxWidth: 120 }} />
            </div>
            <button
              onClick={() => removeEdu(edu.id)}
              style={{ background: 'none', border: 'none', color: '#a32d2d', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Non-military experience */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <p style={{ fontSize: 13, fontWeight: 500 }}>Non-military experience (optional)</p>
          <button
            onClick={addJob}
            style={{
              padding: '5px 12px', background: '#1B3A6B', border: 'none',
              borderRadius: 8, color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            + Add role
          </button>
        </div>

        {prevJobs.length === 0 && (
          <p style={{ fontSize: 13, color: '#b4b2a9' }}>
            Include civilian jobs, internships, or SkillBridge experience.
          </p>
        )}

        {prevJobs.map(job => (
          <div key={job.id} style={{ border: '1px solid #e8e5de', borderRadius: 10, padding: '14px 16px', marginBottom: 12 }}>
            <div className="grid-2" style={{ marginBottom: 10 }}>
              <div>
                <label>Job title</label>
                <input type="text" value={job.title} onChange={e => updateJob(job.id, 'title', e.target.value)} placeholder="e.g. Project Manager Intern" />
              </div>
              <div>
                <label>Employer</label>
                <input type="text" value={job.employer} onChange={e => updateJob(job.id, 'employer', e.target.value)} placeholder="Company or organization name" />
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Dates</label>
              <input type="text" value={job.dates} onChange={e => updateJob(job.id, 'dates', e.target.value)} placeholder="e.g. Jan 2023 – Jun 2023" />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label>Key responsibilities or achievements</label>
              <textarea
                value={job.description}
                onChange={e => updateJob(job.id, 'description', e.target.value)}
                placeholder="Brief description of what you did and any results..."
                style={{ minHeight: 60 }}
              />
            </div>
            <button
              onClick={() => removeJob(job.id)}
              style={{ background: 'none', border: 'none', color: '#a32d2d', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}
            >
              Remove this role
            </button>
          </div>
        ))}
      </div>

      {/* Save/load draft */}
      {useDb && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={saveDraft}
            disabled={saving}
            style={{
              padding: '7px 16px', background: '#1B3A6B', border: 'none', borderRadius: 8,
              color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? 'Saving…' : 'Save draft'}
          </button>
          <button
            onClick={loadDraft}
            style={{
              padding: '7px 16px', background: '#fff', border: '1px solid #d3d1c7',
              borderRadius: 8, color: '#5f5e5a', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Load saved draft
          </button>
          {(saveMsg || loadMsg) && (
            <p style={{ fontSize: 12, color: saveMsg.includes('saved') || loadMsg.includes('loaded') ? '#0A7868' : '#a32d2d' }}>
              {saveMsg || loadMsg}
            </p>
          )}
        </div>
      )}

      {!useDb && supabaseEnabled && (
        <p style={{ fontSize: 12, color: '#b4b2a9', marginBottom: 16 }}>Sign in to save and load resume drafts.</p>
      )}

      <button className="btn-g" onClick={generateResume} disabled={loading} style={{ marginBottom: 4 }}>
        {loading ? 'Building your resume...' : 'Generate my resume'}
      </button>
      {error && <p style={{ color: '#a32d2d', fontSize: 13, paddingTop: 8 }}>{error}</p>}

      {resume && (
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
            <p style={{ fontSize: 14, fontWeight: 500 }}>
              Your resume draft {targetCompany && <span style={{ color: '#C07A28' }}>— tailored for {targetCompany}</span>}
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={copyResume}
                style={{
                  padding: '6px 14px', background: copied ? '#0A7868' : '#fff',
                  border: '1px solid #d3d1c7', borderRadius: 8, fontSize: 12,
                  cursor: 'pointer', fontFamily: 'inherit',
                  color: copied ? '#fff' : '#5f5e5a', transition: 'all .15s',
                }}
              >
                {copied ? '✓ Copied' : 'Copy to clipboard'}
              </button>
              <button
                onClick={downloadResume}
                style={{
                  padding: '6px 14px', background: '#1B3A6B', border: 'none',
                  borderRadius: 8, fontSize: 12, cursor: 'pointer',
                  fontFamily: 'inherit', color: '#fff',
                }}
              >
                Download .txt
              </button>
            </div>
          </div>

          <div className="resume-output">{resume}</div>

          <div style={{ marginTop: 10, padding: '10px 14px', background: '#faeeda', borderRadius: 8 }}>
            <p style={{ fontSize: 12, color: '#633806', lineHeight: 1.6 }}>
              Replace all bracketed placeholders [ ] with your actual information before using this resume.
            </p>
          </div>

          <div style={{ marginTop: 16 }}>
            <button
              className="btn-g"
              onClick={() => { setResume(''); setMos(''); setTargetCompany(''); setAdditionalSkills('') }}
              style={{ background: '#f5f4f0', color: '#5f5e5a', border: '1px solid #d3d1c7', fontSize: 13 }}
            >
              Start over
            </button>
          </div>
        </div>
      )}

      <AdUnit slot="6514090037" />
      <FunFact />
    </div>
  )
}
