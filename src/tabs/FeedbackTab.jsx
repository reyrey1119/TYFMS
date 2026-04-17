import { useState } from 'react'
import { supabase } from '../lib/supabase'

const FEATURES = [
  'Skills Translator',
  'Resume Builder',
  'Identity Guide',
  'Progress Tracker',
  'Career Trends',
  'Find Your Path',
  'Networking',
  'Resources',
  'Search',
  'General',
]

export default function FeedbackTab() {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [feature, setFeature] = useState('')
  const [missing, setMissing] = useState('')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function submit() {
    if (!rating) { setError('Please select a star rating before submitting.'); return }
    if (!supabase) { setError('Database not connected. Feedback cannot be submitted right now.'); return }
    setError('')
    setSubmitting(true)
    try {
      const { error: dbError } = await supabase.from('feedback').insert({
        rating,
        feature_used: feature || null,
        what_missing: missing.trim() || null,
        comment: comment.trim() || null,
      })
      if (dbError) throw dbError
      setSubmitted(true)
    } catch {
      setError('Could not submit feedback. Try again in a moment.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div>
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px', marginBottom: 24 }}>
          <p style={{ fontSize: 36, marginBottom: 16 }}>🎖️</p>
          <p style={{ fontSize: 20, fontWeight: 700, color: '#1a1a18', marginBottom: 10, letterSpacing: '-.01em' }}>
            Thank you for the feedback.
          </p>
          <p style={{ fontSize: 14, color: '#5f5e5a', lineHeight: 1.7, maxWidth: 380, margin: '0 auto' }}>
            Every piece of feedback shapes the next version of TYFMS. Your input is taken seriously.
          </p>
        </div>
        <button
          onClick={() => { setSubmitted(false); setRating(0); setFeature(''); setMissing(''); setComment('') }}
          style={{
            padding: '8px 18px', background: 'none', border: '1px solid #d3d1c7',
            borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: '#5f5e5a',
          }}
        >
          Submit more feedback
        </button>
      </div>
    )
  }

  return (
    <div>
      <p className="sec-title">Feedback</p>
      <p className="sec-sub">
        TYFMS was built from research into what veterans actually need. Your feedback is how it stays
        that way. Tell us what's working, what's missing, and what would make this platform more useful
        for you.
      </p>

      <div className="card" style={{ marginBottom: 20 }}>
        {/* Star rating */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: '#1a1a18', marginBottom: 10, display: 'block' }}>
            Overall rating
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  fontSize: 36, lineHeight: 1,
                  color: star <= (hovered || rating) ? '#C07A28' : '#d3d1c7',
                  transition: 'color .1s',
                }}
              >
                ★
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p style={{ fontSize: 12, color: '#5f5e5a', marginTop: 6 }}>
              {rating === 1 ? 'Needs major improvement' : rating === 2 ? 'Below expectations' : rating === 3 ? 'Meets expectations' : rating === 4 ? 'Really useful' : 'Excellent — exactly what veterans need'}
            </p>
          )}
        </div>

        {/* Feature dropdown */}
        <div style={{ marginBottom: 16 }}>
          <label>Which feature did you use most? (optional)</label>
          <select value={feature} onChange={e => setFeature(e.target.value)}>
            <option value="">Select a feature</option>
            {FEATURES.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        {/* What's missing */}
        <div style={{ marginBottom: 16 }}>
          <label>What's missing? What would make TYFMS more useful? (optional)</label>
          <input
            type="text"
            value={missing}
            onChange={e => setMissing(e.target.value)}
            placeholder="e.g. more resources for National Guard members, better mobile layout..."
          />
        </div>

        {/* Comment */}
        <div style={{ marginBottom: 20 }}>
          <label>Anything else? (optional)</label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Additional feedback, bug reports, suggestions, stories about your transition..."
            style={{ minHeight: 90 }}
          />
        </div>

        {error && <p style={{ color: '#a32d2d', fontSize: 13, marginBottom: 10 }}>{error}</p>}

        <button className="btn-g" onClick={submit} disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit feedback'}
        </button>
      </div>

      <div className="insight">
        <p className="label">Why this matters</p>
        <p>
          TYFMS was built because institutional programs leave gaps. Every piece of feedback you submit
          goes directly into the research loop that shapes the next version. No generic inbox — your input
          is read.
        </p>
      </div>
    </div>
  )
}
