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

// ── Navigation structure ──────────────────────────────────────────────────────

const SECTIONS = [
  {
    id: 'where',
    icon: '🏠',
    label: 'Where You Are',
    navLabel: 'Where',
    tabs: [
      { id: 'home',     icon: '🏠', label: 'Home' },
      { id: 'path',     icon: '🧭', label: 'Find your path' },
    ],
  },
  {
    id: 'who',
    icon: '👤',
    label: 'Who You Are',
    navLabel: 'Who You Are',
    tabs: [
      { id: 'identity',   icon: '💬', label: 'Identity guide' },
      { id: 'translator', icon: '⚡', label: 'Skills translator' },
      { id: 'vault',      icon: '🔒', label: 'Document Vault' },
    ],
  },
  {
    id: 'network',
    icon: '🤝',
    label: 'Your Network',
    navLabel: 'Network',
    tabs: [
      { id: 'network',   icon: '🤝', label: 'Networking' },
      { id: 'resources', icon: '📚', label: 'Resources' },
      { id: 'vetnews',   icon: '📰', label: 'Vet news' },
    ],
  },
  {
    id: 'plan',
    icon: '📋',
    label: 'Your Plan',
    navLabel: 'Your Plan',
    tabs: [
      { id: 'resume',       icon: '📄', label: 'Resume builder' },
      { id: 'trends',       icon: '📈', label: 'Career trends' },
      { id: 'applications', icon: '📋', label: 'Application tracker' },
      { id: 'tracker',      icon: '✅', label: 'Progress tracker' },
    ],
  },
  {
    id: 'more',
    icon: '☰',
    label: 'More',
    navLabel: 'More',
    tabs: [
      { id: 'about',       icon: 'ℹ️',  label: 'About' },
      { id: 'testimonials', icon: '⭐', label: 'Testimonials' },
      { id: 'feedback',    icon: '💡', label: 'Feedback' },
    ],
  },
]

const ALL_TABS = SECTIONS.flatMap(s => s.tabs)

function getSectionForTab(tabId) {
  return SECTIONS.find(s => s.tabs.some(t => t.id === tabId)) || SECTIONS[0]
}

const INITIAL_TAB = (() => {
  try {
    const saved = localStorage.getItem('vtg_active_tab')
    return ALL_TABS.some(t => t.id === saved) ? saved : 'home'
  } catch { return 'home' }
})()

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState(INITIAL_TAB)
  // All sections open by default; each toggles independently
  const [openSections, setOpenSections] = useState(() => new Set(SECTIONS.map(s => s.id)))
  const [sectionSheet, setSectionSheet] = useState(null) // section id or null
  const [searchResult, setSearchResult] = useState(null)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [resumePrefill, setResumePrefill] = useState(null)

  const activeSection = getSectionForTab(activeTab)

  // Persist active tab + analytics
  useEffect(() => {
    try { localStorage.setItem('vtg_active_tab', activeTab) } catch {}
    trackEvent('page_view', { tab: activeTab })
  }, [activeTab])

  function navigate(tabId) {
    setActiveTab(tabId)
    setSearchResult(null)
    setSectionSheet(null)
  }

  function handleSearch(result) {
    setActiveTab(result.tab)
    setSearchResult(result)
    setShowPrivacy(false)
    setSectionSheet(null)
  }

  function clearSearch() { setSearchResult(null) }

  // Mobile bottom bar: always open the sheet for that section on any tap
  function handleBottomSectionTap(section) {
    setSectionSheet(section.id)
  }

  // Desktop sidebar: each section toggles independently
  function handleSidebarSectionToggle(sectionId) {
    setOpenSections(prev => {
      const next = new Set(prev)
      if (next.has(sectionId)) next.delete(sectionId)
      else next.add(sectionId)
      return next
    })
  }

  const sheetSection = sectionSheet ? SECTIONS.find(s => s.id === sectionSheet) : null

  // Reusable sidebar renderer
  function Sidebar({ onTabClick }) {
    return (
      <nav className="sidebar" aria-label="Main navigation">
        {SECTIONS.map(section => {
          const isSectionActive = section.id === activeSection.id
          const isOpen = openSections.has(section.id)
          return (
            <div key={section.id} className="sidebar-section">
              <button
                className={`sidebar-section-btn${isSectionActive ? ' active' : ''}${isOpen ? ' open' : ''}`}
                onClick={() => handleSidebarSectionToggle(section.id)}
                aria-expanded={isOpen}
              >
                <span className="sidebar-section-icon">{section.icon}</span>
                <span className="sidebar-section-label">{section.label}</span>
                <span className="sidebar-chevron" aria-hidden="true" />
              </button>
              {isOpen && (
                <div className="sidebar-subtabs">
                  {section.tabs.map(tab => (
                    <button
                      key={tab.id}
                      className={`sidebar-btn${tab.id === activeTab ? ' on' : ''}`}
                      onClick={() => onTabClick(tab.id)}
                    >
                      <span className="sidebar-icon">{tab.icon}</span>
                      <span className="sidebar-label">{tab.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    )
  }

  // Search result banner
  function SearchBanner() {
    if (!searchResult) return null
    return (
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
    )
  }

  if (showPrivacy) {
    return (
      <>
        <Header onSearch={handleSearch} onNavigateHome={() => { setShowPrivacy(false); navigate('home') }} onMenu={() => {}} menuPulse={false} />
        <Sidebar onTabClick={(tabId) => { setShowPrivacy(false); navigate(tabId) }} />
        <div className="container">
          <PrivacyTab onClose={() => setShowPrivacy(false)} />
        </div>
        <Footer className="main-footer" onPrivacy={() => setShowPrivacy(true)} />
      </>
    )
  }

  return (
    <>
      <Header onSearch={handleSearch} onNavigateHome={() => navigate('home')} onMenu={() => {}} menuPulse={false} />

      <Sidebar onTabClick={navigate} />

      <SearchBanner />

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

      {/* ── Bottom nav — shown at ≤1024px ──────────────────────────── */}
      <div className="bottom-nav" role="navigation" aria-label="Main navigation">
        {SECTIONS.map(section => {
          const isActive = section.id === activeSection.id
          return (
            <button
              key={section.id}
              className={`bottom-nav-btn${isActive ? ' on' : ''}`}
              onClick={() => handleBottomSectionTap(section)}
              aria-label={section.label}
            >
              <span className="bottom-nav-icon">{section.icon}</span>
              <span className="bottom-nav-label">{section.navLabel}</span>
            </button>
          )
        })}
      </div>

      {/* ── Section subtab sheet (mobile) ──────────────────────────── */}
      {sheetSection && (
        <div className="menu-sheet-overlay" onClick={() => setSectionSheet(null)}>
          <div className="menu-sheet" onClick={e => e.stopPropagation()}>
            <div className="menu-sheet-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 22 }}>{sheetSection.icon}</span>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#1a1a18' }}>{sheetSection.label}</p>
              </div>
              <button className="menu-sheet-close" onClick={() => setSectionSheet(null)}>×</button>
            </div>
            {sheetSection.tabs.map(tab => (
              <button
                key={tab.id}
                className={`menu-sheet-item${tab.id === activeTab ? ' active' : ''}`}
                onClick={() => navigate(tab.id)}
              >
                <span className="menu-sheet-icon">{tab.icon}</span>
                <span style={{ flex: 1, textAlign: 'left' }}>{tab.label}</span>
                {tab.id === activeTab && (
                  <span style={{ fontSize: 10, color: '#1B3A6B', fontWeight: 700 }}>Current</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
