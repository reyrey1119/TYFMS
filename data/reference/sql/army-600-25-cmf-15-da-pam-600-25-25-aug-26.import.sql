-- Import: army-600-25-cmf-15-da-pam-600-25-25-aug-26
-- 236 passages from DA PAM 600-25: Aviation (CMF 15) Career Progression Plan, DA PAM 600-25, 25 Aug 2026
-- Imported as review_status='unreviewed'; it is NOT served to users until approved.
begin;
insert into public.reference_sources
  (id, branch, personnel_category, publication_number, title, chapter, career_field, proponent, official_url,
   publication_date, effective_date, last_checked_at, checksum_sha256, ingestion_status, review_status, notes, extraction_tool, import_batch, content_sha256)
values ('9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', 'DA PAM 600-25', 'Aviation (CMF 15) Career Progression Plan, DA PAM 600-25, 25 Aug 2026', null, 'CMF 15', null, 'https://api.army.mil/e2/c/downloads/2026/08/25/0e5cb6fe/cmf-15-da-pam-600-25-25-aug-26.pdf',
   '2026-08-25', null, '2026-10-18T00:00:00Z', '96908b0baba690cd4ea068ebadb3363968a97097d759aca584129339ac727e48', 'extracted', 'unreviewed', 'Date basis: the 2026-08-25 date comes from the official file name and the Army G-1 listing (https://www.army.mil/g-1), checked 2026-10-16; the PDF body may print no date. Imported for 15B, 15C, 15D, 15F, 15G, 15H, 15K, 15L, 15M, 15N, 15P, 15Q, 15R, 15T, 15U, 15X, 15Y, 15Z. Duties and prerequisites are NOT imported from this guide (DA PAM 611-21 is the source for them); promotion-board criteria are stored but never shown. LIMITATIONS: Reserve Component chapters and professional-development-model figures are not imported; career-field-wide rank guidance is attached to every MOS of this guide that has its own chapter.', 'pdf-parse 2.4.5', 'army-600-25-cmf-15-da-pam-600-25-25-aug-26@2026-10-18', '58e4267a2ec96d4d471a0d1161fab4508f14e439cd8040f707c3e253b8eddea6')
on conflict (id) do update set
  publication_number = excluded.publication_number, title = excluded.title, career_field = excluded.career_field, proponent = excluded.proponent,
  official_url = excluded.official_url, publication_date = excluded.publication_date, last_checked_at = excluded.last_checked_at,
  checksum_sha256 = excluded.checksum_sha256, ingestion_status = 'extracted', notes = excluded.notes,
  extraction_tool = excluded.extraction_tool, import_batch = excluded.import_batch,
  branch = excluded.branch, personnel_category = excluded.personnel_category,
  chapter = excluded.chapter, effective_date = excluded.effective_date,
  content_sha256 = excluded.content_sha256,
  review_status = 'unreviewed', reviewed_by = null, reviewed_at = null;
delete from public.reference_passages where source_id = '9433b0a6-e0a0-5949-9008-8bd17a1eaefe';
insert into public.reference_passages
  (id, source_id, branch, personnel_category, occupation_code, occupation_title, section_type, rank_band, components, heading, chapter, body, body_sha256, pdf_page_start, pdf_page_end, printed_page, sort_order, effective_from, effective_to, cumulative, skill_level)
values
  ('701a2ede-8d90-56cc-b808-59e87f7ddb23', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15B', null, 'promotion_criteria', null, null, 'Qualification indicators (promotion consideration)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', 'b. Most Qualified Indicators (SSG and SFC)
(1) Key Development Positions: 30-36 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Distinguished Honor Graduate, Honor Graduate, or Commandant List. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Working towards a completed associate''s degree. Obtaining Federal Aviation Administration (FAA) sponsored certificates and other MOS- related certifications from the COOL website.
b. SFC: Completed associate''s degree and working towards a bachelor''s degree. Obtaining FAA sponsored certificates and other MOS-related certifications.
c. All Ranks: Distinguished Leader Award, Lean Six Sigma Black Belt.
(4) Physical Fitness: AFT score of 450 or above, with a score of 90 in each event, without event substitution. NCOs on permanent profile should strive to reach 80 points in participable events.
(5) Training: (Completing two or more courses, a pattern of consistently completing military training is recommended)
a. SSG: Battle Staff, Mission Command Digital Master Gunner Course, Equal Opportunity Leaders (EOL) Course, Sexual Harassment/Assault Response & Prevention (SHARP) Level I, Health and Holistic Fitness Integrator Course (H2F-I).
b. SFC: Army Knowledge Management Qualification Course, Battle Staff, Mission Command Digital Master Gunner Course.
(6) Assignments:
a. SSG: Drill Sergeant, CTC Observer/Coach Trainer, Special Mission Unit, Special Operations Aviation.
b. SFC: Senior Drill Sergeant, Small Group Leader, Aviation Proponent NCO, Talent Manager NCO, Special Mission Unit, Special Operations Aviation.
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(7) Other Indicators: Expert Soldier Badge, Iron Sergeant, SGT Audie Murphy Club Inductee, SGT Morales Club Inductee, Military Outstanding Volunteer Service Medal (MOVSM), Army Best Squad of the Year, Drill Sergeant of the Year, NCO of the Year, Trainer of the Year (AAAA Functional Award), James H. McClellan Safety (AAAA National Award), Rodney J.T. Yano Non-Commissioned Officer of the Year (AAAA National Award), Gary G. Wetzel Army Aviation Soldier of the Year (AAAA National Award), Master Army Instructor Badge (MAIB), Army Gold Recruiter Badge, Professional Military Writing for peer reviewed articles (Published).
c. Highly Qualified Indicators (SSG and SFC)
(1) (1) Key Development Positions: 24-30 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Recognition for achieving Superior Academic Achievement. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Obtaining FAA sponsored certificates and other MOS-related certifications.
b. SFC: Working towards an associate''s degree and obtaining FAA sponsored certificates.
c. All Ranks: Lean Six Sigma Green or Yellow Belt.
(1) Physical Fitness: AFT score of 400 or above, with a score of 80 in each event, without event substitution.
(2) Training: (Completing one or more courses, a pattern of consistently completing military training is recommended)
a. SSG: SERE-C, Ranger, Airborne, Air Assault.
b. SFC: SHARP Intermediate Course Graduate, Equal Opportunity Leader (EOL) Course, Health and Holistic Fitness Integrator Course (H2F-I). Airborne, Air Assault, SERE-C, Ranger.
(3) Assignments:
a. SSG: Recruiter, Small Group Leader, Instructor, Training Developer, Doctrine Developer
b. SFC: Recruiter, Training Developer, Doctrine Developer, Test and Evaluation NCO
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(4) Other Indicators: Order of St. Michael, NCOA Individual Physical Fitness Award, Senior Army Instructor Badge (SAIB), Drill Sergeant Leader, NCO of the Quarter, Army Silver Recruiter Badge.
d. Most Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 24+ months as a First Sergeant (most critical), Senior Aviation Operations Sergeant, or Air Traffic Control (ATC) Operations Chief.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) How the Army Runs, Capabilities Development, Manpower and Force Management, Army Knowledge Management, Battle Staff, Mission Command Digital Master Gunner, SHARP Intermediate, EOL, Health and Holistic Fitness Integrator Course (H2F-I), Airborne, Air Assault, SERE-C, Ranger.
(6) Assignments: Maximum of 36 months as an Equal Opportunity Advisor, Senior DARR NCO, Assistant Commandant, Proponent NCO, or Talent Management NCO. MSG/1SG within Special Mission Units will have completed 60 months within SMU and possess either SQI “C” or “T” with high enumerations not necessarily consecutive
e. Highly Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 18-24 months as a First Sergeant, Senior Aviation Operations Sergeant, or ATC Operations Chief.
(2) PME: Recognition for achieving Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified."
(6) Assignments: Maximum of 36 months in broadening roles with mid-level enumerations.
f. Most Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 24+ months as a Command Sergeant Major or Operations Sergeant Major.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a master''s degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc
g. Highly Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 18-24 months as a Command Sergeant Major or Operations Sergeant Major with mid-level enumerations.
(2) PME: Recognition for Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc.', 'b802e09ac7ec68111626627b291fb97face87a25b2a025a264b29e4e59b4e057', 2, 5, null, 0, null, null, false, null),
  ('6bfa2d9e-9bd1-5a8d-b111-1ab2c5dcc3a6', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15B', null, 'development', 'E-1..E-4', null, 'Private (PVT) E–1 to Specialist/Corporal (SPC/CPL) E-4 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Individual Training.
(2) Military Study: Master AR 670–1; STP 21–1–SMCT; TM 1-1500-204-23; ATP 3- 04.1; ATP 3-04.7; ADP 6-22; TC 3-04.71; TC 4-02.1; TC 7-22.7, and all unit-level maintenance manuals.
(3) PME: Seize the first opportunity to attend Basic Leaders Course (BLC) upon promotion to Specialist/E4.
(4) Civilian Education: Explore CLEP and DANTES; enroll in ArmyIgnitED to earn credits towards a degree (goal: 120 credits over a career). Obtain FAA and other MOS-related certifications.
(5) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(6) Training: SERE-C, Airborne, Air Assault, Ranger.', 'e2d474cdfce5b4725de655b9bf83245322fdaf1d3dbcdf360f4a3ac2b09b3564', 5, 5, null, 1, null, null, false, null),
  ('39c1658e-2a2b-5b62-a62c-7274059d84d3', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15B', null, 'development', 'E-5', null, 'Sergeant (SGT) E-5 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Basic Leaders Course.
(2) Military Study: Master TC 7-22.7; ADP 6-22; STP 21–24–SMCT (Warrior Leader Skill Levels 2, 3, and 4); FM 6–22 Army Leadership, and all -10 level maintenance manuals.
(3) Development Focus: Self-motivated development becomes critical. Focus on broadening management and doctrinal knowledge (organizational behavior, personnel management, time management, Army OPS).
(4) PME: Strive for recognition as a Distinguished Honor Graduate, Honor Graduate, or on the Commandant’s List.
(5) Civilian Education: Enroll in a college degree program, pursuing credits towards an associate''s degree, with the career goal of completing a bachelor''s degree.
(6) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(7) Training: SERE-C, Airborne, Air Assault, Ranger, Health and Holistic Fitness Integrator Course (H2F-I).', 'baebad57980ec8a346047c483e0ea1762325cb24e92d3dc3b8f0a50fbe9bdc04', 5, 6, null, 2, null, null, false, null),
  ('ae77985a-ef50-5196-bffd-a14669a64d1e', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15B', null, 'development', 'E-6', null, 'Staff Sergeant (SSG) E-6 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Leaders Course.
(2) Military Study: Master STP 21–24; TC 7-22.7; TC 3-04.71; ADP 6-22; ATP 3- 04.1; ATP 3-04.7.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', 'cd3e7ab3527bdbebe1fea3ef639c7237e62b98616130dd62aa78a87e943253a5', 6, 6, null, 3, null, null, false, null),
  ('52852816-8057-586e-b210-f838250b1845', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15B', null, 'development', 'E-7', null, 'Sergeant First Class (SFC) E-7 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Senior Leaders Course.
(2) Military Study: Master AR 350–1; AR 750–1; ATP 3-04.13; ATP 3-04.1; ADP 6- 22; TC 7-22.7; TC 3-04.07; TC 3-04.11; TC 3-04.71.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', '43f814013258f502e48fa4eb20d1af764bcc15c9c60897d1fca297d1068c9172', 6, 6, null, 4, null, null, false, null),
  ('526c88fe-263a-5989-b836-edef98769b40', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15B', null, 'development', 'E-8', null, 'Master Sergeant/First Sergeant (MSG/1SG) E-8 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Master Leaders Course.
(2) Military Study: Continue mastery of all previous publications and pursue functional courses to understand how the Army runs.
(3) Development Focus: Engage in self-motivated professional reading; hone organizational leadership skills needed to teach, coach, and mentor Soldiers.', '5ba3d4a9c0be3cc4d1dd9b42d237e5ac8f959f468decebfe8d4366e6efb9ec73', 6, 6, null, 5, null, null, false, null),
  ('f3399351-c0e7-5797-b086-ab10d9b600b0', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15B', null, 'development', 'E-9', null, 'Sergeant Major/Command Sergeant Major (SGM/CSM) E-9 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Sergeants Major Academy.
(2) Military Study: Possess outstanding communication and public speaking skills.
(3) Development Focus: Study world politics, geo-political issues (DIMEFIL), and field manuals relating to Army OPS and current battle doctrine.', '9dfdf76e95746dff858bb5fda5a42fb24d829bb2a91373f728a009ede2d1d5ad', 6, 6, null, 6, null, null, false, null),
  ('29e1d2aa-95ab-5ccb-a960-4ddada194472', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15C', null, 'promotion_criteria', null, null, 'Qualification indicators (promotion consideration)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', 'b. Most Qualified Indicators (SSG and SFC)
(1) Key Development Positions: 30-36 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Distinguished Honor Graduate, Honor Graduate, or Commandant List. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Working towards a completed associate''s degree. Obtaining Federal Aviation Administration (FAA) sponsored certificates and other MOS- related certifications from the COOL website.
b. SFC: Completed associate''s degree and working towards a bachelor''s degree. Obtaining FAA sponsored certificates and other MOS-related certifications.
c. All Ranks: Distinguished Leader Award, Lean Six Sigma Black Belt.
(4) Physical Fitness: AFT score of 450 or above, with a score of 90 in each event, without event substitution. NCOs on permanent profile should strive to reach 80 points in participable events.
(5) Training: (Completing two or more courses, a pattern of consistently completing military training is recommended)
a. SSG: Battle Staff, Mission Command Digital Master Gunner Course, Equal Opportunity Leaders (EOL) Course, Sexual Harassment/Assault Response & Prevention (SHARP) Level I, Health and Holistic Fitness Integrator Course (H2F-I).
b. SFC: Army Knowledge Management Qualification Course, Battle Staff, Mission Command Digital Master Gunner Course.
(6) Assignments:
a. SSG: Drill Sergeant, CTC Observer/Coach Trainer, Special Mission Unit, Special Operations Aviation.
b. SFC: Senior Drill Sergeant, Small Group Leader, Aviation Proponent NCO, Talent Manager NCO, Special Mission Unit, Special Operations Aviation.
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(7) Other Indicators: Expert Soldier Badge, Iron Sergeant, SGT Audie Murphy Club Inductee, SGT Morales Club Inductee, Military Outstanding Volunteer Service Medal (MOVSM), Army Best Squad of the Year, Drill Sergeant of the Year, NCO of the Year, Trainer of the Year (AAAA Functional Award), James H. McClellan Safety (AAAA National Award), Rodney J.T. Yano Non-Commissioned Officer of the Year (AAAA National Award), Gary G. Wetzel Army Aviation Soldier of the Year (AAAA National Award), Master Army Instructor Badge (MAIB), Army Gold Recruiter Badge, Professional Military Writing for peer reviewed articles (Published).
c. Highly Qualified Indicators (SSG and SFC)
(1) (1) Key Development Positions: 24-30 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Recognition for achieving Superior Academic Achievement. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Obtaining FAA sponsored certificates and other MOS-related certifications.
b. SFC: Working towards an associate''s degree and obtaining FAA sponsored certificates.
c. All Ranks: Lean Six Sigma Green or Yellow Belt.
(1) Physical Fitness: AFT score of 400 or above, with a score of 80 in each event, without event substitution.
(2) Training: (Completing one or more courses, a pattern of consistently completing military training is recommended)
a. SSG: SERE-C, Ranger, Airborne, Air Assault.
b. SFC: SHARP Intermediate Course Graduate, Equal Opportunity Leader (EOL) Course, Health and Holistic Fitness Integrator Course (H2F-I). Airborne, Air Assault, SERE-C, Ranger.
(3) Assignments:
a. SSG: Recruiter, Small Group Leader, Instructor, Training Developer, Doctrine Developer
b. SFC: Recruiter, Training Developer, Doctrine Developer, Test and Evaluation NCO
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(4) Other Indicators: Order of St. Michael, NCOA Individual Physical Fitness Award, Senior Army Instructor Badge (SAIB), Drill Sergeant Leader, NCO of the Quarter, Army Silver Recruiter Badge.
d. Most Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 24+ months as a First Sergeant (most critical), Senior Aviation Operations Sergeant, or Air Traffic Control (ATC) Operations Chief.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) How the Army Runs, Capabilities Development, Manpower and Force Management, Army Knowledge Management, Battle Staff, Mission Command Digital Master Gunner, SHARP Intermediate, EOL, Health and Holistic Fitness Integrator Course (H2F-I), Airborne, Air Assault, SERE-C, Ranger.
(6) Assignments: Maximum of 36 months as an Equal Opportunity Advisor, Senior DARR NCO, Assistant Commandant, Proponent NCO, or Talent Management NCO. MSG/1SG within Special Mission Units will have completed 60 months within SMU and possess either SQI “C” or “T” with high enumerations not necessarily consecutive
e. Highly Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 18-24 months as a First Sergeant, Senior Aviation Operations Sergeant, or ATC Operations Chief.
(2) PME: Recognition for achieving Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified."
(6) Assignments: Maximum of 36 months in broadening roles with mid-level enumerations.
f. Most Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 24+ months as a Command Sergeant Major or Operations Sergeant Major.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a master''s degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc
g. Highly Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 18-24 months as a Command Sergeant Major or Operations Sergeant Major with mid-level enumerations.
(2) PME: Recognition for Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc.', 'b802e09ac7ec68111626627b291fb97face87a25b2a025a264b29e4e59b4e057', 2, 5, null, 7, null, null, false, null),
  ('acbb16d7-e867-5176-8851-af51bc75f49b', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15C', null, 'development', 'E-1..E-4', null, 'Private (PVT) E–1 to Specialist/Corporal (SPC/CPL) E-4 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Individual Training.
(2) Military Study: Master AR 670–1; STP 21–1–SMCT; TM 1-1500-204-23; ATP 3- 04.1; ATP 3-04.7; ADP 6-22; TC 3-04.71; TC 4-02.1; TC 7-22.7, and all unit-level maintenance manuals.
(3) PME: Seize the first opportunity to attend Basic Leaders Course (BLC) upon promotion to Specialist/E4.
(4) Civilian Education: Explore CLEP and DANTES; enroll in ArmyIgnitED to earn credits towards a degree (goal: 120 credits over a career). Obtain FAA and other MOS-related certifications.
(5) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(6) Training: SERE-C, Airborne, Air Assault, Ranger.', 'e2d474cdfce5b4725de655b9bf83245322fdaf1d3dbcdf360f4a3ac2b09b3564', 5, 5, null, 8, null, null, false, null),
  ('573dea41-1aa5-5bc9-aa08-c0dd5e4aeb42', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15C', null, 'development', 'E-5', null, 'Sergeant (SGT) E-5 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Basic Leaders Course.
(2) Military Study: Master TC 7-22.7; ADP 6-22; STP 21–24–SMCT (Warrior Leader Skill Levels 2, 3, and 4); FM 6–22 Army Leadership, and all -10 level maintenance manuals.
(3) Development Focus: Self-motivated development becomes critical. Focus on broadening management and doctrinal knowledge (organizational behavior, personnel management, time management, Army OPS).
(4) PME: Strive for recognition as a Distinguished Honor Graduate, Honor Graduate, or on the Commandant’s List.
(5) Civilian Education: Enroll in a college degree program, pursuing credits towards an associate''s degree, with the career goal of completing a bachelor''s degree.
(6) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(7) Training: SERE-C, Airborne, Air Assault, Ranger, Health and Holistic Fitness Integrator Course (H2F-I).', 'baebad57980ec8a346047c483e0ea1762325cb24e92d3dc3b8f0a50fbe9bdc04', 5, 6, null, 9, null, null, false, null),
  ('c455f969-72c6-54fa-abc4-db7b21a35c8d', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15C', null, 'development', 'E-6', null, 'Staff Sergeant (SSG) E-6 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Leaders Course.
(2) Military Study: Master STP 21–24; TC 7-22.7; TC 3-04.71; ADP 6-22; ATP 3- 04.1; ATP 3-04.7.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', 'cd3e7ab3527bdbebe1fea3ef639c7237e62b98616130dd62aa78a87e943253a5', 6, 6, null, 10, null, null, false, null),
  ('7e6e941e-f8fa-5d4e-8813-0d9153dca887', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15C', null, 'development', 'E-7', null, 'Sergeant First Class (SFC) E-7 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Senior Leaders Course.
(2) Military Study: Master AR 350–1; AR 750–1; ATP 3-04.13; ATP 3-04.1; ADP 6- 22; TC 7-22.7; TC 3-04.07; TC 3-04.11; TC 3-04.71.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', '43f814013258f502e48fa4eb20d1af764bcc15c9c60897d1fca297d1068c9172', 6, 6, null, 11, null, null, false, null),
  ('596e8255-bff7-54ba-afcf-82b172828c60', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15C', null, 'development', 'E-8', null, 'Master Sergeant/First Sergeant (MSG/1SG) E-8 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Master Leaders Course.
(2) Military Study: Continue mastery of all previous publications and pursue functional courses to understand how the Army runs.
(3) Development Focus: Engage in self-motivated professional reading; hone organizational leadership skills needed to teach, coach, and mentor Soldiers.', '5ba3d4a9c0be3cc4d1dd9b42d237e5ac8f959f468decebfe8d4366e6efb9ec73', 6, 6, null, 12, null, null, false, null),
  ('23b69bb5-59a0-5092-a9c4-bf518eb9b918', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15C', null, 'development', 'E-9', null, 'Sergeant Major/Command Sergeant Major (SGM/CSM) E-9 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Sergeants Major Academy.
(2) Military Study: Possess outstanding communication and public speaking skills.
(3) Development Focus: Study world politics, geo-political issues (DIMEFIL), and field manuals relating to Army OPS and current battle doctrine.', '9dfdf76e95746dff858bb5fda5a42fb24d829bb2a91373f728a009ede2d1d5ad', 6, 6, null, 13, null, null, false, null),
  ('299474f4-07bd-5f29-9430-084bbb79574a', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15D', null, 'promotion_criteria', null, null, 'Qualification indicators (promotion consideration)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', 'b. Most Qualified Indicators (SSG and SFC)
(1) Key Development Positions: 30-36 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Distinguished Honor Graduate, Honor Graduate, or Commandant List. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Working towards a completed associate''s degree. Obtaining Federal Aviation Administration (FAA) sponsored certificates and other MOS- related certifications from the COOL website.
b. SFC: Completed associate''s degree and working towards a bachelor''s degree. Obtaining FAA sponsored certificates and other MOS-related certifications.
c. All Ranks: Distinguished Leader Award, Lean Six Sigma Black Belt.
(4) Physical Fitness: AFT score of 450 or above, with a score of 90 in each event, without event substitution. NCOs on permanent profile should strive to reach 80 points in participable events.
(5) Training: (Completing two or more courses, a pattern of consistently completing military training is recommended)
a. SSG: Battle Staff, Mission Command Digital Master Gunner Course, Equal Opportunity Leaders (EOL) Course, Sexual Harassment/Assault Response & Prevention (SHARP) Level I, Health and Holistic Fitness Integrator Course (H2F-I).
b. SFC: Army Knowledge Management Qualification Course, Battle Staff, Mission Command Digital Master Gunner Course.
(6) Assignments:
a. SSG: Drill Sergeant, CTC Observer/Coach Trainer, Special Mission Unit, Special Operations Aviation.
b. SFC: Senior Drill Sergeant, Small Group Leader, Aviation Proponent NCO, Talent Manager NCO, Special Mission Unit, Special Operations Aviation.
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(7) Other Indicators: Expert Soldier Badge, Iron Sergeant, SGT Audie Murphy Club Inductee, SGT Morales Club Inductee, Military Outstanding Volunteer Service Medal (MOVSM), Army Best Squad of the Year, Drill Sergeant of the Year, NCO of the Year, Trainer of the Year (AAAA Functional Award), James H. McClellan Safety (AAAA National Award), Rodney J.T. Yano Non-Commissioned Officer of the Year (AAAA National Award), Gary G. Wetzel Army Aviation Soldier of the Year (AAAA National Award), Master Army Instructor Badge (MAIB), Army Gold Recruiter Badge, Professional Military Writing for peer reviewed articles (Published).
c. Highly Qualified Indicators (SSG and SFC)
(1) (1) Key Development Positions: 24-30 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Recognition for achieving Superior Academic Achievement. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Obtaining FAA sponsored certificates and other MOS-related certifications.
b. SFC: Working towards an associate''s degree and obtaining FAA sponsored certificates.
c. All Ranks: Lean Six Sigma Green or Yellow Belt.
(1) Physical Fitness: AFT score of 400 or above, with a score of 80 in each event, without event substitution.
(2) Training: (Completing one or more courses, a pattern of consistently completing military training is recommended)
a. SSG: SERE-C, Ranger, Airborne, Air Assault.
b. SFC: SHARP Intermediate Course Graduate, Equal Opportunity Leader (EOL) Course, Health and Holistic Fitness Integrator Course (H2F-I). Airborne, Air Assault, SERE-C, Ranger.
(3) Assignments:
a. SSG: Recruiter, Small Group Leader, Instructor, Training Developer, Doctrine Developer
b. SFC: Recruiter, Training Developer, Doctrine Developer, Test and Evaluation NCO
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(4) Other Indicators: Order of St. Michael, NCOA Individual Physical Fitness Award, Senior Army Instructor Badge (SAIB), Drill Sergeant Leader, NCO of the Quarter, Army Silver Recruiter Badge.
d. Most Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 24+ months as a First Sergeant (most critical), Senior Aviation Operations Sergeant, or Air Traffic Control (ATC) Operations Chief.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) How the Army Runs, Capabilities Development, Manpower and Force Management, Army Knowledge Management, Battle Staff, Mission Command Digital Master Gunner, SHARP Intermediate, EOL, Health and Holistic Fitness Integrator Course (H2F-I), Airborne, Air Assault, SERE-C, Ranger.
(6) Assignments: Maximum of 36 months as an Equal Opportunity Advisor, Senior DARR NCO, Assistant Commandant, Proponent NCO, or Talent Management NCO. MSG/1SG within Special Mission Units will have completed 60 months within SMU and possess either SQI “C” or “T” with high enumerations not necessarily consecutive
e. Highly Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 18-24 months as a First Sergeant, Senior Aviation Operations Sergeant, or ATC Operations Chief.
(2) PME: Recognition for achieving Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified."
(6) Assignments: Maximum of 36 months in broadening roles with mid-level enumerations.
f. Most Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 24+ months as a Command Sergeant Major or Operations Sergeant Major.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a master''s degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc
g. Highly Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 18-24 months as a Command Sergeant Major or Operations Sergeant Major with mid-level enumerations.
(2) PME: Recognition for Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc.', 'b802e09ac7ec68111626627b291fb97face87a25b2a025a264b29e4e59b4e057', 2, 5, null, 14, null, null, false, null),
  ('8aeb2b89-8387-58db-ba02-a18cf2a06eed', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15D', null, 'development', 'E-1..E-4', null, 'Private (PVT) E–1 to Specialist/Corporal (SPC/CPL) E-4 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Individual Training.
(2) Military Study: Master AR 670–1; STP 21–1–SMCT; TM 1-1500-204-23; ATP 3- 04.1; ATP 3-04.7; ADP 6-22; TC 3-04.71; TC 4-02.1; TC 7-22.7, and all unit-level maintenance manuals.
(3) PME: Seize the first opportunity to attend Basic Leaders Course (BLC) upon promotion to Specialist/E4.
(4) Civilian Education: Explore CLEP and DANTES; enroll in ArmyIgnitED to earn credits towards a degree (goal: 120 credits over a career). Obtain FAA and other MOS-related certifications.
(5) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(6) Training: SERE-C, Airborne, Air Assault, Ranger.', 'e2d474cdfce5b4725de655b9bf83245322fdaf1d3dbcdf360f4a3ac2b09b3564', 5, 5, null, 15, null, null, false, null),
  ('40d8d785-67a3-578b-a6bf-4b277bd61688', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15D', null, 'development', 'E-5', null, 'Sergeant (SGT) E-5 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Basic Leaders Course.
(2) Military Study: Master TC 7-22.7; ADP 6-22; STP 21–24–SMCT (Warrior Leader Skill Levels 2, 3, and 4); FM 6–22 Army Leadership, and all -10 level maintenance manuals.
(3) Development Focus: Self-motivated development becomes critical. Focus on broadening management and doctrinal knowledge (organizational behavior, personnel management, time management, Army OPS).
(4) PME: Strive for recognition as a Distinguished Honor Graduate, Honor Graduate, or on the Commandant’s List.
(5) Civilian Education: Enroll in a college degree program, pursuing credits towards an associate''s degree, with the career goal of completing a bachelor''s degree.
(6) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(7) Training: SERE-C, Airborne, Air Assault, Ranger, Health and Holistic Fitness Integrator Course (H2F-I).', 'baebad57980ec8a346047c483e0ea1762325cb24e92d3dc3b8f0a50fbe9bdc04', 5, 6, null, 16, null, null, false, null),
  ('30261031-8522-592d-a940-5cfc0e37dcf0', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15D', null, 'development', 'E-6', null, 'Staff Sergeant (SSG) E-6 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Leaders Course.
(2) Military Study: Master STP 21–24; TC 7-22.7; TC 3-04.71; ADP 6-22; ATP 3- 04.1; ATP 3-04.7.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', 'cd3e7ab3527bdbebe1fea3ef639c7237e62b98616130dd62aa78a87e943253a5', 6, 6, null, 17, null, null, false, null),
  ('5cb60011-6c34-55ee-88a6-7ad268c6fd6c', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15D', null, 'development', 'E-7', null, 'Sergeant First Class (SFC) E-7 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Senior Leaders Course.
(2) Military Study: Master AR 350–1; AR 750–1; ATP 3-04.13; ATP 3-04.1; ADP 6- 22; TC 7-22.7; TC 3-04.07; TC 3-04.11; TC 3-04.71.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', '43f814013258f502e48fa4eb20d1af764bcc15c9c60897d1fca297d1068c9172', 6, 6, null, 18, null, null, false, null),
  ('9782c0e1-bd05-5d86-9b36-862c5987d07e', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15D', null, 'development', 'E-8', null, 'Master Sergeant/First Sergeant (MSG/1SG) E-8 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Master Leaders Course.
(2) Military Study: Continue mastery of all previous publications and pursue functional courses to understand how the Army runs.
(3) Development Focus: Engage in self-motivated professional reading; hone organizational leadership skills needed to teach, coach, and mentor Soldiers.', '5ba3d4a9c0be3cc4d1dd9b42d237e5ac8f959f468decebfe8d4366e6efb9ec73', 6, 6, null, 19, null, null, false, null),
  ('d67d7a69-2fa9-56b2-b658-7e5409ca3815', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15D', null, 'development', 'E-9', null, 'Sergeant Major/Command Sergeant Major (SGM/CSM) E-9 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Sergeants Major Academy.
(2) Military Study: Possess outstanding communication and public speaking skills.
(3) Development Focus: Study world politics, geo-political issues (DIMEFIL), and field manuals relating to Army OPS and current battle doctrine.', '9dfdf76e95746dff858bb5fda5a42fb24d829bb2a91373f728a009ede2d1d5ad', 6, 6, null, 20, null, null, false, null),
  ('0bf99df6-7cfa-5ced-96ff-7df4f62dfdc3', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15F', null, 'promotion_criteria', null, null, 'Qualification indicators (promotion consideration)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', 'b. Most Qualified Indicators (SSG and SFC)
(1) Key Development Positions: 30-36 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Distinguished Honor Graduate, Honor Graduate, or Commandant List. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Working towards a completed associate''s degree. Obtaining Federal Aviation Administration (FAA) sponsored certificates and other MOS- related certifications from the COOL website.
b. SFC: Completed associate''s degree and working towards a bachelor''s degree. Obtaining FAA sponsored certificates and other MOS-related certifications.
c. All Ranks: Distinguished Leader Award, Lean Six Sigma Black Belt.
(4) Physical Fitness: AFT score of 450 or above, with a score of 90 in each event, without event substitution. NCOs on permanent profile should strive to reach 80 points in participable events.
(5) Training: (Completing two or more courses, a pattern of consistently completing military training is recommended)
a. SSG: Battle Staff, Mission Command Digital Master Gunner Course, Equal Opportunity Leaders (EOL) Course, Sexual Harassment/Assault Response & Prevention (SHARP) Level I, Health and Holistic Fitness Integrator Course (H2F-I).
b. SFC: Army Knowledge Management Qualification Course, Battle Staff, Mission Command Digital Master Gunner Course.
(6) Assignments:
a. SSG: Drill Sergeant, CTC Observer/Coach Trainer, Special Mission Unit, Special Operations Aviation.
b. SFC: Senior Drill Sergeant, Small Group Leader, Aviation Proponent NCO, Talent Manager NCO, Special Mission Unit, Special Operations Aviation.
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(7) Other Indicators: Expert Soldier Badge, Iron Sergeant, SGT Audie Murphy Club Inductee, SGT Morales Club Inductee, Military Outstanding Volunteer Service Medal (MOVSM), Army Best Squad of the Year, Drill Sergeant of the Year, NCO of the Year, Trainer of the Year (AAAA Functional Award), James H. McClellan Safety (AAAA National Award), Rodney J.T. Yano Non-Commissioned Officer of the Year (AAAA National Award), Gary G. Wetzel Army Aviation Soldier of the Year (AAAA National Award), Master Army Instructor Badge (MAIB), Army Gold Recruiter Badge, Professional Military Writing for peer reviewed articles (Published).
c. Highly Qualified Indicators (SSG and SFC)
(1) (1) Key Development Positions: 24-30 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Recognition for achieving Superior Academic Achievement. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Obtaining FAA sponsored certificates and other MOS-related certifications.
b. SFC: Working towards an associate''s degree and obtaining FAA sponsored certificates.
c. All Ranks: Lean Six Sigma Green or Yellow Belt.
(1) Physical Fitness: AFT score of 400 or above, with a score of 80 in each event, without event substitution.
(2) Training: (Completing one or more courses, a pattern of consistently completing military training is recommended)
a. SSG: SERE-C, Ranger, Airborne, Air Assault.
b. SFC: SHARP Intermediate Course Graduate, Equal Opportunity Leader (EOL) Course, Health and Holistic Fitness Integrator Course (H2F-I). Airborne, Air Assault, SERE-C, Ranger.
(3) Assignments:
a. SSG: Recruiter, Small Group Leader, Instructor, Training Developer, Doctrine Developer
b. SFC: Recruiter, Training Developer, Doctrine Developer, Test and Evaluation NCO
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(4) Other Indicators: Order of St. Michael, NCOA Individual Physical Fitness Award, Senior Army Instructor Badge (SAIB), Drill Sergeant Leader, NCO of the Quarter, Army Silver Recruiter Badge.
d. Most Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 24+ months as a First Sergeant (most critical), Senior Aviation Operations Sergeant, or Air Traffic Control (ATC) Operations Chief.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) How the Army Runs, Capabilities Development, Manpower and Force Management, Army Knowledge Management, Battle Staff, Mission Command Digital Master Gunner, SHARP Intermediate, EOL, Health and Holistic Fitness Integrator Course (H2F-I), Airborne, Air Assault, SERE-C, Ranger.
(6) Assignments: Maximum of 36 months as an Equal Opportunity Advisor, Senior DARR NCO, Assistant Commandant, Proponent NCO, or Talent Management NCO. MSG/1SG within Special Mission Units will have completed 60 months within SMU and possess either SQI “C” or “T” with high enumerations not necessarily consecutive
e. Highly Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 18-24 months as a First Sergeant, Senior Aviation Operations Sergeant, or ATC Operations Chief.
(2) PME: Recognition for achieving Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified."
(6) Assignments: Maximum of 36 months in broadening roles with mid-level enumerations.
f. Most Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 24+ months as a Command Sergeant Major or Operations Sergeant Major.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a master''s degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc
g. Highly Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 18-24 months as a Command Sergeant Major or Operations Sergeant Major with mid-level enumerations.
(2) PME: Recognition for Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc.', 'b802e09ac7ec68111626627b291fb97face87a25b2a025a264b29e4e59b4e057', 2, 5, null, 21, null, null, false, null),
  ('868272c9-da53-5963-926d-3aafa71275cd', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15F', null, 'development', 'E-1..E-4', null, 'Private (PVT) E–1 to Specialist/Corporal (SPC/CPL) E-4 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Individual Training.
(2) Military Study: Master AR 670–1; STP 21–1–SMCT; TM 1-1500-204-23; ATP 3- 04.1; ATP 3-04.7; ADP 6-22; TC 3-04.71; TC 4-02.1; TC 7-22.7, and all unit-level maintenance manuals.
(3) PME: Seize the first opportunity to attend Basic Leaders Course (BLC) upon promotion to Specialist/E4.
(4) Civilian Education: Explore CLEP and DANTES; enroll in ArmyIgnitED to earn credits towards a degree (goal: 120 credits over a career). Obtain FAA and other MOS-related certifications.
(5) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(6) Training: SERE-C, Airborne, Air Assault, Ranger.', 'e2d474cdfce5b4725de655b9bf83245322fdaf1d3dbcdf360f4a3ac2b09b3564', 5, 5, null, 22, null, null, false, null),
  ('6c314036-ec49-5c1e-8874-676dda6e0e7a', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15F', null, 'development', 'E-5', null, 'Sergeant (SGT) E-5 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Basic Leaders Course.
(2) Military Study: Master TC 7-22.7; ADP 6-22; STP 21–24–SMCT (Warrior Leader Skill Levels 2, 3, and 4); FM 6–22 Army Leadership, and all -10 level maintenance manuals.
(3) Development Focus: Self-motivated development becomes critical. Focus on broadening management and doctrinal knowledge (organizational behavior, personnel management, time management, Army OPS).
(4) PME: Strive for recognition as a Distinguished Honor Graduate, Honor Graduate, or on the Commandant’s List.
(5) Civilian Education: Enroll in a college degree program, pursuing credits towards an associate''s degree, with the career goal of completing a bachelor''s degree.
(6) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(7) Training: SERE-C, Airborne, Air Assault, Ranger, Health and Holistic Fitness Integrator Course (H2F-I).', 'baebad57980ec8a346047c483e0ea1762325cb24e92d3dc3b8f0a50fbe9bdc04', 5, 6, null, 23, null, null, false, null),
  ('6ee399b6-6030-5d45-93a6-ecf55c37d389', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15F', null, 'development', 'E-6', null, 'Staff Sergeant (SSG) E-6 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Leaders Course.
(2) Military Study: Master STP 21–24; TC 7-22.7; TC 3-04.71; ADP 6-22; ATP 3- 04.1; ATP 3-04.7.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', 'cd3e7ab3527bdbebe1fea3ef639c7237e62b98616130dd62aa78a87e943253a5', 6, 6, null, 24, null, null, false, null),
  ('7d967693-a24a-594f-b4ee-0a0eb42c07ca', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15F', null, 'development', 'E-7', null, 'Sergeant First Class (SFC) E-7 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Senior Leaders Course.
(2) Military Study: Master AR 350–1; AR 750–1; ATP 3-04.13; ATP 3-04.1; ADP 6- 22; TC 7-22.7; TC 3-04.07; TC 3-04.11; TC 3-04.71.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', '43f814013258f502e48fa4eb20d1af764bcc15c9c60897d1fca297d1068c9172', 6, 6, null, 25, null, null, false, null),
  ('e7403d45-9859-505c-97c0-ba6dc4e039d5', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15F', null, 'development', 'E-8', null, 'Master Sergeant/First Sergeant (MSG/1SG) E-8 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Master Leaders Course.
(2) Military Study: Continue mastery of all previous publications and pursue functional courses to understand how the Army runs.
(3) Development Focus: Engage in self-motivated professional reading; hone organizational leadership skills needed to teach, coach, and mentor Soldiers.', '5ba3d4a9c0be3cc4d1dd9b42d237e5ac8f959f468decebfe8d4366e6efb9ec73', 6, 6, null, 26, null, null, false, null),
  ('e4d78bfa-4584-562c-a92c-b1f56cdf814f', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15F', null, 'development', 'E-9', null, 'Sergeant Major/Command Sergeant Major (SGM/CSM) E-9 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Sergeants Major Academy.
(2) Military Study: Possess outstanding communication and public speaking skills.
(3) Development Focus: Study world politics, geo-political issues (DIMEFIL), and field manuals relating to Army OPS and current battle doctrine.', '9dfdf76e95746dff858bb5fda5a42fb24d829bb2a91373f728a009ede2d1d5ad', 6, 6, null, 27, null, null, false, null),
  ('5776dc2b-67fb-5c87-986f-b2c85e92cd67', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15G', null, 'promotion_criteria', null, null, 'Qualification indicators (promotion consideration)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', 'b. Most Qualified Indicators (SSG and SFC)
(1) Key Development Positions: 30-36 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Distinguished Honor Graduate, Honor Graduate, or Commandant List. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Working towards a completed associate''s degree. Obtaining Federal Aviation Administration (FAA) sponsored certificates and other MOS- related certifications from the COOL website.
b. SFC: Completed associate''s degree and working towards a bachelor''s degree. Obtaining FAA sponsored certificates and other MOS-related certifications.
c. All Ranks: Distinguished Leader Award, Lean Six Sigma Black Belt.
(4) Physical Fitness: AFT score of 450 or above, with a score of 90 in each event, without event substitution. NCOs on permanent profile should strive to reach 80 points in participable events.
(5) Training: (Completing two or more courses, a pattern of consistently completing military training is recommended)
a. SSG: Battle Staff, Mission Command Digital Master Gunner Course, Equal Opportunity Leaders (EOL) Course, Sexual Harassment/Assault Response & Prevention (SHARP) Level I, Health and Holistic Fitness Integrator Course (H2F-I).
b. SFC: Army Knowledge Management Qualification Course, Battle Staff, Mission Command Digital Master Gunner Course.
(6) Assignments:
a. SSG: Drill Sergeant, CTC Observer/Coach Trainer, Special Mission Unit, Special Operations Aviation.
b. SFC: Senior Drill Sergeant, Small Group Leader, Aviation Proponent NCO, Talent Manager NCO, Special Mission Unit, Special Operations Aviation.
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(7) Other Indicators: Expert Soldier Badge, Iron Sergeant, SGT Audie Murphy Club Inductee, SGT Morales Club Inductee, Military Outstanding Volunteer Service Medal (MOVSM), Army Best Squad of the Year, Drill Sergeant of the Year, NCO of the Year, Trainer of the Year (AAAA Functional Award), James H. McClellan Safety (AAAA National Award), Rodney J.T. Yano Non-Commissioned Officer of the Year (AAAA National Award), Gary G. Wetzel Army Aviation Soldier of the Year (AAAA National Award), Master Army Instructor Badge (MAIB), Army Gold Recruiter Badge, Professional Military Writing for peer reviewed articles (Published).
c. Highly Qualified Indicators (SSG and SFC)
(1) (1) Key Development Positions: 24-30 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Recognition for achieving Superior Academic Achievement. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Obtaining FAA sponsored certificates and other MOS-related certifications.
b. SFC: Working towards an associate''s degree and obtaining FAA sponsored certificates.
c. All Ranks: Lean Six Sigma Green or Yellow Belt.
(1) Physical Fitness: AFT score of 400 or above, with a score of 80 in each event, without event substitution.
(2) Training: (Completing one or more courses, a pattern of consistently completing military training is recommended)
a. SSG: SERE-C, Ranger, Airborne, Air Assault.
b. SFC: SHARP Intermediate Course Graduate, Equal Opportunity Leader (EOL) Course, Health and Holistic Fitness Integrator Course (H2F-I). Airborne, Air Assault, SERE-C, Ranger.
(3) Assignments:
a. SSG: Recruiter, Small Group Leader, Instructor, Training Developer, Doctrine Developer
b. SFC: Recruiter, Training Developer, Doctrine Developer, Test and Evaluation NCO
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(4) Other Indicators: Order of St. Michael, NCOA Individual Physical Fitness Award, Senior Army Instructor Badge (SAIB), Drill Sergeant Leader, NCO of the Quarter, Army Silver Recruiter Badge.
d. Most Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 24+ months as a First Sergeant (most critical), Senior Aviation Operations Sergeant, or Air Traffic Control (ATC) Operations Chief.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) How the Army Runs, Capabilities Development, Manpower and Force Management, Army Knowledge Management, Battle Staff, Mission Command Digital Master Gunner, SHARP Intermediate, EOL, Health and Holistic Fitness Integrator Course (H2F-I), Airborne, Air Assault, SERE-C, Ranger.
(6) Assignments: Maximum of 36 months as an Equal Opportunity Advisor, Senior DARR NCO, Assistant Commandant, Proponent NCO, or Talent Management NCO. MSG/1SG within Special Mission Units will have completed 60 months within SMU and possess either SQI “C” or “T” with high enumerations not necessarily consecutive
e. Highly Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 18-24 months as a First Sergeant, Senior Aviation Operations Sergeant, or ATC Operations Chief.
(2) PME: Recognition for achieving Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified."
(6) Assignments: Maximum of 36 months in broadening roles with mid-level enumerations.
f. Most Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 24+ months as a Command Sergeant Major or Operations Sergeant Major.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a master''s degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc
g. Highly Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 18-24 months as a Command Sergeant Major or Operations Sergeant Major with mid-level enumerations.
(2) PME: Recognition for Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc.', 'b802e09ac7ec68111626627b291fb97face87a25b2a025a264b29e4e59b4e057', 2, 5, null, 28, null, null, false, null),
  ('2f2bd63e-bfac-5148-bf52-3c8fd2732fcb', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15G', null, 'development', 'E-1..E-4', null, 'Private (PVT) E–1 to Specialist/Corporal (SPC/CPL) E-4 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Individual Training.
(2) Military Study: Master AR 670–1; STP 21–1–SMCT; TM 1-1500-204-23; ATP 3- 04.1; ATP 3-04.7; ADP 6-22; TC 3-04.71; TC 4-02.1; TC 7-22.7, and all unit-level maintenance manuals.
(3) PME: Seize the first opportunity to attend Basic Leaders Course (BLC) upon promotion to Specialist/E4.
(4) Civilian Education: Explore CLEP and DANTES; enroll in ArmyIgnitED to earn credits towards a degree (goal: 120 credits over a career). Obtain FAA and other MOS-related certifications.
(5) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(6) Training: SERE-C, Airborne, Air Assault, Ranger.', 'e2d474cdfce5b4725de655b9bf83245322fdaf1d3dbcdf360f4a3ac2b09b3564', 5, 5, null, 29, null, null, false, null),
  ('ae99ce1c-b358-57ac-a337-70c7f5130fef', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15G', null, 'development', 'E-5', null, 'Sergeant (SGT) E-5 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Basic Leaders Course.
(2) Military Study: Master TC 7-22.7; ADP 6-22; STP 21–24–SMCT (Warrior Leader Skill Levels 2, 3, and 4); FM 6–22 Army Leadership, and all -10 level maintenance manuals.
(3) Development Focus: Self-motivated development becomes critical. Focus on broadening management and doctrinal knowledge (organizational behavior, personnel management, time management, Army OPS).
(4) PME: Strive for recognition as a Distinguished Honor Graduate, Honor Graduate, or on the Commandant’s List.
(5) Civilian Education: Enroll in a college degree program, pursuing credits towards an associate''s degree, with the career goal of completing a bachelor''s degree.
(6) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(7) Training: SERE-C, Airborne, Air Assault, Ranger, Health and Holistic Fitness Integrator Course (H2F-I).', 'baebad57980ec8a346047c483e0ea1762325cb24e92d3dc3b8f0a50fbe9bdc04', 5, 6, null, 30, null, null, false, null),
  ('ea4057ca-0b74-5fc9-b171-0188f6c3b929', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15G', null, 'development', 'E-6', null, 'Staff Sergeant (SSG) E-6 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Leaders Course.
(2) Military Study: Master STP 21–24; TC 7-22.7; TC 3-04.71; ADP 6-22; ATP 3- 04.1; ATP 3-04.7.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', 'cd3e7ab3527bdbebe1fea3ef639c7237e62b98616130dd62aa78a87e943253a5', 6, 6, null, 31, null, null, false, null),
  ('8e9a0c88-0226-5987-bfda-70aa75c4695e', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15G', null, 'development', 'E-7', null, 'Sergeant First Class (SFC) E-7 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Senior Leaders Course.
(2) Military Study: Master AR 350–1; AR 750–1; ATP 3-04.13; ATP 3-04.1; ADP 6- 22; TC 7-22.7; TC 3-04.07; TC 3-04.11; TC 3-04.71.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', '43f814013258f502e48fa4eb20d1af764bcc15c9c60897d1fca297d1068c9172', 6, 6, null, 32, null, null, false, null),
  ('04a7d756-37dc-58d1-967d-5efb1ef5f714', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15G', null, 'development', 'E-8', null, 'Master Sergeant/First Sergeant (MSG/1SG) E-8 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Master Leaders Course.
(2) Military Study: Continue mastery of all previous publications and pursue functional courses to understand how the Army runs.
(3) Development Focus: Engage in self-motivated professional reading; hone organizational leadership skills needed to teach, coach, and mentor Soldiers.', '5ba3d4a9c0be3cc4d1dd9b42d237e5ac8f959f468decebfe8d4366e6efb9ec73', 6, 6, null, 33, null, null, false, null),
  ('9a73173b-9c82-5413-8ae8-a4ce7e020b67', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15G', null, 'development', 'E-9', null, 'Sergeant Major/Command Sergeant Major (SGM/CSM) E-9 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Sergeants Major Academy.
(2) Military Study: Possess outstanding communication and public speaking skills.
(3) Development Focus: Study world politics, geo-political issues (DIMEFIL), and field manuals relating to Army OPS and current battle doctrine.', '9dfdf76e95746dff858bb5fda5a42fb24d829bb2a91373f728a009ede2d1d5ad', 6, 6, null, 34, null, null, false, null),
  ('858791ff-28f9-5738-961b-d0a8a04ef54e', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15H', null, 'promotion_criteria', null, null, 'Qualification indicators (promotion consideration)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', 'b. Most Qualified Indicators (SSG and SFC)
(1) Key Development Positions: 30-36 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Distinguished Honor Graduate, Honor Graduate, or Commandant List. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Working towards a completed associate''s degree. Obtaining Federal Aviation Administration (FAA) sponsored certificates and other MOS- related certifications from the COOL website.
b. SFC: Completed associate''s degree and working towards a bachelor''s degree. Obtaining FAA sponsored certificates and other MOS-related certifications.
c. All Ranks: Distinguished Leader Award, Lean Six Sigma Black Belt.
(4) Physical Fitness: AFT score of 450 or above, with a score of 90 in each event, without event substitution. NCOs on permanent profile should strive to reach 80 points in participable events.
(5) Training: (Completing two or more courses, a pattern of consistently completing military training is recommended)
a. SSG: Battle Staff, Mission Command Digital Master Gunner Course, Equal Opportunity Leaders (EOL) Course, Sexual Harassment/Assault Response & Prevention (SHARP) Level I, Health and Holistic Fitness Integrator Course (H2F-I).
b. SFC: Army Knowledge Management Qualification Course, Battle Staff, Mission Command Digital Master Gunner Course.
(6) Assignments:
a. SSG: Drill Sergeant, CTC Observer/Coach Trainer, Special Mission Unit, Special Operations Aviation.
b. SFC: Senior Drill Sergeant, Small Group Leader, Aviation Proponent NCO, Talent Manager NCO, Special Mission Unit, Special Operations Aviation.
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(7) Other Indicators: Expert Soldier Badge, Iron Sergeant, SGT Audie Murphy Club Inductee, SGT Morales Club Inductee, Military Outstanding Volunteer Service Medal (MOVSM), Army Best Squad of the Year, Drill Sergeant of the Year, NCO of the Year, Trainer of the Year (AAAA Functional Award), James H. McClellan Safety (AAAA National Award), Rodney J.T. Yano Non-Commissioned Officer of the Year (AAAA National Award), Gary G. Wetzel Army Aviation Soldier of the Year (AAAA National Award), Master Army Instructor Badge (MAIB), Army Gold Recruiter Badge, Professional Military Writing for peer reviewed articles (Published).
c. Highly Qualified Indicators (SSG and SFC)
(1) (1) Key Development Positions: 24-30 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Recognition for achieving Superior Academic Achievement. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Obtaining FAA sponsored certificates and other MOS-related certifications.
b. SFC: Working towards an associate''s degree and obtaining FAA sponsored certificates.
c. All Ranks: Lean Six Sigma Green or Yellow Belt.
(1) Physical Fitness: AFT score of 400 or above, with a score of 80 in each event, without event substitution.
(2) Training: (Completing one or more courses, a pattern of consistently completing military training is recommended)
a. SSG: SERE-C, Ranger, Airborne, Air Assault.
b. SFC: SHARP Intermediate Course Graduate, Equal Opportunity Leader (EOL) Course, Health and Holistic Fitness Integrator Course (H2F-I). Airborne, Air Assault, SERE-C, Ranger.
(3) Assignments:
a. SSG: Recruiter, Small Group Leader, Instructor, Training Developer, Doctrine Developer
b. SFC: Recruiter, Training Developer, Doctrine Developer, Test and Evaluation NCO
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(4) Other Indicators: Order of St. Michael, NCOA Individual Physical Fitness Award, Senior Army Instructor Badge (SAIB), Drill Sergeant Leader, NCO of the Quarter, Army Silver Recruiter Badge.
d. Most Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 24+ months as a First Sergeant (most critical), Senior Aviation Operations Sergeant, or Air Traffic Control (ATC) Operations Chief.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) How the Army Runs, Capabilities Development, Manpower and Force Management, Army Knowledge Management, Battle Staff, Mission Command Digital Master Gunner, SHARP Intermediate, EOL, Health and Holistic Fitness Integrator Course (H2F-I), Airborne, Air Assault, SERE-C, Ranger.
(6) Assignments: Maximum of 36 months as an Equal Opportunity Advisor, Senior DARR NCO, Assistant Commandant, Proponent NCO, or Talent Management NCO. MSG/1SG within Special Mission Units will have completed 60 months within SMU and possess either SQI “C” or “T” with high enumerations not necessarily consecutive
e. Highly Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 18-24 months as a First Sergeant, Senior Aviation Operations Sergeant, or ATC Operations Chief.
(2) PME: Recognition for achieving Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified."
(6) Assignments: Maximum of 36 months in broadening roles with mid-level enumerations.
f. Most Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 24+ months as a Command Sergeant Major or Operations Sergeant Major.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a master''s degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc
g. Highly Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 18-24 months as a Command Sergeant Major or Operations Sergeant Major with mid-level enumerations.
(2) PME: Recognition for Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc.', 'b802e09ac7ec68111626627b291fb97face87a25b2a025a264b29e4e59b4e057', 2, 5, null, 35, null, null, false, null),
  ('d9c3bb2e-879a-5aa1-aa45-de2f5c96ed7a', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15H', null, 'development', 'E-1..E-4', null, 'Private (PVT) E–1 to Specialist/Corporal (SPC/CPL) E-4 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Individual Training.
(2) Military Study: Master AR 670–1; STP 21–1–SMCT; TM 1-1500-204-23; ATP 3- 04.1; ATP 3-04.7; ADP 6-22; TC 3-04.71; TC 4-02.1; TC 7-22.7, and all unit-level maintenance manuals.
(3) PME: Seize the first opportunity to attend Basic Leaders Course (BLC) upon promotion to Specialist/E4.
(4) Civilian Education: Explore CLEP and DANTES; enroll in ArmyIgnitED to earn credits towards a degree (goal: 120 credits over a career). Obtain FAA and other MOS-related certifications.
(5) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(6) Training: SERE-C, Airborne, Air Assault, Ranger.', 'e2d474cdfce5b4725de655b9bf83245322fdaf1d3dbcdf360f4a3ac2b09b3564', 5, 5, null, 36, null, null, false, null),
  ('9308cd39-851f-58f0-9921-765bdebdd325', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15H', null, 'development', 'E-5', null, 'Sergeant (SGT) E-5 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Basic Leaders Course.
(2) Military Study: Master TC 7-22.7; ADP 6-22; STP 21–24–SMCT (Warrior Leader Skill Levels 2, 3, and 4); FM 6–22 Army Leadership, and all -10 level maintenance manuals.
(3) Development Focus: Self-motivated development becomes critical. Focus on broadening management and doctrinal knowledge (organizational behavior, personnel management, time management, Army OPS).
(4) PME: Strive for recognition as a Distinguished Honor Graduate, Honor Graduate, or on the Commandant’s List.
(5) Civilian Education: Enroll in a college degree program, pursuing credits towards an associate''s degree, with the career goal of completing a bachelor''s degree.
(6) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(7) Training: SERE-C, Airborne, Air Assault, Ranger, Health and Holistic Fitness Integrator Course (H2F-I).', 'baebad57980ec8a346047c483e0ea1762325cb24e92d3dc3b8f0a50fbe9bdc04', 5, 6, null, 37, null, null, false, null),
  ('f38d5c83-ff62-5b83-a4c9-d5674c08ca13', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15H', null, 'development', 'E-6', null, 'Staff Sergeant (SSG) E-6 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Leaders Course.
(2) Military Study: Master STP 21–24; TC 7-22.7; TC 3-04.71; ADP 6-22; ATP 3- 04.1; ATP 3-04.7.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', 'cd3e7ab3527bdbebe1fea3ef639c7237e62b98616130dd62aa78a87e943253a5', 6, 6, null, 38, null, null, false, null),
  ('d13c9e3c-8818-51d4-8c23-9175e3d169da', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15H', null, 'development', 'E-7', null, 'Sergeant First Class (SFC) E-7 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Senior Leaders Course.
(2) Military Study: Master AR 350–1; AR 750–1; ATP 3-04.13; ATP 3-04.1; ADP 6- 22; TC 7-22.7; TC 3-04.07; TC 3-04.11; TC 3-04.71.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', '43f814013258f502e48fa4eb20d1af764bcc15c9c60897d1fca297d1068c9172', 6, 6, null, 39, null, null, false, null),
  ('206d44a4-dab1-5ec0-9495-69d46fd96a3a', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15H', null, 'development', 'E-8', null, 'Master Sergeant/First Sergeant (MSG/1SG) E-8 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Master Leaders Course.
(2) Military Study: Continue mastery of all previous publications and pursue functional courses to understand how the Army runs.
(3) Development Focus: Engage in self-motivated professional reading; hone organizational leadership skills needed to teach, coach, and mentor Soldiers.', '5ba3d4a9c0be3cc4d1dd9b42d237e5ac8f959f468decebfe8d4366e6efb9ec73', 6, 6, null, 40, null, null, false, null),
  ('54156727-2969-5d51-bf32-916c52e4a3f6', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15H', null, 'development', 'E-9', null, 'Sergeant Major/Command Sergeant Major (SGM/CSM) E-9 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Sergeants Major Academy.
(2) Military Study: Possess outstanding communication and public speaking skills.
(3) Development Focus: Study world politics, geo-political issues (DIMEFIL), and field manuals relating to Army OPS and current battle doctrine.', '9dfdf76e95746dff858bb5fda5a42fb24d829bb2a91373f728a009ede2d1d5ad', 6, 6, null, 41, null, null, false, null),
  ('4b3b504f-2721-5baf-a8d0-8e064f51ae88', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15K', null, 'promotion_criteria', null, null, 'Qualification indicators (promotion consideration)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', 'b. Most Qualified Indicators (SSG and SFC)
(1) Key Development Positions: 30-36 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Distinguished Honor Graduate, Honor Graduate, or Commandant List. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Working towards a completed associate''s degree. Obtaining Federal Aviation Administration (FAA) sponsored certificates and other MOS- related certifications from the COOL website.
b. SFC: Completed associate''s degree and working towards a bachelor''s degree. Obtaining FAA sponsored certificates and other MOS-related certifications.
c. All Ranks: Distinguished Leader Award, Lean Six Sigma Black Belt.
(4) Physical Fitness: AFT score of 450 or above, with a score of 90 in each event, without event substitution. NCOs on permanent profile should strive to reach 80 points in participable events.
(5) Training: (Completing two or more courses, a pattern of consistently completing military training is recommended)
a. SSG: Battle Staff, Mission Command Digital Master Gunner Course, Equal Opportunity Leaders (EOL) Course, Sexual Harassment/Assault Response & Prevention (SHARP) Level I, Health and Holistic Fitness Integrator Course (H2F-I).
b. SFC: Army Knowledge Management Qualification Course, Battle Staff, Mission Command Digital Master Gunner Course.
(6) Assignments:
a. SSG: Drill Sergeant, CTC Observer/Coach Trainer, Special Mission Unit, Special Operations Aviation.
b. SFC: Senior Drill Sergeant, Small Group Leader, Aviation Proponent NCO, Talent Manager NCO, Special Mission Unit, Special Operations Aviation.
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(7) Other Indicators: Expert Soldier Badge, Iron Sergeant, SGT Audie Murphy Club Inductee, SGT Morales Club Inductee, Military Outstanding Volunteer Service Medal (MOVSM), Army Best Squad of the Year, Drill Sergeant of the Year, NCO of the Year, Trainer of the Year (AAAA Functional Award), James H. McClellan Safety (AAAA National Award), Rodney J.T. Yano Non-Commissioned Officer of the Year (AAAA National Award), Gary G. Wetzel Army Aviation Soldier of the Year (AAAA National Award), Master Army Instructor Badge (MAIB), Army Gold Recruiter Badge, Professional Military Writing for peer reviewed articles (Published).
c. Highly Qualified Indicators (SSG and SFC)
(1) (1) Key Development Positions: 24-30 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Recognition for achieving Superior Academic Achievement. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Obtaining FAA sponsored certificates and other MOS-related certifications.
b. SFC: Working towards an associate''s degree and obtaining FAA sponsored certificates.
c. All Ranks: Lean Six Sigma Green or Yellow Belt.
(1) Physical Fitness: AFT score of 400 or above, with a score of 80 in each event, without event substitution.
(2) Training: (Completing one or more courses, a pattern of consistently completing military training is recommended)
a. SSG: SERE-C, Ranger, Airborne, Air Assault.
b. SFC: SHARP Intermediate Course Graduate, Equal Opportunity Leader (EOL) Course, Health and Holistic Fitness Integrator Course (H2F-I). Airborne, Air Assault, SERE-C, Ranger.
(3) Assignments:
a. SSG: Recruiter, Small Group Leader, Instructor, Training Developer, Doctrine Developer
b. SFC: Recruiter, Training Developer, Doctrine Developer, Test and Evaluation NCO
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(4) Other Indicators: Order of St. Michael, NCOA Individual Physical Fitness Award, Senior Army Instructor Badge (SAIB), Drill Sergeant Leader, NCO of the Quarter, Army Silver Recruiter Badge.
d. Most Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 24+ months as a First Sergeant (most critical), Senior Aviation Operations Sergeant, or Air Traffic Control (ATC) Operations Chief.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) How the Army Runs, Capabilities Development, Manpower and Force Management, Army Knowledge Management, Battle Staff, Mission Command Digital Master Gunner, SHARP Intermediate, EOL, Health and Holistic Fitness Integrator Course (H2F-I), Airborne, Air Assault, SERE-C, Ranger.
(6) Assignments: Maximum of 36 months as an Equal Opportunity Advisor, Senior DARR NCO, Assistant Commandant, Proponent NCO, or Talent Management NCO. MSG/1SG within Special Mission Units will have completed 60 months within SMU and possess either SQI “C” or “T” with high enumerations not necessarily consecutive
e. Highly Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 18-24 months as a First Sergeant, Senior Aviation Operations Sergeant, or ATC Operations Chief.
(2) PME: Recognition for achieving Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified."
(6) Assignments: Maximum of 36 months in broadening roles with mid-level enumerations.
f. Most Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 24+ months as a Command Sergeant Major or Operations Sergeant Major.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a master''s degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc
g. Highly Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 18-24 months as a Command Sergeant Major or Operations Sergeant Major with mid-level enumerations.
(2) PME: Recognition for Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc.', 'b802e09ac7ec68111626627b291fb97face87a25b2a025a264b29e4e59b4e057', 2, 5, null, 42, null, null, false, null),
  ('b09d0bc4-65ea-5152-928c-98519fe46244', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15K', null, 'development', 'E-1..E-4', null, 'Private (PVT) E–1 to Specialist/Corporal (SPC/CPL) E-4 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Individual Training.
(2) Military Study: Master AR 670–1; STP 21–1–SMCT; TM 1-1500-204-23; ATP 3- 04.1; ATP 3-04.7; ADP 6-22; TC 3-04.71; TC 4-02.1; TC 7-22.7, and all unit-level maintenance manuals.
(3) PME: Seize the first opportunity to attend Basic Leaders Course (BLC) upon promotion to Specialist/E4.
(4) Civilian Education: Explore CLEP and DANTES; enroll in ArmyIgnitED to earn credits towards a degree (goal: 120 credits over a career). Obtain FAA and other MOS-related certifications.
(5) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(6) Training: SERE-C, Airborne, Air Assault, Ranger.', 'e2d474cdfce5b4725de655b9bf83245322fdaf1d3dbcdf360f4a3ac2b09b3564', 5, 5, null, 43, null, null, false, null),
  ('97e86fcc-2f72-50a4-99ab-59f6760afcf4', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15K', null, 'development', 'E-5', null, 'Sergeant (SGT) E-5 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Basic Leaders Course.
(2) Military Study: Master TC 7-22.7; ADP 6-22; STP 21–24–SMCT (Warrior Leader Skill Levels 2, 3, and 4); FM 6–22 Army Leadership, and all -10 level maintenance manuals.
(3) Development Focus: Self-motivated development becomes critical. Focus on broadening management and doctrinal knowledge (organizational behavior, personnel management, time management, Army OPS).
(4) PME: Strive for recognition as a Distinguished Honor Graduate, Honor Graduate, or on the Commandant’s List.
(5) Civilian Education: Enroll in a college degree program, pursuing credits towards an associate''s degree, with the career goal of completing a bachelor''s degree.
(6) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(7) Training: SERE-C, Airborne, Air Assault, Ranger, Health and Holistic Fitness Integrator Course (H2F-I).', 'baebad57980ec8a346047c483e0ea1762325cb24e92d3dc3b8f0a50fbe9bdc04', 5, 6, null, 44, null, null, false, null),
  ('7a2b6fc7-23f2-5c99-8e11-07dd59e815eb', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15K', null, 'development', 'E-6', null, 'Staff Sergeant (SSG) E-6 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Leaders Course.
(2) Military Study: Master STP 21–24; TC 7-22.7; TC 3-04.71; ADP 6-22; ATP 3- 04.1; ATP 3-04.7.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', 'cd3e7ab3527bdbebe1fea3ef639c7237e62b98616130dd62aa78a87e943253a5', 6, 6, null, 45, null, null, false, null),
  ('52b4ffa4-682e-5f4e-8c94-8b427351ec69', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15K', null, 'development', 'E-7', null, 'Sergeant First Class (SFC) E-7 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Senior Leaders Course.
(2) Military Study: Master AR 350–1; AR 750–1; ATP 3-04.13; ATP 3-04.1; ADP 6- 22; TC 7-22.7; TC 3-04.07; TC 3-04.11; TC 3-04.71.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', '43f814013258f502e48fa4eb20d1af764bcc15c9c60897d1fca297d1068c9172', 6, 6, null, 46, null, null, false, null),
  ('8a3377a6-cc5d-56e3-9eb7-92ae277c7d16', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15K', null, 'development', 'E-8', null, 'Master Sergeant/First Sergeant (MSG/1SG) E-8 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Master Leaders Course.
(2) Military Study: Continue mastery of all previous publications and pursue functional courses to understand how the Army runs.
(3) Development Focus: Engage in self-motivated professional reading; hone organizational leadership skills needed to teach, coach, and mentor Soldiers.', '5ba3d4a9c0be3cc4d1dd9b42d237e5ac8f959f468decebfe8d4366e6efb9ec73', 6, 6, null, 47, null, null, false, null),
  ('305d9970-0c97-5dde-9a79-826ca24cc50b', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15K', null, 'development', 'E-9', null, 'Sergeant Major/Command Sergeant Major (SGM/CSM) E-9 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Sergeants Major Academy.
(2) Military Study: Possess outstanding communication and public speaking skills.
(3) Development Focus: Study world politics, geo-political issues (DIMEFIL), and field manuals relating to Army OPS and current battle doctrine.', '9dfdf76e95746dff858bb5fda5a42fb24d829bb2a91373f728a009ede2d1d5ad', 6, 6, null, 48, null, null, false, null),
  ('4ea0b449-b405-5366-b9ee-6c137c57a7cc', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15L', null, 'promotion_criteria', null, null, 'Qualification indicators (promotion consideration)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', 'b. Most Qualified Indicators (SSG and SFC)
(1) Key Development Positions: 30-36 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Distinguished Honor Graduate, Honor Graduate, or Commandant List. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Working towards a completed associate''s degree. Obtaining Federal Aviation Administration (FAA) sponsored certificates and other MOS- related certifications from the COOL website.
b. SFC: Completed associate''s degree and working towards a bachelor''s degree. Obtaining FAA sponsored certificates and other MOS-related certifications.
c. All Ranks: Distinguished Leader Award, Lean Six Sigma Black Belt.
(4) Physical Fitness: AFT score of 450 or above, with a score of 90 in each event, without event substitution. NCOs on permanent profile should strive to reach 80 points in participable events.
(5) Training: (Completing two or more courses, a pattern of consistently completing military training is recommended)
a. SSG: Battle Staff, Mission Command Digital Master Gunner Course, Equal Opportunity Leaders (EOL) Course, Sexual Harassment/Assault Response & Prevention (SHARP) Level I, Health and Holistic Fitness Integrator Course (H2F-I).
b. SFC: Army Knowledge Management Qualification Course, Battle Staff, Mission Command Digital Master Gunner Course.
(6) Assignments:
a. SSG: Drill Sergeant, CTC Observer/Coach Trainer, Special Mission Unit, Special Operations Aviation.
b. SFC: Senior Drill Sergeant, Small Group Leader, Aviation Proponent NCO, Talent Manager NCO, Special Mission Unit, Special Operations Aviation.
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(7) Other Indicators: Expert Soldier Badge, Iron Sergeant, SGT Audie Murphy Club Inductee, SGT Morales Club Inductee, Military Outstanding Volunteer Service Medal (MOVSM), Army Best Squad of the Year, Drill Sergeant of the Year, NCO of the Year, Trainer of the Year (AAAA Functional Award), James H. McClellan Safety (AAAA National Award), Rodney J.T. Yano Non-Commissioned Officer of the Year (AAAA National Award), Gary G. Wetzel Army Aviation Soldier of the Year (AAAA National Award), Master Army Instructor Badge (MAIB), Army Gold Recruiter Badge, Professional Military Writing for peer reviewed articles (Published).
c. Highly Qualified Indicators (SSG and SFC)
(1) (1) Key Development Positions: 24-30 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Recognition for achieving Superior Academic Achievement. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Obtaining FAA sponsored certificates and other MOS-related certifications.
b. SFC: Working towards an associate''s degree and obtaining FAA sponsored certificates.
c. All Ranks: Lean Six Sigma Green or Yellow Belt.
(1) Physical Fitness: AFT score of 400 or above, with a score of 80 in each event, without event substitution.
(2) Training: (Completing one or more courses, a pattern of consistently completing military training is recommended)
a. SSG: SERE-C, Ranger, Airborne, Air Assault.
b. SFC: SHARP Intermediate Course Graduate, Equal Opportunity Leader (EOL) Course, Health and Holistic Fitness Integrator Course (H2F-I). Airborne, Air Assault, SERE-C, Ranger.
(3) Assignments:
a. SSG: Recruiter, Small Group Leader, Instructor, Training Developer, Doctrine Developer
b. SFC: Recruiter, Training Developer, Doctrine Developer, Test and Evaluation NCO
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(4) Other Indicators: Order of St. Michael, NCOA Individual Physical Fitness Award, Senior Army Instructor Badge (SAIB), Drill Sergeant Leader, NCO of the Quarter, Army Silver Recruiter Badge.
d. Most Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 24+ months as a First Sergeant (most critical), Senior Aviation Operations Sergeant, or Air Traffic Control (ATC) Operations Chief.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) How the Army Runs, Capabilities Development, Manpower and Force Management, Army Knowledge Management, Battle Staff, Mission Command Digital Master Gunner, SHARP Intermediate, EOL, Health and Holistic Fitness Integrator Course (H2F-I), Airborne, Air Assault, SERE-C, Ranger.
(6) Assignments: Maximum of 36 months as an Equal Opportunity Advisor, Senior DARR NCO, Assistant Commandant, Proponent NCO, or Talent Management NCO. MSG/1SG within Special Mission Units will have completed 60 months within SMU and possess either SQI “C” or “T” with high enumerations not necessarily consecutive
e. Highly Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 18-24 months as a First Sergeant, Senior Aviation Operations Sergeant, or ATC Operations Chief.
(2) PME: Recognition for achieving Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified."
(6) Assignments: Maximum of 36 months in broadening roles with mid-level enumerations.
f. Most Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 24+ months as a Command Sergeant Major or Operations Sergeant Major.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a master''s degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc
g. Highly Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 18-24 months as a Command Sergeant Major or Operations Sergeant Major with mid-level enumerations.
(2) PME: Recognition for Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc.', 'b802e09ac7ec68111626627b291fb97face87a25b2a025a264b29e4e59b4e057', 2, 5, null, 49, null, null, false, null),
  ('bda60158-093f-5c79-a6e7-37c966793656', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15L', null, 'development', 'E-1..E-4', null, 'Private (PVT) E–1 to Specialist/Corporal (SPC/CPL) E-4 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Individual Training.
(2) Military Study: Master AR 670–1; STP 21–1–SMCT; TM 1-1500-204-23; ATP 3- 04.1; ATP 3-04.7; ADP 6-22; TC 3-04.71; TC 4-02.1; TC 7-22.7, and all unit-level maintenance manuals.
(3) PME: Seize the first opportunity to attend Basic Leaders Course (BLC) upon promotion to Specialist/E4.
(4) Civilian Education: Explore CLEP and DANTES; enroll in ArmyIgnitED to earn credits towards a degree (goal: 120 credits over a career). Obtain FAA and other MOS-related certifications.
(5) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(6) Training: SERE-C, Airborne, Air Assault, Ranger.', 'e2d474cdfce5b4725de655b9bf83245322fdaf1d3dbcdf360f4a3ac2b09b3564', 5, 5, null, 50, null, null, false, null),
  ('3f03abe7-1c92-5c74-b3fa-4cb37a0f2fe6', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15L', null, 'development', 'E-5', null, 'Sergeant (SGT) E-5 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Basic Leaders Course.
(2) Military Study: Master TC 7-22.7; ADP 6-22; STP 21–24–SMCT (Warrior Leader Skill Levels 2, 3, and 4); FM 6–22 Army Leadership, and all -10 level maintenance manuals.
(3) Development Focus: Self-motivated development becomes critical. Focus on broadening management and doctrinal knowledge (organizational behavior, personnel management, time management, Army OPS).
(4) PME: Strive for recognition as a Distinguished Honor Graduate, Honor Graduate, or on the Commandant’s List.
(5) Civilian Education: Enroll in a college degree program, pursuing credits towards an associate''s degree, with the career goal of completing a bachelor''s degree.
(6) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(7) Training: SERE-C, Airborne, Air Assault, Ranger, Health and Holistic Fitness Integrator Course (H2F-I).', 'baebad57980ec8a346047c483e0ea1762325cb24e92d3dc3b8f0a50fbe9bdc04', 5, 6, null, 51, null, null, false, null),
  ('bb0f0f62-44f8-5b8c-9ef5-dee21fa10d90', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15L', null, 'development', 'E-6', null, 'Staff Sergeant (SSG) E-6 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Leaders Course.
(2) Military Study: Master STP 21–24; TC 7-22.7; TC 3-04.71; ADP 6-22; ATP 3- 04.1; ATP 3-04.7.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', 'cd3e7ab3527bdbebe1fea3ef639c7237e62b98616130dd62aa78a87e943253a5', 6, 6, null, 52, null, null, false, null),
  ('3154109b-e070-5315-92c6-186731f73129', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15L', null, 'development', 'E-7', null, 'Sergeant First Class (SFC) E-7 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Senior Leaders Course.
(2) Military Study: Master AR 350–1; AR 750–1; ATP 3-04.13; ATP 3-04.1; ADP 6- 22; TC 7-22.7; TC 3-04.07; TC 3-04.11; TC 3-04.71.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', '43f814013258f502e48fa4eb20d1af764bcc15c9c60897d1fca297d1068c9172', 6, 6, null, 53, null, null, false, null),
  ('3bf9e5f4-d0fa-51e7-b87f-62c2cadb770f', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15L', null, 'development', 'E-8', null, 'Master Sergeant/First Sergeant (MSG/1SG) E-8 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Master Leaders Course.
(2) Military Study: Continue mastery of all previous publications and pursue functional courses to understand how the Army runs.
(3) Development Focus: Engage in self-motivated professional reading; hone organizational leadership skills needed to teach, coach, and mentor Soldiers.', '5ba3d4a9c0be3cc4d1dd9b42d237e5ac8f959f468decebfe8d4366e6efb9ec73', 6, 6, null, 54, null, null, false, null),
  ('38f81667-3ab4-504b-b36b-16e9693bd5e5', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15L', null, 'development', 'E-9', null, 'Sergeant Major/Command Sergeant Major (SGM/CSM) E-9 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Sergeants Major Academy.
(2) Military Study: Possess outstanding communication and public speaking skills.
(3) Development Focus: Study world politics, geo-political issues (DIMEFIL), and field manuals relating to Army OPS and current battle doctrine.', '9dfdf76e95746dff858bb5fda5a42fb24d829bb2a91373f728a009ede2d1d5ad', 6, 6, null, 55, null, null, false, null),
  ('a0884d15-2c6b-5792-9568-144083f8f53a', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15M', null, 'promotion_criteria', null, null, 'Qualification indicators (promotion consideration)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', 'b. Most Qualified Indicators (SSG and SFC)
(1) Key Development Positions: 30-36 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Distinguished Honor Graduate, Honor Graduate, or Commandant List. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Working towards a completed associate''s degree. Obtaining Federal Aviation Administration (FAA) sponsored certificates and other MOS- related certifications from the COOL website.
b. SFC: Completed associate''s degree and working towards a bachelor''s degree. Obtaining FAA sponsored certificates and other MOS-related certifications.
c. All Ranks: Distinguished Leader Award, Lean Six Sigma Black Belt.
(4) Physical Fitness: AFT score of 450 or above, with a score of 90 in each event, without event substitution. NCOs on permanent profile should strive to reach 80 points in participable events.
(5) Training: (Completing two or more courses, a pattern of consistently completing military training is recommended)
a. SSG: Battle Staff, Mission Command Digital Master Gunner Course, Equal Opportunity Leaders (EOL) Course, Sexual Harassment/Assault Response & Prevention (SHARP) Level I, Health and Holistic Fitness Integrator Course (H2F-I).
b. SFC: Army Knowledge Management Qualification Course, Battle Staff, Mission Command Digital Master Gunner Course.
(6) Assignments:
a. SSG: Drill Sergeant, CTC Observer/Coach Trainer, Special Mission Unit, Special Operations Aviation.
b. SFC: Senior Drill Sergeant, Small Group Leader, Aviation Proponent NCO, Talent Manager NCO, Special Mission Unit, Special Operations Aviation.
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(7) Other Indicators: Expert Soldier Badge, Iron Sergeant, SGT Audie Murphy Club Inductee, SGT Morales Club Inductee, Military Outstanding Volunteer Service Medal (MOVSM), Army Best Squad of the Year, Drill Sergeant of the Year, NCO of the Year, Trainer of the Year (AAAA Functional Award), James H. McClellan Safety (AAAA National Award), Rodney J.T. Yano Non-Commissioned Officer of the Year (AAAA National Award), Gary G. Wetzel Army Aviation Soldier of the Year (AAAA National Award), Master Army Instructor Badge (MAIB), Army Gold Recruiter Badge, Professional Military Writing for peer reviewed articles (Published).
c. Highly Qualified Indicators (SSG and SFC)
(1) (1) Key Development Positions: 24-30 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Recognition for achieving Superior Academic Achievement. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Obtaining FAA sponsored certificates and other MOS-related certifications.
b. SFC: Working towards an associate''s degree and obtaining FAA sponsored certificates.
c. All Ranks: Lean Six Sigma Green or Yellow Belt.
(1) Physical Fitness: AFT score of 400 or above, with a score of 80 in each event, without event substitution.
(2) Training: (Completing one or more courses, a pattern of consistently completing military training is recommended)
a. SSG: SERE-C, Ranger, Airborne, Air Assault.
b. SFC: SHARP Intermediate Course Graduate, Equal Opportunity Leader (EOL) Course, Health and Holistic Fitness Integrator Course (H2F-I). Airborne, Air Assault, SERE-C, Ranger.
(3) Assignments:
a. SSG: Recruiter, Small Group Leader, Instructor, Training Developer, Doctrine Developer
b. SFC: Recruiter, Training Developer, Doctrine Developer, Test and Evaluation NCO
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(4) Other Indicators: Order of St. Michael, NCOA Individual Physical Fitness Award, Senior Army Instructor Badge (SAIB), Drill Sergeant Leader, NCO of the Quarter, Army Silver Recruiter Badge.
d. Most Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 24+ months as a First Sergeant (most critical), Senior Aviation Operations Sergeant, or Air Traffic Control (ATC) Operations Chief.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) How the Army Runs, Capabilities Development, Manpower and Force Management, Army Knowledge Management, Battle Staff, Mission Command Digital Master Gunner, SHARP Intermediate, EOL, Health and Holistic Fitness Integrator Course (H2F-I), Airborne, Air Assault, SERE-C, Ranger.
(6) Assignments: Maximum of 36 months as an Equal Opportunity Advisor, Senior DARR NCO, Assistant Commandant, Proponent NCO, or Talent Management NCO. MSG/1SG within Special Mission Units will have completed 60 months within SMU and possess either SQI “C” or “T” with high enumerations not necessarily consecutive
e. Highly Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 18-24 months as a First Sergeant, Senior Aviation Operations Sergeant, or ATC Operations Chief.
(2) PME: Recognition for achieving Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified."
(6) Assignments: Maximum of 36 months in broadening roles with mid-level enumerations.
f. Most Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 24+ months as a Command Sergeant Major or Operations Sergeant Major.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a master''s degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc
g. Highly Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 18-24 months as a Command Sergeant Major or Operations Sergeant Major with mid-level enumerations.
(2) PME: Recognition for Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc.', 'b802e09ac7ec68111626627b291fb97face87a25b2a025a264b29e4e59b4e057', 2, 5, null, 56, null, null, false, null),
  ('11e4e116-46fc-5af0-ad3c-110adff27143', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15M', null, 'development', 'E-1..E-4', null, 'Private (PVT) E–1 to Specialist/Corporal (SPC/CPL) E-4 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Individual Training.
(2) Military Study: Master AR 670–1; STP 21–1–SMCT; TM 1-1500-204-23; ATP 3- 04.1; ATP 3-04.7; ADP 6-22; TC 3-04.71; TC 4-02.1; TC 7-22.7, and all unit-level maintenance manuals.
(3) PME: Seize the first opportunity to attend Basic Leaders Course (BLC) upon promotion to Specialist/E4.
(4) Civilian Education: Explore CLEP and DANTES; enroll in ArmyIgnitED to earn credits towards a degree (goal: 120 credits over a career). Obtain FAA and other MOS-related certifications.
(5) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(6) Training: SERE-C, Airborne, Air Assault, Ranger.', 'e2d474cdfce5b4725de655b9bf83245322fdaf1d3dbcdf360f4a3ac2b09b3564', 5, 5, null, 57, null, null, false, null),
  ('92d416f7-51b1-5ea6-a69d-67c7c4029d66', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15M', null, 'development', 'E-5', null, 'Sergeant (SGT) E-5 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Basic Leaders Course.
(2) Military Study: Master TC 7-22.7; ADP 6-22; STP 21–24–SMCT (Warrior Leader Skill Levels 2, 3, and 4); FM 6–22 Army Leadership, and all -10 level maintenance manuals.
(3) Development Focus: Self-motivated development becomes critical. Focus on broadening management and doctrinal knowledge (organizational behavior, personnel management, time management, Army OPS).
(4) PME: Strive for recognition as a Distinguished Honor Graduate, Honor Graduate, or on the Commandant’s List.
(5) Civilian Education: Enroll in a college degree program, pursuing credits towards an associate''s degree, with the career goal of completing a bachelor''s degree.
(6) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(7) Training: SERE-C, Airborne, Air Assault, Ranger, Health and Holistic Fitness Integrator Course (H2F-I).', 'baebad57980ec8a346047c483e0ea1762325cb24e92d3dc3b8f0a50fbe9bdc04', 5, 6, null, 58, null, null, false, null),
  ('df4e8ef5-2bb3-5f45-8f1e-c8fa5677ad45', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15M', null, 'development', 'E-6', null, 'Staff Sergeant (SSG) E-6 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Leaders Course.
(2) Military Study: Master STP 21–24; TC 7-22.7; TC 3-04.71; ADP 6-22; ATP 3- 04.1; ATP 3-04.7.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', 'cd3e7ab3527bdbebe1fea3ef639c7237e62b98616130dd62aa78a87e943253a5', 6, 6, null, 59, null, null, false, null),
  ('ef857d63-16c3-5a99-ac76-2908805dc506', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15M', null, 'development', 'E-7', null, 'Sergeant First Class (SFC) E-7 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Senior Leaders Course.
(2) Military Study: Master AR 350–1; AR 750–1; ATP 3-04.13; ATP 3-04.1; ADP 6- 22; TC 7-22.7; TC 3-04.07; TC 3-04.11; TC 3-04.71.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', '43f814013258f502e48fa4eb20d1af764bcc15c9c60897d1fca297d1068c9172', 6, 6, null, 60, null, null, false, null),
  ('84158b1f-329a-50eb-816e-1ceb6bf4b7c3', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15M', null, 'development', 'E-8', null, 'Master Sergeant/First Sergeant (MSG/1SG) E-8 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Master Leaders Course.
(2) Military Study: Continue mastery of all previous publications and pursue functional courses to understand how the Army runs.
(3) Development Focus: Engage in self-motivated professional reading; hone organizational leadership skills needed to teach, coach, and mentor Soldiers.', '5ba3d4a9c0be3cc4d1dd9b42d237e5ac8f959f468decebfe8d4366e6efb9ec73', 6, 6, null, 61, null, null, false, null),
  ('4ebbb6f5-afab-516f-8358-bc31d26e5998', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15M', null, 'development', 'E-9', null, 'Sergeant Major/Command Sergeant Major (SGM/CSM) E-9 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Sergeants Major Academy.
(2) Military Study: Possess outstanding communication and public speaking skills.
(3) Development Focus: Study world politics, geo-political issues (DIMEFIL), and field manuals relating to Army OPS and current battle doctrine.', '9dfdf76e95746dff858bb5fda5a42fb24d829bb2a91373f728a009ede2d1d5ad', 6, 6, null, 62, null, null, false, null),
  ('57a3b5d8-6ce9-5efd-bcbb-60080e674b0b', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15N', null, 'promotion_criteria', null, null, 'Qualification indicators (promotion consideration)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', 'b. Most Qualified Indicators (SSG and SFC)
(1) Key Development Positions: 30-36 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Distinguished Honor Graduate, Honor Graduate, or Commandant List. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Working towards a completed associate''s degree. Obtaining Federal Aviation Administration (FAA) sponsored certificates and other MOS- related certifications from the COOL website.
b. SFC: Completed associate''s degree and working towards a bachelor''s degree. Obtaining FAA sponsored certificates and other MOS-related certifications.
c. All Ranks: Distinguished Leader Award, Lean Six Sigma Black Belt.
(4) Physical Fitness: AFT score of 450 or above, with a score of 90 in each event, without event substitution. NCOs on permanent profile should strive to reach 80 points in participable events.
(5) Training: (Completing two or more courses, a pattern of consistently completing military training is recommended)
a. SSG: Battle Staff, Mission Command Digital Master Gunner Course, Equal Opportunity Leaders (EOL) Course, Sexual Harassment/Assault Response & Prevention (SHARP) Level I, Health and Holistic Fitness Integrator Course (H2F-I).
b. SFC: Army Knowledge Management Qualification Course, Battle Staff, Mission Command Digital Master Gunner Course.
(6) Assignments:
a. SSG: Drill Sergeant, CTC Observer/Coach Trainer, Special Mission Unit, Special Operations Aviation.
b. SFC: Senior Drill Sergeant, Small Group Leader, Aviation Proponent NCO, Talent Manager NCO, Special Mission Unit, Special Operations Aviation.
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(7) Other Indicators: Expert Soldier Badge, Iron Sergeant, SGT Audie Murphy Club Inductee, SGT Morales Club Inductee, Military Outstanding Volunteer Service Medal (MOVSM), Army Best Squad of the Year, Drill Sergeant of the Year, NCO of the Year, Trainer of the Year (AAAA Functional Award), James H. McClellan Safety (AAAA National Award), Rodney J.T. Yano Non-Commissioned Officer of the Year (AAAA National Award), Gary G. Wetzel Army Aviation Soldier of the Year (AAAA National Award), Master Army Instructor Badge (MAIB), Army Gold Recruiter Badge, Professional Military Writing for peer reviewed articles (Published).
c. Highly Qualified Indicators (SSG and SFC)
(1) (1) Key Development Positions: 24-30 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Recognition for achieving Superior Academic Achievement. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Obtaining FAA sponsored certificates and other MOS-related certifications.
b. SFC: Working towards an associate''s degree and obtaining FAA sponsored certificates.
c. All Ranks: Lean Six Sigma Green or Yellow Belt.
(1) Physical Fitness: AFT score of 400 or above, with a score of 80 in each event, without event substitution.
(2) Training: (Completing one or more courses, a pattern of consistently completing military training is recommended)
a. SSG: SERE-C, Ranger, Airborne, Air Assault.
b. SFC: SHARP Intermediate Course Graduate, Equal Opportunity Leader (EOL) Course, Health and Holistic Fitness Integrator Course (H2F-I). Airborne, Air Assault, SERE-C, Ranger.
(3) Assignments:
a. SSG: Recruiter, Small Group Leader, Instructor, Training Developer, Doctrine Developer
b. SFC: Recruiter, Training Developer, Doctrine Developer, Test and Evaluation NCO
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(4) Other Indicators: Order of St. Michael, NCOA Individual Physical Fitness Award, Senior Army Instructor Badge (SAIB), Drill Sergeant Leader, NCO of the Quarter, Army Silver Recruiter Badge.
d. Most Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 24+ months as a First Sergeant (most critical), Senior Aviation Operations Sergeant, or Air Traffic Control (ATC) Operations Chief.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) How the Army Runs, Capabilities Development, Manpower and Force Management, Army Knowledge Management, Battle Staff, Mission Command Digital Master Gunner, SHARP Intermediate, EOL, Health and Holistic Fitness Integrator Course (H2F-I), Airborne, Air Assault, SERE-C, Ranger.
(6) Assignments: Maximum of 36 months as an Equal Opportunity Advisor, Senior DARR NCO, Assistant Commandant, Proponent NCO, or Talent Management NCO. MSG/1SG within Special Mission Units will have completed 60 months within SMU and possess either SQI “C” or “T” with high enumerations not necessarily consecutive
e. Highly Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 18-24 months as a First Sergeant, Senior Aviation Operations Sergeant, or ATC Operations Chief.
(2) PME: Recognition for achieving Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified."
(6) Assignments: Maximum of 36 months in broadening roles with mid-level enumerations.
f. Most Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 24+ months as a Command Sergeant Major or Operations Sergeant Major.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a master''s degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc
g. Highly Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 18-24 months as a Command Sergeant Major or Operations Sergeant Major with mid-level enumerations.
(2) PME: Recognition for Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc.', 'b802e09ac7ec68111626627b291fb97face87a25b2a025a264b29e4e59b4e057', 2, 5, null, 63, null, null, false, null),
  ('20a20636-f565-54d1-b757-2447e1068e79', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15N', null, 'development', 'E-1..E-4', null, 'Private (PVT) E–1 to Specialist/Corporal (SPC/CPL) E-4 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Individual Training.
(2) Military Study: Master AR 670–1; STP 21–1–SMCT; TM 1-1500-204-23; ATP 3- 04.1; ATP 3-04.7; ADP 6-22; TC 3-04.71; TC 4-02.1; TC 7-22.7, and all unit-level maintenance manuals.
(3) PME: Seize the first opportunity to attend Basic Leaders Course (BLC) upon promotion to Specialist/E4.
(4) Civilian Education: Explore CLEP and DANTES; enroll in ArmyIgnitED to earn credits towards a degree (goal: 120 credits over a career). Obtain FAA and other MOS-related certifications.
(5) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(6) Training: SERE-C, Airborne, Air Assault, Ranger.', 'e2d474cdfce5b4725de655b9bf83245322fdaf1d3dbcdf360f4a3ac2b09b3564', 5, 5, null, 64, null, null, false, null),
  ('dbbc5cb4-ce99-5f64-8158-1285ab188a92', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15N', null, 'development', 'E-5', null, 'Sergeant (SGT) E-5 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Basic Leaders Course.
(2) Military Study: Master TC 7-22.7; ADP 6-22; STP 21–24–SMCT (Warrior Leader Skill Levels 2, 3, and 4); FM 6–22 Army Leadership, and all -10 level maintenance manuals.
(3) Development Focus: Self-motivated development becomes critical. Focus on broadening management and doctrinal knowledge (organizational behavior, personnel management, time management, Army OPS).
(4) PME: Strive for recognition as a Distinguished Honor Graduate, Honor Graduate, or on the Commandant’s List.
(5) Civilian Education: Enroll in a college degree program, pursuing credits towards an associate''s degree, with the career goal of completing a bachelor''s degree.
(6) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(7) Training: SERE-C, Airborne, Air Assault, Ranger, Health and Holistic Fitness Integrator Course (H2F-I).', 'baebad57980ec8a346047c483e0ea1762325cb24e92d3dc3b8f0a50fbe9bdc04', 5, 6, null, 65, null, null, false, null),
  ('fc3caee4-750b-5f2b-843c-d2cfcc0f64e3', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15N', null, 'development', 'E-6', null, 'Staff Sergeant (SSG) E-6 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Leaders Course.
(2) Military Study: Master STP 21–24; TC 7-22.7; TC 3-04.71; ADP 6-22; ATP 3- 04.1; ATP 3-04.7.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', 'cd3e7ab3527bdbebe1fea3ef639c7237e62b98616130dd62aa78a87e943253a5', 6, 6, null, 66, null, null, false, null),
  ('beb17f7a-6d74-52b8-9f67-a4139464aea7', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15N', null, 'development', 'E-7', null, 'Sergeant First Class (SFC) E-7 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Senior Leaders Course.
(2) Military Study: Master AR 350–1; AR 750–1; ATP 3-04.13; ATP 3-04.1; ADP 6- 22; TC 7-22.7; TC 3-04.07; TC 3-04.11; TC 3-04.71.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', '43f814013258f502e48fa4eb20d1af764bcc15c9c60897d1fca297d1068c9172', 6, 6, null, 67, null, null, false, null),
  ('8161b8ad-2ad1-5846-b867-adf742107256', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15N', null, 'development', 'E-8', null, 'Master Sergeant/First Sergeant (MSG/1SG) E-8 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Master Leaders Course.
(2) Military Study: Continue mastery of all previous publications and pursue functional courses to understand how the Army runs.
(3) Development Focus: Engage in self-motivated professional reading; hone organizational leadership skills needed to teach, coach, and mentor Soldiers.', '5ba3d4a9c0be3cc4d1dd9b42d237e5ac8f959f468decebfe8d4366e6efb9ec73', 6, 6, null, 68, null, null, false, null),
  ('0b60620d-289b-5756-aba7-e1f116c5602f', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15N', null, 'development', 'E-9', null, 'Sergeant Major/Command Sergeant Major (SGM/CSM) E-9 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Sergeants Major Academy.
(2) Military Study: Possess outstanding communication and public speaking skills.
(3) Development Focus: Study world politics, geo-political issues (DIMEFIL), and field manuals relating to Army OPS and current battle doctrine.', '9dfdf76e95746dff858bb5fda5a42fb24d829bb2a91373f728a009ede2d1d5ad', 6, 6, null, 69, null, null, false, null),
  ('fdbab5b4-51c6-547d-8166-73a0058a5e48', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15P', null, 'promotion_criteria', null, null, 'Qualification indicators (promotion consideration)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', 'b. Most Qualified Indicators (SSG and SFC)
(1) Key Development Positions: 30-36 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Distinguished Honor Graduate, Honor Graduate, or Commandant List. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Working towards a completed associate''s degree. Obtaining Federal Aviation Administration (FAA) sponsored certificates and other MOS- related certifications from the COOL website.
b. SFC: Completed associate''s degree and working towards a bachelor''s degree. Obtaining FAA sponsored certificates and other MOS-related certifications.
c. All Ranks: Distinguished Leader Award, Lean Six Sigma Black Belt.
(4) Physical Fitness: AFT score of 450 or above, with a score of 90 in each event, without event substitution. NCOs on permanent profile should strive to reach 80 points in participable events.
(5) Training: (Completing two or more courses, a pattern of consistently completing military training is recommended)
a. SSG: Battle Staff, Mission Command Digital Master Gunner Course, Equal Opportunity Leaders (EOL) Course, Sexual Harassment/Assault Response & Prevention (SHARP) Level I, Health and Holistic Fitness Integrator Course (H2F-I).
b. SFC: Army Knowledge Management Qualification Course, Battle Staff, Mission Command Digital Master Gunner Course.
(6) Assignments:
a. SSG: Drill Sergeant, CTC Observer/Coach Trainer, Special Mission Unit, Special Operations Aviation.
b. SFC: Senior Drill Sergeant, Small Group Leader, Aviation Proponent NCO, Talent Manager NCO, Special Mission Unit, Special Operations Aviation.
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(7) Other Indicators: Expert Soldier Badge, Iron Sergeant, SGT Audie Murphy Club Inductee, SGT Morales Club Inductee, Military Outstanding Volunteer Service Medal (MOVSM), Army Best Squad of the Year, Drill Sergeant of the Year, NCO of the Year, Trainer of the Year (AAAA Functional Award), James H. McClellan Safety (AAAA National Award), Rodney J.T. Yano Non-Commissioned Officer of the Year (AAAA National Award), Gary G. Wetzel Army Aviation Soldier of the Year (AAAA National Award), Master Army Instructor Badge (MAIB), Army Gold Recruiter Badge, Professional Military Writing for peer reviewed articles (Published).
c. Highly Qualified Indicators (SSG and SFC)
(1) (1) Key Development Positions: 24-30 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Recognition for achieving Superior Academic Achievement. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Obtaining FAA sponsored certificates and other MOS-related certifications.
b. SFC: Working towards an associate''s degree and obtaining FAA sponsored certificates.
c. All Ranks: Lean Six Sigma Green or Yellow Belt.
(1) Physical Fitness: AFT score of 400 or above, with a score of 80 in each event, without event substitution.
(2) Training: (Completing one or more courses, a pattern of consistently completing military training is recommended)
a. SSG: SERE-C, Ranger, Airborne, Air Assault.
b. SFC: SHARP Intermediate Course Graduate, Equal Opportunity Leader (EOL) Course, Health and Holistic Fitness Integrator Course (H2F-I). Airborne, Air Assault, SERE-C, Ranger.
(3) Assignments:
a. SSG: Recruiter, Small Group Leader, Instructor, Training Developer, Doctrine Developer
b. SFC: Recruiter, Training Developer, Doctrine Developer, Test and Evaluation NCO
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(4) Other Indicators: Order of St. Michael, NCOA Individual Physical Fitness Award, Senior Army Instructor Badge (SAIB), Drill Sergeant Leader, NCO of the Quarter, Army Silver Recruiter Badge.
d. Most Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 24+ months as a First Sergeant (most critical), Senior Aviation Operations Sergeant, or Air Traffic Control (ATC) Operations Chief.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) How the Army Runs, Capabilities Development, Manpower and Force Management, Army Knowledge Management, Battle Staff, Mission Command Digital Master Gunner, SHARP Intermediate, EOL, Health and Holistic Fitness Integrator Course (H2F-I), Airborne, Air Assault, SERE-C, Ranger.
(6) Assignments: Maximum of 36 months as an Equal Opportunity Advisor, Senior DARR NCO, Assistant Commandant, Proponent NCO, or Talent Management NCO. MSG/1SG within Special Mission Units will have completed 60 months within SMU and possess either SQI “C” or “T” with high enumerations not necessarily consecutive
e. Highly Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 18-24 months as a First Sergeant, Senior Aviation Operations Sergeant, or ATC Operations Chief.
(2) PME: Recognition for achieving Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified."
(6) Assignments: Maximum of 36 months in broadening roles with mid-level enumerations.
f. Most Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 24+ months as a Command Sergeant Major or Operations Sergeant Major.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a master''s degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc
g. Highly Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 18-24 months as a Command Sergeant Major or Operations Sergeant Major with mid-level enumerations.
(2) PME: Recognition for Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc.', 'b802e09ac7ec68111626627b291fb97face87a25b2a025a264b29e4e59b4e057', 2, 5, null, 70, null, null, false, null),
  ('e6523ed7-86ab-550e-844e-4d220f68a817', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15P', null, 'development', 'E-1..E-4', null, 'Private (PVT) E–1 to Specialist/Corporal (SPC/CPL) E-4 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Individual Training.
(2) Military Study: Master AR 670–1; STP 21–1–SMCT; TM 1-1500-204-23; ATP 3- 04.1; ATP 3-04.7; ADP 6-22; TC 3-04.71; TC 4-02.1; TC 7-22.7, and all unit-level maintenance manuals.
(3) PME: Seize the first opportunity to attend Basic Leaders Course (BLC) upon promotion to Specialist/E4.
(4) Civilian Education: Explore CLEP and DANTES; enroll in ArmyIgnitED to earn credits towards a degree (goal: 120 credits over a career). Obtain FAA and other MOS-related certifications.
(5) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(6) Training: SERE-C, Airborne, Air Assault, Ranger.', 'e2d474cdfce5b4725de655b9bf83245322fdaf1d3dbcdf360f4a3ac2b09b3564', 5, 5, null, 71, null, null, false, null),
  ('d0d93bd2-c8af-53ba-a9c1-f482adcb74c4', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15P', null, 'development', 'E-5', null, 'Sergeant (SGT) E-5 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Basic Leaders Course.
(2) Military Study: Master TC 7-22.7; ADP 6-22; STP 21–24–SMCT (Warrior Leader Skill Levels 2, 3, and 4); FM 6–22 Army Leadership, and all -10 level maintenance manuals.
(3) Development Focus: Self-motivated development becomes critical. Focus on broadening management and doctrinal knowledge (organizational behavior, personnel management, time management, Army OPS).
(4) PME: Strive for recognition as a Distinguished Honor Graduate, Honor Graduate, or on the Commandant’s List.
(5) Civilian Education: Enroll in a college degree program, pursuing credits towards an associate''s degree, with the career goal of completing a bachelor''s degree.
(6) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(7) Training: SERE-C, Airborne, Air Assault, Ranger, Health and Holistic Fitness Integrator Course (H2F-I).', 'baebad57980ec8a346047c483e0ea1762325cb24e92d3dc3b8f0a50fbe9bdc04', 5, 6, null, 72, null, null, false, null),
  ('a42ccc06-6c37-56f2-8eb3-682ed3e787b0', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15P', null, 'development', 'E-6', null, 'Staff Sergeant (SSG) E-6 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Leaders Course.
(2) Military Study: Master STP 21–24; TC 7-22.7; TC 3-04.71; ADP 6-22; ATP 3- 04.1; ATP 3-04.7.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', 'cd3e7ab3527bdbebe1fea3ef639c7237e62b98616130dd62aa78a87e943253a5', 6, 6, null, 73, null, null, false, null),
  ('23fa027c-ad2d-58e9-8163-6b873c23519f', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15P', null, 'development', 'E-7', null, 'Sergeant First Class (SFC) E-7 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Senior Leaders Course.
(2) Military Study: Master AR 350–1; AR 750–1; ATP 3-04.13; ATP 3-04.1; ADP 6- 22; TC 7-22.7; TC 3-04.07; TC 3-04.11; TC 3-04.71.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', '43f814013258f502e48fa4eb20d1af764bcc15c9c60897d1fca297d1068c9172', 6, 6, null, 74, null, null, false, null),
  ('934f843b-2035-515c-9944-d36aca5f7ac5', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15P', null, 'development', 'E-8', null, 'Master Sergeant/First Sergeant (MSG/1SG) E-8 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Master Leaders Course.
(2) Military Study: Continue mastery of all previous publications and pursue functional courses to understand how the Army runs.
(3) Development Focus: Engage in self-motivated professional reading; hone organizational leadership skills needed to teach, coach, and mentor Soldiers.', '5ba3d4a9c0be3cc4d1dd9b42d237e5ac8f959f468decebfe8d4366e6efb9ec73', 6, 6, null, 75, null, null, false, null),
  ('709e4031-2c36-51c1-aeb5-c509d0b6279d', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15P', null, 'development', 'E-9', null, 'Sergeant Major/Command Sergeant Major (SGM/CSM) E-9 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Sergeants Major Academy.
(2) Military Study: Possess outstanding communication and public speaking skills.
(3) Development Focus: Study world politics, geo-political issues (DIMEFIL), and field manuals relating to Army OPS and current battle doctrine.', '9dfdf76e95746dff858bb5fda5a42fb24d829bb2a91373f728a009ede2d1d5ad', 6, 6, null, 76, null, null, false, null),
  ('7a768171-1499-57a6-bfaa-5c8f8a220da7', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Q', null, 'promotion_criteria', null, null, 'Qualification indicators (promotion consideration)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', 'b. Most Qualified Indicators (SSG and SFC)
(1) Key Development Positions: 30-36 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Distinguished Honor Graduate, Honor Graduate, or Commandant List. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Working towards a completed associate''s degree. Obtaining Federal Aviation Administration (FAA) sponsored certificates and other MOS- related certifications from the COOL website.
b. SFC: Completed associate''s degree and working towards a bachelor''s degree. Obtaining FAA sponsored certificates and other MOS-related certifications.
c. All Ranks: Distinguished Leader Award, Lean Six Sigma Black Belt.
(4) Physical Fitness: AFT score of 450 or above, with a score of 90 in each event, without event substitution. NCOs on permanent profile should strive to reach 80 points in participable events.
(5) Training: (Completing two or more courses, a pattern of consistently completing military training is recommended)
a. SSG: Battle Staff, Mission Command Digital Master Gunner Course, Equal Opportunity Leaders (EOL) Course, Sexual Harassment/Assault Response & Prevention (SHARP) Level I, Health and Holistic Fitness Integrator Course (H2F-I).
b. SFC: Army Knowledge Management Qualification Course, Battle Staff, Mission Command Digital Master Gunner Course.
(6) Assignments:
a. SSG: Drill Sergeant, CTC Observer/Coach Trainer, Special Mission Unit, Special Operations Aviation.
b. SFC: Senior Drill Sergeant, Small Group Leader, Aviation Proponent NCO, Talent Manager NCO, Special Mission Unit, Special Operations Aviation.
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(7) Other Indicators: Expert Soldier Badge, Iron Sergeant, SGT Audie Murphy Club Inductee, SGT Morales Club Inductee, Military Outstanding Volunteer Service Medal (MOVSM), Army Best Squad of the Year, Drill Sergeant of the Year, NCO of the Year, Trainer of the Year (AAAA Functional Award), James H. McClellan Safety (AAAA National Award), Rodney J.T. Yano Non-Commissioned Officer of the Year (AAAA National Award), Gary G. Wetzel Army Aviation Soldier of the Year (AAAA National Award), Master Army Instructor Badge (MAIB), Army Gold Recruiter Badge, Professional Military Writing for peer reviewed articles (Published).
c. Highly Qualified Indicators (SSG and SFC)
(1) (1) Key Development Positions: 24-30 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Recognition for achieving Superior Academic Achievement. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Obtaining FAA sponsored certificates and other MOS-related certifications.
b. SFC: Working towards an associate''s degree and obtaining FAA sponsored certificates.
c. All Ranks: Lean Six Sigma Green or Yellow Belt.
(1) Physical Fitness: AFT score of 400 or above, with a score of 80 in each event, without event substitution.
(2) Training: (Completing one or more courses, a pattern of consistently completing military training is recommended)
a. SSG: SERE-C, Ranger, Airborne, Air Assault.
b. SFC: SHARP Intermediate Course Graduate, Equal Opportunity Leader (EOL) Course, Health and Holistic Fitness Integrator Course (H2F-I). Airborne, Air Assault, SERE-C, Ranger.
(3) Assignments:
a. SSG: Recruiter, Small Group Leader, Instructor, Training Developer, Doctrine Developer
b. SFC: Recruiter, Training Developer, Doctrine Developer, Test and Evaluation NCO
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(4) Other Indicators: Order of St. Michael, NCOA Individual Physical Fitness Award, Senior Army Instructor Badge (SAIB), Drill Sergeant Leader, NCO of the Quarter, Army Silver Recruiter Badge.
d. Most Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 24+ months as a First Sergeant (most critical), Senior Aviation Operations Sergeant, or Air Traffic Control (ATC) Operations Chief.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) How the Army Runs, Capabilities Development, Manpower and Force Management, Army Knowledge Management, Battle Staff, Mission Command Digital Master Gunner, SHARP Intermediate, EOL, Health and Holistic Fitness Integrator Course (H2F-I), Airborne, Air Assault, SERE-C, Ranger.
(6) Assignments: Maximum of 36 months as an Equal Opportunity Advisor, Senior DARR NCO, Assistant Commandant, Proponent NCO, or Talent Management NCO. MSG/1SG within Special Mission Units will have completed 60 months within SMU and possess either SQI “C” or “T” with high enumerations not necessarily consecutive
e. Highly Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 18-24 months as a First Sergeant, Senior Aviation Operations Sergeant, or ATC Operations Chief.
(2) PME: Recognition for achieving Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified."
(6) Assignments: Maximum of 36 months in broadening roles with mid-level enumerations.
f. Most Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 24+ months as a Command Sergeant Major or Operations Sergeant Major.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a master''s degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc
g. Highly Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 18-24 months as a Command Sergeant Major or Operations Sergeant Major with mid-level enumerations.
(2) PME: Recognition for Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc.', 'b802e09ac7ec68111626627b291fb97face87a25b2a025a264b29e4e59b4e057', 2, 5, null, 77, null, null, false, null),
  ('9bb4f691-feb8-5c41-89b3-86c3841e9186', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Q', null, 'development', 'E-1..E-4', null, 'Private (PVT) E–1 to Specialist/Corporal (SPC/CPL) E-4 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Individual Training.
(2) Military Study: Master AR 670–1; STP 21–1–SMCT; TM 1-1500-204-23; ATP 3- 04.1; ATP 3-04.7; ADP 6-22; TC 3-04.71; TC 4-02.1; TC 7-22.7, and all unit-level maintenance manuals.
(3) PME: Seize the first opportunity to attend Basic Leaders Course (BLC) upon promotion to Specialist/E4.
(4) Civilian Education: Explore CLEP and DANTES; enroll in ArmyIgnitED to earn credits towards a degree (goal: 120 credits over a career). Obtain FAA and other MOS-related certifications.
(5) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(6) Training: SERE-C, Airborne, Air Assault, Ranger.', 'e2d474cdfce5b4725de655b9bf83245322fdaf1d3dbcdf360f4a3ac2b09b3564', 5, 5, null, 78, null, null, false, null),
  ('3ce15fdc-c6a7-5fa8-9336-36f38340643b', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Q', null, 'development', 'E-5', null, 'Sergeant (SGT) E-5 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Basic Leaders Course.
(2) Military Study: Master TC 7-22.7; ADP 6-22; STP 21–24–SMCT (Warrior Leader Skill Levels 2, 3, and 4); FM 6–22 Army Leadership, and all -10 level maintenance manuals.
(3) Development Focus: Self-motivated development becomes critical. Focus on broadening management and doctrinal knowledge (organizational behavior, personnel management, time management, Army OPS).
(4) PME: Strive for recognition as a Distinguished Honor Graduate, Honor Graduate, or on the Commandant’s List.
(5) Civilian Education: Enroll in a college degree program, pursuing credits towards an associate''s degree, with the career goal of completing a bachelor''s degree.
(6) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(7) Training: SERE-C, Airborne, Air Assault, Ranger, Health and Holistic Fitness Integrator Course (H2F-I).', 'baebad57980ec8a346047c483e0ea1762325cb24e92d3dc3b8f0a50fbe9bdc04', 5, 6, null, 79, null, null, false, null),
  ('8f27eb82-a5ad-5d38-add2-14e634ef2eee', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Q', null, 'development', 'E-6', null, 'Staff Sergeant (SSG) E-6 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Leaders Course.
(2) Military Study: Master STP 21–24; TC 7-22.7; TC 3-04.71; ADP 6-22; ATP 3- 04.1; ATP 3-04.7.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', 'cd3e7ab3527bdbebe1fea3ef639c7237e62b98616130dd62aa78a87e943253a5', 6, 6, null, 80, null, null, false, null),
  ('2ae103ae-f558-5f37-8ff8-e495eaf7ce05', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Q', null, 'development', 'E-7', null, 'Sergeant First Class (SFC) E-7 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Senior Leaders Course.
(2) Military Study: Master AR 350–1; AR 750–1; ATP 3-04.13; ATP 3-04.1; ADP 6- 22; TC 7-22.7; TC 3-04.07; TC 3-04.11; TC 3-04.71.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', '43f814013258f502e48fa4eb20d1af764bcc15c9c60897d1fca297d1068c9172', 6, 6, null, 81, null, null, false, null),
  ('10a77cd7-5270-5e2d-b97e-9da62ca96cad', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Q', null, 'development', 'E-8', null, 'Master Sergeant/First Sergeant (MSG/1SG) E-8 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Master Leaders Course.
(2) Military Study: Continue mastery of all previous publications and pursue functional courses to understand how the Army runs.
(3) Development Focus: Engage in self-motivated professional reading; hone organizational leadership skills needed to teach, coach, and mentor Soldiers.', '5ba3d4a9c0be3cc4d1dd9b42d237e5ac8f959f468decebfe8d4366e6efb9ec73', 6, 6, null, 82, null, null, false, null),
  ('767602a3-3d71-5fc3-b908-ec5388f45380', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Q', null, 'development', 'E-9', null, 'Sergeant Major/Command Sergeant Major (SGM/CSM) E-9 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Sergeants Major Academy.
(2) Military Study: Possess outstanding communication and public speaking skills.
(3) Development Focus: Study world politics, geo-political issues (DIMEFIL), and field manuals relating to Army OPS and current battle doctrine.', '9dfdf76e95746dff858bb5fda5a42fb24d829bb2a91373f728a009ede2d1d5ad', 6, 6, null, 83, null, null, false, null),
  ('022eb214-d5dc-5454-b4bc-3d15c366a687', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15R', null, 'promotion_criteria', null, null, 'Qualification indicators (promotion consideration)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', 'b. Most Qualified Indicators (SSG and SFC)
(1) Key Development Positions: 30-36 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Distinguished Honor Graduate, Honor Graduate, or Commandant List. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Working towards a completed associate''s degree. Obtaining Federal Aviation Administration (FAA) sponsored certificates and other MOS- related certifications from the COOL website.
b. SFC: Completed associate''s degree and working towards a bachelor''s degree. Obtaining FAA sponsored certificates and other MOS-related certifications.
c. All Ranks: Distinguished Leader Award, Lean Six Sigma Black Belt.
(4) Physical Fitness: AFT score of 450 or above, with a score of 90 in each event, without event substitution. NCOs on permanent profile should strive to reach 80 points in participable events.
(5) Training: (Completing two or more courses, a pattern of consistently completing military training is recommended)
a. SSG: Battle Staff, Mission Command Digital Master Gunner Course, Equal Opportunity Leaders (EOL) Course, Sexual Harassment/Assault Response & Prevention (SHARP) Level I, Health and Holistic Fitness Integrator Course (H2F-I).
b. SFC: Army Knowledge Management Qualification Course, Battle Staff, Mission Command Digital Master Gunner Course.
(6) Assignments:
a. SSG: Drill Sergeant, CTC Observer/Coach Trainer, Special Mission Unit, Special Operations Aviation.
b. SFC: Senior Drill Sergeant, Small Group Leader, Aviation Proponent NCO, Talent Manager NCO, Special Mission Unit, Special Operations Aviation.
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(7) Other Indicators: Expert Soldier Badge, Iron Sergeant, SGT Audie Murphy Club Inductee, SGT Morales Club Inductee, Military Outstanding Volunteer Service Medal (MOVSM), Army Best Squad of the Year, Drill Sergeant of the Year, NCO of the Year, Trainer of the Year (AAAA Functional Award), James H. McClellan Safety (AAAA National Award), Rodney J.T. Yano Non-Commissioned Officer of the Year (AAAA National Award), Gary G. Wetzel Army Aviation Soldier of the Year (AAAA National Award), Master Army Instructor Badge (MAIB), Army Gold Recruiter Badge, Professional Military Writing for peer reviewed articles (Published).
c. Highly Qualified Indicators (SSG and SFC)
(1) (1) Key Development Positions: 24-30 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Recognition for achieving Superior Academic Achievement. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Obtaining FAA sponsored certificates and other MOS-related certifications.
b. SFC: Working towards an associate''s degree and obtaining FAA sponsored certificates.
c. All Ranks: Lean Six Sigma Green or Yellow Belt.
(1) Physical Fitness: AFT score of 400 or above, with a score of 80 in each event, without event substitution.
(2) Training: (Completing one or more courses, a pattern of consistently completing military training is recommended)
a. SSG: SERE-C, Ranger, Airborne, Air Assault.
b. SFC: SHARP Intermediate Course Graduate, Equal Opportunity Leader (EOL) Course, Health and Holistic Fitness Integrator Course (H2F-I). Airborne, Air Assault, SERE-C, Ranger.
(3) Assignments:
a. SSG: Recruiter, Small Group Leader, Instructor, Training Developer, Doctrine Developer
b. SFC: Recruiter, Training Developer, Doctrine Developer, Test and Evaluation NCO
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(4) Other Indicators: Order of St. Michael, NCOA Individual Physical Fitness Award, Senior Army Instructor Badge (SAIB), Drill Sergeant Leader, NCO of the Quarter, Army Silver Recruiter Badge.
d. Most Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 24+ months as a First Sergeant (most critical), Senior Aviation Operations Sergeant, or Air Traffic Control (ATC) Operations Chief.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) How the Army Runs, Capabilities Development, Manpower and Force Management, Army Knowledge Management, Battle Staff, Mission Command Digital Master Gunner, SHARP Intermediate, EOL, Health and Holistic Fitness Integrator Course (H2F-I), Airborne, Air Assault, SERE-C, Ranger.
(6) Assignments: Maximum of 36 months as an Equal Opportunity Advisor, Senior DARR NCO, Assistant Commandant, Proponent NCO, or Talent Management NCO. MSG/1SG within Special Mission Units will have completed 60 months within SMU and possess either SQI “C” or “T” with high enumerations not necessarily consecutive
e. Highly Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 18-24 months as a First Sergeant, Senior Aviation Operations Sergeant, or ATC Operations Chief.
(2) PME: Recognition for achieving Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified."
(6) Assignments: Maximum of 36 months in broadening roles with mid-level enumerations.
f. Most Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 24+ months as a Command Sergeant Major or Operations Sergeant Major.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a master''s degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc
g. Highly Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 18-24 months as a Command Sergeant Major or Operations Sergeant Major with mid-level enumerations.
(2) PME: Recognition for Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc.', 'b802e09ac7ec68111626627b291fb97face87a25b2a025a264b29e4e59b4e057', 2, 5, null, 84, null, null, false, null),
  ('8c745ae3-95d0-5f36-9e07-ef2db9b08f0b', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15R', null, 'development', 'E-1..E-4', null, 'Private (PVT) E–1 to Specialist/Corporal (SPC/CPL) E-4 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Individual Training.
(2) Military Study: Master AR 670–1; STP 21–1–SMCT; TM 1-1500-204-23; ATP 3- 04.1; ATP 3-04.7; ADP 6-22; TC 3-04.71; TC 4-02.1; TC 7-22.7, and all unit-level maintenance manuals.
(3) PME: Seize the first opportunity to attend Basic Leaders Course (BLC) upon promotion to Specialist/E4.
(4) Civilian Education: Explore CLEP and DANTES; enroll in ArmyIgnitED to earn credits towards a degree (goal: 120 credits over a career). Obtain FAA and other MOS-related certifications.
(5) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(6) Training: SERE-C, Airborne, Air Assault, Ranger.', 'e2d474cdfce5b4725de655b9bf83245322fdaf1d3dbcdf360f4a3ac2b09b3564', 5, 5, null, 85, null, null, false, null),
  ('6dbe088e-22ea-5992-8608-8e1248526bc6', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15R', null, 'development', 'E-5', null, 'Sergeant (SGT) E-5 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Basic Leaders Course.
(2) Military Study: Master TC 7-22.7; ADP 6-22; STP 21–24–SMCT (Warrior Leader Skill Levels 2, 3, and 4); FM 6–22 Army Leadership, and all -10 level maintenance manuals.
(3) Development Focus: Self-motivated development becomes critical. Focus on broadening management and doctrinal knowledge (organizational behavior, personnel management, time management, Army OPS).
(4) PME: Strive for recognition as a Distinguished Honor Graduate, Honor Graduate, or on the Commandant’s List.
(5) Civilian Education: Enroll in a college degree program, pursuing credits towards an associate''s degree, with the career goal of completing a bachelor''s degree.
(6) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(7) Training: SERE-C, Airborne, Air Assault, Ranger, Health and Holistic Fitness Integrator Course (H2F-I).', 'baebad57980ec8a346047c483e0ea1762325cb24e92d3dc3b8f0a50fbe9bdc04', 5, 6, null, 86, null, null, false, null),
  ('d66f80c9-fecc-5416-a551-690f5414c9fb', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15R', null, 'development', 'E-6', null, 'Staff Sergeant (SSG) E-6 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Leaders Course.
(2) Military Study: Master STP 21–24; TC 7-22.7; TC 3-04.71; ADP 6-22; ATP 3- 04.1; ATP 3-04.7.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', 'cd3e7ab3527bdbebe1fea3ef639c7237e62b98616130dd62aa78a87e943253a5', 6, 6, null, 87, null, null, false, null),
  ('8dd689d0-d18d-5716-909d-37a8821834f6', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15R', null, 'development', 'E-7', null, 'Sergeant First Class (SFC) E-7 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Senior Leaders Course.
(2) Military Study: Master AR 350–1; AR 750–1; ATP 3-04.13; ATP 3-04.1; ADP 6- 22; TC 7-22.7; TC 3-04.07; TC 3-04.11; TC 3-04.71.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', '43f814013258f502e48fa4eb20d1af764bcc15c9c60897d1fca297d1068c9172', 6, 6, null, 88, null, null, false, null),
  ('78d31bfc-90ff-5a0b-a832-e5a9e8a8c850', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15R', null, 'development', 'E-8', null, 'Master Sergeant/First Sergeant (MSG/1SG) E-8 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Master Leaders Course.
(2) Military Study: Continue mastery of all previous publications and pursue functional courses to understand how the Army runs.
(3) Development Focus: Engage in self-motivated professional reading; hone organizational leadership skills needed to teach, coach, and mentor Soldiers.', '5ba3d4a9c0be3cc4d1dd9b42d237e5ac8f959f468decebfe8d4366e6efb9ec73', 6, 6, null, 89, null, null, false, null),
  ('76b43db8-dd49-5d91-85a5-a8dc9c11bb9f', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15R', null, 'development', 'E-9', null, 'Sergeant Major/Command Sergeant Major (SGM/CSM) E-9 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Sergeants Major Academy.
(2) Military Study: Possess outstanding communication and public speaking skills.
(3) Development Focus: Study world politics, geo-political issues (DIMEFIL), and field manuals relating to Army OPS and current battle doctrine.', '9dfdf76e95746dff858bb5fda5a42fb24d829bb2a91373f728a009ede2d1d5ad', 6, 6, null, 90, null, null, false, null),
  ('51d90072-1d0d-5ebd-ade7-4238c7dc5f60', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15T', null, 'promotion_criteria', null, null, 'Qualification indicators (promotion consideration)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', 'b. Most Qualified Indicators (SSG and SFC)
(1) Key Development Positions: 30-36 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Distinguished Honor Graduate, Honor Graduate, or Commandant List. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Working towards a completed associate''s degree. Obtaining Federal Aviation Administration (FAA) sponsored certificates and other MOS- related certifications from the COOL website.
b. SFC: Completed associate''s degree and working towards a bachelor''s degree. Obtaining FAA sponsored certificates and other MOS-related certifications.
c. All Ranks: Distinguished Leader Award, Lean Six Sigma Black Belt.
(4) Physical Fitness: AFT score of 450 or above, with a score of 90 in each event, without event substitution. NCOs on permanent profile should strive to reach 80 points in participable events.
(5) Training: (Completing two or more courses, a pattern of consistently completing military training is recommended)
a. SSG: Battle Staff, Mission Command Digital Master Gunner Course, Equal Opportunity Leaders (EOL) Course, Sexual Harassment/Assault Response & Prevention (SHARP) Level I, Health and Holistic Fitness Integrator Course (H2F-I).
b. SFC: Army Knowledge Management Qualification Course, Battle Staff, Mission Command Digital Master Gunner Course.
(6) Assignments:
a. SSG: Drill Sergeant, CTC Observer/Coach Trainer, Special Mission Unit, Special Operations Aviation.
b. SFC: Senior Drill Sergeant, Small Group Leader, Aviation Proponent NCO, Talent Manager NCO, Special Mission Unit, Special Operations Aviation.
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(7) Other Indicators: Expert Soldier Badge, Iron Sergeant, SGT Audie Murphy Club Inductee, SGT Morales Club Inductee, Military Outstanding Volunteer Service Medal (MOVSM), Army Best Squad of the Year, Drill Sergeant of the Year, NCO of the Year, Trainer of the Year (AAAA Functional Award), James H. McClellan Safety (AAAA National Award), Rodney J.T. Yano Non-Commissioned Officer of the Year (AAAA National Award), Gary G. Wetzel Army Aviation Soldier of the Year (AAAA National Award), Master Army Instructor Badge (MAIB), Army Gold Recruiter Badge, Professional Military Writing for peer reviewed articles (Published).
c. Highly Qualified Indicators (SSG and SFC)
(1) (1) Key Development Positions: 24-30 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Recognition for achieving Superior Academic Achievement. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Obtaining FAA sponsored certificates and other MOS-related certifications.
b. SFC: Working towards an associate''s degree and obtaining FAA sponsored certificates.
c. All Ranks: Lean Six Sigma Green or Yellow Belt.
(1) Physical Fitness: AFT score of 400 or above, with a score of 80 in each event, without event substitution.
(2) Training: (Completing one or more courses, a pattern of consistently completing military training is recommended)
a. SSG: SERE-C, Ranger, Airborne, Air Assault.
b. SFC: SHARP Intermediate Course Graduate, Equal Opportunity Leader (EOL) Course, Health and Holistic Fitness Integrator Course (H2F-I). Airborne, Air Assault, SERE-C, Ranger.
(3) Assignments:
a. SSG: Recruiter, Small Group Leader, Instructor, Training Developer, Doctrine Developer
b. SFC: Recruiter, Training Developer, Doctrine Developer, Test and Evaluation NCO
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(4) Other Indicators: Order of St. Michael, NCOA Individual Physical Fitness Award, Senior Army Instructor Badge (SAIB), Drill Sergeant Leader, NCO of the Quarter, Army Silver Recruiter Badge.
d. Most Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 24+ months as a First Sergeant (most critical), Senior Aviation Operations Sergeant, or Air Traffic Control (ATC) Operations Chief.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) How the Army Runs, Capabilities Development, Manpower and Force Management, Army Knowledge Management, Battle Staff, Mission Command Digital Master Gunner, SHARP Intermediate, EOL, Health and Holistic Fitness Integrator Course (H2F-I), Airborne, Air Assault, SERE-C, Ranger.
(6) Assignments: Maximum of 36 months as an Equal Opportunity Advisor, Senior DARR NCO, Assistant Commandant, Proponent NCO, or Talent Management NCO. MSG/1SG within Special Mission Units will have completed 60 months within SMU and possess either SQI “C” or “T” with high enumerations not necessarily consecutive
e. Highly Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 18-24 months as a First Sergeant, Senior Aviation Operations Sergeant, or ATC Operations Chief.
(2) PME: Recognition for achieving Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified."
(6) Assignments: Maximum of 36 months in broadening roles with mid-level enumerations.
f. Most Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 24+ months as a Command Sergeant Major or Operations Sergeant Major.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a master''s degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc
g. Highly Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 18-24 months as a Command Sergeant Major or Operations Sergeant Major with mid-level enumerations.
(2) PME: Recognition for Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc.', 'b802e09ac7ec68111626627b291fb97face87a25b2a025a264b29e4e59b4e057', 2, 5, null, 91, null, null, false, null),
  ('b1cf9467-42eb-5d75-9939-b15cccddc297', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15T', null, 'development', 'E-1..E-4', null, 'Private (PVT) E–1 to Specialist/Corporal (SPC/CPL) E-4 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Individual Training.
(2) Military Study: Master AR 670–1; STP 21–1–SMCT; TM 1-1500-204-23; ATP 3- 04.1; ATP 3-04.7; ADP 6-22; TC 3-04.71; TC 4-02.1; TC 7-22.7, and all unit-level maintenance manuals.
(3) PME: Seize the first opportunity to attend Basic Leaders Course (BLC) upon promotion to Specialist/E4.
(4) Civilian Education: Explore CLEP and DANTES; enroll in ArmyIgnitED to earn credits towards a degree (goal: 120 credits over a career). Obtain FAA and other MOS-related certifications.
(5) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(6) Training: SERE-C, Airborne, Air Assault, Ranger.', 'e2d474cdfce5b4725de655b9bf83245322fdaf1d3dbcdf360f4a3ac2b09b3564', 5, 5, null, 92, null, null, false, null),
  ('e4d259c5-958a-5238-ab67-9d5e6a407f49', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15T', null, 'development', 'E-5', null, 'Sergeant (SGT) E-5 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Basic Leaders Course.
(2) Military Study: Master TC 7-22.7; ADP 6-22; STP 21–24–SMCT (Warrior Leader Skill Levels 2, 3, and 4); FM 6–22 Army Leadership, and all -10 level maintenance manuals.
(3) Development Focus: Self-motivated development becomes critical. Focus on broadening management and doctrinal knowledge (organizational behavior, personnel management, time management, Army OPS).
(4) PME: Strive for recognition as a Distinguished Honor Graduate, Honor Graduate, or on the Commandant’s List.
(5) Civilian Education: Enroll in a college degree program, pursuing credits towards an associate''s degree, with the career goal of completing a bachelor''s degree.
(6) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(7) Training: SERE-C, Airborne, Air Assault, Ranger, Health and Holistic Fitness Integrator Course (H2F-I).', 'baebad57980ec8a346047c483e0ea1762325cb24e92d3dc3b8f0a50fbe9bdc04', 5, 6, null, 93, null, null, false, null),
  ('41060ec6-463d-5c67-a054-722edb2cf803', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15T', null, 'development', 'E-6', null, 'Staff Sergeant (SSG) E-6 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Leaders Course.
(2) Military Study: Master STP 21–24; TC 7-22.7; TC 3-04.71; ADP 6-22; ATP 3- 04.1; ATP 3-04.7.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', 'cd3e7ab3527bdbebe1fea3ef639c7237e62b98616130dd62aa78a87e943253a5', 6, 6, null, 94, null, null, false, null),
  ('eb8e2f8b-2bac-51e3-9068-a1f4b176a37a', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15T', null, 'development', 'E-7', null, 'Sergeant First Class (SFC) E-7 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Senior Leaders Course.
(2) Military Study: Master AR 350–1; AR 750–1; ATP 3-04.13; ATP 3-04.1; ADP 6- 22; TC 7-22.7; TC 3-04.07; TC 3-04.11; TC 3-04.71.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', '43f814013258f502e48fa4eb20d1af764bcc15c9c60897d1fca297d1068c9172', 6, 6, null, 95, null, null, false, null),
  ('271516d6-15e0-5c5a-a0d1-f7d68ef96ad8', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15T', null, 'development', 'E-8', null, 'Master Sergeant/First Sergeant (MSG/1SG) E-8 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Master Leaders Course.
(2) Military Study: Continue mastery of all previous publications and pursue functional courses to understand how the Army runs.
(3) Development Focus: Engage in self-motivated professional reading; hone organizational leadership skills needed to teach, coach, and mentor Soldiers.', '5ba3d4a9c0be3cc4d1dd9b42d237e5ac8f959f468decebfe8d4366e6efb9ec73', 6, 6, null, 96, null, null, false, null),
  ('af9b940c-5111-5136-b5a3-1c116b0b4fb7', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15T', null, 'development', 'E-9', null, 'Sergeant Major/Command Sergeant Major (SGM/CSM) E-9 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Sergeants Major Academy.
(2) Military Study: Possess outstanding communication and public speaking skills.
(3) Development Focus: Study world politics, geo-political issues (DIMEFIL), and field manuals relating to Army OPS and current battle doctrine.', '9dfdf76e95746dff858bb5fda5a42fb24d829bb2a91373f728a009ede2d1d5ad', 6, 6, null, 97, null, null, false, null),
  ('61ca3965-4653-5203-b576-b2e22364ca50', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15U', null, 'promotion_criteria', null, null, 'Qualification indicators (promotion consideration)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', 'b. Most Qualified Indicators (SSG and SFC)
(1) Key Development Positions: 30-36 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Distinguished Honor Graduate, Honor Graduate, or Commandant List. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Working towards a completed associate''s degree. Obtaining Federal Aviation Administration (FAA) sponsored certificates and other MOS- related certifications from the COOL website.
b. SFC: Completed associate''s degree and working towards a bachelor''s degree. Obtaining FAA sponsored certificates and other MOS-related certifications.
c. All Ranks: Distinguished Leader Award, Lean Six Sigma Black Belt.
(4) Physical Fitness: AFT score of 450 or above, with a score of 90 in each event, without event substitution. NCOs on permanent profile should strive to reach 80 points in participable events.
(5) Training: (Completing two or more courses, a pattern of consistently completing military training is recommended)
a. SSG: Battle Staff, Mission Command Digital Master Gunner Course, Equal Opportunity Leaders (EOL) Course, Sexual Harassment/Assault Response & Prevention (SHARP) Level I, Health and Holistic Fitness Integrator Course (H2F-I).
b. SFC: Army Knowledge Management Qualification Course, Battle Staff, Mission Command Digital Master Gunner Course.
(6) Assignments:
a. SSG: Drill Sergeant, CTC Observer/Coach Trainer, Special Mission Unit, Special Operations Aviation.
b. SFC: Senior Drill Sergeant, Small Group Leader, Aviation Proponent NCO, Talent Manager NCO, Special Mission Unit, Special Operations Aviation.
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(7) Other Indicators: Expert Soldier Badge, Iron Sergeant, SGT Audie Murphy Club Inductee, SGT Morales Club Inductee, Military Outstanding Volunteer Service Medal (MOVSM), Army Best Squad of the Year, Drill Sergeant of the Year, NCO of the Year, Trainer of the Year (AAAA Functional Award), James H. McClellan Safety (AAAA National Award), Rodney J.T. Yano Non-Commissioned Officer of the Year (AAAA National Award), Gary G. Wetzel Army Aviation Soldier of the Year (AAAA National Award), Master Army Instructor Badge (MAIB), Army Gold Recruiter Badge, Professional Military Writing for peer reviewed articles (Published).
c. Highly Qualified Indicators (SSG and SFC)
(1) (1) Key Development Positions: 24-30 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Recognition for achieving Superior Academic Achievement. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Obtaining FAA sponsored certificates and other MOS-related certifications.
b. SFC: Working towards an associate''s degree and obtaining FAA sponsored certificates.
c. All Ranks: Lean Six Sigma Green or Yellow Belt.
(1) Physical Fitness: AFT score of 400 or above, with a score of 80 in each event, without event substitution.
(2) Training: (Completing one or more courses, a pattern of consistently completing military training is recommended)
a. SSG: SERE-C, Ranger, Airborne, Air Assault.
b. SFC: SHARP Intermediate Course Graduate, Equal Opportunity Leader (EOL) Course, Health and Holistic Fitness Integrator Course (H2F-I). Airborne, Air Assault, SERE-C, Ranger.
(3) Assignments:
a. SSG: Recruiter, Small Group Leader, Instructor, Training Developer, Doctrine Developer
b. SFC: Recruiter, Training Developer, Doctrine Developer, Test and Evaluation NCO
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(4) Other Indicators: Order of St. Michael, NCOA Individual Physical Fitness Award, Senior Army Instructor Badge (SAIB), Drill Sergeant Leader, NCO of the Quarter, Army Silver Recruiter Badge.
d. Most Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 24+ months as a First Sergeant (most critical), Senior Aviation Operations Sergeant, or Air Traffic Control (ATC) Operations Chief.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) How the Army Runs, Capabilities Development, Manpower and Force Management, Army Knowledge Management, Battle Staff, Mission Command Digital Master Gunner, SHARP Intermediate, EOL, Health and Holistic Fitness Integrator Course (H2F-I), Airborne, Air Assault, SERE-C, Ranger.
(6) Assignments: Maximum of 36 months as an Equal Opportunity Advisor, Senior DARR NCO, Assistant Commandant, Proponent NCO, or Talent Management NCO. MSG/1SG within Special Mission Units will have completed 60 months within SMU and possess either SQI “C” or “T” with high enumerations not necessarily consecutive
e. Highly Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 18-24 months as a First Sergeant, Senior Aviation Operations Sergeant, or ATC Operations Chief.
(2) PME: Recognition for achieving Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified."
(6) Assignments: Maximum of 36 months in broadening roles with mid-level enumerations.
f. Most Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 24+ months as a Command Sergeant Major or Operations Sergeant Major.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a master''s degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc
g. Highly Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 18-24 months as a Command Sergeant Major or Operations Sergeant Major with mid-level enumerations.
(2) PME: Recognition for Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc.', 'b802e09ac7ec68111626627b291fb97face87a25b2a025a264b29e4e59b4e057', 2, 5, null, 98, null, null, false, null),
  ('8b5e9e67-5385-5a41-84eb-232fa54a6d3f', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15U', null, 'development', 'E-1..E-4', null, 'Private (PVT) E–1 to Specialist/Corporal (SPC/CPL) E-4 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Individual Training.
(2) Military Study: Master AR 670–1; STP 21–1–SMCT; TM 1-1500-204-23; ATP 3- 04.1; ATP 3-04.7; ADP 6-22; TC 3-04.71; TC 4-02.1; TC 7-22.7, and all unit-level maintenance manuals.
(3) PME: Seize the first opportunity to attend Basic Leaders Course (BLC) upon promotion to Specialist/E4.
(4) Civilian Education: Explore CLEP and DANTES; enroll in ArmyIgnitED to earn credits towards a degree (goal: 120 credits over a career). Obtain FAA and other MOS-related certifications.
(5) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(6) Training: SERE-C, Airborne, Air Assault, Ranger.', 'e2d474cdfce5b4725de655b9bf83245322fdaf1d3dbcdf360f4a3ac2b09b3564', 5, 5, null, 99, null, null, false, null),
  ('628b461e-6ce8-5e56-983b-f12fa17bca79', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15U', null, 'development', 'E-5', null, 'Sergeant (SGT) E-5 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Basic Leaders Course.
(2) Military Study: Master TC 7-22.7; ADP 6-22; STP 21–24–SMCT (Warrior Leader Skill Levels 2, 3, and 4); FM 6–22 Army Leadership, and all -10 level maintenance manuals.
(3) Development Focus: Self-motivated development becomes critical. Focus on broadening management and doctrinal knowledge (organizational behavior, personnel management, time management, Army OPS).
(4) PME: Strive for recognition as a Distinguished Honor Graduate, Honor Graduate, or on the Commandant’s List.
(5) Civilian Education: Enroll in a college degree program, pursuing credits towards an associate''s degree, with the career goal of completing a bachelor''s degree.
(6) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(7) Training: SERE-C, Airborne, Air Assault, Ranger, Health and Holistic Fitness Integrator Course (H2F-I).', 'baebad57980ec8a346047c483e0ea1762325cb24e92d3dc3b8f0a50fbe9bdc04', 5, 6, null, 100, null, null, false, null),
  ('57e15391-5cc5-50b6-ac75-8f97c1b470ac', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15U', null, 'development', 'E-6', null, 'Staff Sergeant (SSG) E-6 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Leaders Course.
(2) Military Study: Master STP 21–24; TC 7-22.7; TC 3-04.71; ADP 6-22; ATP 3- 04.1; ATP 3-04.7.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', 'cd3e7ab3527bdbebe1fea3ef639c7237e62b98616130dd62aa78a87e943253a5', 6, 6, null, 101, null, null, false, null),
  ('91b823ac-f56e-57c5-a270-2f8cd8bd4be2', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15U', null, 'development', 'E-7', null, 'Sergeant First Class (SFC) E-7 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Senior Leaders Course.
(2) Military Study: Master AR 350–1; AR 750–1; ATP 3-04.13; ATP 3-04.1; ADP 6- 22; TC 7-22.7; TC 3-04.07; TC 3-04.11; TC 3-04.71.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', '43f814013258f502e48fa4eb20d1af764bcc15c9c60897d1fca297d1068c9172', 6, 6, null, 102, null, null, false, null),
  ('2bc9851a-c3b2-59ef-a34d-3a29f387cddb', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15U', null, 'development', 'E-8', null, 'Master Sergeant/First Sergeant (MSG/1SG) E-8 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Master Leaders Course.
(2) Military Study: Continue mastery of all previous publications and pursue functional courses to understand how the Army runs.
(3) Development Focus: Engage in self-motivated professional reading; hone organizational leadership skills needed to teach, coach, and mentor Soldiers.', '5ba3d4a9c0be3cc4d1dd9b42d237e5ac8f959f468decebfe8d4366e6efb9ec73', 6, 6, null, 103, null, null, false, null),
  ('02a06f1c-422c-555e-87fa-13991c478cbe', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15U', null, 'development', 'E-9', null, 'Sergeant Major/Command Sergeant Major (SGM/CSM) E-9 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Sergeants Major Academy.
(2) Military Study: Possess outstanding communication and public speaking skills.
(3) Development Focus: Study world politics, geo-political issues (DIMEFIL), and field manuals relating to Army OPS and current battle doctrine.', '9dfdf76e95746dff858bb5fda5a42fb24d829bb2a91373f728a009ede2d1d5ad', 6, 6, null, 104, null, null, false, null),
  ('e3510768-f616-5e74-b101-d9dca8df932c', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15X', null, 'promotion_criteria', null, null, 'Qualification indicators (promotion consideration)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', 'b. Most Qualified Indicators (SSG and SFC)
(1) Key Development Positions: 30-36 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Distinguished Honor Graduate, Honor Graduate, or Commandant List. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Working towards a completed associate''s degree. Obtaining Federal Aviation Administration (FAA) sponsored certificates and other MOS- related certifications from the COOL website.
b. SFC: Completed associate''s degree and working towards a bachelor''s degree. Obtaining FAA sponsored certificates and other MOS-related certifications.
c. All Ranks: Distinguished Leader Award, Lean Six Sigma Black Belt.
(4) Physical Fitness: AFT score of 450 or above, with a score of 90 in each event, without event substitution. NCOs on permanent profile should strive to reach 80 points in participable events.
(5) Training: (Completing two or more courses, a pattern of consistently completing military training is recommended)
a. SSG: Battle Staff, Mission Command Digital Master Gunner Course, Equal Opportunity Leaders (EOL) Course, Sexual Harassment/Assault Response & Prevention (SHARP) Level I, Health and Holistic Fitness Integrator Course (H2F-I).
b. SFC: Army Knowledge Management Qualification Course, Battle Staff, Mission Command Digital Master Gunner Course.
(6) Assignments:
a. SSG: Drill Sergeant, CTC Observer/Coach Trainer, Special Mission Unit, Special Operations Aviation.
b. SFC: Senior Drill Sergeant, Small Group Leader, Aviation Proponent NCO, Talent Manager NCO, Special Mission Unit, Special Operations Aviation.
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(7) Other Indicators: Expert Soldier Badge, Iron Sergeant, SGT Audie Murphy Club Inductee, SGT Morales Club Inductee, Military Outstanding Volunteer Service Medal (MOVSM), Army Best Squad of the Year, Drill Sergeant of the Year, NCO of the Year, Trainer of the Year (AAAA Functional Award), James H. McClellan Safety (AAAA National Award), Rodney J.T. Yano Non-Commissioned Officer of the Year (AAAA National Award), Gary G. Wetzel Army Aviation Soldier of the Year (AAAA National Award), Master Army Instructor Badge (MAIB), Army Gold Recruiter Badge, Professional Military Writing for peer reviewed articles (Published).
c. Highly Qualified Indicators (SSG and SFC)
(1) (1) Key Development Positions: 24-30 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Recognition for achieving Superior Academic Achievement. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Obtaining FAA sponsored certificates and other MOS-related certifications.
b. SFC: Working towards an associate''s degree and obtaining FAA sponsored certificates.
c. All Ranks: Lean Six Sigma Green or Yellow Belt.
(1) Physical Fitness: AFT score of 400 or above, with a score of 80 in each event, without event substitution.
(2) Training: (Completing one or more courses, a pattern of consistently completing military training is recommended)
a. SSG: SERE-C, Ranger, Airborne, Air Assault.
b. SFC: SHARP Intermediate Course Graduate, Equal Opportunity Leader (EOL) Course, Health and Holistic Fitness Integrator Course (H2F-I). Airborne, Air Assault, SERE-C, Ranger.
(3) Assignments:
a. SSG: Recruiter, Small Group Leader, Instructor, Training Developer, Doctrine Developer
b. SFC: Recruiter, Training Developer, Doctrine Developer, Test and Evaluation NCO
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(4) Other Indicators: Order of St. Michael, NCOA Individual Physical Fitness Award, Senior Army Instructor Badge (SAIB), Drill Sergeant Leader, NCO of the Quarter, Army Silver Recruiter Badge.
d. Most Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 24+ months as a First Sergeant (most critical), Senior Aviation Operations Sergeant, or Air Traffic Control (ATC) Operations Chief.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) How the Army Runs, Capabilities Development, Manpower and Force Management, Army Knowledge Management, Battle Staff, Mission Command Digital Master Gunner, SHARP Intermediate, EOL, Health and Holistic Fitness Integrator Course (H2F-I), Airborne, Air Assault, SERE-C, Ranger.
(6) Assignments: Maximum of 36 months as an Equal Opportunity Advisor, Senior DARR NCO, Assistant Commandant, Proponent NCO, or Talent Management NCO. MSG/1SG within Special Mission Units will have completed 60 months within SMU and possess either SQI “C” or “T” with high enumerations not necessarily consecutive
e. Highly Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 18-24 months as a First Sergeant, Senior Aviation Operations Sergeant, or ATC Operations Chief.
(2) PME: Recognition for achieving Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified."
(6) Assignments: Maximum of 36 months in broadening roles with mid-level enumerations.
f. Most Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 24+ months as a Command Sergeant Major or Operations Sergeant Major.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a master''s degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc
g. Highly Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 18-24 months as a Command Sergeant Major or Operations Sergeant Major with mid-level enumerations.
(2) PME: Recognition for Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc.', 'b802e09ac7ec68111626627b291fb97face87a25b2a025a264b29e4e59b4e057', 2, 5, null, 105, null, null, false, null),
  ('abc35c24-d409-54ec-a9f7-67d00dd193c3', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15X', null, 'development', 'E-1..E-4', null, 'Private (PVT) E–1 to Specialist/Corporal (SPC/CPL) E-4 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Individual Training.
(2) Military Study: Master AR 670–1; STP 21–1–SMCT; TM 1-1500-204-23; ATP 3- 04.1; ATP 3-04.7; ADP 6-22; TC 3-04.71; TC 4-02.1; TC 7-22.7, and all unit-level maintenance manuals.
(3) PME: Seize the first opportunity to attend Basic Leaders Course (BLC) upon promotion to Specialist/E4.
(4) Civilian Education: Explore CLEP and DANTES; enroll in ArmyIgnitED to earn credits towards a degree (goal: 120 credits over a career). Obtain FAA and other MOS-related certifications.
(5) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(6) Training: SERE-C, Airborne, Air Assault, Ranger.', 'e2d474cdfce5b4725de655b9bf83245322fdaf1d3dbcdf360f4a3ac2b09b3564', 5, 5, null, 106, null, null, false, null),
  ('bdca1c51-5757-5de9-98d5-371ef7d170ef', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15X', null, 'development', 'E-5', null, 'Sergeant (SGT) E-5 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Basic Leaders Course.
(2) Military Study: Master TC 7-22.7; ADP 6-22; STP 21–24–SMCT (Warrior Leader Skill Levels 2, 3, and 4); FM 6–22 Army Leadership, and all -10 level maintenance manuals.
(3) Development Focus: Self-motivated development becomes critical. Focus on broadening management and doctrinal knowledge (organizational behavior, personnel management, time management, Army OPS).
(4) PME: Strive for recognition as a Distinguished Honor Graduate, Honor Graduate, or on the Commandant’s List.
(5) Civilian Education: Enroll in a college degree program, pursuing credits towards an associate''s degree, with the career goal of completing a bachelor''s degree.
(6) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(7) Training: SERE-C, Airborne, Air Assault, Ranger, Health and Holistic Fitness Integrator Course (H2F-I).', 'baebad57980ec8a346047c483e0ea1762325cb24e92d3dc3b8f0a50fbe9bdc04', 5, 6, null, 107, null, null, false, null),
  ('b068bd7b-8623-59d5-ba83-a5129e28a407', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15X', null, 'development', 'E-6', null, 'Staff Sergeant (SSG) E-6 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Leaders Course.
(2) Military Study: Master STP 21–24; TC 7-22.7; TC 3-04.71; ADP 6-22; ATP 3- 04.1; ATP 3-04.7.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', 'cd3e7ab3527bdbebe1fea3ef639c7237e62b98616130dd62aa78a87e943253a5', 6, 6, null, 108, null, null, false, null),
  ('f68c3380-c0ce-5187-b785-df10ef65abdf', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15X', null, 'development', 'E-7', null, 'Sergeant First Class (SFC) E-7 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Senior Leaders Course.
(2) Military Study: Master AR 350–1; AR 750–1; ATP 3-04.13; ATP 3-04.1; ADP 6- 22; TC 7-22.7; TC 3-04.07; TC 3-04.11; TC 3-04.71.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', '43f814013258f502e48fa4eb20d1af764bcc15c9c60897d1fca297d1068c9172', 6, 6, null, 109, null, null, false, null),
  ('c67fbe03-c4e1-5906-beb6-3a79cb631b22', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15X', null, 'development', 'E-8', null, 'Master Sergeant/First Sergeant (MSG/1SG) E-8 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Master Leaders Course.
(2) Military Study: Continue mastery of all previous publications and pursue functional courses to understand how the Army runs.
(3) Development Focus: Engage in self-motivated professional reading; hone organizational leadership skills needed to teach, coach, and mentor Soldiers.', '5ba3d4a9c0be3cc4d1dd9b42d237e5ac8f959f468decebfe8d4366e6efb9ec73', 6, 6, null, 110, null, null, false, null),
  ('72b07429-67e4-53e0-b130-9f8ad3659905', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15X', null, 'development', 'E-9', null, 'Sergeant Major/Command Sergeant Major (SGM/CSM) E-9 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Sergeants Major Academy.
(2) Military Study: Possess outstanding communication and public speaking skills.
(3) Development Focus: Study world politics, geo-political issues (DIMEFIL), and field manuals relating to Army OPS and current battle doctrine.', '9dfdf76e95746dff858bb5fda5a42fb24d829bb2a91373f728a009ede2d1d5ad', 6, 6, null, 111, null, null, false, null),
  ('c14fde5f-5862-54fe-96b1-06867b157c90', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Y', null, 'promotion_criteria', null, null, 'Qualification indicators (promotion consideration)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', 'b. Most Qualified Indicators (SSG and SFC)
(1) Key Development Positions: 30-36 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Distinguished Honor Graduate, Honor Graduate, or Commandant List. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Working towards a completed associate''s degree. Obtaining Federal Aviation Administration (FAA) sponsored certificates and other MOS- related certifications from the COOL website.
b. SFC: Completed associate''s degree and working towards a bachelor''s degree. Obtaining FAA sponsored certificates and other MOS-related certifications.
c. All Ranks: Distinguished Leader Award, Lean Six Sigma Black Belt.
(4) Physical Fitness: AFT score of 450 or above, with a score of 90 in each event, without event substitution. NCOs on permanent profile should strive to reach 80 points in participable events.
(5) Training: (Completing two or more courses, a pattern of consistently completing military training is recommended)
a. SSG: Battle Staff, Mission Command Digital Master Gunner Course, Equal Opportunity Leaders (EOL) Course, Sexual Harassment/Assault Response & Prevention (SHARP) Level I, Health and Holistic Fitness Integrator Course (H2F-I).
b. SFC: Army Knowledge Management Qualification Course, Battle Staff, Mission Command Digital Master Gunner Course.
(6) Assignments:
a. SSG: Drill Sergeant, CTC Observer/Coach Trainer, Special Mission Unit, Special Operations Aviation.
b. SFC: Senior Drill Sergeant, Small Group Leader, Aviation Proponent NCO, Talent Manager NCO, Special Mission Unit, Special Operations Aviation.
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(7) Other Indicators: Expert Soldier Badge, Iron Sergeant, SGT Audie Murphy Club Inductee, SGT Morales Club Inductee, Military Outstanding Volunteer Service Medal (MOVSM), Army Best Squad of the Year, Drill Sergeant of the Year, NCO of the Year, Trainer of the Year (AAAA Functional Award), James H. McClellan Safety (AAAA National Award), Rodney J.T. Yano Non-Commissioned Officer of the Year (AAAA National Award), Gary G. Wetzel Army Aviation Soldier of the Year (AAAA National Award), Master Army Instructor Badge (MAIB), Army Gold Recruiter Badge, Professional Military Writing for peer reviewed articles (Published).
c. Highly Qualified Indicators (SSG and SFC)
(1) (1) Key Development Positions: 24-30 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Recognition for achieving Superior Academic Achievement. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Obtaining FAA sponsored certificates and other MOS-related certifications.
b. SFC: Working towards an associate''s degree and obtaining FAA sponsored certificates.
c. All Ranks: Lean Six Sigma Green or Yellow Belt.
(1) Physical Fitness: AFT score of 400 or above, with a score of 80 in each event, without event substitution.
(2) Training: (Completing one or more courses, a pattern of consistently completing military training is recommended)
a. SSG: SERE-C, Ranger, Airborne, Air Assault.
b. SFC: SHARP Intermediate Course Graduate, Equal Opportunity Leader (EOL) Course, Health and Holistic Fitness Integrator Course (H2F-I). Airborne, Air Assault, SERE-C, Ranger.
(3) Assignments:
a. SSG: Recruiter, Small Group Leader, Instructor, Training Developer, Doctrine Developer
b. SFC: Recruiter, Training Developer, Doctrine Developer, Test and Evaluation NCO
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(4) Other Indicators: Order of St. Michael, NCOA Individual Physical Fitness Award, Senior Army Instructor Badge (SAIB), Drill Sergeant Leader, NCO of the Quarter, Army Silver Recruiter Badge.
d. Most Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 24+ months as a First Sergeant (most critical), Senior Aviation Operations Sergeant, or Air Traffic Control (ATC) Operations Chief.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) How the Army Runs, Capabilities Development, Manpower and Force Management, Army Knowledge Management, Battle Staff, Mission Command Digital Master Gunner, SHARP Intermediate, EOL, Health and Holistic Fitness Integrator Course (H2F-I), Airborne, Air Assault, SERE-C, Ranger.
(6) Assignments: Maximum of 36 months as an Equal Opportunity Advisor, Senior DARR NCO, Assistant Commandant, Proponent NCO, or Talent Management NCO. MSG/1SG within Special Mission Units will have completed 60 months within SMU and possess either SQI “C” or “T” with high enumerations not necessarily consecutive
e. Highly Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 18-24 months as a First Sergeant, Senior Aviation Operations Sergeant, or ATC Operations Chief.
(2) PME: Recognition for achieving Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified."
(6) Assignments: Maximum of 36 months in broadening roles with mid-level enumerations.
f. Most Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 24+ months as a Command Sergeant Major or Operations Sergeant Major.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a master''s degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc
g. Highly Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 18-24 months as a Command Sergeant Major or Operations Sergeant Major with mid-level enumerations.
(2) PME: Recognition for Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc.', 'b802e09ac7ec68111626627b291fb97face87a25b2a025a264b29e4e59b4e057', 2, 5, null, 112, null, null, false, null),
  ('97442b07-6cef-556f-bda4-7eacced92be8', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Y', null, 'development', 'E-1..E-4', null, 'Private (PVT) E–1 to Specialist/Corporal (SPC/CPL) E-4 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Individual Training.
(2) Military Study: Master AR 670–1; STP 21–1–SMCT; TM 1-1500-204-23; ATP 3- 04.1; ATP 3-04.7; ADP 6-22; TC 3-04.71; TC 4-02.1; TC 7-22.7, and all unit-level maintenance manuals.
(3) PME: Seize the first opportunity to attend Basic Leaders Course (BLC) upon promotion to Specialist/E4.
(4) Civilian Education: Explore CLEP and DANTES; enroll in ArmyIgnitED to earn credits towards a degree (goal: 120 credits over a career). Obtain FAA and other MOS-related certifications.
(5) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(6) Training: SERE-C, Airborne, Air Assault, Ranger.', 'e2d474cdfce5b4725de655b9bf83245322fdaf1d3dbcdf360f4a3ac2b09b3564', 5, 5, null, 113, null, null, false, null),
  ('1f2aa690-6deb-5747-9692-754c87916ce1', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Y', null, 'development', 'E-5', null, 'Sergeant (SGT) E-5 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Basic Leaders Course.
(2) Military Study: Master TC 7-22.7; ADP 6-22; STP 21–24–SMCT (Warrior Leader Skill Levels 2, 3, and 4); FM 6–22 Army Leadership, and all -10 level maintenance manuals.
(3) Development Focus: Self-motivated development becomes critical. Focus on broadening management and doctrinal knowledge (organizational behavior, personnel management, time management, Army OPS).
(4) PME: Strive for recognition as a Distinguished Honor Graduate, Honor Graduate, or on the Commandant’s List.
(5) Civilian Education: Enroll in a college degree program, pursuing credits towards an associate''s degree, with the career goal of completing a bachelor''s degree.
(6) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(7) Training: SERE-C, Airborne, Air Assault, Ranger, Health and Holistic Fitness Integrator Course (H2F-I).', 'baebad57980ec8a346047c483e0ea1762325cb24e92d3dc3b8f0a50fbe9bdc04', 5, 6, null, 114, null, null, false, null),
  ('cbf5f71a-8671-59a7-b3a4-10491f6b837d', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Y', null, 'development', 'E-6', null, 'Staff Sergeant (SSG) E-6 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Leaders Course.
(2) Military Study: Master STP 21–24; TC 7-22.7; TC 3-04.71; ADP 6-22; ATP 3- 04.1; ATP 3-04.7.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', 'cd3e7ab3527bdbebe1fea3ef639c7237e62b98616130dd62aa78a87e943253a5', 6, 6, null, 115, null, null, false, null),
  ('df220e65-4cba-5b2f-bfb7-dc3c0322404a', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Y', null, 'development', 'E-7', null, 'Sergeant First Class (SFC) E-7 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Senior Leaders Course.
(2) Military Study: Master AR 350–1; AR 750–1; ATP 3-04.13; ATP 3-04.1; ADP 6- 22; TC 7-22.7; TC 3-04.07; TC 3-04.11; TC 3-04.71.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', '43f814013258f502e48fa4eb20d1af764bcc15c9c60897d1fca297d1068c9172', 6, 6, null, 116, null, null, false, null),
  ('afa43ec9-ff02-5417-9633-c50349ce8c91', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Y', null, 'development', 'E-8', null, 'Master Sergeant/First Sergeant (MSG/1SG) E-8 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Master Leaders Course.
(2) Military Study: Continue mastery of all previous publications and pursue functional courses to understand how the Army runs.
(3) Development Focus: Engage in self-motivated professional reading; hone organizational leadership skills needed to teach, coach, and mentor Soldiers.', '5ba3d4a9c0be3cc4d1dd9b42d237e5ac8f959f468decebfe8d4366e6efb9ec73', 6, 6, null, 117, null, null, false, null),
  ('d6734bce-3d0d-5831-a0f9-2a59c833b30f', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Y', null, 'development', 'E-9', null, 'Sergeant Major/Command Sergeant Major (SGM/CSM) E-9 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Sergeants Major Academy.
(2) Military Study: Possess outstanding communication and public speaking skills.
(3) Development Focus: Study world politics, geo-political issues (DIMEFIL), and field manuals relating to Army OPS and current battle doctrine.', '9dfdf76e95746dff858bb5fda5a42fb24d829bb2a91373f728a009ede2d1d5ad', 6, 6, null, 118, null, null, false, null),
  ('bd3ca492-4815-50ca-81ca-3b0cc4f3c079', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Z', null, 'promotion_criteria', null, null, 'Qualification indicators (promotion consideration)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', 'b. Most Qualified Indicators (SSG and SFC)
(1) Key Development Positions: 30-36 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Distinguished Honor Graduate, Honor Graduate, or Commandant List. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Working towards a completed associate''s degree. Obtaining Federal Aviation Administration (FAA) sponsored certificates and other MOS- related certifications from the COOL website.
b. SFC: Completed associate''s degree and working towards a bachelor''s degree. Obtaining FAA sponsored certificates and other MOS-related certifications.
c. All Ranks: Distinguished Leader Award, Lean Six Sigma Black Belt.
(4) Physical Fitness: AFT score of 450 or above, with a score of 90 in each event, without event substitution. NCOs on permanent profile should strive to reach 80 points in participable events.
(5) Training: (Completing two or more courses, a pattern of consistently completing military training is recommended)
a. SSG: Battle Staff, Mission Command Digital Master Gunner Course, Equal Opportunity Leaders (EOL) Course, Sexual Harassment/Assault Response & Prevention (SHARP) Level I, Health and Holistic Fitness Integrator Course (H2F-I).
b. SFC: Army Knowledge Management Qualification Course, Battle Staff, Mission Command Digital Master Gunner Course.
(6) Assignments:
a. SSG: Drill Sergeant, CTC Observer/Coach Trainer, Special Mission Unit, Special Operations Aviation.
b. SFC: Senior Drill Sergeant, Small Group Leader, Aviation Proponent NCO, Talent Manager NCO, Special Mission Unit, Special Operations Aviation.
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(7) Other Indicators: Expert Soldier Badge, Iron Sergeant, SGT Audie Murphy Club Inductee, SGT Morales Club Inductee, Military Outstanding Volunteer Service Medal (MOVSM), Army Best Squad of the Year, Drill Sergeant of the Year, NCO of the Year, Trainer of the Year (AAAA Functional Award), James H. McClellan Safety (AAAA National Award), Rodney J.T. Yano Non-Commissioned Officer of the Year (AAAA National Award), Gary G. Wetzel Army Aviation Soldier of the Year (AAAA National Award), Master Army Instructor Badge (MAIB), Army Gold Recruiter Badge, Professional Military Writing for peer reviewed articles (Published).
c. Highly Qualified Indicators (SSG and SFC)
(1) (1) Key Development Positions: 24-30 months of rated time at the appropriate level. (Applies to both SSG and SFC).
(2) Professional Military Education (PME): Recognition for achieving Superior Academic Achievement. (Applies to both SSG and SFC).
(3) Civilian Education:
a. SSG: Obtaining FAA sponsored certificates and other MOS-related certifications.
b. SFC: Working towards an associate''s degree and obtaining FAA sponsored certificates.
c. All Ranks: Lean Six Sigma Green or Yellow Belt.
(1) Physical Fitness: AFT score of 400 or above, with a score of 80 in each event, without event substitution.
(2) Training: (Completing one or more courses, a pattern of consistently completing military training is recommended)
a. SSG: SERE-C, Ranger, Airborne, Air Assault.
b. SFC: SHARP Intermediate Course Graduate, Equal Opportunity Leader (EOL) Course, Health and Holistic Fitness Integrator Course (H2F-I). Airborne, Air Assault, SERE-C, Ranger.
(3) Assignments:
a. SSG: Recruiter, Small Group Leader, Instructor, Training Developer, Doctrine Developer
b. SFC: Recruiter, Training Developer, Doctrine Developer, Test and Evaluation NCO
c. Other Broadening (All Ranks): Joint, NATO, Military Science Instructor, EOA/SARC, and AC/RC positions.
(4) Other Indicators: Order of St. Michael, NCOA Individual Physical Fitness Award, Senior Army Instructor Badge (SAIB), Drill Sergeant Leader, NCO of the Quarter, Army Silver Recruiter Badge.
d. Most Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 24+ months as a First Sergeant (most critical), Senior Aviation Operations Sergeant, or Air Traffic Control (ATC) Operations Chief.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) How the Army Runs, Capabilities Development, Manpower and Force Management, Army Knowledge Management, Battle Staff, Mission Command Digital Master Gunner, SHARP Intermediate, EOL, Health and Holistic Fitness Integrator Course (H2F-I), Airborne, Air Assault, SERE-C, Ranger.
(6) Assignments: Maximum of 36 months as an Equal Opportunity Advisor, Senior DARR NCO, Assistant Commandant, Proponent NCO, or Talent Management NCO. MSG/1SG within Special Mission Units will have completed 60 months within SMU and possess either SQI “C” or “T” with high enumerations not necessarily consecutive
e. Highly Qualified Indicators (1SG/MSG)
(1) Key Development Positions: 18-24 months as a First Sergeant, Senior Aviation Operations Sergeant, or ATC Operations Chief.
(2) PME: Recognition for achieving Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified."
(6) Assignments: Maximum of 36 months in broadening roles with mid-level enumerations.
f. Most Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 24+ months as a Command Sergeant Major or Operations Sergeant Major.
(2) PME: Recognition as a Distinguished Honor Graduate, Honor Graduate, or Commandant’s List.
(3) Civilian Education: Completion of a master''s degree.
(4) Physical Fitness: AFT score of 450 or above (90 in each event, no substitution).
(5) Training: (Completing four or more courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc
g. Highly Qualified Indicators (15Z60 - SGM/CSM)
(1) Key Development Positions: 18-24 months as a Command Sergeant Major or Operations Sergeant Major with mid-level enumerations.
(2) PME: Recognition for Superior Academic Achievement.
(3) Civilian Education: Completion of a bachelor''s degree and working towards a higher-level degree.
(4) Physical Fitness: AFT score of 400 or above (80 in each event, no substitution).
(5) Training: (Completing one to three courses, a pattern of consistently completing military training is recommended) From the list provided for "Most Qualified" MSG.
(6) Assignments: Maximum of 24 months in broadening assignments like Aviation Enlisted Assignment SGM, CSM CTC O/CT, Talent Manager, CCAD SGM, Commandant, OPFD SGM, SMU SGM, SOA SGM, etc.', 'b802e09ac7ec68111626627b291fb97face87a25b2a025a264b29e4e59b4e057', 2, 5, null, 119, null, null, false, null),
  ('71bab321-356c-532e-a697-4588311859fc', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Z', null, 'development', 'E-1..E-4', null, 'Private (PVT) E–1 to Specialist/Corporal (SPC/CPL) E-4 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Individual Training.
(2) Military Study: Master AR 670–1; STP 21–1–SMCT; TM 1-1500-204-23; ATP 3- 04.1; ATP 3-04.7; ADP 6-22; TC 3-04.71; TC 4-02.1; TC 7-22.7, and all unit-level maintenance manuals.
(3) PME: Seize the first opportunity to attend Basic Leaders Course (BLC) upon promotion to Specialist/E4.
(4) Civilian Education: Explore CLEP and DANTES; enroll in ArmyIgnitED to earn credits towards a degree (goal: 120 credits over a career). Obtain FAA and other MOS-related certifications.
(5) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(6) Training: SERE-C, Airborne, Air Assault, Ranger.', 'e2d474cdfce5b4725de655b9bf83245322fdaf1d3dbcdf360f4a3ac2b09b3564', 5, 5, null, 120, null, null, false, null),
  ('6f17d60d-292f-5e83-92f4-05fd567af273', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Z', null, 'development', 'E-5', null, 'Sergeant (SGT) E-5 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Basic Leaders Course.
(2) Military Study: Master TC 7-22.7; ADP 6-22; STP 21–24–SMCT (Warrior Leader Skill Levels 2, 3, and 4); FM 6–22 Army Leadership, and all -10 level maintenance manuals.
(3) Development Focus: Self-motivated development becomes critical. Focus on broadening management and doctrinal knowledge (organizational behavior, personnel management, time management, Army OPS).
(4) PME: Strive for recognition as a Distinguished Honor Graduate, Honor Graduate, or on the Commandant’s List.
(5) Civilian Education: Enroll in a college degree program, pursuing credits towards an associate''s degree, with the career goal of completing a bachelor''s degree.
(6) Physical Fitness: Strive for an AFT score of 450 with a minimum score of 90 in each event.
(7) Training: SERE-C, Airborne, Air Assault, Ranger, Health and Holistic Fitness Integrator Course (H2F-I).', 'baebad57980ec8a346047c483e0ea1762325cb24e92d3dc3b8f0a50fbe9bdc04', 5, 6, null, 121, null, null, false, null),
  ('b2ad302e-744f-534b-9a42-d7081549464d', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Z', null, 'development', 'E-6', null, 'Staff Sergeant (SSG) E-6 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Advanced Leaders Course.
(2) Military Study: Master STP 21–24; TC 7-22.7; TC 3-04.71; ADP 6-22; ATP 3- 04.1; ATP 3-04.7.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', 'cd3e7ab3527bdbebe1fea3ef639c7237e62b98616130dd62aa78a87e943253a5', 6, 6, null, 122, null, null, false, null),
  ('aa124ae9-a852-5a79-99bb-5b3d89b60132', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Z', null, 'development', 'E-7', null, 'Sergeant First Class (SFC) E-7 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Senior Leaders Course.
(2) Military Study: Master AR 350–1; AR 750–1; ATP 3-04.13; ATP 3-04.1; ADP 6- 22; TC 7-22.7; TC 3-04.07; TC 3-04.11; TC 3-04.71.
(3) Development Focus: Continue self-motivated development, broadening management and doctrinal knowledge.', '43f814013258f502e48fa4eb20d1af764bcc15c9c60897d1fca297d1068c9172', 6, 6, null, 123, null, null, false, null),
  ('c49285a1-808c-5bff-8bfc-dd50cb0e7e6f', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Z', null, 'development', 'E-8', null, 'Master Sergeant/First Sergeant (MSG/1SG) E-8 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Master Leaders Course.
(2) Military Study: Continue mastery of all previous publications and pursue functional courses to understand how the Army runs.
(3) Development Focus: Engage in self-motivated professional reading; hone organizational leadership skills needed to teach, coach, and mentor Soldiers.', '5ba3d4a9c0be3cc4d1dd9b42d237e5ac8f959f468decebfe8d4366e6efb9ec73', 6, 6, null, 124, null, null, false, null),
  ('539a2e11-0347-5358-8d1e-2e3c819183c4', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Z', null, 'development', 'E-9', null, 'Sergeant Major/Command Sergeant Major (SGM/CSM) E-9 — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development, by Rank', '(1) Institutional Training: Sergeants Major Academy.
(2) Military Study: Possess outstanding communication and public speaking skills.
(3) Development Focus: Study world politics, geo-political issues (DIMEFIL), and field manuals relating to Army OPS and current battle doctrine.', '9dfdf76e95746dff858bb5fda5a42fb24d829bb2a91373f728a009ede2d1d5ad', 6, 6, null, 125, null, null, false, null),
  ('385ef903-233b-5ab9-9389-1ff184ca26f3', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15B', null, 'development', null, null, 'Overview', 'Chapter 4. Career Management Field 15 MOS Professional Development', 'Models Access to the “Career Maps” is located at the Organization Personnel Force Development (OPFD) Division website, https://home.army.mil/rucker/about/AVCOE/opfd/enlisted. Use this guide to determine what positions, education and training a CMF 15 Soldier should have at any point during their career to not only be competitive for promotion but to also remain knowledgeable and relevant in the career field.', 'c6a0ae332f360b2060f268b772eaf188b21b0bb78e21794928ae97a651062455', 6, 7, null, 126, null, null, false, null),
  ('0838099d-61ea-5d58-8255-46f3b7cf16f8', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15C', null, 'development', null, null, 'Overview', 'Chapter 4. Career Management Field 15 MOS Professional Development', 'Models Access to the “Career Maps” is located at the Organization Personnel Force Development (OPFD) Division website, https://home.army.mil/rucker/about/AVCOE/opfd/enlisted. Use this guide to determine what positions, education and training a CMF 15 Soldier should have at any point during their career to not only be competitive for promotion but to also remain knowledgeable and relevant in the career field.', 'c6a0ae332f360b2060f268b772eaf188b21b0bb78e21794928ae97a651062455', 6, 7, null, 127, null, null, false, null),
  ('e8affbf0-d44f-595e-84de-052fb00be8e1', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15D', null, 'development', null, null, 'Overview', 'Chapter 4. Career Management Field 15 MOS Professional Development', 'Models Access to the “Career Maps” is located at the Organization Personnel Force Development (OPFD) Division website, https://home.army.mil/rucker/about/AVCOE/opfd/enlisted. Use this guide to determine what positions, education and training a CMF 15 Soldier should have at any point during their career to not only be competitive for promotion but to also remain knowledgeable and relevant in the career field.', 'c6a0ae332f360b2060f268b772eaf188b21b0bb78e21794928ae97a651062455', 6, 7, null, 128, null, null, false, null),
  ('6b0a5411-ad16-5f36-9186-93cdbbd1854e', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15F', null, 'development', null, null, 'Overview', 'Chapter 4. Career Management Field 15 MOS Professional Development', 'Models Access to the “Career Maps” is located at the Organization Personnel Force Development (OPFD) Division website, https://home.army.mil/rucker/about/AVCOE/opfd/enlisted. Use this guide to determine what positions, education and training a CMF 15 Soldier should have at any point during their career to not only be competitive for promotion but to also remain knowledgeable and relevant in the career field.', 'c6a0ae332f360b2060f268b772eaf188b21b0bb78e21794928ae97a651062455', 6, 7, null, 129, null, null, false, null),
  ('e57b1d31-d6a2-5b54-a04a-c11a43d864cd', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15G', null, 'development', null, null, 'Overview', 'Chapter 4. Career Management Field 15 MOS Professional Development', 'Models Access to the “Career Maps” is located at the Organization Personnel Force Development (OPFD) Division website, https://home.army.mil/rucker/about/AVCOE/opfd/enlisted. Use this guide to determine what positions, education and training a CMF 15 Soldier should have at any point during their career to not only be competitive for promotion but to also remain knowledgeable and relevant in the career field.', 'c6a0ae332f360b2060f268b772eaf188b21b0bb78e21794928ae97a651062455', 6, 7, null, 130, null, null, false, null),
  ('0d2c2508-9906-5ca3-bb0d-8f6d864bfcd7', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15H', null, 'development', null, null, 'Overview', 'Chapter 4. Career Management Field 15 MOS Professional Development', 'Models Access to the “Career Maps” is located at the Organization Personnel Force Development (OPFD) Division website, https://home.army.mil/rucker/about/AVCOE/opfd/enlisted. Use this guide to determine what positions, education and training a CMF 15 Soldier should have at any point during their career to not only be competitive for promotion but to also remain knowledgeable and relevant in the career field.', 'c6a0ae332f360b2060f268b772eaf188b21b0bb78e21794928ae97a651062455', 6, 7, null, 131, null, null, false, null),
  ('24f3ca8d-70bd-5484-8f8c-8bb8be0c9c42', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15K', null, 'development', null, null, 'Overview', 'Chapter 4. Career Management Field 15 MOS Professional Development', 'Models Access to the “Career Maps” is located at the Organization Personnel Force Development (OPFD) Division website, https://home.army.mil/rucker/about/AVCOE/opfd/enlisted. Use this guide to determine what positions, education and training a CMF 15 Soldier should have at any point during their career to not only be competitive for promotion but to also remain knowledgeable and relevant in the career field.', 'c6a0ae332f360b2060f268b772eaf188b21b0bb78e21794928ae97a651062455', 6, 7, null, 132, null, null, false, null),
  ('60b3c152-cdde-5da0-a233-f55b331706c7', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15L', null, 'development', null, null, 'Overview', 'Chapter 4. Career Management Field 15 MOS Professional Development', 'Models Access to the “Career Maps” is located at the Organization Personnel Force Development (OPFD) Division website, https://home.army.mil/rucker/about/AVCOE/opfd/enlisted. Use this guide to determine what positions, education and training a CMF 15 Soldier should have at any point during their career to not only be competitive for promotion but to also remain knowledgeable and relevant in the career field.', 'c6a0ae332f360b2060f268b772eaf188b21b0bb78e21794928ae97a651062455', 6, 7, null, 133, null, null, false, null),
  ('db519051-4bb3-582d-bb21-ff861ee97157', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15M', null, 'development', null, null, 'Overview', 'Chapter 4. Career Management Field 15 MOS Professional Development', 'Models Access to the “Career Maps” is located at the Organization Personnel Force Development (OPFD) Division website, https://home.army.mil/rucker/about/AVCOE/opfd/enlisted. Use this guide to determine what positions, education and training a CMF 15 Soldier should have at any point during their career to not only be competitive for promotion but to also remain knowledgeable and relevant in the career field.', 'c6a0ae332f360b2060f268b772eaf188b21b0bb78e21794928ae97a651062455', 6, 7, null, 134, null, null, false, null),
  ('9e44ee03-2ea6-5268-86b2-8c9e6a52c011', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15N', null, 'development', null, null, 'Overview', 'Chapter 4. Career Management Field 15 MOS Professional Development', 'Models Access to the “Career Maps” is located at the Organization Personnel Force Development (OPFD) Division website, https://home.army.mil/rucker/about/AVCOE/opfd/enlisted. Use this guide to determine what positions, education and training a CMF 15 Soldier should have at any point during their career to not only be competitive for promotion but to also remain knowledgeable and relevant in the career field.', 'c6a0ae332f360b2060f268b772eaf188b21b0bb78e21794928ae97a651062455', 6, 7, null, 135, null, null, false, null),
  ('fd1caa2d-ab6e-578f-9906-b7ab1e452636', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15P', null, 'development', null, null, 'Overview', 'Chapter 4. Career Management Field 15 MOS Professional Development', 'Models Access to the “Career Maps” is located at the Organization Personnel Force Development (OPFD) Division website, https://home.army.mil/rucker/about/AVCOE/opfd/enlisted. Use this guide to determine what positions, education and training a CMF 15 Soldier should have at any point during their career to not only be competitive for promotion but to also remain knowledgeable and relevant in the career field.', 'c6a0ae332f360b2060f268b772eaf188b21b0bb78e21794928ae97a651062455', 6, 7, null, 136, null, null, false, null),
  ('8354b4a0-b3d3-500f-b0f2-69572ee30130', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Q', null, 'development', null, null, 'Overview', 'Chapter 4. Career Management Field 15 MOS Professional Development', 'Models Access to the “Career Maps” is located at the Organization Personnel Force Development (OPFD) Division website, https://home.army.mil/rucker/about/AVCOE/opfd/enlisted. Use this guide to determine what positions, education and training a CMF 15 Soldier should have at any point during their career to not only be competitive for promotion but to also remain knowledgeable and relevant in the career field.', 'c6a0ae332f360b2060f268b772eaf188b21b0bb78e21794928ae97a651062455', 6, 7, null, 137, null, null, false, null),
  ('cd353028-fac2-5d55-b874-ca702be62c7b', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15R', null, 'development', null, null, 'Overview', 'Chapter 4. Career Management Field 15 MOS Professional Development', 'Models Access to the “Career Maps” is located at the Organization Personnel Force Development (OPFD) Division website, https://home.army.mil/rucker/about/AVCOE/opfd/enlisted. Use this guide to determine what positions, education and training a CMF 15 Soldier should have at any point during their career to not only be competitive for promotion but to also remain knowledgeable and relevant in the career field.', 'c6a0ae332f360b2060f268b772eaf188b21b0bb78e21794928ae97a651062455', 6, 7, null, 138, null, null, false, null),
  ('ab094462-204b-58f4-9b50-5a0b53b2aa39', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15T', null, 'development', null, null, 'Overview', 'Chapter 4. Career Management Field 15 MOS Professional Development', 'Models Access to the “Career Maps” is located at the Organization Personnel Force Development (OPFD) Division website, https://home.army.mil/rucker/about/AVCOE/opfd/enlisted. Use this guide to determine what positions, education and training a CMF 15 Soldier should have at any point during their career to not only be competitive for promotion but to also remain knowledgeable and relevant in the career field.', 'c6a0ae332f360b2060f268b772eaf188b21b0bb78e21794928ae97a651062455', 6, 7, null, 139, null, null, false, null),
  ('35122570-98d0-5eaf-97ad-b81e999f8d90', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15U', null, 'development', null, null, 'Overview', 'Chapter 4. Career Management Field 15 MOS Professional Development', 'Models Access to the “Career Maps” is located at the Organization Personnel Force Development (OPFD) Division website, https://home.army.mil/rucker/about/AVCOE/opfd/enlisted. Use this guide to determine what positions, education and training a CMF 15 Soldier should have at any point during their career to not only be competitive for promotion but to also remain knowledgeable and relevant in the career field.', 'c6a0ae332f360b2060f268b772eaf188b21b0bb78e21794928ae97a651062455', 6, 7, null, 140, null, null, false, null),
  ('92330ba1-91d0-5956-8ca6-ee20a3e9c1d7', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15X', null, 'development', null, null, 'Overview', 'Chapter 4. Career Management Field 15 MOS Professional Development', 'Models Access to the “Career Maps” is located at the Organization Personnel Force Development (OPFD) Division website, https://home.army.mil/rucker/about/AVCOE/opfd/enlisted. Use this guide to determine what positions, education and training a CMF 15 Soldier should have at any point during their career to not only be competitive for promotion but to also remain knowledgeable and relevant in the career field.', 'c6a0ae332f360b2060f268b772eaf188b21b0bb78e21794928ae97a651062455', 6, 7, null, 141, null, null, false, null),
  ('ecfea410-b49f-5fe5-9ea8-5e1b5a38b7a8', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Y', null, 'development', null, null, 'Overview', 'Chapter 4. Career Management Field 15 MOS Professional Development', 'Models Access to the “Career Maps” is located at the Organization Personnel Force Development (OPFD) Division website, https://home.army.mil/rucker/about/AVCOE/opfd/enlisted. Use this guide to determine what positions, education and training a CMF 15 Soldier should have at any point during their career to not only be competitive for promotion but to also remain knowledgeable and relevant in the career field.', 'c6a0ae332f360b2060f268b772eaf188b21b0bb78e21794928ae97a651062455', 6, 7, null, 142, null, null, false, null),
  ('31893f80-827b-5554-9629-dfc55246b13f', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Z', null, 'development', null, null, 'Overview', 'Chapter 4. Career Management Field 15 MOS Professional Development', 'Models Access to the “Career Maps” is located at the Organization Personnel Force Development (OPFD) Division website, https://home.army.mil/rucker/about/AVCOE/opfd/enlisted. Use this guide to determine what positions, education and training a CMF 15 Soldier should have at any point during their career to not only be competitive for promotion but to also remain knowledgeable and relevant in the career field.', 'c6a0ae332f360b2060f268b772eaf188b21b0bb78e21794928ae97a651062455', 6, 7, null, 143, null, null, false, null),
  ('6667c5cf-b1ae-52bf-8005-bc7c68225b63', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15B', null, 'development', 'E-1..E-4', null, 'PVT-CPL — overview', 'Chapter 6. MOS 15B: Aircraft Powerplant Repairer', 'Removes, replaces, services, prepares, preserves, cleans and stores engine assemblies or components. Disassembles, repairs, reassembles, adjusts, diagnostically test turbine engine systems, subsystems and components according to drawings, blueprints, directives, technical manuals. Assists in troubleshooting engines and rigging engine controls. Performs limited maintenance operational checks. Uses and performs operator maintenance on ground support equipment common and special tools. Maintains facilities for storage of flammable and hazardous materials. Requisitions and maintains shop and bench stock for repair of aircraft engines. Prepares requests for turn-ins and repair parts and engine components. Prepares forms and records related to MOS.', 'f75d5c84fe5f3669733aae2ec0e49b783aa347ca50b73bf79781a2b35bda585e', 7, 7, null, 144, null, null, false, null),
  ('a9eff0eb-8990-5c93-91fb-cb6e092fbb9e', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15B', null, 'development', 'E-5', null, 'SGT — overview', 'Chapter 6. MOS 15B: Aircraft Powerplant Repairer', 'Performs duties described in paragraph (1) and provides technical guidance to subordinate personnel. Diagnoses and troubleshoots malfunctions in aircraft engines and their components. Participates in maintenance test flights as required. Monitors hazardous material control and storage.', 'cb0c0e5ef4f9593dbd5b9bf216b488c30a6e6a6159881273e61cf7375fa6902e', 7, 7, null, 145, null, null, false, null),
  ('cb238d9f-655a-5da5-a1e5-e2f9e06fab5b', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15B', null, 'development', 'E-6', null, 'SSG — overview', 'Chapter 6. MOS 15B: Aircraft Powerplant Repairer', 'Supervises and provides technical guidance to subordinate personnel performing duties described in paragraphs (1, 2) and evaluates the technical training program. Evaluates maintenance operations and facilities for compliance with directives, technical manuals, work standards, safety procedure and operational policies. Performs maintenance trend analysis and applies production control, quality control and other maintenance management principles, and procedures to aircraft engine maintenance and shop operations. Instructs personnel and conducts technical training in aircraft engine systems maintenance, supply and safety techniques. Monitors requisition of parts, tools, and supplies.', 'da5c7869e4229690215b575bda3d9d1a3806cd095baeeea5145576a01cca8aba', 7, 8, null, 146, null, null, false, null),
  ('1e062571-4048-500a-81f1-e0b8eea97c6b', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15B', null, 'development', 'E-7', null, 'SFC — overview', 'Chapter 6. MOS 15B: Aircraft Powerplant Repairer', 'At this point a 15B30 merges to become a 15K40. Critical', '3f3e47ca9d61b1d5c40920a8a44115d4c7c4303f35a03f3f0e5c2ea8b47a6b11', 8, 8, null, 147, null, null, false, null),
  ('5dddd41d-69d8-5695-9eb5-dcea247b1384', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15B', null, 'assignments', 'E-7', null, 'SFC — assignments', 'Chapter 6. MOS 15B: Aircraft Powerplant Repairer', 'assignments include Platoon Sergeant, Aircraft Production Control Supervisor, Aircraft Component Repairer Supervisor. See Chapter 12 for details.', '3c6baa6a5fc69dc2d35b1da6b36c32ac9273fa8b77b9ab7bf009424473dd7d94', 8, 8, null, 148, null, null, false, null),
  ('9afe8a37-829f-5e31-86fd-dc87a74d8455', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15B', null, 'development', 'E-8', null, 'MSG/1SG — overview', 'Chapter 6. MOS 15B: Aircraft Powerplant Repairer', 'At this point, 15Ks merge into MOS 15Z, Aviation Senior Sergeant. See Chapter 23 for details.', '891d080692dde63d8d19c492bf57901065d27f88a02b90e2cab98cb161f3ef04', 8, 8, null, 149, null, null, false, null),
  ('c146e502-08c6-5634-8f16-3d74e632d595', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15C', null, 'development', 'E-1..E-4', null, 'PVT-CPL — overview', 'Chapter 7. MOS 15C: MQ-1 Operator', 'Prepares and conducts air RSTA missions. Plans and analyzes flight missions. Deploys and redeploys the UAS ground and air system. Launches and recovers the air vehicle, performs pre-flight, in-flight and post-flight checks and procedures. Uses and performs operator maintenance and crew procedures performed on UAS air and ground equipment. Prepares forms and records related to UAS air and ground support equipment maintenance. Participates in the UAS site setup. Assists in maintaining facilities for storage of flammable and hazardous materials', '0eeb555e4c6ddeef10f6ffae032c7dcd84a952ada7297e0981c38f43c0733923', 8, 8, null, 150, null, null, false, null),
  ('d71d7c10-a516-54fa-8538-d6fb9a857250', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15C', null, 'development', 'E-5', null, 'SGT — overview', 'Chapter 7. MOS 15C: MQ-1 Operator', 'Supervises and provides technical guidance to subordinate personnel performing duties described in paragraphs (1, 2). Perform operational checks and scheduled inspections. Supervise site setup, participates in mission planning using maps, terrain studies, and intelligence reports. Participates in and supervise operator maintenance and crew procedures performed on UAS air and ground equipment. Conducts flight and academic instruction in accordance with the Aircrew Training Program (ATP). Monitor hazardous material control and storage.', '93c1bb3aff3d7ada98122e8ea13870989f726ebf43d18c5c0a8e5f6ca84fda36', 8, 9, null, 151, null, null, false, null),
  ('8899461e-f053-5d54-821e-2b2ae9ab1c13', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15C', null, 'development', 'E-6', null, 'SSG — overview', 'Chapter 7. MOS 15C: MQ-1 Operator', 'Performs duties described in paragraph (1 and 2). Performs, supervises and provides technical guidance to subordinate personnel performing UAS operations, maintenance and crew procedures. Performs site selection and supervises site setup of UAS ground equipment using maps, aerial photographs, terrain studies, and intelligence reports. Assist in intelligence collection and dissemination. Coordinate methods of employment to higher and adjacent units. Creates and maintains a mission and operational data base. Conducts flight and academic instruction in accordance with the Aircrew Training Program (ATP).', '97285bf8b681f6b7bd1c44dfd17413dcf4bd8d386e08fb4864a4b63d327891ae', 9, 9, null, 152, null, null, false, null),
  ('dc2c7027-bc3b-56f9-89b6-45519dcf2011', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15C', null, 'development', 'E-7', null, 'SFC — overview', 'Chapter 7. MOS 15C: MQ-1 Operator', 'Performs duties shown in preceding skill levels and provides guidance to subordinate Soldiers. Supervise operations and activities of the platoon. Applies the military intelligence collection process and surveillance planning to UAS operations. Conducts flight and academic instruction in accordance with the Aircrew Training Program (ATP) for designated instructor positions.', '107985c80f54a545ab21e8a58b657b60a45615aaf2a2868804d03f71a217cc2c', 9, 9, null, 153, null, null, false, null),
  ('cd72eb48-24b8-596b-b190-603fb0f7c2ee', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15C', null, 'development', 'E-8', null, 'MSG/1SG — overview', 'Chapter 7. MOS 15C: MQ-1 Operator', 'At this point, 15Cs merge into MOS 15Z, Aviation Senior Sergeant. See Chapter for details.', '2fd61cc5f33f87b90df5c400ab15741fd23835bc53665dcd5ab7822b6e5ff593', 9, 9, null, 154, null, null, false, null),
  ('af0f61d5-9fcf-5172-9da9-1b8209b8b114', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15D', null, 'development', 'E-1..E-4', null, 'PVT-CPL — overview', 'Chapter 8. MOS 15D: Aircraft Powertrain Repairer', 'Removes and replaces powertrain quills, transmissions adapting parts, rotary wing hub and tanks. Disassembles friction dampers and hanger assemblies. Disassembles, repairs, reassembles, adjusts, balances and aligns powertrain components, systems and subsystems to include main and tail rotor hub assemblies according to drawings, blueprints, directives, technical manuals. Applies corrosion preventative procedures. Cleans, preserves and stores powertrain components. Performs nondestructive inspections on aircraft components and related items. Uses and performs operator maintenance on ground support equipment, common and special tools. Maintains facilities for storage of flammable and hazardous materials. Requisitions and maintains shop and bench stock for repair of aircraft powertrain systems and subsystems. Prepares request for turn-ins and repair parts for powertrain components. Prepares forms and records related to aircraft maintenance.', '5c53c52f3ec6175d1c39dcc5807cf125626b27bfc11dc115fde2d34b3cdf5e3b', 9, 10, null, 155, null, null, false, null),
  ('0257d31c-00db-5bf3-ae0c-e84e28ad247b', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15D', null, 'development', 'E-5', null, 'SGT — overview', 'Chapter 8. MOS 15D: Aircraft Powertrain Repairer', 'Performs duties described in paragraph (1) and provides technical guidance to subordinate personnel. Diagnoses and troubleshoots malfunctions in aircraft powertrain components and their subcomponents. Participates in maintenance test flights as required. Monitors hazardous material control and storage.', 'c9f4049c6fe1aceb17d446dee7a6d4e302e4f718170709da411f811c887d9633', 10, 10, null, 156, null, null, false, null),
  ('263ccee1-9572-54ed-b79a-a98f65c64553', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15D', null, 'development', 'E-6', null, 'SSG — overview', 'Chapter 8. MOS 15D: Aircraft Powertrain Repairer', 'Supervises and provides technical guidance to subordinate personnel performing duties described in paragraphs (1, 2) and evaluates the technical training program. Evaluates maintenance operations and facilities for compliance with directives, technical manuals, work standards, safety procedures and operational policies. Performs maintenance trend analysis and applies production control, quality control and other maintenance management principles and procedures to aircraft powertrain system maintenance, nondestructive inspection and shop operations. Instructs personnel and conducts technical training in aircraft powertrain system maintenance, nondestructive inspection, supply and safety techniques. Monitors requisition of parts, tools, and supplies.', '4f6994341952ea401c447f4f560e9e70ab00a0a32c304efe2518fc4cec10bd29', 10, 10, null, 157, null, null, false, null),
  ('72d13689-4a0a-58c5-88fc-a26c6096de94', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15D', null, 'development', 'E-7', null, 'SFC — overview', 'Chapter 8. MOS 15D: Aircraft Powertrain Repairer', 'At this point a 15D30 merges to become a 15K40. Critical', '95cf0f72b81034801b6eb0164992ef847e9807b8e597277cdc3d70e98c9c7bea', 10, 10, null, 158, null, null, false, null),
  ('0d0a5325-2379-5513-a484-e96feb7dd287', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15D', null, 'assignments', 'E-7', null, 'SFC — assignments', 'Chapter 8. MOS 15D: Aircraft Powertrain Repairer', 'assignments include Platoon Sergeant, Aircraft Production Control Supervisor, Aircraft Component Repairer Supervisor. See Chapter 12 for details', 'f081fea4ff6666cad5268cf5e77c7734194c01d08f1e92186dd803ccc733ee52', 10, 10, null, 159, null, null, false, null),
  ('2887f08c-2aaf-5f9a-a749-d0d0127663e1', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15D', null, 'development', 'E-8', null, 'MSG/1SG — overview', 'Chapter 8. MOS 15D: Aircraft Powertrain Repairer', 'At this point, 15Ks merge into MOS 15Z, Aviation Senior Sergeant. See Chapter 23 for details.', '891d080692dde63d8d19c492bf57901065d27f88a02b90e2cab98cb161f3ef04', 10, 10, null, 160, null, null, false, null),
  ('28d4100c-86cd-5df1-9c60-8bdb32d9d329', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15F', null, 'development', 'E-1..E-4', null, 'PVT-CPL — overview', 'Chapter 9. MOS 15F: Aircraft Electrician', 'Diagnoses and troubleshoots malfunctions in electrical and electronic components, including solid state and transistorized subsystems. Repairs aircraft instrument systems. Applies principles of electricity/electronics, hydrostatic motion, pneumatics and hydraulics applicable to repair aircraft instrument systems. Removes, installs, repairs, adjusts and tests electrical/electronic elements of assemblies and components according to technical manuals, directives and safety procedures. Clean, preserve and store electrical/electronic components and aircraft instruments. Removes, repairs, services, installs, and troubleshoots nickel-cadmium batteries. Uses and performs operator maintenance on ground support equipment, common and special tools. Maintains facilities for storage of flammable and hazardous materials. Requisitions and maintains shop and bench stock for repair of aircraft electrical systems and subsystems. Prepares request for turn-ins and repair parts for electrical components. Prepares forms and records related to aircraft maintenance.', '2a86dda87ee5c7993a008a5e5d7a1bd0c2e0da4d4b702ed06dbdb57cb7b62990', 10, 11, null, 161, null, null, false, null),
  ('4defbfad-b986-5d2e-98ea-7ca41275b566', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15F', null, 'development', 'E-5', null, 'SGT — overview', 'Chapter 9. MOS 15F: Aircraft Electrician', 'Performs duties described in paragraph (1) and provides technical guidance to subordinate personnel. Diagnoses and troubleshoots malfunctions in aircraft electrical components and their subcomponents. Participate in maintenance test flights as required. Monitors hazardous material control and storage.', 'aad9a053ef0bca7916be3b8cb804bec1eb2d25b29f3c6e64f9b67d2bf4555c9f', 11, 11, null, 162, null, null, false, null),
  ('07c4fedf-0d01-56bb-801a-e1526111cb42', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15F', null, 'development', 'E-6', null, 'SSG — overview', 'Chapter 9. MOS 15F: Aircraft Electrician', 'Supervises and provides technical guidance to subordinate personnel performing duties described in paragraphs (1, 2) and evaluates the technical training program. Evaluate maintenance operations and facilities for compliance with directives, technical manuals, work standards, safety procedures and operational policies. Performs maintenance trend analysis and applies production control, quality control and other maintenance management principles and procedures to aircraft electrical system maintenance, nondestructive inspections and shop operations. Instructs personnel and conducts technical training in aircraft electrical systems maintenance, nondestructive inspections, supply and safety techniques. Monitors requisition of parts, tools, and supplies.', 'b3dce45f75f096f47e97d6838fb589d308314cf0465d8808a27634190f3b51ed', 11, 11, null, 163, null, null, false, null),
  ('5ee22225-1f6c-59e7-bb32-e4db5122efaf', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15F', null, 'development', 'E-7', null, 'SFC — overview', 'Chapter 9. MOS 15F: Aircraft Electrician', 'At this point a 15F30 merges to become a 15L40. Critical', 'f1723bc8d1afbe24548391e04ae9e3279eb539433d1b8d8cadf2f5b1f3780bf7', 11, 11, null, 164, null, null, false, null),
  ('81de0b93-5b86-5cdb-8d4a-f06ab3a132b9', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15F', null, 'assignments', 'E-7', null, 'SFC — assignments', 'Chapter 9. MOS 15F: Aircraft Electrician', 'assignments include Platoon Sergeant, Production Control NCO, Aircraft Armament Senior Systems Supervisor, Avionics Electronic Systems Supervisor, Senior Training Management NCO, Senior Training Management NCO. See Chapter 13 for details', '272ed932e428131749479667dc37374421cf11fd3af4be05a93ec59d3f94c5a4', 11, 11, null, 165, null, null, false, null),
  ('2d4d9803-e5a9-553c-b410-6d71efe2d46b', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15F', null, 'development', 'E-8', null, 'MSG/1SG — overview', 'Chapter 9. MOS 15F: Aircraft Electrician', 'At this point, 15Ls merge into MOS 15Z, Aviation Senior Sergeant. See Chapter 23 for details.', '9114c4dd3b4f0e0e841e35d81305d3bbaeefd058fcf08680014346b0bb653661', 11, 11, null, 166, null, null, false, null),
  ('1892f946-c73b-5a1b-b117-84556a54f91b', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15G', null, 'development', 'E-1..E-4', null, 'PVT-CPL — overview', 'Chapter 10. MOS 15G: Aircraft Structural Repairer', 'Repairs and replaces aircraft structural components to include stingers, longerons, bulkheads, beams and aircraft skin according to drawings, blueprints, directives, technical manuals and safety procedures. Fabricate structural parts, forming blocks, and shapes metal using stretching, shrinking, and other metal forming techniques. Mixes and applies fiberglass materials. Makes emergency and permanent repairs to transparent plastic windows and enclosures. Uses common measuring tools, precision measuring gages, and alignment fixtures to perform structural repairs. Balances fixed-wing aircraft controls such as flags and ailerons. Mixes and applies primers and paints to aircraft surfaces. Apply corrosion control treatment to aircraft metals. Maintains facilities for storage of flammable and hazardous materials. Requisitions and maintains shop and bench stock for repair of aircraft structures. Prepares forms and records related to aircraft maintenance.', 'b5e10470b5b9ebb21f24e038035c5a05e58da9c10e0945869f846591fe8041ec', 12, 12, null, 167, null, null, false, null),
  ('5c707af1-0e00-57d4-8fd1-2a17a550c5da', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15G', null, 'development', 'E-5', null, 'SGT — overview', 'Chapter 10. MOS 15G: Aircraft Structural Repairer', 'Performs duties described in paragraph (1) and provides technical guidance to subordinate personnel. Diagnoses airframe structural integrity IAW drawings, blueprints, directives, technical manuals and manufacturing engineers. Monitors hazardous material control and storage.', '66427abbc2bda951f5ad6bfc2e0288b93a1143d1e00828a683200c2d9897540e', 12, 12, null, 168, null, null, false, null),
  ('514f4c6a-1543-55a8-a5cc-1ee6d5b64a93', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15G', null, 'development', 'E-6', null, 'SSG — overview', 'Chapter 10. MOS 15G: Aircraft Structural Repairer', 'Supervises and provides technical guidance to subordinate personnel performing duties described in paragraphs (1, 2) and evaluates the technical training program. Evaluate maintenance operations and facilities for compliance with directives, technical manuals, work standards, safety procedures and operational policies. Performs maintenance trend analysis and applies production control, quality control and other maintenance management principles and procedures to aircraft electrical system maintenance, nondestructive inspections and shop operations. Instructs personnel and conducts technical training in aircraft structural repair, nondestructive inspections, supply and safety techniques. Monitors requisition of parts, tools, and supplies', '6f8da3e8daed6192ccbc068f39e82b25a3696458d8a2c66ccded5562f528cd20', 12, 12, null, 169, null, null, false, null),
  ('1d054702-eb91-583b-beee-1eeb643e31b8', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15G', null, 'development', 'E-7', null, 'SFC — overview', 'Chapter 10. MOS 15G: Aircraft Structural Repairer', 'At this point a 15G30 merges to become a 15K40. Critical', '5ac9a59468430f52b4d46c353910d3ecd18a0887d6b4a6184bd5d27fc14413b5', 12, 12, null, 170, null, null, false, null),
  ('f429e1a3-0f52-529b-8153-b84139c7d267', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15G', null, 'assignments', 'E-7', null, 'SFC — assignments', 'Chapter 10. MOS 15G: Aircraft Structural Repairer', 'assignments include Platoon Sergeant, Aircraft Production Control Supervisor, Aircraft Component Repairer Supervisor. See Chapter 12 for details', 'f081fea4ff6666cad5268cf5e77c7734194c01d08f1e92186dd803ccc733ee52', 12, 12, null, 171, null, null, false, null),
  ('64938ea6-7758-51b2-b686-2ac96b7c1746', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15G', null, 'development', 'E-8', null, 'MSG/1SG — overview', 'Chapter 10. MOS 15G: Aircraft Structural Repairer', 'At this point, 15Ks merge into MOS 15Z, Aviation Senior Sergeant. See Chapter 23 for details.', '891d080692dde63d8d19c492bf57901065d27f88a02b90e2cab98cb161f3ef04', 13, 13, null, 172, null, null, false, null),
  ('c1feadac-cb98-5fcb-9b49-1392618748c7', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15H', null, 'development', 'E-1..E-4', null, 'PVT-CPL — overview', 'Chapter 11. MOS 15H: Aircraft Pneudraulics Repairer', 'Removes, repairs, replaces, adjusts and tests pneudraulic systems, subsystems, assemblies, and components according to drawings, blueprints, directives, technical manuals, and safety procedures. Fabricates tubes and hoses. Diagnoses and troubleshoots malfunctions to pneudraulic systems and subsystems or components. Maintain facilities for storage of flammable and hazardous materials. Requisitions and maintains shop and bench stock for repair of aircraft structures. Prepares forms and records related to aircraft maintenance.', '196a6a1e70d68ba7c53de2f3e404cf3e7683d9ceaa92646f1d24e8aebe420d5a', 13, 13, null, 173, null, null, false, null),
  ('2718afc5-5c2b-5783-9e43-5d9552fa4102', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15H', null, 'development', 'E-5', null, 'SGT — overview', 'Chapter 11. MOS 15H: Aircraft Pneudraulics Repairer', 'Performs duties described in paragraph (1) and provides technical guidance to subordinate personnel. Monitors hazardous material control and storage.', '50430368a23b3c9cb0778dd07b7b2797e8495ebbe98f9960c2502446aa396915', 13, 13, null, 174, null, null, false, null),
  ('243834f3-0950-5219-8756-c3094aa74def', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15H', null, 'development', 'E-6', null, 'SSG — overview', 'Chapter 11. MOS 15H: Aircraft Pneudraulics Repairer', 'Supervises and provides technical guidance to subordinate personnel performing duties described in paragraphs (1, 2) and evaluates the technical training program. Evaluates maintenance operations and facilities for compliance with directives, technical manuals, work standards, safety procedures and operational policies. Performs maintenance trend analysis and applies production control, quality control and other maintenance management principles and procedures to aircraft pneudraulics maintenance, nondestructive inspections and shop operations. Instructs personnel and conducts technical training in aircraft pneudraulics repair, nondestructive inspections, supply and safety techniques. Monitors requisition of parts, tools, and supplies.
(4) SFC (15K40) At this point a 15H30 merges to become a 15K40. Critical assignments include Platoon Sergeant, Aircraft Production Control Supervisor, Aircraft Component Repairer Supervisor. See Chapter 12 for details.', '8c8e99a92ad904f0bf0c8d355419eda1e2050244106ef1a838a4dedd8b1f1f06', 13, 13, null, 175, null, null, false, null),
  ('3cfcc4ec-8051-54e8-aeea-a6ac7d6c30a9', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15H', null, 'development', 'E-8', null, 'MSG/1SG — overview', 'Chapter 11. MOS 15H: Aircraft Pneudraulics Repairer', 'At this point, 15Ks merge into MOS 15Z, Aviation Senior Sergeant. See Chapter 23 for details.', '891d080692dde63d8d19c492bf57901065d27f88a02b90e2cab98cb161f3ef04', 14, 14, null, 176, null, null, false, null),
  ('357305ef-f80c-5898-a81c-39975f5aadd8', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15K', null, 'development', 'E-7', null, 'SFC — overview', 'Chapter 12. MOS 15K: Aircraft Components Repair Supervisor', 'Critical assignments include Platoon Sergeant, Aircraft Production Control Supervisor, Aircraft Component Repairer Supervisor.', '0139f59ded5dd1d0d918a7393446b4548c964fc33ddf7658a79d3f8ac2a627c6', 14, 14, null, 177, null, null, false, null),
  ('57fa53bc-f929-55ec-8456-9560cd91c89a', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15K', null, 'development', 'E-8', null, 'MSG/1SG — overview', 'Chapter 12. MOS 15K: Aircraft Components Repair Supervisor', 'At this point, 15Ks merge into MOS 15Z, Aviation Senior Sergeant. See Chapter 23 for details.', '891d080692dde63d8d19c492bf57901065d27f88a02b90e2cab98cb161f3ef04', 14, 14, null, 178, null, null, false, null),
  ('b10c0546-e7eb-5794-814b-89635f92a8f3', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15L', null, 'development', 'E-7', null, 'SFC — overview', 'Chapter 13. MOS 15L: Armament/Electrical/Avionics Repairer Supervisor', 'Critical assignments include Platoon Sergeant, Production Control NCO, Aircraft Armament Senior Systems Supervisor, Avionics Electronic Systems Supervisor, Senior Training Management NCO.', 'e55b1831e54976b7f93b33e399d082ff6a92701cf30c65a3d3db410dc1e3b35d', 15, 15, null, 179, null, null, false, null),
  ('e3a35c0e-fa05-5a29-a497-feededaa2ccb', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15L', null, 'development', 'E-8', null, 'MSG/1SG — overview', 'Chapter 13. MOS 15L: Armament/Electrical/Avionics Repairer Supervisor', 'At this point, 15Ls merge into MOS 15Z, Aviation Senior Sergeant. See Chapter 23 for details.', '9114c4dd3b4f0e0e841e35d81305d3bbaeefd058fcf08680014346b0bb653661', 15, 15, null, 180, null, null, false, null),
  ('85dec29f-a3e5-5de6-844a-0142a8913e8b', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15M', null, 'development', 'E-1..E-4', null, 'PVT-CPL — overview', 'Chapter 14. MOS 15M: MQ-1 Repairer', 'Diagnoses, troubleshoots and repairs malfunctions in UAS electrical, avionics, radio frequency, propulsion, fuel, optical payload, and weapon systems components including solid state and transistorized subsystems according to pertinent technical manuals, directives and safety procedures. Remove and install unmanned aircraft system subassemblies. Performs inspections and periodic maintenance on the aircraft, ground control station, ground data terminal, takeoff and landing systems, and associated ground support equipment. Performs aircraft fueling and defueling operations. Serves as crewmember performing launch, operational and preventive checks and alignments on aircraft flight controls, stabilization systems, avionics and controlled cryptographic equipment. Troubleshoots equipment wiring harnesses, electrical components, and radio frequency paths using technical manuals and schematic drawings to diagnose, isolate faults, and effect repairs. Uses test sets and diagnostic equipment. Maintain records on all system equipment. Uses common and special tools. Maintains facilities for storage of flammable and hazardous materials. Prepares forms and records related to MOS.', '03fb433f3eb97bc5d1ce9b5d0673ac1ebe4c63c99c0bd768f447c1312269a31f', 15, 15, null, 181, null, null, false, null),
  ('2839b64a-0500-5415-9d8d-319dbbbdc0c1', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15M', null, 'development', 'E-5', null, 'SGT — overview', 'Chapter 14. MOS 15M: MQ-1 Repairer', 'Performs duties described in paragraph (1) and provides technical guidance to subordinate personnel. Serves as a crew chief for launch and recovery operations. Monitors hazardous material control and storage. Schedules maintenance on test, measurement and diagnostic equipment (TMDE). Alters or modifies material according to DA approved modification work orders.', 'aa005b63bb5f536662def77b834663638be01b305d9496f35764df12bb8227e5', 15, 15, null, 182, null, null, false, null),
  ('123c1fdb-469f-540d-a274-64864d57e91e', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15M', null, 'development', 'E-6', null, 'SSG — overview', 'Chapter 14. MOS 15M: MQ-1 Repairer', 'Supervises and provides technical guidance to subordinate personnel performing duties described in paragraphs (1, 2) and evaluates the technical training program. Evaluates maintenance operations and facilities for compliance with directives, technical manuals, work standards, safety procedures and operational policies. Performs maintenance trend analysis and applies production control, quality control and other maintenance management principles and procedures. Computes basic weight and balance and ensures compliance with aircraft configuration control, Army Oil Analysis Program, and Test Measurement, and Diagnostic Equipment calibration. Performs technical inspections. Instructs personnel and conducts technical training in unmanned aircraft systems electrical, avionic, radio frequency, propulsion, fuel, optical payload, and weapon systems repair procedures and shop and flight line safety. Monitors requisition of parts, tools and supplies.', 'b05ad52888e49fcd6aedbbdfaacde407342b51f2942f7b74930a4f297a0e8010', 16, 16, null, 183, null, null, false, null),
  ('dd9afbaa-a0ba-5873-86e8-dbe367092522', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15M', null, 'development', 'E-7', null, 'SFC — overview', 'Chapter 14. MOS 15M: MQ-1 Repairer', 'Supervises unmanned aircraft systems maintenance and technical inspection activities. Determines man-hours, personnel, parts and facility requirements to repair unmanned aircraft systems and associated equipment. Plans maintenance areas, component repair, technical inspection techniques, and procedures, according to directives, technical manuals, work standards, and operational policies. Maintains supply economy and discipline. Supervise the unmanned aircraft systems technical training program. Prepares evaluations, special reports, and records pertaining to unmanned aircraft systems maintenance and related activities. Recommends and administers plans and policies.', '09ccdb7a5519a1418c4efe6b56ff7aae32a4eab32f9485a2908d9c50b9abfd94', 16, 16, null, 184, null, null, false, null),
  ('da118707-5b3b-5e75-a390-b505ad9d762f', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15M', null, 'development', 'E-8', null, 'MSG/1SG — overview', 'Chapter 14. MOS 15M: MQ-1 Repairer', 'At this point, 15Ms merge into MOS 15Z, Aviation Senior Sergeant. See Chapter 23 for details.', '12fe894d89e3fe63209e3e191b5acb59b932b3e7b02fe6432be7b6f80a3afe1b', 16, 16, null, 185, null, null, false, null),
  ('660bbd22-b424-537c-a2f8-6a1a37ff3fdd', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15N', null, 'development', 'E-1..E-4', null, 'PVT-CPL — overview', 'Chapter 15. MOS 15N: Avionic Mechanic', 'Repairs, replaces, and performs operational and preventive checks and alignments on aircraft flight controls, stabilization systems, avionics and controlled cryptographic equipment. Troubleshoots equipment and traces avionic and cryptographic equipment wiring harnesses using technical manuals and schematic drawings to diagnose and isolate faults and effect repairs. Performs unit maintenance on special and common hand tools and test, measurement, and diagnostic equipment. Requisitions and maintains shop and bench stock for repair of aircraft avionics equipment. Maintains facilities for storage of flammable and hazardous materials. Prepares forms and records related to aircraft maintenance.', '1cf0e7995267d96a6732f36742113da54fc467e0cedbe0a59d90be1905c0bccd', 17, 17, null, 186, null, null, false, null),
  ('05aa4545-b9a6-5881-b64d-93af530be2bf', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15N', null, 'development', 'E-5', null, 'SGT — overview', 'Chapter 15. MOS 15N: Avionic Mechanic', 'Performs duties described in paragraph (1) and provides technical guidance to subordinate personnel. Schedules maintenance on test measurement and diagnostic equipment (TMDE). Alters or modifies material according to DA approved modification work orders. Monitors hazardous material control and storage.', '8b317b33e4c42ad2c535094b51ae0f720a366762792a9629e69bf92a913c88b5', 17, 17, null, 187, null, null, false, null),
  ('196d0b5a-9c9c-5135-a097-bdc0ccc8fda7', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15N', null, 'development', 'E-6', null, 'SSG — overview', 'Chapter 15. MOS 15N: Avionic Mechanic', 'Supervises and provides technical guidance to subordinate personnel performing duties described in paragraphs (1, 2). Evaluates maintenance operations and facilities for compliance with directives, technical manuals, work standards, safety procedures and operational policies. Performs maintenance trend analysis and applies production control, quality control and other maintenance management principles and procedures to armament, electrical and avionics maintenance, nondestructive inspections, and shop operations. Instructs personnel and conducts technical training in avionic, COMSEC, flight control and stabilization equipment maintenance, repair, nondestructive inspections, supply, and safety techniques. Evaluates the technical training program. Monitors requisition of parts, tools, and supplies.', 'b5592d34b3cb146f55724a2d99dd724406e4a4c2ba8a64eec65d9bc98649758a', 17, 17, null, 188, null, null, false, null),
  ('74b9c2e7-00a9-59fa-9552-62b79c115b74', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15N', null, 'development', 'E-7', null, 'SFC — overview', 'Chapter 15. MOS 15N: Avionic Mechanic', 'At this point a 15N30 merges to become a 15L40. Critical', 'fcf9622cbc287c9ca1cd5db3f69ba2ceefd7a6d3990dda735853cee2759f2792', 17, 17, null, 189, null, null, false, null),
  ('430e4c77-e2c4-5cd5-8328-d6fc399d310b', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15N', null, 'assignments', 'E-7', null, 'SFC — assignments', 'Chapter 15. MOS 15N: Avionic Mechanic', 'assignments include Platoon Sergeant, Production Control NCO, Aircraft Armament Senior Systems Supervisor, Avionics Electronic Systems Supervisor, Senior Training Management NCO. See Chapter 13 for details.', '212d2b8d474a22deaf0980fc5e3ab604b95ff6505b738eec1ed4584c20709dcb', 17, 17, null, 190, null, null, false, null),
  ('c7826cd4-c2e0-5ea5-bb54-529d6890120f', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15N', null, 'development', 'E-8', null, 'MSG/1SG — overview', 'Chapter 15. MOS 15N: Avionic Mechanic', 'At this point, 15Ls merge into MOS 15Z, Aviation Senior Sergeant. See Chapter 23 for details.', '9114c4dd3b4f0e0e841e35d81305d3bbaeefd058fcf08680014346b0bb653661', 17, 17, null, 191, null, null, false, null),
  ('6dd8fccb-e39c-516e-bc11-879663a2498e', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15P', null, 'development', 'E-1..E-4', null, 'PVT-CPL — overview', 'Chapter 16. MOS 15P: Aviation Operations Specialist', 'Processes cross-country and local flight clearances, including examination for conformance with flight rules and regulations. Prepares and maintains cross country kits. Checks accuracy of flight plans. Coordinates flight plans with all related agencies. Maintains flight information on inbound and outbound flights. Communicates with the proper agencies if flights are overdue. Alerts crash crew for emergencies. Maintains current file on aircraft flying regulations and navigation information such as Army, DoW and FAA regulations, DoW flight information publications (FLIPS) and aeronautical charts. Safeguards classified material. Knows terminology used in air navigation and is aware of air traffic control advisory radio procedures. Encodes, decodes and posts notices to airmen (NOTAMS). Interprets and posts weather reports. Maintain individual flight records and functional files. Maintain flight operations equipment in a tactical environment. Prepare, submit operator meaconing, intrusion, jamming and interference reports. Participates in maintaining situation map.', '5c93bc130b8d7dae7a960531d0c170a74fa439b7e32c8e5c89678a46bcbddab5', 18, 18, null, 192, null, null, false, null),
  ('2c866b51-0ba4-5e30-8044-c1d1a67a14a9', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15P', null, 'development', 'E-5', null, 'SGT — overview', 'Chapter 16. MOS 15P: Aviation Operations Specialist', 'Supervises and instructs subordinates in proper work techniques and procedures. Reviews, consolidates and prepares technical reports. Knows procedures for reporting flight violations. Prepares situation map. Supervises receipt and transfer of classified material. Participates in the development of a tactical crash rescue system.', '171487dd533e9c294586ba62a5f0b70d173bdaf7e802a8fa209ff881a7356d07', 18, 18, null, 193, null, null, false, null),
  ('b3261002-9b0e-5aad-bb49-638c06ab98f7', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15P', null, 'development', 'E-6', null, 'SSG — overview', 'Chapter 16. MOS 15P: Aviation Operations Specialist', 'Supervises and provides technical guidance to subordinate personnel performing duties described in paragraphs (1, 2). Supervises the preparation of the situation map. Assists in preparation of operations estimates and orders. Supervises airfield services and administration. Applies operational and administrative techniques in movement of military personnel and supplies by air. Perform administrative duties in aircraft accident investigations. Prepares operations letters.', '72b6748d601975383d92c6dd7c6fb27940f2f63ebfb19f5d79ffe64d069b4f57', 18, 18, null, 194, null, null, false, null),
  ('3ffc6ea3-afe1-5db1-ba05-79b84ec86822', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15P', null, 'development', 'E-7', null, 'SFC — overview', 'Chapter 16. MOS 15P: Aviation Operations Specialist', 'Provides tactical and technical expertise to subordinates and superiors in aviation operations. Plans, coordinates and supervises activities pertaining to organization, training, combat operations and combat intelligence. Coordinates implementation of operations, training programs and communications activities. As an Aviation Operation Sergeant at Brigade Aviation Element (BAE) provide technical and doctrinal advice to the Chief of Operations (CHOPS). Receives and distributes relevant data from the Airspace Control Order (ACO) and Airspace Tasking Order (ATO). Ensures operation and maintenance requirements are met for section Air and Missile Defense Workstation (AMDWS), Forward Area Air Defense (FAAD), and Tactical Airspace Integration System (TAIS) equipment. As a platoon sergeant, coordinates the logistical, personnel and administrative support for all platoon elements.', '6ed25abf3c02f847238d2ec5a85cc108b10392603394249cb7e27672ae4b7965', 18, 19, null, 195, null, null, false, null),
  ('77f2559d-2707-55ab-be01-932d8ed33d80', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15P', null, 'development', 'E-8', null, 'MSG/1SG — overview', 'Chapter 16. MOS 15P: Aviation Operations Specialist', 'At this point, 15Ps merge into MOS 15Z, Aviation Senior Sergeant. See Chapter 23 for details.', 'd800ccd0d7296afaa20de68f03f7b06ee039f78eacd126ba74509253acbad2c1', 19, 19, null, 196, null, null, false, null),
  ('6788c137-2ae6-5afc-a1bd-660e9f8eabae', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Q', null, 'development', 'E-1..E-4', null, 'PVT-CPL — overview', 'Chapter 17. MOS 15Q: Air Traffic Control Operator', 'Operates fixed and tactical ATC towers, Ground Control Approach GCA radars and airspace information centers (AICs). Operates and maintains vehicles, tactical/fixed base ATC equipment and navigational aids (NAVAIDs). Assist in the installation and relocation of tactical ATC facilities. Applies air traffic control rules, procedures and regulations. Processes flight plan data. Formulates and issues ATC clearances, advisories and control information. Maintains logs, records, files and recordings of voice communications. Interprets and relays Notices to Airmen (NOTAM) information. Reads and interprets DoW Flight Information Publications (FLIPS) and aeronautical charts. Analyzes air traffic to identify and resolve potential conflicts. Controls airborne and ground traffic on and in the vicinity of the airport. Updates Automated Terminal Information Service (ATIS) and performs radarscope alignments. Coordinates terminal/enroute control. Provides approach control services, conducts precision radar instrument approaches, provide (AIC) services and control tower services. As a qualified member of a tactical air control team (TACT), establishes and controls landing zones (LZs), helicopter landing zones (HLZs), drop zones (DZs) and pick-up zones (PZs).', '0b94142c1bfb6cfe304eef17cc2d8237ecb135254ef790dec198bef21cbfb17f', 19, 19, null, 197, null, null, false, null),
  ('16a2ad87-1b5f-5f18-a715-cf8f521b738b', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Q', null, 'development', 'E-5', null, 'SGT — overview', 'Chapter 17. MOS 15Q: Air Traffic Control Operator', 'Conducts ATC facility training. Briefs shift personnel on runway utilization, airfield conditions and weather/ground activities. Prepares and updates flight following maps. Supervises a shift in a tactical or fixed tower, radar, or AIC. Services as a tactical air control team (TACT) leader in a tactical terminal control system (TTCS), deploys team as advance party to remote areas to secure and set up forward area refueling and rearming points (FARPS), LZs, HLZs, DZs and PZs. Maintains current DoW and DOT/FAA publications, ATC facility logs, forms, records and situation maps. Prepares, briefs and disseminates Aviator’s Procedures Guide (APG) to supported aviation units. Assist in the preparation of TERPS', '0e39c9c30329aeffb2629c1ba5502bdc15f1c9613e5b3f5f6324aaa36fa4b7bc', 19, 20, null, 198, null, null, false, null),
  ('ad420029-c23b-5551-82df-62a0b84c6d27', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Q', null, 'development', 'E-6', null, 'SSG — overview', 'Chapter 17. MOS 15Q: Air Traffic Control Operator', 'Supervises and provides technical guidance to subordinate personnel performing duties described in paragraphs (1, 2). Serves as facility chief at low-density towers, radar or airspace information centers. Serve as facility chief in tactical towers, GCA radars and AICs. Administer ATC facility. Formulates and coordinates letters of agreement, operations letters and facility memorandums. Prepares duty rosters and assigns duties to personnel. Ensures facility flight check requirements are met for navigational aids, radar and radio communications equipment. Plans and organizes ATC activities for tower, GCA radar, airspace information centers and verifies facility compliance with Army and FAA standards. Evaluates ATC operations and work performance. Reviews and prepares reports. Coordinate ATC activities with other facilities. Prepares and updates situation maps. Assists in the preparation of Standard Instrument Approach/Enroute/Departure Procedures (TERPS) for assigned facility/NAVAID.', 'e67638b1a540bd9e4a6915b25102dfcd76eb4f5176c7b0ad08e4b3644cacb387', 20, 20, null, 199, null, null, false, null),
  ('0a5a2a2b-f5b6-53cd-aa34-12745fb3a071', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Q', null, 'development', 'E-7', null, 'SFC — overview', 'Chapter 17. MOS 15Q: Air Traffic Control Operator', 'Serves as facility chief in high density and designated remotely located fixed base towers, GCA radar, or AICs. Plans, organizes and supervises ATC facilities. Establishes and supervises the facility training and rating program. Advises in the preparation of TERPS. Ensure proper utilization and coordination of maintenance support. Prepares and interprets orders and reports. As an A2C2 liaison at division and echelons above corps (EAC) assists in the development and execution of the Airspace Control Order (ACO) and Airspace Tasking Order (ATO). Coordinates, deconflicts and integrates all airspace control measures for division, corps, or EAC commanders. As a platoon sergeant, coordinates the logistical, personnel and administrative support for all platoon elements and deploys platoon to remote locations in support of forward aviation assets. Prepares and coordinates TERPS data with the appropriate FAA Department of the Army regional representative. Conduct briefings for senior commanders on the current tactical airspace situation. An NCO should have 24-36 months of rated facility chief or Platoon Sergeant time to be competitive with their peers.', '25dd94ea942e24d5db16a8c3be380964dbacb17b86559dcce842ea80f7264ea3', 20, 20, null, 200, null, null, false, null),
  ('0979cca0-6b7f-5660-8e2b-459ad1fd7021', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Q', null, 'development', 'E-8', null, 'MSG/1SG — overview', 'Chapter 17. MOS 15Q: Air Traffic Control Operator', 'Merges into MOS 15Z. NCOs are tracked with PDSI B4B for specific ATC SGM positions (e.g., USAASA, ATC Senior SGT).', 'e8ec077f733ce9a81a2cb81037ea65fac440af64ef900a9145718453556ed58c', 20, 20, null, 201, null, null, false, null),
  ('87dbe256-def1-5001-91fc-4d6a2f6af7c2', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15R', null, 'development', 'E-1..E-4', null, 'PVT-CPL — overview', 'Chapter 18. MOS 15R: AH-64 Attack Helicopter Repairer', 'Removes and installs aircraft subsystem assemblies such as engines, rotors, gearboxes, transmissions, mechanical flight controls and their components. Services and lubricates aircraft and subsystems. Prepares aircraft for inspections and maintenance checks. Performs scheduled inspections and assists in performing special inspections. Performs limited maintenance operational checks and assists in diagnosing and troubleshooting aircraft subsystems using special tools and equipment as required. Maintains facilities for storage of flammable and hazardous materials. Requisitions and maintains shop and bench stock for repair of aircraft systems and equipment. Uses and performs operator maintenance on tools, special tools and aircraft ground support equipment. Prepares forms and records related to aircraft maintenance', 'b9238030961a6dfab96040fe61bf2c846ee465b222df5b6e9f2da4ad45d4f1b1', 21, 21, null, 202, null, null, false, null),
  ('eef27e2b-310e-5f3c-93da-5ff920eac929', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15R', null, 'development', 'E-5', null, 'SGT — overview', 'Chapter 18. MOS 15R: AH-64 Attack Helicopter Repairer', 'Performs duties described in paragraph (1) and provides technical guidance to subordinate personnel. Performs operational checks and scheduled inspections. Diagnoses and troubleshoots malfunctions in aircraft subsystems. Monitor hazardous material control and storage.', '4bc30c72b39a0aa1e169ab5724f62d277a32fd81741794b9a40c118fe33f8438', 21, 21, null, 203, null, null, false, null),
  ('8dd06434-46ab-5aa4-8e9c-515db982818a', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15R', null, 'development', 'E-6', null, 'SSG — overview', 'Chapter 18. MOS 15R: AH-64 Attack Helicopter Repairer', 'Supervises and provides technical guidance to subordinate personnel performing duties described in paragraphs (1, 2) and evaluates the technical training program. Evaluate maintenance operations and facilities for compliance with directives, technical manuals, work standards, safety procedures and operational policies. Performs maintenance trend analysis and applies production control, quality control and other maintenance management principles and procedures to airplane maintenance operations. Plans, conducts and supervises aircraft technical inspections. Compute basic weight and balance records. Participate in maintenance test flights. Ensure compliance with aircraft configuration control, Army Oil Analysis Program and test measuring diagnostic calibration.', 'dec4a651219550401295edf6cb6c54a6e96b62e9716f06b9476af702dd499413', 21, 21, null, 204, null, null, false, null),
  ('8315e501-c20f-59d9-aaf5-e20ae15aa66e', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15R', null, 'development', 'E-7', null, 'SFC — overview', 'Chapter 18. MOS 15R: AH-64 Attack Helicopter Repairer', 'Supervises aircraft maintenance and technical inspection activities. Determine man-hours, personnel, parts and facility requirements to repair aircraft and associated equipment. Plans aircraft maintenance areas, component repair shops and facilities. Instructs subordinates in aircraft repair and technical inspection techniques and procedures according to directives, technical manuals, work standards and operational policies. Maintains supply economy and discipline. Supervises the technical training program. Prepares evaluations, special reports and records pertaining to aircraft maintenance repair and related activities. Recommends and administers plans and policies.', 'aea6b4b8609bac782c53265d790835b8db546230d252f983ae6ba1b9b7cafa71', 22, 22, null, 205, null, null, false, null),
  ('f60b488b-de5e-59b5-97d6-23ef82411fc0', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15R', null, 'development', 'E-8', null, 'MSG/1SG — overview', 'Chapter 18. MOS 15R: AH-64 Attack Helicopter Repairer', 'Merges into MOS 15Z, Aviation Senior Sergeant. See Chapter 23 for details.', '25459e3cf2f4782c4058c6a48aab54e061600fccdb3ace1cc8933e32c925681b', 22, 22, null, 206, null, null, false, null),
  ('6fcb1502-2bcd-5294-a811-38eee960c036', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15T', null, 'development', 'E-1..E-4', null, 'PVT-CPL — overview', 'Chapter 19. MOS 15T: UH-60 Helicopter Repairer/Aircrew member', 'Performs and installs aircraft subsystem assemblies such as engines, rotors, gearboxes, transmissions, mechanical flight controls and their components. Services and lubricates aircraft and subsystems. Prepare aircraft for inspections and maintenance checks. Performs scheduled inspections and assists in performing special inspections. Performs limited maintenance operational checks and assists in diagnosing and troubleshooting aircraft subsystems using special tools and equipment as required. Requisitions and maintains shop and bench stock for repair of aircraft systems and equipment. Maintains facilities for storage of flammable and hazardous materials. Uses and performs operator maintenance on tools, special tools and aircraft ground support equipment. Prepares forms and records related to aircraft maintenance. Performs non-rated crewmember duties.', '5b3398d9cd996062c7b214e77b0b07953ac420bc9ebb89329247c8ed19fd4104', 22, 22, null, 207, null, null, false, null),
  ('b5951ea1-b256-58fe-9f95-f6feae3e4123', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15T', null, 'development', 'E-5', null, 'SGT — overview', 'Chapter 19. MOS 15T: UH-60 Helicopter Repairer/Aircrew member', 'Performs duties described in paragraph (1) and provides technical guidance to subordinate personnel. Performs operational checks and scheduled inspections. Diagnoses and troubleshoots malfunctions in aircraft subsystems. Conducts flight and academic instruction in accordance with the Aircrew Training Program (ATP). Monitors hazardous material control and storage', '299e3397ad81171f0bb4b1d3d360268370f70148021a52da9a18db983e50311c', 22, 23, null, 208, null, null, false, null),
  ('d9ec38af-71c7-5ed2-912f-481807c2aba7', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15T', null, 'development', 'E-6', null, 'SSG — overview', 'Chapter 19. MOS 15T: UH-60 Helicopter Repairer/Aircrew member', 'Supervises and provides technical guidance to subordinate personnel performing duties described in paragraphs (1, 2) and evaluates the technical training program. Evaluates maintenance operations and facilities for compliance with directives, technical manuals, work standards, safety procedures, and operational policies. Performs maintenance trend analysis and applies production control, quality control and other maintenance management principles and procedures to airplane maintenance operations. Plans, conducts and supervises aircraft technical inspections. Computes basic weight and balance records. Participates in maintenance test flights. Ensure compliance with aircraft configuration control, Army Oil Analysis Program, and test measuring diagnostic calibration (TMDE). Conducts flight and academic instruction in accordance with the Aircrew Training Program (ATP).', '6a478afe2da14560071cf49c673b098ebcb74c139af83d66486d8a72bb6ab0fb', 23, 23, null, 209, null, null, false, null),
  ('4fb44356-a460-57b4-818e-ae27a2d3ebfa', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15T', null, 'development', 'E-7', null, 'SFC — overview', 'Chapter 19. MOS 15T: UH-60 Helicopter Repairer/Aircrew member', 'Supervises aircraft maintenance and technical inspection activities. Determines man hours, personnel, parts and facility requirements to repair aircraft and associated equipment. Plans aircraft maintenance areas, component repair, shops and facilities. Instructs subordinates in aircraft repair and technical inspection techniques and procedures according to directives, technical manuals, work standards, and operational policies. Maintains supply economy and discipline. Supervises the technical training program. Prepares evaluations, special reports, and records pertaining to aircraft maintenance repair and related activities. Recommends and administers plans and policies.', '454deb17ee4d88c6f609d47b2bc355e7af36576f5c4138d10a3ff8c99fca3a0c', 23, 23, null, 210, null, null, false, null),
  ('cf078098-5b52-5e57-a031-fef6a93b1fc5', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15T', null, 'development', 'E-8', null, 'MSG/1SG — overview', 'Chapter 19. MOS 15T: UH-60 Helicopter Repairer/Aircrew member', 'Merges into MOS 15Z, Aviation Senior Sergeant. See Chapter 23 for details.', '25459e3cf2f4782c4058c6a48aab54e061600fccdb3ace1cc8933e32c925681b', 23, 23, null, 211, null, null, false, null),
  ('5238549d-5aca-52a6-9370-cb4912e21bfe', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15U', null, 'development', 'E-1..E-4', null, 'PVT-CPL — overview', 'Chapter 20. MOS 15U: CH-47 Helicopter Repairer/ Aircrew Member', 'Removes and installs aircraft subsystem assemblies such as engines, rotors, gearboxes, transmissions, mechanical flight control, and their components. Services and lubricates aircraft and subsystems. Prepares aircraft for inspections and maintenance checks. Performs scheduled inspections and assists in performing special inspections. Performs limited maintenance operational checks and assists in diagnosing and troubleshooting aircraft subsystems using special tools and equipment as required. Maintains facilities for storage of flammable and hazardous materials. Uses and performs operator maintenance on tools, special tools and aircraft ground support equipment. Prepares forms and records related to aircraft maintenance. Performs non-rated crewmember duties.', '9d2865a1cb5b269e8f7cc4484207e6e7da354f4e5322f700417651bd117ab7d4', 24, 24, null, 212, null, null, false, null),
  ('7cd3d1cf-bace-596f-8115-54e01a07051a', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15U', null, 'development', 'E-5', null, 'SGT — overview', 'Chapter 20. MOS 15U: CH-47 Helicopter Repairer/ Aircrew Member', 'Performs duties described in paragraph (1) and provides technical guidance to subordinate personnel. Performs operational checks and scheduled inspections. Diagnoses and troubleshoots malfunctions in aircraft subsystems. Conducts flight and academic instruction in accordance with the Aircrew Training Program (ATP). Monitors hazardous material control and storage.', '49ebaa5e236747f463306f0fd0756aa89a18bb67edf0da2b1a2075c16e1d0c66', 24, 24, null, 213, null, null, false, null),
  ('e700407d-9e6b-5def-abea-5e8a7ab96ac3', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15U', null, 'development', 'E-6', null, 'SSG — overview', 'Chapter 20. MOS 15U: CH-47 Helicopter Repairer/ Aircrew Member', 'Supervises and provides technical guidance to subordinate personnel performing duties described in paragraphs (1, 2) and evaluates the technical training program. Evaluates maintenance operations and facilities for compliance with directives, technical manuals, work standards, safety procedures, and operational policies. Performs maintenance trend analysis and applies production control, quality control and other maintenance management principles and procedures to aircraft maintenance operations. Plans, conducts, and supervises aircraft technical inspections. Computes basic weight and balance records. Participates in maintenance test flights. Ensures compliance with aircraft configuration control, Army Oil Analysis Program and test measuring diagnostic calibration. Conducts flight and academic instruction in accordance with the ATP', '2ffaaca2e207812f9c4159c337446903f0458dac77b3a86e800ad8d2e2ec5a1d', 24, 24, null, 214, null, null, false, null),
  ('6d728c77-52bb-5a53-865e-9880f2f20a9e', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15U', null, 'development', 'E-7', null, 'SFC — overview', 'Chapter 20. MOS 15U: CH-47 Helicopter Repairer/ Aircrew Member', 'Supervises aircraft maintenance and technical inspection activities. Determines man-hours, personnel, parts and facility requirements to repair aircraft and associated equipment. Plans aircraft maintenance areas, component repair shops and facilities. Instructs subordinates in aircraft repair and technical inspection techniques and procedures according to directives, technical manuals, work standards and operational policies. Maintains supply economy and discipline. Supervises the technical training program. Prepares evaluations, special reports, and records pertaining to aircraft maintenance repair and related activities. Recommends and administers plans and policies. Conducts flight and academic instruction in accordance with the ATP.', '686274695359cc8d5a84ff553b3618e8e29bd7e5f92ae98db501aad886e9f6d0', 24, 24, null, 215, null, null, false, null),
  ('ef6dce06-366e-5229-a90d-3c9beac8bd54', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15U', null, 'development', 'E-8', null, 'MSG/1SG — overview', 'Chapter 20. MOS 15U: CH-47 Helicopter Repairer/ Aircrew Member', 'Merges into MOS 15Z, Aviation Senior Sergeant. See Chapter 23 for details.', '25459e3cf2f4782c4058c6a48aab54e061600fccdb3ace1cc8933e32c925681b', 25, 25, null, 216, null, null, false, null),
  ('d9296c21-f994-5f20-a489-16bc28aad051', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15X', null, 'development', 'E-1..E-4', null, 'PVT-CPL — overview', 'Chapter 21. MOS 15X: Tactical Unmanned Aircraft Systems (TUAS) Specialist', 'Executes UAS reconnaissance, security, target acquisition, and attack missions. Plans and analyzes flight missions. Designs, fabricates, configures, and tests UAS and associated payloads, ground control stations, and communication systems. Prepares UAS for deployment, shipment, and storage. Launches, controls, and recovers aircraft, performing pre-flight, in-flight, and post-flight inspections and operational checks. Conducts scheduled and unscheduled maintenance on airframes, payloads, and ground support equipment. Manages fuel, battery, and munitions systems, including transport, storage, and recovery. Operates mission planning systems, flight simulators, and tactical communication networks. Troubleshoots and repairs electrical components, flight controllers, and radio frequency systems using diagnostic tools. Maintains technical records and participates in site setup, breakdown, and after-action reviews. Ensures proper handling of hazardous materials and compliance with operational safety standards.', '2e2b94bf007dda59f009640db380898415ad451f1cbddf4a6660ef0dd037127d', 25, 25, null, 217, null, null, false, null),
  ('82e9acef-c8c8-5437-8eef-fa671482a84f', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15X', null, 'development', 'E-5', null, 'SGT — overview', 'Chapter 21. MOS 15X: Tactical Unmanned Aircraft Systems (TUAS) Specialist', 'Performs duties shown in preceding skill levels and provides guidance to subordinate Soldiers. Integrates emerging UAS capabilities and assists development of the operator and gunnery training program. Executes', 'bdb31cca335c325ebf84b5dd7b19b7aa0d276498a793422ae5ba2b2d45bb54e3', 25, 25, null, 218, null, null, false, null),
  ('77339b6f-8926-5e70-bcc8-9894544e6822', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15X', null, 'training', 'E-5', null, 'SGT — training', 'Chapter 21. MOS 15X: Tactical Unmanned Aircraft Systems (TUAS) Specialist', 'training of UAS Operators across formations on UAS assembly, operation, employment, and gunnery. Supervises and assists site setup and breakdown. Participates in mission planning including terrain, threat, and current situation analysis. Participates in and supervises operator maintenance and crew procedures performed on UAS air and ground equipment. Serves as the primary trainer of TUAS Specialists as a unit trainer. Monitors proper handling and storage of flammable, explosive, and hazardous materials. Schedules maintenance on test, measurement and diagnostic equipment (TMDE).', '4b045c8ed7ee6ef1eb822f120b547da5b745f4533cfcd11903c5b147180c8ec7', 25, 26, null, 219, null, null, false, null),
  ('90746f1f-549a-5587-889c-66a5b106bb88', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15X', null, 'development', 'E-6', null, 'SSG — overview', 'Chapter 21. MOS 15X: Tactical Unmanned Aircraft Systems (TUAS) Specialist', 'Performs duties shown in preceding skill levels and provides guidance to subordinate Soldiers. Advises commanders on optimal UAS integration and employment techniques, tactics, and procedures to include payload capability, payload employment, airspace management, and electromagnetic spectrum survivability. Manages the UAS training, gunnery standardization and safety programs. Synchronizes UAS frequency management against threat EW. Performs, supervises, and provides technical guidance to subordinate personnel performing UAS operations, maintenance, and crew procedures. Performs site selection using maps, photographs, terrain analysis, and information reports. Evaluates maintenance operations and facilities for compliance with directives, technical manuals, work standards, safety procedures and operational policies. Performs technical inspections. Applies production control, quality control and other maintenance management principles and procedures. Computes basic weight and balance and ensures compliance with aircraft configuration control, Army Oil Analysis Program, and TMDE calibration. Supervises site setup and breakdown. Coordinates with adjacent, higher, and supported units. Conducts pre-combat checks and inspections. Supervises the conduct of after-action reviews (AAR). Monitors requisitions of parts, tools and supplies.', '94b1229e4537c19f773366c8fa440b9184cb5dbd08b6899d5036287313d17b70', 26, 26, null, 220, null, null, false, null),
  ('4e9b7b09-a5a1-580c-b515-3757733385a4', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15X', null, 'development', 'E-7', null, 'SFC — overview', 'Chapter 21. MOS 15X: Tactical Unmanned Aircraft Systems (TUAS) Specialist', 'Performs duties shown in preceding skill levels and provides guidance to subordinate Soldiers. Supervises operations and activities of the platoon. Applies military intelligence collection, targeting processes, and security planning to UAS operations. Conducts and assists development of the unit', '371643b9d23186bf27e471d1270d70bb24bfbfacf7eb42dc20fd551b659f056e', 26, 26, null, 221, null, null, false, null),
  ('4b3beb14-2163-581e-853d-f809cc052720', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15X', null, 'training', 'E-7', null, 'SFC — training plan', 'Chapter 21. MOS 15X: Tactical Unmanned Aircraft Systems (TUAS) Specialist', 'Determines man-hours, personnel, parts and facility requirements to repair UAS and associated equipment. Plans maintenance areas, component repair, technical inspection techniques, and procedures, according to directives, technical manuals, work standards, and operational policies. Maintains supply economy and discipline. Supervises the unmanned aircraft systems technical', '63fccd5f911b162ab8000acb06544438ec7c5e10eb30117d120bc1be03e12396', 26, 26, null, 222, null, null, false, null),
  ('b122bf6f-4712-5608-919a-f879312b2b2e', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15X', null, 'training', 'E-7', null, 'SFC — training program', 'Chapter 21. MOS 15X: Tactical Unmanned Aircraft Systems (TUAS) Specialist', 'Prepares evaluations, special reports, and records pertaining to unmanned aircraft systems maintenance and related activities. Recommends and administers plans and policies.', '8db606d568133055adc6582249199ce3db53944ecec83add492050c1086c3c69', 26, 26, null, 223, null, null, false, null),
  ('fc677a3f-5ee9-5d85-ac46-2987cb50aecf', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15X', null, 'development', 'E-8', null, 'MSG/1SG — overview', 'Chapter 21. MOS 15X: Tactical Unmanned Aircraft Systems (TUAS) Specialist', 'Merges into MOS 15Z, Aviation Senior Sergeant. See Chapter 23 for details.', '25459e3cf2f4782c4058c6a48aab54e061600fccdb3ace1cc8933e32c925681b', 26, 26, null, 224, null, null, false, null),
  ('1db194a5-54e3-54af-8c8e-306f04e81eae', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Y', null, 'development', null, null, 'Overview', 'Chapter 22. MOS 15Y: AH-64 Armament/Electrical/Avionics Systems', 'Repairer', 'c379163b56de65a5c4cd7f6ea94b176067167bbafdfe4eb8d5f9a04a1fe8d6d9', 27, 27, null, 225, null, null, false, null),
  ('e81da992-ac63-541c-87bc-89f0de353b49', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Y', null, 'development', 'E-1..E-4', null, 'PVT-CPL — overview', 'Chapter 22. MOS 15Y: AH-64 Armament/Electrical/Avionics Systems', 'Diagnoses, troubleshoots, and repairs malfunctions in AH-64 armament, electrical, and avionics systems and components including solid state and transistorized subsystems according to pertinent technical manuals, directives and safety procedures. Perform maintenance, authorized modifications and alignment on aircraft weapons components, fire control units, and sighting elements, electronic and mechanical devices. Repairs, replaces and performs operational and preventive checks and alignment on aircraft flight controls, stabilization systems, avionics and controlled cryptographic equipment. Uses and performs operator maintenance on tools, special tools and aircraft ground support equipment. Requisitions and maintains shop and bench stock for repair of aircraft systems and equipment. Maintains facilities for storage of flammable and hazardous materials. Prepares forms and records related to aircraft maintenance. Participates in the setup of the Forward Arming and Refueling Point (FARP).', 'd48455a5160c1246ba6390e562afd6e796415050d8c0d5b66e171046ef93c918', 27, 27, null, 226, null, null, false, null),
  ('294126d6-21d5-5813-81bb-92c10272f47b', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Y', null, 'development', 'E-5', null, 'SGT — overview', 'Chapter 22. MOS 15Y: AH-64 Armament/Electrical/Avionics Systems', 'Performs duties described in paragraph (1) and provides technical guidance to subordinate personnel. Performs operational checks and scheduled inspections. Diagnoses and troubleshoots malfunctions in aircraft subsystems. Alters or modifies material according to DA approved modifications work orders. Monitors hazardous material control and storage', '18d682251ebf4da523ccbd09429b050b57529cdde30066f265cf1aabeebf251d', 27, 27, null, 227, null, null, false, null),
  ('a46c6ff6-b191-55bb-8f9a-a3bbec1b4d54', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Y', null, 'development', 'E-6', null, 'SSG — overview', 'Chapter 22. MOS 15Y: AH-64 Armament/Electrical/Avionics Systems', 'Supervises and provides technical guidance to subordinate personnel performing duties described in paragraphs (1, 2) and evaluates the technical training program. Evaluates maintenance operations and facilities for compliance with directives, technical manuals, work standards, safety procedures, and operational policies. Performs maintenance trend analysis and applies production control, quality control and other maintenance management principles and procedures to airplane maintenance operations. Plans, conducts, and supervises aircraft technical inspections. Compute basic weight and balance records. Participate in maintenance test flights. Ensure compliance with aircraft configuration control, Army Oil Analysis Program and test measuring diagnostic calibration. Supervise the establishment of the FARP.', '3f76fa122c08f0597951f6ede2ce6952a2403dc4683ef58687f2615f568e4912', 27, 28, null, 228, null, null, false, null),
  ('d30db843-86f8-513f-a617-e1ccb3c65e80', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Y', null, 'development', 'E-7', null, 'SFC — overview', 'Chapter 22. MOS 15Y: AH-64 Armament/Electrical/Avionics Systems', 'At this point a 15Y30 merges to become a 15L40. Critical', '20b895b5171dce0e3c440bbf9c777c899aa3cee38c19d8c771880210e6835339', 28, 28, null, 229, null, null, false, null),
  ('d2414f68-43ad-5c7b-b988-c33223d1c5b4', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Y', null, 'assignments', 'E-7', null, 'SFC — assignments', 'Chapter 22. MOS 15Y: AH-64 Armament/Electrical/Avionics Systems', 'assignments include Platoon Sergeant, Production Control NCO, Aircraft Armament Senior Systems Supervisor, Avionics Electronic Systems Supervisor, Senior Training Management NCO. See Chapter 13 for details.', '212d2b8d474a22deaf0980fc5e3ab604b95ff6505b738eec1ed4584c20709dcb', 28, 28, null, 230, null, null, false, null),
  ('1df839f9-fae8-59d1-bcf7-d317a9024c5d', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Y', null, 'development', 'E-8', null, 'MSG/1SG — overview', 'Chapter 22. MOS 15Y: AH-64 Armament/Electrical/Avionics Systems', 'At this point, 15Ls merge into MOS 15Z, Aviation Senior Sergeant. See Chapter 23 for details.', '9114c4dd3b4f0e0e841e35d81305d3bbaeefd058fcf08680014346b0bb653661', 28, 28, null, 231, null, null, false, null),
  ('746f1e58-c4e7-514e-ae9f-7544e8fdc17a', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Z', null, 'development', 'E-8', null, 'MSG/1SG (15Z50) — Additional guidance', 'Chapter 23. MOS 15Z: Aviation Senior Sergeant', 'The MSG serves as a versatile senior leader who operates either as the Operations NCOIC in the Battalion Operations (S3) section or as a Production Control NCOIC. When positioned as the Battalion Operations NCOIC, the MSG oversees the flight operations section, compiles complex technical reports, facilitates Battalion level training and readiness meetings, and enforces flight violation reporting protocols. When assigned as the Production Control NCOIC, the MSG exercises supervision over aviation unit, intermediate, and depot maintenance activities, effectively managing a diverse mix of aircraft maintenance and component repair MOSs. In this logistical role, the MSG communicates detailed technical timelines on a regular or as needed basis regarding Operational Readiness (OR) rate, Fully Mission Capable (FMC), and Non-Mission Capable (NMC) aircraft to respective owning units. By blending tactical operations with synchronized logistical control, the MSG ensures that all assigned aircraft are strictly maintained to airworthiness standards and kept in a state of mission readiness.', '69940ca7963afa9c727dfdf242edb91f4a1a724cec072f94a42bbd64b92514e2', 28, 28, null, 232, null, null, false, null),
  ('d620554f-001d-54f3-ae40-9b8836f8bde8', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Z', null, 'development', 'E-8', null, 'MSG/1SG (15Z50) — Additional guidance', 'Chapter 23. MOS 15Z: Aviation Senior Sergeant', 'The 1SG serves as Senior Enlisted Advisor to the Company Commander for a multi-functional aviation company, providing operational and administrative oversight across flight operations, specialized maintenance, air traffic control, and unmanned systems. Directs the health, welfare, morale, professional development, and tactical readiness of all assigned personnel. Manages critical Soldier programs including promotions, awards, physical fitness, and Army Body Composition Program compliance while enforcing military discipline, safety protocols, and HAZMAT regulations. Monitors the Fighter Management and Aircrew Training Programs to ensure Non-Rated Crewmembers and UAS Operators maintain currency and readiness levels. Coordinates with airfield management and Air Traffic Control to safely integrate crewed and unmanned assets into tactical airspace. Partners with Production and Quality Control to synchronize phase maintenance, maximizing Operational Readiness and Fully Mission Capable ratings across Powerplant, Powertrain, Pneudraulics, Avionics, Structural, and Ground Control Station shops. Drives Command Supply Discipline to ensure parts availability and oversees the secure handling, transport, and loading of munitions. The key developmental position for MOS 15Z50 is First Sergeant in an Aviation Company.', 'f594c7ce82d1c4c91a23c1490f123976a8cbda2769cb2c5e01fc490bb269ea7f', 28, 29, null, 233, null, null, false, null),
  ('9cb9288e-f75f-5147-b5e8-a52dac249db8', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Z', null, 'development', 'E-9', null, 'SGM/CSM (15Z60) — Additional guidance', 'Chapter 23. MOS 15Z: Aviation Senior Sergeant', 'The SGM serves as the NCOIC within the Brigade Operations (S3) section, synchronizing the activities of the staff and planning complex multi-domain training for the commander. Operating as the operational backbone of the headquarters, the SGM integrates staff officers and noncommissioned officers into the Military Decision-Making Process (MDMP) and coordinates high-level staff functions to ensure mission orders are executed effectively. By combining comprehensive training management with battlefield command post leadership, the SGM mentors and develops senior NCOs across the battalion and brigade to enforce the highest standards of professional conduct, discipline, and operational readiness.', '753f1aeb7f94616c54a31058001768fea2961b262eeaa1b9fe5785ee473bd457', 29, 29, null, 234, null, null, false, null),
  ('c1509821-5b9c-5ff5-8a12-fcafb0909e03', '9433b0a6-e0a0-5949-9008-8bd17a1eaefe', 'Army', 'enlisted', '15Z', null, 'development', 'E-9', null, 'SGM/CSM (15Z60) — Additional guidance', 'Chapter 23. MOS 15Z: Aviation Senior Sergeant', 'The CSM serves as the Senior Enlisted Advisor to the commander within a Combat Aviation Brigade (CAB), providing strategic, tactical, and technical guidance to the staff on all aviation operations. As the principal enlisted advisor, the CSM is directly involved with all matters affecting the command, with a primary focus on ensuring Soldier welfare, morale, and training readiness. In this capacity, the CSM oversees multiple vital readiness initiatives, including the Aviation Maintenance Training Program (AMTP), unit physical fitness, and the Army Body Composition Program (ABCP). Monitors the Fighter Management and Aircrew Training Programs to ensure Non- Rated Crewmembers and UAS Operators maintain currency and readiness levels. By blending high-level operational oversight with disciplined mentorship, the CSM enforces the highest standards of professional conduct, military appearance, and combat readiness throughout the CAB.
b. Goals for Development:
(1) MSG/1SG: The critical assignment for a 15Z50 is successful completion of time as a First Sergeant. Accumulating 24+ months in a coded 15Z50 position is critical for future promotion and progression.
(2) SGM/CSM: The pinnacle achievement for a 15Z60 is selection and successful service as a Battalion or Brigade Command Sergeant Major, leading large-scale multi-domain operations and enterprise-level logistics.', '526c6c5c7d813476875d2406d3f6a39acd89fda9a230cf77a78f9a58b6e6e7fb', 29, 30, null, 235, null, null, false, null);
commit;
