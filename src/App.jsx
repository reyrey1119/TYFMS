import { useState } from 'react'
import Header from './components/Header'
import HomeTab from './tabs/HomeTab'
import TranslatorTab from './tabs/TranslatorTab'
import IdentityTab from './tabs/IdentityTab'
import NetworkTab from './tabs/NetworkTab'
import TrackerTab from './tabs/TrackerTab'
import ResourcesTab from './tabs/ResourcesTab'
import AboutTab from './tabs/AboutTab'

const TABS = [
  { id: 'home',       label: 'Home' },
  { id: 'translator', label: 'Skills translator' },
  { id: 'identity',   label: 'Identity guide' },
  { id: 'network',    label: 'Networking' },
  { id: 'tracker',    label: 'Progress tracker' },
  { id: 'resources',  label: 'Resources' },
  { id: 'about',      label: 'About' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [searchResult, setSearchResult] = useState(null)

  function handleSearch(result) {
    setActiveTab(result.tab)
    setSearchResult(result)
  }

  function clearSearch() {
    setSearchResult(null)
  }

  return (
    <>
      <Header onSearch={handleSearch} />
      <div className="container">
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

        {searchResult && (
          <div style={{
            background: '#e1f5ee', border: '1px solid #0f6e56', borderRadius: 10,
            padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 16, flexShrink: 0, marginTop: 2 }}>🔍</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, color: '#085041', lineHeight: 1.7 }}>{searchResult.summary}</p>
              {searchResult.sectionHint && (
                <p style={{ fontSize: 12, color: '#0f6e56', marginTop: 4 }}>
                  Look for: <strong>{searchResult.sectionHint}</strong>
                </p>
              )}
            </div>
            <button
              onClick={clearSearch}
              style={{ background: 'none', border: 'none', color: '#0f6e56', cursor: 'pointer', fontSize: 18, lineHeight: 1, flexShrink: 0 }}
            >
              ×
            </button>
          </div>
        )}

        {activeTab === 'home'       && <HomeTab onNavigate={setActiveTab} />}
        {activeTab === 'translator' && <TranslatorTab />}
        {activeTab === 'identity'   && <IdentityTab />}
        {activeTab === 'network'    && <NetworkTab />}
        {activeTab === 'tracker'    && <TrackerTab />}
        {activeTab === 'resources'  && <ResourcesTab />}
        {activeTab === 'about'      && <AboutTab />}
      </div>
    </>
  )
}
