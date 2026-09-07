import { useEffect } from 'react'

// Native AdMob banner — only does anything inside the iOS/Android app shell.
// On the website, Capacitor.isNativePlatform() is false and this renders
// nothing; AdUnit.jsx (AdSense) keeps handling ads there.
//
// Real AdMob IDs for the "TYFMS" iOS app (publisher pub-1329301779873532).
// The matching app ID lives in ios/App/App/Info.plist (GADApplicationIdentifier).
const BANNER_AD_UNIT_ID_IOS = 'ca-app-pub-1329301779873532/7559441680'

// While true, every ad request is a TEST request (test creatives, no revenue,
// no risk of invalid-traffic flags from our own testing). Flip to false only
// when the app is live on the App Store and the AdMob account is fully
// approved with payment info in place.
const USE_TEST_ADS = true

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

        await AdMob.initialize({ initializeForTesting: USE_TEST_ADS })
        if (cancelled) return

        await AdMob.addListener('bannerAdSizeChanged', info => setReservedHeight(info?.height ? info.height : 50))
        await AdMob.addListener('bannerAdFailedToLoad', () => setReservedHeight(0))

        await AdMob.showBanner({
          adId: BANNER_AD_UNIT_ID_IOS,
          adSize: 'BANNER',
          position: 'BOTTOM_CENTER',
          margin: 0,
          isTesting: USE_TEST_ADS,
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
