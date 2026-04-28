import { useState, useEffect } from 'react'
import FunFact from '../components/FunFact'
import AdUnit from '../components/AdUnit'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const BRANCHES = ['Army', 'Air Force', 'Navy', 'Marine Corps', 'Coast Guard', 'Space Force', 'National Guard', 'Reserve']

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

export default function TranslatorTab({ onGoToResume }) {
  const { user, supabaseEnabled, profile } = useAuth()
  const useDb = supabaseEnabled && !!supabase && !!user

  const [vaultDocs, setVaultDocs] = useState([])
  useEffect(() => {
    if (!useDb) return
    supabase
      .from('vault_documents')
      .select('document_type, filename, extracted_text')
      .eq('user_id', user.id)
      .not('extracted_text', 'is', null)
      .then(({ data }) => { if (data) setVaultDocs(data) })
  }, [useDb])

  const vaultContext = vaultDocs.length > 0
    ? vaultDocs.map(d => `=== ${d.document_type.toUpperCase()} — ${d.filename} ===\n${d.extracted_text}`).join('\n\n')
    : ''

  const [branch, setBranch] = useState('Army')
  const [mos, setMos] = useState('')
  const [rank, setRank] = useState('')

  const [profileApplied, setProfileApplied] = useState(false)
  useEffect(() => {
    if (!profile || profileApplied) return
    if (profile.branch && BRANCHES.includes(profile.branch)) setBranch(profile.branch)
    if (profile.rank) setRank(profile.rank)
    setProfileApplied(true)
  }, [profile])
  const [yos, setYos] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const [existingCerts, setExistingCerts] = useState([])
  const [certToAdd, setCertToAdd] = useState('')

  const [milRefData, setMilRefData] = useState(null)
  const [milRefStatus, setMilRefStatus] = useState('idle')
  const [milDuties, setMilDuties] = useState('')

  useEffect(() => {
    if (!mos.trim() || !rank) { setMilRefStatus('idle'); setMilRefData(null); return }
    const timer = setTimeout(async () => {
      if (!['Army', 'Air Force', 'Navy', 'Marine Corps'].includes(branch)) { setMilRefStatus('unsupported'); return }
      setMilRefStatus('loading'); setMilRefData(null)
      try {
        const r = await fetch('/api/resume-tools', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'mil-reference', branch, mos_afsc: mos.trim(), rank }),
        })
        const data = await r.json()
        if (!r.ok || data.error) { setMilRefStatus('failed'); return }
        setMilRefData(data); setMilRefStatus('found')
      } catch { setMilRefStatus('failed') }
    }, 700)
    return () => clearTimeout(timer)
  }, [mos, rank, branch])

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
        body: JSON.stringify({ action: 'translate', branch, mos: mos.trim(), rank, yos, existingCerts, milReference: milRefData, milDuties: milDuties.trim(), vaultContext: vaultContext || undefined }),
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
      <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#b4b2a9', marginBottom: 4 }}>What You Bring</p>
      <p className="sec-title">Skills translator</p>
      <p className="sec-sub">
        Everything you did in service — the skills, the leadership, the technical mastery — is already
        there. This tool makes it visible to civilian employers.
      </p>
      <p style={{ fontSize: 13, color: '#5f5e5a', lineHeight: 1.7, marginBottom: 20 }}>
        Enter your occupational code and branch. The AI will translate your military experience into
        civilian job titles, transferable skills, and career path recommendations.
      </p>

      {profileApplied && profile && (profile.branch || profile.rank) && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12,
          padding: '12px 16px', background: '#EFF3FB', border: '1px solid #B8C9E8', borderRadius: 12,
        }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>👤</span>
          <p style={{ fontSize: 12, color: '#1B3A6B' }}>
            <strong>Using your saved profile.</strong> Branch and rank have been pre-filled from your account.
          </p>
        </div>
      )}

      {vaultDocs.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16,
          padding: '12px 16px', background: '#F0F7EE', border: '1px solid #B8DDB8', borderRadius: 12,
        }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>🔒</span>
          <p style={{ fontSize: 12, color: '#1a6614' }}>
            <strong>Document Vault connected.</strong> Your translation will reflect your actual documented skills and accomplishments from {vaultDocs.length} service document{vaultDocs.length !== 1 ? 's' : ''}.
          </p>
        </div>
      )}

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="grid-2" style={{ marginBottom: 12 }}>
          <div>
            <label>Branch of service</label>
            <select value={branch} onChange={e => { setBranch(e.target.value); setMilRefData(null); setMilRefStatus('idle') }}>
              {BRANCHES.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label>MOS / AFSC / Rate / NEC</label>
            <input
              type="text"
              value={mos}
              onChange={e => { setMos(e.target.value); setMilRefData(null); setMilRefStatus('idle') }}
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
        {milRefStatus === 'loading' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: '#f5f4f0', borderRadius: 8, marginBottom: 12, fontSize: 13, color: '#5f5e5a' }}>
            <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid #0A7868', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
            Looking up official duty description...
          </div>
        )}
        {milRefStatus === 'found' && milRefData && milRefData._source === 'pdf' && (
          <div style={{ background: '#e8f5f3', border: '1px solid #0A7868', borderRadius: 8, padding: '10px 14px', marginBottom: 12, fontSize: 13 }}>
            <p style={{ color: '#0A7868', fontWeight: 600, marginBottom: 2 }}>✓ Official duty description found</p>
            <p style={{ color: '#5f5e5a', fontSize: 12 }}>{milRefData.duty_title} — {milRefData.document_source}</p>
          </div>
        )}
        {milRefStatus === 'found' && milRefData && milRefData._source === 'database' && (
          <div style={{ background: '#e8f5f3', border: '1px solid #0A7868', borderRadius: 8, padding: '10px 14px', marginBottom: 12, fontSize: 13 }}>
            <p style={{ color: '#0A7868', fontWeight: 600, marginBottom: 2 }}>✓ Duty description loaded from {milRefData.document_source}</p>
            <p style={{ color: '#5f5e5a', fontSize: 12 }}>{milRefData.duty_title}</p>
          </div>
        )}
        {milRefStatus === 'found' && milRefData && milRefData._source !== 'pdf' && milRefData._source !== 'database' && (
          <div style={{ background: '#e8f0f5', border: '1px solid #2d7a8a', borderRadius: 8, padding: '10px 14px', marginBottom: 12, fontSize: 13 }}>
            <p style={{ color: '#2d7a8a', fontWeight: 600, marginBottom: 2 }}>✓ Duty description loaded from AI knowledge</p>
            <p style={{ color: '#5f5e5a', fontSize: 12 }}>Official publication unavailable — using trained knowledge of {mos.trim().toUpperCase()} from {milRefData.document_source}</p>
          </div>
        )}
        {milRefStatus === 'failed' && (
          <div style={{ background: '#f9f8f5', border: '1px solid #d3d1c7', borderRadius: 8, padding: '10px 14px', marginBottom: 12, fontSize: 13 }}>
            <p style={{ color: '#5f5e5a', fontWeight: 600, marginBottom: 4 }}>Official duty description not available</p>
            <p style={{ color: '#5f5e5a', fontSize: 12, marginBottom: 8, lineHeight: 1.5 }}>Your translation will still run using AI knowledge of your MOS. Optionally describe your duties below for a more tailored result.</p>
            <textarea
              value={milDuties}
              onChange={e => setMilDuties(e.target.value)}
              placeholder="e.g. Maintained and operated radio communications systems, trained junior soldiers on SINCGARS..."
              rows={3}
              style={{ width: '100%', fontSize: 13, borderRadius: 6, border: '1px solid #d3d1c7', padding: '7px 9px', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>
        )}
        {milRefStatus === 'unsupported' && (
          <div style={{ background: '#f5f4f0', border: '1px solid #d3d1c7', borderRadius: 8, padding: '8px 14px', marginBottom: 12, fontSize: 12, color: '#5f5e5a' }}>
            Official duty lookup is available for Army, Air Force, Navy, and Marine Corps. Translation will still run using your MOS/rate.
          </div>
        )}
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

          {/* CTA → full Resume Builder */}
          <div style={{
            background: 'linear-gradient(135deg, #1B3A6B 0%, #0f1b4d 100%)',
            borderRadius: 14, padding: '22px 24px', marginBottom: 24,
          }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
              Ready to build your full resume?
            </p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, marginBottom: 16 }}>
              Your branch, MOS, rank, and years of service will be pre-filled automatically.
            </p>
            <button
              onClick={() => onGoToResume && onGoToResume({ branch, mos, rank, yos })}
              style={{
                width: '100%', padding: '13px 20px', background: '#C07A28',
                border: 'none', borderRadius: 10, color: '#fff', fontSize: 14,
                fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Build my resume with these results →
            </button>
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
