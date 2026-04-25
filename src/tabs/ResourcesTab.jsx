import { useMemo } from 'react'
import FunFact from '../components/FunFact'
import AdUnit from '../components/AdUnit'

const CONTACTS = [
  { label: 'VA Main Hotline (MyVA411)', number: '800-698-2411', tel: '18006982411', color: '#1B3A6B', crisis: false },
  { label: 'Veterans Crisis Line', number: '988 → press 1', tel: '988', color: '#a32d2d', crisis: true },
  { label: 'Benefits Hotline', number: '800-827-1000', tel: '18008271000', color: '#1B3A6B', crisis: false },
]

const RESOURCES = [
  {
    id: 'va-portals',
    category: 'Core VA portals',
    grid: 'grid-2',
    items: [
      { id: 'vagov', title: 'VA.gov', badge: 'Main portal', cls: 'bb', desc: 'Primary gateway for all VA benefits, claims, healthcare, and services', url: 'https://www.va.gov', urlText: 'va.gov' },
      { id: 'myhealthevet', title: 'My HealtheVet', badge: 'Health', cls: 'bb', desc: 'Manage prescriptions, medical records, and VA appointments online', url: 'https://www.myhealth.va.gov', urlText: 'myhealth.va.gov' },
      { id: 'accessva', title: 'AccessVA', badge: 'Portal', cls: 'bb', desc: 'Gateway to specialized VA tools including QuickSubmit document upload and VetBiz', url: 'https://access.va.gov', urlText: 'access.va.gov' },
      { id: 'ebenefits', title: 'eBenefits', badge: 'Benefits', cls: 'bb', desc: 'GI Bill enrollment, Home Loan certificates, and legacy benefits management', url: 'https://www.ebenefits.va.gov', urlText: 'ebenefits.va.gov' },
    ],
  },
  {
    id: 'directories',
    category: 'Resource directories',
    grid: 'grid-2',
    items: [
      { id: 'nrd', title: 'National Resource Directory', badge: '16,000+ resources', cls: 'bg', desc: 'Vetted government and non-government resources covering homeless assistance, employment, legal aid, and more', url: 'https://nrd.gov', urlText: 'nrd.gov' },
      { id: 'va-navigator', title: 'VA Resource Navigator', badge: 'Curated guide', cls: 'bg', desc: 'Direct links and phone numbers for all major VA service categories in one place', url: 'https://www.va.gov/resources', urlText: 'va.gov/resources' },
    ],
  },
  {
    id: 'education',
    category: 'Education',
    grid: 'grid-3',
    items: [
      { id: 'va-education', title: 'VA Education and Training', badge: 'GI Bill', cls: 'bg', desc: 'Compare GI Bill benefits, verify school enrollment, and manage education awards', url: 'https://www.va.gov/education', urlText: 'va.gov/education' },
      { id: 'gi-bill-tool', title: 'GI Bill Comparison Tool', badge: 'Schools', cls: 'bg', desc: 'Compare GI Bill benefits at schools nationwide before making a decision', url: 'https://www.va.gov/gi-bill-comparison-tool', urlText: 'va.gov/gi-bill-comparison-tool' },
      { id: 'goarmyed', title: 'GoArmyEd', badge: 'Army TA', cls: 'bg', desc: 'Tuition assistance portal for active Army soldiers', url: 'https://www.goarmyed.com', urlText: 'goarmyed.com' },
      { id: 'sva', title: 'Student Veterans of America', badge: 'Network', cls: 'bg', desc: 'Peer network and advocacy for student veterans on campus nationwide', url: 'https://studentveterans.org', urlText: 'studentveterans.org' },
      { id: 'dea', title: 'DEA Chapter 35', badge: 'Dependents', cls: 'bg', desc: 'Up to 45 months of education benefits for spouses and children of permanently disabled or deceased veterans', url: 'https://www.va.gov/education/survivor-dependent-education-assistance', urlText: 'va.gov/education/survivor-dependent' },
    ],
  },
  {
    id: 'home-loans',
    category: 'Home loans',
    grid: 'grid-2',
    items: [
      { id: 'va-home-loan', title: 'VA Home Loans', badge: 'Housing', cls: 'bb', desc: 'No down payment, no PMI, competitive rates. Available to eligible veterans, active duty, and surviving spouses', url: 'https://www.va.gov/housing-assistance/home-loans', urlText: 'va.gov/housing-assistance/home-loans' },
    ],
  },
  {
    id: 'employment',
    category: 'Employment',
    grid: 'grid-3',
    items: [
      { id: 'vets-dol', title: 'Veterans Employment and Training', badge: 'VETS / DOL', cls: 'ba', desc: 'Job search tools, apprenticeships, and veteran employment programs from the Department of Labor', url: 'https://www.dol.gov/agencies/vets', urlText: 'dol.gov/agencies/vets' },
      { id: 'hiring-our-heroes', title: 'Hiring Our Heroes', badge: 'Jobs', cls: 'ba', desc: 'Connects veterans and military spouses with employers; fellowship programs available year-round', url: 'https://www.hiringourheroes.org', urlText: 'hiringourheroes.org' },
      { id: 'onet', title: 'O*NET OnLine', badge: 'Career', cls: 'ba', desc: 'Explore civilian occupations matched to your military experience and MOS code', url: 'https://www.onetonline.org', urlText: 'onetonline.org' },
      { id: 'linkedin-veterans', title: 'LinkedIn for Veterans', badge: 'Network', cls: 'ba', desc: 'Free LinkedIn Premium membership for veterans and military spouses', url: 'https://socialimpact.linkedin.com/programs/veterans', urlText: 'linkedin.com/veterans' },
      { id: 'usajobs', title: 'USAJobs', badge: 'Federal', cls: 'ba', desc: 'Federal government job listings with veterans preference filter — a natural bridge for many veterans', url: 'https://www.usajobs.gov', urlText: 'usajobs.gov' },
    ],
  },
  {
    id: 'family',
    category: 'Family and dependent benefits',
    grid: 'grid-2',
    items: [
      { id: 'tricare', title: 'TRICARE', badge: 'Health', cls: 'bb', desc: 'Military healthcare for family members including spouses and children under 21 (or 23 if full-time student)', url: 'https://www.tricare.mil', urlText: 'tricare.mil' },
      { id: 'fry-scholarship', title: 'Fry Scholarship', badge: 'Education', cls: 'bg', desc: 'Education benefits for children and surviving spouses of service members who died in the line of duty after Sept 10, 2001', url: 'https://www.va.gov/education/survivor-dependent-education-assistance/fry-scholarship', urlText: 'va.gov/education/fry-scholarship' },
      { id: 'teb', title: 'GI Bill Transfer (TEB)', badge: 'Dependents', cls: 'bg', desc: 'Active duty members with 6+ years of service can transfer unused Post-9/11 GI Bill to spouse or children — must apply before leaving active duty', url: 'https://milconnect.dmdc.osd.mil', urlText: 'milconnect.dmdc.osd.mil' },
      { id: 'sbp', title: 'Survivor Benefit Plan (SBP)', badge: 'Survivors', cls: 'bb', desc: 'DoD annuity providing up to 55% of retirement pay to survivors of retired service members — must be elected at retirement', url: 'https://www.dfas.mil/sbp', urlText: 'dfas.mil/sbp' },
      { id: 'dic', title: 'Dependency & Indemnity Compensation (DIC)', badge: 'Survivors', cls: 'bb', desc: 'Monthly tax-free benefit for surviving spouses and children of veterans who died from service-connected conditions', url: 'https://www.va.gov/disability/dependency-indemnity-compensation', urlText: 'va.gov/disability/dic' },
      { id: 'deers', title: 'DEERS', badge: 'Enrollment', cls: 'bb', desc: 'Defense Enrollment Eligibility Reporting System — mandatory enrollment for military dependents to access TRICARE and other benefits', url: 'https://milconnect.dmdc.osd.mil', urlText: 'milconnect.dmdc.osd.mil' },
      { id: 'military-onesource', title: 'Military OneSource', badge: 'Support', cls: 'bg', desc: 'Free 24/7 support — financial counseling, relocation assistance, childcare referrals, 12 free non-medical counseling sessions', url: 'https://www.militaryonesource.mil', urlText: 'militaryonesource.mil' },
      { id: 'caregiver', title: 'VA Caregiver Support', badge: 'Caregivers', cls: 'bb', desc: 'Financial stipend, health coverage, mental health support, and respite care for family caregivers of eligible veterans', url: 'https://www.caregiver.va.gov', urlText: 'caregiver.va.gov' },
    ],
  },
  {
    id: 'state',
    category: 'State resources',
    grid: 'grid-2',
    items: [
      { id: 'va-dvs', title: 'Virginia Dept of Veterans Services', badge: 'Virginia', cls: 'ba', desc: 'State-level benefits, claims assistance, and support programs for Virginia veterans', url: 'https://www.dvs.virginia.gov', urlText: 'dvs.virginia.gov' },
    ],
  },
  {
    id: 'mental-health',
    category: 'Mental health and crisis',
    grid: 'grid-3',
    items: [
      { id: 'crisis-line', title: 'Veterans Crisis Line', badge: '988 → press 1', cls: 'bd', desc: 'Call 988 then press 1, text 838255, or chat at veteranscrisisline.net. Available 24/7 for veterans in crisis', url: 'https://www.veteranscrisisline.net', urlText: 'veteranscrisisline.net' },
      { id: 'make-connection', title: 'Make the Connection', badge: 'Support', cls: 'bd', desc: 'Stories and resources for veterans and families facing mental health challenges', url: 'https://maketheconnection.net', urlText: 'maketheconnection.net' },
      { id: 'give-hour', title: 'Give an Hour', badge: 'Counseling', cls: 'bd', desc: 'Free mental health care for post-9/11 veterans and military families — no referral needed', url: 'https://giveanhour.org', urlText: 'giveanhour.org' },
    ],
  },
]

export default function ResourcesTab({ searchResult }) {
  const highlightIds = useMemo(() => {
    const raw = searchResult?.resourceMatch || ''
    return new Set(raw.split(',').map(s => s.trim()).filter(Boolean))
  }, [searchResult])

  const firstHighlightedId = useMemo(() => {
    for (const cat of RESOURCES) {
      for (const item of cat.items) {
        if (highlightIds.has(item.id)) return item.id
      }
    }
    return null
  }, [highlightIds])

  return (
    <div>
      <div style={{ width: '100%', maxHeight: 320, borderRadius: 12, marginBottom: 20, overflow: 'hidden', background: '#f5f4f0', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
        <img src="/resources.png" alt="Resources" style={{ width: '100%', maxHeight: 320, objectFit: 'contain', objectPosition: 'top', display: 'block' }} />
      </div>

      <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#b4b2a9', marginBottom: 4 }}>Your Strategies</p>
      <p className="sec-title">Resources</p>
      <p className="sec-sub">Verified resources organized by what you need most right now. Use the search bar above to find answers — matching resources will be highlighted.</p>

      {/* Key contact numbers */}
      <div style={{
        display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28,
        padding: '14px 18px', background: '#fff', border: '1px solid #E5E3DC',
        borderRadius: 12,
      }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#b4b2a9', textTransform: 'uppercase', letterSpacing: '.08em', width: '100%', marginBottom: 4 }}>
          Key contact numbers
        </p>
        {CONTACTS.map(c => (
          <div key={c.label} style={{
            flex: '1 1 160px', padding: '10px 14px',
            background: c.crisis ? '#fff5f5' : '#f5f7fc',
            borderRadius: 8, border: `1px solid ${c.crisis ? '#f5c0c0' : '#d3ddf0'}`,
          }}>
            <p style={{ fontSize: 10, color: '#b4b2a9', marginBottom: 3, fontWeight: 500 }}>{c.label}</p>
            <a href={`tel:${c.tel}`} style={{ fontSize: 16, fontWeight: 800, color: c.color, letterSpacing: '-.01em', textDecoration: 'none', display: 'block' }}>{c.number}</a>
          </div>
        ))}
      </div>

      {RESOURCES.map(({ id, category, grid, items }) => (
        <div key={id}>
          <p className="cat-label">{category}</p>

          {id === 'state' && (
            <div style={{
              marginBottom: 10, padding: '10px 14px', background: '#fff',
              border: '1px solid #E5E3DC', borderRadius: 8,
              fontSize: 12, color: '#5f5e5a', lineHeight: 1.6,
            }}>
              Every U.S. state has a Department of Veterans Affairs or Veterans Services office with state-specific benefits. Search "[your state] department of veterans services" to find your state's office.
            </div>
          )}

          <div className="resource-scroll-wrapper">
            <div className="resource-scroll-row">
              {items.map(r => {
                const highlighted = highlightIds.has(r.id)
                return (
                  <div
                    key={r.id}
                    id={r.id === firstHighlightedId ? 'first-resource-match' : undefined}
                    className="card resource-card-h"
                    style={highlighted ? {
                      border: '2px solid #C07A28',
                      boxShadow: '0 0 0 4px rgba(192,122,40,0.12)',
                      transition: 'box-shadow 0.3s ease',
                    } : {}}
                  >
                    {highlighted && (
                      <span className="ba" style={{ fontSize: 10, padding: '2px 8px', marginBottom: 8, display: 'inline-block' }}>
                        Relevant to your search
                      </span>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <p style={{ fontSize: 14, fontWeight: 500, flex: 1, marginRight: 8 }}>{r.title}</p>
                      <span className={r.cls} style={{ flexShrink: 0 }}>{r.badge}</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#5f5e5a', marginBottom: 8, lineHeight: 1.6 }}>{r.desc}</p>
                    <a href={r.url} target="_blank" rel="noreferrer" style={{ fontSize: 12 }}>{r.urlText}</a>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ))}

      <AdUnit slot="5201008369" />
      <FunFact />
    </div>
  )
}
