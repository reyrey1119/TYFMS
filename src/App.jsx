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
import FeedbackTab from './tabs/FeedbackTab'

const TABS = [
  { id: 'home',       label: 'Home' },
  { id: 'about',      label: 'About' },
  { id: 'path',       label: 'Find your path' },
  { id: 'translator', label: 'Skills translator' },
  { id: 'resume',     label: 'Resume builder' },
  { id: 'identity',   label: 'Identity guide' },
  { id: 'network',    label: 'Networking' },
  { id: 'trends',     label: 'Career trends' },
  { id: 'tracker',    label: 'Progress tracker' },
  { id: 'resources',  label: 'Resources' },
  { id: 'feedback',   label: 'Feedback' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [searchResult, setSearchResult] = useState(null)
  const [showPrivacy, setShowPrivacy] = useState(false)

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
        <Header onSearch={handleSearch} onNavigateHome={() => { setShowPrivacy(false); setActiveTab('home') }} />
        <div className="container">
          <PrivacyTab onClose={() => setShowPrivacy(false)} />
        </div>
        <Footer onPrivacy={() => setShowPrivacy(true)} />
      </>
    )
  }

  return (
    <>
      <Header onSearch={handleSearch} onNavigateHome={() => { setActiveTab('home'); clearSearch() }} />
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
        {activeTab === 'tracker'    && <TrackerTab />}
        {activeTab === 'resources'  && <ResourcesTab />}
        {activeTab === 'feedback'   && <FeedbackTab />}
      </div>
      <Footer onPrivacy={() => setShowPrivacy(true)} />
    </>
  )
}
