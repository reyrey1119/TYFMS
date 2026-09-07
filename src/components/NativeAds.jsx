import { useEffect } from 'react'

// Native AdMob banner — only does anything inside the iOS/Android app shell.
// On the website, Capacitor.isNativePlatform() is false and this renders
// nothing; AdUnit.jsx (AdSense) keeps handling ads there.
//
// Real "TYFMS" AdMob IDs (publisher pub-1329301779873532). The matching app ID
// lives in ios/App/App/Info.plist (GADApplicationIdentifier).
const BANNER_AD_UNIT_ID_IOS = 'ca-app-pub-1329301779873532/7559441680'

// While true, every ad request is a TEST request (test creatives, no revenue,
// no risk of invalid-traffic flags from our own testing). Flip to false only
// when the app is live on the App Store and the AdMob account is fully approved.
const USE_TEST_ADS = true

// The banner is drawn by the OS on top of the webview, so the web UI reserves
// a fixed strip at the bottom for it. Generous enough for an adaptive banner
// on a large phone (~90-100pt); a shorter banner just leaves brand-navy space
// below the tab bar, which reads as a deliberate ad shelf.
const RESERVE_PX = 112

export default function NativeAds() {
  useEffect(() => {
    let cancelled = false

    // Inject a real stylesheet rule (literal px + !important) rather than
    // relying on a CSS custom property inheriting through the WKWebView.
    function reserve(px) {
      const h = Math.max(0, Math.round(px))
      let el = document.getElementById('__native_ad_reserve')
      if (!el) {
        el = document.createElement('style')
        el.id = '__native_ad_reserve'
        document.head.appendChild(el)
      }
      el.textContent = `
        body { padding-bottom: ${h}px !important; }
        .bottom-nav { bottom: ${h}px !important; }
        .menu-sheet { bottom: ${h}px !important; }
        .native-ad-tray {
          position: fixed; left: 0; right: 0; bottom: 0; height: ${h}px;
          background: #13213A; z-index: 140;
        }
      `
      let tray = document.getElementById('__native_ad_tray')
      if (!tray) {
        tray = document.createElement('div')
        tray.id = '__native_ad_tray'
        tray.className = 'native-ad-tray'
        document.body.appendChild(tray)
      }
    }

    async function start() {
      const { Capacitor } = await import('@capacitor/core')
      if (!Capacitor.isNativePlatform()) return

      const { AdMob } = await import('@capacitor-community/admob')
      reserve(RESERVE_PX)

      try {
        // iOS 14.5+ requires this consent prompt before ads can use IDFA
        // for personalization. Declining still shows ads — just non-personalized.
        await AdMob.requestTrackingAuthorization().catch(() => {})

        await AdMob.initialize({ initializeForTesting: USE_TEST_ADS })
        if (cancelled) return

        await AdMob.addListener('bannerAdFailedToLoad', () => {
          const el = document.getElementById('__native_ad_reserve')
          const tray = document.getElementById('__native_ad_tray')
          if (el) el.textContent = 'body { padding-bottom: 0 !important; }'
          if (tray) tray.remove()
        })

        await AdMob.showBanner({
          adId: BANNER_AD_UNIT_ID_IOS,
          adSize: 'ADAPTIVE_BANNER',
          position: 'BOTTOM_CENTER',
          margin: 0,
          isTesting: USE_TEST_ADS,
        })
      } catch {
        // Ad SDK failing to load should never break the app itself.
      }
    }

    start()
    return () => { cancelled = true }
  }, [])

  return null
}
