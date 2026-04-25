import { useState, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import AdUnit from './components/AdUnit'
import OnboardingModal from './components/OnboardingModal'
import HomeTab from './tabs/HomeTab'
import TranslatorTab from './tabs/TranslatorTab'
import ResumeTab from './tabs/ResumeTab'
import IdentityTab from './tabs/IdentityTab'
import NetworkTab from './tabs/NetworkTab'
import TrackerTab from './tabs/TrackerTab'
import ApplicationTrackerTab from './tabs/ApplicationTrackerTab'
import DocumentVaultTab from './tabs/DocumentVaultTab'
import ResourcesTab from './tabs/ResourcesTab'
import AboutTab from './tabs/AboutTab'
import PathTab from './tabs/PathTab'
import CareerTrendsTab from './tabs/CareerTrendsTab'
import PrivacyTab from './tabs/PrivacyTab'
import VetNewsTab from './tabs/VetNewsTab'
import TestimonialsTab from './tabs/TestimonialsTab'
import FeedbackTab from './tabs/FeedbackTab'

function trackEvent(name, params = {}) {
  try { window.gtag?.('event', name, params) } catch {}
}

const NAV_GROUPS = [
  {
    label: 'Where you are',
    tabs: [
      { id: 'home',         icon: '🏠', label: 'Home' },
      { id: 'path',         icon: '🧭', label: 'Find your path' },
    ],
  },
  {
    label: 'Who you are',
    tabs: [
      { id: 'translator',   icon: '⚡', label: 'Skills translator' },
      { id: 'identity',     icon: '💬', label: 'Identity guide' },
      { id: 'vault',        icon: '🔒', label: 'Document Vault' },
    ],
  },
  {
    label: 'Your network',
    tabs: [
      { id: 'network',      icon: '🤝', label: 'Networking' },
      { id: 'vetnews',      icon: '📰', label: 'Vet news' },
      { id: 'testimonials', icon: '⭐', label: 'Testimonials' },
    ],
  },
  {
    label: 'Your plan',
    tabs: [
      { id: 'resume',       icon: '📄', label: 'Resume builder' },
      { id: 'trends',       icon: '📈', label: 'Career trends' },
      { id: 'tracker',      icon: '✅', label: 'Progress tracker' },
      { id: 'applications', icon: '📋', label: 'Application tracker' },
      { id: 'resources',    icon: '📚', label: 'Resources' },
      { id: 'about',        icon: 'ℹ️',  label: 'About' },
      { id: 'feedback',     icon: '💡', label: 'Feedback' },
    ],
  },
]

const TABS = NAV_GROUPS.flatMap(g => g.tabs)

const BOTTOM_NAV = [
  { id: 'home',       icon: '🏠', label: 'Home' },
  { id: 'translator', icon: '⚡', label: 'Translate' },
  { id: 'resume',     icon: '📄', label: 'Resume' },
  { id: 'network',    icon: '🤝', label: 'Network' },
  { id: 'resources',  icon: '📚', label: 'Resources' },
]
const BOTTOM_NAV_IDS = new Set(BOTTOM_NAV.map(t => t.id))

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [searchResult, setSearchResult] = useState(null)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [resumePrefill, setResumePrefill] = useState(null)
  const [showMenu, setShowMenu] = useState(false)
  const [menuSeen, setMenuSeen] = useState(() => !!localStorage.getItem('vtg_menu_seen'))

  useEffect(() => {
    trackEvent('page_view', { tab: activeTab })
  }, [activeTab])

  function navigate(tab) {
    setActiveTab(tab)
    clearSearch()
  }

  function handleSearch(result) {
    setActiveTab(result.tab)
    setSearchResult(result)
    setShowPrivacy(false)
  }

  function clearSearch() {
    setSearchResult(null)
  }

  function openMenu() {
    setShowMenu(true)
    if (!menuSeen) {
      setMenuSeen(true)
      localStorage.setItem('vtg_menu_seen', '1')
    }
  }

  if (showPrivacy) {
    return (
      <>
        <Header onSearch={handleSearch} onNavigateHome={() => { setShowPrivacy(false); setActiveTab('home') }} onMenu={openMenu} menuPulse={!menuSeen} />
        <nav className="sidebar" aria-label="Main navigation">
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              <p style={{
                fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em',
                color: '#b4b2a9', padding: '12px 14px 4px', margin: 0,
              }}>
                {group.label}
              </p>
              {group.tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`sidebar-btn${activeTab === tab.id ? ' on' : ''}`}
                  onClick={() => { setShowPrivacy(false); setActiveTab(tab.id); clearSearch() }}
                >
                  <span className="sidebar-icon">{tab.icon}</span>
                  <span className="sidebar-label">{tab.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="container">
          <PrivacyTab onClose={() => setShowPrivacy(false)} />
        </div>
        <Footer className="main-footer" onPrivacy={() => setShowPrivacy(true)} />
      </>
    )
  }

  return (
    <>
      <Header onSearch={handleSearch} onNavigateHome={() => { setActiveTab('home'); clearSearch() }} onMenu={openMenu} menuPulse={!menuSeen} />
      {/* Desktop sidebar — fixed left, >1024px only, shown via CSS */}
      <nav className="sidebar" aria-label="Main navigation">
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            <p style={{
              fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em',
              color: '#b4b2a9', padding: '12px 14px 4px', margin: 0,
            }}>
              {group.label}
            </p>
            {group.tabs.map(tab => (
              <button
                key={tab.id}
                className={`sidebar-btn${activeTab === tab.id ? ' on' : ''}`}
                onClick={() => { setActiveTab(tab.id); clearSearch() }}
              >
                <span className="sidebar-icon">{tab.icon}</span>
                <span className="sidebar-label">{tab.label}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div className="nav-sticky-wrapper">
        <div className="nav-inner">
          <nav>
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`tbtn${activeTab === tab.id ? ' on' : ''}`}
                onClick={() => { setActiveTab(tab.id); clearSearch() }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
      {searchResult && (
        <div className="search-result-sticky">
          <div className="search-result-inner">
            <div style={{
              background: '#fff',
              border: `1px solid ${searchResult.regulationBacked ? '#1B3A6B' : '#B8C9E8'}`,
              borderRadius: 10, padding: '12px 16px',
              display: 'flex', gap: 12, alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 16, flexShrink: 0, marginTop: searchResult.regulationBacked ? 14 : 2 }}>
                {searchResult.regulationBacked ? '📋' : '🔍'}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                {searchResult.regulationBacked && (
                  <span style={{
                    display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: '.06em',
                    textTransform: 'uppercase', background: '#1B3A6B', color: '#fff',
                    padding: '2px 8px', borderRadius: 6, marginBottom: 7,
                  }}>
                    Regulation-backed · 38 CFR
                  </span>
                )}
                <p style={{ fontSize: 13, color: '#1a1a18', lineHeight: 1.7 }}>{searchResult.summary}</p>
                {searchResult.sectionHint && (
                  <p style={{ fontSize: 12, color: '#1B3A6B', marginTop: 4 }}>
                    Look for: <strong>{searchResult.sectionHint}</strong>
                  </p>
                )}
                {searchResult.resourceMatch && (
                  <button
                    onClick={() => document.getElementById('first-resource-match')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                    style={{
                      background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                      fontSize: 13, color: '#C07A28', fontWeight: 600, marginTop: 8,
                      display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'inherit',
                      textDecoration: 'underline', textUnderlineOffset: 3,
                    }}
                  >
                    See highlighted resources below ↓
                  </button>
                )}
              </div>
              <button
                onClick={clearSearch}
                aria-label="Dismiss"
                style={{
                  background: '#F0EDE6', border: 'none', borderRadius: '50%',
                  color: '#5f5e5a', cursor: 'pointer', fontSize: 16, fontWeight: 700,
                  lineHeight: 1, flexShrink: 0, width: 28, height: 28,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        <AdUnit slot="3957268946" />

        {activeTab === 'home'         && <HomeTab onNavigate={navigate} />}
        {activeTab === 'about'        && <AboutTab />}
        {activeTab === 'path'         && <PathTab />}
        {activeTab === 'translator'   && <TranslatorTab onGoToResume={(data) => { setResumePrefill(data); navigate('resume') }} />}
        {activeTab === 'resume'       && <ResumeTab prefill={resumePrefill} onTrackEvent={trackEvent} />}
        {activeTab === 'identity'     && <IdentityTab />}
        {activeTab === 'network'      && <NetworkTab />}
        {activeTab === 'trends'       && <CareerTrendsTab />}
        {activeTab === 'vetnews'      && <VetNewsTab />}
        {activeTab === 'tracker'      && <TrackerTab />}
        {activeTab === 'applications' && <ApplicationTrackerTab />}
        {activeTab === 'vault'        && <DocumentVaultTab />}
        {activeTab === 'resources'    && <ResourcesTab searchResult={searchResult} />}
        {activeTab === 'testimonials' && <TestimonialsTab />}
        {activeTab === 'feedback'     && <FeedbackTab />}
        <OnboardingModal onComplete={() => {}} onNavigate={navigate} />
      </div>
      <Footer className="main-footer" onPrivacy={() => setShowPrivacy(true)} />

      {/* Bottom nav — mobile only, shown via CSS */}
      <div className="bottom-nav" role="navigation" aria-label="Main navigation">
        {BOTTOM_NAV.map(t => (
          <button
            key={t.id}
            className={`bottom-nav-btn${activeTab === t.id ? ' on' : ''}`}
            onClick={() => { setActiveTab(t.id); clearSearch() }}
          >
            <span className="bottom-nav-icon">{t.icon}</span>
            <span className="bottom-nav-label">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Slide-up tab sheet — triggered by hamburger, mobile only */}
      {showMenu && (
        <div className="menu-sheet-overlay" onClick={() => setShowMenu(false)}>
          <div className="menu-sheet" onClick={e => e.stopPropagation()}>
            <div className="menu-sheet-header">
              <div>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#1a1a18' }}>All tabs</p>
                <p style={{ fontSize: 11, color: '#b4b2a9', marginTop: 2 }}>
                  <span style={{ color: '#C07A28' }}>NEW</span> = not in bottom bar
                </p>
              </div>
              <button className="menu-sheet-close" onClick={() => setShowMenu(false)}>×</button>
            </div>
            {TABS.map(tab => {
              const isExtra = !BOTTOM_NAV_IDS.has(tab.id)
              return (
                <button
                  key={tab.id}
                  className={`menu-sheet-item${activeTab === tab.id ? ' active' : ''}`}
                  onClick={() => { setActiveTab(tab.id); clearSearch(); setShowMenu(false) }}
                >
                  <span className="menu-sheet-icon">{tab.icon}</span>
                  <span style={{ flex: 1, textAlign: 'left' }}>{tab.label}</span>
                  {isExtra && <span className="menu-extra-badge">NEW</span>}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
