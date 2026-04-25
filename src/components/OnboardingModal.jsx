import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const LS_KEY = 'tyfms_onboarding_done'

export default function OnboardingModal({ onComplete, onNavigate }) {
  const { user, supabaseEnabled } = useAuth()
  const [step, setStep] = useState(1)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!user) return
    if (localStorage.getItem(LS_KEY)) return
    checkShouldShow()
  }, [user])

  async function checkShouldShow() {
    if (supabaseEnabled && supabase && user) {
      try {
        const { data } = await supabase
          .from('onboarding_complete')
          .select('user_id')
          .eq('user_id', user.id)
          .maybeSingle()
        if (data) { localStorage.setItem(LS_KEY, '1'); return }
      } catch {}
    }
    setVisible(true)
  }

  async function complete(navigateTo) {
    localStorage.setItem(LS_KEY, '1')
    if (supabaseEnabled && supabase && user) {
      try {
        await supabase.from('onboarding_complete').upsert({ user_id: user.id, completed_at: new Date().toISOString() }, { onConflict: 'user_id' })
      } catch {}
    }
    setVisible(false)
    onComplete?.()
    if (navigateTo) onNavigate?.(navigateTo)
  }

  if (!visible) return null

  const steps = [
    {
      title: 'Welcome to TYFMS',
      content: (
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 40, marginBottom: 16 }}>🎖️</p>
          <p style={{ fontSize: 14, color: '#1a1a18', lineHeight: 1.7, marginBottom: 8 }}>
            TYFMS gives you free tools built specifically for the military-to-civilian transition.
          </p>
          <p style={{ fontSize: 13, color: '#5f5e5a', lineHeight: 1.7 }}>
            Translate your MOS into civilian language, build a resume that passes ATS systems, find career paths that match your background, and track your transition progress — all in one place.
          </p>
        </div>
      ),
    },
    {
      title: 'Where do you want to start?',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { icon: '⚡', label: 'Translate My Skills', desc: 'Turn your MOS into civilian job titles and transferable skills', tab: 'translator' },
            { icon: '📄', label: 'Build My Resume', desc: 'AI-powered resume and CV builder optimized for veterans', tab: 'resume' },
            { icon: '🧭', label: 'Find My Path', desc: 'Discover civilian career paths that match your military background', tab: 'path' },
          ].map(opt => (
            <button
              key={opt.tab}
              onClick={() => complete(opt.tab)}
              style={{
                padding: '14px 16px', background: '#FAFAF8', border: '1.5px solid #E5E3DC',
                borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                display: 'flex', alignItems: 'flex-start', gap: 12, transition: 'border-color .15s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#1B3A6B'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E3DC'}
            >
              <span style={{ fontSize: 22, flexShrink: 0 }}>{opt.icon}</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1a18', marginBottom: 2 }}>{opt.label}</p>
                <p style={{ fontSize: 12, color: '#5f5e5a', lineHeight: 1.5 }}>{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "You're ready.",
      content: (
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 40, marginBottom: 16 }}>✅</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1a18', marginBottom: 10 }}>
            Pro tip: Start with the Skills Translator
          </p>
          <p style={{ fontSize: 13, color: '#5f5e5a', lineHeight: 1.7 }}>
            Enter your MOS or rate code to instantly see civilian job titles, transferable skills, and recommended certifications. Then use those results to pre-fill your resume builder with one click.
          </p>
        </div>
      ),
    },
  ]

  const current = steps[step - 1]

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: '32px 28px', maxWidth: 480, width: '100%',
        boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
      }}>
        {/* Step dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 24 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: 7, height: 7, borderRadius: '50%',
              background: i + 1 === step ? '#1B3A6B' : '#E5E3DC', transition: 'background .2s',
            }} />
          ))}
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1a1a18', marginBottom: 20, textAlign: 'center' }}>
          {current.title}
        </h2>

        <div style={{ marginBottom: 28 }}>{current.content}</div>

        {step < 3 ? (
          <div style={{ display: 'flex', gap: 8 }}>
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)} style={{
                flex: '0 1 auto', padding: '12px 22px', background: '#fff',
                border: '1px solid #d3d1c7', borderRadius: 10, color: '#5f5e5a',
                fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
              }}>← Back</button>
            )}
            <button onClick={() => setStep(s => s + 1)} style={{
              flex: 1, padding: '12px 20px',
              background: 'linear-gradient(135deg, #1B3A6B 0%, #0f2857 100%)',
              border: 'none', borderRadius: 10, color: '#fff', fontSize: 14,
              fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              {step === 1 ? "Get started →" : "Next →"}
            </button>
          </div>
        ) : (
          <button onClick={() => complete()} style={{
            width: '100%', padding: '13px 20px',
            background: 'linear-gradient(135deg, #C07A28 0%, #9A5F1A 100%)',
            border: 'none', borderRadius: 10, color: '#fff', fontSize: 14,
            fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            Go to TYFMS →
          </button>
        )}

        <button onClick={() => complete()} style={{
          display: 'block', margin: '12px auto 0', background: 'none', border: 'none',
          fontSize: 12, color: '#b4b2a9', cursor: 'pointer', fontFamily: 'inherit',
        }}>
          Skip
        </button>
      </div>
    </div>
  )
}
