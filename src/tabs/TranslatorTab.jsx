import { useState, useEffect } from 'react'

const BRANCHES = ['Army', 'Air Force', 'Navy', 'Marine Corps', 'Coast Guard', 'Space Force']

export default function TranslatorTab() {
  const [apiKey, setApiKey] = useState('')
  const [keySaved, setKeySaved] = useState(false)
  const [branch, setBranch] = useState('Army')
  const [mos, setMos] = useState('')
  const [rank, setRank] = useState('')
  const [yos, setYos] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const k = localStorage.getItem('vtg_api_key')
    if (k) { setApiKey(k); setKeySaved(true) }
  }, [])

  function saveKey() {
    const k = apiKey.trim()
    if (!k) return
    localStorage.setItem('vtg_api_key', k)
    setKeySaved(true)
  }

  async function translate() {
    const key = apiKey.trim() || localStorage.getItem('vtg_api_key')
    if (!key) { setError('Please enter your Anthropic API key above first.'); return }
    if (!mos.trim()) { setError('Please enter your MOS, AFSC, or rate code.'); return }
    setError('')
    setResults(null)
    setLoading(true)

    const prompt = `You are a career counselor specializing in military-to-civilian transitions. Translate this veteran's military background into civilian career terms.

Branch: ${branch}
Occupational code: ${mos}
${rank ? 'Rank: ' + rank : ''}
${yos ? 'Years of service: ' + yos : ''}

Respond ONLY with valid JSON, no markdown, no extra text:
{"civilianTitles":["t1","t2","t3"],"transferableSkills":["s1","s2","s3","s4","s5","s6"],"careerPaths":[{"title":"path","description":"why it fits"},{"title":"path","description":"why it fits"},{"title":"path","description":"why it fits"}],"targetIndustries":["i1","i2","i3","i4"],"identityTip":"one specific actionable tip for identity transition from this background"}`

    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      })
      const data = await r.json()
      if (data.error) { setError('API error: ' + data.error.message); return }
      const txt = (data.content || []).map(i => i.text || '').join('').replace(/```json|```/g, '').trim()
      setResults(JSON.parse(txt))
    } catch {
      setError('Something went wrong. Check your API key and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <p className="sec-title">Skills translator</p>
      <p className="sec-sub">
        Enter your occupational code and branch. The AI will translate your military experience into
        civilian job titles, transferable skills, and career path recommendations.
      </p>

      <div className="apikey-bar">
        <p>
          The skills translator uses the Anthropic AI API. Enter your API key below to activate it.
          Get one free at{' '}
          <a href="https://console.anthropic.com" target="_blank" rel="noreferrer">console.anthropic.com</a>.
          Your key is saved in your browser only.
        </p>
        <div className="apikey-row">
          <input
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && saveKey()}
            placeholder="sk-ant-..."
          />
          <button onClick={saveKey}>Save key</button>
        </div>
        {keySaved && <p style={{ fontSize: 12, color: '#0f6e56', marginTop: 6 }}>API key saved.</p>}
      </div>

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
            <input type="text" value={mos} onChange={e => setMos(e.target.value)} placeholder="e.g. 25U, 6F0X1, IT" />
          </div>
        </div>
        <div className="grid-2" style={{ marginBottom: 16 }}>
          <div>
            <label>Rank (optional)</label>
            <input type="text" value={rank} onChange={e => setRank(e.target.value)} placeholder="e.g. SSG, TSgt, PO2" />
          </div>
          <div>
            <label>Years of service (optional)</label>
            <input type="number" value={yos} onChange={e => setYos(e.target.value)} placeholder="e.g. 8" min="1" max="40" />
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

          <div className="insight">
            <p className="label">Identity transition tip</p>
            <p>{results.identityTip}</p>
          </div>
        </div>
      )}
    </div>
  )
}
