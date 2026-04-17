import FunFact from '../components/FunFact'

const RESOURCES = [
  {
    category: 'VA benefits',
    items: [
      { title: 'VA.gov', badge: 'Benefits', cls: 'bb', desc: 'Primary gateway for all VA benefits, health care, and services', url: 'https://www.va.gov', urlText: 'va.gov' },
      { title: 'Veteran Readiness and Employment', badge: 'VR&E', cls: 'bb', desc: 'Career and education services for veterans with service-connected disabilities', url: 'https://www.va.gov/careers-employment/vocational-rehabilitation/', urlText: 'va.gov/careers-employment' },
      { title: 'eBenefits', badge: 'Portal', cls: 'bb', desc: 'Manage VA benefits and service records online', url: 'https://www.ebenefits.va.gov', urlText: 'ebenefits.va.gov' },
    ],
  },
  {
    category: 'Education',
    items: [
      { title: 'GI Bill Comparison Tool', badge: 'Education', cls: 'bg', desc: 'Compare GI Bill benefits at schools nationwide', url: 'https://www.va.gov/gi-bill-comparison-tool/', urlText: 'va.gov/gi-bill-comparison-tool' },
      { title: 'GoArmyEd', badge: 'Army TA', cls: 'bg', desc: 'Tuition assistance portal for active Army soldiers', url: 'https://www.goarmyed.com', urlText: 'goarmyed.com' },
      { title: 'Student Veterans of America', badge: 'Network', cls: 'bg', desc: 'Peer network and advocacy for student veterans on campus', url: 'https://studentveterans.org', urlText: 'studentveterans.org' },
    ],
  },
  {
    category: 'Career tools',
    items: [
      { title: 'O*NET OnLine', badge: 'Career', cls: 'ba', desc: 'Explore civilian occupations matched to your military experience', url: 'https://www.onetonline.org', urlText: 'onetonline.org' },
      { title: 'Hiring Our Heroes', badge: 'Jobs', cls: 'ba', desc: 'Connects veterans and military spouses with civilian employers', url: 'https://www.hiringourheroes.org', urlText: 'hiringourheroes.org' },
      { title: 'LinkedIn for Veterans', badge: 'Network', cls: 'ba', desc: 'Free Premium membership for veterans and military spouses', url: 'https://socialimpact.linkedin.com/programs/veterans', urlText: 'linkedin.com/veterans' },
    ],
  },
  {
    category: 'Mental health and wellbeing',
    items: [
      { title: 'Veterans Crisis Line', badge: '988 press 1', cls: 'bd', desc: 'Call 988 then press 1, or text 838255. Available 24/7 for veterans in crisis', url: 'https://www.veteranscrisisline.net', urlText: 'veteranscrisisline.net' },
      { title: 'Make the Connection', badge: 'Support', cls: 'bd', desc: 'Stories and resources for veterans and families facing mental health challenges', url: 'https://maketheconnection.net', urlText: 'maketheconnection.net' },
      { title: 'Give an Hour', badge: 'Counseling', cls: 'bd', desc: 'Free mental health care for post-9/11 veterans and military families', url: 'https://giveanhour.org', urlText: 'giveanhour.org' },
    ],
  },
]

export default function ResourcesTab() {
  return (
    <div>
      <img src="/resources.png" alt="Resources" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 12, marginBottom: 20, display: 'block' }} />
      <p className="sec-title">Resources</p>
      <p className="sec-sub">Verified resources organized by what you need most right now.</p>

      {RESOURCES.map(({ category, items }) => (
        <div key={category}>
          <p className="cat-label">{category}</p>
          <div className="grid-3" style={{ marginBottom: 20 }}>
            {items.map(r => (
              <div key={r.title} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{r.title}</p>
                  <span className={r.cls}>{r.badge}</span>
                </div>
                <p style={{ fontSize: 12, color: '#5f5e5a', marginBottom: 8 }}>{r.desc}</p>
                <a href={r.url} target="_blank" rel="noreferrer" style={{ fontSize: 12 }}>{r.urlText}</a>
              </div>
            ))}
          </div>
        </div>
      ))}

      <FunFact />
    </div>
  )
}
