import { useState, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import AdUnit from './components/AdUnit'
import NativeAds from './components/NativeAds'
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
import TestimonialsTab from './tabs/TestimonialsTab'
import FeedbackTab from './tabs/FeedbackTab'
import AdminTab from './tabs/AdminTab'
import { Icon } from './components/icons'
import { useAuth } from './context/AuthContext'
import { trackEvent } from './lib/analytics'

const ADMIN_EMAIL = 'reyrey1119@gmail.com'

// ── Navigation structure ──────────────────────────────────────────────────────
// The two tools people come here for get top billing everywhere; everything
// else lives one tap away under "Tools" / "More".

const PRIMARY = [
  { id: 'home',       icon: 'home',     label: 'Home',              short: 'Home' },
  { id: 'translator', icon: 'bolt',     label: 'Skills translator', short: 'Translate' },
  { id: 'resume',     icon: 'document', label: 'Resume builder',    short: 'Resume' },
]

const GROUPS = [
  {
    id: 'tools', icon: 'clipboard', label: 'Tools', navLabel: 'Tools',
    tabs: [
      { id: 'path',         icon: 'compass',     label: 'Find your path' },
      { id: 'identity',     icon: 'chat',        label: 'Identity guide' },
      { id: 'vault',        icon: 'lock',        label: 'Document Vault' },
      { id: 'network',      icon: 'handshake',   label: 'Networking' },
      { id: 'resources',    icon: 'book',        label: 'Resources' },
      { id: 'trends',       icon: 'trend',       label: 'Career trends' },
      { id: 'applications', icon: 'clipboard',   label: 'Application tracker' },
      { id: 'tracker',      icon: 'checkCircle', label: 'Progress tracker' },
    ],
  },
  {
    id: 'more', icon: 'menu', label: 'More', navLabel: 'More',
    tabs: [
      { id: 'about',        icon: 'info',      label: 'About' },
      { id: 'testimonials', icon: 'star',      label: 'Testimonials' },
      { id: 'feedback',     icon: 'lightbulb', label: 'Feedback' },
    ],
  },
]

const ALL_TABS = [...PRIMARY, ...GROUPS.flatMap(g => g.tabs)]

function groupForTab(tabId) {
  return GROUPS.find(g => g.tabs.some(t => t.id === tabId)) || null
}

const INITIAL_TAB = (() => {
  try {
    const saved = localStorage.getItem('vtg_active_tab')
    return ALL_TABS.some(t => t.id === saved) ? saved : 'home'
  } catch { return 'home' }
})()

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const { user } = useAuth()
  const isAdmin = user?.email === ADMIN_EMAIL
  const [activeTab, setActiveTab] = useState(INITIAL_TAB)
  const [sectionSheet, setSectionSheet] = useState(null) // group id or null
  const [searchResult, setSearchResult] = useState(null)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [resumePrefill, setResumePrefill] = useState(null)

  const activeGroup = groupForTab(activeTab)

  // Persist active tab + analytics, and reset scroll so each tab starts at the top
  useEffect(() => {
    try { localStorage.setItem('vtg_active_tab', activeTab) } catch {}
    trackEvent('page_view', { tab: activeTab })
    try { window.scrollTo({ top: 0, left: 0, behavior: 'auto' }) } catch {}
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

  const sheetGroup = sectionSheet ? GROUPS.find(g => g.id === sectionSheet) : null

  // Reusable sidebar renderer
  function Sidebar({ onTabClick }) {
    return (
      <nav className="sidebar" aria-label="Main navigation">
        <div className="sidebar-primary">
          {PRIMARY.map(tab => (
            <button
              key={tab.id}
              className={`sidebar-btn sidebar-btn-primary${tab.id === activeTab ? ' on' : ''}`}
              onClick={() => onTabClick(tab.id)}
            >
              <span className="sidebar-icon"><Icon name={tab.icon} size={17} /></span>
              <span className="sidebar-label">{tab.label}</span>
            </button>
          ))}
        </div>
        {GROUPS.map(group => (
          <div key={group.id} className="sidebar-section">
            <div className="sidebar-group-label">{group.label}</div>
            <div className="sidebar-subtabs">
              {group.tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`sidebar-btn${tab.id === activeTab ? ' on' : ''}`}
                  onClick={() => onTabClick(tab.id)}
                >
                  <span className="sidebar-icon"><Icon name={tab.icon} size={15} /></span>
                  <span className="sidebar-label">{tab.label}</span>
                </button>
              ))}
              {group.id === 'more' && isAdmin && (
                <button
                  className={`sidebar-btn${activeTab === 'admin' ? ' on' : ''}`}
                  onClick={() => onTabClick('admin')}
                >
                  <span className="sidebar-icon"><Icon name="shield" size={15} /></span>
                  <span className="sidebar-label">Admin</span>
                </button>
              )}
            </div>
          </div>
        ))}
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
            <span style={{ flexShrink: 0, marginTop: searchResult.regulationBacked ? 14 : 2, color: searchResult.regulationBacked ? '#1B3A6B' : '#5C5646' }}>
              <Icon name={searchResult.regulationBacked ? 'clipboard' : 'search'} size={16} />
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
              <p style={{ fontSize: 13, color: '#211F19', lineHeight: 1.7 }}>{searchResult.summary}</p>
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
                background: '#ECE3C7', border: 'none', borderRadius: '50%',
                color: '#5C5646', cursor: 'pointer', fontSize: 16, fontWeight: 700,
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
      <NativeAds />
      <Header onSearch={handleSearch} onNavigateHome={() => navigate('home')} onMenu={() => {}} menuPulse={false} />

      <Sidebar onTabClick={navigate} />

      <SearchBanner />

      <div className="container">
        <AdUnit slot="3957268946" />

        {activeTab === 'home'         && <HomeTab onNavigate={navigate} />}
        {activeTab === 'about'        && <AboutTab />}
        {activeTab === 'path'         && <PathTab />}
        {activeTab === 'translator'   && <TranslatorTab onGoToResume={(data) => { setResumePrefill(data); navigate('resume') }} />}
        {activeTab === 'resume'       && <ResumeTab prefill={resumePrefill} />}
        {activeTab === 'identity'     && <IdentityTab />}
        {activeTab === 'network'      && <NetworkTab />}
        {activeTab === 'trends'       && <CareerTrendsTab />}
        {activeTab === 'tracker'      && <TrackerTab />}
        {activeTab === 'applications' && <ApplicationTrackerTab />}
        {activeTab === 'vault'        && <DocumentVaultTab />}
        {activeTab === 'resources'    && <ResourcesTab searchResult={searchResult} />}
        {activeTab === 'testimonials' && <TestimonialsTab />}
        {activeTab === 'feedback'     && <FeedbackTab />}
        {activeTab === 'admin'        && isAdmin && <AdminTab />}
        <OnboardingModal onComplete={() => {}} onNavigate={navigate} />
      </div>

      <Footer className="main-footer" onPrivacy={() => setShowPrivacy(true)} />

      {/* ── Bottom nav — shown at ≤1024px ──────────────────────────── */}
      <div className="bottom-nav" role="navigation" aria-label="Main navigation">
        {PRIMARY.map(tab => (
          <button
            key={tab.id}
            className={`bottom-nav-btn${activeTab === tab.id ? ' on' : ''}`}
            onClick={() => navigate(tab.id)}
            aria-label={tab.label}
          >
            <span className="bottom-nav-icon"><Icon name={tab.icon} size={21} /></span>
            <span className="bottom-nav-label">{tab.short}</span>
          </button>
        ))}
        {GROUPS.map(group => {
          const isActive = group.id === activeGroup?.id
          return (
            <button
              key={group.id}
              className={`bottom-nav-btn${isActive ? ' on' : ''}`}
              onClick={() => setSectionSheet(group.id)}
              aria-label={group.label}
            >
              <span className="bottom-nav-icon"><Icon name={group.icon} size={21} /></span>
              <span className="bottom-nav-label">{group.navLabel}</span>
            </button>
          )
        })}
      </div>

      {/* ── Group sheet (mobile) ──────────────────────────── */}
      {sheetGroup && (
        <div className="menu-sheet-overlay" onClick={() => setSectionSheet(null)}>
          <div className="menu-sheet" onClick={e => e.stopPropagation()}>
            <div className="menu-sheet-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon name={sheetGroup.icon} size={20} />
                <p style={{ fontSize: 16, fontWeight: 700, color: '#211F19' }}>{sheetGroup.label}</p>
              </div>
              <button className="menu-sheet-close" onClick={() => setSectionSheet(null)}>×</button>
            </div>
            {sheetGroup.tabs.map(tab => (
              <button
                key={tab.id}
                className={`menu-sheet-item${tab.id === activeTab ? ' active' : ''}`}
                onClick={() => navigate(tab.id)}
              >
                <span className="menu-sheet-icon"><Icon name={tab.icon} size={17} /></span>
                <span style={{ flex: 1, textAlign: 'left' }}>{tab.label}</span>
                {tab.id === activeTab && (
                  <span style={{ fontSize: 10, color: '#1B3A6B', fontWeight: 700 }}>Current</span>
                )}
              </button>
            ))}
            {sheetGroup.id === 'more' && isAdmin && (
              <button
                className={`menu-sheet-item${activeTab === 'admin' ? ' active' : ''}`}
                onClick={() => navigate('admin')}
              >
                <span className="menu-sheet-icon"><Icon name="shield" size={17} /></span>
                <span style={{ flex: 1, textAlign: 'left' }}>Admin</span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
