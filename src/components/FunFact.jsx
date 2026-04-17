import { useState, useEffect } from 'react'

const FACTS = [
  "Veterans are 45% more likely to start a business than non-veterans — your mission mindset is a genuine competitive advantage.",
  "The Post-9/11 GI Bill has helped over 2 million veterans and dependents pursue higher education since 2009.",
  "Military training typically equates to 4–6 years of civilian work experience — you are not starting from zero.",
  "Former military members hold CEO or senior leadership roles at more than 25 Fortune 500 companies.",
  "The DoD has trained over 4,000 occupational specialties — nearly every civilian career has a direct military equivalent.",
  "Veterans with a mentor are significantly more likely to land their target role within the first year of separation.",
  "Over 200,000 service members transition out of the military each year — a network that large is a resource.",
  "Research shows veterans' ability to lead under pressure is among the most valued traits by civilian hiring managers.",
  "Veterans who proactively build civilian networks before separating report shorter and smoother transitions.",
  "Identity reconstruction is hard work — but veterans who engage it directly report higher long-term career satisfaction.",
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
    <div style={{ marginTop: 36, borderTop: '1px solid #d3d1c7', paddingTop: 16, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>⭐</span>
      <p style={{
        fontSize: 13, color: '#5f5e5a', lineHeight: 1.7,
        opacity: visible ? 1 : 0, transition: 'opacity 0.35s ease',
      }}>
        <strong style={{ color: '#0f6e56' }}>Did you know?</strong>{' '}{FACTS[idx]}
      </p>
    </div>
  )
}
