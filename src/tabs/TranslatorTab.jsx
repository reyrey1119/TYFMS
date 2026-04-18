import { useState } from 'react'
import FunFact from '../components/FunFact'
import AdUnit from '../components/AdUnit'

const BRANCHES = ['Army', 'Air Force', 'Navy', 'Marine Corps', 'Coast Guard', 'Space Force']

const CERT_GROUPS = [
  { label: 'Cybersecurity & IT', certs: ['CompTIA Security+', 'CompTIA Network+', 'CompTIA A+', 'CompTIA CySA+', 'CompTIA CASP+', 'Certified Ethical Hacker (CEH)', 'CISSP', 'CISM', 'AWS Cloud Practitioner', 'AWS Solutions Architect', 'Microsoft Azure Fundamentals', 'Azure Administrator', 'Google Cloud Associate', 'Cisco CCNA', 'Cisco CCNP', 'Splunk Core Certified User', 'Palo Alto PCNSA'] },
  { label: 'Project & Operations Management', certs: ['Project Management Professional (PMP)', 'CAPM', 'Six Sigma Green Belt', 'Six Sigma Black Belt', 'Lean Six Sigma', 'Agile Scrum Master', 'SAFe Agile', 'ITIL Foundation'] },
  { label: 'Human Resources', certs: ['PHR', 'SPHR', 'SHRM-CP', 'SHRM-SCP', 'aPHR', 'Certified Defense Financial Manager (CDFM)'] },
  { label: 'Healthcare & Medical', certs: ['EMT-Basic', 'EMT-Advanced', 'Paramedic (NREMT-P)', 'CNA', 'Phlebotomy Technician', 'Medical Coding (CPC)', 'HIPAA Compliance'] },
  { label: 'Logistics & Supply Chain', certs: ['APICS CPIM', 'APICS CSCP', 'Certified Supply Chain Professional (CSCP)', 'CDL Class A', 'CDL Class B', 'HAZMAT Operations', 'OSHA 30-Hour'] },
  { label: 'Finance & Accounting', certs: ['Series 7', 'Series 65', 'CPA', 'Certified Financial Planner (CFP)', 'Bloomberg Market Concepts'] },
  { label: 'Law Enforcement & Security', certs: ['CPP (Certified Protection Professional)', 'PSP (Physical Security Professional)', 'Security+ DoD 8570'] },
  { label: 'Education & Counseling', certs: ['Teaching Certificate', 'School Counselor License', 'Certified Career Counselor (CCC)'] },
  { label: 'Trades', certs: ['OSHA 10-Hour', 'Electrician License', 'Plumbing License', 'HVAC Certification', 'Welding Certification (AWS)'] },
]

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
  const [existingCerts, setExistingCerts] = useState([])
  const [certToAdd, setCertToAdd] = useState('')

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
        body: JSON.stringify({ action: 'translate', branch, mos: mos.trim(), rank, yos, existingCerts }),
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
      const r = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resume', branch, mos, rank, yos, ...results }),
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
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>
            Certifications you already hold{' '}
            <span style={{ fontSize: 11, color: '#b4b2a9', fontWeight: 400 }}>(optional — helps tailor recommendations)</span>
          </label>
          <div style={{ display: 'flex', gap: 8, marginBottom: existingCerts.length > 0 ? 8 : 0 }}>
            <select
              value={certToAdd}
              onChange={e => setCertToAdd(e.target.value)}
              style={{ flex: 1 }}
            >
              <option value="">Choose a certification to add…</option>
              {CERT_GROUPS.map(g => (
                <optgroup key={g.label} label={g.label}>
                  {g.certs.map(c => (
                    <option key={c} value={c} disabled={existingCerts.includes(c)}>{c}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            <button
              type="button"
              onClick={() => { if (certToAdd) { setExistingCerts(prev => [...prev, certToAdd]); setCertToAdd('') } }}
              disabled={!certToAdd}
              style={{
                padding: '8px 16px', background: certToAdd ? '#1B3A6B' : '#d3d1c7',
                border: 'none', borderRadius: 8, color: '#fff', fontSize: 13,
                cursor: certToAdd ? 'pointer' : 'default', fontFamily: 'inherit', flexShrink: 0,
              }}
            >
              Add
            </button>
          </div>
          {existingCerts.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {existingCerts.map(cert => (
                <span
                  key={cert}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '3px 8px 3px 10px', background: '#e8f5f3', color: '#0A7868',
                    border: '1px solid #0A7868', borderRadius: 20, fontSize: 11,
                  }}
                >
                  {cert}
                  <button
                    type="button"
                    onClick={() => setExistingCerts(prev => prev.filter(c => c !== cert))}
                    style={{ background: 'none', border: 'none', color: '#0A7868', cursor: 'pointer', padding: 0, fontSize: 15, lineHeight: 1, display: 'flex', alignItems: 'center' }}
                  >×</button>
                </span>
              ))}
            </div>
          )}
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

          {results.certifications && results.certifications.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <p className="cat-label">Certifications to pursue</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
                {results.certifications.map(c => (
                  <div key={c.name} className="card" style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 14px' }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>🎓</span>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 3, color: '#1a1a18' }}>{c.name}</p>
                      <p style={{ fontSize: 13, color: '#5f5e5a', lineHeight: 1.6 }}>{c.why}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                        padding: '5px 12px', background: copied ? '#0A7868' : '#fff',
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
                        padding: '5px 12px', background: '#1B3A6B',
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
