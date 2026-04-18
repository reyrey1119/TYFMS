import { useEffect, useRef, useState } from 'react'

export default function AdUnit({ slot, format = 'auto' }) {
  const pushed = useRef(false)
  const insRef = useRef(null)
  const [filled, setFilled] = useState(false)

  useEffect(() => {
    if (pushed.current) return
    pushed.current = true
    try { ;(window.adsbygoogle = window.adsbygoogle || []).push({}) } catch {}
  }, [])

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

  // Keep <ins> in DOM always so AdSense can serve. Zero visual footprint until filled.
  return (
    <div style={filled ? { margin: '20px 0' } : { height: 0, overflow: 'hidden' }}>
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
