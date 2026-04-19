// Resource IDs available for resourceMatch field:
// vagov, myhealthevet, accessva, ebenefits, nrd, va-navigator,
// va-education, gi-bill-tool, goarmyed, sva, dea,
// va-home-loan,
// vets-dol, hiring-our-heroes, onet, linkedin-veterans, usajobs,
// tricare, fry-scholarship, teb, sbp, dic, deers, military-onesource, caregiver,
// va-dvs,
// crisis-line, make-connection, give-hour

const KNOWLEDGE_BASE = `
TYFMS TABS:
- home: Daily tips, transition timeline, stats, links to all tools
- translator: Enter MOS/AFSC/rate + branch → civilian job titles, transferable skills, career paths, industries, resume draft
- resume: Full resume builder — contact info, military background, target company, non-military experience; save/load when signed in
- identity: AI conversation guide for identity reconstruction. 4 phases: Awareness → Exploration → Articulation → Integration. Generates identity statement after 6+ messages
- network: Peer networking — connect with veteran mentors/mentees by MOS/AFSC and role
- trends: Weekly market analysis — high-demand sectors, opportunity scores, personalized matching
- tracker: 25-milestone roadmap: Paperwork & Benefits, Identity & Skills, Education/Job Search, First Civilian Role, Long-term Growth. Plus custom goals
- path: 12-question career archetype quiz → Strategist, Builder, Guardian, or Connector
- resources: Curated verified resources (see full list below)
- about: Research and mission behind TYFMS

RESOURCES TAB — COMPLETE LIST WITH RESOURCE IDs:

CORE VA PORTALS:
- vagov | VA.gov | va.gov | Primary gateway for all VA benefits, claims, healthcare, disability ratings, appeals
- myhealthevet | My HealtheVet | myhealth.va.gov | Online VA health portal — prescriptions, medical records, secure messaging, appointments
- accessva | AccessVA | access.va.gov | Gateway to specialized VA tools: QuickSubmit document uploads, VetBiz for veteran businesses
- ebenefits | eBenefits | ebenefits.va.gov | GI Bill enrollment, Home Loan certificates, legacy benefits management

RESOURCE DIRECTORIES:
- nrd | National Resource Directory | nrd.gov | 16,000+ vetted resources: homeless assistance, employment, legal aid, financial help
- va-navigator | VA Resource Navigator | va.gov/resources | Curated guide with direct links and phone numbers for all major VA service categories

EDUCATION:
- va-education | VA Education and Training | va.gov/education | GI Bill benefits, school enrollment verification, education awards management
- gi-bill-tool | GI Bill Comparison Tool | va.gov/gi-bill-comparison-tool | Compare GI Bill benefits at schools nationwide
- goarmyed | GoArmyEd | goarmyed.com | Army tuition assistance portal for active soldiers
- sva | Student Veterans of America | studentveterans.org | Peer network and advocacy for student veterans on campus
- dea | DEA Chapter 35 | va.gov/education/survivor-dependent-education-assistance | Up to 45 months of education benefits for spouses/children of permanently disabled or deceased veterans

HOME LOANS:
- va-home-loan | VA Home Loans | va.gov/housing-assistance/home-loans | No down payment, no PMI, competitive rates for eligible veterans and surviving spouses

EMPLOYMENT:
- vets-dol | Veterans Employment and Training (VETS) | dol.gov/agencies/vets | DOL job tools, apprenticeships, HIRE Vets Medallion program
- hiring-our-heroes | Hiring Our Heroes | hiringourheroes.org | Connects veterans and military spouses with employers; fellowship programs
- onet | O*NET OnLine | onetonline.org | Civilian occupations matched to military experience and MOS codes
- linkedin-veterans | LinkedIn for Veterans | linkedin.com/veterans | Free LinkedIn Premium membership for veterans and military spouses
- usajobs | USAJobs | usajobs.gov | Federal government jobs with veterans preference filter

FAMILY AND DEPENDENT BENEFITS:
- tricare | TRICARE | tricare.mil | Military healthcare for dependents: spouses, children under 21 (or 23 if full-time student)
- fry-scholarship | Fry Scholarship | va.gov/education/fry-scholarship | Education for children/spouses of service members who died in line of duty after Sept 10, 2001
- teb | GI Bill Transfer (TEB) | milconnect.dmdc.osd.mil | Transfer unused Post-9/11 GI Bill to spouse or children — requires 6+ years service + 4-year commitment; MUST apply before leaving active duty
- sbp | Survivor Benefit Plan (SBP) | dfas.mil/sbp | Up to 55% of retirement pay as annuity to survivors of retired service members — elected at retirement
- dic | Dependency and Indemnity Compensation (DIC) | va.gov/disability/dic | Monthly tax-free benefit for surviving spouses/children of veterans who died from service-connected conditions
- deers | DEERS | milconnect.dmdc.osd.mil | Defense Enrollment Eligibility Reporting System — mandatory for dependents to access TRICARE and other benefits
- military-onesource | Military OneSource | militaryonesource.mil | Free 24/7 family support: financial counseling, relocation, childcare, 12 free counseling sessions
- caregiver | VA Caregiver Support | caregiver.va.gov | Financial stipend, health coverage, training, respite care for family caregivers of eligible veterans

STATE RESOURCES:
- va-dvs | Virginia Dept of Veterans Services | dvs.virginia.gov | State-level benefits for Virginia veterans — every state has a similar department

MENTAL HEALTH AND CRISIS:
- crisis-line | Veterans Crisis Line | veteranscrisisline.net | Call 988 press 1, text 838255, chat at veteranscrisisline.net — 24/7
- make-connection | Make the Connection | maketheconnection.net | Stories and resources for veterans and families facing mental health challenges
- give-hour | Give an Hour | giveanhour.org | Free mental health care for post-9/11 veterans — no referral needed

KEY SEARCH TERM MAPPINGS:
- healthcare, doctor, prescription, appointment, medical → myhealthevet, vagov
- home loan, mortgage, house, buy a home, VA loan → va-home-loan
- family, spouse, dependent, children, child, parent, parents, parent benefits → tricare, deers, military-onesource, teb, dea, fry-scholarship
- caregiver, caring for veteran → caregiver, military-onesource
- burial, memorial, funeral → vagov (va.gov/burials-memorials)
- legal, lawyer, attorney, legal aid → nrd
- state benefits, local benefits, state resources → va-dvs
- crisis, suicidal, emergency help, mental health → crisis-line, make-connection, give-hour
- federal job, government job, usajobs → usajobs, vets-dol
- apprenticeship, trade, skilled trade → vets-dol
- TRICARE, health insurance, health coverage → tricare
- DIC, survivor compensation → dic, sbp
- SBP, retirement survivor → sbp
- DEERS, dependent ID, enrollment → deers
- DEA, chapter 35, dependent education → dea
- Fry scholarship → fry-scholarship
- GI Bill transfer, TEB → teb
- Military OneSource → military-onesource
- career, MOS, AFSC, job title, civilian job → translator tab (not resources)
- identity, who am I, purpose → identity tab
`

const CRISIS_RE = /\b(crisis|suicid|kill myself|end my life|no reason to live|in danger|in crisis)\b/i

function buildFallback(query) {
  const q = (query || '').toLowerCase()
  let tab = 'resources'
  let sectionHint = 'VA benefits and resources'
  let resourceMatch = ''

  if (q.match(/mos|afsc|job|career|civilian|translat|skill|role|occupation/)) {
    tab = 'translator'; sectionHint = 'Skills translator'
  } else if (q.match(/resum|cv\b/)) {
    tab = 'resume'; sectionHint = 'Resume builder'
  } else if (q.match(/identity|who am i|purpose|meaning|self/)) {
    tab = 'identity'; sectionHint = 'Identity guide'
  } else if (q.match(/network|mentor|connect|peer/)) {
    tab = 'network'; sectionHint = 'Peer networking'
  } else if (q.match(/goal|track|milestone|progress|roadmap/)) {
    tab = 'tracker'; sectionHint = 'Progress tracker'
  } else if (q.match(/trend|market|sector|industry|demand/)) {
    tab = 'trends'; sectionHint = 'Career trends'
  } else if (q.match(/path|archetype|fit|personality|type/)) {
    tab = 'path'; sectionHint = 'Find your path assessment'
  } else if (q.match(/health|doctor|prescription|appointment|medical/)) {
    resourceMatch = 'myhealthevet, vagov'; sectionHint = 'My HealtheVet — health portal'
  } else if (q.match(/home loan|mortgage|hous|loan/)) {
    resourceMatch = 'va-home-loan'; sectionHint = 'VA Home Loans'
  } else if (q.match(/family|spouse|dependent|child|parent|tricare/)) {
    resourceMatch = 'tricare, deers, military-onesource, teb, dea, fry-scholarship'
    sectionHint = 'Family and dependent benefits'
  } else if (q.match(/caregiver/)) {
    resourceMatch = 'caregiver, military-onesource'; sectionHint = 'VA Caregiver Support'
  } else if (q.match(/legal|lawyer|attorney/)) {
    resourceMatch = 'nrd'; sectionHint = 'National Resource Directory — legal aid'
  } else if (q.match(/crisis|mental health|counseling|therapy/)) {
    resourceMatch = 'crisis-line, make-connection, give-hour'; sectionHint = 'Veterans Crisis Line — 988 press 1'
  } else if (q.match(/gi bill|benefit|education|school|college/)) {
    resourceMatch = 'va-education, gi-bill-tool'; sectionHint = 'VA Education and Training'
  }

  return {
    tab,
    summary: `We didn't find an exact match for that search, but here's where to look. The Resources tab covers VA.gov portals, education (GI Bill, DEA Chapter 35 for dependents), employment (O*NET, Hiring Our Heroes, USAJobs), family benefits (TRICARE, DIC, SBP, Military OneSource), and mental health support (Veterans Crisis Line: 988 press 1). For translating your military experience to civilian careers, the Skills Translator is the best starting point. Key numbers: VA hotline 800-698-2411, Benefits 800-827-1000.`,
    sectionHint,
    resourceMatch,
  }
}

// Inline regulation lookup — avoids cross-file import issues in Vercel bundler.
// Tries full-text search first, falls back to ilike so we always get results.
async function searchRegs(query) {
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const url = process.env.VITE_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY
    if (!url || !key) return []
    const sb = createClient(url, key, { auth: { persistSession: false } })

    // Full-text search using tsvector index
    const { data: ftData, error: ftErr } = await sb
      .from('regulation_chunks')
      .select('part, part_num, section, content')
      .textSearch('content_tsv', query, { type: 'plain' })
      .order('part_num', { ascending: true })
      .limit(3)
    if (!ftErr && ftData?.length) return ftData

    // Fallback: keyword ilike on the most significant term
    const stopWords = new Set(['what', 'when', 'where', 'does', 'the', 'for', 'and', 'are', 'have', 'with', 'that', 'this', 'from', 'your', 'about', 'will', 'can'])
    const terms = query.toLowerCase().replace(/['"?!.]/g, '').split(/\s+/)
      .filter(t => t.length > 3 && !stopWords.has(t))
    if (!terms.length) return []
    const { data: likeData } = await sb
      .from('regulation_chunks')
      .select('part, part_num, section, content')
      .ilike('content', `%${terms[0]}%`)
      .limit(3)
    return likeData || []
  } catch { return [] }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured on server.' })

  const { query } = req.body || {}
  if (!query?.trim()) return res.status(400).json({ error: 'Search query required.' })

  // Crisis fast-path — don't wait for AI
  if (CRISIS_RE.test(query)) {
    return res.status(200).json({
      tab: 'resources',
      summary: 'If you are in crisis, please reach out right now. Call or text 988 and press 1 for the Veterans Crisis Line — available 24/7. You can also text 838255 or chat at veteranscrisisline.net. If you are in immediate danger, call 911. You are not alone, and help is available this moment.',
      sectionHint: 'Veterans Crisis Line — 988 press 1',
      resourceMatch: 'crisis-line, make-connection, give-hour',
    })
  }

  // Regulation lookup — runs before AI to inject authoritative CFR text into the prompt
  const regChunks = await searchRegs(query)
  const hasRegs = regChunks.length > 0

  const regSection = hasRegs
    ? `\n\n=== MANDATORY: USE THIS EXACT REGULATION TEXT ===\nThe following text is directly from 38 CFR. You MUST:\n1. Begin your "summary" value with "Per 38 CFR ${regChunks[0].part}${regChunks[0].section ? ', ' + regChunks[0].section : ''}:" followed by a quote or close paraphrase of the regulation text below.\n2. Then explain in plain language what this means for the veteran (2-3 sentences).\n3. Do NOT ignore this regulation text. Do NOT start with a generic sentence.\n\n${regChunks.map(c => `[${c.part}${c.section ? ' / ' + c.section : ''}]\n${c.content.slice(0, 500)}`).join('\n\n')}\n=== END REGULATION TEXT ===`
    : ''

  const summaryInstruction = hasRegs
    ? '1. Your summary MUST begin with "Per 38 CFR..." as instructed above. Then explain what it means for the veteran.'
    : '1. Give a 3-5 sentence answer directly addressing the query with specific information, URLs, and program names.'

  const prompt = `You are a knowledgeable veteran transition advisor for TYFMS. A veteran just searched for information.

${KNOWLEDGE_BASE}${regSection}

Search query: "${query}"

INSTRUCTIONS:
${summaryInstruction}
2. For dependent/family/parent/children questions: reference TRICARE, DEA Chapter 35, DIC, TEB, SBP, DEERS, Military OneSource, Fry Scholarship by name.
3. For healthcare questions: reference My HealtheVet.
4. For home/mortgage questions: reference VA Home Loans.
5. For legal/attorney questions: reference National Resource Directory (nrd.gov).
6. For state questions: mention every state has a veterans services department.
7. For crisis/mental health: reference Veterans Crisis Line (988 press 1) prominently.
8. NEVER return an error. Always give a helpful response.
9. Choose the most relevant tab: home, translator, resume, identity, network, trends, tracker, path, resources.
10. Set resourceMatch to a comma-separated list of the most relevant resource IDs (up to 4) from this list only:
    vagov, myhealthevet, accessva, ebenefits, nrd, va-navigator, va-education, gi-bill-tool, goarmyed, sva, dea, va-home-loan, vets-dol, hiring-our-heroes, onet, linkedin-veterans, usajobs, tricare, fry-scholarship, teb, sbp, dic, deers, military-onesource, caregiver, va-dvs, crisis-line, make-connection, give-hour

Respond with ONLY valid JSON on one line (no markdown, no code blocks, no extra text):
{"tab":"<tab_id>","summary":"<answer — must start with Per 38 CFR... if regulation text was provided>","sectionHint":"<specific resource name or category>","resourceMatch":"<comma-separated resource ids>"}`

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
        max_tokens: 650,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await r.json()
    if (data.error) return res.status(200).json(buildFallback(query))

    const raw = (data.content || []).map(i => i.text || '').join('').trim()

    let parsed = null

    // Strategy 1: strip code fences, parse whole string
    const stripped = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
    try { parsed = JSON.parse(stripped) } catch {}

    // Strategy 2: extract first {...} block
    if (!parsed) {
      const m = stripped.match(/\{[\s\S]*\}/)
      if (m) { try { parsed = JSON.parse(m[0]) } catch {} }
    }

    // Strategy 3: last {...} block
    if (!parsed) {
      const all = [...stripped.matchAll(/\{[\s\S]*?\}/g)]
      for (let i = all.length - 1; i >= 0; i--) {
        try { parsed = JSON.parse(all[i][0]); break } catch {}
      }
    }

    // Strategy 4: manual field extraction
    if (!parsed) {
      const tabM = raw.match(/"tab"\s*:\s*"([^"]+)"/)
      const sumM = raw.match(/"summary"\s*:\s*"((?:[^"\\]|\\.)+)"/)
      const hintM = raw.match(/"sectionHint"\s*:\s*"((?:[^"\\]|\\.)+)"/)
      const matchM = raw.match(/"resourceMatch"\s*:\s*"((?:[^"\\]|\\.)*)"/)
      if (tabM && sumM) {
        parsed = {
          tab: tabM[1],
          summary: sumM[1].replace(/\\n/g, ' ').replace(/\\"/g, '"'),
          sectionHint: hintM ? hintM[1] : '',
          resourceMatch: matchM ? matchM[1] : '',
        }
      }
    }

    if (!parsed || !parsed.tab || !parsed.summary) {
      return res.status(200).json(buildFallback(query))
    }

    // Ensure resourceMatch is a string
    if (typeof parsed.resourceMatch !== 'string') parsed.resourceMatch = ''

    // Server stamps regulationBacked — Claude doesn't control this flag
    parsed.regulationBacked = hasRegs

    return res.status(200).json(parsed)
  } catch {
    return res.status(200).json(buildFallback(query))
  }
}
