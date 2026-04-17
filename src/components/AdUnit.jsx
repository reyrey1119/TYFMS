import { useEffect, useRef } from 'react'

export default function AdUnit({ slot, format = 'auto' }) {
  const ref = useRef(false)

  useEffect(() => {
    if (ref.current) return
    ref.current = true
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}
  }, [])

  return (
    <div style={{ margin: '20px 0', overflow: 'hidden', minHeight: 90 }}>
      <ins
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
