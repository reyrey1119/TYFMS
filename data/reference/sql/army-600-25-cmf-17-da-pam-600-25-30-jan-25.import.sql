-- Import: army-600-25-cmf-17-da-pam-600-25-30-jan-25
-- 86 passages from DA PAM 600-25: Cyber (CMF 17) Career Progression Plan
-- Imported as review_status='unreviewed'; it is NOT served to users until approved.
begin;
insert into public.reference_sources
  (id, branch, personnel_category, publication_number, title, chapter, career_field, proponent, official_url,
   publication_date, effective_date, last_checked_at, checksum_sha256, ingestion_status, review_status, notes, extraction_tool, import_batch, content_sha256)
values ('69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', 'DA PAM 600-25', 'Cyber (CMF 17) Career Progression Plan', null, 'CMF 17', null, 'https://api.army.mil/e2/c/downloads/2025/01/30/463d758e/cmf-17-da-pam-600-25-30-jan-25.pdf',
   '2025-01-30', null, '2026-10-18T00:00:00Z', '832d608ac30bcb4714caf75239d0094cb4d2700818eb2295caf47728d2e69a4b', 'extracted', 'unreviewed', 'Date basis: the 2025-01-30 date comes from the official file name and the Army G-1 listing (https://www.army.mil/g-1), checked 2026-10-16; the PDF body may print no date. Imported for 17C, 17E, 17Z. Duties and prerequisites are NOT imported from this guide (DA PAM 611-21 is the source for them); promotion-board criteria are stored but never shown. LIMITATIONS: Reserve Component chapters and professional-development-model figures are not imported; career-field-wide rank guidance is attached to every MOS of this guide that has its own chapter.', 'pdf-parse 2.4.5', 'army-600-25-cmf-17-da-pam-600-25-30-jan-25@2026-10-18', '9bd62fdb22090e3dafa09921190f4d24bc5c1a7d26c0c7fa2903eec99f6a5f85')
on conflict (id) do update set
  publication_number = excluded.publication_number, title = excluded.title, career_field = excluded.career_field, proponent = excluded.proponent,
  official_url = excluded.official_url, publication_date = excluded.publication_date, last_checked_at = excluded.last_checked_at,
  checksum_sha256 = excluded.checksum_sha256, ingestion_status = 'extracted', notes = excluded.notes,
  extraction_tool = excluded.extraction_tool, import_batch = excluded.import_batch,
  branch = excluded.branch, personnel_category = excluded.personnel_category,
  chapter = excluded.chapter, effective_date = excluded.effective_date,
  content_sha256 = excluded.content_sha256,
  review_status = 'unreviewed', reviewed_by = null, reviewed_at = null;
delete from public.reference_passages where source_id = '69b2d2fd-939e-5fa1-804f-a4277816db9e';
insert into public.reference_passages
  (id, source_id, branch, personnel_category, occupation_code, occupation_title, section_type, rank_band, components, heading, chapter, body, body_sha256, pdf_page_start, pdf_page_end, printed_page, sort_order, effective_from, effective_to, cumulative, skill_level)
values
  ('7d78b0e0-1e11-5a17-94f3-a23538c4bddc', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'development', null, null, 'Overview', 'Chapter 3. Recommended Career Management Self-Development by Rank', 'Army wide self-development: All Soldiers bear individual responsibility for the success of their career by ensuring timely completion of Army requirements through individual effort and active participation in institutional training, self-development, and civilian educational activities.', '7ab1f41583b2fa9a42ba3a27a6bd8f8dd35ecd3028290ec77efb45e1735f11d3', 1, 1, null, 0, null, null, false, null),
  ('b996423f-2247-5fce-b8af-d5f698306ef8', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'development', 'E-1..E-4', null, 'Private-Specialist/Corporal (Skill Level 1) — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development by Rank', 'a. A Soldier''s career quality and success directly correlate with their consistent commitment to excellence, regardless of the mission. By committing to high goals, Soldiers develop leadership skills and gain practical knowledge and ambition to apply effectively. Awards and decorations recognize Soldiers for their accomplishments, motivating fellow Soldiers and building the team.
b. Soldiers should study the history of the Cyber Corps and study the following military publications: (1) FM 3-12, (2) Joint Publication (JP) 3–12, (3) ADP 3-0, (4) ADPR 3-0, (5) ADP 5-0, (6) ADPR 5-0, (7) ATP 2-91.9 (U), (8) ATP 3-12.3; all -10 level maintenance manuals associated with their equipment; Standard Operating Procedures (SOPs); tactics, techniques, and procedures (TTPs); and battle drills. Strive to achieve honors (i.e. Commandant’s List, Distinguished Graduate, or Honor Graduate) at Professional Military Education (PME).
c. Participate in competitive boards such as the Soldier of the Month, Quarter, or Year and Army Best Warrior/Squad Competitions to instill discipline and improve verbal communication skills.
d. Volunteer to participate in skill enhancing events like cyber challenges and Industry Competitions to broaden technical knowledge base.
e. Soldiers may earn promotion points for technical certifications and Army Training Information System (ATIS) training courses; a full list of certifications can be found on the Army Credentialing Opportunities On-Line (COOL) website. Soldiers can locate a listing of certifications associated with the MOS and skill level by viewing the MOS Career Maps posted on Army Career Tracker (ACT) website.
f. Pursue advanced education as a critical aspect of your self-development program. Consider an academic program related to your MOS using information from the ArmyIgnitED website or consult with an educational advisor. Begin an associate’s degree program, preferably in Science, Technology, Engineering, and Mathematics (STEM) or cybersecurity, or accumulate two years of college credit towards an accredited degree in any area of interest. These self-development options depend on your desire to excel. Participate in various correspondence courses to achieve your individual educational goals. Use the College-Level Examination Program (CLEP) and Defense Activity for Non-Traditional Education Support (DANTES) tests to convert previously acquired knowledge or training into college credit. Access the Defense Cyber Crime Center (DC3) Cyber Training Academy (DCITA) (https://www.dcita.edu/) for technical training and industry certification preparation.', '4dd8b4b397088df722ee627f7ea784de0eaab8555d0b10524caa95c66b17b9a4', 1, 2, null, 1, null, null, false, null),
  ('b7cf15a8-3360-5e8d-b6b0-6e3a26ba85e3', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'development', 'E-5', null, 'Sergeant (Skill Level 2) — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development by Rank', 'a. Sergeants (SGT) commit to achieving high goals to develop leadership skills and gain practical knowledge and ambition for effective application. They guide and support less experienced Soldiers in sustaining and building their technical and tactical skill sets through teaching and coaching to assist them in reaching their personal and professional potential.
b. Sergeants should focus on mastering the military publications listed at the preceding skill level and expand proficiency across the spectrum of Army doctrinal, operational, and technical publications and become familiar with where to find them. One such publication that can be helpful towards self- development for CMF17 is Smart book DA PAM 611-21 Chapters 9 thru 14 found on MilSuite at https://www.milsuite.mil/book/groups/smartbookdapam611-21.
c. Strive to achieve honors (i.e. Commandant’s List, Distinguished Graduate, or Honor Graduate) at PME schools.
d. Participate in competitive boards such as the Noncommissioned Officer (NCO) of the Month/Quarter/Year, Sergeant Audie Murphy, Sergeant Morales, and Army Best Warrior/Squad Competitions. These boards broaden the knowledge base, instill discipline and improve the Soldier’s ability to communicate verbally to enhance confidence and build more adaptive Leaders.
e. Volunteer to participate in skill enhancing events like cyber challenges and industry competitions to broaden technical knowledge base and mentor participating subordinate Soldiers.
f. Sergeants may earn promotion points for technical certifications and ATIS training courses; a full list of certifications can be found on the COOL website. Soldiers can locate a listing of certifications associated with the MOS and skill level by viewing the MOS Career Maps posted on the ACT website.
g. Sergeants should work towards an associate’s degree program preferably in a STEM, Cyber Security, Electrical/Computer Engineering, or Leadership program, or accumulate two years of college credit towards an accredited college degree in any area of interest.
h. Broaden their focus to include functional training such as the Airborne Course, Air Assault Course, Ranger School, and Culture and Language Training.', '2a6720f26f575c387a4881b437a8a4ddefb5a747b3f54bd2a892aeb989f821ae', 2, 3, null, 2, null, null, false, null),
  ('b7a4d942-1e22-5db4-8d59-65c3c5d73538', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'development', 'E-6', null, 'Staff Sergeant (Skill Level 3) — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development by Rank', 'a. Staff Sergeants (SSG) become highly sought-after leaders who develop and guide Soldiers through active counseling, coaching and mentoring. Seize every opportunity to build skills and confidence in your team, fostering growth not just in formal sessions. Cultivate competent and confident NCOs through progressive, sequential education, training, and experience. Oversee the development of team training while empowering Soldiers and enhancing their own technical and tactical skill sets.
b. Proficiently understand the military publications noted in the preceding skill levels and expand your knowledge across the spectrum of Army and Joint administrative publications as necessary or required. These NCOs should know where to find military publications related to their career field and study them to become familiar with the concepts therein.
c. Strive to achieve honors (i.e. Commandant’s List, Distinguished Graduate, or Honor Graduate) at PME.
d. Participate in competitive boards such as the NCO of the Month/Quarter/Year, Sergeant Audie Murphy, Sergeant Morales, and Army Best Warrior/Squad Competitions. These boards broaden the knowledge base, instill discipline, improve the ability to communicate verbally to enhance confidence, build more adaptive leaders, and they set the example for Soldiers to follow. Staff Sergeants should host mock boards and volunteer for competitive board membership.
e. Participate in skill enhancing and volunteer events like local STEM groups and activities as well as cyber challenges and industry competitions to broaden technical knowledge base and network with participating agencies. These events are used as opportunities for team building and mentorship to subordinate Soldiers and keep technical skills sharp and relevant, plus develop positive community relationships and grow professionals both inside and outside of the service.
f. Awards and decorations serve to recognize Soldiers for their accomplishments and tend to both motivate fellow Soldiers and build the team. Staff Sergeants should write and submit award recommendations for subordinates and mentor Soldiers on achievements that warrant unit recognition.
g. Staff Sergeants should begin working toward a bachelor’s degree preferably in a STEM, Cyber Security, Electrical/Computer Engineering, Leadership, or Project Management program, or accumulate four years of college credits towards an accredited degree in any area of interest. Staff Sergeants may also consider applying for the Degree Completion Program/Cooperative Degree Program IAW AR 621-1.
h. Staff Sergeants should maintain awareness of their continuing education (CE) hours and maintenance fees associated with credentials to remain current and seek additional credentialing as listed on the COOL Website.
i. Staff Sergeants should seek generating force and broadening assignments such as Drill Sergeant, Recruiter, ALC Small Group Leader, Instructor, and Training with Industry (TWI) which will aid in distinguishing them from their peers.', 'e59d1274b6ac81c189dc63b8616079b769d535890b2eaea0bc7887b33af55c9e', 3, 4, null, 3, null, null, false, null),
  ('cb2f52de-2d98-5979-bdb0-1de99686ae62', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'development', 'E-7', null, 'Sergeant First Class (Skill Level 4) — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development by Rank', 'a. Continue self-motivated development activities such as professional reading, technical certifications, and college courses that assist the senior NCO in developing organizational leadership skills needed to coach, teach and mentor Soldiers. SFCs place emphasis on developing writing and speaking skills. Focus on subjects such as organizational behavior, personnel management, time management, Army and Joint operations, and battle staff functions, are essential for their role.
b. As SFCs advance, they increasingly focus on doctrinal, management, and operational topics in their reading materials. SFCs proficiently understand the military publications noted in the preceding skill levels and study joint publications from the Joint Chiefs of Staff webpage, such as (CJCSI 1805.01B, CJCSI 6245.01A, CJCSI 3100.01D, and CJCSM 3150.07E), to expand their knowledge of Army and Joint cyberspace doctrinal principles.
c. Strive to achieve honors (i.e. Commandant’s List, Distinguished Graduate, or Honor Graduate) at PME.
d. Sergeants First Class should host mock boards at the section, platoon and company level and serve as a competitive board member.
e. SFCs participate in and organize events like local STEM groups, cyber challenges, and industry competitions to expand their technical knowledge and network with organizations. They also pursue volunteer opportunities to develop youth and build community trust.
f. As advanced education gains increased importance, SFCs should strive to complete a bachelor’s degree preferably in a STEM, Cyber Security, Electrical/Computer Engineering, Leadership, or Project Management program, or accumulate four years of college credits towards an accredited degree in any area of interest. SFCs may also consider applying for Degree Completion Program/Cooperative Degree Program IAW AR 621-1.
g. Broaden their focus to include functional training such as Battle Staff, Master Fitness Trainer (MFT), Master Resilience Trainer (MRT), Equal Opportunity (EO), and Sexual Harassment/Assault Response and Prevention (SHARP) representative to add value to the organization.
h. Sergeants First Class should seek generating force and broadening assignments which could help separate them from their peers. Generating force and broadening assignments include Drill Sergeant, Recruiter, SLC Small Group Leader, Instructor, Training with Industry (TWI), Human Resources Command (HRC) Enlisted Assignments NCO/ Professional Development NCO (PDNCO), Research Development Test & Evaluation (RDTE), Special Agencies, and Senior Career Manager.', 'fb5ce1bddcc6aef234fd9ffb29dc17682c8e73db10d1b6559e687efb7e01c24e', 4, 4, null, 4, null, null, false, null),
  ('303530fb-eb74-5a04-9b16-c362c3353c02', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'development', 'E-8', null, 'Master Sergeant/First Sergeant (Skill Level 5) — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development by Rank', 'a. Master Sergeants (MSG)/First Sergeants (1SG) should recognize their increasing role as a senior NCO and pursue opportunities from various sources and publications that will enhance their understanding of “How the Army Runs” in order to influence and improve the Army’s systems that contribute to the success of their organizations.
b. Master the military publications noted in the previous skill levels and expand proficiency across the spectrum of Army and Joint administrative, doctrinal, operational, and technical publications as necessary or required. Continue to build on organizational and strategic understanding with emphasis on upper-level management tasks covered in AR 220-45, AR 614-200, AR 840-10, CJCSM 3122.05, CJCSM 3130.01 and Capstone Concept for Joint Operations (CCJO): Joint Force 2020. Additional publications that provide for self-development at this level would be DoD Instruction (DODI) S-5240.23, and DODI 8500.01 which are found on the Executive Services Directorate, Directives Division webpage. These publications further expand knowledge in the planning and support of Army and Joint cyberspace doctrinal principles.
c. Strive to achieve honors (i.e. Commandant’s List, Distinguished Graduate, or Honor Graduate) at schools.
d. Master Sergeants/First Sergeants should look to organize, coordinate, and actively support competitive boards such as the Army Best Warrior/Squad Competition, industry competitions, and cyber challenges to broaden the knowledge base, instill discipline and improve the Soldier''s ability to communicate verbally to enhance confidence and build more adaptive Leaders.
e. Master Sergeants/First Sergeants should write and submit recommendations for awards for their Soldiers and mentor Soldiers on tasks that stand out to the unit for recognition.
f. As advanced education gains increased importance, Master Sergeants/First Sergeants should strive to work towards a graduate degree preferably in a STEM, Cyber Security, Leadership, or Project Management program or accumulate college credit towards an accredited degree in any area of interest. Master Sergeants/First Sergeants may also consider applying for the Degree Completion Program/Cooperative Degree Program IAW AR 621-1.
g. Broaden their focus to include functional training like Battle Staff, Joint Cyberspace Operations Planners Course (JCOPC), Army Cyber Operations Planners Course (ACOPC), and Joint Advanced Cyber Warfare Course (JACWC).
h. Master Sergeants/First Sergeants should look to be placed in generating and broadening assignments which will help them to stand out among their peers. Generating and broadening assignments include Training with Industry (TWI), HRC Enlisted Assignments NCO/ Professional Development NCO (PDNCO), Senior Career Manager, and Senior Instructor.
i. Master Sergeants/First Sergeants should keep up with their continuing education (CE) and maintenance fees associated with credentials to keep them valid and seek to complete additional credentialing as listed on the COOL Website. In addition, they should look for opportunities to research, write, peer-review, as well as seek peer-review to publish professional articles, papers, and books.', '78aaeeafde23e3e5bd0664af1a673587bea5c357b3f5d587d6ea6625056d1326', 4, 5, null, 5, null, null, false, null),
  ('00470227-34bd-55b9-b7aa-91cfa5fc6446', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'development', 'E-9', null, 'Sergeant Major/Command Sergeant Major (Skill Level 6) — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development by Rank', 'a. The Sergeant Major/Command Sergeant Major (SGM/CSM) guides cyberspace, EW, and CEMA organizations and missions in support of Army and combatant command objectives. The Sergeant Major understands and master’s Joint and Army principles to integrate within the operational framework. The goal of the SGM/CSM is to continually develop organizational leadership skills needed to coach, teach, and mentor Soldiers. Outstanding communications skills are required just by the nature of the number of Soldiers their communications reach. Skills in community and public relations are also important since the SGM/CSM will often represent the command or Army in civic functions.
b. The SGM/CSM reads a wide-ranging selection of military and civilian professional publications on a regular basis, as well as current publications on world politics, economics, and current events to broaden and deepen the knowledge base required of an Army senior leader. SGM/CSM are encouraged to access the SGM/CSM talent management overview from the Sergeants Major Management Directorate on the HRC website.
c. Write articles for publication in Army and public professional journals. Seek out public speaking opportunities and community involvement. Represent the Army in civic functions to enhance leadership, build trust and hone existing skill sets.
d. Possess a bachelor’s degree and actively work towards completing a master’s degree in a chosen discipline.
e. Broaden their focus to include functional training like Keystone and Pre- Command Course.
f. SGM/CSM should look to be placed in generating and broadening assignments which will help them to stand out among their peers. Generating and broadening assignments include Operations SGM, Proponent SGM, Joint Agency SEL, Training and Education Division SGM, CSM, and Sergeants Major Course Instructor.', '53d74c69f8a97458d86d83ef53b88c166ace4974ea115d287f90fe38563477af', 5, 6, null, 6, null, null, false, null),
  ('eb21c011-dea5-5abc-9648-1eaae1c6306e', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'development', null, null, 'Overview', 'Chapter 3. Recommended Career Management Self-Development by Rank', 'Army wide self-development: All Soldiers bear individual responsibility for the success of their career by ensuring timely completion of Army requirements through individual effort and active participation in institutional training, self-development, and civilian educational activities.', '7ab1f41583b2fa9a42ba3a27a6bd8f8dd35ecd3028290ec77efb45e1735f11d3', 1, 1, null, 7, null, null, false, null),
  ('b3e13365-bcc1-5132-813e-88b9bd21ceaf', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'development', 'E-1..E-4', null, 'Private-Specialist/Corporal (Skill Level 1) — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development by Rank', 'a. A Soldier''s career quality and success directly correlate with their consistent commitment to excellence, regardless of the mission. By committing to high goals, Soldiers develop leadership skills and gain practical knowledge and ambition to apply effectively. Awards and decorations recognize Soldiers for their accomplishments, motivating fellow Soldiers and building the team.
b. Soldiers should study the history of the Cyber Corps and study the following military publications: (1) FM 3-12, (2) Joint Publication (JP) 3–12, (3) ADP 3-0, (4) ADPR 3-0, (5) ADP 5-0, (6) ADPR 5-0, (7) ATP 2-91.9 (U), (8) ATP 3-12.3; all -10 level maintenance manuals associated with their equipment; Standard Operating Procedures (SOPs); tactics, techniques, and procedures (TTPs); and battle drills. Strive to achieve honors (i.e. Commandant’s List, Distinguished Graduate, or Honor Graduate) at Professional Military Education (PME).
c. Participate in competitive boards such as the Soldier of the Month, Quarter, or Year and Army Best Warrior/Squad Competitions to instill discipline and improve verbal communication skills.
d. Volunteer to participate in skill enhancing events like cyber challenges and Industry Competitions to broaden technical knowledge base.
e. Soldiers may earn promotion points for technical certifications and Army Training Information System (ATIS) training courses; a full list of certifications can be found on the Army Credentialing Opportunities On-Line (COOL) website. Soldiers can locate a listing of certifications associated with the MOS and skill level by viewing the MOS Career Maps posted on Army Career Tracker (ACT) website.
f. Pursue advanced education as a critical aspect of your self-development program. Consider an academic program related to your MOS using information from the ArmyIgnitED website or consult with an educational advisor. Begin an associate’s degree program, preferably in Science, Technology, Engineering, and Mathematics (STEM) or cybersecurity, or accumulate two years of college credit towards an accredited degree in any area of interest. These self-development options depend on your desire to excel. Participate in various correspondence courses to achieve your individual educational goals. Use the College-Level Examination Program (CLEP) and Defense Activity for Non-Traditional Education Support (DANTES) tests to convert previously acquired knowledge or training into college credit. Access the Defense Cyber Crime Center (DC3) Cyber Training Academy (DCITA) (https://www.dcita.edu/) for technical training and industry certification preparation.', '4dd8b4b397088df722ee627f7ea784de0eaab8555d0b10524caa95c66b17b9a4', 1, 2, null, 8, null, null, false, null),
  ('7bbd1a86-3e7e-56c6-995f-b17d70cf829c', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'development', 'E-5', null, 'Sergeant (Skill Level 2) — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development by Rank', 'a. Sergeants (SGT) commit to achieving high goals to develop leadership skills and gain practical knowledge and ambition for effective application. They guide and support less experienced Soldiers in sustaining and building their technical and tactical skill sets through teaching and coaching to assist them in reaching their personal and professional potential.
b. Sergeants should focus on mastering the military publications listed at the preceding skill level and expand proficiency across the spectrum of Army doctrinal, operational, and technical publications and become familiar with where to find them. One such publication that can be helpful towards self- development for CMF17 is Smart book DA PAM 611-21 Chapters 9 thru 14 found on MilSuite at https://www.milsuite.mil/book/groups/smartbookdapam611-21.
c. Strive to achieve honors (i.e. Commandant’s List, Distinguished Graduate, or Honor Graduate) at PME schools.
d. Participate in competitive boards such as the Noncommissioned Officer (NCO) of the Month/Quarter/Year, Sergeant Audie Murphy, Sergeant Morales, and Army Best Warrior/Squad Competitions. These boards broaden the knowledge base, instill discipline and improve the Soldier’s ability to communicate verbally to enhance confidence and build more adaptive Leaders.
e. Volunteer to participate in skill enhancing events like cyber challenges and industry competitions to broaden technical knowledge base and mentor participating subordinate Soldiers.
f. Sergeants may earn promotion points for technical certifications and ATIS training courses; a full list of certifications can be found on the COOL website. Soldiers can locate a listing of certifications associated with the MOS and skill level by viewing the MOS Career Maps posted on the ACT website.
g. Sergeants should work towards an associate’s degree program preferably in a STEM, Cyber Security, Electrical/Computer Engineering, or Leadership program, or accumulate two years of college credit towards an accredited college degree in any area of interest.
h. Broaden their focus to include functional training such as the Airborne Course, Air Assault Course, Ranger School, and Culture and Language Training.', '2a6720f26f575c387a4881b437a8a4ddefb5a747b3f54bd2a892aeb989f821ae', 2, 3, null, 9, null, null, false, null),
  ('2b4cc4e8-3e0b-5810-b52e-f448e7ff7792', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'development', 'E-6', null, 'Staff Sergeant (Skill Level 3) — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development by Rank', 'a. Staff Sergeants (SSG) become highly sought-after leaders who develop and guide Soldiers through active counseling, coaching and mentoring. Seize every opportunity to build skills and confidence in your team, fostering growth not just in formal sessions. Cultivate competent and confident NCOs through progressive, sequential education, training, and experience. Oversee the development of team training while empowering Soldiers and enhancing their own technical and tactical skill sets.
b. Proficiently understand the military publications noted in the preceding skill levels and expand your knowledge across the spectrum of Army and Joint administrative publications as necessary or required. These NCOs should know where to find military publications related to their career field and study them to become familiar with the concepts therein.
c. Strive to achieve honors (i.e. Commandant’s List, Distinguished Graduate, or Honor Graduate) at PME.
d. Participate in competitive boards such as the NCO of the Month/Quarter/Year, Sergeant Audie Murphy, Sergeant Morales, and Army Best Warrior/Squad Competitions. These boards broaden the knowledge base, instill discipline, improve the ability to communicate verbally to enhance confidence, build more adaptive leaders, and they set the example for Soldiers to follow. Staff Sergeants should host mock boards and volunteer for competitive board membership.
e. Participate in skill enhancing and volunteer events like local STEM groups and activities as well as cyber challenges and industry competitions to broaden technical knowledge base and network with participating agencies. These events are used as opportunities for team building and mentorship to subordinate Soldiers and keep technical skills sharp and relevant, plus develop positive community relationships and grow professionals both inside and outside of the service.
f. Awards and decorations serve to recognize Soldiers for their accomplishments and tend to both motivate fellow Soldiers and build the team. Staff Sergeants should write and submit award recommendations for subordinates and mentor Soldiers on achievements that warrant unit recognition.
g. Staff Sergeants should begin working toward a bachelor’s degree preferably in a STEM, Cyber Security, Electrical/Computer Engineering, Leadership, or Project Management program, or accumulate four years of college credits towards an accredited degree in any area of interest. Staff Sergeants may also consider applying for the Degree Completion Program/Cooperative Degree Program IAW AR 621-1.
h. Staff Sergeants should maintain awareness of their continuing education (CE) hours and maintenance fees associated with credentials to remain current and seek additional credentialing as listed on the COOL Website.
i. Staff Sergeants should seek generating force and broadening assignments such as Drill Sergeant, Recruiter, ALC Small Group Leader, Instructor, and Training with Industry (TWI) which will aid in distinguishing them from their peers.', 'e59d1274b6ac81c189dc63b8616079b769d535890b2eaea0bc7887b33af55c9e', 3, 4, null, 10, null, null, false, null),
  ('a726bf26-f22e-5e76-9d8a-3381c086b8b5', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'development', 'E-7', null, 'Sergeant First Class (Skill Level 4) — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development by Rank', 'a. Continue self-motivated development activities such as professional reading, technical certifications, and college courses that assist the senior NCO in developing organizational leadership skills needed to coach, teach and mentor Soldiers. SFCs place emphasis on developing writing and speaking skills. Focus on subjects such as organizational behavior, personnel management, time management, Army and Joint operations, and battle staff functions, are essential for their role.
b. As SFCs advance, they increasingly focus on doctrinal, management, and operational topics in their reading materials. SFCs proficiently understand the military publications noted in the preceding skill levels and study joint publications from the Joint Chiefs of Staff webpage, such as (CJCSI 1805.01B, CJCSI 6245.01A, CJCSI 3100.01D, and CJCSM 3150.07E), to expand their knowledge of Army and Joint cyberspace doctrinal principles.
c. Strive to achieve honors (i.e. Commandant’s List, Distinguished Graduate, or Honor Graduate) at PME.
d. Sergeants First Class should host mock boards at the section, platoon and company level and serve as a competitive board member.
e. SFCs participate in and organize events like local STEM groups, cyber challenges, and industry competitions to expand their technical knowledge and network with organizations. They also pursue volunteer opportunities to develop youth and build community trust.
f. As advanced education gains increased importance, SFCs should strive to complete a bachelor’s degree preferably in a STEM, Cyber Security, Electrical/Computer Engineering, Leadership, or Project Management program, or accumulate four years of college credits towards an accredited degree in any area of interest. SFCs may also consider applying for Degree Completion Program/Cooperative Degree Program IAW AR 621-1.
g. Broaden their focus to include functional training such as Battle Staff, Master Fitness Trainer (MFT), Master Resilience Trainer (MRT), Equal Opportunity (EO), and Sexual Harassment/Assault Response and Prevention (SHARP) representative to add value to the organization.
h. Sergeants First Class should seek generating force and broadening assignments which could help separate them from their peers. Generating force and broadening assignments include Drill Sergeant, Recruiter, SLC Small Group Leader, Instructor, Training with Industry (TWI), Human Resources Command (HRC) Enlisted Assignments NCO/ Professional Development NCO (PDNCO), Research Development Test & Evaluation (RDTE), Special Agencies, and Senior Career Manager.', 'fb5ce1bddcc6aef234fd9ffb29dc17682c8e73db10d1b6559e687efb7e01c24e', 4, 4, null, 11, null, null, false, null),
  ('8b9510df-631e-581e-8cf1-16a3656d4217', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'development', 'E-8', null, 'Master Sergeant/First Sergeant (Skill Level 5) — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development by Rank', 'a. Master Sergeants (MSG)/First Sergeants (1SG) should recognize their increasing role as a senior NCO and pursue opportunities from various sources and publications that will enhance their understanding of “How the Army Runs” in order to influence and improve the Army’s systems that contribute to the success of their organizations.
b. Master the military publications noted in the previous skill levels and expand proficiency across the spectrum of Army and Joint administrative, doctrinal, operational, and technical publications as necessary or required. Continue to build on organizational and strategic understanding with emphasis on upper-level management tasks covered in AR 220-45, AR 614-200, AR 840-10, CJCSM 3122.05, CJCSM 3130.01 and Capstone Concept for Joint Operations (CCJO): Joint Force 2020. Additional publications that provide for self-development at this level would be DoD Instruction (DODI) S-5240.23, and DODI 8500.01 which are found on the Executive Services Directorate, Directives Division webpage. These publications further expand knowledge in the planning and support of Army and Joint cyberspace doctrinal principles.
c. Strive to achieve honors (i.e. Commandant’s List, Distinguished Graduate, or Honor Graduate) at schools.
d. Master Sergeants/First Sergeants should look to organize, coordinate, and actively support competitive boards such as the Army Best Warrior/Squad Competition, industry competitions, and cyber challenges to broaden the knowledge base, instill discipline and improve the Soldier''s ability to communicate verbally to enhance confidence and build more adaptive Leaders.
e. Master Sergeants/First Sergeants should write and submit recommendations for awards for their Soldiers and mentor Soldiers on tasks that stand out to the unit for recognition.
f. As advanced education gains increased importance, Master Sergeants/First Sergeants should strive to work towards a graduate degree preferably in a STEM, Cyber Security, Leadership, or Project Management program or accumulate college credit towards an accredited degree in any area of interest. Master Sergeants/First Sergeants may also consider applying for the Degree Completion Program/Cooperative Degree Program IAW AR 621-1.
g. Broaden their focus to include functional training like Battle Staff, Joint Cyberspace Operations Planners Course (JCOPC), Army Cyber Operations Planners Course (ACOPC), and Joint Advanced Cyber Warfare Course (JACWC).
h. Master Sergeants/First Sergeants should look to be placed in generating and broadening assignments which will help them to stand out among their peers. Generating and broadening assignments include Training with Industry (TWI), HRC Enlisted Assignments NCO/ Professional Development NCO (PDNCO), Senior Career Manager, and Senior Instructor.
i. Master Sergeants/First Sergeants should keep up with their continuing education (CE) and maintenance fees associated with credentials to keep them valid and seek to complete additional credentialing as listed on the COOL Website. In addition, they should look for opportunities to research, write, peer-review, as well as seek peer-review to publish professional articles, papers, and books.', '78aaeeafde23e3e5bd0664af1a673587bea5c357b3f5d587d6ea6625056d1326', 4, 5, null, 12, null, null, false, null),
  ('e8706253-02f2-51a5-81e1-e3df1c706a93', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'development', 'E-9', null, 'Sergeant Major/Command Sergeant Major (Skill Level 6) — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development by Rank', 'a. The Sergeant Major/Command Sergeant Major (SGM/CSM) guides cyberspace, EW, and CEMA organizations and missions in support of Army and combatant command objectives. The Sergeant Major understands and master’s Joint and Army principles to integrate within the operational framework. The goal of the SGM/CSM is to continually develop organizational leadership skills needed to coach, teach, and mentor Soldiers. Outstanding communications skills are required just by the nature of the number of Soldiers their communications reach. Skills in community and public relations are also important since the SGM/CSM will often represent the command or Army in civic functions.
b. The SGM/CSM reads a wide-ranging selection of military and civilian professional publications on a regular basis, as well as current publications on world politics, economics, and current events to broaden and deepen the knowledge base required of an Army senior leader. SGM/CSM are encouraged to access the SGM/CSM talent management overview from the Sergeants Major Management Directorate on the HRC website.
c. Write articles for publication in Army and public professional journals. Seek out public speaking opportunities and community involvement. Represent the Army in civic functions to enhance leadership, build trust and hone existing skill sets.
d. Possess a bachelor’s degree and actively work towards completing a master’s degree in a chosen discipline.
e. Broaden their focus to include functional training like Keystone and Pre- Command Course.
f. SGM/CSM should look to be placed in generating and broadening assignments which will help them to stand out among their peers. Generating and broadening assignments include Operations SGM, Proponent SGM, Joint Agency SEL, Training and Education Division SGM, CSM, and Sergeants Major Course Instructor.', '53d74c69f8a97458d86d83ef53b88c166ace4974ea115d287f90fe38563477af', 5, 6, null, 13, null, null, false, null),
  ('2a6a4b2d-688a-5cd0-85be-62a3bc2acd4a', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17Z', null, 'development', null, null, 'Overview', 'Chapter 3. Recommended Career Management Self-Development by Rank', 'Army wide self-development: All Soldiers bear individual responsibility for the success of their career by ensuring timely completion of Army requirements through individual effort and active participation in institutional training, self-development, and civilian educational activities.', '7ab1f41583b2fa9a42ba3a27a6bd8f8dd35ecd3028290ec77efb45e1735f11d3', 1, 1, null, 14, null, null, false, null),
  ('da5de744-d565-5189-9794-317ae0e4bc5b', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17Z', null, 'development', 'E-1..E-4', null, 'Private-Specialist/Corporal (Skill Level 1) — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development by Rank', 'a. A Soldier''s career quality and success directly correlate with their consistent commitment to excellence, regardless of the mission. By committing to high goals, Soldiers develop leadership skills and gain practical knowledge and ambition to apply effectively. Awards and decorations recognize Soldiers for their accomplishments, motivating fellow Soldiers and building the team.
b. Soldiers should study the history of the Cyber Corps and study the following military publications: (1) FM 3-12, (2) Joint Publication (JP) 3–12, (3) ADP 3-0, (4) ADPR 3-0, (5) ADP 5-0, (6) ADPR 5-0, (7) ATP 2-91.9 (U), (8) ATP 3-12.3; all -10 level maintenance manuals associated with their equipment; Standard Operating Procedures (SOPs); tactics, techniques, and procedures (TTPs); and battle drills. Strive to achieve honors (i.e. Commandant’s List, Distinguished Graduate, or Honor Graduate) at Professional Military Education (PME).
c. Participate in competitive boards such as the Soldier of the Month, Quarter, or Year and Army Best Warrior/Squad Competitions to instill discipline and improve verbal communication skills.
d. Volunteer to participate in skill enhancing events like cyber challenges and Industry Competitions to broaden technical knowledge base.
e. Soldiers may earn promotion points for technical certifications and Army Training Information System (ATIS) training courses; a full list of certifications can be found on the Army Credentialing Opportunities On-Line (COOL) website. Soldiers can locate a listing of certifications associated with the MOS and skill level by viewing the MOS Career Maps posted on Army Career Tracker (ACT) website.
f. Pursue advanced education as a critical aspect of your self-development program. Consider an academic program related to your MOS using information from the ArmyIgnitED website or consult with an educational advisor. Begin an associate’s degree program, preferably in Science, Technology, Engineering, and Mathematics (STEM) or cybersecurity, or accumulate two years of college credit towards an accredited degree in any area of interest. These self-development options depend on your desire to excel. Participate in various correspondence courses to achieve your individual educational goals. Use the College-Level Examination Program (CLEP) and Defense Activity for Non-Traditional Education Support (DANTES) tests to convert previously acquired knowledge or training into college credit. Access the Defense Cyber Crime Center (DC3) Cyber Training Academy (DCITA) (https://www.dcita.edu/) for technical training and industry certification preparation.', '4dd8b4b397088df722ee627f7ea784de0eaab8555d0b10524caa95c66b17b9a4', 1, 2, null, 15, null, null, false, null),
  ('0a37cdc1-6120-5e9d-824b-a11ed27397df', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17Z', null, 'development', 'E-5', null, 'Sergeant (Skill Level 2) — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development by Rank', 'a. Sergeants (SGT) commit to achieving high goals to develop leadership skills and gain practical knowledge and ambition for effective application. They guide and support less experienced Soldiers in sustaining and building their technical and tactical skill sets through teaching and coaching to assist them in reaching their personal and professional potential.
b. Sergeants should focus on mastering the military publications listed at the preceding skill level and expand proficiency across the spectrum of Army doctrinal, operational, and technical publications and become familiar with where to find them. One such publication that can be helpful towards self- development for CMF17 is Smart book DA PAM 611-21 Chapters 9 thru 14 found on MilSuite at https://www.milsuite.mil/book/groups/smartbookdapam611-21.
c. Strive to achieve honors (i.e. Commandant’s List, Distinguished Graduate, or Honor Graduate) at PME schools.
d. Participate in competitive boards such as the Noncommissioned Officer (NCO) of the Month/Quarter/Year, Sergeant Audie Murphy, Sergeant Morales, and Army Best Warrior/Squad Competitions. These boards broaden the knowledge base, instill discipline and improve the Soldier’s ability to communicate verbally to enhance confidence and build more adaptive Leaders.
e. Volunteer to participate in skill enhancing events like cyber challenges and industry competitions to broaden technical knowledge base and mentor participating subordinate Soldiers.
f. Sergeants may earn promotion points for technical certifications and ATIS training courses; a full list of certifications can be found on the COOL website. Soldiers can locate a listing of certifications associated with the MOS and skill level by viewing the MOS Career Maps posted on the ACT website.
g. Sergeants should work towards an associate’s degree program preferably in a STEM, Cyber Security, Electrical/Computer Engineering, or Leadership program, or accumulate two years of college credit towards an accredited college degree in any area of interest.
h. Broaden their focus to include functional training such as the Airborne Course, Air Assault Course, Ranger School, and Culture and Language Training.', '2a6720f26f575c387a4881b437a8a4ddefb5a747b3f54bd2a892aeb989f821ae', 2, 3, null, 16, null, null, false, null),
  ('33536750-4a1d-5a1f-89c8-c56e2bf99196', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17Z', null, 'development', 'E-6', null, 'Staff Sergeant (Skill Level 3) — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development by Rank', 'a. Staff Sergeants (SSG) become highly sought-after leaders who develop and guide Soldiers through active counseling, coaching and mentoring. Seize every opportunity to build skills and confidence in your team, fostering growth not just in formal sessions. Cultivate competent and confident NCOs through progressive, sequential education, training, and experience. Oversee the development of team training while empowering Soldiers and enhancing their own technical and tactical skill sets.
b. Proficiently understand the military publications noted in the preceding skill levels and expand your knowledge across the spectrum of Army and Joint administrative publications as necessary or required. These NCOs should know where to find military publications related to their career field and study them to become familiar with the concepts therein.
c. Strive to achieve honors (i.e. Commandant’s List, Distinguished Graduate, or Honor Graduate) at PME.
d. Participate in competitive boards such as the NCO of the Month/Quarter/Year, Sergeant Audie Murphy, Sergeant Morales, and Army Best Warrior/Squad Competitions. These boards broaden the knowledge base, instill discipline, improve the ability to communicate verbally to enhance confidence, build more adaptive leaders, and they set the example for Soldiers to follow. Staff Sergeants should host mock boards and volunteer for competitive board membership.
e. Participate in skill enhancing and volunteer events like local STEM groups and activities as well as cyber challenges and industry competitions to broaden technical knowledge base and network with participating agencies. These events are used as opportunities for team building and mentorship to subordinate Soldiers and keep technical skills sharp and relevant, plus develop positive community relationships and grow professionals both inside and outside of the service.
f. Awards and decorations serve to recognize Soldiers for their accomplishments and tend to both motivate fellow Soldiers and build the team. Staff Sergeants should write and submit award recommendations for subordinates and mentor Soldiers on achievements that warrant unit recognition.
g. Staff Sergeants should begin working toward a bachelor’s degree preferably in a STEM, Cyber Security, Electrical/Computer Engineering, Leadership, or Project Management program, or accumulate four years of college credits towards an accredited degree in any area of interest. Staff Sergeants may also consider applying for the Degree Completion Program/Cooperative Degree Program IAW AR 621-1.
h. Staff Sergeants should maintain awareness of their continuing education (CE) hours and maintenance fees associated with credentials to remain current and seek additional credentialing as listed on the COOL Website.
i. Staff Sergeants should seek generating force and broadening assignments such as Drill Sergeant, Recruiter, ALC Small Group Leader, Instructor, and Training with Industry (TWI) which will aid in distinguishing them from their peers.', 'e59d1274b6ac81c189dc63b8616079b769d535890b2eaea0bc7887b33af55c9e', 3, 4, null, 17, null, null, false, null),
  ('c08242fd-baf3-5d6e-9b7a-ca6a3c462c39', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17Z', null, 'development', 'E-7', null, 'Sergeant First Class (Skill Level 4) — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development by Rank', 'a. Continue self-motivated development activities such as professional reading, technical certifications, and college courses that assist the senior NCO in developing organizational leadership skills needed to coach, teach and mentor Soldiers. SFCs place emphasis on developing writing and speaking skills. Focus on subjects such as organizational behavior, personnel management, time management, Army and Joint operations, and battle staff functions, are essential for their role.
b. As SFCs advance, they increasingly focus on doctrinal, management, and operational topics in their reading materials. SFCs proficiently understand the military publications noted in the preceding skill levels and study joint publications from the Joint Chiefs of Staff webpage, such as (CJCSI 1805.01B, CJCSI 6245.01A, CJCSI 3100.01D, and CJCSM 3150.07E), to expand their knowledge of Army and Joint cyberspace doctrinal principles.
c. Strive to achieve honors (i.e. Commandant’s List, Distinguished Graduate, or Honor Graduate) at PME.
d. Sergeants First Class should host mock boards at the section, platoon and company level and serve as a competitive board member.
e. SFCs participate in and organize events like local STEM groups, cyber challenges, and industry competitions to expand their technical knowledge and network with organizations. They also pursue volunteer opportunities to develop youth and build community trust.
f. As advanced education gains increased importance, SFCs should strive to complete a bachelor’s degree preferably in a STEM, Cyber Security, Electrical/Computer Engineering, Leadership, or Project Management program, or accumulate four years of college credits towards an accredited degree in any area of interest. SFCs may also consider applying for Degree Completion Program/Cooperative Degree Program IAW AR 621-1.
g. Broaden their focus to include functional training such as Battle Staff, Master Fitness Trainer (MFT), Master Resilience Trainer (MRT), Equal Opportunity (EO), and Sexual Harassment/Assault Response and Prevention (SHARP) representative to add value to the organization.
h. Sergeants First Class should seek generating force and broadening assignments which could help separate them from their peers. Generating force and broadening assignments include Drill Sergeant, Recruiter, SLC Small Group Leader, Instructor, Training with Industry (TWI), Human Resources Command (HRC) Enlisted Assignments NCO/ Professional Development NCO (PDNCO), Research Development Test & Evaluation (RDTE), Special Agencies, and Senior Career Manager.', 'fb5ce1bddcc6aef234fd9ffb29dc17682c8e73db10d1b6559e687efb7e01c24e', 4, 4, null, 18, null, null, false, null),
  ('e6ae7f9a-3d2d-544a-8a95-2dbc4d5ed965', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17Z', null, 'development', 'E-8', null, 'Master Sergeant/First Sergeant (Skill Level 5) — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development by Rank', 'a. Master Sergeants (MSG)/First Sergeants (1SG) should recognize their increasing role as a senior NCO and pursue opportunities from various sources and publications that will enhance their understanding of “How the Army Runs” in order to influence and improve the Army’s systems that contribute to the success of their organizations.
b. Master the military publications noted in the previous skill levels and expand proficiency across the spectrum of Army and Joint administrative, doctrinal, operational, and technical publications as necessary or required. Continue to build on organizational and strategic understanding with emphasis on upper-level management tasks covered in AR 220-45, AR 614-200, AR 840-10, CJCSM 3122.05, CJCSM 3130.01 and Capstone Concept for Joint Operations (CCJO): Joint Force 2020. Additional publications that provide for self-development at this level would be DoD Instruction (DODI) S-5240.23, and DODI 8500.01 which are found on the Executive Services Directorate, Directives Division webpage. These publications further expand knowledge in the planning and support of Army and Joint cyberspace doctrinal principles.
c. Strive to achieve honors (i.e. Commandant’s List, Distinguished Graduate, or Honor Graduate) at schools.
d. Master Sergeants/First Sergeants should look to organize, coordinate, and actively support competitive boards such as the Army Best Warrior/Squad Competition, industry competitions, and cyber challenges to broaden the knowledge base, instill discipline and improve the Soldier''s ability to communicate verbally to enhance confidence and build more adaptive Leaders.
e. Master Sergeants/First Sergeants should write and submit recommendations for awards for their Soldiers and mentor Soldiers on tasks that stand out to the unit for recognition.
f. As advanced education gains increased importance, Master Sergeants/First Sergeants should strive to work towards a graduate degree preferably in a STEM, Cyber Security, Leadership, or Project Management program or accumulate college credit towards an accredited degree in any area of interest. Master Sergeants/First Sergeants may also consider applying for the Degree Completion Program/Cooperative Degree Program IAW AR 621-1.
g. Broaden their focus to include functional training like Battle Staff, Joint Cyberspace Operations Planners Course (JCOPC), Army Cyber Operations Planners Course (ACOPC), and Joint Advanced Cyber Warfare Course (JACWC).
h. Master Sergeants/First Sergeants should look to be placed in generating and broadening assignments which will help them to stand out among their peers. Generating and broadening assignments include Training with Industry (TWI), HRC Enlisted Assignments NCO/ Professional Development NCO (PDNCO), Senior Career Manager, and Senior Instructor.
i. Master Sergeants/First Sergeants should keep up with their continuing education (CE) and maintenance fees associated with credentials to keep them valid and seek to complete additional credentialing as listed on the COOL Website. In addition, they should look for opportunities to research, write, peer-review, as well as seek peer-review to publish professional articles, papers, and books.', '78aaeeafde23e3e5bd0664af1a673587bea5c357b3f5d587d6ea6625056d1326', 4, 5, null, 19, null, null, false, null),
  ('3b142059-6c25-56d1-a012-4985fa3f3b7f', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17Z', null, 'development', 'E-9', null, 'Sergeant Major/Command Sergeant Major (Skill Level 6) — recommended career management (applies to every MOS in this career management field)', 'Chapter 3. Recommended Career Management Self-Development by Rank', 'a. The Sergeant Major/Command Sergeant Major (SGM/CSM) guides cyberspace, EW, and CEMA organizations and missions in support of Army and combatant command objectives. The Sergeant Major understands and master’s Joint and Army principles to integrate within the operational framework. The goal of the SGM/CSM is to continually develop organizational leadership skills needed to coach, teach, and mentor Soldiers. Outstanding communications skills are required just by the nature of the number of Soldiers their communications reach. Skills in community and public relations are also important since the SGM/CSM will often represent the command or Army in civic functions.
b. The SGM/CSM reads a wide-ranging selection of military and civilian professional publications on a regular basis, as well as current publications on world politics, economics, and current events to broaden and deepen the knowledge base required of an Army senior leader. SGM/CSM are encouraged to access the SGM/CSM talent management overview from the Sergeants Major Management Directorate on the HRC website.
c. Write articles for publication in Army and public professional journals. Seek out public speaking opportunities and community involvement. Represent the Army in civic functions to enhance leadership, build trust and hone existing skill sets.
d. Possess a bachelor’s degree and actively work towards completing a master’s degree in a chosen discipline.
e. Broaden their focus to include functional training like Keystone and Pre- Command Course.
f. SGM/CSM should look to be placed in generating and broadening assignments which will help them to stand out among their peers. Generating and broadening assignments include Operations SGM, Proponent SGM, Joint Agency SEL, Training and Education Division SGM, CSM, and Sergeants Major Course Instructor.', '53d74c69f8a97458d86d83ef53b88c166ace4974ea115d287f90fe38563477af', 5, 6, null, 20, null, null, false, null),
  ('33379015-0581-543d-b235-fedd044011b2', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'development', null, null, 'Goals for development', 'Chapter 4. MOS 17C Cyber Operations Specialist', 'Soldiers serve in varying assignments from the strategic to operational level. Due to the inherent technical specificity of MOS 17C, documented leadership positions common to other CMFs, such as team leader, squad leader, platoon sergeant, are less common. Therefore, NCOs in this CMF must strive to seek additional broadening and leadership opportunities.', '4010ac031044e57535b882a6397e617ec5ed2dfee4908877c7656101029a611b', 6, 7, null, 21, null, null, false, null),
  ('447fcbec-c11a-5786-8946-b25914b83125', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'development', 'E-1..E-4', null, 'Private-Specialist/Corporal — overview', 'Chapter 4. MOS 17C Cyber Operations Specialist', 'Cyber Operations Specialist (Skill Level 1)', '65ccc7387ba2e9a6e65895c2e510136e4b293ab39eb58a9e0a408d948a4b76af', 7, 7, null, 22, null, null, false, null),
  ('9aa82bc0-3bac-53b7-8c85-089f454548d5', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'skills', 'E-1..E-4', null, 'Private-Specialist/Corporal — Skills', 'Chapter 4. MOS 17C Cyber Operations Specialist', 'Perform cyber effects; cyber operational preparation of the environment; and cyber intelligence, surveillance, and reconnaissance actions on specified systems and networks. Conduct network terrain audits, penetration testing, basic digital forensics data analysis, and software threat analysis. React to cyberspace events, employ cyberspace defense infrastructure capabilities, collect basic digital forensics data, provide incident response impact assessments, and produce network security posture assessments. Analyze computer system and network architectures as well as determine and implement exploitation methods.', '5dc4d3ac5cc78c20d33d3d786a42f8dab6bd28582daef9c17cd2300371446861', 7, 7, null, 23, null, null, false, null),
  ('1907dfa1-8fa8-5ebf-ab78-cb1644ce49d5', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'assignments', 'E-1..E-4', null, 'Private-Specialist/Corporal — Operational assignments', 'Chapter 4. MOS 17C Cyber Operations Specialist', 'Primary assignments focus on the basic technical and tactical cyberspace operations focused on analysis, development, and operational work roles in support of Army and Joint requirements.', '160e984ac6927ea7c9118bde1d5d53c283b54202338979ac90ae11c58ca1abb4', 7, 7, null, 24, null, null, false, null),
  ('31ffb6db-a215-5bd9-ad41-d33f70487bc7', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'assignments', 'E-1..E-4', null, 'Private-Specialist/Corporal — Critical Developmental Assignments', 'Chapter 4. MOS 17C Cyber Operations Specialist', 'N/A', 'e2f79e5b60330bba4c289962231b6ba2957d0b14e7deb3110417003c79dea635', 7, 7, null, 25, null, null, false, null),
  ('93447a76-ca4c-51eb-8dc3-c4b97bf26f31', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'training', 'E-1..E-4', null, 'Private-Specialist/Corporal — Military Training/Education by Domain', 'Chapter 4. MOS 17C Cyber Operations Specialist', 'Courses listed here are opportunities to add depth and breadth to the knowledge and skills of the SL1 Soldier. Seeking additional training and education beyond what is listed here is highly recommended and will differentiate Soldiers from their peers. It is recommended that Soldiers refer to the Army COOL website, and the Army Career Tracker website, at a minimum, for developmental opportunities.
a. Institutional:
(1) Ranger School
(2) Airborne School
(3) Air Assault School
(4) Unit level support courses (Armor, Tactical Combat Casualty Care (TC3), Ammo Handler)
b. Operational:
(1) Basic Cyber Work Role (WR) Job Qualification Record / Joint Qualification Standards (JQR/JQS).
(2) Army Training Network (ATN) - Training and evaluation outlines for individual/collective/common tasks
c. Self-development: There are three functions which focus on different aspects of the cyber mission. As a guide to self-development in each one of these functions the following outlines a description of tasks to master at this level:
(1) Analyst: Work to develop a basic understanding of how to use information collected from a variety of resources when assessing systems, networks, hardware, software, applications, and personas to identify, analyze, and consider effects in support of commander’s requirements. Conduct overall vulnerability analysis, provide risk mitigation support, understand, detect, and emulate adversary tactics, techniques, and procedures (TTPs).
(2) Developer: Work towards having a basic understanding of how to support the development of platforms and capabilities, create draft requirement documents, work on enhancing scripting and coding language skills, understand how large coding projects work, etc.
(3) Operator: Develop a basic understanding of how to gain access to or defend against physical or logical access to network components. Understand, detect, and emulate adversary network infrastructure TTPs.
(4) Competition Boards:
(a) Best Squad Competition
(b) Soldier of the Month competition boards
(c) Soldier of the Quarter competition boards
(d) Soldier of the Year competition boards', 'e9645e01cb3a97d14373a448d0a0d7ca8e25238d0226306e28ac3513229f9f95', 7, 8, null, 26, null, null, false, null),
  ('c169ffcc-4ef1-5c37-9788-d1640b7b53f3', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'development', 'E-5', null, 'Sergeant — overview', 'Chapter 4. MOS 17C Cyber Operations Specialist', 'Cyber Operations Sergeant (Skill Level 2).', 'c1ad9df667bcbc851f84f5e4f1547bb6a91b737993dbcc5312bba5dd51d29357', 8, 8, null, 27, null, null, false, null),
  ('8383e5fc-fa91-55b3-89f4-212dbb524ac2', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'skills', 'E-5', null, 'Sergeant — Skill', 'Chapter 4. MOS 17C Cyber Operations Specialist', 'Perform duties in preceding skill level and provide guidance to subordinate Soldiers. Lead Soldiers in performing activities in support of offensive and defensive cyberspace operations. Validate critical infrastructure configurations, network alerts, and network security posture assessments. Review, write, edit, evaluate, and publish both offensive and defensive cyberspace operations products and reports.', '2541b8f79139d88b3231cae2a81646d22f6c391a3155adc2f388d2c5ea4902a3', 8, 8, null, 28, null, null, false, null),
  ('b2835686-db45-5c69-b679-3abe08e7433c', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'assignments', 'E-5', null, 'Sergeant — Operational assignments', 'Chapter 4. MOS 17C Cyber Operations Specialist', 'a. Cyber Operations SGT (Offensive/Defensive/Expeditionary Cyber Team)
b. Multi Domain Task Force (MDTF)
c. Special Mission Unit (SMU) (SOF/Ranger Regiment/Great Skills)', '8870a7808a469ce8f9f0379f4beb462b33a326669c8c5bc409089517faa937b1', 8, 8, null, 29, null, null, false, null),
  ('d448b163-f993-5477-8324-f0568d5d00ac', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'assignments', 'E-5', null, 'Sergeant — Critical Developmental Assignments', 'Chapter 4. MOS 17C Cyber Operations Specialist', 'a. Cyber WR (Basic Proficiency)
b. Cyber Operations NCO', '65dad364087bd7867ef38391bec413d8320f11b84db43ba5ac21645236ec3d5f', 8, 8, null, 30, null, null, false, null),
  ('b121ac9a-6335-5524-9170-56b2be89dbf5', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'assignments', 'E-5', null, 'Sergeant — Broadening Assignments', 'Chapter 4. MOS 17C Cyber Operations Specialist', 'a. Instructor/Writer
b. Drill Sergeant', '2aff92e72bd7f2936b31703d2e6d1d64587e6d4e032ffb35e58f58d143ccb350', 8, 8, null, 31, null, null, false, null),
  ('499e868b-9130-5b5f-adc2-456dc1c66168', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'training', 'E-5', null, 'Sergeant — Military Training/Education by Domain', 'Chapter 4. MOS 17C Cyber Operations Specialist', 'Courses listed here are opportunities to add depth and breadth to the knowledge and skills of the SL2 Soldier. Seeking additional training and education beyond what is listed here is highly recommended and will serve to differentiate Soldiers from their peers. It is recommended that Soldiers refer to the COOL website, and the ACT website, at a minimum, for developmental opportunities.
a. Institutional training:
(1) Critical Thinking and Structured Analysis (CTSA)
(2) Ranger School
(3) Airborne School
(4) Air Assault School
(5) Senior Enlisted Joint Professional Military Education (SEJPME) I
(6) Unit level support courses (UPL, Armor, Master Fitness Trainer, ASIST)
(7) Basic Operator Course (BOC)
(8) Common Faculty Development – Instructor Course (CFD-IC)
b. Operational training:
(1) Basic or Senior proficiency level Cyber WR JQR/JQS
(2) Tradecraft training
(3) Gunnery I-IV
(4) Scripting (Python, Bash, and PowerShell)
(5) Noncommissioned Officer Professional Development (NCOPD)
(6) Training and evaluation outlines for individual/collective/common tasks
c. Self-Development: Each of the three functions focuses on different aspects of the cyber mission. As a guide to self-development in each one of these functions the following outlines a description of tasks to master at this level:
(1) Analyst: Knowledge of using analytical skills to assist in defending networks, using established analytic tradecraft to perform network mapping, basic protocol analysis, characterizing network usage, and show proficiency to conduct all-source research and analysis to develop intelligence and targeting products.
(2) Developer: Focus extracurricular courses on data analytics, computer system programming, software engineering and design, software assurance. Participate in certified scrum master requirements engineering for software systems workshops/courses.
(3) Operator: The Basic Operator conducts cyberspace operations by employing tools, techniques, and procedures to generate effects. They also have the inherent responsibility of protecting tools and infrastructure throughout all phases of their operations.
(4) Competition Boards:
(a) Best Squad Competition
(b) NCO of the Month/Quarter/Year boards', '21ab2a60b5ed5c627ef9dc37b71e46845eb5ed1c77cc52c3fb03edef775316fb', 8, 9, null, 32, null, null, false, null),
  ('aefea80d-2dd5-5acf-936c-6662d0f0bae6', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'development', 'E-6', null, 'Staff Sergeant — overview', 'Chapter 4. MOS 17C Cyber Operations Specialist', 'Cyber Operations Sergeant (Skill Level 3).', 'b1c6aa5dbdc48379cf14aa574d1f077a4d19bfed602a14d5264101e1d7ab540f', 9, 9, null, 33, null, null, false, null),
  ('c68e26f5-299b-5741-bc85-d8e4d55e5329', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'skills', 'E-6', null, 'Staff Sergeant — Skill', 'Chapter 4. MOS 17C Cyber Operations Specialist', 'Perform duties shown in preceding skill levels and provide guidance to subordinate Soldiers. Lead operational teams in support of offensive and defensive cyberspace operations. Conduct cyberspace operations risk assessments, post-incident analysis, and intermediate software analysis. Collect and analyze intermediate forensics data. Validate architectural analysis, administer penetration testing, and coordinate response actions. Staff sergeants are expected to aggressively seek Critical Developmental positions, serving in operations for at least 24 months, prior to a broadening assignment. SSGs who served successfully in Critical Developmental positions are expected to take the opportunity in seeking a Broadening Assignment when possible. SSGs who successfully serve two years in a Critical Developmental position or those currently serving in a broadening assignment are considered competitive for promotion.', '39ad491dc710e7734bbc4367817cf5b8af5336915cd411e14c3661d005422690', 9, 9, null, 34, null, null, false, null),
  ('61e6673f-4d37-5d7c-8051-316c46678e89', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'assignments', 'E-6', null, 'Staff Sergeant — Operational assignments', 'Chapter 4. MOS 17C Cyber Operations Specialist', 'a. Cyber Operations NCO (Offensive/Defensive/Expeditionary Cyber Team)
b. MDTF
c. SMU (SOF/Ranger Regiment/Great Skills)', '722d0ca5473cef52fe9aeb1b77e775aa49ea32c0b35321756be22a7ba8b27085', 9, 9, null, 35, null, null, false, null),
  ('faab490a-56a2-5503-818f-7539a0b9a662', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'assignments', 'E-6', null, 'Staff Sergeant — Critical Developmental Assignments', 'Chapter 4. MOS 17C Cyber Operations Specialist', 'a. Cyber WR (Senior proficiency)
b. Cyber Operations Supervisor
c. SF Cyber Ops Specialist
d. Platoon Sergeant', '53fc557734e084c7851620f5a4e0e0e6a3e9b8557fb299d0e45b5a98ab7f6f1d', 9, 9, null, 36, null, null, false, null),
  ('9497dc3a-efa3-5102-9d8e-7490802275ac', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'assignments', 'E-6', null, 'Staff Sergeant — Broadening Assignments', 'Chapter 4. MOS 17C Cyber Operations Specialist', 'a. Drill Sergeant
b. Instructor/Writer
c. Training with Industry (TWI)
d. Joint Interagency Intergovernmental and Multinational (JIIM)
e. Noncommissioned officer academy (NCOA) Small Group Leader (SGL)', 'de75c66d0231d65e1f8fa9624f34dfb9a646f5c07ded1d509db1c2bbeb4704e8', 9, 9, null, 37, null, null, false, null),
  ('db76302b-3f31-59f0-bd52-8c60c56e1c57', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'training', 'E-6', null, 'Staff Sergeant — Military Training/Education by Domain', 'Chapter 4. MOS 17C Cyber Operations Specialist', 'Courses listed here are opportunities to add depth and breadth to the knowledge and skills of the SL3 Soldier. Seeking additional training and education beyond what is listed here is highly recommended and will differentiate Soldiers from their peers. It is recommended that Soldiers refer to the COOL website, and the ACT website, at a minimum, for developmental opportunities.
a. Institutional training:
(1) Joint Advanced Cyber Warfare Course (JACWC)
(2) Joint Network Analysis Course (JNAC)
(3) Operator Training (Title 10 / Title 50)
(4) Equal Opportunity Leader Course (EOLC)
(5) Master Resiliency Trainer (MRT)
(6) Master Fitness Trainer (MFT)
(7) Applied Suicide Intervention Training (ASIST) Trainer
(8) SHARP
(9) Ranger School
(10) Airborne School
(11) Air Assault School
(12) Battle Staff Course
(13) SEJPME II
(14) Joint Fire Power
(15) Common Faculty Development – Instructor Course (CFD-IC)
b. Operational Training:
(1) Senior proficiency Cyber WR JQR/JQS
(2) Analytical Writing Essentials (AWE)
(3) Red Hat OpenStack Administrator
(4) Adjunct Faculty
(5) Scripting (Python, Bash, and PowerShell)
(6) Securing Linux
(7) Tradecraft Training
(8) Exploits
(9) Incident handling
(10) NCOPD
(11) Sergeants Time Training
c. Self-development: Participate in at least one work role working group (WRWG), assessor tasking, or technical health working group (THWG). Focus on self- development in one of the functions at this level:
(1) Analyst: Demonstrate the ability to conduct low to moderate level malware analysis. Principle tasks: conduct database queries, understand advanced protocol analysis, programming fundamentals, and produce reports. Assist Operational Planners with developing overarching strategies and advise on courses of action for creating effects that meet operational requirements.
(2) Developer: Pursue a degree from an accredited institution in Computer Science, Electrical Engineering, or a related field. Replicate or expand upon work demonstrated in security-focused venues such as Defcon. Find and document vulnerabilities described in Common Vulnerabilities and Exposures (CVE) based on existing descriptions. Host or develop training in your area of specialization.
(3) Operator: The senior operator is tasked with training and testing of personnel and capabilities. They are also responsible for mitigating risk while leveraging tools, techniques, and procedures to secure new accesses in support of military operations beyond that of the basic level. The senior cyber operator will lead tactically oriented cyber support teams and aid in the integration of cyberspace support capabilities in the supported unit’s military decision-making process (MDMP).
(4) Planner: Basic Planners demonstrate operational understanding. They can interface with tactical elements to translate tactical and strategic objectives into actionable products.
(5) Competition boards:
(a) Best Squad Competition
(b) NCO of the Month/Quarter/Year boards
(c) Drill Sergeant of the Year
(d) Instructor of the Quarter/Year', 'a51abfa42351b8f93845e9813f6ca786c5559a710b1a20a5ebd91a820c9306df', 9, 11, null, 38, null, null, false, null),
  ('a8a69e55-129f-50ca-a555-a4f52c57cf2e', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'development', 'E-7', null, 'Sergeant First Class — overview', 'Chapter 4. MOS 17C Cyber Operations Specialist', 'Cyber Operations Supervisor (Skill Level 4).', '34bf45fc1091f38d5664009d310c4e73699869002e9e1a91d4f9896126ee41f4', 11, 11, null, 39, null, null, false, null),
  ('ac3f525c-ee02-5842-877b-7ac97603aba4', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'skills', 'E-7', null, 'Sergeant First Class — Skill', 'Chapter 4. MOS 17C Cyber Operations Specialist', 'Perform duties shown in preceding skill levels and provide guidance to subordinate Soldiers. Supervise operational teams in support of offensive and defensive cyberspace operations. Direct network terrain audits, digital forensics processes, and exploitation missions. Evaluate cyber defense requirements and participate in the joint targeting process.', 'da755e914cb5f9983f66e3c0317b184a8ca1b457b63fc690c442ed13f66854e4', 11, 11, null, 40, null, null, false, null),
  ('e6120f14-c88f-54b3-a0f9-f8a15356028f', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'assignments', 'E-7', null, 'Sergeant First Class — Operational assignments', 'Chapter 4. MOS 17C Cyber Operations Specialist', 'a. Cyber Operations Supervisor (Offensive/Defensive/Expeditionary Cyber Team)
b. MDTF
c. SMU (SOF/Ranger Regiment/Great Skills)', '20da52c11b33b54f11f7348c5021b9af0f54f97c1716924b4d7db3ff95519a4a', 11, 11, null, 41, null, null, false, null),
  ('f697b594-4567-531d-a319-cd0e38147fd8', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'assignments', 'E-7', null, 'Sergeant First Class — Critical Developmental Assignments', 'Chapter 4. MOS 17C Cyber Operations Specialist', 'a. Cyber WR (Senior proficiency)
b. Cyber Operations Chief
c. Team NCOIC
d. CEMA or Cyber Planner
e. Detachment Sergeant', 'aa4e9937572479ac1b206680acb3bae178ffa602117125b453ddf88653701240', 11, 11, null, 42, null, null, false, null),
  ('3aabb557-a531-5d78-bef8-03c3fa8ed746', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'assignments', 'E-7', null, 'Sergeant First Class — Broadening Assignments', 'Chapter 4. MOS 17C Cyber Operations Specialist', 'f. Drill Sergeant
g. Senior Drill Sergeant
h. Instructor/Writer
i. Training with Industry (TWI)
j. Cyber Operations-Integrated Planning Elements (CO-IPE)
k. Joint Interagency Intergovernmental and Multinational (JIIM)
l. Senior Writer Developer
m. Noncommissioned officer academy (NCOA) Small Group Leader (SGL)
n. Professional Development NCO (HRC)', 'b76d0513f074e50dd0a2f03b23d0a1bfddb62c1eb53a4e22f2abf0faf11d9e1c', 11, 11, null, 43, null, null, false, null),
  ('646318c5-8ff8-5586-9332-f4e2221f7175', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'training', 'E-7', null, 'Sergeant First Class — Military Training/Education by Domain', 'Chapter 4. MOS 17C Cyber Operations Specialist', 'Courses listed here are opportunities that can be pursued to add depth and breadth to the knowledge and skills of the SL4 Soldier. Seeking additional training and education beyond what is listed here is highly recommended and will differentiate Soldiers from their peers. It is recommended that Soldiers refer to the COOL and ACT websites at a minimum for developmental opportunities.
a. Institutional training:
(1) Joint Advanced Cyber Warfare Course (JACWC)
(2) Joint Network Analysis Course (JNAC)
(3) Operator Training (Title 10 / Title 50)
(4) Common Faculty Development – Instructor Course (CFD-IC)
(5) Common Faculty Development – Developer Course (CFD-DC)
(6) Equal Opportunity Leader Course EOL(EOLC) / Equal Opportunity Advisor
(7) Master Resiliency Trainer (MRT)
(8) Applied Suicide Intervention Training (ASIST) Trainer
(9) Sexual Harassment/Assault Response and Prevention (SHARP) (Sexual Assault Response Coordinator-SARC/Victim Advocate-VA)
(10) Ranger School
(11) Airborne School
(12) Air Assault School
(13) Battle Staff Course
(14) SEJPME II
(15) Joint Electronic Warfare Theater Operations Course (JEWTOC)
(16) Joint Electromagnetic Warfare Theater Operations Course (JEMSOTOC)
(17) Joint Cyber Operational Planners Course (JCOPC)
(18) Army Cyber Operational Planners Course (ACOPC)
(19) Joint Targeting Staff Course
(20) Joint Intermediate Target Development
(21) Special Technical Operations (STO) Planner Course
(22) Army Basic Space Cadre Course
(23) Joint Battle Damage Assessment Course
(24) Joint Operations Fires and Effects Course
(25) Cyber Effects Application Course
b. Operational Training:
(1) Senior or Master Cyber WR JQR/JQS
(2) Analytical writing essentials (AWE)
(3) Red Hat OpenStack Administrator
(4) Adjunct Faculty
(5) NCOPD
(6) Sergeant’s Time Training
c. Self-development: Participate in at least one work role working group (WRWG), assessor tasking, or technical health working group (THWG). Focus on self- development in one of the functions at this level:
(1) Analyst: Demonstrates the ability to provide strategic guidance on emerging threats across different mission sets. Sergeants First Class demonstrate their capability in advanced queries, validate draft network signatures, quality control of implemented network signatures for efficiency, multiple programming languages, and conduct moderate to high level malware analysis. Identifies access and collection gaps across multiple infrastructures at various echelons and recommends or develops analytical and initial access strategies for the successful execution of offensive and defensive cyberspace operations.
(2) Developer: Master level developers should be able to network hub within the larger cyber organization, connecting mission needs to appropriate capability generating solutions both within and outside their organization.
(3) Operator: The master operator will oversee cyberspace operations and advise the cyber planner on team and unit requirements. Master level operators will develop training requirements and operational tactics, techniques, and procedures. A master level operator will also be required to invest knowledge and time into building and sustaining the work role through mentoring junior operators, conducting formal training, and advising the command on capabilities and limitations. The master operator is trained in multiple operational disciplines. They are expected to bring significant expertise, problem solving, and mentorship to bear on highly challenging problem sets and interface with personnel across various domains and echelons.
(4) Planner: Senior planners perform the same functions as Basic Planners, but also demonstrate higher levels of operational understanding. They are not only able to interface with tactical elements, but also with higher echelons of command to translate tactical and strategic objectives into long term National strategies.
(5) Competition Boards:
(a) NCO of the Month/Quarter/Year boards
(b) Drill Sergeant of the Year
(c) Instructor of the Quarter/Year', '8d3e6802c9f296eabb264385c42c35bc07afd670d78e3b5682b04a50cf352441', 11, 13, null, 44, null, null, false, null),
  ('a412e30b-d080-5cb5-b98e-a4468bc6516e', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'development', 'E-8', null, 'Master Sergeant — overview', 'Chapter 4. MOS 17C Cyber Operations Specialist', 'Cyber Operations Chief (Skill Level 5).', '2ae1181b28ec319a6079e02167ed0b4ec5d1ed96e56f9ff55e36f12d5c926ec1', 13, 13, null, 45, null, null, false, null),
  ('f854ee3d-0a84-5c72-89c9-ae4bf267e0ff', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'skills', 'E-8', null, 'Master Sergeant — Skill', 'Chapter 4. MOS 17C Cyber Operations Specialist', 'Perform duties shown in preceding skill levels and provide guidance to subordinate Soldiers. Perform mission management functions for cyberspace operations. Develop crisis plans to directly support cyberspace operations planning and targeting. Serve as subject matter experts (SME) of the technical integration of cyberspace attack; defense; intelligence, surveillance, and reconnaissance; operation preparation of the environment in support of multidomain operations. Master Sergeants are also assigned as First Sergeants and operations sergeants at the battalion or higher staff level. These assignments rely heavily on leadership experience and technical expertise to synchronize effects within the Joint operational and targeting planning process and operational framework.', '7e943fdaa1542c2ee40b9f2f436609b688954ea10beeb252295da28b88a73c0e', 13, 13, null, 46, null, null, false, null),
  ('ea261e32-a024-55ad-ba3b-041877249cd5', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'assignments', 'E-8', null, 'Master Sergeant — Operational Assignments', 'Chapter 4. MOS 17C Cyber Operations Specialist', 'a. Cyber Operations Chief
b. Cyber WR (Master proficiency)
c. SMU (SOF/Great Skills)', '12d11f24144e9ea0399ea6b2ef1114883a96a7894e13c5fc0ff0e9d84bbdb0f6', 13, 13, null, 47, null, null, false, null),
  ('c664e80d-ef33-5c35-b843-a93caaf8ef95', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'assignments', 'E-8', null, 'Master Sergeant — Critical Developmental Assignments', 'Chapter 4. MOS 17C Cyber Operations Specialist', 'a. Senior Enlisted Leader
b. Senior Cyber Ops Chief
c. First Sergeant
d. G/J Staff NCOIC
e. Operations Sergeant / NCOIC', 'f315b781e252ea3bbace09b8ac74d53c3e877b5ffd760e284ee2d22ac6229126', 13, 13, null, 48, null, null, false, null),
  ('8e1671ee-be3f-572b-bbd3-ddcf9ab73b40', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'assignments', 'E-8', null, 'Master Sergeant — Broadening Assignments', 'Chapter 4. MOS 17C Cyber Operations Specialist', 'a. Senior Instructor
b. Training Developer/Writer
c. Capabilities Development NCO
d. Senior Career Management NCO
e. Cyber Operations-Integrated Planning Elements (CO-IPE)
f. Special Mission Unit (SMU)
g. Special Operations Forces (SOF)
h. Joint Interagency Intergovernmental and Multinational (JIIM)
i. Army Cyber Institute (ACI)
j. Cyber Advisor for Secretary of the Army', '3af0348839a81b0341e33524b65a35fcd7c5f66ab3dd42ea37fdfd340df9e899', 13, 13, null, 49, null, null, false, null),
  ('af78168a-93a9-5b28-9938-a0ff2a18d445', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17C', null, 'training', 'E-8', null, 'Master Sergeant — Military Training/Education by Domain', 'Chapter 4. MOS 17C Cyber Operations Specialist', 'Courses listed here are opportunities to add depth and breadth to the knowledge and skills of the SL5 Soldier. Seeking additional training and education beyond what is listed here is highly recommended and will differentiate Soldiers from their peers. It is recommended that Soldiers refer to the COOL and ACT websites, at a minimum, for developmental opportunities.
a. Institutional training:
(1) Ranger School
(2) Airborne School
(3) Air Assault School
(4) Common Faculty Development – Developer Course (CFD-DC)
(5) Special Technical Operations (STO) Planners Course
(6) Joint Targeting Staff Course
(7) SEJPME II
b. Operational Training:
(1) Master Cyber WR JQR/JQS
(2) Sergeant’s Time Training
(3) NCOPD
c. Self-development: Stay current with the latest cyber issues and read documents that are published from all echelons of the cyber mission force for a greater understanding of the community’s posture within the joint community.', '2d325f09817ac5fd5f61176c4f2a41c5f2adb6738a51680d515e76a45b1f64a8', 13, 14, null, 50, null, null, false, null),
  ('86aa7136-ac2d-5da4-a220-a1a91b1e3baa', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'development', null, null, 'Goals for development', 'Chapter 5. MOS 17E Electromagnetic Warfare Specialist', 'Soldiers should serve in varying assignments from the tactical to the strategic in TOE and TDA units. The EW NCO must strive to seek additional broadening and leadership opportunities at all levels such as recruiting NCO, drill sergeant, instructor, and supervisory positions when given the opportunity.', '7a673105ae02ba533e245158e6a335483cfcf11f2546512865848ae4de70dcb0', 14, 15, null, 51, null, null, false, null),
  ('f94182a7-a863-539e-bb42-0e609e9f91c4', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'development', 'E-1..E-4', null, 'Private-Specialist/Corporal — overview', 'Chapter 5. MOS 17E Electromagnetic Warfare Specialist', 'Electromagnetic Warfare Specialist (Skill Level 1).', 'f56a1deb8d66d35a3d3cef3f337ffddbbc87da116e0b16f2535f73f382cdbdee', 15, 15, null, 52, null, null, false, null),
  ('5daf5b9d-0c0b-5edc-a382-52ab9e5badd4', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'skills', 'E-1..E-4', null, 'Private-Specialist/Corporal — Skills', 'Chapter 5. MOS 17E Electromagnetic Warfare Specialist', 'Operate and maintain EW equipment, evaluate electronic intelligence data, assist in generating threat briefs, and prepare interference reports. Conduct Electromagnetic Attack (EA) to support ground maneuver, tactical deception, EA in support of defensive and information operations. Perform Electromagnetic Protection (EP) activities to harden communications, minimize emission signatures, avoid spectrum interference by adjacent units and assist in evaluating interference reports. Conduct Electromagnetic Support (ES) to support situational awareness and planning, provide early warning to ground units, and assess EP measures, including operating and maintaining EW system-equipped vehicles. Ensure reprogramming of EW systems when threats change frequencies or the electromagnetic environment changes. Coordinate with other units for deconfliction of effects through understanding of the Joint Restricted Frequency List (JRFL). Participate in EW system reprogramming and staying updated with the latest software and hardware. Maintain a basic understanding of radio fundamentals and radio wave propagation. Assist in the creation of the Electromagnetic Enemy Order of Battle (EEOB).', '75007ab640ee84ff74d2d64ab4f2642b03356e8f3c18f2c1562e05a88c115de9', 15, 15, null, 53, null, null, false, null),
  ('d08ca282-5606-5da1-ae6e-9730bf3d6d83', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'assignments', 'E-1..E-4', null, 'Private-Specialist/Corporal — Operational assignments', 'Chapter 5. MOS 17E Electromagnetic Warfare Specialist', 'Primary assignment focus should remain at the tactical level. During the early years of a career, focus on building a strong base of technical and tactical expertise, basic MOS skills, and common Soldier tasks. An emphasis should be placed on learning reconnaissance and surveillance as well as movement and maneuver skills and techniques. Soldiers should seek responsibility and take advantage of opportunities to display their leadership skills, initiative, innovation, and motivation. The Soldiers should strive to serve in positions of increased responsibility, such as a team chief, when provided the opportunity.', 'aa8f5f8caea66d7ba97565a6b82c64723a70706c912803a81a5fb52178c3e5aa', 15, 15, null, 54, null, null, false, null),
  ('3ac57ac1-08d5-5142-862d-6d805a52b2fc', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'assignments', 'E-1..E-4', null, 'Private-Specialist/Corporal — Critical Developmental Assignments', 'Chapter 5. MOS 17E Electromagnetic Warfare Specialist', 'N/A', 'e2f79e5b60330bba4c289962231b6ba2957d0b14e7deb3110417003c79dea635', 15, 15, null, 55, null, null, false, null),
  ('16d5f95b-32c3-5d77-b7e1-b2d9e694c63e', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'training', 'E-1..E-4', null, 'Private-Specialist/Corporal — Military Training/Education by Domain', 'Chapter 5. MOS 17E Electromagnetic Warfare Specialist', 'Courses listed here are opportunities that can add depth and breadth to the knowledge and skills of the SL1 Soldier. Seeking additional training and education, beyond what is listed here, is highly recommended and can differentiate Soldiers from their peers. It is recommended that Soldiers refer to the COOL and ACT websites, at a minimum, for developmental opportunities.
a. Institutional:
(1) Ranger School
(2) Airborne School
(3) Air Assault School
(4) Advanced Threat Emitter
(5) Digital Mobile Radio
(6) Low-Level Voice Intercept (LLVI) Operator
(7) Electromagnetic Preparation of the Battlefield
(8) SIGINT/EW Advanced Radio and Antenna Theory
(9) Advanced RF and Applied Radio Theory
(10) Army Basic Space Cadre Course
(11) Information Operations Integration Course - Electromagnetic Warfare (IIC-EW)
(12) Introduction to Information Operations
(13) Robotics and Unmanned Systems Integration Course
(14) C-UAS Awareness Course
(15) C-SUAS Operator (FMS)
(16) Joint C-SUAS Operator
(17) Unit Level support Courses (UPL, armor course)
b. Operational:
(1) ATN - Training and Evaluation Outlines for Individual/Collective/Common Tasks
(2) NCOPD
c. Self-development:
(1) Best Squad Competition
(2) Best Warrior Competition
(3) Soldier of the Month/Quarter/Year boards
(4) Expert Soldier Badge
(5) Civilian Education (Degree program)
(6) Signal University (Tactical Communications)
(7) Credentials/Certifications', '4e31e6db7553dbcd5f610eb8bb1c9dd8070495b5b19c27cd0b475df2386b0093', 15, 16, null, 56, null, null, false, null),
  ('e389b9fb-ed2e-5b6c-8d9f-d667b18a1250', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'development', 'E-5', null, 'Sergeant — overview', 'Chapter 5. MOS 17E Electromagnetic Warfare Specialist', 'Electromagnetic Warfare Sergeant (Skill Level 2).', 'a01b03ca75aa5d89592b89eb871678c0efbab82a8105d23c3f4f3cbc09286b82', 16, 16, null, 57, null, null, false, null),
  ('9a05d8ce-2893-5cc0-9c0d-0dfb57dfa001', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'skills', 'E-5', null, 'Sergeant — Skill', 'Chapter 5. MOS 17E Electromagnetic Warfare Specialist', 'Perform duties in preceding skill level and provide guidance to subordinate Soldiers. Sergeants should focus this phase on their career development, troop leadership skills/troop leading procedures (TLP), honing technical expertise, and laying a foundation of tactical knowledge with an emphasis on reconnaissance and surveillance. Sergeants should be able to conduct TLPs and be familiar with how to plan, coordinate, and conduct EA and tactical deception in support of operations. Sergeants should be able to conduct ES to locate and identify threat systems; support information operations using EP activities to protect networks and systems against intentional or unintentional electromagnetic interference, have the ability to detect and minimize emission signatures of friendly unit communication and non-communication emitters, and avoid spectrum interference by adjacent units.', 'e789469bc1a44a6638d5f2786bc1319812f946ffdf4ca12cb9aaed3bb570a96d', 16, 16, null, 58, null, null, false, null),
  ('763b5890-78c7-5122-b02f-d5f0430102b5', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'assignments', 'E-5', null, 'Sergeant — Operational assignments', 'Chapter 5. MOS 17E Electromagnetic Warfare Specialist', 'a. ABCT, IBCT, SBCT, CAB, DIV
b. MDTF, DIVAD
c. Special Mission Unit (SMU) (SOF/SOAR/Ranger Regiment)', '4d3f62ca4b26a9d11ee4e3101ec5e55c864fe656cba6dde53caf6f32d4c325d5', 16, 16, null, 59, null, null, false, null),
  ('5c0ebf99-4bf8-5e35-bdf3-1d5e031de553', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'assignments', 'E-5', null, 'Sergeant — Critical Developmental Assignments', 'Chapter 5. MOS 17E Electromagnetic Warfare Specialist', 'a. Team Chief
b. EW Sergeant
c. Team Leader/SGT', '42e1fd855098c3c3b6c7b93d56cee65e2fc31227814a2a32cb50500562bf392f', 16, 16, null, 60, null, null, false, null),
  ('cd5790d5-1e83-5415-b723-fed11f6766e9', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'assignments', 'E-5', null, 'Sergeant — Broadening Assignments', 'Chapter 5. MOS 17E Electromagnetic Warfare Specialist', 'a. Instructor/Writer
b. Drill Sergeant
c. Recruiter', 'ac8ba43beae59a310be04822f245c96287a333fe5e8d224a50cc856f74d540c0', 16, 16, null, 61, null, null, false, null),
  ('de3ddf9b-749a-53db-89de-18e54bb72048', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'training', 'E-5', null, 'Sergeant — Military Training/Education by Domain', 'Chapter 5. MOS 17E Electromagnetic Warfare Specialist', 'Courses listed here are opportunities that can add depth and breadth to the knowledge and skills of the SL2 Soldier. Seeking additional training and education, beyond what is listed here, is highly recommended and will differentiate Soldiers from their peers. It is recommended that Soldiers refer to the COOL and ACT websites at a minimum for developmental opportunities.
a. Institutional:
(1) Critical Thinking and Structured Analysis (CTSA)
(2) Tactical Information Operations Planner
(3) Ranger School
(4) Airborne School
(5) Air Assault School
(6) Pathfinder
(7) Reconnaissance and Surveillance Leaders Course
(8) Introduction to Information Operations
(9) Information Operations Integration Course - Electromagnetic Warfare (IIC-EW)
(10) Unit Level support Courses (UPL)
(11) Joint Fire Power Course
(12) Army Basic Space Cadre Course
(13) Robotics and Unmanned Systems Integration Course
(14) C-UAS Awareness Course
(15) C-SUAS Operator (FMS)
(16) Joint C-SUAS Operator
(17) Joint C-SUAS Planner
(18) Foundry Courses (EW Related)
b. Operational:
(1) Squad Leader Development Course
(2) NCOPD
(3) Sergeant’s Time Training
(4) ATN - Training and Evaluation Outlines for Individual/Collective/Common Tasks
c. Self-Development:
(1) Expert Soldier Badge
(2) Sergeant Audie Murphy
(3) Sergeant Morales
(4) Best Squad Competition
(5) NCO of the Month/Quarter/Year boards
(6) Civilian Education (Degree program)
(7) Signal University (Tactical Communications)
(8) Credentials / Certifications', '3af20ddd38f020e616bcf5dcf2062421398a5a31b5feddc02d3b39e1827c34fa', 16, 17, null, 62, null, null, false, null),
  ('01e6fc0b-4cdb-5246-9d90-e4208ad529a8', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'development', 'E-6', null, 'Staff Sergeant — overview', 'Chapter 5. MOS 17E Electromagnetic Warfare Specialist', 'Electromagnetic Warfare Sergeant (Skill Level 3).', '276566273c9a360cd85a1da38218ef0606ff0fddcfa087bd7333bc692e9deabf', 17, 17, null, 63, null, null, false, null),
  ('39015f61-e9bd-567e-bb42-31ce67607f9d', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'skills', 'E-6', null, 'Staff Sergeant — Skill', 'Chapter 5. MOS 17E Electromagnetic Warfare Specialist', 'Perform duties shown in preceding skill level. Serve as Electromagnetic Warfare Platoon Senior Team Chief or CEMA Sergeant. Demonstrate proficiency in orders process, MDMP, joint air operations planning process, and the targeting process; manage employment of EW air and ground systems; review, processes, and forward effects requests to higher; ensure timely dissemination of information to and from higher headquarters; identify risks, vulnerabilities, courses of action, and potential countermeasures. Understand the fundamentals of the cyberspace domain and coordinate EW actions and effects with offensive and defensive cyberspace operations. Supervise the development of the EEOB and ensure the maintenance the Common Operating Picture. Staff Sergeants at this stage must demonstrate the ability to lead multiple teams of EW personnel through operations effectively. During this stage of a Staff Sergeant’s career there may be competing requirements that could conflict with career development. Staff Sergeants are expected to aggressively seek Critical Developmental (CD) positions, serving in operations for at least 24 months, prior to a broadening assignment. SSG’s who served successfully in Critical Developmental positions are expected to seek a Broadening Assignment when possible. SSG’s who successfully serve two years in a Critical Developmental position or those currently serving in a broadening assignment are considered competitive for promotion.', 'eec8580d5d7f44716ee0cab06dec325e9f34064050b7f1448b3f9a66962fc1fc', 17, 18, null, 64, null, null, false, null),
  ('e4ca9d63-1fa6-550c-a3cb-5a2a583852b2', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'assignments', 'E-6', null, 'Staff Sergeant — Operational assignments', 'Chapter 5. MOS 17E Electromagnetic Warfare Specialist', 'a. ABCT, IBCT, SBCT, CAB, DIV
b. MDTF, DIVAD
c. SMU (SOF/SOAR/Ranger Regiment)
d. Joint Interagency Intergovernmental and Multinational (JIIM)', '32e42f906a5083283040fda98c6ba03c4be62e1133f6eb947ae3942c6b8a9998', 18, 18, null, 65, null, null, false, null),
  ('7466a4f9-3042-54ea-9cd0-43d2c24d39cb', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'assignments', 'E-6', null, 'Staff Sergeant — Critical Developmental Assignments', 'Chapter 5. MOS 17E Electromagnetic Warfare Specialist', 'a. SR Team Chief
b. CEMA Sergeant
c. EW Sergeant
d. Operations SGT/NCO
e. Squad Leader', 'b56aa61feb69e445a4782ca9d6628fe0b15d2a1cd368181a6d676b3bd994824c', 18, 18, null, 66, null, null, false, null),
  ('05f5c977-0c63-5c42-96c3-e95c9993d615', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'assignments', 'E-6', null, 'Staff Sergeant — Broadening Assignments', 'Chapter 5. MOS 17E Electromagnetic Warfare Specialist', 'a. Drill Sergeant
b. Instructor/Writer
c. Training with Industry (TWI)
d. Recruiter
e. NCO Academy Small Group Leader (SGL)
f. EW NCO Army Research Labs
g. Operations NCO Cyber Center of Excellence (CCoE)', '655edd90dda135161b8267a3b51c24aac061b2ac721f532a454800dbf5a9862f', 18, 18, null, 67, null, null, false, null),
  ('1b10e7f1-9e9a-593f-bb2e-d6f3ce82fb73', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'training', 'E-6', null, 'Staff Sergeant — Military Training/Education by Domain', 'Chapter 5. MOS 17E Electromagnetic Warfare Specialist', 'Courses listed here are opportunities that can add depth and breadth to the knowledge and skills of the SL3 Soldier. Seeking additional training and education, beyond what is listed here, is highly recommended and will differentiate Soldiers from their peers. It is recommended that Soldiers refer to the COOL and ACT websites at a minimum for developmental opportunities.
a. Institutional training:
(1) Battle Staff Course
(2) Joint Fire Power Course
(3) Tactical Information Operations Planner Course
(4) Army Basic Space Cadre Course
(5) Army Deception Planners'' Course (ADPC)
(6) Army Information Operations Planners'' Course
(7) Information Operations Integration Course - Electromagnetic Warfare (IIC-EW)
(8) IO Fundamentals Course (IOFC)
(9) Information Operations Integration Course - Military Information Support Operations (IIC-MISO)
(10) Robotics and Unmanned Systems Integration Course
(11) C-UAS Awareness Course
(12) C-SUAS Operator (FMS)
(13) C-SUAS Planner (FMS)
(14) Joint C-SUAS Operator
(15) Joint C-SUAS Planner
(16) Cyber Operations Planner
(17) Ranger School
(18) Airborne School
(19) Air Assault School
(20) Reconnaissance and Surveillance Leaders Course
(21) Pathfinder
(22) Equal Opportunity (EO) Leaders Course
(23) Master Fitness Trainer
(24) Master Resiliency Trainer
(25) Unit Level support Courses (Unit Prevention Leader (UPL), EO, Hazmat, Unit Movement Officer (UMO), Master Driver)
(26) Brighton course
(27) Foundry Courses (EW Related)
b. Operational Training:
(1) Squad Leader Development Course
(2) Best Squad Competition
(3) NCOPD
(4) Sergeants Time Training
c. Self-development:
(1) Expert Soldier Badge
(2) Sergeant Audie Murphy
(3) Sergeant Morales
(4) Best Squad Competition
(5) NCO of the Month/Quarter/Year boards
(6) Civilian Education (Degree program)
(7) Signal University (Tactical Communications)
(8) Credentials / Certifications', '7efea45df6a45deb67420addcab65b5309f37f70eed155dad422ff140be61d4c', 18, 19, null, 68, null, null, false, null),
  ('cbf0967e-0aa5-5846-833b-0b19b8cc78bd', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'development', 'E-7', null, 'Sergeant First Class — overview', 'Chapter 5. MOS 17E Electromagnetic Warfare Specialist', 'Electromagnetic Warfare Sergeant (Skill Level 4).', '5f5ab48fbdf3d60dcc15fb8cb093159ec26b7f16d3f7b855bd0acd2a526ec886', 19, 19, null, 69, null, null, false, null),
  ('76052c9e-a9ae-56b7-b074-1a96af96e791', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'skills', 'E-7', null, 'Sergeant First Class — Skill', 'Chapter 5. MOS 17E Electromagnetic Warfare Specialist', 'Perform duties shown in preceding skill level. Serve as Electromagnetic Warfare Platoon Sergeant or CEMA staff NCO at echelons above Brigade. Primary enlisted CEMA advisor and planner for the CEMA section at echelons Division and above; ensure support to subordinate units; manage equipment and resource issues with and between higher, adjacent, and subordinate units; prioritize allocation of Army EW air and ground assets; review and process effects request; coordinate integration and execution of combined CEMA operations. Responsible for planning sustainment, casualty evacuation, and ensuring proper tactical emplacement of subordinate EW teams. Manage personnel and equipment readiness for the EW platoon. Responsible for further development of junior NCOs. The EW Staff NCO is the organization''s senior trainer for EW.', '5d539fb44ec10a8b71af830e0bfa5f2111d0c9f49781ddfd0253a4c29a6c6043', 19, 19, null, 70, null, null, false, null),
  ('02187f61-d67f-5ea2-81e6-4c310bb6660d', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'assignments', 'E-7', null, 'Sergeant First Class — Operational assignments', 'Chapter 5. MOS 17E Electromagnetic Warfare Specialist', 'a. ABCT, IBCT, SBCT, CAB, DIV, CORPS
b. MDTF, DIVAD
c. SMU (SOF/SOAR/Ranger Regiment)
d. Joint Interagency Intergovernmental and Multinational (JIIM)
e. US Army Cyber Command (ARCYBER)', '3ffd29d6e1db71338140644eb2872e768e0e3a67094a9287b39d5877188b43a1', 19, 19, null, 71, null, null, false, null),
  ('6a45f340-6a07-5db8-88bb-7f02d30ca75d', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'assignments', 'E-7', null, 'Sergeant First Class — Critical Developmental Assignments', 'Chapter 5. MOS 17E Electromagnetic Warfare Specialist', 'a. EW Platoon Sergeant
b. SR EW Sergeant
c. CEMA Supervisor
d. EW NCO
e. CEMA NCO', 'dff3d14e1e818ab1206ca0a89ffb19b1abc164d4b603980f5cd86ef7078a5b44', 19, 20, null, 72, null, null, false, null),
  ('d8699861-b506-5d4e-805b-086dd16b2c83', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'assignments', 'E-7', null, 'Sergeant First Class — Broadening Assignments', 'Chapter 5. MOS 17E Electromagnetic Warfare Specialist', 'a. Drill Sergeant
b. Instructor/Writer
c. Training with Industry (TWI)
d. Recruiter
e. NCOA SGL
f. EW NCO Army Research Labs
g. Operations NCO CCoE
h. EW NCO Observer Controller/Trainer (OC/T)
i. Proponent Career Management NCO
j. NATO, US Army Element, Land Section', '98d7b2804292486e2fd8aa66c27d68dc31a8e9f6509aad36a23bb32220bfc057', 20, 20, null, 73, null, null, false, null),
  ('7f1304b2-6fb2-5a44-a46b-20e883356310', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'training', 'E-7', null, 'Sergeant First Class — Military Training/Education by Domain', 'Chapter 5. MOS 17E Electromagnetic Warfare Specialist', 'Courses listed here are opportunities that can add depth and breadth to the knowledge and skills of the SL4 Soldier. Seeking additional training and education, beyond what is listed here, is highly recommended and will differentiate Soldiers from their peers. It is recommended that Soldiers refer to the COOL and ACT websites at a minimum, for developmental opportunities.
a. Institutional training:
(1) Battle Staff Course
(2) Joint Fire Power Course
(3) Tactical Information Operations Planner Course
(4) Army Basic Space Cadre Course
(5) Electronic Warfare Coordinators Course (EWCC)
(6) Joint Electronic Warfare Theater Operations Course (JEWTOC)
(7) Joint Electromagnetic Warfare Theater Operations Course (JEMSOTOC)
(8) Special Technical Operations Course (ASTOPC)
(9) Pathfinder
(10) Master Fitness Trainer
(11) Master Resiliency Trainer
(12) Equal Opportunity Leaders Course
(13) Sexual Assault Response Coordinator (SARC) Course
(14) Jump Master Course
(15) Brighton course
(16) Army Deception Planners'' Course (ADPC)
(17) Army Information Operations Planners'' Course
(18) Information Operations Integration Course - Electromagnetic Warfare (IIC-EW)
(19) IO Fundamentals Course (IOFC)
(20) Information Operations Integration Course - Military Information Support Operations (IIC-MISO)
(21) Robotics and Unmanned Systems Integration Course
(22) C-UAS Awareness Course
(23) C-SUAS Operator (FMS)
(24) C-SUAS Planner (FMS)
(25) Joint C-SUAS Operator
(26) Joint C-SUAS Planner
(27) Cyber Operations Planner
(28) Foundry Courses
b. Operational Training:
(1) NCOPD
(2) Sergeants Time Training
(3) Unit Level support Courses (UPL, EO, Hazmat, Unit Movement Officer (UMO), Master Driver)
c. Self-development:
(1) Expert Soldier Badge
(2) Civilian Education
(3) Signal University
(4) Credentials / Certifications', '393bbd86cf5e23735ff768829dd5396da4e9d529c27673d612d9f141eb89131c', 20, 21, null, 74, null, null, false, null),
  ('c47e3536-b032-5217-9735-933ac221a6cf', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'development', 'E-8', null, 'Master Sergeant — overview', 'Chapter 5. MOS 17E Electromagnetic Warfare Specialist', 'Electromagnetic Warfare Sergeant (Skill Level 5).', '384aeb1ab619b4762b05c271caeab164bb85c105ddbbcf1af61d3a1352d9691b', 21, 21, null, 75, null, null, false, null),
  ('24caf638-b074-5cd4-8ff0-7b83fdc437b2', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'skills', 'E-8', null, 'Master Sergeant — Skill', 'Chapter 5. MOS 17E Electromagnetic Warfare Specialist', 'Perform duties shown in preceding skill level. Serve as Company 1SG or Brigade and higher staff NCO. Primary enlisted CEMA advisor of the CEMA element at the Brigade or Division echelons; primary enlisted CEMA advisor; significant combined operations emphasis; prioritization of Army, joint and multi- national CEMA assets between adjacent and subordinate commands as applicable; allocation of CEMA equipment and resources; develop tactical level guidance from strategic guidance. Responsible for the management of EW personnel across the Division or Brigade to ensure proper professional development through critical assignments.', '26f8c6011913a6c92c3d5c6564f1156c21d5e4ac1b6ac910601a28d59fb857d6', 21, 21, null, 76, null, null, false, null),
  ('3889238e-8d96-5383-bfc9-657c6c635eff', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'assignments', 'E-8', null, 'Master Sergeant — Operational Assignments', 'Chapter 5. MOS 17E Electromagnetic Warfare Specialist', 'a. ABCT, IBCT, SBCT, CAB, DIV, CORPS
b. Multi-Domain Task Force (MDTF), DIVAD
c. Special Mission Unit (SMU)
d. Special Operations Forces (SOF)
e. Joint Interagency Intergovernmental and Multinational (JIIM)
f. EW SR NCO ARCYBER', 'b3f935c850000d27898d4ab38e75388138e45d1416c85a021cf878bad3a769b0', 21, 21, null, 77, null, null, false, null),
  ('fef5d001-0f0f-543c-8012-fb2f4b46dfd2', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'assignments', 'E-8', null, 'Master Sergeant — Critical Developmental Assignments', 'Chapter 5. MOS 17E Electromagnetic Warfare Specialist', 'a. CEMA NCOIC
b. EW Sergeant NCOIC
c. First Sergeant', '2b8f7d04b02f0a4b8f614d6a036a0305d79e805c1557131dcf9f9f7393d27eae', 21, 21, null, 78, null, null, false, null),
  ('5479ca2b-37b2-550b-820d-6f401de770e5', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'assignments', 'E-8', null, 'Master Sergeant — Broadening Assignments', 'Chapter 5. MOS 17E Electromagnetic Warfare Specialist', 'a. HR PD NCO
b. Army Cyber Institute (ACI)
c. SR EW NCO OC/OCT
d. Training with Industry (TWI)
e. Combat Training Center Ops', '811bbecb964d34482fbf15ef994b1b8d0118df4ef4bf54d977820c32c82f8afb', 21, 21, null, 79, null, null, false, null),
  ('4d81d284-6107-52a7-83b4-0a10cce49e33', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17E', null, 'training', 'E-8', null, 'Master Sergeant — Military Training/Education by Domain', 'Chapter 5. MOS 17E Electromagnetic Warfare Specialist', 'Courses listed here are opportunities that can be pursued to add depth and breadth to the knowledge and skills of the SL5 Soldier. Seeking additional training and education, beyond what is listed here, is highly recommended and will differentiate Soldiers from their peers. It is recommended that Soldiers refer to the COOL and ACT websites at a minimum, for developmental opportunities.
a. Institutional training:
(1) Air Operations Center Course
(2) Joint Air Operations Planning System Course
(3) Joint Fire Power
(4) DOD Exploitation or Analyst
(5) Ranger School
(6) Jump Master School
(7) Air Assault School
(8) Brighton course
(9) Army Deception Planners'' Course (ADPC)
(10) Army Information Operations Planners'' Course
(11) Information Operations Integration Course - Electromagnetic Warfare (IIC-EW)
(12) Information Operations Integration Course - Military Information Support Operations (IIC-MISO)
(13) C-SUAS Planner (FMS)
(14) Joint C-SUAS Planner
(15) Special Technical Operations Planners Course (STOPC)
b. Operational Training:
(1) First Sergeant and Commander Course
(2) NTC/JRTC
(3) Joint Exercise
(4) Sergeant’s Time Training
(5) NCOPD
(6) Self-development: Joint Planning Process
(7) Tactical and Joint Operations/Action Center operations
(8) Air Tasking Orders
(9) Offensive and Defensive Cyber Operations
(10) Remain up to date on EW capabilities and assets available both organically and through external agencies
(11) Poses a thorough understanding of Joint Electromagnetic Spectrum Operations and associated doctrine', '895a7217cb94c6b23d7dce06f703ce3329afed6b422f337476bbbff961a3e1ad', 21, 22, null, 80, null, null, false, null),
  ('29de0d89-134b-57f0-b541-be4eaced45ec', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17Z', null, 'development', null, null, 'Goals for development', 'Chapter 6. MOS 17Z Cyberspace Electromagnetic Activities (CEMA) Senior Sergeant', 'The Sergeant Major directs cyberspace, electronic warfare (EW), and Cyber and Electromagnetic Activities (CEMA) organizations and missions to support Army and combatant command objectives. They demonstrate a deep understanding and application of Joint and Army principles, integrating seamlessly within the operational framework. The Sergeant Major aims to continually cultivate organizational leadership skills to teach, counsel, coach and mentor Soldiers. Exceptional communication skills are essential, given the extensive reach of their messages. Additionally, community and public relations proficiency is crucial, as the Sergeant Major frequently represents the command or Army at civic functions.', '829bb44e40c145206b3b8eb7b3389e7f3f4ed7b241c8a726f73186f7130db222', 23, 23, null, 81, null, null, false, null),
  ('69cfac09-6327-5802-93e6-cb56fc9fc48d', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17Z', null, 'development', 'E-9', null, 'Sergeant Major/Command Sergeant Major — overview', 'Chapter 6. MOS 17Z Cyberspace Electromagnetic Activities (CEMA) Senior Sergeant', 'Cyberspace Electromagnetic Activities Senior Sergeant (Skill Level 6).', '73e098bac96ab60b765a7db785bbd1f82b5c9273ddbd3baff650aebaa5f90549', 23, 23, null, 82, null, null, false, null),
  ('00f98596-c48c-5aed-8f43-cef10532756d', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17Z', null, 'assignments', 'E-9', null, 'Sergeant Major/Command Sergeant Major — Operational assignments', 'Chapter 6. MOS 17Z Cyberspace Electromagnetic Activities (CEMA) Senior Sergeant', 'a. Operations/Training SGM
b. BN/BDE/Garrison CSM
c. Corps/CCoE NCOA CSM
d. G39/CEMA SGM
e. Joint Forces Headquarters (JFHQ)/CO-IPE SEL', '0afe490a20a75fc93a247bcfbb32abbf45b751945e5682f1c53c6de1c99546a1', 23, 23, null, 83, null, null, false, null),
  ('bf891bb1-9e1d-5010-a926-7dddccdb4688', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17Z', null, 'assignments', 'E-9', null, 'Sergeant Major/Command Sergeant Major — Critical Developmental/Broadening Assignments', 'Chapter 6. MOS 17Z Cyberspace Electromagnetic Activities (CEMA) Senior Sergeant', 'a. Proponent SGM
b. Training and Education Division SGM
c. SGM-A Instructor
d. ACI SGM', '189ee978bcf6c13d9be6b9d3051601096e5eba56160251bb4ab973636457cfd0', 23, 23, null, 84, null, null, false, null),
  ('549a6993-005e-5660-839a-a3ca0ae0b15e', '69b2d2fd-939e-5fa1-804f-a4277816db9e', 'Army', 'enlisted', '17Z', null, 'training', 'E-9', null, 'Sergeant Major/Command Sergeant Major — Military Training/Education by Domain', 'Chapter 6. MOS 17Z Cyberspace Electromagnetic Activities (CEMA) Senior Sergeant', 'Courses listed here are opportunities that can be pursued to add depth and breadth to the knowledge and skills of the SL6 Soldier. Seeking additional training and education, beyond what is listed here, is highly recommended and will differentiate Soldiers from their peers. It is recommended that Soldiers refer to the COOL and ACT websites at a minimum, for developmental opportunities.
a. Institutional:
(1) Pre-Command Course
(2) Keystone Training
(3) Army Strategic Leader Development Program (ASLDP)
b. Operational:
(1) SEJPME II
(2) Joint Planning Process
(3) How the Army Runs Course
(4) CSM/SGM Legal Orientation Course
c. Self-development:
(1) Poses a thorough understanding of Joint Electromagnetic Spectrum Operations and associated doctrine
(2) Stay current with the latest cyber issues and read documents that are published from all echelons of the cyber mission force for a greater understanding of the community’s posture within the joint community
(3) Joint Planning Process
(4) Executive leadership development training and seminars
(5) Industry training and certifications', '9c4ee32f5a2294c60988779dd5e3b0477b9da92f6455fdf2a4651d0477eb339a', 23, 23, null, 85, null, null, false, null);
commit;
