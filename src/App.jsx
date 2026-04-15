import { useState } from 'react'
import Header from './components/Header'
import HomeTab from './tabs/HomeTab'
import TranslatorTab from './tabs/TranslatorTab'
import IdentityTab from './tabs/IdentityTab'
import NetworkTab from './tabs/NetworkTab'
import TrackerTab from './tabs/TrackerTab'
import ResourcesTab from './tabs/ResourcesTab'

const TABS = [
  { id: 'home',       label: 'Home' },
  { id: 'translator', label: 'Skills translator' },
  { id: 'identity',   label: 'Identity guide' },
  { id: 'network',    label: 'Networking' },
  { id: 'tracker',    label: 'Progress tracker' },
  { id: 'resources',  label: 'Resources' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <>
      <Header />
      <div className="container">
        <nav>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`tbtn${activeTab === tab.id ? ' on' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === 'home'       && <HomeTab onNavigate={setActiveTab} />}
        {activeTab === 'translator' && <TranslatorTab />}
        {activeTab === 'identity'   && <IdentityTab />}
        {activeTab === 'network'    && <NetworkTab />}
        {activeTab === 'tracker'    && <TrackerTab />}
        {activeTab === 'resources'  && <ResourcesTab />}
      </div>
    </>
  )
}
