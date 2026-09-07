import { useEffect } from 'react'

// Native AdMob banner — only does anything inside the iOS/Android app shell.
// On the website, Capacitor.isNativePlatform() is false and this renders
// nothing; AdUnit.jsx (AdSense) keeps handling ads there.
//
// Uses Google's public TEST ad unit IDs until real AdMob IDs are issued —
// swap ADMOB_APP_ID / BANNER_AD_UNIT_ID below once the AdMob account exists,
// and update the AdMob application identifier in ios/App/App/Info.plist
// (GADApplicationIdentifier) to match.
const ADMOB_TEST_BANNER_ID_IOS = 'ca-app-pub-3940256099942544/2934735716'

export default function NativeAds() {
  useEffect(() => {
    let cancelled = false

    async function start() {
      const { Capacitor } = await import('@capacitor/core')
      if (!Capacitor.isNativePlatform()) return

      const { AdMob } = await import('@capacitor-community/admob')

      try {
        // iOS 14.5+ requires this consent prompt before ads can use IDFA
        // for personalization. Declining still shows ads — just non-personalized.
        await AdMob.requestTrackingAuthorization().catch(() => {})

        await AdMob.initialize({ initializeForTesting: true })
        if (cancelled) return

        // Reserve space above the bottom tab bar so the native banner
        // (drawn by the OS, not the webview) doesn't cover it.
        const setReservedHeight = px => document.documentElement.style.setProperty('--native-ad-height', `${px}px`)
        await AdMob.addListener('bannerAdSizeChanged', info => setReservedHeight(info.height || 0))
        await AdMob.addListener('bannerAdFailedToLoad', () => setReservedHeight(0))

        await AdMob.showBanner({
          adId: ADMOB_TEST_BANNER_ID_IOS,
          adSize: 'ADAPTIVE_BANNER',
          position: 'BOTTOM_CENTER',
          margin: 0,
          isTesting: true,
        })
      } catch {
        // Ad SDK failing to load should never break the app itself.
      }
    }

    start()
    return () => {
      cancelled = true
      document.documentElement.style.removeProperty('--native-ad-height')
    }
  }, [])

  return null
}
