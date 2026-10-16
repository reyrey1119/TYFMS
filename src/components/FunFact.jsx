import { useState, useEffect } from 'react'

const FACTS = [
  "Separate training you completed, tasks you practiced, and duties you performed when describing your experience.",
  "Use numbers on your resume only when you can support them from your own records or experience.",
  "Compare your experience with the requirements in the specific job posting you want to apply for.",
  "List a certification as earned only if you hold it. Keep credentials you plan to pursue separate.",
  "Translate military acronyms into plain language that a civilian employer can understand.",
  "Ask someone in your target field to review whether your resume clearly explains your work.",
  "A specialty reference describes possible duties and development paths. It does not establish what you personally did.",
  "Check the publication date and source before relying on reference guidance.",
]

export default function FunFact() {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * FACTS.length))
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx(i => (i + 1) % FACTS.length)
        setVisible(true)
      }, 350)
    }, 11000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="fun-fact" style={{ marginTop: 36 }}>
      <p className="fun-label">Transition tip</p>
      <p style={{
        fontSize: 13, color: '#2A2820', lineHeight: 1.7,
        opacity: visible ? 1 : 0, transition: 'opacity 0.35s ease',
      }}>
        {FACTS[idx]}
      </p>
    </div>
  )
}
