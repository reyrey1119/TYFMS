import { useEffect, useRef, useState } from 'react'

export default function AdUnit({ slot, format = 'auto' }) {
  const pushed = useRef(false)
  const insRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (pushed.current) return
    pushed.current = true
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}

    const el = insRef.current
    if (!el) return
    const observer = new MutationObserver(() => {
      const status = el.getAttribute('data-ad-status')
      setVisible(status === 'filled')
    })
    observer.observe(el, { attributes: true, attributeFilter: ['data-ad-status'] })
    return () => observer.disconnect()
  }, [])

  return (
    <div style={{ overflow: 'hidden', height: visible ? 'auto' : 0, margin: visible ? '20px 0' : 0 }}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-9783766249592608"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
