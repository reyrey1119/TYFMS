// Full-screen ad shown at a natural break (e.g. right before a resume
// download). No-op on the website; inside the iOS/Android shell it plays an
// AdMob interstitial and then runs the callback. The action is never actually
// blocked — if the ad can't load, or anything goes wrong, the callback still
// runs promptly.

// TODO: replace with the real "TYFMS resume download" interstitial ad unit ID
// once it's created in AdMob (Apps → TYFMS → Ad units → Add ad unit → Interstitial).
const INTERSTITIAL_AD_UNIT_ID_IOS = 'ca-app-pub-3940256099942544/4411468910' // Google test ID
const USE_TEST_ADS = true

let lastBreak = 0
const MIN_GAP_MS = 90_000 // don't show two interstitials back to back

export async function withAdBreak(proceed) {
  let settled = false
  const finish = () => { if (!settled) { settled = true; Promise.resolve().then(proceed).catch(() => {}) } }

  try {
    const { Capacitor } = await import('@capacitor/core')
    if (!Capacitor.isNativePlatform()) return finish()

    // Respect a cooldown so downloading two files doesn't mean two ads.
    if (Date.now() - lastBreak < MIN_GAP_MS) return finish()

    const { AdMob } = await import('@capacitor-community/admob')
    const timer = setTimeout(finish, 9000) // safety net
    const handles = []
    const cleanup = async () => {
      clearTimeout(timer)
      for (const h of handles) { try { await h.remove() } catch {} }
    }

    handles.push(await AdMob.addListener('interstitialAdDismissed', async () => { lastBreak = Date.now(); await cleanup(); finish() }))
    handles.push(await AdMob.addListener('interstitialAdFailedToShow', async () => { await cleanup(); finish() }))
    handles.push(await AdMob.addListener('interstitialAdFailedToLoad', async () => { await cleanup(); finish() }))
    handles.push(await AdMob.addListener('interstitialAdLoaded', async () => {
      try { await AdMob.showInterstitial() } catch { await cleanup(); finish() }
    }))

    await AdMob.prepareInterstitial({ adId: INTERSTITIAL_AD_UNIT_ID_IOS, isTesting: USE_TEST_ADS })
  } catch {
    finish()
  }
}
