import { useEffect, useRef, useState } from 'react'

export default function AdUnit({ slot, format = 'auto' }) {
  const pushed = useRef(false)
  const insRef = useRef(null)
  const [filled, setFilled] = useState(false)
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768

  useEffect(() => {
    if (pushed.current) return
    pushed.current = true
    try { ;(window.adsbygoogle = window.adsbygoogle || []).push({}) } catch {}
  }, [])

  // Watch for AdSense to mark the slot as filled
  useEffect(() => {
    const ins = insRef.current
    if (!ins) return
    if (ins.dataset.adStatus === 'filled') { setFilled(true); return }
    const obs = new MutationObserver(() => {
      if (ins.dataset.adStatus === 'filled') { setFilled(true); obs.disconnect() }
    })
    obs.observe(ins, { attributes: true, attributeFilter: ['data-ad-status'] })
    return () => obs.disconnect()
  }, [])

  // Mobile: render <ins> in a zero-height container so AdSense can still serve,
  // but take up no visual space until an actual ad fills.
  if (isMobile && !filled) {
    return (
      <div style={{ height: 0, overflow: 'hidden' }}>
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

  return (
    <div className="ad-unit" style={{ margin: '20px 0', position: 'relative', background: '#f5f4f0', borderRadius: 8, overflow: 'hidden' }}>
      {!filled && (
        <p style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          fontSize: 11, color: '#b4b2a9', pointerEvents: 'none', whiteSpace: 'nowrap',
        }}>
          Advertisement
        </p>
      )}
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
