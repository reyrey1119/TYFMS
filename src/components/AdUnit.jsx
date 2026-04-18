import { useEffect, useRef } from 'react'

export default function AdUnit({ slot, format = 'auto' }) {
  const pushed = useRef(false)
  useEffect(() => {
    if (pushed.current) return
    pushed.current = true
    try { ;(window.adsbygoogle = window.adsbygoogle || []).push({}) } catch {}
  }, [])
  return (
    <div className="ad-unit" style={{ margin: '20px 0', position: 'relative', background: '#f5f4f0', borderRadius: 8, overflow: 'hidden' }}>
      <p style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        fontSize: 11, color: '#b4b2a9', pointerEvents: 'none', whiteSpace: 'nowrap',
      }}>
        Advertisement
      </p>
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
