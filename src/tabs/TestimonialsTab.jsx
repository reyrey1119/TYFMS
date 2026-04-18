import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import FunFact from '../components/FunFact'

const BRANCHES = ['Army', 'Air Force', 'Navy', 'Marine Corps', 'Coast Guard', 'Space Force']
const FEATURES = [
  'Skills translator', 'Resume builder', 'Find your path',
  'Peer networking', 'Career trends', 'Identity guide',
  'Resources directory', 'Vet news', 'Progress tracker',
]
const YEARS_OUT = ['Currently serving', 'Less than 1 year', '1–2 years', '3–5 years', '6–10 years', '10+ years']
const AVATAR_COLORS = ['#1B3A6B', '#0A7868', '#C07A28', '#7B3F91', '#a32d2d', '#2d6a8a']


function Avatar({ name, size = 44 }) {
  const initials = (name || '?').trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase()
  const color = AVATAR_COLORS[(name || ' ').charCodeAt(0) % AVATAR_COLORS.length]
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: color, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontSize: Math.round(size * 0.36), fontWeight: 700,
    }}>
      {initials}
    </div>
  )
}

export default function TestimonialsTab() {
  const { supabaseEnabled } = useAuth()
  const useDb = supabaseEnabled && !!supabase

  const [testimonials, setTestimonials] = useState([])
  const [loadingStories, setLoadingStories] = useState(true)

  const [name, setName] = useState('')
  const [branch, setBranch] = useState('Army')
  const [mos, setMos] = useState('')
  const [yearsOut, setYearsOut] = useState('')
  const [featureUsed, setFeatureUsed] = useState('')
  const [story, setStory] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    loadTestimonials()
  }, [useDb])

  async function loadTestimonials() {
    if (!useDb) { setLoadingStories(false); return }
    setLoadingStories(true)
    try {
      const { data } = await supabase
        .from('testimonials')
        .select('id, name, branch, mos, years_out, feature_used, story, created_at')
        .eq('approved', true)
        .order('created_at', { ascending: false })
      setTestimonials(data || [])
    } catch {
      setTestimonials([])
    } finally {
      setLoadingStories(false)
    }
  }

  async function submit() {
    if (!name.trim() || !mos.trim() || story.trim().length < 20) {
      setSubmitError('Please fill in your name, MOS/AFSC, and at least a sentence or two.')
      return
    }
    setSubmitting(true)
    setSubmitError('')

    const payload = {
      name: name.trim(),
      branch,
      mos: mos.trim().toUpperCase(),
      years_out: yearsOut || null,
      feature_used: featureUsed || null,
      story: story.trim(),
    }

    if (useDb) {
      try {
        const { error } = await supabase.from('testimonials').insert(payload)
        if (error) { setSubmitError(error.message); setSubmitting(false); return }
      } catch {
        setSubmitError('Could not submit. Please try again.')
        setSubmitting(false)
        return
      }
    }

    setSubmitted(true)
    setSubmitting(false)
  }

  return (
    <div>
      {/* Intro */}
      <div style={{ marginBottom: 32 }}>
        <p className="sec-title">Veterans speaking for themselves.</p>
        <p style={{ fontSize: 18, fontWeight: 700, color: '#1B3A6B', marginBottom: 14, lineHeight: 1.3 }}>
          Real stories. No marketing speak.
        </p>
        <p className="sec-sub">
          Every veteran's transition is different, but the struggles rarely are. When you read
          about someone who wore the same uniform and found solid ground on the other side,
          something clicks. These are their words — honest, unedited, and here to remind you
          that the next chapter is possible.
        </p>
      </div>

      {/* Stories */}
      {loadingStories ? (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '16px 0', marginBottom: 32 }}>
          <span className="search-spinner" style={{ width: 14, height: 14, borderColor: 'rgba(26,26,24,.2)', borderTopColor: '#1a1a18' }} />
          <p style={{ fontSize: 13, color: '#5f5e5a' }}>Loading stories…</p>
        </div>
      ) : testimonials.length === 0 ? (
        <div style={{
          padding: '36px 24px', textAlign: 'center', marginBottom: 40,
          background: '#f9f8f5', borderRadius: 12, border: '1px dashed #d3d1c7',
        }}>
          <p style={{ fontSize: 28, marginBottom: 12 }}>⭐</p>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#1a1a18', marginBottom: 8 }}>
            Be the first to share your story.
          </p>
          <p style={{ fontSize: 13, color: '#5f5e5a', lineHeight: 1.7 }}>
            Real testimonials from real veterans will appear here once submitted and reviewed.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
          {testimonials.map((t, i) => (
            <div
              key={t.id || i}
              className="card"
              style={{ borderLeft: '4px solid #C07A28', borderRadius: '0 12px 12px 0', padding: '18px 20px' }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap' }}>
                <Avatar name={t.name} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a18', marginBottom: 2 }}>{t.name}</p>
                  <p style={{ fontSize: 12, color: '#5f5e5a' }}>
                    {t.branch} · {t.mos}
                    {t.years_out && <span> · {t.years_out} out</span>}
                  </p>
                </div>
                {t.feature_used && (
                  <span className="bg" style={{ fontSize: 10, flexShrink: 0 }}>{t.feature_used}</span>
                )}
              </div>
              <p style={{ fontSize: 14, color: '#1a1a18', lineHeight: 1.8, fontStyle: 'italic' }}>
                "{t.story}"
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Submission form */}
      <div className="card" style={{ marginBottom: 24 }}>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '28px 0' }}>
            <p style={{ fontSize: 32, marginBottom: 14 }}>🙏</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#1a1a18', marginBottom: 10 }}>Thank you for sharing.</p>
            <p style={{ fontSize: 14, color: '#5f5e5a', lineHeight: 1.75, maxWidth: 400, margin: '0 auto' }}>
              Your story has been submitted and will be reviewed by a human before it goes live.
              It may be exactly what another veteran needs to take their first step.
            </p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#1a1a18', marginBottom: 4 }}>Add your story</p>
            <p style={{ fontSize: 13, color: '#5f5e5a', lineHeight: 1.65, marginBottom: 20 }}>
              If TYFMS helped you — even a little — your words could be the thing that convinces
              another veteran to take the first step. It takes two minutes, and it stays in your words.
            </p>

            <div className="grid-2" style={{ marginBottom: 12 }}>
              <div>
                <label>Your name or callsign</label>
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="e.g. SGT Williams or just Tom"
                />
              </div>
              <div>
                <label>Branch</label>
                <select value={branch} onChange={e => setBranch(e.target.value)}>
                  {BRANCHES.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
            </div>

            <div className="grid-2" style={{ marginBottom: 12 }}>
              <div>
                <label>MOS / AFSC / Rate</label>
                <input
                  type="text" value={mos} onChange={e => setMos(e.target.value)}
                  placeholder="e.g. 11A, 6F0X1, IT"
                />
              </div>
              <div>
                <label>How long have you been out?</label>
                <select value={yearsOut} onChange={e => setYearsOut(e.target.value)}>
                  <option value="">Prefer not to say</option>
                  {YEARS_OUT.map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label>Which feature helped you most? <span style={{ fontSize: 11, color: '#b4b2a9', fontWeight: 400 }}>(optional)</span></label>
              <select value={featureUsed} onChange={e => setFeatureUsed(e.target.value)}>
                <option value="">Select one…</option>
                {FEATURES.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label>
                Your story{' '}
                <span style={{ fontSize: 11, color: story.length > 230 ? '#a32d2d' : '#b4b2a9', fontWeight: 400 }}>
                  ({250 - story.length} characters remaining)
                </span>
              </label>
              <textarea
                value={story}
                onChange={e => setStory(e.target.value.slice(0, 250))}
                rows={4}
                placeholder="What were you struggling with? What changed? What would you tell another veteran in your shoes?"
              />
            </div>

            <button className="btn-g" onClick={submit} disabled={submitting}>
              {submitting ? 'Submitting…' : 'Share my story'}
            </button>

            {submitError && (
              <p style={{ fontSize: 13, color: '#a32d2d', marginTop: 8 }}>{submitError}</p>
            )}

            <p style={{ fontSize: 11, color: '#b4b2a9', marginTop: 14, lineHeight: 1.65 }}>
              All stories are reviewed by a human before publishing. We never share your contact
              information. Your words are yours — we just give them a place to live.
            </p>
          </>
        )}
      </div>

      <FunFact />
    </div>
  )
}
