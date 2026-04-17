import { useState } from 'react'
import FunFact from '../components/FunFact'
import AdUnit from '../components/AdUnit'

const BRANCHES = ['Army', 'Air Force', 'Navy', 'Marine Corps', 'Coast Guard', 'Space Force']

const YOS_OPTIONS = [
  '', 'Less than 1 year', '1–2 years', '3–4 years', '5–6 years',
  '7–8 years', '9–10 years', '11–15 years', '16–20 years', '20+ years',
]

export default function TranslatorTab() {
  const [branch, setBranch] = useState('Army')
  const [mos, setMos] = useState('')
  const [rank, setRank] = useState('')
  const [yos, setYos] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')

  // Resume builder state
  const [resumeLoading, setResumeLoading] = useState(false)
  const [resume, setResume] = useState('')
  const [resumeError, setResumeError] = useState('')
  const [copied, setCopied] = useState(false)

  async function translate() {
    if (!mos.trim()) { setError('Please enter your MOS, AFSC, or rate code.'); return }
    setError('')
    setResults(null)
    setResume('')
    setLoading(true)
    try {
      const r = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branch, mos: mos.trim(), rank, yos }),
      })
      const data = await r.json()
      if (!r.ok) { setError(data.error || 'Something went wrong.'); return }
      setResults(data)
    } catch {
      setError('Could not reach the server. Try again.')
    } finally {
      setLoading(false)
    }
  }

  async function buildResume() {
    if (!results) return
    setResumeError('')
    setResume('')
    setResumeLoading(true)
    try {
      const r = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branch, mos, rank, yos, ...results }),
      })
      const data = await r.json()
      if (!r.ok) { setResumeError(data.error || 'Something went wrong.'); return }
      setResume(data.resume)
    } catch {
      setResumeError('Could not reach the server. Try again.')
    } finally {
      setResumeLoading(false)
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
    a.download = `resume-draft-${mos.toUpperCase() || 'veteran'}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div style={{ width: '100%', maxHeight: 320, borderRadius: 12, marginBottom: 20, overflow: 'hidden', background: '#f5f4f0', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
        <img src="/translator.png" alt="Skills translator" style={{ width: '100%', maxHeight: 320, objectFit: 'contain', objectPosition: 'top', display: 'block' }} />
      </div>
      <p className="sec-title">Skills translator</p>
      <p className="sec-sub">
        Enter your occupational code and branch. The AI will translate your military experience into
        civilian job titles, transferable skills, and career path recommendations.
      </p>

      <div className="card" style={{ marginBottom: 16 }}>
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
              onKeyDown={e => e.key === 'Enter' && translate()}
              placeholder="e.g. 25U, 6F0X1, IT"
            />
          </div>
        </div>
        <div className="grid-2" style={{ marginBottom: 16 }}>
          <div>
            <label>Rank (optional)</label>
            <select value={rank} onChange={e => setRank(e.target.value)}>
              <option value="">Select rank (optional)</option>
              <optgroup label="Enlisted">
                <option>E-1 Private</option>
                <option>E-2 Private Second Class</option>
                <option>E-3 Private First Class</option>
                <option>E-4 Specialist / Corporal</option>
                <option>E-5 Sergeant</option>
                <option>E-6 Staff Sergeant</option>
                <option>E-7 Sergeant First Class</option>
                <option>E-8 Master Sergeant / First Sergeant</option>
                <option>E-9 Sergeant Major / Command Sergeant Major</option>
              </optgroup>
              <optgroup label="Warrant Officers">
                <option>W-1 Warrant Officer 1</option>
                <option>W-2 Chief Warrant Officer 2</option>
                <option>W-3 Chief Warrant Officer 3</option>
                <option>W-4 Chief Warrant Officer 4</option>
                <option>W-5 Chief Warrant Officer 5</option>
              </optgroup>
              <optgroup label="Officers">
                <option>O-1 Second Lieutenant</option>
                <option>O-2 First Lieutenant</option>
                <option>O-3 Captain</option>
                <option>O-4 Major</option>
                <option>O-5 Lieutenant Colonel</option>
                <option>O-6 Colonel</option>
                <option>O-7 Brigadier General</option>
                <option>O-8 Major General</option>
                <option>O-9 Lieutenant General</option>
                <option>O-10 General</option>
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
        <button className="btn-g" onClick={translate} disabled={loading}>
          {loading ? 'Analyzing your military experience...' : 'Translate my experience'}
        </button>
        {error && <p style={{ color: '#a32d2d', fontSize: 13, paddingTop: 8 }}>{error}</p>}
      </div>

      {results && (
        <div style={{ borderTop: '1px solid #d3d1c7', paddingTop: 20 }}>
          <p className="cat-label">Civilian job titles</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
            {results.civilianTitles.map(t => <span key={t} className="bg">{t}</span>)}
          </div>

          <p className="cat-label">Transferable skills</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 6, marginBottom: 20 }}>
            {results.transferableSkills.map(s => <div key={s} className="chip">{s}</div>)}
          </div>

          <p className="cat-label">Career paths</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {results.careerPaths.map(p => (
              <div key={p.title} className="card">
                <p style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>{p.title}</p>
                <p style={{ fontSize: 13, color: '#5f5e5a', lineHeight: 1.6 }}>{p.description}</p>
              </div>
            ))}
          </div>

          <p className="cat-label">Target industries</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
            {results.targetIndustries.map(i => <span key={i} className="ba">{i}</span>)}
          </div>

          <div className="insight" style={{ marginBottom: 24 }}>
            <p className="label">Identity transition tip</p>
            <p>{results.identityTip}</p>
          </div>

          {/* Resume builder */}
          <div style={{ borderTop: '1px solid #d3d1c7', paddingTop: 20 }}>
            <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>Resume draft</p>
            <p style={{ fontSize: 13, color: '#5f5e5a', marginBottom: 14, lineHeight: 1.6 }}>
              Generate a complete resume draft with your military experience translated into
              civilian language — ready to customize with your actual details.
            </p>
            <button className="btn-b" onClick={buildResume} disabled={resumeLoading} style={{ marginBottom: resumeError ? 8 : 0 }}>
              {resumeLoading ? 'Building your resume...' : 'Build my resume draft'}
            </button>
            {resumeError && <p style={{ color: '#a32d2d', fontSize: 13, marginTop: 8 }}>{resumeError}</p>}

            {resume && (
              <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#1a1a18' }}>Your resume draft</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={copyResume}
                      style={{
                        padding: '5px 12px', background: copied ? '#0f6e56' : '#fff',
                        border: '1px solid #d3d1c7', borderRadius: 8, fontSize: 12,
                        cursor: 'pointer', fontFamily: 'inherit', color: copied ? '#fff' : '#5f5e5a',
                        transition: 'all .15s',
                      }}
                    >
                      {copied ? '✓ Copied' : 'Copy to clipboard'}
                    </button>
                    <button
                      onClick={downloadResume}
                      style={{
                        padding: '5px 12px', background: '#185fa5',
                        border: 'none', borderRadius: 8, fontSize: 12,
                        cursor: 'pointer', fontFamily: 'inherit', color: '#fff',
                      }}
                    >
                      Download .txt
                    </button>
                  </div>
                </div>
                <div className="resume-output">{resume}</div>
                <p style={{ fontSize: 11, color: '#b4b2a9', marginTop: 8 }}>
                  Replace all bracketed placeholders [ ] with your actual information before using.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <AdUnit slot="6514090037" />
      <FunFact />
    </div>
  )
}
