// Verified certification catalog.
//
// The generators may only recommend credentials that appear here, so a model can
// never invent one (an earlier answer named an SMRP "Certified Maintenance
// Manager"; SMRP's own offerings page lists only the CMRP and CMRT).
//
// Every `url` below was loaded on 2026-10-15 (HTTP 200, or read in a browser when
// the site blocks scripted requests) and points at the issuing body. Re-verify
// before adding entries. A credential is something a person EARNS from the
// provider; military experience does not grant one automatically.

export const CERT_CATALOG = [
  // Cybersecurity & IT
  { name: 'CompTIA Security+',  aliases: ['Security+'],          provider: 'CompTIA',  url: 'https://www.comptia.org/en-us/certifications/security/' },
  { name: 'CompTIA Network+',   aliases: ['Network+'],           provider: 'CompTIA',  url: 'https://www.comptia.org/en-us/certifications/network/' },
  { name: 'CompTIA A+',         aliases: ['A+'],                 provider: 'CompTIA',  url: 'https://www.comptia.org/en-us/certifications/a/' },
  { name: 'CompTIA CySA+',      aliases: ['CySA+'],              provider: 'CompTIA',  url: 'https://www.comptia.org/en-us/certifications/cybersecurity-analyst/' },
  { name: 'CompTIA SecurityX',  aliases: ['CASP+', 'CompTIA CASP+'], provider: 'CompTIA', url: 'https://www.comptia.org/en-us/certifications/securityx/' },
  { name: 'Certified Ethical Hacker (CEH)', aliases: ['CEH'],    provider: 'EC-Council', url: 'https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh-v13-north-america/' },
  { name: 'CISSP',              aliases: [],                     provider: 'ISC2',     url: 'https://www.isc2.org/certifications/cissp', eligibility: 'ISC2 lists 5 years of required work experience.' },
  { name: 'CISM',               aliases: [],                     provider: 'ISACA',    url: 'https://www.isaca.org/credentialing/cism' },
  { name: 'AWS Certified Cloud Practitioner',        aliases: ['AWS Cloud Practitioner'],   provider: 'Amazon Web Services', url: 'https://aws.amazon.com/certification/certified-cloud-practitioner/' },
  { name: 'AWS Certified Solutions Architect – Associate', aliases: ['AWS Solutions Architect'], provider: 'Amazon Web Services', url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/' },
  { name: 'Microsoft Azure Fundamentals', aliases: ['AZ-900'],  provider: 'Microsoft', url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/' },
  { name: 'Microsoft Azure Administrator', aliases: ['Azure Administrator', 'AZ-104'], provider: 'Microsoft', url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-administrator/' },
  { name: 'Google Cloud Associate Cloud Engineer', aliases: ['Google Cloud Associate'], provider: 'Google Cloud', url: 'https://cloud.google.com/learn/certification/cloud-engineer' },
  { name: 'Cisco CCNA',         aliases: ['CCNA'],               provider: 'Cisco',    url: 'https://www.cisco.com/site/us/en/learn/training-certifications/certifications/enterprise/ccna/index.html' },

  // Project, operations & quality
  { name: 'Project Management Professional (PMP)', aliases: ['PMP'], provider: 'Project Management Institute', url: 'https://www.pmi.org/certifications/project-management-pmp', eligibility: 'PMI lists 3+ years of experience leading projects (less with a four-year degree and some programs).' },
  { name: 'Certified ScrumMaster (CSM)', aliases: ['Agile Scrum Master', 'CSM'], provider: 'Scrum Alliance', url: 'https://www.scrumalliance.org/get-certified/scrum-master-track/certified-scrummaster' },
  { name: 'Six Sigma Green Belt (CSSGB)', aliases: ['Six Sigma Green Belt'], provider: 'ASQ', url: 'https://asq.org/cert/six-sigma-green-belt' },

  // Maintenance & reliability — SMRP offers exactly these two (no "Certified Maintenance Manager")
  { name: 'Certified Maintenance & Reliability Professional (CMRP)', aliases: ['CMRP'], provider: 'SMRP', url: 'https://smrp.org/Certification/Get-Certified/Certification-Offerings-Process/' },
  { name: 'Certified Maintenance & Reliability Technician (CMRT)',   aliases: ['CMRT'], provider: 'SMRP', url: 'https://smrp.org/Certification/Get-Certified/Certification-Offerings-Process/' },

  // Human resources — one entry per credential level
  { name: 'Associate Professional in Human Resources (aPHR)', aliases: ['aPHR'], provider: 'HR Certification Institute', url: 'https://www.hrci.org/certifications/individual-certifications/aphr' },
  { name: 'Professional in Human Resources (PHR)',            aliases: ['PHR'],  provider: 'HR Certification Institute', url: 'https://www.hrci.org/certifications/individual-certifications/phr' },
  { name: 'Senior Professional in Human Resources (SPHR)',    aliases: ['SPHR'], provider: 'HR Certification Institute', url: 'https://www.hrci.org/certifications/individual-certifications/sphr' },
  { name: 'SHRM Certified Professional (SHRM-CP)',            aliases: ['SHRM-CP'],  provider: 'SHRM', url: 'https://www.shrm.org/credentials/certification/shrm-cp' },
  { name: 'SHRM Senior Certified Professional (SHRM-SCP)',    aliases: ['SHRM-SCP'], provider: 'SHRM', url: 'https://www.shrm.org/credentials/certification/shrm-scp' },

  // Healthcare — NREMT publishes one examination page per pair of levels, so two
  // entries share a page; each is still its own credential.
  { name: 'Emergency Medical Technician (EMT)',           aliases: ['EMT-Basic', 'EMT'], provider: 'NREMT', url: 'https://www.nremt.org/Pages/Examinations/EMR-and-EMT-Certification-Examinations', urlNote: 'This NREMT page also covers Emergency Medical Responder.' },
  { name: 'Advanced Emergency Medical Technician (AEMT)', aliases: ['EMT-Advanced', 'AEMT'], provider: 'NREMT', url: 'https://www.nremt.org/Pages/Examinations/AEMT-and-Paramedic-Certification-Examinations', urlNote: 'This NREMT page also covers Paramedic.' },
  { name: 'Paramedic',                                    aliases: ['Paramedic (NREMT-P)', 'NREMT-P'], provider: 'NREMT', url: 'https://www.nremt.org/Pages/Examinations/AEMT-and-Paramedic-Certification-Examinations', urlNote: 'This NREMT page also covers Advanced EMT.' },
  { name: 'Certified Professional Coder (CPC)', aliases: ['Medical Coding (CPC)', 'CPC'], provider: 'AAPC', url: 'https://www.aapc.com/certifications/cpc/' },
  { name: 'Certified Phlebotomy Technician (CPT)', aliases: ['Phlebotomy Technician'], provider: 'National Healthcareer Association', url: 'https://www.nhanow.com/certification/ptcs' },

  // Logistics & supply chain
  { name: 'Certified Supply Chain Professional (CSCP)', aliases: ['APICS CSCP', 'CSCP'], provider: 'ASCM', url: 'https://www.ascm.org/learning-development/certifications-credentials/cscp/' },
  { name: 'Certified in Planning and Inventory Management (CPIM)', aliases: ['APICS CPIM', 'CPIM'], provider: 'ASCM', url: 'https://www.ascm.org/learning-development/certifications-credentials/cpim/' },

  // Finance
  { name: 'FINRA Series 7',     aliases: ['Series 7'],           provider: 'FINRA',    url: 'https://www.finra.org/registration-exams-ce/qualification-exams/series7' },
  { name: 'Certified Public Accountant (CPA)', aliases: ['CPA'], provider: 'AICPA & state boards of accountancy', url: 'https://www.aicpa-cima.com/resources/landing/cpa-exam' },
  { name: 'CERTIFIED FINANCIAL PLANNER (CFP)', aliases: ['Certified Financial Planner (CFP)', 'CFP'], provider: 'CFP Board', url: 'https://www.cfp.net/certification-process' },
]

const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9+]+/g, ' ').trim()

export function findCert(name) {
  const n = norm(name)
  if (!n) return null
  return CERT_CATALOG.find(c => norm(c.name) === n || c.aliases.some(a => norm(a) === n)) || null
}

// Keep only recommendations that exist in the catalog, attach the provider link,
// drop anything already held, and never return a duplicate.
export function verifyRecommendations(recommended, held = []) {
  const heldNames = new Set((held || []).map(h => findCert(h)?.name || norm(h)))
  const seen = new Set()
  const out = []
  for (const rec of Array.isArray(recommended) ? recommended : []) {
    const cert = findCert(rec?.name)
    if (!cert || seen.has(cert.name) || heldNames.has(cert.name)) continue
    seen.add(cert.name)
    out.push({ name: cert.name, why: String(rec.why || '').slice(0, 300), provider: cert.provider, url: cert.url, ...(cert.urlNote ? { urlNote: cert.urlNote } : {}), ...(cert.eligibility ? { eligibility: `${cert.eligibility} Check the provider's current requirements.` } : {}) })
  }
  return out
}

export const CERT_NAMES_FOR_PROMPT = CERT_CATALOG.map(c => c.name).join('; ')
