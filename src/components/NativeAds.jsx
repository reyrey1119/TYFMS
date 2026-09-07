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

      // The banner is drawn by the OS on top of the webview, so the web UI
      // must leave room for it. A standard BANNER is 50pt tall — reserve that
      // right away, then let bannerAdSizeChanged correct it to the real value.
      const setReservedHeight = px => document.documentElement.style.setProperty('--native-ad-height', `${Math.round(px)}px`)
      setReservedHeight(50)

      try {
        // iOS 14.5+ requires this consent prompt before ads can use IDFA
        // for personalization. Declining still shows ads — just non-personalized.
        await AdMob.requestTrackingAuthorization().catch(() => {})

        await AdMob.initialize({ initializeForTesting: true })
        if (cancelled) return

        await AdMob.addListener('bannerAdSizeChanged', info => setReservedHeight(info?.height ? info.height : 50))
        await AdMob.addListener('bannerAdFailedToLoad', () => setReservedHeight(0))

        await AdMob.showBanner({
          adId: ADMOB_TEST_BANNER_ID_IOS,
          adSize: 'BANNER',
          position: 'BOTTOM_CENTER',
          margin: 0,
          isTesting: true,
        })
      } catch {
        // Ad SDK failing to load should never break the app itself.
        setReservedHeight(0)
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
