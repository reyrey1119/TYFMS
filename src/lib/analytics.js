// Thin wrapper around the Google Analytics 4 tag (loaded in index.html).
// Safe to call anywhere: no-ops if gtag isn't on the page (ad blockers, the
// native shell before the site loads, tests).
//
// The events we care about for reporting real usage to sponsors / grant
// reviewers:
//   translate_completed  — someone got skills-translator results back
//   resume_generated     — the AI built a resume or CV  (params: source)
//   resume_downloaded    — they saved the file          (params: format)
// Mark these three as "Key events" in the GA4 UI (Admin → Events) so they
// show up on the dashboard.

export function trackEvent(name, params = {}) {
  try { window.gtag?.('event', name, params) } catch {}
}
