import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import AdUnit from './components/AdUnit'
import HomeTab from './tabs/HomeTab'
import TranslatorTab from './tabs/TranslatorTab'
import ResumeTab from './tabs/ResumeTab'
import IdentityTab from './tabs/IdentityTab'
import NetworkTab from './tabs/NetworkTab'
import TrackerTab from './tabs/TrackerTab'
import ResourcesTab from './tabs/ResourcesTab'
import AboutTab from './tabs/AboutTab'
import PathTab from './tabs/PathTab'
import CareerTrendsTab from './tabs/CareerTrendsTab'
import PrivacyTab from './tabs/PrivacyTab'
import VetNewsTab from './tabs/VetNewsTab'
import TestimonialsTab from './tabs/TestimonialsTab'
import FeedbackTab from './tabs/FeedbackTab'

const TABS = [
  { id: 'home',         icon: '🏠', label: 'Home' },
  { id: 'about',        icon: 'ℹ️',  label: 'About' },
  { id: 'path',         icon: '🧭', label: 'Find your path' },
  { id: 'translator',   icon: '⚡', label: 'Skills translator' },
  { id: 'resume',       icon: '📄', label: 'Resume builder' },
  { id: 'identity',     icon: '💬', label: 'Identity guide' },
  { id: 'network',      icon: '🤝', label: 'Networking' },
  { id: 'trends',       icon: '📈', label: 'Career trends' },
  { id: 'vetnews',      icon: '📰', label: 'Vet news' },
  { id: 'tracker',      icon: '✅', label: 'Progress tracker' },
  { id: 'resources',    icon: '📚', label: 'Resources' },
  { id: 'testimonials', icon: '⭐', label: 'Testimonials' },
  { id: 'feedback',     icon: '💡', label: 'Feedback' },
]

const BOTTOM_NAV = [
  { id: 'home',       icon: '🏠', label: 'Home' },
  { id: 'path',       icon: '🧭', label: 'Find path' },
  { id: 'translator', icon: '⚡', label: 'Translate' },
  { id: 'network',    icon: '🤝', label: 'Network' },
  { id: 'resources',  icon: '📚', label: 'Resources' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [searchResult, setSearchResult] = useState(null)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  function handleSearch(result) {
    setActiveTab(result.tab)
    setSearchResult(result)
    setShowPrivacy(false)
  }

  function clearSearch() {
    setSearchResult(null)
  }

  if (showPrivacy) {
    return (
      <>
        <Header onSearch={handleSearch} onNavigateHome={() => { setShowPrivacy(false); setActiveTab('home') }} onMenu={() => setShowMenu(true)} />
        <nav className="sidebar" aria-label="Main navigation">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`sidebar-btn${activeTab === tab.id ? ' on' : ''}`}
              onClick={() => { setShowPrivacy(false); setActiveTab(tab.id); clearSearch() }}
            >
              <span className="sidebar-icon">{tab.icon}</span>
              <span className="sidebar-label">{tab.label}</span>
            </button>
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
      <Header onSearch={handleSearch} onNavigateHome={() => { setActiveTab('home'); clearSearch() }} onMenu={() => setShowMenu(true)} />
      {/* Desktop sidebar — fixed left, >1024px only, shown via CSS */}
      <nav className="sidebar" aria-label="Main navigation">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`sidebar-btn${activeTab === tab.id ? ' on' : ''}`}
            onClick={() => { setActiveTab(tab.id); clearSearch() }}
          >
            <span className="sidebar-icon">{tab.icon}</span>
            <span className="sidebar-label">{tab.label}</span>
          </button>
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
      <div className="container">
        <AdUnit slot="3957268946" />

        {searchResult && (
          <div style={{
            background: '#fff', border: '1px solid #B8C9E8', borderRadius: 10,
            padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 16, flexShrink: 0, marginTop: 2 }}>🔍</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, color: '#1a1a18', lineHeight: 1.7 }}>{searchResult.summary}</p>
              {searchResult.sectionHint && (
                <p style={{ fontSize: 12, color: '#1B3A6B', marginTop: 4 }}>
                  Look for: <strong>{searchResult.sectionHint}</strong>
                </p>
              )}
            </div>
            <button
              onClick={clearSearch}
              style={{ background: 'none', border: 'none', color: '#1B3A6B', cursor: 'pointer', fontSize: 18, lineHeight: 1, flexShrink: 0 }}
            >
              ×
            </button>
          </div>
        )}

        {activeTab === 'home'       && <HomeTab onNavigate={setActiveTab} />}
        {activeTab === 'about'      && <AboutTab />}
        {activeTab === 'path'       && <PathTab />}
        {activeTab === 'translator' && <TranslatorTab />}
        {activeTab === 'resume'     && <ResumeTab />}
        {activeTab === 'identity'   && <IdentityTab />}
        {activeTab === 'network'    && <NetworkTab />}
        {activeTab === 'trends'     && <CareerTrendsTab />}
        {activeTab === 'vetnews'    && <VetNewsTab />}
        {activeTab === 'tracker'    && <TrackerTab />}
        {activeTab === 'resources'     && <ResourcesTab searchResult={searchResult} />}
        {activeTab === 'testimonials'  && <TestimonialsTab />}
        {activeTab === 'feedback'      && <FeedbackTab />}
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
              <p style={{ fontSize: 15, fontWeight: 600, color: '#1a1a18' }}>All features</p>
              <button className="menu-sheet-close" onClick={() => setShowMenu(false)}>×</button>
            </div>
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`menu-sheet-item${activeTab === tab.id ? ' active' : ''}`}
                onClick={() => { setActiveTab(tab.id); clearSearch(); setShowMenu(false) }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
