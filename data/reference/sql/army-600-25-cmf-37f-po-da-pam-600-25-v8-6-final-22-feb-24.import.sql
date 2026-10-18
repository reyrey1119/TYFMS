-- Import: army-600-25-cmf-37f-po-da-pam-600-25-v8-6-final-22-feb-24
-- 16 passages from DA PAM 600-25: Psychological Operations (CMF 37) Career Progression Plan, DA PAM 600-25 (MOS 37F)
-- Imported as review_status='unreviewed'; it is NOT served to users until approved.
begin;
insert into public.reference_sources
  (id, branch, personnel_category, publication_number, title, chapter, career_field, proponent, official_url,
   publication_date, effective_date, last_checked_at, checksum_sha256, ingestion_status, review_status, notes, extraction_tool, import_batch, content_sha256)
values ('26844b13-f58b-5d0d-8f65-0a83b3ead7c1', 'Army', 'enlisted', 'DA PAM 600-25', 'Psychological Operations (CMF 37) Career Progression Plan, DA PAM 600-25 (MOS 37F)', null, 'CMF 37F', null, 'https://api.army.mil/e2/c/downloads/2024/03/01/eb8ef23c/cmf-37f-po-da-pam-600-25-v8-6-final-22-feb-24.pdf',
   '2024-02-22', null, '2026-10-18T00:00:00Z', '7688cdd2b10285fcca2303c4ecd9d2ff767304af8d0560f60b2cc2c59f5c5b66', 'extracted', 'unreviewed', 'Date basis: the 2024-02-22 date comes from the official file name and the Army G-1 listing (https://www.army.mil/g-1), checked 2026-10-16; the PDF body may print no date. Imported for 37F. Duties and prerequisites are NOT imported from this guide (DA PAM 611-21 is the source for them); promotion-board criteria are stored but never shown. LIMITATIONS: Reserve Component chapters and professional-development-model figures are not imported; career-field-wide rank guidance is attached to every MOS of this guide that has its own chapter.', 'pdf-parse 2.4.5', 'army-600-25-cmf-37f-po-da-pam-600-25-v8-6-final-22-feb-24@2026-10-18', '8a9c9f6971774694bb2fc6205afe3fff1975545d0ab5155c8619433e5bf97c4d')
on conflict (id) do update set
  publication_number = excluded.publication_number, title = excluded.title, career_field = excluded.career_field, proponent = excluded.proponent,
  official_url = excluded.official_url, publication_date = excluded.publication_date, last_checked_at = excluded.last_checked_at,
  checksum_sha256 = excluded.checksum_sha256, ingestion_status = 'extracted', notes = excluded.notes,
  extraction_tool = excluded.extraction_tool, import_batch = excluded.import_batch,
  branch = excluded.branch, personnel_category = excluded.personnel_category,
  chapter = excluded.chapter, effective_date = excluded.effective_date,
  content_sha256 = excluded.content_sha256,
  review_status = 'unreviewed', reviewed_by = null, reviewed_at = null;
delete from public.reference_passages where source_id = '26844b13-f58b-5d0d-8f65-0a83b3ead7c1';
insert into public.reference_passages
  (id, source_id, branch, personnel_category, occupation_code, occupation_title, section_type, rank_band, components, heading, chapter, body, body_sha256, pdf_page_start, pdf_page_end, printed_page, sort_order, effective_from, effective_to, cumulative, skill_level)
values
  ('7249d9c3-50bc-5a6f-a669-e4bb4a8ccc08', '26844b13-f58b-5d0d-8f65-0a83b3ead7c1', 'Army', 'enlisted', '37F', null, 'development', null, null, 'Overview', 'Chapter 4. Military Occupational Specialty 37F (PO Specialist)', 'Proponent Note: Proponent guidance should not be construed as a simplified checklist for promotion selection. It does not guarantee promotion or a competitive Order of Merit (OML) number following evaluation boards. NCOs who have completed assignments in key and developmental positions and consistently outperformed their peers receiving exceptional rater and senior rater comments are viewed more favorably by board members.', 'd7f510cb365465a6d0673d03cb79ab40608f6e88601e282e174f554523b61f9f', 8, 8, '8', 0, null, null, false, null),
  ('104a0426-45bd-560a-9265-2a489145bc2d', '26844b13-f58b-5d0d-8f65-0a83b3ead7c1', 'Army', 'enlisted', '37F', null, 'development', null, null, 'Goals for development', 'Chapter 4. Military Occupational Specialty 37F (PO Specialist)', 'PO branch guidance is for NCOs to serve in Key Leadership Development assignments to be considered branch developed. Proponent Note: The following information is specific to RA only.', 'b871b3499071045841674fde5b5b9478099e84673522634871f7f6ecde418c68', 10, 10, '10', 1, null, null, false, null),
  ('57601c2d-4ec8-58a7-9bf8-1bdff18e5239', '26844b13-f58b-5d0d-8f65-0a83b3ead7c1', 'Army', 'enlisted', '37F', null, 'development', 'E-5', null, 'Sergeant (SGT) (37F20) — Leadership', 'Chapter 4. Military Occupational Specialty 37F (PO Specialist)', 'No leadership positions are identified.', '90a55ed673f7faebf41c1c569b9eb8203759e5fe0943717b55ae248fc3623a62', 10, 10, '10', 2, null, null, false, null),
  ('5d6a6f7b-ddb4-5482-8dcf-bd53b75fd888', '26844b13-f58b-5d0d-8f65-0a83b3ead7c1', 'Army', 'enlisted', '37F', null, 'assignments', 'E-5', null, 'Sergeant (SGT) (37F20) — Assignments', 'Chapter 4. Military Occupational Specialty 37F (PO Specialist)', '(1) Key and Developmental: PO SGT in PO units of action. RA SGTs in Airborne units must be able to maintain airborne status unless not required by position.
(2) Nominative / Special: None
(3) MOS Enhancing: All valid MOS 37F SGT documented positions contribute to the development of an MOS 37F SGT.
(4) MOS Broadening: Non-combat vehicle drivers or other positions in logistics, operations, and echelons above detachment.
(5) Special consideration should be given to those SGTs who meet the criteria, selected for, are working, or have successfully served in 37F3 position.', '7d0ef5513cf301ae1602e811f256481dd5dbd64799a7c2cfdfbfa72f5740c731', 10, 10, '10', 3, null, null, false, null),
  ('7d63ae99-7441-5740-bc50-beda41dde31d', '26844b13-f58b-5d0d-8f65-0a83b3ead7c1', 'Army', 'enlisted', '37F', null, 'training', 'E-5', null, 'Sergeant (SGT) (37F20) — Military Education', 'Chapter 4. Military Occupational Specialty 37F (PO Specialist)', '(1) Must complete DLC 2.
(2) RA CMF 37 SGTs should prepare themselves for attendance at a Static-Line Jumpmaster course and Survival Evasion Resistance Escape (SERE) Level C (SERE- C) course.', 'a27e825b334134c089dbcfd6bc06207c396048a21d521a521b59b7416c746035', 10, 10, '10', 4, null, null, false, null),
  ('4b8c015d-b2d9-554f-b38b-da56420bfa58', '26844b13-f58b-5d0d-8f65-0a83b3ead7c1', 'Army', 'enlisted', '37F', null, 'development', 'E-5', null, 'Sergeant (SGT) (37F20) — Language', 'Chapter 4. Military Occupational Specialty 37F (PO Specialist)', 'RA CMF 37 SGTs must have a current (within 12 months) Defense Language Proficiency Test (DLPT) or Oral Proficiency Interview (OPI) on file in their control language (CLANG). See Army Regulation 11-6 for further guidance.', '79156b9b29f7013eb971c15586cc06f40b0c6fe6dfa601cd0abd3c8202768310', 10, 10, '10', 5, null, null, false, null),
  ('d30faa6b-2240-5773-8600-9f1ecab4981e', '26844b13-f58b-5d0d-8f65-0a83b3ead7c1', 'Army', 'enlisted', '37F', null, 'self_development', 'E-5', null, 'Sergeant (SGT) (37F20) — Civilian Education', 'Chapter 4. Military Occupational Specialty 37F (PO Specialist)', 'Accumulation of 30 or more credit hours.', '49cdda9492877aae756692c7233c9253557744c9ec99efa04cd39f4d5033e817', 10, 10, '10', 6, null, null, false, null),
  ('04ac20d1-526f-5b27-90d8-2d8161673315', '26844b13-f58b-5d0d-8f65-0a83b3ead7c1', 'Army', 'enlisted', '37F', null, 'development', 'E-5', null, 'Sergeant (SGT) (37F20) — Physical Fitness', 'Chapter 4. Military Occupational Specialty 37F (PO Specialist)', 'Consistent ACFT scores of 360 or better, effective 1 October 2022 (APFT scores of 180 or better (60 points in each event), prior to 1 October 2022), and meet height / weight requirements IAW AR 600-9. Proponent Note: RA CMF 37 SGTs should prepare their records for submission of a Top-Secret security clearance request and application for an official passport.', 'ea407f407c5af397df38e2889f1ad4f646e1081faa20142ae89d96cd769cd038', 10, 10, '10', 7, null, null, false, null),
  ('c237835c-60fc-53bb-b5cb-5a46b4075d09', '26844b13-f58b-5d0d-8f65-0a83b3ead7c1', 'Army', 'enlisted', '37F', null, 'assignments', 'E-6', null, 'Staff Sergeant (Skill level 3) — Assignment / Position Categories', 'Chapter 4. Military Occupational Specialty 37F (PO Specialist)', '(1) Key and Developmental: PO SGT in PO units of action. RA SSGs in Airborne units must be able to maintain airborne status unless not required by position.
(2) Nominative / Special: Drill Sergeant; Recruiter; Instructor (Airborne).
(3) MOS Enhancing: Instructor/Writer; SPT; POAS Assessor; TIS / S3X; OSW; SMU / Special Activities; Information Warfare Center (IWC); BN / GRP staff NCO; Regional PO planner.
(4) MOS Broadening: Victim Advocate; EOL / EOR; NCOA Instructor.', 'c22bcd743d3ae3735e0d4b305e154d54a145ed5f0c49d909fd1a2169c53dfd27', 10, 11, '10', 8, null, null, false, null),
  ('d4db1439-8186-51f5-bee7-8c573907d422', '26844b13-f58b-5d0d-8f65-0a83b3ead7c1', 'Army', 'enlisted', '37F', null, 'promotion_criteria', 'E-6', null, 'Staff Sergeant (Skill level 3) — promotion consideration', 'Chapter 4. Military Occupational Specialty 37F (PO Specialist)', 'b. Unqualified (Unsatisfactory Performance and No Potential for Continued Service) RA CMF 37 SSGs. The following must have occurred within the current grade and the 18 months prior to the most current evaluation board:
(1) Leadership: Received a General Officer Memorandum of Reprimand (GOMAR) or conviction by court-martial in current grade or received a Bar to continued service IAW AR 601-28.
(2) Received a NCOER in current grade with any of the following:
(a) Relief for Cause.
(b) Annotation of “Did Not Meet Standard” in Part IV (Performance Evaluation, Professionalism, Attributes, and Competencies), block c (Character).
(c) Annotation of “Not Qualified” in Part V (Senior Rater Overall Potential), block a (Rated Noncommissioned Officer’s Potential)
(3) Assignments: Declines to serve on a PO unit of action, directed assignment or is unable to meet assignment requirements due to loss of security clearance, flags, or adverse actions.
(4) Military Education: Refuses to complete DLC, PME, and / or consistently fails to meet the prerequisites to attend PME or advance skill courses.
(5) Language Proficiency: Fails to maintain a current (within 12 months) DLPT or OPI on file in their CLANG. See Army Regulation 11-6 for further guidance.
(6) Physical Fitness: Fails to score 360 points with a minimum of 60 points in each event on the ACFT, effective 1 October 2022, and / or fails to meet height / weight requirements IAW AR 600-9.
c. Fully Qualified (Average Performance and Potential) RA CMF 37 SSGs:
(1) Leadership: Have 18 months or more accumulative successful service as a PO SSG.
(2) Assignments: 12 months or more of rated time in a 37F3 position.
(3) Military Education: Completion of ALC.
(4) Language Proficiency: RA CMF 37 SSGs must have a current (within 12 months) DLPT or OPI on file in their CLANG. See Army Regulation 11-6 for further guidance.
(5) Physical Fitness: Consistent ACFT scores of 360 or better, effective 1 October 2022 (APFT scores of 180 or better (60 points in each event), prior to 1 October 2022), and meet height / weight requirements IAW AR 600-9.
d. Highly Qualified (Above Average Performance and Potential) RA CMF 37 SSGs:
(1) Leadership: Have 24 months or more accumulative successful service as a PO SSG, with strong evaluations regarding potential with supporting enumeration.
(2) Assignments: 12 months or more of rated time in a 37F3 Key and Developmental position.
(3) Military Education:
(a) Completion of DLC 3.
(b) Completion of one or more advanced skill / functional courses, see Appendix A.
(c) Special consideration should be given to those SSGs who have successfully completed the SPT training pathway and been awarded the S5J PDSI.
(4) Language Proficiency:
(a) RA CMF 37 SSGs must have a current (within 12 months) DLPT or OPI on file in their CLANG. See Army Regulation 11-6 for further guidance.
(b) A FLPR of 1 / 1 should be viewed as highly qualified.
(5) Civilian Education: Completion of 45 or more credit hours towards an associate’s degree or a civilian technical skills certification.
(6) Physical Fitness: Consistent ACFT scores of 480 or better, effective 1 October 2022 (APFT scores of 240 or better (80 points in each event), prior to 1 October 2022), and meet height / weight requirements IAW AR 600-9.
e. Most Qualified (Outstanding Performance and Potential) RA CMF 37 SSGs:
(1) Leadership: Have 36 months accumulative successful service as a PO SSG, with a consistently strong pattern of quantifiable “far exceeded” NCOER ratings by their raters and a consistent pattern of Senior Rater comments which clearly state strong potential to serve at the next higher grade.
(2) Assignments:
(a) 12 months or more of rated time in a 37F3 Key and Developmental position, and 12 months or more of rated time in a Nominative / Special Assignment, MOS Enhancing or MOS Broadening position.
(b) Special consideration should be given to those SSGs who meet the criteria, selected for, are working, or have successfully served in a 37F4 position.
(3) Military Education:
(a) Completion of SLC.
(b) Graduate of a Static Line Jumpmaster course.
(c) Completion of two or more advanced skill / functional courses, see Appendix A.
(d) Special consideration should be given to those SSGs who have successfully completed the SPT training pathway and been awarded the S5J PDSI.
(e) Special consideration should be given to those SSGs who are consistently selected as the Distinguished Honor Graduate, Honor Graduate, Top 20% Commandant’s List, or other honors during NCOPDS or MOS enhancing courses.
(4) Language Proficiency:
(a) RA CMF 37 SSGs must have a current (within 12 months) DLPT or OPI on file in their CLANG. See Army Regulation 11-6 for further guidance.
(b) A FLPR of 1+ / 1+ should be viewed as most qualifying.
(c) A FLPR of 2 / 2 or higher should be viewed as exceptional.
(5) Civilian Education:
(a) Completion of an associate’s degree or attained 60 or more credit hours towards a bachelor’s degree, or multiple civilian technical skills certifications.
(b) Completion of a bachelors, graduate, or post-graduate degree should be viewed as exceptional.
(6) Physical Fitness: Consistent ACFT scores of 540 or better, effective 1 October 2022 (APFT scores of 270 or better (90 points in each event), prior to 1 October 2022), and meet height / weight requirements IAW AR 600-9.', '9563e33082496df0a808024570fc05db0855431430ac2091e39b20277c56b118', 11, 12, '11', 9, null, null, false, null),
  ('8dd096b0-ca3a-57c5-a1a3-c5109e9a88e2', '26844b13-f58b-5d0d-8f65-0a83b3ead7c1', 'Army', 'enlisted', '37F', null, 'assignments', 'E-7', null, 'Sergeant First Class (SFC) (Skill level 4) — Assignment / Position Categories', 'Chapter 4. Military Occupational Specialty 37F (PO Specialist)', '(1) Key and Developmental: Team Sergeant in PO units of action. RA SFCs in Airborne units must be able to maintain airborne status unless not required by position.
(2) Nominative / Special: Career Management NCO (Proponent); Branch Manager (HRC); Senior Drill Sergeant; Recruiter; Instructor (Airborne).
(3) MOS Enhancing: Instructor / Writer; Doctrine Writer; Training Developer; SPT; POAS Senior Assessor; TIS / S3X; OSW; SMU / Special Activities; IWC; PO staff NCO at BN and higher echelon HQs; Regional PO planner
(4) MOS Broadening: AIT Platoon Sergeant; Observer Controller at JRTC / NTC / JRMC; Victim Advocate / SARC; EOL / EOR / EOA; Security Force Assistance Brigade (SFAB) Planner.', '40193205bfcf8845dd33b27f0da65bd04f52f7378e127dde4374fe2973ff0645', 13, 13, '13', 10, null, null, false, null),
  ('4358acb3-4581-5367-8c5a-1acf9e34e430', '26844b13-f58b-5d0d-8f65-0a83b3ead7c1', 'Army', 'enlisted', '37F', null, 'promotion_criteria', 'E-7', null, 'Sergeant First Class (SFC) (Skill level 4) — promotion consideration', 'Chapter 4. Military Occupational Specialty 37F (PO Specialist)', 'b. Unqualified (Unsatisfactory Performance and No Potential for Continued Service) RA CMF 37 SFCs. The following must have occurred within the current grade and the 18 months prior to the most current evaluation board:
(1) Leadership: Received a GOMAR or conviction by court-martial in current grade or received a Bar to continued service IAW AR 601-28.
(2) Received NCOER in current grade with any of the following:
(a) Relief for Cause.
(b) Annotation of “Did Not Meet Standard” in Part IV (Performance Evaluation, Professionalism, Attributes, and Competencies), block c (Character)
(c) Annotation of “Not Qualified” in Part V (Senior Rater Overall Potential), block a (Rated Noncommissioned Officer’s Potential)
(3) Assignments: Declines to serve on a PO unit of action, directed assignment, or is unable to meet assignment requirements due to loss of security clearance, flags, or adverse actions.
(4) Military Education: Refuses to complete DLC, PME, and / or consistently fails to meet the prerequisites to attend PME or advance skill courses.
(5) Language Proficiency: Fails to maintain a current (within 12 months) DLPT or OPI on file in their CLANG. See Army Regulation 11-6 for further guidance.
(6) Physical Fitness: Fails to score 360 points with a minimum of 60 points in each event on the ACFT, effective 1 October 2022, and / or fails to meet height / weight requirements IAW AR 600-9.
c. Fully Qualified (Average Performance and Potential) RA CMF 37 SFCs:
(1) Leadership: Have 18 months or more accumulative successful service as a PO SFC.
(2) Assignments: 12 months or more of rated time in a 37F4 position.
(3) Military Education: Completion of SLC.
(4) Language Proficiency: RA CMF 37 SFCs must have a current (within 12 months) DLPT or OPI on file in their CLANG. See Army Regulation 11-6 for further guidance.
(5) Physical Fitness: Consistent ACFT scores of 360 or better, effective 1 October 2022 (APFT scores of 180 or better (60 points in each event), prior to 1 October 2022), and meet height / weight requirements IAW AR 600-9.
d. Highly Qualified (Above Average Performance and Potential) RA CMF 37 SFCs:
(1) Leadership: Have 24 months accumulative successful service as a PO SFC, with Strong evaluations regarding potential with supporting enumeration.
(2) Assignments: 12 months or more of rated time in a 37F4 Key and Developmental position.
(3) Military Education:
(a) Completion of DLC 4.
(b) Graduate of a Static Line Jumpmaster course.
(c) Completion of two or more advanced skill / functional courses, see Appendix A.
(d) Special consideration should be given to those SFCs who have successfully completed the SPT training pathway and been awarded the S5J PDSI.
(4) Language Proficiency:
(a) RA CMF 37 SFCs must have a current (within 12 months) DLPT or OPI on file in their CLANG. See Army Regulation 11-6 for further guidance.
(b) A FLPR of 1 / 1 should be viewed as highly qualified.
(5) Civilian Education: Completion of an associate’s degree or attained 60 or more credit hours towards a bachelor’s degree, or a civilian technical skills certification.
(6) Physical Fitness: Consistent ACFT scores of 480 or better, effective 1 October 2022 (APFT scores of 240 or better (80 points in each event), prior to 1 October 2022), and meet height/weight requirements IAW AR 600-9.
e. Most Qualified (Outstanding Performance and Potential) RA CMF 37 SFCs:
(1) Leadership: Have 36 months or more accumulative successful service as a PO SFC, with a consistently strong pattern of quantifiable “far exceeded” NCOER ratings by their raters and a consistent pattern of Senior Rater comments which clearly state strong potential to serve at the next higher grade.
(2) Assignments:
(a) 18 months or more of rated time in a 37F4 Key and Developmental position and 12 months or more rated time in a Nominative / Special Assignment, MOS Enhancing, or MOS Broadening position.
(b) Special consideration should be given to those SFCs who meet the criteria, selected for, are working, or have successfully served in a 37F5 position.
(c) SFCs who are or have successfully served as a Company First Sergeant should be viewed as exceptional.
(3) Military Education:
(a) Completion of MLC.
(b) Graduate of a Static Line Jumpmaster course.
(b) Completion of three or more advanced skill / functional courses, see Appendix A.
(c) Special consideration should be given to those SFCs who have successfully completed the SPT training pathway and been awarded the S5J PDSI.
(d) Special consideration should be given to those SFCs who are consistently selected as the Distinguished Honor Graduate, Honor Graduate, Top 20% Commandant’s List, or other honors during NCOPDS or MOS enhancing courses.
(4) Language Proficiency:
(a) RA CMF 37 SFCs must have a current (within 12 months) DLPT or OPI on file in their CLANG. See Army Regulation 11-6 for further guidance.
(b) A FLPR of 1+ / 1+ should be viewed as most qualifying.
(c) A FLPR of 2 / 2 or higher should be viewed as exceptional.
(5) Civilian Education:
(a) Attained 90 or more credit hours towards a bachelor’s degree, or multiple civilian technical skills certifications.
(b) Completion of a bachelor’s, graduate, or post-graduate degree should be viewed as exceptional.
(6) Physical Fitness: Consistent ACFT scores of 540 or better, effective 1 October 2022 (APFT scores of 270 or better (90 points in each event), prior to 1 October 2022), and meet height/weight requirements IAW AR 600-9.', '0452568cdbe1bdb6af060c58c35021e5f97e5ff5724f80bf10dcd85b9cccfc6a', 13, 15, '13', 11, null, null, false, null),
  ('24c023e1-c7b9-5d5b-a119-3d27a27e3317', '26844b13-f58b-5d0d-8f65-0a83b3ead7c1', 'Army', 'enlisted', '37F', null, 'assignments', 'E-8', null, 'Master Sergeant / First Sergeant (MSG / 1SG) (Skill level 5) — Assignment / Position Categories', 'Chapter 4. Military Occupational Specialty 37F (PO Specialist)', '(1) Key and Developmental: Detachment Sergeant in a PO Detachment; 1SG in a PO Company. RA MSG / 1SGs in Airborne units must be able to maintain airborne status unless not required by position.
(2) Nominative / Special: Senior Career Field Manager (Proponent); Senior Branch Manager (HRC); POAS NCOIC; Headquarters Support Company (HSC) / Headquarters and Headquarters Company (HHC) 1SG at a POB, POG or USAJFKSWCS.
(3) MOS Enhancing: Senior Instructor / Writer; Senior Doctrine Writer; Senior Training Developer; G3 / S3X NCO; SPT; TIS or OSW MSG; SMU / Special Activities; PO staff NCO at GRP and higher echelon HQs; Senior PO Sergeant.
(4) MOS Broadening: Senior Observer Controller at JRTC / NTC / JRMC; SARC; EOA; Inspector General (IG).', '897ab2e97b3c7984fe211350cfa64ff51f93def79c6994a52a6d3dcc8caf863f', 15, 15, '15', 12, null, null, false, null),
  ('1c193618-bb99-561a-aa5c-3fb3ffce57ed', '26844b13-f58b-5d0d-8f65-0a83b3ead7c1', 'Army', 'enlisted', '37F', null, 'promotion_criteria', 'E-8', null, 'Master Sergeant / First Sergeant (MSG / 1SG) (Skill level 5) — promotion consideration', 'Chapter 4. Military Occupational Specialty 37F (PO Specialist)', 'b. Unqualified (Unsatisfactory Performance and No Potential for Continued Service) RA CMF 37 MSG / 1SGs. The following must have occurred within the current grade and the 18 months prior to the most current evaluation board:
(1) Leadership: Received a GOMAR or conviction by court-martial in current grade or received a Bar to continued service IAW AR 601-28.
(2) Received a NCOER in current grade with any of the following:
(a) Relief for Cause.
(b) Annotation of “Did Not Meet Standard” in Part IV (Performance Evaluation, Professionalism, Attributes, and Competencies), block c (Character)
(c) Annotation of “Not Qualified” in Part V (Senior Rater Overall Potential), block a (Rated Noncommissioned Officer’s Potential)
(3) Assignments: Declines to serve on a PO unit of action, directed assignment, or is unable to meet assignment requirements due to loss of security clearance, flags, or adverse actions.
(4) Military Education: Refuses to complete DLC, PME and / or consistently fails to meet the prerequisites to attend PME or advance skill courses.
(5) Language Proficiency: Fail to maintain a current (within 12 months) DLPT or OPI on file in their CLANG. See Army Regulation 11-6 for further guidance.
(6) Physical Fitness: Fail to score 360 points with a minimum of 60 points in each event on the ACFT, effective 1 October 2022, and / or fails to meet height/weight requirements IAW AR 600-9.
c. Fully Qualified (Average Performance and Potential) RA CMF 37 MSG / 1SGs:
(1) Leadership: Have 12 months or more accumulative successful service as a PO MSG.
(2) Assignments: 24 months or more of rated time in a 37F5 position.
(3) Military Education: Completion of MLC.
(4) Language Proficiency: RA CMF 37 MSG / 1SGs must have a current (within 12 months) DLPT or OPI on file in their CLANG. See Army Regulation 11-6 for further guidance.
(5) Physical Fitness: Consistent ACFT scores of 360 or better, effective 1 October 2022 (APFT scores of 180 or better (60 points in each event), prior to 1 October 2022), and meet height/weight requirements IAW AR 600-9.
d. Highly Qualified (Above Average Performance and Potential) RA CMF 37 MSG / 1SGs:
(1) Leadership: Is currently serving as a 1SG or has successfully served 12 months or more as a 1SG, with Strong evaluations regarding potential with supporting enumeration.
(2) Assignments:
(a) 12 months or more of rated time in a 37F5 Key and Developmental position.
(b) Special consideration should be given to those MSG / 1SG who are serving in or have successfully served in a nominative assignment.
(3) Military Education:
(a) Completion of DLC 5.
(b) Graduate of a Static Line Jumpmaster course.
(c) Completion of three or more advanced skill / functional courses, see Appendix A.
(4) Language Proficiency:
(a) RA CMF 37 MSG / 1SGs must have a current (within 12 months) DLPT or OPI on file in their CLANG. See Army Regulation 11-6 for further guidance.
(b) A FLPR of 1 / 1 should be viewed as highly qualified.
(5) Civilian Education: Attained 90 or more credit hours towards a bachelor’s degree, or a civilian technical skills certification.
(6) Physical Fitness: Consistent ACFT scores of 480 or better, effective 1 October 2022 (APFT scores of 240 or better (80 points in each event), prior to 1 October 2022), and meet height/weight requirements IAW AR 600-9.
e. Most Qualified (Outstanding Performance and Potential) RA CMF 37 MSG / 1SGs:
(1) Leadership: Have 36 months or more as a 1SG of a PO Company, special consideration should be given to MSG / 1SGs who have successful service as an HSC / HHC 1SG, with a consistently strong pattern of quantifiable “far exceeded” NCOER ratings by their raters and a consistent pattern of Senior Rater comments which clearly state strong potential to serve at the next higher grade.
(2) Assignments:
(a) 18 months or more of rated time in a 37F5 Key and Developmental position and have 12 months or more time in a 37F5 Nominative / Special Assignment, MOS Enhancing or MOS Broadening position.
(b) Special consideration should be given to those MSG / 1SG who are serving in or have successfully served in a nominative assignment.
(c) Special consideration should be given to those MSG / 1SGs who are or have successfully served as a Sergeant Major or those working in a 37F6 position.
(3) Military Education:
(a) Completion of SMC or JSOFSEA.
(b) Graduate of a Static Line Jumpmaster course.
(c) Completion of four or more advanced skill / functional courses, see Appendix A.
(d) Special consideration should be given to those MSG / 1SGs who are consistently selected as the Distinguished Honor Graduate, Honor Graduate, Top 20% Commandant’s List, or other honors during NCOPDS or MOS enhancing courses.
(4) Language Proficiency:
(a) RA CMF 37 MSG / 1SGs must have a current (within 12 months) DLPT or OPI on file in their CLANG. See Army Regulation 11-6 for further guidance.
(b) A FLPR of 1+ / 1+ should be viewed as most qualifying.
(c) A FLPR of 2 / 2 or higher should be viewed as exceptional.
(5) Civilian Education:
(a) Completion of a bachelor’s degree or attained 30 or more credit hours towards a graduate degree, or multiple civilian technical skills certifications.
(b) Completion of a graduate or post-graduate degree should be viewed as exceptional.
(6) Physical Fitness: Consistent ACFT scores of 540 or better, effective 1 October 2022 (APFT scores of 270 or better (90 points in each event), prior to 1 October 2022), and meet height/weight requirements IAW AR 600-9.', '1ca7c8c2a9bf07e3fe5873a000e7dfee2aa4bf50c989ff437e351b9d3e874579', 15, 17, '15', 13, null, null, false, null),
  ('aca2114a-627f-52c6-a5c7-60aeccd20297', '26844b13-f58b-5d0d-8f65-0a83b3ead7c1', 'Army', 'enlisted', '37F', null, 'assignments', 'E-9', null, 'Sergeant Major (SGM) (Skill level 6) — Assignment / Position Categories', 'Chapter 4. Military Occupational Specialty 37F (PO Specialist)', '(1) Key and Developmental: PO Battalion S3 Operations SGM; PO Group S3 Operations SGM. RA SGMs in Airborne units must be able to maintain airborne status unless not required by position.
(2) Nominative / Special: PO Proponent SGM; Special Duty and Nominative Senior Executive Service / General Officer Assignments.
(3) MOS Enhancing: Division Operations SGM; ASCC Operations SGM; 1st SFC G33; 1st SFC G39 SGM; 1st SFC G8 SGM; USASOC G33 SGM; USASOC G35 SGM; USASOC G39 SGM.
(4) MOS Broadening: Nominative SGM assignments to DDSO on the Joint Staff; USSOCOM; all TSOCs; National Assessment Group; DTRA; NATO SOF; 1st SFC; USAJFKWCS; Sergeants Major Academy Instructor; JSOFSEA instructor.', 'aebfd5bf52a428e6d035c825608fb885ef9264ccfa0354c57567b8b09d052bca', 17, 17, '17', 14, null, null, false, null),
  ('35070336-0d02-5a08-87e9-a842ce2dcd03', '26844b13-f58b-5d0d-8f65-0a83b3ead7c1', 'Army', 'enlisted', '37F', null, 'promotion_criteria', 'E-9', null, 'Sergeant Major (SGM) (Skill level 6) — promotion consideration', 'Chapter 4. Military Occupational Specialty 37F (PO Specialist)', 'b. Unqualified (Unsatisfactory Performance and No Potential for Continued Service) RA CMF 37 SGMs. The following must have occurred within the current grade and the 18 months prior to the most current evaluation board:
(1) Leadership: Received a GOMAR or conviction by court-martial in current grade or received a Bar to continued service IAW AR 601-28.
(2) Received a NCOER in current grade with any of the following:
(a) Relief for Cause.
(b) Annotation of “Did Not Meet Standard” in Part IV (Performance Evaluation, Professionalism, Attributes, and Competencies), block c (Character)
(c) Annotation of “Not Qualified” in Part V (Senior Rater Overall Potential), block a (Rated Noncommissioned Officer’s Potential)
(2) Assignments: Declines to serve on a PO unit of action, directed assignment, or is unable to meet assignment requirements due to loss of security clearance, flags, or adverse actions.
(3) Military Education: Refuses to complete DLC, PME, and / or consistently fails to meet the prerequisites to attend PME or advance skill courses.
(4) Physical Fitness: Fail to score 360 points with a minimum of 60 points in each event on the ACFT, effective 1 October 2022 (fail to score 180 points with 60 points in each event on the APFT, prior to 1 October 2022) and / or fails to meet height / weight requirements IAW AR 600-9.
c. Fully Qualified (Average Performance and Potential) RA CMF 37 SGMs:
(1) Leadership: Have 12 months or more accumulative successful service as an SGM.
(2) Assignments: 12 months or more of rated time in a 37F6 position.
(3) Military Education:
(a) Completion of SMC or JSOFSEA
(b) Graduate of Static Line Jumpmaster course.
(4) Language Proficiency: Special consideration should be given to those SGMs who have a current DLPT or OPI on file in their CLANG. See Army Regulation 11-6 for further guidance.
(5) Physical Fitness: Consistent ACFT scores of 360 or better, effective 1 October 2022 (APFT scores of 180 or better (60 points in each event), prior to 1 October 2022), and meet height/weight requirements IAW AR 600-9.
d. Highly Qualified (Above Average Performance and Potential) RA CMF 37 SGMs:
(1) Leadership: Have 24 months or more as an SGM, with strong evaluations regarding potential with supporting enumeration.
(2) Assignments:
(a) 12 months or more of rated time in a 37F6 Key and Developmental position (PO Battalion S3 Operations SGM or PO Group S3 Operations SGM) and should have 12 months or more in 37F6 Nominative / Special Assignment, MOS Enhancing or MOS Broadening position.
(b) Special consideration should be given to those SGMs who meet the criteria, are selected for, are, or have successfully served as a Command Sergeant Major with exceptional evaluations.
(3) Military Education:
(a) Completion of DLC 6.
(b) Graduate of a Static Line Jumpmaster course.
(c) Completion of four or more advanced skill / functional courses, see Appendix A.
(4) Language Proficiency:
(a) Special consideration should be given to those SGMs who have a current DLPT or OPI on file in their CLANG.
(b) A FLPR of 1 / 1 or higher should be viewed as highly qualifying.
(5) Civilian Education: Completion of a bachelor’s degree or attained 30 or more credit hours towards a graduate degree, or a civilian technical skills certification.
(6) Physical Fitness: Consistent ACFT scores of 480 or better, effective 1 October 2022 (APFT scores of 240 or better (80 points in each event), prior to 1 October 2022), and meet height/weight requirements IAW AR 600-9.
d. Most Qualified (Outstanding Performance and Potential) RA CMF 37 SGMs:
(1) Leadership: Have 36 months or more of accumulative service as a SGM, with a consistently strong pattern of quantifiable “far exceeded” NCOER ratings by their raters and a consistent pattern of Senior Rater comments which clearly state strong potential to serve at the next higher grade.
(2) Assignments:
(a) 24 months or more of rated time in a 37F6 Key and Developmental position (PO Battalion S3 Operations SGM or PO Group S3 Operations SGM) and have 12 months or more in 37F6 Nominative / Special Assignments, MOS Enhancing or MOS Broadening position.
(b) Special consideration should be given to those SGMs who meet the criteria, are selected for, are, or have successfully served as a Command Sergeant Major with exceptional evaluations.
(3) Military Education:
(a) Completion of NLC.
(b) Graduate of a Static Line Jumpmaster course and SERE-C
(c) Completion of five or more advanced skill / functional courses, see Appendix A.
(d) Special consideration should be given to those SGMs, who have been selected for, or have attended SMAP
(e) Special consideration should be given to those SGMs who are consistently selected as the Distinguished Honor Graduate, Honor Graduate, Top 20% Commandant’s List, or other honors during NCOPDS or MOS enhancing courses.
(4) Language Proficiency:
(a) Special consideration should be given to those SGMs who have a current DLPT or OPI on file in their CLANG.
(b) A FLPR of 1+ /1+ or higher should be viewed as most qualifying.
(c) A FLPR of 2 / 2 or higher should be viewed as exceptional.
(5) Civilian Education:
(a) Completion of a graduate degree or attained 48 or more credit hours towards a post- graduate degree, or multiple civilian technical skills certifications.
(b) Completion of a post-graduate degree should be viewed as exceptional.
(6) Physical Fitness: Consistent ACFT scores of 540 or better, effective 1 October 2022 (APFT scores of 270 or better (90 points in each event), prior to 1 October 2022), and meet height/weight requirements IAW AR 600-9.
9. Command Sergeant Major (CSM) (Skill level 6)
a. Assignment / Position Categories:
(1) Key Developmental: PO Battalion CSM; PO Group CSM. RA CSMs in Airborne units must be able to maintain airborne status unless not required by position.
(2) Nominative: Special Duty and Nominative Senior Executive Service / General Officer assignments.
(3) MOS Enhancing: Battalion Level CSM; Group Level CSM.
(4) MOS Broadening: Garrison CSM.
b. RA CMF 37 CSMs
(1) Leadership: Have 12 months or more accumulative successful service as a PO CSM.
(2) Assignments: 12 months or more of rated time in a 37F6 Key and Developmental position and have 12 months or more in a 37F6 Nominative / Special Assignment, MOS Enhancing or MOS Broadening position.
(3) Military Education:
(a) Completion of DLC 6, NLC, and Keystone courses as required.
(b) Graduate of Static Line Jumpmaster course.
(4) Physical Fitness: Consistent ACFT scores of 360 or better, effective 1 October 2022 (APFT scores of 180 or better (60 points in each event), prior to 1 October 2022), and meet height/weight requirements IAW AR 600-9.', 'dee3e41e6d84983fd48ed0a596611a8e7f1c12cf3e3f71ba7623f87b7a98e305', 17, 20, '17', 15, null, null, false, null);
commit;
