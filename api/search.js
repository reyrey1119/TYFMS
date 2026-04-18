const KNOWLEDGE_BASE = `
TYFMS TABS:
- home (id: home): Daily tips, transition timeline, stats, links to all tools
- translator (id: translator): Enter MOS/AFSC/rate + branch → civilian job titles, transferable skills, career paths, target industries, identity tip, resume draft
- resume (id: resume): Full resume builder — contact info, military background, target company, non-military experience; save/load drafts when signed in
- identity (id: identity): AI conversation guide for identity reconstruction after service. 4-phase journey: Awareness → Exploration → Articulation → Integration. Generates professional identity statement after 6+ messages
- network (id: network): Peer networking — connect with veteran mentors and mentees by MOS/AFSC/rate and role
- trends (id: trends): Weekly market analysis — high-demand sectors, opportunity scores by industry, personalized matching to your background
- tracker (id: tracker): 25-milestone roadmap across 5 phases: Paperwork & Benefits, Identity & Skills, Education or Job Search, First Civilian Role, Long-term Growth. Plus custom goals
- path (id: path): 12-question career archetype assessment → Strategist, Builder, Guardian, or Connector — with target roles, sectors, and career translation tip
- resources (id: resources): Verified, curated links organized by category (see full list below)
- about (id: about): Research and story behind TYFMS

RESOURCES TAB — FULL CONTENT:

VA BENEFITS:
- VA.gov (va.gov): Primary gateway for all VA benefits, healthcare, disability claims, and services
- Veteran Readiness & Employment / VR&E (va.gov/careers-employment/vocational-rehabilitation): Career and education services for veterans with service-connected disabilities. Can pay for school, training, or job placement
- eBenefits (ebenefits.va.gov): Manage VA benefits, claims, and service records online

EDUCATION:
- GI Bill Comparison Tool (va.gov/gi-bill-comparison-tool): Compare GI Bill benefits at schools nationwide
- GoArmyEd (goarmyed.com): Tuition assistance portal for active Army soldiers
- Student Veterans of America (studentveterans.org): Peer network and advocacy for student veterans on campus

CAREER TOOLS:
- O*NET OnLine (onetonline.org): Explore civilian occupations matched to your military experience and MOS
- Hiring Our Heroes (hiringourheroes.org): Connects veterans and military spouses with civilian employers; fellowship programs
- LinkedIn for Veterans (linkedin.com/veterans): Free LinkedIn Premium membership for veterans and military spouses

MENTAL HEALTH & WELLBEING:
- Veterans Crisis Line: Call 988 then press 1, or text 838255; available 24/7
- Make the Connection (maketheconnection.net): Stories and resources for veterans and families facing mental health challenges
- Give an Hour (giveanhour.org): Free mental health care for post-9/11 veterans and military families

ADDITIONAL VETERAN & FAMILY BENEFITS KNOWLEDGE:

DEPENDENT & FAMILY BENEFITS:
- TRICARE (tricare.mil): Health coverage for military dependents and retirees. Covers spouses, children under 21 (or 23 if full-time student). Available for active duty, retired military, and survivors
- Dependents Educational Assistance (DEA) / Chapter 35 (va.gov): Up to 45 months of education benefits for spouses and children of veterans who are permanently and totally disabled from a service-connected condition, died from service-connected cause, are MIA, or are held as a POW. Covers school, job training, apprenticeships
- Fry Scholarship / Chapter 33 (va.gov): For children and surviving spouses of service members who died in the line of duty after Sept 10, 2001. Full tuition at public schools or up to the national max at private schools. Apply at va.gov
- GI Bill Transfer to Dependents / TEB (milconnect.dmdc.osd.mil): Active duty members with 6+ years of service can transfer unused Post-9/11 GI Bill (Chapter 33) entitlement to spouse or children, with commitment to 4 more years of service. Must apply BEFORE leaving active duty
- Survivor Benefit Plan / SBP (military.com or dfas.mil): DoD annuity providing up to 55% of retirement pay to survivors of retired service members. Must be elected at retirement. Separate from VA DIC
- VA Dependency and Indemnity Compensation / DIC (va.gov): Monthly tax-free payment to eligible survivors of veterans who died from a service-connected condition or were totally disabled for 10+ years. Apply at va.gov or with a VSO
- DEERS / Defense Enrollment Eligibility Reporting System (milconnect.dmdc.osd.mil): Mandatory enrollment for military dependents to access TRICARE and other benefits. Enroll at any military ID card office or online
- Military OneSource (militaryonesource.mil): Free 24/7 support for service members and families — financial counseling, relocation help, childcare referrals, spouse employment, counseling sessions (12 free non-medical counseling sessions)
- VA Caregiver Support Program (va.gov/family-member-benefits): Support for family caregivers of eligible veterans — includes financial stipend, health coverage, mental health support, and respite care
- VA Home Loan (va.gov/housing-assistance): No down payment, no PMI, competitive rates for eligible veterans AND surviving spouses. Certificate of Eligibility through va.gov
`

function buildFallback(query) {
  const q = (query || '').toLowerCase()
  let tab = 'resources'
  let sectionHint = 'VA benefits section'
  if (q.match(/mos|afsc|job|career|civilian|translat|skill|role|occupation/)) { tab = 'translator'; sectionHint = 'Skills translator' }
  else if (q.match(/resum|cv\b/)) { tab = 'resume'; sectionHint = 'Resume builder' }
  else if (q.match(/identity|who am i|purpose|meaning|self/)) { tab = 'identity'; sectionHint = 'Identity guide' }
  else if (q.match(/network|mentor|connect|peer/)) { tab = 'network'; sectionHint = 'Peer networking' }
  else if (q.match(/goal|track|milestone|progress|roadmap/)) { tab = 'tracker'; sectionHint = 'Progress tracker' }
  else if (q.match(/trend|market|sector|industry|demand/)) { tab = 'trends'; sectionHint = 'Career trends' }
  else if (q.match(/path|archetype|fit|personality|type/)) { tab = 'path'; sectionHint = 'Find your path assessment' }
  else if (q.match(/gi bill|benefit|va |tricare|disability|education|school|college|dep|child|spouse|family|surviv|sbp|dic|deers|caregiver/)) {
    tab = 'resources'; sectionHint = 'VA benefits and dependent benefits'
  }
  return {
    tab,
    summary: `We didn't find an exact match for that search, but here's where to look. For dependent and family benefits — including TRICARE health coverage, DEA Chapter 35 education for children of disabled veterans, GI Bill transfer to dependents, DIC survivor compensation, and Military OneSource support — visit VA.gov or the Resources tab for verified links. If your question is about translating your military experience to civilian careers, the Skills Translator is the best first step. The Resources tab has verified links for every major veteran benefit program.`,
    sectionHint,
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured on server.' })

  const { query } = req.body || {}
  if (!query?.trim()) return res.status(400).json({ error: 'Search query required.' })

  const prompt = `You are a knowledgeable veteran transition advisor for TYFMS. A veteran just searched for information. Give a real, substantive answer with specific facts.

${KNOWLEDGE_BASE}

Search query: "${query}"

INSTRUCTIONS:
1. Give a 3-5 sentence answer with specific, actionable information directly addressing the query.
2. For dependent/family/parent/children questions, reference the relevant programs by name: TRICARE, DEA Chapter 35, DIC, GI Bill Transfer (TEB), SBP, DEERS, Military OneSource, Fry Scholarship.
3. Include the most relevant URLs from the knowledge base when applicable.
4. Always pick the most relevant tab id from: home, translator, resume, identity, network, trends, tracker, path, resources.
5. For benefits/dependent/family/health questions → tab: resources, sectionHint should name the specific benefit program.
6. For career/MOS/job questions → tab: translator.
7. If no specific answer exists, still give a helpful response pointing to resources — NEVER return an error or empty answer.

Respond with ONLY valid JSON on one line (no markdown, no code blocks, no extra text before or after):
{"tab":"<tab_id>","summary":"<3-5 sentence answer with specific info>","sectionHint":"<specific program, section, or resource name>"}`

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 600,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await r.json()
    if (data.error) return res.status(200).json(buildFallback(query))

    const raw = (data.content || []).map(i => i.text || '').join('').trim()

    // Robust multi-strategy JSON extraction
    let parsed = null

    // Strategy 1: strip code fences, parse whole string
    const stripped = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
    try { parsed = JSON.parse(stripped) } catch {}

    // Strategy 2: extract first complete {...} block
    if (!parsed) {
      const m = stripped.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)?\}|\{[\s\S]*\}/)
      if (m) { try { parsed = JSON.parse(m[0]) } catch {} }
    }

    // Strategy 3: find last {...} block working backwards
    if (!parsed) {
      const all = [...stripped.matchAll(/\{[\s\S]*?\}/g)]
      for (let i = all.length - 1; i >= 0; i--) {
        try { parsed = JSON.parse(all[i][0]); break } catch {}
      }
    }

    // Strategy 4: manual field extraction from raw text
    if (!parsed) {
      const tabM = raw.match(/"tab"\s*:\s*"([^"]+)"/)
      const sumM = raw.match(/"summary"\s*:\s*"((?:[^"\\]|\\.)+)"/)
      const hintM = raw.match(/"sectionHint"\s*:\s*"((?:[^"\\]|\\.)+)"/)
      if (tabM && sumM) {
        parsed = {
          tab: tabM[1],
          summary: sumM[1].replace(/\\n/g, ' ').replace(/\\"/g, '"'),
          sectionHint: hintM ? hintM[1] : '',
        }
      }
    }

    if (!parsed || !parsed.tab || !parsed.summary) {
      return res.status(200).json(buildFallback(query))
    }

    return res.status(200).json(parsed)
  } catch {
    return res.status(200).json(buildFallback(query))
  }
}
