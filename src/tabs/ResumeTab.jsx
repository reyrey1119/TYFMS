import { useState } from 'react'
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

export default function ResumeTab() {
  const [branch, setBranch] = useState('Army')
  const [mos, setMos] = useState('')
  const [rank, setRank] = useState('')
  const [yos, setYos] = useState('')
  const [targetCompany, setTargetCompany] = useState('')
  const [additionalSkills, setAdditionalSkills] = useState('')

  const [loading, setLoading] = useState(false)
  const [resume, setResume] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function generateResume() {
    if (!mos.trim()) { setError('Please enter your MOS, AFSC, or rate code.'); return }
    setError('')
    setResume('')
    setLoading(true)
    try {
      const r = await fetch('/api/resume-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branch, mos: mos.trim(), rank, yos, targetCompany: targetCompany.trim(), additionalSkills: additionalSkills.trim() }),
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

  return (
    <div>
      <p className="sec-title">Resume builder</p>
      <p className="sec-sub">
        Enter your military background and target employer. The AI will generate a complete, tailored
        civilian resume — professional summary, experience translated from military language, skills
        matched to the company's culture, and education placeholder.
      </p>

      <div className="card" style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 14 }}>Your military background</p>

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
                  background: targetCompany === c ? '#0f6e56' : '#fff',
                  color: targetCompany === c ? '#fff' : '#5f5e5a',
                  fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Additional skills or context (optional)</label>
          <textarea
            value={additionalSkills}
            onChange={e => setAdditionalSkills(e.target.value)}
            placeholder="e.g. Python, project management, bilingual Spanish, ITIL certification, 4 years signals intelligence..."
            style={{ minHeight: 70 }}
          />
        </div>

        <button className="btn-g" onClick={generateResume} disabled={loading}>
          {loading ? 'Building your resume...' : 'Generate my resume'}
        </button>
        {error && <p style={{ color: '#a32d2d', fontSize: 13, paddingTop: 8 }}>{error}</p>}
      </div>

      {resume && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
            <p style={{ fontSize: 14, fontWeight: 500 }}>
              Your resume draft {targetCompany && <span style={{ color: '#0f6e56' }}>— tailored for {targetCompany}</span>}
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={copyResume}
                style={{
                  padding: '6px 14px', background: copied ? '#0f6e56' : '#fff',
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
                  padding: '6px 14px', background: '#185fa5', border: 'none',
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
              Replace all bracketed placeholders [ ] with your actual information. Add your real name,
              contact info, dates, and specific metrics before using this resume.
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
