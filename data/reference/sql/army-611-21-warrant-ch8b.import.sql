-- Import: army-611-21-warrant-ch8b
-- 286 passages from DA PAM 611-21: Military Occupational Classification and Structure — warrant officer MOS specifications (chapter 8b)
-- Imported as review_status='unreviewed'; it is NOT served to users until approved.
begin;
insert into public.reference_sources
  (id, branch, personnel_category, publication_number, title, chapter, career_field, proponent, official_url,
   publication_date, effective_date, last_checked_at, checksum_sha256, ingestion_status, review_status, notes, extraction_tool, import_batch, content_sha256)
values ('3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', 'DA PAM 611-21', 'Military Occupational Classification and Structure — warrant officer MOS specifications (chapter 8b)', 'Chapter 8b', 'All Army warrant officer MOS', 'Military Personnel Structure & Plans Division (DAPE-PRP), HQDA ODCS G-1', 'https://api.army.mil/e2/c/downloads/2025/12/04/720183c2/chapter-8b-wo-specifications.pdf',
   '2025-11-01', null, '2026-10-16T00:00:00Z', '80d150f0ff150d248d22118285a7dc2744136b7b0ae535d798ec1d67b59fbb65', 'extracted', 'unreviewed', 'Date basis: the DA PAM 611-21 (Smartbook) cover reads "End of Fiscal Year 2025 … November 2025"; no day is stated, so the 1st is used. The chapter was posted on api.army.mil on 2025-12-04. Individual specifications carry their own effective dates (e.g. "Effective 202610"); those are stored per passage, not per source. Duties are stored by grade band (WO1/CW2, CW3, CW4, CW5). Warrant officer grades are stored as W-1..W-5. Shared specifications (e.g. the aviator families) are stored once per code that the specification names. LIMITATIONS: licensing, prerequisites, qualifications, SQI/ASI and grading items are skipped as requirements. The structure chart (ch. 8a, dated November 2024) lags the specifications: 280A, 390A and 490B appear only in ch. 8b.', 'pdf-parse 2.4.5', 'army-611-21-warrant-ch8b@2026-10-16', '69ef6b5aab4f98b2974a6c72985cb1f997ec9a074fd2c1c11b7c44a50434ec92')
on conflict (id) do update set
  publication_number = excluded.publication_number, title = excluded.title, career_field = excluded.career_field, proponent = excluded.proponent,
  official_url = excluded.official_url, publication_date = excluded.publication_date, last_checked_at = excluded.last_checked_at,
  checksum_sha256 = excluded.checksum_sha256, ingestion_status = 'extracted', notes = excluded.notes,
  extraction_tool = excluded.extraction_tool, import_batch = excluded.import_batch,
  branch = excluded.branch, personnel_category = excluded.personnel_category,
  chapter = excluded.chapter, effective_date = excluded.effective_date,
  content_sha256 = excluded.content_sha256,
  review_status = 'unreviewed', reviewed_by = null, reviewed_at = null;
delete from public.reference_passages where source_id = '3021ff69-4dd8-5576-afdb-49874e1d8e20';
insert into public.reference_passages
  (id, source_id, branch, personnel_category, occupation_code, occupation_title, section_type, rank_band, components, heading, chapter, body, body_sha256, pdf_page_start, pdf_page_end, printed_page, sort_order, effective_from, effective_to, cumulative, skill_level)
values
  ('01bf6cb0-272c-5bd0-a43f-d77eed1bfdbc', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '120A', 'CONSTRUCTION ENGINEERING TECHNICIAN', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1–CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Serves as the Commander’s primary advisor on construction operations at company and/or battalion levels.
(b) Supervises and coordinates construction of base camps and internment facilities in support of engineer construction operations.
(c) Supervises the construction, repair, and maintenance of vertical infrastructure in engineer construction operations.
(d) Supervises and ensures proper preparation of a bill of materials, schedules of work and ensures employment of proper safety procedures.
(e) Devises network flow diagrams such as the critical path method and coordinates work activities of supporting units.
(f) Provide supervision over all structural and utility construction projects. Inspect subordinate elements to ensure compliance with directives, construction drawings, specifications, local codes and ordnances.
(g) Serves as the Commander’s primary advisor in company level prime power operations.
(h) Provides advice and technical assistance on all aspects of electrical power and distribution in support of military operations.
(i) Supervises and manages separate teams in the performance of prime power operations during disaster relief as a support element of FEMA and USACE and in theater level operations.
(j) Serves as Survey & Design Detachment Commander and primary advisor on planning, preparation and execution of planning studies and tests for identified engineer work projects. Addresses facility citing environmental concerns and estimated project costs.
(k) Serves as Firefighting Headquarters Detachment Commander.', 'b5582ecccf83195759dde4c15bb806a1136f28a7e71820689ba8895823b7eb46', 9, 10, null, 0, null, null, false, null),
  ('9e679388-9cde-591b-b76e-8bc92c4aa5ca', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '120A', 'CONSTRUCTION ENGINEERING TECHNICIAN', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Serves as the Battalion Maintenance Officer and Facilities Engineer in support of Combat Support Hospital operations in non-operational and operational environments.
(b) Primary advisor to the Commander and Staff on organizational maintenance support of all equipment.
(c) Provides engineering support and expertise on Deployable Medical Systems (DEPMEDS), utilizing organic equipment such as power generation equipment, environment control systems, water, waste, fuel and electrical distribution systems.
(d) Coordinates and supervises the installation and repair of water supply systems, plumbing, sewage, heating and air conditioning systems.
(e) Serves as a Engineer Brigade Survey & Design Team staff officer and primary advisor on planning, preparation and execution of planning studies and tests for identified engineer work projects.
(f) Addresses facility citing environmental concerns and estimated project costs.
(g) Serves additionally as Service School Instructor / Writers in the revision of training strategies, doctrine revisions, and formal engineering instruction to officers, warrant officers and NCOs as an element of the United States Army Engineer School staff.', '4d922ca1a9a2a136238abf32fd4cfe3787cc061632ef8084fa7c99f4f8de72ca', 10, 10, null, 1, null, null, false, null),
  ('1b04a1a9-b5dc-5f59-b7fd-d49f740c6f1a', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '120A', 'CONSTRUCTION ENGINEERING TECHNICIAN', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Serves as a member of the Engineer Staff in operational and non-operational MEBs, Division and Corps units.
(b) Serves as the Commander’s primary advisor on all aspects of construction operations, to include supervision of vertical and horizontal infrastructure and facilities management.
(c) Coordinates directly with DPW in construction project preparation, oversight and the phased components of inspection for compliance with directives, construction drawings, specifications, local codes and ordnances.
(d) Serves as a member of the Installation Master Planning committee and monitors MILCON project funding. Serves as the Prime Power Battalion Staff Officer and primary subject matter expert on electrical power generation and distribution in support of global military operations.
(e) Serves as Service School Instructor / Writers in the revision of training strategies, doctrine revisions, and formal engineering instruction to officers, warrant officers and NCOs as an element of the United States Army Engineer School staff.
(f) Serves additionally in the MOS immaterial positions of Proponency Coordinator and Warrant Officer Career Branch Manager.', '5da5011d0d936ea4f415dbb21f5a6132bcf9bb4ac86cf68b6627d2bae1c6bd13', 10, 10, null, 2, null, null, false, null),
  ('5f085d9f-76c3-531f-aef4-01da70da4e75', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '120A', 'CONSTRUCTION ENGINEERING TECHNICIAN', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Serves as the Construction Engineering expert and tactical and technical advisor to the commander, staff and major subordinate commanders in the United States Army Engineer School (USAES), United States Army Corps of Engineers and Army Service Component Command.
(b) Serves as the senior strategic advisor to the USAES Commandant in the capstone nominative assignment of Regimental Chief Warrant Officer.
(c) Serves as the Prime Power School Commander and primary advisor on the education and production of the US Army Prime Power Specialist.
(d) Serves additionally in the MOS immaterial position of Senior Warrant Officer Advisor for the Combined Arms Center at Fort Leavenworth.', 'caa6ac67b39e43afc8c9b1295ccc2a4a2ed71fac271e1895113d3603173e4019', 10, 10, null, 3, null, null, false, null),
  ('1c5db90e-db53-5a74-aef2-758111216270', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '125D', 'GEOSPATIAL ENGINEERING TECHNICIAN', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Directs Geospatial Engineering Operations in support of Unified Land Operations (ULO).
(b) Identifies gaps in geospatial information coverage. Coordinates with collection, production, and dissemination entities to obtain and verify Area of Interest (AoI) source data, ensuring it satisfies geospatial mission requirements for the generation of Essential Elements of Geospatial Information (EEGI).
(c) Projects Standard Sharable Geospatial Foundation (SSGF) requirements in support of ULO.
(d) Manages Geospatial Engineering Architecture operations and its connections on standalone, tactical, and classified networks to disseminate geospatial information content and services into Army GEOINT System of Records (AGSOR).
(e) Serves as advisor to the Command and Staff on geospatial engineering operations, training, policies, capabilities, and procedures in DOTLMPF formats.
(f) Integrates geospatial data and products into the execution of the Military Decision Making Process (MDMP) for ULO War-fighting Functions (WFF).
(g) Analyzes and delivers geospatial information, to include the effects of weather, to Commanders and their staff on ULO and training operations.
(h) Performs Geospatial Database Management operations on SSGF data to support ULO within Brigade Combat Team (BCT), Division, Corps, Army and Joint commands and Tactical Operations Center (TOC) / Tactical Command Post (TAC).
(i) Performs geospatial operations supporting the execution of the MDMP and Intelligence Preparation of the Battlefield (IPB) process at BCT, Division, Corps, Army and Joint command’s Tactical Operations Center (TOC) / Joint Operations Center (JOC).
(j) Develops tactical and operational Geospatial Information and Services (GI&S) to the commander, staff and major subordinate commanders, providing guidance and advice on the use of geospatial engineering within Unified Land Operations.
(k) Employs Open Source Intelligence (OSINT), emerging technologies, and integrates geospatial-automated processes in support of Geospatial Engineering and Geospatial-Intelligence operations.
(l) Creates and manages geodetic data of an Area of Responsibility (AOR) verified from certified surveyors, satellite observations, global navigation satellite systems (GNSS), light detection and ranging (LIDAR), or related sources.
(m) Analyze geodetic control or surveyed data in adherence to precision and accuracy specifications in support of civil and military operations.
(n) Delivers quality Geospatial Information and Services (GI&S) SSGF data, products, and knowledge over commercial, tactical and classified networks to Mission Command systems, Common Operating Pictures, and approved customers operating within the Commander’s AOR.
(o) Plans Geospatial Engineering operations with consideration to applicable laws, policies, and treaties with National Systems for Geospatial Intelligence (NSG) and U.S. Army geospatial engineer elements operating within the Combatant Command’s (COCOM) AOR.
(p) Develops geospatial Operations Orders (OPORD), fragmentation orders (FRAGO), or Appendixes as seen in Appendix 7 of Annex B to a given Operations Order or Contingency Plan to communicate authorities.
(q) Generates and disseminates highly accurate and precise standard and non-standard cartographic products within NSG and U.S. Army cartographic standards for tactical and operational ground and air missions.
(r) Provides geospatial training assessment and feedback on geospatial operations using formal and informal AARs.
(s) Performs duties as the geospatial system integrator on military and civilian networks to provide GI&S.
(t) May serve as the GEOINT Section OIC at any echelon.', 'd359b9cbc530c168add4a57ee73a0a4bf53a564422df2a92898d45e79d82049c', 12, 13, null, 4, null, null, false, null),
  ('ce690b00-ae63-5c66-82da-a0b494107f79', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '125D', 'GEOSPATIAL ENGINEERING TECHNICIAN', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Directs, plans, and performs duties shown in paragraph g(1).
(b) Serves as the principal advisor to senior staff members, decisions, and policy makers on Mission Command operations, training, policies, and procedures.
(c) Modifies geospatial GI&S web content in support of military and civil operations
(d) Manages a Relational Database Management System (RDBMS) in support of multi-user edits of SSGF data and geospatial services within commander’s AOR.
(e) Designs and develops a geospatial Knowledge Management system with use of metadata formats and standards from the NSG and U.S. Corps of Engineers.
(f) Performs advanced remote sensing techniques to support EEGI extraction tasks.
(g) Integrates Geospatial Engineering operations, SSGF data, and products into Joint, Interagency, Intergovernmental, and Multinational geospatial partner operations.
(h) Advise commanders and their staff on Geospatial Information and Intelligence effects on Unified Land Operations and the gamut of WFF.
(i) Coordinates the acquisition of Geospatial Foundation Data for mission specifications from supported units, civilian and governmental agencies (foreign and domestic).
(j) Develops Tactics, Techniques, and Procedures (TTP)s or Standard Operating Procedures for GEOINT and/or Geospatial Engineering production, operations, and personnel work roles.
(k) May serve as a Doctrine Writer or Capabilities Developer.
(l) May serve as Geospatial Engineer and GEOINT Observer-Controller and Trainer to observe units and their Battle Staffs during training exercises on Army and Joint Training Centers.
(m) May serve as a Detachment Commander.
(n) May serve as an instructor at the Warrant Officer Career College and US Army Engineer School (USAES).
(o) May serve on the Joint or Combined Staff.', '7cc68462a2fec46ba749134fcbb0fb37f1d72273eda25ffc79ff8a72b144bef1', 13, 14, null, 5, null, null, false, null),
  ('24ff8bb9-2250-58a3-ab06-d9c5e9dc2a61', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '125D', 'GEOSPATIAL ENGINEERING TECHNICIAN', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Manages, directs, plans, and performs duties shown in paragraph g(2).
(b) Serves as the principal advisor to senior staff members, decision, and policy makers on GEOINT and Geospatial Engineering operations, training, policies, and procedures.
(c) Consolidates geospatial requirements from Army Service Component Command (ASCC) staffs for the submission of an annual priority list to the National Geospatial-Intelligence Agency (NGA) for production to meet ongoing and future operations.
(d) Submits ASCC geospatial requirements to the COCOM GI&S Officer for production.
(e) Provides senior leadership with assessments and counsel on DOTMLPF geospatial engineering gaps for an informed decision.
(f) Serves as the primary operator to manage the theater geospatial enterprise system and service, integrating emerging technologies and capabilities into unit geospatial processes/workflows.
(g) May serve as a Writer / Instructor at USAES.
(h) May serve on the Joint or Combined Staff.
(i) May serve as HRC EN WO Assignments Manager.
(j) May serve as USAES EN WO Proponent Coordinator.', '0b5f3c7b8fbe95329b52e2ba6f32b2c3ce0afff1497b6fd6e39c5c48c58f055c', 14, 14, null, 6, null, null, false, null),
  ('2f469446-f381-5cd2-97eb-c87ca6e274f3', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '125D', 'GEOSPATIAL ENGINEERING TECHNICIAN', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties shown in paragraph g(3).
(b)Delivers master-level technical and tactical expertise on the primary duties of technical leader, manager, multidiscipline geospatial integrator, and advisor.
(c) Provide direction, guidance, resources, assistance, and supervision necessary for subordinates to perform their duties.
(d) Support commanders with the development of new geospatial engineer doctrine, organizational structure, methods and equipment to be utilized in the geospatial engineer field.
(e) Provide leader development, talent and lifecycle management, mentorship, advice, and counsel to enlisted Soldiers, warrant officers, and branch officers.
(f) Possess special leadership abilities that interprets the commander’s intent and mission to support ULO, representing and advising on the responsibilities of geospatial operators within their respective AOR.
(g) Primarily support division, corps, echelons above corps, major command, Joint, Interagency, Intergovernmental, and Multinational operations.
(h) Advise commanders and Engineer Branch Corps Chief Warrant Officer (CCWO) on the assignments and placement of Geospatial Engineering warrant officers worldwide.
(i) Provide essential advice to commanders on warrant officer issues and perform other officer level duties as required consistent with senior staff officer responsibilities.
(j) May serve as the Senior WO advisor in MOS immaterial (011A) billets based on technical knowledge and understanding of Army and Joint doctrine.
(k) May serve on the Army Staff.
(l) May serve on the Corps of Engineers Staff.
(m) May serve as a Capabilities Branch Chief.
(n) May serve as the RCWO of the EN Branch.
(o) Senior Field Grade Warrant Officers must have completed the WO Senior Service Education Course prior to nomination for specified CW5 billets.', 'd3dfa6ca4c27c31f0ff80b9c1d66836d07ab07f668a4592f1aef5c14d34facc8', 14, 15, null, 7, null, null, false, null),
  ('6b15c647-67bf-54d6-bb58-c069ddc065a8', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '131A', 'TARGETING TECHNICIAN', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', 'As a Target Acquisition Platoon Leader, Field Artillery Intelligence Officer and/or Targeting officer:
(a) Plans, organizes, implements, monitors, and evaluates operations, threat environment, and unit maintenance of field artillery radar systems.
(b) Provides advice on technical and tactical employment of field artillery radar systems.
(c) Instructs personnel on radar operations and tactical employment of radar systems.
(d) Performs reconnaissance and selection of site for emplacement of the radar.
(e) Assists the S2 and the brigade FSO by performing target value analysis duties.
(f) Assists in formulating attack guidance used in the brigade and Direct Support (DS) battalion Command Post (CP) and recommends changes to attack guidance.
(g) Advise the brigade S2 regarding specific requirements for target location accuracy and the duration that targets may be considered viable for attack.
(h) Assists in producing target selection standards for the brigade.
(i) Serve as assistant counter fire officer.
(j) Develops pattern analysis of enemy artillery for deliberate targeting purposes.
(k) Assists the Brigade Combat Team (BCT) S-2 is tying the weapons location radars to the information collection plan (ICP).
(l) Serves as the fires representative in the BCT S-2 section to conduct reverse IPB during mission analysis.', '411ccd55e66bded21aefd30361357e1dd7f93fc70d006762ae1effe961e4d169', 16, 17, null, 8, '2024-10-01', null, false, null),
  ('72c810eb-7da0-5662-9949-fc257fecc0b8', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '131A', 'TARGETING TECHNICIAN', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', 'As a Field Artillery Intelligence Officer and Targeting Officer:
(a) Performs duties described in paragraph g (1).
(b) Evaluates the technical and tactical operations of field artillery radar sections.
(c) Recommends target purging criteria to the S3 at Field Artillery Brigade (FAB) and Division Artillery (DIVARTY) level.
(d) Monitors the processing of target requests and reviews battle damage assessment at FAB and DIVARTY level.
(e) Recommends the employment and directs the operation of available TA assets at FAB and DIVARTY level.
(f) Monitors the development of the enemy artillery order of battle (OB) and the processing of target information and intelligence generated by the OB section at FAB and DIV level.
(g) Assists in production and application of target selection standards.
(h) Requests targeting information from military intelligence and higher sources and evaluates information obtained through the IPB process.
(i) Selects and expedites critical target information to the fire support systems.
(j) Develops a targeting process conducive with BCT operations.
(k) Assist the BCT FSO in production and application of attack guidance matrix, target selection standards, high-payoff target list and target synchronization matrix.
(l) Assists the DIV/CORPS G-2 with target value/system analysis.
(m) Contributes to the information collection plan to identify High-Payoff Targets (HPT) at the DIV/CORPS level.', 'ebf88c1b004942c2c65863307717870dd2bbfc9919722ae3be7d0fc20773ce50', 17, 17, null, 9, '2024-10-01', null, true, null),
  ('6c250bdc-ee0a-5893-b7f9-d99660a80273', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '131A', 'TARGETING TECHNICIAN', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', 'As a Targeting Officer and Field Artillery Intelligence Officer:
(a) Performs duties described in paragraph g (2).
(b) Advises the Division CDR and FSCOORD on all matters concerning targeting.
(c) Assists the DIV/CORPS G-2 in developing an ICP based on targeting priorities.
(d) Monitors the development of the enemy artillery OB and the processing of target information and intelligence generated by the OB section at Division and Corps level.
(e) Assists in production and application of target selection standards at Division and Corps level.
(f) Requests targeting information from military intelligence and higher sources and evaluates information obtained through the IPB process at Division and Corps level.', '5e4f28a700b5fdeb16d9d2afb17f7498a1fc78073c3d95c5f7535f3b9052b13e', 17, 17, null, 10, '2024-10-01', null, true, null),
  ('e67f4553-73c0-57a1-b71c-80b13391b884', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '131A', 'TARGETING TECHNICIAN', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g (3).
(b) Advises the Corps Commander on all matters pertaining to targeting and employment of all target acquisition assets.
(c) Performs all targeting duties as described in (3) above at a level appropriate and necessary for the most senior Targeting Technician in the Corps.
(d) Advises the Commandant at the Field Artillery School on all matters pertaining to targeting, and worldwide Targeting Technician personnel status.
(e) Monitors threat situation, keeps deputy FSCOORD informed, and recommends changes to priorities and attack means at Corps level.
(f) Coordinates between the CTOCSE and the Tactical Control and Analysis Element (TCAE) to ensure potential targets are recognized and passed expeditiously to the fire support cell.
(g) Provides detailed information regarding accuracy requirements and how old information can be before it is no longer of used to the fire support system.
(h) Ensures attack managers understand how important identification of the target is and when such identification is critical to the targeting effort.
(i) Analyzes and recommends changes to commanders targeting and attack guidance and coordinates target acquisition assets for the Corps.', '5648b37074238b4e1e9cc2140d03bfddbc2e1398411bfc37d1f4a67c1225e551', 17, 18, null, 11, '2024-10-01', null, true, null),
  ('8e57d381-f6c5-59f4-8946-f6a9a63f014a', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '140A', 'AIR AND MISSILE DEFENSE (AMD) SYSTEMS INTEGRATOR', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Technical advisor to the commander on systems employment options and communication link architecture for Army Air Defense Command and Control Systems.
(b) Analyze and interprets technical data employment in the communications network between Army, Marine, Navy, Air Force and Joint Tactical Air Operations (JTAO).
(c) Advises personnel on systems capability and configuration options that are assigned to Command and Control Centers, and when necessary, serves as Tactical Director.
(d) Serves as the primary trainer for all assigned personnel and is charged with coordinating efforts necessary to emplace assets and adapt software which best supports Army Air Defense C2I fighting tactics, using the guidelines of Mission, Enemy, Terrain and weather, Troops and support available, Time available, and Civil considerations (METT-TC).
(e) Advises the commander on available options for task force organization and assets on-hand for reconstitution.
(f) Serves as data link manager, providing link prioritization and standard operation procedures for all link initialization parameters.
(g) Coordinates the activities of support personnel and manages equipment and site assets for the installation, repair (by using BIT/BITE removal and replacement procedures) and integration of the Army Air Defense C2 system ancillary equipment and tools.
(h) Advise, assist and train personnel on specialized test procedures, tools and technical manuals in order to identify, isolate and repair equipment failures and communication outages.
(i) Establishes repair priorities based on fix or fight criteria, reconstitution and availability, or required assets.
(j) Assist in the development of unit Field Standard Operating Procedures (FSOP), Tactical Standard Operating Procedures (TSOP), and internal operating procedures.', '1434bec0c8aabee538080a1b303dc3f17f5ac0aa5117658fd0db5817ec74e293', 19, 20, null, 12, null, null, false, null),
  ('b2e4dc74-901d-5ac9-82b6-3644da63e451', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '140A', 'AIR AND MISSILE DEFENSE (AMD) SYSTEMS INTEGRATOR', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Perform duties as described in paragraph g(1).
(b) Serves as an instructor, writer, training developer and evaluator for MOS related service schools.
(c) Advises the commander at brigade and corps levels on C2 systems capabilities and integration procedures providing the multi-system interface into the joint/combined arena.', 'c3eb323a5f815a567021aef05bc04018438af194f686be34beb76266765e3717', 20, 20, null, 13, null, null, false, null),
  ('b2e10d73-2698-5a9d-9816-5126aac3bc8f', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '140A', 'AIR AND MISSILE DEFENSE (AMD) SYSTEMS INTEGRATOR', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Perform duties described in paragraph g(2).
(b) Interfaces with senior level commanders from all services and gives input for the integration and tactical deployment procedures of the Army''s C2 systems.
(c) Advises the commander at brigade and corps levels on C2 systems capabilities and integration procedures providing the multi-system interface into the joint area.
(d) Provides integration and tactical guidance on Army C2 Air Defense elements while serving as a liaison officer to elements above corps level.
(e) Interfaces with senior weapons procurement officials for future modifications to the Army''s C2 system.
(f) Serves as a combat developer for MOS related service schools.', 'bd890fa4ec23017a555cfcfe5e0f9051e7424f603050e3cdbe83441d40027fbd', 20, 20, null, 14, null, null, true, null),
  ('6cd1a085-32af-59f8-858e-7dbd8faa684c', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '140A', 'AIR AND MISSILE DEFENSE (AMD) SYSTEMS INTEGRATOR', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Perform duties described in paragraph g(3).
(b) Provides leadership, guidance, integration, tactical input and direction to subordinate elements, staff agencies, and field commanders through Theater Army level.
(c) Interfaces with senior level commanders from all services and gives input for the integration and tactical deployment procedures of the Army''s C2 systems.
(d) Interfaces with senior weapons procurement officials for future modifications to the Army''s C2 system.
(e) Advise the Commandant and Assistant Commandant at the Army Air Defense Artillery School on all matters pertaining to ADA warrant officers.', '38a198e1a137dec66b654d42dea22136833285d34afa6ffb9cf3300bff2ed74b', 20, 20, null, 15, null, null, true, null),
  ('e8891adc-a17f-5e8e-95c7-eb393eaae1df', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '140K', 'AIR AND MISSILE DEFENSE (AMD) SYSTEMS TACTICIAN', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Provides leadership and oversees the battery Fire Control crew functions: identification, surveillance, weapon control, integration, and fire control.
(b) Conducts air battle management, and Air Defense operations as battery Fire Control Officer (FCO).
(c) Ensures tracks are properly identified and engaged in accordance with published criteria.
(d) Assesses overall defense effectiveness of assigned assets, and evaluate risk to defended assets.
(e) Communicates with battalion fire control officer.
(f) Monitors engagement operations, and prevent unnecessary multiple engagements.
(g) Advises the commander on readiness aspects of march order, emplacement and capabilities and limitations of the Air Defense weapon systems.
(h) Implements and ensure compliance with proper safety and security procedures applicable to the AMD weapons systems.
(i) Assists platoon leaders in operator/crew training.
(j) Conducts tactical training for crew certifications.
(k) Serves as battery standardization officer.', '6f24e3b46a49e16e452b447fd56d936b0dda02b1a30e3d9762993f644dfcb0ec', 21, 22, null, 16, null, null, false, null),
  ('3f12eb9c-53c4-5ebd-8051-eeaf519b8dd8', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '140K', 'AIR AND MISSILE DEFENSE (AMD) SYSTEMS TACTICIAN', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Perform duties described in paragraph g (1).
(b) Conducts air battle management, and Air Defense operations as battalion fire control officer.
(b) Provide AMD weapons systems peculiar tactical assistance, reporting guidance, and direction to subordinate elements.
(c) Advise the commander or staff officers on AMD weapons systems capabilities and limitations.
(d) Evaluates, trains, and validates unit readiness for the commander.
(e) Coordinates total package fielding and the effects of modifications to the AMD weapons systems and trains new doctrinal concepts.
(f) Serves as an instructor, writer, training developer and evaluator for MOS related service schools.
(g) Serves as the battalion standardization officer.', '5e7eeff1a96141695b0318389529429c0b2b1ae1dd696c33ce22a2e87a092d90', 22, 22, null, 17, null, null, true, null),
  ('c256bb5d-d46b-54bb-a57f-7d667a629d70', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '140K', 'AIR AND MISSILE DEFENSE (AMD) SYSTEMS TACTICIAN', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Perform duties described in paragraph g (2).
(b) Performs duties as ADAFCO at ADA brigade and Army Air and Missile Defense Command (AAMDC) levels.
(c) Serve as Project Manager on New/Improved AMD weapon systems fielding.
(d) Provide leadership, guidance, tactical input, and direction to subordinate elements, staff agencies, and field commanders up to and including Brigade/Corps level.
(e) Serves as a combat developer for the Capabilities, Development and Integration Directorate.
(f) Serves as the brigade standardization officer.', '3caf8e2355cceda04d9aff7c9d5fb481504d90b7baaba48ae49f0c59de68b583', 22, 22, null, 18, null, null, true, null),
  ('3bfe0ad2-a39d-55dd-aabb-2ea3e7da9fda', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '140K', 'AIR AND MISSILE DEFENSE (AMD) SYSTEMS TACTICIAN', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Perform duties described in paragraph g (3).
(b) Develop, review and update the life cycle management of AMD warrant officers.
(c) Advise the Commandant and Assistant Commandant at the Army Air Defense Artillery School on all matters pertaining to AMD warrant officers.
(d) Provide leadership, guidance, technical input, and direction to subordinate elements, staff agencies, field commanders at theater level, and interfaces with senior leadership in a joint/combined environment.
(e) Coordinates training, and evaluations for Air and Missile Defense (AMD) systems.', 'aac186f494ada4ef748d259d33ff78570a6e6cbe3e9b324a3a9bb365a503100a', 22, 22, null, 19, null, null, true, null),
  ('490242be-ac8c-516d-a83f-9512d8046194', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '140L', 'AIR AND MISSILE DEFENSE (AMD) SYSTEMS TECHNICIAN', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Provides leadership and coordinates the activities of system support personnel, equipment, site assets for the installation, repair (by using Built In Test/Built In Test Equipment (BIT/BITE) and/or standard troubleshooting procedures), system support, and modification of the Army Air and Missile Defense AMD Systems, ancillary equipment, and tools/test equipment.
(b) Plan, organize, implement, monitor, evaluate, and supervise operations and unit system support operations of AMD weapons systems.
(c) Advise the commander on readiness aspects of march order, emplacement and capabilities and limitations of the AMD weapons platforms and sensors.
(d) Develop and implement system support SOPs.
(e) Evaluates the effectiveness of system support personnel on adjustments, repair operations, and isolation procedures.
(f) Advises and instructs system support personnel on the proper procedures to perform adjustments, repair operations, and fault isolation procedures.
(g) Monitors and coordinate with higher headquarters elements and outside agencies for the installation of modifications on AMD weapons systems.
(h) Implement and ensure compliance with proper safety and security procedures applicable to the AMD weapons systems.
(i) Oversee the Army Maintenance Management System (TAMMS).
(j) Supervise operations and system support of unit Prescribed Load List (PLL).
(k) Acts as the commander’s representative for all aspects of unit system support operations and historical system support records.
(l) Supervise unit operations for Test, Measurement, and Diagnostic Equipment (TMDE).
(m) May perform duties as Conventional Equipment Officer.
(n) May perform duties as unit AOAP Officer.', 'ebff22dfa1e90492d76e6e37c08d8bad9871c39fb598450eb1bb577d21502e24', 24, 25, null, 20, null, null, false, null),
  ('31d25a82-bbd6-5287-ba0f-ce6fba228d22', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '140L', 'AIR AND MISSILE DEFENSE (AMD) SYSTEMS TECHNICIAN', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Perform duties described in paragraph g (1).
(b) Provide AMD weapons platform and sensor systems peculiar tactical/technical assistance, reporting guidance, and direction to subordinate elements.
(c) Advise the commander or staff officers on capabilities and limitations of AMD weapons platforms and sensors.
(d) Evaluates unit system support readiness for the commander.
(e) Coordinates total package fielding and the effects of modifications to the AMD weapons systems and trains new system support concepts.
(f) Serves as an instructor, writer, training developer and evaluator for MOS related service schools.
(g) Reports readiness status of battalion equipment.', 'a882f1feafbd852e9fcf5a9275a8ec37b78b16ac912998d75f39787f6612a9d7', 25, 25, null, 21, null, null, true, null),
  ('85484e9a-8000-5136-bbac-630f9736719d', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '140L', 'AIR AND MISSILE DEFENSE (AMD) SYSTEMS TECHNICIAN', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Perform duties described in paragraph g (2).
(b) Performs or oversees contract management and budgeting.
(c) Serve as Project Manager on New/Improved AMD weapon systems fielding.
(d) Provide leadership, guidance, technical input, and direction to subordinate elements, staff agencies, and field commanders up to and including Brigade/Corps level.
(e) Serves as a combat developer for MOS related service schools.
(f) Serves as brigade support operations officer.', '62147a45526414630d0af9bac695902ae978056563e71c8234fbcc61092862f3', 25, 25, null, 22, null, null, true, null),
  ('24b67e18-c9c5-501e-9d47-16dffd5e385b', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '140L', 'AIR AND MISSILE DEFENSE (AMD) SYSTEMS TECHNICIAN', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Perform duties described in paragraph g (3).
(b) Develop, review and update the life cycle management of AMD warrant officers.
(c) Advise the Commandant and Assistant Commandant at the Army Air Defense Artillery School on all matters pertaining to AMD warrant officers.
(d) Provide leadership, guidance, technical input, and direction to subordinate elements, staff agencies, field commanders at theater level, and interfaces with senior leadership in a joint/combined environment.
(e) Coordinates the activities of support personnel, manages equipment, readiness reporting, resource management, training, and evaluations for Air and Missile Defense (AMD) systems.', '1c4d52c8aa4913b61e1d999ef4c194ac342d0a43595a6e2001bc0e1eb20ad12c', 25, 25, null, 23, null, null, true, null),
  ('f25bdd3b-cd21-5eaf-b088-c77755d0a584', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '150A', 'AIR TRAFFIC AND AIR SPACE MANAGEMENT TECHNICIAN', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Manages and supervises enlisted ATC personnel.
(b) Is thoroughly knowledgeable of procedures and standards for the separation and control of aircraft, airports and airspace.
(c) Develops, revises, and reviews terminal instrument and instrument enroute procedures (TERPS) for combat support application and fixed base requirements. Assist in the development and revision of control zones, restricted areas, transition areas, and other special use airspace.
(d) Provides technical expertise pertaining to the operation of all types of ATC fixed base and combat support equipment.
(e) Applies the standards, time limitations, and policies for the issuance of controller qualification, certification, and facility ratings to Army ATC personnel. Apply procedures for the cancellation, suspension, or reissue and withdrawal of certificates and facility ratings.
(f) Manages the Army maintenance management system as it relates to maintenance of TDA ATC equipment.
(g) Follows safety requirements as related to all aspects of maintenance activities.', 'bb38a88f683bee6f70c498337ad5a440452e6c57b050ebfbc082f482dfe8993e', 30, 30, null, 24, '2024-05-01', null, false, null),
  ('d6ce8058-d8a6-5444-ba90-18a906da03f1', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '150A', 'AIR TRAFFIC AND AIR SPACE MANAGEMENT TECHNICIAN', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(a) through (g) above.
(b) Analyzes Army ATC/aviation mishaps to assist in determining causative factors.
(c) Reviews Army and federal training requirements. Submit recommendations pertaining to program standardization of ATC testing, soldier’s manuals, ARTEPS and nonresident ATC courses.
(d) Provides technical expertise regarding technical and operational standards for space requirements and equipment layouts for ATC improvements. Recommends changes to criteria governing establishment and discontinuance of ATC services and facilities.', 'aca35925973772996bdd1cf89f3447a5c1f425ff76a8958d439b445ea6a17780', 30, 30, null, 25, '2024-05-01', null, true, null),
  ('ad460f6a-00a2-5a3c-afc1-93eff74b72ad', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '150A', 'AIR TRAFFIC AND AIR SPACE MANAGEMENT TECHNICIAN', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs the duties described in paragraph g(2)(a) through (d) above.
(b) Plans, monitors and evaluates ATC operations, processes and procedures, and ATC materiel readiness status. Provide guidance and technical input to subordinate ATC elements and other staff elements.
(c) Performs duties pertaining to resource management and ATC equipment procurement activities.', '29128cca219c1e0018d150adfc8ae4ce570e52aee95d79b01f32caecc9ab9af6', 30, 30, null, 26, '2024-05-01', null, true, null),
  ('1c01eccb-bfaf-5fd5-a602-cebe53bd0a22', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '150A', 'AIR TRAFFIC AND AIR SPACE MANAGEMENT TECHNICIAN', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties required in paragraph g(3)(a) through (c) above.
(b) Provides guidance, advice and counsel to commanders and other staff members.
(c) Provides guidance and technical input to subordinate ATC element and other staff elements and commanders at all levels.
(d) As a training system integrator, develops and evaluates course content and provides technical training advice and guidance pertaining to area of technical specialty.', '51416f77496c4936cb5f27815558027be5cfb50d3adf1a36ba5dd49f6f37f8ea', 30, 30, null, 27, '2024-05-01', null, false, null),
  ('ab9c1827-fa09-59af-b893-2071fabd5765', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '150U', 'UNMANNED AIRCRAFT SYSTEMS OPERATIONS TECHNICIAN', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Supervise TUAS operations, to include mission planning, mission payload operation, launching, remotely piloting, and recovering.
(b) Maintains a detailed knowledge of airspace requirements to plan flight missions within acceptable mission profiles.
(c) Coordinates with higher and subordinate units for employment of TUAS missions.
(d) Develops and implements a TUAS standardization and safety program per all applicable regulations.
(e) Establishes and maintains a unit level Aircrew Training Program (ATP).
(f) Supervises employment of TUASs to conduct air reconnaissance/target detection or target engagement.', '658adb908db418347ca005cb58b297e0d799bf0b9d94a7eaa0ababdb1d00ddae', 31, 31, null, 28, null, null, false, null),
  ('55384156-22ab-5990-9630-b278b1e059ea', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '150U', 'UNMANNED AIRCRAFT SYSTEMS OPERATIONS TECHNICIAN', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs all duties outlined in paragraph g(1).
(b) Develops and instructs newly appointed warrant officers during their entry level training.', 'd2aa3196d17d4310932228608f2663a2f7a3013d9ed920a9ae8fd51b0a7c04c7', 32, 32, null, 29, null, null, false, null),
  ('38512c0b-a194-51bd-b6b8-dd25c0b66db9', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '150U', 'UNMANNED AIRCRAFT SYSTEMS OPERATIONS TECHNICIAN', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', 'Performs all duties outlined in paragraph g (2).', '46a94e5ba74dbaaf00a6e2ceda557afca8dfd4b05c108b850849b2b19d606a5c', 32, 32, null, 30, null, null, false, null),
  ('8345989c-37e5-5082-a0d2-b69c4140e7a8', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '150U', 'UNMANNED AIRCRAFT SYSTEMS OPERATIONS TECHNICIAN', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', 'Performs all duties outlined in paragraph g (3).', '0683b3ae8a61d78580c14d796fadbbc8acf4b604030860ec062626ca6e4c0764', 32, 32, null, 31, null, null, false, null),
  ('9ec08dc9-ced7-5bed-9769-3ae21c7a3275', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '151A', 'AVIATION MAINTENANCE TECHNICIAN (NONRATED)', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Manages aircraft maintenance based on a thorough knowledge of aircraft maintenance requirements for power plants, power trains, electrical systems, avionics, armament systems, mechanics and pneudraulics.
(b) Manages removal, disassembly, inspection, repair, assembly, installation, maintenance operational checks and adjustments of aircraft structures, components and subsystems.
(c) Manages the maintenance of technical publication libraries.
(d) Ensures compliance with regulations governing forms, records and reports pertaining to aircraft maintenance.
(e) Manages aircraft repair parts and supply procedures.
(f) Directs the development of aircraft repair parts and spares stock-age levels to ensure mission accomplishment and sustainment.
(g) Directs the use of tools, measuring, and diagnostic equipment to isolate faults in aircraft systems and subsystems.
(h) Ensures quality control procedures are observed during aviation maintenance.
(i) Directs use of computer systems and software for maintenance and supply requesting, reporting and management.', '7d3f42cfc9d3b109bdec9cfb17bc9fb2670961ecfc42771c2c71947d13c14f9c', 34, 34, null, 32, null, null, false, null),
  ('bc94a56c-a0a4-558e-a8fd-f38bf00a777a', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '151A', 'AVIATION MAINTENANCE TECHNICIAN (NONRATED)', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', 'Performs duties described in paragraph g (1) (a) through (i) above.', '95664d73e0076dc356b9c56c132ad1924915758fd937da1bd91b447879959c38', 34, 34, null, 33, null, null, true, null),
  ('21abc905-085b-5a38-9ff6-95e5bad993f5', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '151A', 'AVIATION MAINTENANCE TECHNICIAN (NONRATED)', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g (2) above.
(b) As an AVIM battalion aviation materiel officer monitors and evaluates aircraft maintenance operations, processes and procedures, and aviation materiel readiness status. Provides guidance and technical input to subordinate aviation maintenance elements and other staff elements.
(c) Manages production control of aviation intermediate maintenance.
(d) Provides technical advice to allied services using U.S. Army aircraft.
(e) Performs duties pertaining to resource management and aircraft procurement activities.', 'a8929791feabd9e0c15a4646e906fb7687378638e3189f91abb616f61cf4a4a5', 34, 34, null, 34, null, null, true, null),
  ('e573eaa5-ff24-5323-9744-ad629354d8e9', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '151A', 'AVIATION MAINTENANCE TECHNICIAN (NONRATED)', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(3)(a) through (e) above.
(b) Provides guidance and technical input to subordinate aviation maintenance elements and other staff elements and commanders at all levels.', 'e1f94352654f22003ff33852ec8056fbc121f5dcc73983df988d16e356325e31', 34, 34, null, 35, null, null, true, null),
  ('59fb4ff8-a650-5409-8750-4485a85b8247', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '152B', 'OH-58A/C SCOUT PILOT (RC)', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Plans flights, ascertains factors such as load, weight, fuel supply, route, altitudes or schedules as necessary to safely accomplish mission.
(b) Supervises loading and unloading of aircraft to ensure load stability, balance and adherence to aircraft load limitations.
(c) Pilots and commands assigned aircraft under tactical and non-tactical conditions for military purposes.
(d) Conducts pre/post-tactical mission briefings.
(e) Performs aerial evasive maneuvers.
(f) Trains personnel to engage hostile forces with aircraft armament systems.
(g) Maintains Aircrew Training Program requirements in appropriate aircraft.
(h) Detects satisfactory and unsatisfactory aircraft system or flight performance.
(i) Executes emergency operating procedures for assigned aircraft.', '2eafccd2b6b5d7ca4ae23a623556af78a6d21bebf2d2a1fd90b0a07c842317a3', 36, 36, null, 36, null, null, false, null),
  ('3de9902a-5c2b-5856-bcfd-081f84df4343', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '152B', 'OH-58A/C SCOUT PILOT (RC)', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(a) through (n) above.
(b) Manages maintenance personnel, tech supply, ground support equipment and facility assets to maintain, repair, test fly, and recover rotary wing aircraft.', 'b5b97764ee30acf5ab6b1a39570082266e19ca6ec64ac3a57fab48dd02456b05', 36, 36, null, 37, null, null, true, null),
  ('04b982bf-a9d5-5dce-8bb1-76fbc693ef36', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '152B', 'OH-58A/C SCOUT PILOT (RC)', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(a) through (b) above.
(b) As an IP, ASO or MTP in Special Operations Aviation also performs duties described in paragraph g(2)(c) through (h).', '5efbee15e4ada9993bf793f8ddd1ae0743856569bff97fbed906f8af19ee6171', 36, 36, null, 38, null, null, true, null),
  ('e33480c0-33b0-5e6e-a3c4-aa549045f9f1', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '152B', 'OH-58A/C SCOUT PILOT (RC)', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties required in paragraph g(1)(a) through (b).
(b) As a SIP, ASO, MTFE or tactical operations officer in Special Operations Aviation.', 'a2999625e9f1bcc93aeaae70b0fe138afb3ebb5e792a870f659fc7dcea564034', 36, 36, null, 39, null, null, false, null),
  ('1a9754c7-c9cc-5eff-b66e-8bdac19c8edd', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '152C', 'OH-6 PILOT', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Plans flights, ascertains factors such as load, weight, fuel supply, route, altitudes or schedules as necessary to safely accomplish mission.
(b) Supervises loading and unloading of aircraft to ensure load stability, balance and adherence to aircraft load limitations.
(c) Pilots and commands assigned aircraft under tactical and non-tactical conditions for military purposes.
(d) Conducts pre/post-tactical mission briefings.
(e) Performs aerial evasive maneuvers.
(f) Trains personnel to engage hostile forces with aircraft armament systems.
(g) Maintains Aircrew Training Program requirements in appropriate aircraft.
(h) Detects satisfactory and unsatisfactory aircraft system or flight performance.
(i) Executes emergency operating procedures for assigned aircraft.', '2eafccd2b6b5d7ca4ae23a623556af78a6d21bebf2d2a1fd90b0a07c842317a3', 36, 36, null, 40, null, null, false, null),
  ('ef6d4651-acb3-55d5-82bf-ceebcf214249', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '152C', 'OH-6 PILOT', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(a) through (n) above.
(b) Manages maintenance personnel, tech supply, ground support equipment and facility assets to maintain, repair, test fly, and recover rotary wing aircraft.', 'b5b97764ee30acf5ab6b1a39570082266e19ca6ec64ac3a57fab48dd02456b05', 36, 36, null, 41, null, null, true, null),
  ('4ede1f4a-a545-5572-800c-4f3cb6745468', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '152C', 'OH-6 PILOT', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(a) through (b) above.
(b) As an IP, ASO or MTP in Special Operations Aviation also performs duties described in paragraph g(2)(c) through (h).', '5efbee15e4ada9993bf793f8ddd1ae0743856569bff97fbed906f8af19ee6171', 36, 36, null, 42, null, null, true, null),
  ('5cf75042-0d7f-5e78-bb70-7e624603b861', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '152C', 'OH-6 PILOT', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties required in paragraph g(1)(a) through (b).
(b) As a SIP, ASO, MTFE or tactical operations officer in Special Operations Aviation.', 'a2999625e9f1bcc93aeaae70b0fe138afb3ebb5e792a870f659fc7dcea564034', 36, 36, null, 43, null, null, false, null),
  ('a1c88b51-7c28-5288-8d66-e14b3b5dbf5d', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '152D', 'OH-58D PILOT', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Plans flights, ascertains factors such as load, weight, fuel supply, route, altitudes or schedules as necessary to safely accomplish mission.
(b) Supervises loading and unloading of aircraft to ensure load stability, balance and adherence to aircraft load limitations.
(c) Pilots and commands assigned aircraft under tactical and non-tactical conditions for military purposes.
(d) Conducts pre/post-tactical mission briefings.
(e) Performs aerial evasive maneuvers.
(f) Trains personnel to engage hostile forces with aircraft armament systems.
(g) Maintains Aircrew Training Program requirements in appropriate aircraft.
(h) Detects satisfactory and unsatisfactory aircraft system or flight performance.
(i) Executes emergency operating procedures for assigned aircraft.', '2eafccd2b6b5d7ca4ae23a623556af78a6d21bebf2d2a1fd90b0a07c842317a3', 36, 36, null, 44, null, null, false, null),
  ('7f46b957-c009-54cd-aafa-415d9bc1a75f', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '152D', 'OH-58D PILOT', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(a) through (n) above.
(b) Manages maintenance personnel, tech supply, ground support equipment and facility assets to maintain, repair, test fly, and recover rotary wing aircraft.', 'b5b97764ee30acf5ab6b1a39570082266e19ca6ec64ac3a57fab48dd02456b05', 36, 36, null, 45, null, null, true, null),
  ('5058b4ca-ddf5-5135-8a76-8501f9000bcc', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '152D', 'OH-58D PILOT', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(a) through (b) above.
(b) As an IP, ASO or MTP in Special Operations Aviation also performs duties described in paragraph g(2)(c) through (h).', '5efbee15e4ada9993bf793f8ddd1ae0743856569bff97fbed906f8af19ee6171', 36, 36, null, 46, null, null, true, null),
  ('ff880821-77f5-59c9-a905-3628adc51b50', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '152D', 'OH-58D PILOT', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties required in paragraph g(1)(a) through (b).
(b) As a SIP, ASO, MTFE or tactical operations officer in Special Operations Aviation.', 'a2999625e9f1bcc93aeaae70b0fe138afb3ebb5e792a870f659fc7dcea564034', 36, 36, null, 47, null, null, false, null),
  ('e02c4204-1bd6-5b98-b6b5-f4ac3874dbc0', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '152E', 'AH-64E PILOT', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Plans flights, ascertains factors such as load, weight, fuel supply, route, altitudes or schedules as necessary to safely accomplish mission.
(b) Supervises loading and unloading of aircraft to ensure load stability, balance and adherence to aircraft load limitations.
(c) Pilots and commands assigned aircraft under tactical and non-tactical conditions for military purposes.
(d) Conducts pre/post-tactical mission briefings.
(e) Performs aerial evasive maneuvers.
(f) Trains personnel to engage hostile forces with aircraft armament systems.
(g) Maintains Aircrew Training Program requirements in appropriate aircraft.
(h) Detects satisfactory and unsatisfactory aircraft system or flight performance.
(i) Executes emergency operating procedures for assigned aircraft.', '2eafccd2b6b5d7ca4ae23a623556af78a6d21bebf2d2a1fd90b0a07c842317a3', 36, 36, null, 48, null, null, false, null),
  ('5bed51a0-b62f-581a-8bbd-351d7a8b9797', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '152E', 'AH-64E PILOT', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(a) through (n) above.
(b) Manages maintenance personnel, tech supply, ground support equipment and facility assets to maintain, repair, test fly, and recover rotary wing aircraft.', 'b5b97764ee30acf5ab6b1a39570082266e19ca6ec64ac3a57fab48dd02456b05', 36, 36, null, 49, null, null, true, null),
  ('1ff2842c-4d5a-5a21-a5e6-d6581250a647', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '152E', 'AH-64E PILOT', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(a) through (b) above.
(b) As an IP, ASO or MTP in Special Operations Aviation also performs duties described in paragraph g(2)(c) through (h).', '5efbee15e4ada9993bf793f8ddd1ae0743856569bff97fbed906f8af19ee6171', 36, 36, null, 50, null, null, true, null),
  ('7d5d8a33-d20c-546d-88f8-d732a20e2e83', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '152E', 'AH-64E PILOT', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties required in paragraph g(1)(a) through (b).
(b) As a SIP, ASO, MTFE or tactical operations officer in Special Operations Aviation.', 'a2999625e9f1bcc93aeaae70b0fe138afb3ebb5e792a870f659fc7dcea564034', 36, 36, null, 51, null, null, false, null),
  ('1a6fc916-a2c0-5a23-ac2f-8da5fc476593', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '152F', 'AH-64A ATTACK PILOT', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Plans flights, ascertains factors such as load, weight, fuel supply, route, altitudes or schedules as necessary to safely accomplish mission.
(b) Supervises loading and unloading of aircraft to ensure load stability, balance and adherence to aircraft load limitations.
(c) Pilots and commands assigned aircraft under tactical and non-tactical conditions for military purposes.
(d) Conducts pre/post-tactical mission briefings.
(e) Performs aerial evasive maneuvers.
(f) Trains personnel to engage hostile forces with aircraft armament systems.
(g) Maintains Aircrew Training Program requirements in appropriate aircraft.
(h) Detects satisfactory and unsatisfactory aircraft system or flight performance.
(i) Executes emergency operating procedures for assigned aircraft.', '2eafccd2b6b5d7ca4ae23a623556af78a6d21bebf2d2a1fd90b0a07c842317a3', 36, 36, null, 52, null, null, false, null),
  ('8acc1512-0821-5674-bf77-649ccc74351c', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '152F', 'AH-64A ATTACK PILOT', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(a) through (n) above.
(b) Manages maintenance personnel, tech supply, ground support equipment and facility assets to maintain, repair, test fly, and recover rotary wing aircraft.', 'b5b97764ee30acf5ab6b1a39570082266e19ca6ec64ac3a57fab48dd02456b05', 36, 36, null, 53, null, null, true, null),
  ('76ee6b8c-e51d-58f1-8963-dd79c0cc4c8b', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '152F', 'AH-64A ATTACK PILOT', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(a) through (b) above.
(b) As an IP, ASO or MTP in Special Operations Aviation also performs duties described in paragraph g(2)(c) through (h).', '5efbee15e4ada9993bf793f8ddd1ae0743856569bff97fbed906f8af19ee6171', 36, 36, null, 54, null, null, true, null),
  ('3ebdc252-aee0-5ed1-b242-74599602057c', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '152F', 'AH-64A ATTACK PILOT', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties required in paragraph g(1)(a) through (b).
(b) As a SIP, ASO, MTFE or tactical operations officer in Special Operations Aviation.', 'a2999625e9f1bcc93aeaae70b0fe138afb3ebb5e792a870f659fc7dcea564034', 36, 36, null, 55, null, null, false, null),
  ('44cc3497-0580-554f-bd09-890eeaa668cb', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '152H', 'AH-64D ATTACK PILOT', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Plans flights, ascertains factors such as load, weight, fuel supply, route, altitudes or schedules as necessary to safely accomplish mission.
(b) Supervises loading and unloading of aircraft to ensure load stability, balance and adherence to aircraft load limitations.
(c) Pilots and commands assigned aircraft under tactical and non-tactical conditions for military purposes.
(d) Conducts pre/post-tactical mission briefings.
(e) Performs aerial evasive maneuvers.
(f) Trains personnel to engage hostile forces with aircraft armament systems.
(g) Maintains Aircrew Training Program requirements in appropriate aircraft.
(h) Detects satisfactory and unsatisfactory aircraft system or flight performance.
(i) Executes emergency operating procedures for assigned aircraft.', '2eafccd2b6b5d7ca4ae23a623556af78a6d21bebf2d2a1fd90b0a07c842317a3', 36, 36, null, 56, null, null, false, null),
  ('18f0b3e2-225d-51c8-a79b-79ecf83c393e', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '152H', 'AH-64D ATTACK PILOT', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(a) through (n) above.
(b) Manages maintenance personnel, tech supply, ground support equipment and facility assets to maintain, repair, test fly, and recover rotary wing aircraft.', 'b5b97764ee30acf5ab6b1a39570082266e19ca6ec64ac3a57fab48dd02456b05', 36, 36, null, 57, null, null, true, null),
  ('d4ff3cda-e6f2-5032-8f26-28b81dded34f', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '152H', 'AH-64D ATTACK PILOT', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(a) through (b) above.
(b) As an IP, ASO or MTP in Special Operations Aviation also performs duties described in paragraph g(2)(c) through (h).', '5efbee15e4ada9993bf793f8ddd1ae0743856569bff97fbed906f8af19ee6171', 36, 36, null, 58, null, null, true, null),
  ('f3099a44-5785-560c-822f-3ded2082babd', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '152H', 'AH-64D ATTACK PILOT', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties required in paragraph g(1)(a) through (b).
(b) As a SIP, ASO, MTFE or tactical operations officer in Special Operations Aviation.', 'a2999625e9f1bcc93aeaae70b0fe138afb3ebb5e792a870f659fc7dcea564034', 36, 36, null, 59, null, null, false, null),
  ('bfc18943-83a5-5498-9ddd-e4533c128bc9', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '153A', 'ROTARY WING AVIATOR (AIRCRAFT NONSPECIFIC)', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Plans flights, ascertains factors such as load, weight, fuel supply, route, altitudes or schedules as necessary to safely accomplish mission.
(b) Supervises loading and unloading of aircraft to ensure load stability, balance, and adherence to aircraft load limitations.
(c) Pilots and commands assigned aircraft under tactical and nontactical conditions for military purposes.
(d) Conducts pre/post-tactical mission briefings.
(e) Performs aeromedical evacuation missions.
(f) Performs external load missions.
(g) Performs aerial evasive maneuvers.
(h) Trains to engage hostile forces with aircraft armament subsystems.
(i) Conducts electronic warfare signal intelligence (EW/SIGINT) missions (MOS 153A and 153D only with SQI 9).
(j) Maintains Aircrew Training Program requirements in appropriate aircraft.
(k) Detects satisfactory and unsatisfactory aircraft system or flight performance.
(l) Executes emergency operating procedures for assigned aircraft.', 'cfa6128fd2ecf5553da70126cc52cac019caeab6da7c6131ffdd4b1d55b71576', 39, 39, null, 60, null, null, false, null),
  ('e59506d5-ef9a-520a-a63b-52bd90ba6cf7', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '153A', 'ROTARY WING AVIATOR (AIRCRAFT NONSPECIFIC)', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(a) through (1) above.
(b) Performs duties as an aircraft armament maintenance officer on MH-60 aircraft.', 'cdadb5d44b6742e4ecb9088b4dc2eec0ed2f64995f5b3c5ad7ba0fb8ed73fce9', 39, 39, null, 61, null, null, true, null),
  ('fa5f9f24-b291-5284-b45f-48f1908062f8', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '153A', 'ROTARY WING AVIATOR (AIRCRAFT NONSPECIFIC)', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(a) through (b).
(b) As an IP, ASO, MTP or tactical operations officer in Special Operations Aviation.', 'd824a97493ad87e114408f47b2a555183e2e1fb0e4747d078337f9c7cdaf3908', 40, 40, null, 62, null, null, true, null),
  ('22f1dec9-0eb6-56d6-95e7-91d20f8bbcd1', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '153A', 'ROTARY WING AVIATOR (AIRCRAFT NONSPECIFIC)', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties required in paragraph g (1) (a) through (b).
(b) Performs duties as a SIP, ASO, MTFE or tactical operations officer in special operations aviation.', '6a5f91f4bfd51bdc10841e462c4c27523dde56cac223c2241a8a876f4c4ce7e1', 40, 40, null, 63, null, null, false, null),
  ('e7cf4fd7-938f-5e72-a728-66c348d2b173', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '153B', 'UH-1 PILOT (RC)', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Plans flights, ascertains factors such as load, weight, fuel supply, route, altitudes or schedules as necessary to safely accomplish mission.
(b) Supervises loading and unloading of aircraft to ensure load stability, balance, and adherence to aircraft load limitations.
(c) Pilots and commands assigned aircraft under tactical and nontactical conditions for military purposes.
(d) Conducts pre/post-tactical mission briefings.
(e) Performs aeromedical evacuation missions.
(f) Performs external load missions.
(g) Performs aerial evasive maneuvers.
(h) Trains to engage hostile forces with aircraft armament subsystems.
(i) Conducts electronic warfare signal intelligence (EW/SIGINT) missions (MOS 153A and 153D only with SQI 9).
(j) Maintains Aircrew Training Program requirements in appropriate aircraft.
(k) Detects satisfactory and unsatisfactory aircraft system or flight performance.
(l) Executes emergency operating procedures for assigned aircraft.', 'cfa6128fd2ecf5553da70126cc52cac019caeab6da7c6131ffdd4b1d55b71576', 39, 39, null, 64, null, null, false, null),
  ('dc39a6da-4db4-542f-a820-2d71be432e59', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '153B', 'UH-1 PILOT (RC)', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(a) through (1) above.
(b) Performs duties as an aircraft armament maintenance officer on MH-60 aircraft.', 'cdadb5d44b6742e4ecb9088b4dc2eec0ed2f64995f5b3c5ad7ba0fb8ed73fce9', 39, 39, null, 65, null, null, true, null),
  ('fd5e66d7-b17e-5470-9666-5b7095a72d92', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '153B', 'UH-1 PILOT (RC)', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(a) through (b).
(b) As an IP, ASO, MTP or tactical operations officer in Special Operations Aviation.', 'd824a97493ad87e114408f47b2a555183e2e1fb0e4747d078337f9c7cdaf3908', 40, 40, null, 66, null, null, true, null),
  ('f28b1432-6b26-51a4-8835-5deacb7dff98', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '153B', 'UH-1 PILOT (RC)', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties required in paragraph g (1) (a) through (b).
(b) Performs duties as a SIP, ASO, MTFE or tactical operations officer in special operations aviation.', '6a5f91f4bfd51bdc10841e462c4c27523dde56cac223c2241a8a876f4c4ce7e1', 40, 40, null, 67, null, null, false, null),
  ('80e06a6e-b945-59fe-b7d7-4deee18ccfaf', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '153D', 'UH-60 PILOT', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Plans flights, ascertains factors such as load, weight, fuel supply, route, altitudes or schedules as necessary to safely accomplish mission.
(b) Supervises loading and unloading of aircraft to ensure load stability, balance, and adherence to aircraft load limitations.
(c) Pilots and commands assigned aircraft under tactical and nontactical conditions for military purposes.
(d) Conducts pre/post-tactical mission briefings.
(e) Performs aeromedical evacuation missions.
(f) Performs external load missions.
(g) Performs aerial evasive maneuvers.
(h) Trains to engage hostile forces with aircraft armament subsystems.
(i) Conducts electronic warfare signal intelligence (EW/SIGINT) missions (MOS 153A and 153D only with SQI 9).
(j) Maintains Aircrew Training Program requirements in appropriate aircraft.
(k) Detects satisfactory and unsatisfactory aircraft system or flight performance.
(l) Executes emergency operating procedures for assigned aircraft.', 'cfa6128fd2ecf5553da70126cc52cac019caeab6da7c6131ffdd4b1d55b71576', 39, 39, null, 68, null, null, false, null),
  ('16b5b8cb-1192-54e4-9853-bf41bd7df658', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '153D', 'UH-60 PILOT', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(a) through (1) above.
(b) Performs duties as an aircraft armament maintenance officer on MH-60 aircraft.', 'cdadb5d44b6742e4ecb9088b4dc2eec0ed2f64995f5b3c5ad7ba0fb8ed73fce9', 39, 39, null, 69, null, null, true, null),
  ('e5d20830-cab6-5fc1-9f54-a19ff81cb42f', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '153D', 'UH-60 PILOT', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(a) through (b).
(b) As an IP, ASO, MTP or tactical operations officer in Special Operations Aviation.', 'd824a97493ad87e114408f47b2a555183e2e1fb0e4747d078337f9c7cdaf3908', 40, 40, null, 70, null, null, true, null),
  ('bdb67333-0fbc-5ac9-8d49-45e68abd36ca', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '153D', 'UH-60 PILOT', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties required in paragraph g (1) (a) through (b).
(b) Performs duties as a SIP, ASO, MTFE or tactical operations officer in special operations aviation.', '6a5f91f4bfd51bdc10841e462c4c27523dde56cac223c2241a8a876f4c4ce7e1', 40, 40, null, 71, null, null, false, null),
  ('621b4ceb-cee1-55ef-8970-f47ab6930293', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '153E', 'MH-60 PILOT', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Plans flights, ascertains factors such as load, weight, fuel supply, route, altitudes or schedules as necessary to safely accomplish mission.
(b) Supervises loading and unloading of aircraft to ensure load stability, balance, and adherence to aircraft load limitations.
(c) Pilots and commands assigned aircraft under tactical and nontactical conditions for military purposes.
(d) Conducts pre/post-tactical mission briefings.
(e) Performs aeromedical evacuation missions.
(f) Performs external load missions.
(g) Performs aerial evasive maneuvers.
(h) Trains to engage hostile forces with aircraft armament subsystems.
(i) Conducts electronic warfare signal intelligence (EW/SIGINT) missions (MOS 153A and 153D only with SQI 9).
(j) Maintains Aircrew Training Program requirements in appropriate aircraft.
(k) Detects satisfactory and unsatisfactory aircraft system or flight performance.
(l) Executes emergency operating procedures for assigned aircraft.', 'cfa6128fd2ecf5553da70126cc52cac019caeab6da7c6131ffdd4b1d55b71576', 39, 39, null, 72, null, null, false, null),
  ('8ef62add-062c-5d62-8188-a21297cd37ea', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '153E', 'MH-60 PILOT', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(a) through (1) above.
(b) Performs duties as an aircraft armament maintenance officer on MH-60 aircraft.', 'cdadb5d44b6742e4ecb9088b4dc2eec0ed2f64995f5b3c5ad7ba0fb8ed73fce9', 39, 39, null, 73, null, null, true, null),
  ('3a227cdd-8138-5390-91cd-3cee4b87d4a8', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '153E', 'MH-60 PILOT', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(a) through (b).
(b) As an IP, ASO, MTP or tactical operations officer in Special Operations Aviation.', 'd824a97493ad87e114408f47b2a555183e2e1fb0e4747d078337f9c7cdaf3908', 40, 40, null, 74, null, null, true, null),
  ('2afeec7d-73ca-5a20-b122-305e7646e0a4', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '153E', 'MH-60 PILOT', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties required in paragraph g (1) (a) through (b).
(b) Performs duties as a SIP, ASO, MTFE or tactical operations officer in special operations aviation.', '6a5f91f4bfd51bdc10841e462c4c27523dde56cac223c2241a8a876f4c4ce7e1', 40, 40, null, 75, null, null, false, null),
  ('0f116690-97bd-53a4-9e34-d225d3a15705', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '153L', 'UH-72A PILOT (RC ONLY)', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Plans flights, ascertains factors such as load, weight, fuel supply, route, altitudes or schedules as necessary to safely accomplish mission.
(b) Supervises loading and unloading of aircraft to ensure load stability, balance, and adherence to aircraft load limitations.
(c) Pilots and commands assigned aircraft under tactical and nontactical conditions for military purposes.
(d) Conducts pre/post-tactical mission briefings.
(e) Performs aeromedical evacuation missions.
(f) Performs external load missions.
(g) Performs aerial evasive maneuvers.
(h) Trains to engage hostile forces with aircraft armament subsystems.
(i) Conducts electronic warfare signal intelligence (EW/SIGINT) missions (MOS 153A and 153D only with SQI 9).
(j) Maintains Aircrew Training Program requirements in appropriate aircraft.
(k) Detects satisfactory and unsatisfactory aircraft system or flight performance.
(l) Executes emergency operating procedures for assigned aircraft.', 'cfa6128fd2ecf5553da70126cc52cac019caeab6da7c6131ffdd4b1d55b71576', 39, 39, null, 76, null, null, false, null),
  ('1fab94fa-b616-518f-b12a-748fe706cf71', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '153L', 'UH-72A PILOT (RC ONLY)', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(a) through (1) above.
(b) Performs duties as an aircraft armament maintenance officer on MH-60 aircraft.', 'cdadb5d44b6742e4ecb9088b4dc2eec0ed2f64995f5b3c5ad7ba0fb8ed73fce9', 39, 39, null, 77, null, null, true, null),
  ('bcf29895-fcad-5668-a8b2-a70545d77c0d', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '153L', 'UH-72A PILOT (RC ONLY)', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(a) through (b).
(b) As an IP, ASO, MTP or tactical operations officer in Special Operations Aviation.', 'd824a97493ad87e114408f47b2a555183e2e1fb0e4747d078337f9c7cdaf3908', 40, 40, null, 78, null, null, true, null),
  ('34eca296-f673-569e-b3d9-edf3b8274cb5', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '153L', 'UH-72A PILOT (RC ONLY)', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties required in paragraph g (1) (a) through (b).
(b) Performs duties as a SIP, ASO, MTFE or tactical operations officer in special operations aviation.', '6a5f91f4bfd51bdc10841e462c4c27523dde56cac223c2241a8a876f4c4ce7e1', 40, 40, null, 79, null, null, false, null),
  ('acc678b9-b9f6-5a3e-8e97-cc5b447add4d', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '153M', 'UH-60M PILOT', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Plans flights, ascertains factors such as load, weight, fuel supply, route, altitudes or schedules as necessary to safely accomplish mission.
(b) Supervises loading and unloading of aircraft to ensure load stability, balance, and adherence to aircraft load limitations.
(c) Pilots and commands assigned aircraft under tactical and nontactical conditions for military purposes.
(d) Conducts pre/post-tactical mission briefings.
(e) Performs aeromedical evacuation missions.
(f) Performs external load missions.
(g) Performs aerial evasive maneuvers.
(h) Trains to engage hostile forces with aircraft armament subsystems.
(i) Conducts electronic warfare signal intelligence (EW/SIGINT) missions (MOS 153A and 153D only with SQI 9).
(j) Maintains Aircrew Training Program requirements in appropriate aircraft.
(k) Detects satisfactory and unsatisfactory aircraft system or flight performance.
(l) Executes emergency operating procedures for assigned aircraft.', 'cfa6128fd2ecf5553da70126cc52cac019caeab6da7c6131ffdd4b1d55b71576', 39, 39, null, 80, null, null, false, null),
  ('ff676d74-d637-54b8-a53c-4a97e8443626', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '153M', 'UH-60M PILOT', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(a) through (1) above.
(b) Performs duties as an aircraft armament maintenance officer on MH-60 aircraft.', 'cdadb5d44b6742e4ecb9088b4dc2eec0ed2f64995f5b3c5ad7ba0fb8ed73fce9', 39, 39, null, 81, null, null, true, null),
  ('98a94328-7938-5565-98e7-b267eb64d113', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '153M', 'UH-60M PILOT', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(a) through (b).
(b) As an IP, ASO, MTP or tactical operations officer in Special Operations Aviation.', 'd824a97493ad87e114408f47b2a555183e2e1fb0e4747d078337f9c7cdaf3908', 40, 40, null, 82, null, null, true, null),
  ('daadcc16-eafb-5dc4-8fc3-c285797a0ff8', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '153M', 'UH-60M PILOT', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties required in paragraph g (1) (a) through (b).
(b) Performs duties as a SIP, ASO, MTFE or tactical operations officer in special operations aviation.', '6a5f91f4bfd51bdc10841e462c4c27523dde56cac223c2241a8a876f4c4ce7e1', 40, 40, null, 83, null, null, false, null),
  ('633dfb52-01de-5e58-aa98-33617d7d3d9d', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '154C', 'CH-47D PILOT', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Plans flights, ascertains factors such as load, weight, fuel supply, route, altitudes or schedules as necessary to safely accomplish mission.
(b) Supervises loading and unloading of aircraft to ensure load stability, balance and adherence to aircraft load limitations.
(c) Pilots and commands assigned aircraft under tactical and non-tactical conditions for military purposes.
(d) Conducts pre/post-tactical mission briefings.
(e) Performs aeromedical evacuation missions.
(f) Performs external load missions.
(g) Performs water-landing missions.
(h) Performs aerial evasive maneuvers.
(i) Trains personnel to engage hostile forces with aircraft armament subsystems.
(j) Maintains Aircrew Training Program requirements in appropriate aircraft.
(k) Detects satisfactory and unsatisfactory aircraft system or flight performance.
(l) Executes emergency operating procedures for assigned aircraft.', 'f41a72d1efb2cd809e8e00a650a99d0ff7921aa9314a99af981b53fd8573c47a', 42, 42, null, 84, null, null, false, null),
  ('bd93c025-9607-594c-a79c-d745b77a1861', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '154C', 'CH-47D PILOT', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(a) through (l) above.
(b) Performs duties as an aircraft armament maintenance officer on MH-47 aircraft.', '048e28b8bb86ab9d06971f75434c1ccfa9c2177e37107bc6027fed1e692719cc', 42, 42, null, 85, null, null, true, null),
  ('c8bc7bb7-1048-5069-b140-9a305ac80f82', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '154C', 'CH-47D PILOT', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(a) through (b) above.
(b) Performs duties as an IP, ASO, MTP or tactical operations officer in Special Operations Aviation.', 'bdf89f924f361ac5e85b783f0ae2bddebcb026f69569429f56fb24dc240ea8ba', 42, 42, null, 86, null, null, true, null),
  ('457e48af-39be-5582-b8ea-a434e15c5f7d', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '154C', 'CH-47D PILOT', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties as described in paragraph g(1)(a) through (b) above.
(b) Performs duties as a SIP, ASO, MTFE or tactical operations officer in special operations aviation.', '50afb548e520d1fe972b9295b1652d8c27a18c5ccac07a728290f1b73a6447cf', 42, 42, null, 87, null, null, false, null),
  ('1ab0c5f5-7892-597f-b108-82d7b9cd4947', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '154E', 'MH-47 PILOT', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Plans flights, ascertains factors such as load, weight, fuel supply, route, altitudes or schedules as necessary to safely accomplish mission.
(b) Supervises loading and unloading of aircraft to ensure load stability, balance and adherence to aircraft load limitations.
(c) Pilots and commands assigned aircraft under tactical and non-tactical conditions for military purposes.
(d) Conducts pre/post-tactical mission briefings.
(e) Performs aeromedical evacuation missions.
(f) Performs external load missions.
(g) Performs water-landing missions.
(h) Performs aerial evasive maneuvers.
(i) Trains personnel to engage hostile forces with aircraft armament subsystems.
(j) Maintains Aircrew Training Program requirements in appropriate aircraft.
(k) Detects satisfactory and unsatisfactory aircraft system or flight performance.
(l) Executes emergency operating procedures for assigned aircraft.', 'f41a72d1efb2cd809e8e00a650a99d0ff7921aa9314a99af981b53fd8573c47a', 42, 42, null, 88, null, null, false, null),
  ('de83c36e-0f2c-57e4-9eff-00de78a4dc46', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '154E', 'MH-47 PILOT', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(a) through (l) above.
(b) Performs duties as an aircraft armament maintenance officer on MH-47 aircraft.', '048e28b8bb86ab9d06971f75434c1ccfa9c2177e37107bc6027fed1e692719cc', 42, 42, null, 89, null, null, true, null),
  ('d4ed926a-44f5-51e0-8136-597e813c2409', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '154E', 'MH-47 PILOT', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(a) through (b) above.
(b) Performs duties as an IP, ASO, MTP or tactical operations officer in Special Operations Aviation.', 'bdf89f924f361ac5e85b783f0ae2bddebcb026f69569429f56fb24dc240ea8ba', 42, 42, null, 90, null, null, true, null),
  ('7eee4ef5-407c-5aa0-8054-335cc5d485f3', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '154E', 'MH-47 PILOT', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties as described in paragraph g(1)(a) through (b) above.
(b) Performs duties as a SIP, ASO, MTFE or tactical operations officer in special operations aviation.', '50afb548e520d1fe972b9295b1652d8c27a18c5ccac07a728290f1b73a6447cf', 42, 42, null, 91, null, null, false, null),
  ('f7352898-8878-5cd1-8cfd-0b39ba7fb903', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '154F', 'CH-47F PILOT', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Plans flights, ascertains factors such as load, weight, fuel supply, route, altitudes or schedules as necessary to safely accomplish mission.
(b) Supervises loading and unloading of aircraft to ensure load stability, balance and adherence to aircraft load limitations.
(c) Pilots and commands assigned aircraft under tactical and non-tactical conditions for military purposes.
(d) Conducts pre/post-tactical mission briefings.
(e) Performs aeromedical evacuation missions.
(f) Performs external load missions.
(g) Performs water-landing missions.
(h) Performs aerial evasive maneuvers.
(i) Trains personnel to engage hostile forces with aircraft armament subsystems.
(j) Maintains Aircrew Training Program requirements in appropriate aircraft.
(k) Detects satisfactory and unsatisfactory aircraft system or flight performance.
(l) Executes emergency operating procedures for assigned aircraft.', 'f41a72d1efb2cd809e8e00a650a99d0ff7921aa9314a99af981b53fd8573c47a', 42, 42, null, 92, null, null, false, null),
  ('c947fee3-bb3e-525b-aed6-9f133e81b657', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '154F', 'CH-47F PILOT', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(a) through (l) above.
(b) Performs duties as an aircraft armament maintenance officer on MH-47 aircraft.', '048e28b8bb86ab9d06971f75434c1ccfa9c2177e37107bc6027fed1e692719cc', 42, 42, null, 93, null, null, true, null),
  ('8995b210-2683-5550-af88-5f60a3e10abe', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '154F', 'CH-47F PILOT', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(a) through (b) above.
(b) Performs duties as an IP, ASO, MTP or tactical operations officer in Special Operations Aviation.', 'bdf89f924f361ac5e85b783f0ae2bddebcb026f69569429f56fb24dc240ea8ba', 42, 42, null, 94, null, null, true, null),
  ('203f4a2a-cb5b-5e7d-b1e0-e5566f9adbff', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '154F', 'CH-47F PILOT', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties as described in paragraph g(1)(a) through (b) above.
(b) Performs duties as a SIP, ASO, MTFE or tactical operations officer in special operations aviation.', '50afb548e520d1fe972b9295b1652d8c27a18c5ccac07a728290f1b73a6447cf', 42, 42, null, 95, null, null, false, null),
  ('c98d8a1d-05a5-57a9-8ba7-e01b701951dc', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '155A', 'FIXED WING AVIATOR (AIRCRAFT NONSPECIFIC)', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Plans flights, ascertains factors such as load, weight, fuel supply, route, altitudes or schedules as necessary to safely accomplish mission.
(b) Supervises loading and unloading of aircraft to ensure load stability, balance and adherence to aircraft load limitations.
(c) Pilots and commands assigned aircraft under tactical and nontactical conditions for military purposes.
(d) Conducts pre/post-administrative and tactical mission briefings.
(e) Performs aeromedical evacuation missions.
(f) Performs aerial evasive maneuvers.
(g) Maintains Aircrew Training Program requirements in appropriate aircraft.
(h) Detects satisfactory and unsatisfactory aircraft system or flight performance.
(i) Executes emergency operating procedures for assigned aircraft.
(j) Performs electronic surveillance and intelligence gathering missions.', '5f8c732e821d7a98c425160400b0d2c636435f71239adf1d1a7c9c4443259b18', 45, 45, null, 96, null, null, false, null),
  ('45ad3acc-d9a8-588d-a65f-a1b6356f54a7', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '155A', 'FIXED WING AVIATOR (AIRCRAFT NONSPECIFIC)', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', 'performs duties described in paragraph g(1)(a) through (i) above.', 'c9c66a2f7269efd0155652307dd29edeea0366a733ac72f2d8fd027ae95b7399', 45, 45, null, 97, null, null, true, null),
  ('b03a7e97-f145-50f8-aa76-77a2a9434bff', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '155A', 'FIXED WING AVIATOR (AIRCRAFT NONSPECIFIC)', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', 'performs duties described in paragraph g(1)(a) above.', '361ec565066ec853f4bf47e86289aee97bffe74064ad64f123d13df6a715ffec', 45, 45, null, 98, null, null, true, null),
  ('324a78bc-95f8-52ae-a91f-0ccc98021b7f', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '155A', 'FIXED WING AVIATOR (AIRCRAFT NONSPECIFIC)', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(a) above.
(b) Provides guidance, advice and counsel to commanders and other staff members.', 'ceac7aa31f652010c1169a006bfd2e90c8e2508399b2342f3782edaabad0e64b', 45, 45, null, 99, null, null, true, null),
  ('e267498c-0b43-5ca8-97cd-6b825bb1bb08', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '155E', 'C-12 PILOT', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Plans flights, ascertains factors such as load, weight, fuel supply, route, altitudes or schedules as necessary to safely accomplish mission.
(b) Supervises loading and unloading of aircraft to ensure load stability, balance and adherence to aircraft load limitations.
(c) Pilots and commands assigned aircraft under tactical and nontactical conditions for military purposes.
(d) Conducts pre/post-administrative and tactical mission briefings.
(e) Performs aeromedical evacuation missions.
(f) Performs aerial evasive maneuvers.
(g) Maintains Aircrew Training Program requirements in appropriate aircraft.
(h) Detects satisfactory and unsatisfactory aircraft system or flight performance.
(i) Executes emergency operating procedures for assigned aircraft.
(j) Performs electronic surveillance and intelligence gathering missions.', '5f8c732e821d7a98c425160400b0d2c636435f71239adf1d1a7c9c4443259b18', 45, 45, null, 100, null, null, false, null),
  ('8295fda4-4ca2-5e65-bbf7-0e0955152c6b', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '155E', 'C-12 PILOT', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', 'performs duties described in paragraph g(1)(a) through (i) above.', 'c9c66a2f7269efd0155652307dd29edeea0366a733ac72f2d8fd027ae95b7399', 45, 45, null, 101, null, null, true, null),
  ('e8e6be7a-42ee-5367-a2b8-7e3f259c5ea7', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '155E', 'C-12 PILOT', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', 'performs duties described in paragraph g(1)(a) above.', '361ec565066ec853f4bf47e86289aee97bffe74064ad64f123d13df6a715ffec', 45, 45, null, 102, null, null, true, null),
  ('438da458-ca32-5413-a32a-8d2a48e665bd', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '155E', 'C-12 PILOT', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(a) above.
(b) Provides guidance, advice and counsel to commanders and other staff members.', 'ceac7aa31f652010c1169a006bfd2e90c8e2508399b2342f3782edaabad0e64b', 45, 45, null, 103, null, null, true, null),
  ('15f84022-8597-59be-8503-626fbc798406', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '155F', 'JET AIRCRAFT PILOT', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Plans flights, ascertains factors such as load, weight, fuel supply, route, altitudes or schedules as necessary to safely accomplish mission.
(b) Supervises loading and unloading of aircraft to ensure load stability, balance and adherence to aircraft load limitations.
(c) Pilots and commands assigned aircraft under tactical and nontactical conditions for military purposes.
(d) Conducts pre/post-administrative and tactical mission briefings.
(e) Performs aeromedical evacuation missions.
(f) Performs aerial evasive maneuvers.
(g) Maintains Aircrew Training Program requirements in appropriate aircraft.
(h) Detects satisfactory and unsatisfactory aircraft system or flight performance.
(i) Executes emergency operating procedures for assigned aircraft.
(j) Performs electronic surveillance and intelligence gathering missions.', '5f8c732e821d7a98c425160400b0d2c636435f71239adf1d1a7c9c4443259b18', 45, 45, null, 104, null, null, false, null),
  ('859fdb63-b6a1-5333-a62c-fb50ff64161d', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '155F', 'JET AIRCRAFT PILOT', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', 'performs duties described in paragraph g(1)(a) through (i) above.', 'c9c66a2f7269efd0155652307dd29edeea0366a733ac72f2d8fd027ae95b7399', 45, 45, null, 105, null, null, true, null),
  ('42f3a4b5-534d-5db4-9a8d-727977037d6c', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '155F', 'JET AIRCRAFT PILOT', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', 'performs duties described in paragraph g(1)(a) above.', '361ec565066ec853f4bf47e86289aee97bffe74064ad64f123d13df6a715ffec', 45, 45, null, 106, null, null, true, null),
  ('92b12997-5ac2-582f-8363-1614fa952b18', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '155F', 'JET AIRCRAFT PILOT', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(a) above.
(b) Provides guidance, advice and counsel to commanders and other staff members.', 'ceac7aa31f652010c1169a006bfd2e90c8e2508399b2342f3782edaabad0e64b', 45, 45, null, 107, null, null, true, null),
  ('11004335-697a-573a-822e-ac80497f5ca8', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '155G', '0-5A/EO-5B/RC-7 PILOT', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Plans flights, ascertains factors such as load, weight, fuel supply, route, altitudes or schedules as necessary to safely accomplish mission.
(b) Supervises loading and unloading of aircraft to ensure load stability, balance and adherence to aircraft load limitations.
(c) Pilots and commands assigned aircraft under tactical and nontactical conditions for military purposes.
(d) Conducts pre/post-administrative and tactical mission briefings.
(e) Performs aeromedical evacuation missions.
(f) Performs aerial evasive maneuvers.
(g) Maintains Aircrew Training Program requirements in appropriate aircraft.
(h) Detects satisfactory and unsatisfactory aircraft system or flight performance.
(i) Executes emergency operating procedures for assigned aircraft.
(j) Performs electronic surveillance and intelligence gathering missions.', '5f8c732e821d7a98c425160400b0d2c636435f71239adf1d1a7c9c4443259b18', 45, 45, null, 108, null, null, false, null),
  ('1ef7875d-377a-5d2e-b1fe-e98cbb4ee500', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '155G', '0-5A/EO-5B/RC-7 PILOT', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', 'performs duties described in paragraph g(1)(a) through (i) above.', 'c9c66a2f7269efd0155652307dd29edeea0366a733ac72f2d8fd027ae95b7399', 45, 45, null, 109, null, null, true, null),
  ('09391d0d-5723-53fe-8826-4ee49a6d169f', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '155G', '0-5A/EO-5B/RC-7 PILOT', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', 'performs duties described in paragraph g(1)(a) above.', '361ec565066ec853f4bf47e86289aee97bffe74064ad64f123d13df6a715ffec', 45, 45, null, 110, null, null, true, null),
  ('e7ba1dca-73ce-56f0-bc47-618da3d87087', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '155G', '0-5A/EO-5B/RC-7 PILOT', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(a) above.
(b) Provides guidance, advice and counsel to commanders and other staff members.', 'ceac7aa31f652010c1169a006bfd2e90c8e2508399b2342f3782edaabad0e64b', 45, 45, null, 111, null, null, true, null),
  ('18a44883-a153-5f9a-8d66-317c9a11b870', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '170A', 'CYBER WARFARE TECHNICIAN', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Manage operational teams in support of offensive and defensive cyberspace operations.
(b) Plan, administer, manage, maintain, and integrate actions in support of offensive and defensive cyberspace operations.
(c) Establish priorities and provide guidance for collection, exploitation, analysis and reporting missions.
(d) Direct network terrain audits, digital forensics processes, and exploitation missions.
(e) Advise and assist commanders and staffs in formulating plans for cyber operations.
(f). Mentor, train, and coach Soldiers and leaders on the technical and tactical aspects of cyberspace operations.
(g) Execute defensive cyberspace operational tasks at the senior level to identify, locate, isolate, and mitigate cyberspace threats within the DODIN.
(h) Execute offensive cyberspace operational tasks at the senior level to prepare the operational environment, gain access, establish persistence, and deliver effects against targeted systems or infrastructure.
(i) Inform individual training requirements for cyberspace certification.
(j) Provide updates to unit level standard operating procedures.', '3fcc217cb0975c34595b29a5ca03f0cc278475602ff3e135e405fef12cd7fd58', 48, 49, null, 112, '2025-07-01', null, false, null),
  ('7297460c-80b5-564d-b804-41cabc21fdb7', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '170A', 'CYBER WARFARE TECHNICIAN', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Perform duties described in paragraph g (1).
(b) Validate architectural analysis, administer penetration testing, and coordinate response actions.
(c) Manage the execution of Cyberspace Defense; Cyber Effects Enabling Activity, and Cyberspace Effects Operations actions.
(d) Monitor cyberspace operations to ensure mission execution is within authority guidelines and operational risk tolerances.
(e) Provide post-incident analytic input and mitigation recommendations as necessary.
(f) Validate individual and collective training requirements that affect cyberspace operations certification.
(g) Support cyberspace operations team recertification processes and events through technical input, guidance, and task execution.', '20a7273a1d2ac7b286fe99171797e6b200a93139292ef406eb326b8c7e71f875', 49, 49, null, 113, '2025-07-01', null, true, null),
  ('c237949a-5d7e-55e8-a9cc-8a4410db0d70', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '170A', 'CYBER WARFARE TECHNICIAN', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Perform duties described in paragraph g (2).
(b) Evaluate cyber defense requirements and advise in the joint targeting process.
(c) Provide subject matter expert advice, planning, coordination across echelon, and task execution within cyberspace operations.
(d) Provide cyber operations recommendations and guidance on Army, Coalition, and National policies, structures, assignments and training.
(e) Supervise military, civilian, and joint/coalition personnel throughout the planning, coordination, and execution of cyberspace operations.', '39e32c779a81093ac588e0f085a6aa3ae5c7d240896a6181fc7ed00f9e3ee2ed', 49, 49, null, 114, '2025-07-01', null, true, null),
  ('74ee126f-c3b9-5559-a510-88fa6e15a48d', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '170A', 'CYBER WARFARE TECHNICIAN', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Perform duties described in paragraph g (3).
(b) Advise the commander, leaders, and other forums regarding cyberspace operations, risk mitigation, friendly/threat capabilities, policies, authorities, and employment strategies across all echelons.
(c) Provide input regarding the readiness of cyberspace operational organizations, teams, personnel, infrastructure, and capabilities.
(d) Coordinate with service schools to identify mitigation strategies for knowledge and skill gaps to reduce operational training requirements.
(e) Provide guidance, mentorship, and direction to junior Warrant Officers within the command or organization. f) Direct mission management functions for offensive and defensive cyberspace operations. ( g) Develop crisis plans to directly support cyberspace operations planning and targeting.', '9226a8b872672291ff6ad1f0a794fa737b530cc46325150cb52647e9912b66c1', 49, 49, null, 115, '2025-07-01', null, true, null),
  ('571148f2-e4b6-530b-b7b1-db2b22ef812d', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '170B', 'ELECTRONIC WARFARE TECHNICIAN', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', 'As an EW Technician :
(a) Organizes, implements, monitors, and evaluates EW operations, threat environment, unit maintenance, and intermediate level support maintenance of EW systems.
(b) Provides advice on technical and tactical employment of all assigned EW systems and tasked or requested non-organic EW systems to include Electromagnetic Attack (EA), Electromagnetic Support (ES), and Electromagnetic Protection (EP) activities.
(c) Develops, publishes, and updates EW Operations SOP incorporating current TTP.
(d) Develops and integrates measures of performance and measures of effectiveness criteria to determine EW battle damage assessment (BDA), re-engagement criteria, and alternate methods of engagement.
(e) Provides input and updates to S6 for joint restricted frequency list (JRFL) validation and employment to include spectrum deconfliction and frequency management.
(f) Implements spectrum interference reporting criteria and resolution tracking as received from higher headquarters.
(g) Recommends the use of ES for immediate target prosecution and triggering criteria and EP measures to provide resolution.
(h) Analyzes signal external parameters to identify a signal, correlate a threat, provide indications and warnings, improve the Commander’s situational understanding, and to select, modify, and/or inform the development of electromagnetic countermeasures for affecting targeted communications and non-communications systems.
(i) Evaluates the technical and tactical operations of subordinate EW sections.(j) Develops and implements brigade emission control (EMCON) procedures, which includes staff coordination and SOP change publishing.
(k) Integrates EA, ES and EP into EW operations.
(l) Establishes tactics techniques and procedures for operations in a contested EW environment. In coordination with S2/S6 identify emerging EW threats or trends and develop mitigation measures to overcome new adversarial EW actions.
(m) Disseminates and monitors compliance with updated EW system load sets to assigned EW entities as issued by the Cyberspace Electromagnetic Activities (CEMA) section.
(n) Assists with technical and tactical information in order to develop and implement Appendix 12 to Annex C and associated Tabs of the Operations Order. Provide input and refinement to the S2 for the enemy tactical EW order of battle (OB) and applicable appendices to Annex B of the operations order.
(o) Liaises for subordinate EW entities to higher headquarters CEMA section for EW requests for support.
(p) Assists with technical and tactical information in order to develop and implement the routine EW training plan for EW system operators and staff sections involved in planning EW integration. Perform EW training for leaders, including the command group and key staff.
(q) Provides EW input to the intelligence, surveillance, and reconnaissance (ISR) synchronization meeting, operations and intelligence (O&I) working group, and targeting/planning meetings.
(r) Prioritizes EW requests and operations with subordinate units and requests for support from higher headquarters.
(s) Serves as the key facilitator for EW and CEMA Working Groups.
(t) Monitors and maintains EW running estimates.
(u) Resolves EA conflicts with the S2 in intelligence gain-loss considerations.
(v) Updates and disseminates changes to the enemy tactical EW OB to include associated targeting information and necessary intelligence generation.
(w)Provides technical input regarding effects requests and/or electromagnetic countermeasure development efforts.
(x) Develops and mentors EW Specialists.', '34fa0809a9cc6fd9253f24e6326f9cb24208c1301b6966cfd2a8679b41d8c407', 51, 52, null, 116, '2025-07-01', null, false, null),
  ('8880355a-fc0d-5269-9ae2-b98db17d93d0', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '170B', 'ELECTRONIC WARFARE TECHNICIAN', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1).
(b) Monitors the development of the enemy electromagnetic order of battle (EEOB) and the processing of target information and intelligence generation.
(c) Identifies and recommends solutions to EW capability gaps and limitations.
(d) Acts as the Commander’s EW technical and tactical advisor.
(e) Provides EW technical expertise to subordinate units and activities involved with EA, ES, and EP operations to include maintenance of all EW systems activities.
(f) Liaises between EW specialists and the theater EWC for Joint EW support.
(g) Monitors and prioritizes the processing of EA and review EW BDA.
(h) Coordinates for and updates applicable target selection standards and disseminates to all subordinate EW entities.
(i) Assists in the development and maintenance of the operational EEOB, processing of targeting information and intelligence generation.', 'cbfb4748f561ef7cc3f19d01410d0bc7365c92d85f7a4e629d14d243cc7d5489', 52, 52, null, 117, '2025-07-01', null, true, null),
  ('7de1402a-c9d2-5bb3-9397-b23c956b60bc', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '170B', 'ELECTRONIC WARFARE TECHNICIAN', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(2).
(b) Recommends target purging criteria to the G3, EWC, and subordinate headquarters.
(c) Monitors and prioritizes the processing of EA and reviews BDA at Corps level.
(d) Synchronizes EW operations within the joint targeting cycle for Air Force, Navy, and Marine Corps EW integration into Army operations.
(e) Monitors the development of the enemy strategic EEOB and the processing of target information and intelligence generation at the strategic/operational level.
(f) Recommends the employment and directs the operation of available Theater level assets.
(g) Assists in production and application of target selection standards at Corps level.
(h) Requests targeting information from military intelligence and higher sources and evaluates information obtained through the IPB process at Corps level and disseminates to assigned organizations.
(i) Assists in the preparation of theater Emergency Action Plans, operational plans and orders and disseminates to assigned organizations.
(j) Exercises EW technical supervision of strategic and operational EW operations.
(k) Coordinates with Corps Legal section to ensure EW operations comply with law of armed conflict and rules of engagement criteria.', '9f91dc25929ed5f7c9f33a3d479db016410de3ea1b1fe8ca76847634949c1393', 52, 53, null, 118, '2025-07-01', null, true, null),
  ('fad3527d-5fb6-50ce-9f3b-757944476d1e', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '170B', 'ELECTRONIC WARFARE TECHNICIAN', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(3).
(b) Serves as the senior technical advisor at the highest echelons of command such as HQDA, COCOMs, ASCCs, DRUs, Joint Services and allied armies in all matters pertaining to the integration of Electromagnetic Warfare capabilities.
(c) Advises the US Army CY Proponent on all matters pertaining to EW Warrant Officers professional development, career progression and Professional Military training requirements.
(d) Liaises with CY Proponent to advise commanders on requirements for Army EW personnel and equipment, to include training and certification.
(e) Advises members of Theater Commands, CAOC and BCD on all matters concerning Army EW requests, requirements, and priorities.
(f) Develops and publishes applicable theater Request for Forces (RFF), Joint Urgent Operational Needs Statements (JUONS), Operational Needs Statements (ONS), and Integrated Priority Lists (IPLs) as applicable for EW requirements.
(g) Analyzes and recommends changes to commanders on EW targeting, attack guidance, target selection standards and coordinates EW assets to achieve strategic effects.', 'bf90e3b318de21107f17a6e65f5ca27fd075aec6de1a1b540ed844f4f7763354', 53, 53, null, 119, '2025-07-01', null, true, null),
  ('28c3a604-f59b-5a2b-afe4-ec36dc377fac', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '170D', 'CYBER CAPABILITIES DEVELOPER TECHNICIAN', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) A Basic-level Cyber Capability Developer Technician is proficient in programming languages at an intermediate level.
(b) A Basic-level Cyber Capability Developer Technician has a basic-level understanding of data structures, algorithms, object-oriented programming, secure design, operating systems, x86 assembly, and SQL.
(c) A Basic-level Cyber Capability Developer Technician is responsible for completing assigned tasks and modules, as required and assigned to him/her by a Senior- or Master-level Cyber Capability Developer Technician.', '6e68a16b601755bb391e9cd913665070cedd601137a8d91de7021469478762d0', 54, 55, null, 120, '2025-07-01', null, false, null),
  ('7b5514b4-0324-5b01-b853-c9d27886dbf9', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '170D', 'CYBER CAPABILITIES DEVELOPER TECHNICIAN', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Perform duties described in paragraph g (1).
(a) Manages, directs, and performs duties described in paragraph g(1).
(b) Serve as a senior capability developer technical lead.
(c) Executes capability development within a specialization area that aligns with their certification (Unix, Windows, Radio Frequency, networks, embedded systems, data science, or machine learning).
(d) Identifies new and emerging technologies, capabilities, and threat capabilities that affect cyber capability development efforts and focus.
(e) Trains, coaches, and mentors basic-level cyber capability developers to increase proficiency and prepare them for senior-level certification.
(f) Identifies and recommends mitigation strategies for gaps in processes, skill sets, access, capacity, and capability.
(g) Develops and executes training for knowledge and skill gaps within the team.
(h) Reviews and recommends adjustments to job qualification requirements and certification to ensure relevance and currency.
(i) Integrates cyber capability development into operational readiness assessments.
(j) Directs team-level cyber capability development.
(k) Manages team personnel.
(l) Assigns tasking and coordinates development efforts across teams.
(m) Interfaces with intelligence organizations and partners to synchronize cyber capability development efforts.', '34faa213f4b837ee307dd82297868f91ff7279f1c077aec9696df54642118fd1', 55, 55, null, 121, '2025-07-01', null, true, null),
  ('2746340f-be56-59f0-8135-3b733da0fb47', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '170D', 'CYBER CAPABILITIES DEVELOPER TECHNICIAN', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Perform duties described in paragraph g (2).
(b) A Master-level Cyber Capability Developer Technician has mastered their specialty and is responsible for providing guidance and technical direction over multiple projects in this specialty.
(c) A Master-level Cyber Capability Developer Technician mentors Senior-level Cyber Capability Developer Technicians as they progress to the Master level.
(d) Master Cyber Capability Developer Technicians provide the highest level of technical insight during the design of new software and hardware capabilities.', '133c07a3a29c05cacbe9c39bb765d2a5452f8885055b8e7d415da2d2d21724f9', 55, 55, null, 122, '2025-07-01', null, true, null),
  ('37fa3ebe-4578-5dac-bdf1-4838f74f5ded', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '170D', 'CYBER CAPABILITIES DEVELOPER TECHNICIAN', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Perform duties described in paragraph g (3).
(b) Directs capability development, integration, and management experience in support of offensive and defensive Cyberspace operations and frameworks, at all levels. (dc) Ensure that doctrinal Cyberspace capability integration procedures and techniques are taught at service schools and incorporated into Army, Joint and Coalition doctrine and training literature.
(d) Represent the Army and Cyberspace capability development activities at National and International technology and leadership forums.', 'c9cc2d054261a0302cd3f94fb3323db123b52c2a1cb206cdb66dc6dcd010ad0c', 55, 55, null, 123, '2025-07-01', null, true, null),
  ('17934b5a-0558-5e9d-a454-765578f2ddbc', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '180A', 'SPECIAL FORCES WARRANT OFFICER', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Command an Operational Detachment Alpha(ODA).
(b) Commands a task organized operational element as needed.
(c) Commands half the ODA during split team operations.
(d) Provides advise in the areas of Special Forces operational administration, intelligence, operations, logistics, civil-military affairs, and psychological operations.
(e) Develops, maintains, and continually updates operational plans and targeting data for deployable elements.
(f) Assists in the management of predeployment planning, training, and development of operational detachments.
(g) Develops, directs, supervises, and conducts training for U.S. and foreign military/paramilitary forces.
(h) Provides advice on all aspects of Special Forces operations and specialized training to include: Military Free Fall (MFF), Combat Dive, Special Operations Training (SOT), Survival Evasion Resistance Escape (SERE), Special Forces Target Interdiction (SOTI), Special Forces Advanced Reconnaissance Target Analysis and Exploitation (SFARTAEC), Advanced Special Operations Techniques (ASOT), Psychological Operations (PSYOP), and Civil Affairs (CA).
(i) Provides advise on the regional considerations of Special Forces operations in the operational environment based upon cultural awareness, regional ability and linguistic skills.', '98c47e1020ea77459721c5df5106ba2f558b28b1245204b91de406731d00ad9b', 57, 58, null, 124, null, null, false, null),
  ('a52cfd28-1294-5e72-9b82-abf9452adb6c', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '180A', 'SPECIAL FORCES WARRANT OFFICER', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1).
(b) Advises the Operational Detachment Bravo (ODB) commander on all matters pertaining to warrant officer assignments, professional development and accessions.', '45b3662d302180b5a8a9306a73d8f5c39c23d0022b58fabe44537083e87a685e', 58, 58, null, 125, null, null, true, null),
  ('9dc58e1d-efdb-5d9d-8327-b05dc095ac42', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '180A', 'SPECIAL FORCES WARRANT OFFICER', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(b) and (d-i).
(b) Advises the Battalion Commander on all matters pertaining to warrant officer assignments, professional development, and accessions.', 'bf53c64e26ccc806ec9aa0a8486cd34ecfa3a974ca28337ca56543795f91419b', 58, 58, null, 126, null, null, true, null),
  ('438b9c3e-2eb0-5e99-a236-798ddfc5d8dd', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '180A', 'SPECIAL FORCES WARRANT OFFICER', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1)(b) and (d-i).
(b) Advises the Group Commander on all matters pertaining to warrant officer assignments, professional development, and accessions.', 'ded435f8a002a7b87e3e456da10c24bab93ca7609129bfba813a92d98ec07547', 58, 58, null, 127, null, null, true, null),
  ('7e81b5a7-a0e1-53c6-90ac-caa57e97f92d', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '255A', 'DATA OPERATIONS WARRANT OFFICER', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Designs, builds, configures, operates, maintains, and sustains information systems and services within the Army’s portion of the cyberspace domain on the Department of Defense Information Networks (DODIN).
(b) Secures and protects data systems by maintaining a cybersecurity posture through the implementation of cybersecurity policies and the use of electronic keys for information systems.
(c) Advises the commander or Signal operations officer on the management and operation of Army information systems and services.
(d) May serve as an Data Operations Warrant Officer in a Brigade Combat Team, Multi- functional Brigade, Security Forces Assistance Brigade, or Expeditionary Signal Battalion Staff.
(e) May serve as Data Operations Warrant Officer in a Functional Brigade or Ranger Regiment Battalion Staff, Executive Communications Chief, or Sustainment Automation Support Management Office (SASMO).', '23e72f74f4d8983921aab13343fbbfbe4a49b7577f19fef068c39ad9e877a928', 59, 60, null, 128, null, null, false, null),
  ('1bb956fe-1e69-52fc-b0ff-7bdfab5b22fd', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '255A', 'DATA OPERATIONS WARRANT OFFICER', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Directs and performs duties described in paragraph g (1).
(b) Trains and supervises cyberspace information technology personnel on the operation, maintenance and sustainment of information systems and services enabling combat power projection for mission command.
(c) Focuses on data availability and content management by analyzing, collecting, processing, storing, disseminating, and securing information on-demand to facilitate warfighting and non- warfighting operations.
(d) Advises senior staff members, decision, and policy makers on Army information systems and services operations, training, policies, and procedures.
(e) May serve as an Data Operations Warrant Officer of Functional Brigade, Division, ASCC, or Joint staff.
(f) May serve as an Data Operations Warrant Officer at Regional Cyber Center, National or Joint Training Center, DISA, or WHCA.
(g) May serve as an Instructor/Writer, Capabilities Developer, or Special Operations Forces.
(h) May serve as the HRC SC Junior WO Assignments Manager or WOCC TAC Officer.', 'de15a5a4573b2feb62f200e7a8d9b295cef9246629e4ac8b6d5e69e5177ec565', 60, 60, null, 129, null, null, true, null),
  ('c94f1f67-274c-59e2-b3d7-2fa2ced24389', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '255A', 'DATA OPERATIONS WARRANT OFFICER', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g (2).
(b) Develops policy recommendations and provide technical guidance and advice to Commanders and staffs on the management and operation of Army, Joint, intergovernmental, interagency, and multinational information systems and services.
(c) May serve as senior Data Operations Warrant Officer of Corps/ASCC/ACOM/Joint staff.
(d) May serve as senior Data Operations Warrant Officer for Theater Signal CMD staff, DISA, Regional Cyber Center, JITC, or WHCA.
(e) May serve as senior Data Operations Warrant Officer as a Doctrine Writer or Capabilities Developer.
(f) May serve as the HRC SC Senior WO Assignments Manager or in Nominative Assignments.', '0276da35296214405661ff64a641e39e43a85bcf11f4fc7593d0ef43013be2ce', 60, 60, null, 130, null, null, true, null),
  ('19c24d7e-de8f-5cbe-9ce8-15fe706821b8', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '255N', 'NETWORK OPERATIONS WARRANT OFFICER', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Designs, builds, configures, operates, maintains, and sustains voice, video, and data networks within the Army’s portion of the cyberspace domain on the Department of Defense Information Networks (DODIN).
(b) Enables secure transmissions of networked information to support and enable mission command.
(c) Implements cybersecurity network policies and the use of electronic keys for transmission systems.
(d) Advises the commander or Signal operations officer of the status of assigned networks, sub- networks, and associated systems.
(e) May serve as a Network Systems Technician in a Brigade Combat Team, Multi-functional Brigade, or Security Forces Assistance Brigade staff.
(f) May serve as a Network Systems Technician in a Functional Support Brigade or Expeditionary Signal Battalion staff, or Cyber Protection Team.', 'ee9755512e721464a7c1d471004fd5deff7166d00d13790eec18f6e1110b53f9', 62, 62, null, 131, null, null, false, null),
  ('a3cb5e21-1481-578b-a2f6-6f59d36b93cb', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '255N', 'NETWORK OPERATIONS WARRANT OFFICER', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Direct and performs duties described in paragraph g (1).
(b) Trains and supervises cyberspace information technology personnel in the designing, building, configuring, operating, maintaining, securing, and sustaining networks, network systems equipment, network nodal devices, transmission and transport systems from the strategic level to the tactical edge.
(c) Leads frequency management to support communication networks.
(d) Advises senior staff members, decision, and policy makers on communication networks and transport systems operations, training, policies, and procedures.
(e) May serve as a Network Systems Technician of Functional BDE, Division, WHCA, NIE, JTIC, DISA staff or COCOM or ASCC Commander COMMO Team.
(f) May serve as a Network Systems Technician at a Regional Hub Node or Regional Cyber Center.
(g) May serve as an Instructor/Writer, WOCC TAC officer, Training Center O/C.
(h) May serve as senior Network Systems Technician in Nominative assignments.
(i) May serve as the HRC SC Junior WO Assignments Manager.', 'a5dc703618a7c1381e1176950804f74bb9dbf0effd8b99f722411b1ee2a7367b', 62, 62, null, 132, null, null, true, null),
  ('dc1583c8-d621-5916-a353-42b89f658fc3', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '255N', 'NETWORK OPERATIONS WARRANT OFFICER', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g (2).
(b) Develops policy recommendations and provides technical guidance and advice to commanders and staffs on the management and operation of Army, Joint, intergovernmental, interagency, and multinational communication networks and transport systems.
(c) May serve as senior Network Systems Technician of Functional BDE, JMC, TSOC, Corps staff.
(d) May serve as senior Network Systems Technician for DISA/COCOM/ACOM/ASCC/DRU Staff.
(e) May serve as senior Network Systems Technician for HQDA staff or in Nominative Assignments.
(f) May serve as the HRC SC Senior WO Assignments Manager.', '894f9a6edc387484f9957da41dfb346080ad8c8b9da09d2ce0d702188a1b4576', 62, 62, null, 133, null, null, true, null),
  ('f61a371f-3d26-517c-9c38-b0cd2c6ca9ee', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '255S', 'CYBERSPACE DEFENSE WARRANT OFFICER', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Design, build, configure, operate, and maintain cybersecurity capabilities and the implementation of a defensible network architecture in support of cyber operations internal defensive measures within the DODIN in order to enumerate, illuminate, locate, eradicate threats and respond to unauthorized activity, security alerts, attempted exploitation, data exfiltration, escalation, and any additional threats to mission command.
(b) Implements cybersecurity policies at all echelons, direct internal defensive measures across the integrated enterprise and tactical network, assist in cryptographic network (cryptonet) planning and supports Electromagnetic Spectrum Operations (EMSO) to reduce detection by electronic signature.
(c) Advises the commander or Signal operations officer on the management and operation of Army cybersecurity efforts to include the identification of key terrain, mission critical networks, nodes, applications and systems while operating within optimal, degraded, intermittent, or latent environments.
(d) May serve as an Cyberspace Defense Warrant Officerin a Brigade Combat Team, Multi-functional Support Brigade, Cyberwarfare Support Battalion, Security Forces Assistance Brigade, or Functional Support Brigade.', 'ac1b8c085316479f5786343c3924a0186dff59f678a6afa753ba7931e1969460', 64, 64, null, 134, null, null, false, null),
  ('86774f77-1c88-5f12-ad32-f2e340c55e56', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '255S', 'CYBERSPACE DEFENSE WARRANT OFFICER', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Directs and performs duties described in paragraph g (1).
(b) Trains and supervises cybersecurity personnel in the building, configuring, securing, defending, protecting, and sustaining cybersecurity equipment to maintain a protected network environment thus enabling combat power projection in all warfighting domains.
(c) Advises senior staff members, decision, and policy makers on cybersecurity efforts to include the identification of key terrain, mission critical networks, nodes, applications and systems while operating within optimal, degraded, intermittent, or latent environments.
(d) May serve as an Cyberspace Defense Warrant Officerin Theater Tactical Signal or Military Intelligence Brigades.
(e) May serve as an Cyberspace Defense Warrant Officerin Division, ASCC, Multi- Domain Task Force, or Joint staff organizations.
(f) May serve as an Instructor/Writer, Doctrine or Capabilities Developer in an Army or Joint service school.
(g) May serve as an Cyberspace Defense Warrant Officerat a Regional Cyber Center, DISA, or National or Joint Training Center.
(h) May serve as senior Cyberspace Defense Warrant Officerin Special assignments.
(i) May serve as the HRC SC Junior WO Assignments Manager or WOCC TAC Officer.', '982c8d402c31b262079cc8af271a6e2625c100d91feea7edef4132bcdfd8839b', 64, 65, null, 135, null, null, true, null),
  ('c8dcf80d-15c6-5989-a571-a5f4f2781c5e', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '255S', 'CYBERSPACE DEFENSE WARRANT OFFICER', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Directs and performs duties described in paragraph g (2).
(b) Provides technical guidance and advice to commanders and staffs on the management and operation of Army, Joint, intergovernmental, interagency, and multinational cybersecurity efforts to include the identification of key terrain, mission critical networks, nodes, applications and systems while operating within optimal, degraded, intermittent, or latent environments.
(c) May serve as senior Cyberspace Defense Warrant Officerof Corps/ASCC/ACOM/Joint staff.
(d) May serve as senior Cyberspace Defense Warrant Officerfor Theater Signal CMD staff, DISA, Regional Cyber Center, JITC, or WHCA.
(e) May serve as senior Cyberspace Defense Warrant Officeras a Doctrine Writer or Capabilities Developer.
(f) May serve as the HRC SC Senior WO Assignments Manager or in Nominative Assignments.', '593643e638ba183b435a408a844cd91df8fa3b4685e83a635642e2b4cf420adf', 65, 65, null, 136, null, null, true, null),
  ('03183cb0-8157-5c30-8e65-f315160ec998', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '255Z', 'SENIOR SIGNAL WARRANT OFFICER', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Provides technical guidance and expertise regarding operations and policies for information systems requirements, cybersecurity operations, network administration, and signal maintenance to support and enable mission command.
(b) Contributes to the MOS life cycle management for all personnel proponent functions to include the assignment process and oversee personnel management matters pertaining to Signal Branch.
(c) Coordinates and provides oversight for information technology contracting, procurement, and materiel acquisition programs.
(d) Develops policy recommendations and provide technical guidance and advice to commanders and staffs on the management and operation of cyberspace information technology data networks, systems, services, and cybersecurity activities of Army, Joint, intergovernmental, interagency, and multinational organizations.
(e) May serve as senior technical and tactical advisors for the Department of Defense Information Network (DODIN) operation at any echelon of command.
(f) May serve as the Senior Signal Warrant Officer for Theater Tactical Signal Brigade or Corps G6 staff.
(g) May serve as Career Program Manager or Technical Director for U.S. Army Signal School.
(h) May serve as Command Chief Warrant Officer for JCSE, WHCA, Theater Signal Commands, Senior Technical Advisor for ASCC, or ACOM G6 Staff.
(i) May serve as Regimental Chief Warrant Officer for U.S. Army Signal Regiment.
(j) May serve as Command Chief Warrant Officer for U.S. Army Network Enterprise Technology Command.
(k) May serve as Senior Signal Technical Advisor for DISA, COCOM, Joint J6 Staff, intergovernmental, interagency, or multinational partners.
(l) May serve as Chief Technology Officer for HQDA G6/CIO Staff.', 'f5d238c924c13eeddb9dd75c1de74620d05f08d5bfc98f78a2158d93c8043a07', 66, 67, null, 137, null, null, false, null),
  ('14eebf7d-39c8-591a-ae05-bb1354e9b315', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '270A', 'LEGAL ADMINISTRATOR', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', 'Performs and/or manages all activities pertaining to the processes and systems associated with the following core competencies in support of all JAGC Core Legal Disciplines:
(a) Legal Systems Integration and Innovation. Performs information management and systems integration, including protection of government information and attorney-client privileged information and attorney work product. Analyzes legal systems and processes and advises senior leader on quality assurance and internal control measures. Develops requirements and plans and mitigates risk. Facilitates AC/RC integration and partnership opportunities. Leads change with staff coordination and synchronization including ORSA and internal review activities. Manages facilities, technology, and logistics in support of legal operations in garrison and deployed environments across the full spectrum of operations.
(b) Knowledge Management. Assesses legal organization knowledge and performance and designs and leads development of solutions to knowledge gaps. Leads pilot/experimentation and change management initiatives. Performs quality control and quality assurances activities in support of legal operations.
(c) Resource management. Provides comprehensive management of all budgetary resources by determining budgetary requirements, procuring funding, planning and managing budgets, planning and executing contracts (including expert witnesses), and executing budgets in support of legal operations and special programs (including witness travel and special victim counsel program). Serves as claims investigating officer or on a Foreign Claims Commission in deployed environments.
(d) Legal Personnel Management. Manages all aspects of training and continuing legal education, certification, administration, and readiness of personnel serving in a legal office. Manages the special legal personnel and organizational programs. Coordinates historian and protocol activities. Serves as adjutant or assistant adjutant in legal support organizations and serves a Board Recorder in administrative separation boards (RC only).
(e) Force Management. Provides force management subject matter expertise by analyzing and monitoring manpower requirements and current and projected authorizations. Prepares manpower plans and coordinates force management documentation. Resources manning documents.
(f) Security. Serves as security manager for assigned organizations. Responsible for all security requirements in accordance with applicable regulations including: physical security, information security, personnel security, communications security (COMSEC), and anti- terrorism/force protection. Provides Operations Security oversight and plans Continuity of Operations. Coordinates with military agencies for proper building and personnel security in high- profile courts-martial cases.', '866f2a667dc46ac64d09aae3282530be615b94b336ce75c02fc85bda57194ba6', 68, 69, null, 138, null, null, false, null),
  ('61ef242a-ecdb-544d-962d-fea4ead28d37', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '270A', 'LEGAL ADMINISTRATOR', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph h(1) with increased knowledge and expertise. Recruits and assesses potential JAGC warrant officer applicants.
(b) Provides guidance and technical assistance to subordinate legal elements and/or other staff elements.', '18cd05183815f06a994592801bcefba3ef103b5444d1a21cf3ecc5662f349bc6', 69, 69, null, 139, null, null, true, null),
  ('0bbae1f7-f869-5357-8c8b-f2939b919ce0', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '270A', 'LEGAL ADMINISTRATOR', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph h(1)& h(2) and mentors subordinate JAGC Warrant Officers.
(b) Educates members of the JAGC through formal programs of instruction.', 'abe4fe3464c7f8e5bc49445d28952c7464ba078bb238bfc09a2338e20fbceee7', 69, 69, null, 140, null, null, true, null),
  ('eaee463d-1421-5a87-a862-71013c2d7350', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '270A', 'LEGAL ADMINISTRATOR', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph h(1), h(2) & h(3).
(b) Responsible for MOS proponency and career management functions.
(c) Provides Knowledge Management expertise for the JAG Corps.', '9c445ee5a05a29d602148303908893ce9b4176344ac9d64590bbec014e76c36c', 69, 69, null, 141, null, null, true, null),
  ('f0694933-c429-5c23-8721-3200916b055b', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '280A', 'Software Operations Technician', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) A Basic-level Software Operations Technician leverages fundamentals of software development using basic programming language features, fundamental cybersecurity and secure software development concepts, Product Management, standard software architecture, software development engineering practices, platform engineering practices, and employing scripting languages at an intermediate level.
(b) A Basic-level Software Operations Technician – Software Development Engineer has a basic-level understanding of the software development discipline, common data structures and algorithms, basic software architecture patterns, prototyping, object-oriented and functional programming, secure software development principles, and database architecture and design. Includes modules of Software Development Core Competencies, Cyber Security Fundamentals, Micro Service Applications, and Containerization Fundamentals. Responsible for full-stack web application development, low-code/no-code application development, digital-system plug-ins, and common operating picture plug-ins.
(c) A Basic-level Software Operations Technician – Platform Engineer understands the foundational concepts involved with software and platform development disciplines with an emphasis on infrastructure, application hosting, and container orchestration. Includes modules of Platform Development Operations Core Competencies, Cyber Security Fundamentals. Administers platform applications for software development teams to develop, deploy, and scale their applications.
(d) Complete assigned tasks and modules, as required and assigned by a Senior- or Master-level Software Operations Technician.', 'f653ee26b611c8f856224c037e6b7a6495f02bd10000e3ff70c21dc0b8c2bb0f', 70, 71, null, 142, '2025-07-01', null, false, null),
  ('e9eb205c-d238-5cb3-8164-9a121070a93f', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '280A', 'Software Operations Technician', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Perform duties described in paragraph g (1).
(b) A Senior-level Software Operations Technician leverages Lean and Agile methodologies and management practices to lead software development and platform engineering teams through the creation and management of software and platform projects.
(c) A Senior-level Software Operations Technician must have senior-level expertise within a specialized focus area and possess a deep understanding of the product development lifecycle and DevSecOps. Collaborates with and advises adjacent software operations specialties on technical direction, risk mitigation, and impacts to a project’s overall engineering efforts. Propagates a deep understanding of testing methodologies and code/infrastructure development. Consolidates operational lessons learned from subordinate echelons and informs Master-level engineers of unique challenges or project impediments. Integrates new practices or technologies into current operations. Also provides training, guidance, oversight, and direction to Basic-level Software Operations Technicians working under their tutelage. Provides mentorship and talent management for career progression of Junior Warrant Officers. Responsible for decomposing projects into components which can be assigned to Basic-level Software Operations Technicians.
(d) A Senior-level Software Operations Technician – Software Development Engineer serves on a cross-functional team leveraging an advanced-level of understanding of programming language features, software architecture design patterns, and programming concepts to build cloud-native and mobile applications or plugins. Develops and facilitates training pathways for Junior Software Development Engineers. Enforces industry best practices, such as secure software development, pair-programming, and test-driven development standards across the organization.
(e) A Senior-level Software Operations Technician – Platform Engineer understands and employs the software and platform development disciplines with an emphasis on infrastructure, application hosting, and container orchestration. Includes modules of Platform Development Operations Advanced Competencies, Cyber Security Best Practices, Containerization Operations, and managing a Continuous Integration/Continuous Deployment (CI/CD) Pipeline. Develops and maintains application teams’ path to production, services, tooling, and DevSecOps platform. Leverages platform engineering principles to host cloud-native applications for software development teams to develop, deploy, and scale their applications. Enforces industry best practices and standards across the organization.
(f) A Senior-level Software Operations Technician is responsible for completing assigned tasks and modules, as required and assigned by a Master-level Software Operations Technician.', '87119de64827a25d9ef436b426c83523ebaa0ee39cd66842f3e9c852c67108b1', 71, 71, null, 143, '2025-07-01', null, true, null),
  ('101911e5-68a5-5e97-bf03-052b012194fe', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '280A', 'Software Operations Technician', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Perform duties described in paragraph g (2).
(b) A Master-level Software Operations Technician possesses skills in negotiation, policy analysis, and development. Can demonstrate knowledge in force management and emerging technologies.
(c) Serve as a principal advisor to decision and policy makers on Software Operations training, policies, and procedures in areas of software development, platform engineering, and security principles. Responsible for collaborating on operational and strategic-level solutions.
(d) Must have Master-level expertise within a specialized focus area and is responsible for advising, aligning, and directing organizational technical infrastructure. Informs design patterns, technologies, and practices that achieve organizational outcomes while reinforcing training career progression opportunities for software operations cross-functional teams.
(e) Set conditions for intermediate and senior level Software Operations Technicians to mentor more junior level Software Operations Technicians in product development lifecycle and DevSecOps.
(f) Mentor Senior-level Software Operations Technician as they progress to the Master level.', '555d39672f519c0fb1061069cab6d2dfb30440e5b059e42f41a10417bba05b4d', 71, 72, null, 144, '2025-07-01', null, true, null),
  ('fc81df61-6daa-5d34-96c9-e3c6c2b30fff', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '280A', 'Software Operations Technician', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Perform duties described in paragraph g (3).
(b) Deliver master-level technical and tactical expertise on the primary duties of technical leader, manager, multidiscipline Software Operations integrator, and advisor.
(c) Provide direction, guidance, resources, assistance, and supervision necessary for subordinates to perform their duties.
(d) Support commanders with the development of new Software Operations doctrine, organizational structure, methods and equipment to be utilized by Software Operations Technicians.
(e) Provide leader development, talent and lifecycle management, mentorship, advice, and counsel to enlisted Soldiers, warrant officers, and branch officers.
(f) Possess special leadership abilities that interprets the commander’s intent and mission to support Multi-Domain Operations (MDO), representing and advising on the responsibilities of Software Operations within their respective AOR.
(g) Primarily support corps, echelons above corps, major command, Joint, Interagency, Intergovernmental, and Multinational operations.', '1d7678fbc04a4b5c066d1cc751cf2f2b0486784ce353924c2bc0778985170a53', 72, 72, null, 145, '2025-07-01', null, true, null),
  ('47ffb3b9-6134-5563-a3a5-fb0754bb87d4', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '311A', 'CID SPECIAL AGENT', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Investigate felony and other significant crime of Army interest as defined by regulations, military, and federal law.
(b) Plans, organizes, conducts, and supervises overt and covert investigations.
(c) Examines and processes crime scenes.
(d) Collects, preserves, and evaluates physical evidence for scientific examination by laboratories and use in judicial proceedings.
(e) Obtains and executes arrest and search warrants.
(f) Conducts raids and task force operations.
(g) Interviews and interrogates victims, witnesses, suspects, and subjects and obtain written statements executed under oath.
(h) Develops, evaluates, and manages informants and other sources of criminal intelligence.
(i) Represents the Army''s interest in investigations conducted collaterally with the Department of Defense, Department of Justice, and other federal, state, and local investigative agencies.
(j) Maintains close working relationships with attorneys of the Staff Judge Advocate and the United States Attorney''s Office, and testify at Courts-Martial, Federal District Court, and other judiciary tribunals.
(k) Writes, reviews, and approves technical investigative reports.
(l) Conducts and supervises technical surveys of Army elements and activities which analyze and detect on-going crime, and recommends actions to prevent crime which could result in significant economic loss and reduced combat effectiveness.
(m) Conducts personnel security vulnerability assessments for designated senior Army officials.
(n) Provides personnel security for designated Department of Defense executives, visiting foreign officials, and other key officials.
(o) Performs hostage negotiations
(p) Perform duties as Digital Forensics Examiner, Polygraph Examiner, Field Office Tactics Advisor, Field Training Agent, Tech Agent, Forensic Science Consultant.', 'eea0255421e88fdd59dda9794a1a8a72a2a6562bd09ec32b1e67a38dafb7a862', 76, 77, null, 146, null, null, false, null),
  ('151de2ad-ff84-51e4-9bb7-f29ee649d09a', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '311A', 'CID SPECIAL AGENT', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph h(1).
(b) Provides technical guidance and direction to subordinate investigative units.
(c) Trains new Special Agents on duties described in paragraph h(1).
(d) Performs duties as Branch Chief, Training Developer, Instructor/SGL at DACID Training Academy, Assistant Detail Leader, Senior Field Training Agent, Senior Digital Forensic Examinaer.', '36fb53960951ff40b2f36f003083a92eda0cdf039ba7e626bed467b068f6c369', 77, 77, null, 147, null, null, true, null),
  ('e3aa8df4-3e0f-5c46-bf86-6f5d5a0cf399', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '311A', 'CID SPECIAL AGENT', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph h(1-2).
(b) Supervises investigative case management and overall investigative operations.
(c) Supervises the technical performance of subordinate personnel in related job skills.
(d) Performs duties as the Senior Supervisory Agent, Detail Leader, and Detailed IG,', '19f86ae4c8e95717e49cbdc68fd82ff3e417634a4ea030d81df319492223f09f', 77, 77, null, 148, null, null, true, null),
  ('2e0541e3-c642-54ab-9877-777168f95888', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '311A', 'CID SPECIAL AGENT', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph h(1-3).
(b)
(c) Supervises and provides guidance and technical advice to subordinate investigative units or other staff elements.
(d) Performs duties as Liaison Officer for Army Commands., Chief, DACID Training Academy.
(e) Performs duties as the Warrant Officer Advisor to the Director, Army CID.', '7ba2f8fb02e6a6f05a1b6e70664d3596342dbba719e2f210c830e7bef1462aa9', 77, 77, null, 149, null, null, true, null),
  ('9ac65008-bbd1-572e-aa1b-ac0392a6f603', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '350F', 'ALL SOURCE INTELLIGENCE TECHNICIAN', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) The All-Source Intelligence Technician (350F) serves as the expert in charge of intelligence analysis and synchronization at multiple echelons.
(b) Responsible for the analysis of information collected from all intelligence sources and intelligence disciplines into finished intelligence analysis in support of commander’s decision- making.
(c) Advises the commander, staff elements, and intelligence leadership on intelligence planning considerations through analysis and tailored Intelligence products.
(d) Manages functions within the intelligence process, military decision-making process, and targeting cycle.
(e) Integrates use of automation in support of intelligence analysis and maintains databases to support intelligence processes.
(f) May serve as a BISE Chief.
(g) May serve as a Discipline Analyst or Functional Manager. —
(h) May serve as the Analysis and Fusion Section Officer-in-Charge (OIC)
(i) May serve as the Intel Current Ops Team Lead
(j) May serve as the Target Development Section OIC
(k) May serve as an instructor for Foundry or within a Military Training Center
(l) May serve as Chief of OSINT Collection', 'bd8d17ea41bccb904ae46feb486d8715c151bf543a9b8dc17addde9113368af7', 78, 78, null, 150, null, null, false, null),
  ('fbb4187d-2ddc-57e6-8df2-8f3cd066446c', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '350F', 'ALL SOURCE INTELLIGENCE TECHNICIAN', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Directs and performs duties described in paragraph (1).
(b) May serve as an instructor at USAICoE, within a Foundry program, or at a Military Training Center.
(c) May serve on the Military Intelligence Brigade or Battalion staff.
(d) May serve as a commander or OIC as identified in unit manning document or as required.
(e) May serve as an instructor at the WOCC.
(f) May serve as a TRADOC doctrine or battle lab Officer.
(g) May serve as the ACE or Fusion section OIC.
(h) May serve as the senior intelligence analyst for a Corps regional team, Special Operations Group, or within a Combined Joint Task Force.
(i) May serve as a collection manager or deputy collection manager.', 'cb1c37b03363aabf96a076faa2f23c1c51b19458f3af863a8586f678ccf585cb', 79, 79, null, 151, null, null, true, null),
  ('7aaa7e74-a8a7-5bfa-80b4-d661396291a3', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '350F', 'ALL SOURCE INTELLIGENCE TECHNICIAN', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Directs and performs duties described in paragraph g(1) and g(2).
(b) May serve as a Division or Corps Fusion Chief.
(c) May serve as a Discipline Collection Manager at any echelon.
(d) May serve as an OC/T at a CTC or MCTP.
(e) May serve as a Doctrine Writer.
(f) May serve as a Detachment or Company Commander.
(g) May serve as an instructor at the WOCC, or at 111 th MI BDE.
(h) May serve on the Joint or Combined Staff.
(i) May serve as a Doctrine or Capabilities Developer.
(j) May serve as the HRC MI WO Assignments Manager.', 'bc1d7f57232acca7e05a77b1b340a21521c1bfc55dff272d0c64e15b8eb055b2', 79, 79, null, 152, null, null, true, null),
  ('8785be86-28e0-569b-99a1-4d98d8dfebf8', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '350F', 'ALL SOURCE INTELLIGENCE TECHNICIAN', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) MI CW5s are proficient in the duties described in the duties paragraphs of one or more MI WO MOSs.
(b) MI CW5s are branch technical experts and master-level technical and tactical experts who perform the primary duties of technical leader, manager, multidiscipline intelligence integrator, and advisor.
(c) Provide direction, guidance, resources, assistance, and supervision necessary for subordinates to perform their duties
(d) Provide leader development, talent and lifecycle management, mentorship, advice, and counsel to enlisted Soldiers, warrant officers, and branch officers and have special warrant officer leadership and representation responsibilities within their respective commands.
(e) Primarily support division, corps, echelons above corps, and major command operations.
(f) Advise commanders and branch assignment managers on the assignments and placement of Military Intelligence warrant officers world-wide.
(g) Provide essential advice to commanders on warrant officer issues and perform other officer level duties as required consistent with senior staff officer responsibilities.
(h) May serve as the Senior WO advisor in MOS immaterial (011A) billets based on technical knowledge and understanding of Army and Joint doctrine
(i) May serve on the Army Staff.
(j) May serve as a Capabilities Branch Chief.
(k) May serve as the MI WO Proponent.
(l) May serve as the CCWO of the MI Branch.
(m) MI Senior Field Grade Warrant Officers must have competed the WO Senior Service Education Course prior to nomination for specified CW5 billets.', '315ea1f8d053d2def11ec97b48d0dedce9254f0d4ac0fe8c9df8d550265055ee', 79, 79, null, 153, null, null, false, null),
  ('729b910f-c9fe-5c02-98b7-124a8443fa5d', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '350G', 'GEOSPATIAL INTELLIGENCE IMAGERY TECHNICIAN', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Directs Geospatial Intelligence (GEOINT) Operations.
(b) Projects GEOINT Requirements in Support of Unified Land Operations.
(c) Directs GEOINT in Support of Joint Targeting; Coordinates GEOINT Tasking, Collection, Processing, Exploitation, and Dissemination (TC-PED).
(d) Manages GEOINT architecture.
(e) Serves as advisor to the Command and staff on GEOINT operations, training, policies, and procedures.
(f) Manages GEOINT support to the Military Decision Making Process (MDMP).
(g) Employs external capabilities, and integrates automation ISO GEOINT operations.
(h) May serve as the GEOINT Section OIC at any echelon.
(i) May serve as the GEOINT Production Team Chief at any echelon.
(j) May serve as a GEOINT Functional Manager.
(k) May serve as a Collection Manager.', 'd7725744645befbb4631f7cd932620912ae884cff33a0e72517320b1c5ab03d4', 81, 81, null, 154, null, null, false, null),
  ('370e3e19-5fb2-5f15-b5b4-0340e8d60f3d', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '350G', 'GEOSPATIAL INTELLIGENCE IMAGERY TECHNICIAN', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Directs, plans, and performs duties shown in paragraph g(1).
(b) Serves as the principal advisor to senior staff members, decision, and policy makers on GEOINT operations, training, policies, and procedures.
(c) Directs GEOINT operational coordination with Joint, Interagency, Intergovernmental, and Multinational partners.
(d) Develops and plans all GEOINT operations IAW applicable laws, policies and treaties.
(e) May serve as a Discipline Collection Manager at any echelon.
(f) May serve as a Doctrine Writer.
(g) May serve as an OC/T at a CTC or MCTP.
(h) May serve as a Detachment Commander.
(i) May serve as an instructor at the WOCC, or at 111 th MI BDE.
(j) May serve on the Joint or Combined Staff.
(k) May serve as a Doctrine or Capabilities Developer.', '57fa9c677d2b64a25a043d215bdacc15e3a0ba0eaf97a7fc16f361ae19a8815c', 81, 82, null, 155, null, null, false, null),
  ('f94be0ff-6fad-5f6f-8b8d-c20ac9f699b5', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '350G', 'GEOSPATIAL INTELLIGENCE IMAGERY TECHNICIAN', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Manages, directs, plans, and performs duties shown in paragraph g(1) and g(2).
(b) Serves as the principal advisor to senior staff members, decision, and policy makers on GEOINT operations, training, policies, and procedures.
(c) Directs GEOINT operational coordination with Joint, Interagency, Intergovernmental, and Multinational partners.
(d) Develops and plans all GEOINT operations IAW applicable laws, policies and treaties.
(e) May serve as a Discipline Collection Manager at any echelon.
(f) May serve as an instructor at the WOCC, or at 111 th MI BDE.
(g) May serve on the Joint or Combined Staff.
(h) May serve as a Doctrine or Capabilities Developer.
(i) May serve as HRC MI WO Assignments Manager.', '5d2f260528edbe82d3f7a9bdd2db1ca85126506a40ff580587ba25f797b44985', 82, 82, null, 156, null, null, false, null),
  ('a9f41771-d998-56ab-b79e-3d12d4ba06e0', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '350G', 'GEOSPATIAL INTELLIGENCE IMAGERY TECHNICIAN', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) MI CW5s are proficient in the duties described in the duties paragraphs of one or more MI WO MOSs.
(b) MI CW5s are branch technical experts and master-level technical and tactical experts who perform the primary duties of technical leader, manager, multidiscipline intelligence integrator, and advisor.
(c) Provide direction, guidance, resources, assistance, and supervision necessary for subordinates to perform their duties.
(d) Provide leader development, talent and lifecycle management, mentorship, advice, and counsel to enlisted Soldiers, warrant officers, and branch officers and have special warrant officer leadership and representation responsibilities within their respective commands
(e) Primarily support division, corps, echelons above corps, and major command operations.
(f) Advise commanders and branch assignment managers on the assignments and placement of Military Intelligence warrant officers world-wide.
(g) Provide essential advice to commanders on warrant officer issues and perform other officer level duties as required consistent with senior staff officer responsibilities.
(h) May serve as the Senior WO advisor in MOS immaterial (011A) billets based on technical knowledge and understanding of Army and Joint doctrine.
(i) May serve on the Army Staff.
(j) May serve as a Capabilities Branch Chief.
(k) May serve as the MI WO Proponent.
(l) May serve as the CCWO of the MI Branch.
(m) MI Senior Field Grade Warrant Officers must have competed the WO Senior Service Education Course prior to nomination for specified CW5 billets', 'cad6a1081a16a38bba8b1411bcd28ad56648546735e246f40a3f1c1b68a862f3', 82, 82, null, 157, null, null, false, null),
  ('6b6923ef-1a2f-5cd8-80d7-67fd02d39abb', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '351L', 'COUNTERINTELLIGENCE TECHNICIAN', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Directs CI Operations and Investigations as the principal advisor to the Command and staff on CI and other intelligence Operations, training, policies and procedures.
(b) Manages CI support to the Military Decision Making Process (MDMP).
(c) Employs internal and external capabilities and integrates analysis and automation ISO CI Operations.
(d) Conducts all CI activities IAW applicable laws and policies.
(e) Serves as a Senior CI Technician responsible for areas of operation within tactical and operational environments worldwide.
(f) Performs duties in support of the Threat Awareness and Reporting Program (TARP) and unit Covering Agent Program (CAP) to provide CI Assistance, knowledge, and reporting procedures.
(g) Performs evidence custodian duties; directs the CI application process and conducts CI mission management.
(h) May serve as a CI Team Chief.
(i) May serve as OMT Chief.
(j) May serve as BCT S2X CI Tech
(k) May serve as CI Field Office/Investigations Team Leader.', 'e0f969bfc391c5d252264edece7b52a89f3f593beeded9e9b4319edda9e4257c', 84, 84, null, 158, null, null, false, null),
  ('15b77968-8995-52a3-a81b-4ce400beb1fc', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '351L', 'COUNTERINTELLIGENCE TECHNICIAN', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Directs and performs duties described in paragraph g(1).
(b) Directs and supervises all CI elements, activities, special investigative, and collection techniques in Operational and Strategic environments worldwide
(c) Provides CI technical control, oversight, and management
(d) Conducts CI operational coordination with joint, intergovernmental, and multinational partners.
(e) May serve as a Doctrine Writer.
(f) May serve as a Detachment Commander.
(g) May serve as an instructor at the WOCC, or at 111 th MI BDE.
(h) May serve on the Joint or Combined Staff.
(i) May serve as a Doctrine or Capabilities Developer.', 'b3d7b75156e3941ec5e13392ac60123c33f945a3424acb8d739c31055c069d63', 84, 85, null, 159, null, null, true, null),
  ('70f1cd6a-6646-5d49-bf09-24bc3cb1f673', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '351L', 'COUNTERINTELLIGENCE TECHNICIAN', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Manages, directs and performs duties shown in paragraph g(1) and g(2).
(b) Directs and supervises all CI elements, activities, and special investigative, and collection techniques in Operational and Strategic environments worldwide.
(c) Provides CI technical control, oversight, and management.
(d) Conducts CI operational coordination with joint, intergovernmental, and multinational partners.
(e) Serves as the principal advisor to senior staff members, decision, and policy makers.
(f) Provides advice and assistance to the Commander/Senior Intelligence officer on all CI capabilities, activities, and policies and other intelligence operations.
(g) Develops and plans all CI operations IAW applicable laws and policies.
(h) May serve as a Doctrine Writer.
(i) May serve as a Detachment Commander.
(j) May serve as an instructor at the WOCC, or at 111 th MI BDE.
(k) May serve on the Joint or Combined Staff.
(l) May serve as a Doctrine or Capabilities Developer.
(m) May serve as the HRC MI WO Assignments Manager.', '474be00526858a14849f0d22c195eb3219880b6beb41e7827c41e4fb47711396', 85, 85, null, 160, null, null, false, null),
  ('88d86edd-95f0-517e-82da-955c9e04fc57', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '351L', 'COUNTERINTELLIGENCE TECHNICIAN', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) MI CW5s are proficient in the duties described in the duties paragraphs of one or more MI WO MOSs.
(b) MI CW5s are branch technical experts and master-level technical and tactical experts who perform the primary duties of technical leader, manager, multidiscipline intelligence integrator, and advisor.
(c) Provide direction, guidance, resources, assistance, and supervision necessary for subordinates to perform their duties.
(d) Provide leader development, talent and lifecycle management, mentorship, advice, and counsel to enlisted Soldiers, warrant officers, and branch officers and have special warrant officer leadership and representation responsibilities within their respective commands
(e) Primarily support division, corps, echelons above corps, and major command operations.
(f) Advise commanders and branch assignment managers on the assignments and placement of Military Intelligence warrant officers world-wide.
(g) Provide essential advice to commanders on warrant officer issues and perform other officer level duties as required consistent with senior staff officer responsibilities.
(h) May serve as the Senior WO advisor in MOS immaterial (011A) billets based on technical knowledge and understanding of Army and Joint doctrine.
(i) May serve on the Army Staff.
(j) May serve as a Capabilities Branch Chief.
(k) May serve as the MI WO Proponent.
(l) May serve as the CCWO of the MI Branch.
(m) MI Senior Field Grade Warrant Officers must have competed the WO Senior Service Education Course prior to nomination for specified CW5 billets', 'cad6a1081a16a38bba8b1411bcd28ad56648546735e246f40a3f1c1b68a862f3', 85, 85, null, 161, null, null, false, null),
  ('a9385874-e32c-583e-bb2f-680e13a0a520', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '351M', 'HUMAN INTELLIGENCE COLLECTION TECHNICIAN', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Plans and directs interrogation operations, source operations, debriefing operations, screening operations, intelligence liaison operations, and HUMINT analysis.
(b) Plans and directs HUMINT scheme of support to multi-domain operations.
(c) Integrates cultural intelligence and analysis into HUMINT operations.
(d) Serves as the principal advisor to the Command and staff on HUMINT operations, training, policies, and procedures.
(e) Performs and manages HUMINT support to the Military Decision Making Process (MDMP).
(f) Plans Army HUMINT architecture.
(g) Requests, integrates, and employs external capabilities to support HUMINT operations.
(h) Performs duties of Operational Management Team Chief, Interrogation Control Element Chief, HUMINT Collection Platform Chief, HUMINT Analysis Cell Chief, and HUMINT staff officer in an S/G2X.
(i) May oversee unit language training program.
(j) Coordinates with external agencies as needed in support of HUMINT operations.
(k) Conducts all HUMINT operations at every echelons IAW applicable laws, policies, treaties, regulations, and unit SOP.
(l) May serve as a HUMINT Team/Section Chief at any echelon.
(m) May serve as OMT Chief.
(n) May serve as BCT S2X HUMINT Tech.', '7436135c1d11c566e6726277677af0c3e3dfce5e078e2283ba7dd26ed4f198b9', 87, 88, null, 162, '2024-10-01', null, false, null),
  ('933d507a-d2f5-535e-875e-d1a01ed78131', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '351M', 'HUMAN INTELLIGENCE COLLECTION TECHNICIAN', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Directs and performs duties described in paragraph e(1).
(b) Synchronizes and assesses interrogation operations, source operations, debriefing operations, screening operations, intelligence liaison operations, and HUMINT analysis.
(c) Plans and directs HUMINT scheme of support to Army, Joint, and combined operations.
(d) Serves as the principal advisor to Army, Joint, and combined commands and staffs on HUMINT operations, training, policies, and procedures.
(e) Performs and manages HUMINT support to the Army, Joint, and combined planning processes.
(f) Plans, directs, and integrates HUMINT architecture.
(g) May oversee command language training program.
(h) Performs duties of HUMINT Operations staff officer in a G/J/C2X.
(i) Conducts all HUMINT operations IAW applicable laws, policies, treaties, regulations, and unit SOP.
(j) May serve as an instructor at the WOCC, or at 111 th MI BDE.
(k) May serve on the Joint or Combined Staff.
(l) May serve as a Doctrine or Capabilities Developer.
(m) May serve as an OC/T at a CTC or MCTP.', '440e4faf276f0f77b6af13264962cb8121b627c0330fa0c24bd46274af8fd9db', 88, 88, null, 163, '2024-10-01', null, true, null),
  ('3580f22a-b613-5c5b-bb7d-2a001eae0f29', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '351M', 'HUMAN INTELLIGENCE COLLECTION TECHNICIAN', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Manages, directs and performs duties shown in paragraph e(1) and e(2)
(b) Synchronizes and assesses interrogation operations, source operations, debriefing operations, screening operations, intelligence liaison operations, and HUMINT analysis in Joint and Combined environments.
(c) Plans and directs HUMINT scheme of support to Joint and Combined operations.
(d) Serves as the principal advisor to Joint/Combined commands and staffs on HUMINT operations, training, policies, and procedures.
(e) Performs and manages HUMINT support to the Joint and Combined planning processes.
(f) Plans, directs, and integrates Joint and Combined HUMINT architecture.
(g) Performs duties of HUMINT Operations staff officer in a G/J/C2X.
(h) Conducts all HUMINT operations IAW applicable laws, policies, treaties, regulations, and unit SOP.
(i) May serve as the HRC MI WO Assignments Manager.
(j) May serve as the MI WO Proponent.', '88e8de05b374de95f5f60f6eeac229ae0702ca9e207bb0f5032770c00fd7da73', 88, 88, null, 164, '2024-10-01', null, false, null),
  ('6d28bbee-dc28-5d05-a7c3-a1dfdb3b6855', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '351M', 'HUMAN INTELLIGENCE COLLECTION TECHNICIAN', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Manages, directs and performs duties shown in paragraph g(1), g(2), and g(3).
(b) MI CW5s are proficient in the duties described in the duties paragraphs of one or more MI WO MOSs.
(c) Develops and integrates policy governing interrogation operations, source operations, debriefing operations, screening operations, intelligence liaison operations, and HUMINT analysis for Army, Unified Combatant Command (UCC), DoD, and National Agency.
(d) Assesses and ensures readiness of Army HUMINT workforce.
(e) Serves as the principal advisor to HQDA, UCC, DoD, and National Agency on HUMINT operations, training, policies, and procedures.
(f) May oversee Army, UCC, DoD, and National Agency language training program.
(g) Performs duties of HUMINT Operations staff officer in a G/J/C2X, Senior Warrant Officer Advisor, or the Army Senior HUMINT trainer.
(1) MI CW5s are branch technical experts and master-level technical and tactical experts who perform the primary duties of technical leader, manager, multidiscipline intelligence integrator, and advisor.
(2) Provide direction, guidance, resources, assistance, and supervision necessary for subordinates to perform their duties.
(3) Provide leader development, talent and lifecycle management, mentorship, advice, and counsel to enlisted Soldiers, warrant officers, and branch officers and have special warrant officer leadership and representation responsibilities within their respective commands.
(4) Primarily support division, corps, echelons above corps, and major command operations.
(5) Advise commanders and branch assignment managers on the assignments and placement of Military Intelligence warrant officers world-wide.
(6) Provide essential advice to commanders on warrant officer issues and perform other officer level duties as required consistent with senior staff officer responsibilities
(h) Conducts all HUMINT operations IAW applicable laws, policies, treaties, regulations, and unit SOP.
(i) May serve as the Senior WO advisor in MOS immaterial (011A) billets based on technical knowledge and understanding of Army and Joint doctrine.
(j) May serve on the Army Staff.
(k) May serve as a Capabilities Branch Chief.
(l) May serve as the MI WO Proponent.
(m) May serve as the CCWO of the MI Branch.
(n) MI Senior Field Grade Warrant Officers must have competed the WO Senior Service Education Course prior to nomination for specified CW5 billets.', '2b650a1ea88867e89ef07421d224e1a7227a8f503de9f4b7228a562be867e535', 88, 89, null, 165, '2024-10-01', null, false, null),
  ('70930394-c4fa-595b-bbef-8725ca710120', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '351Y', 'AREA INTELLIGENCE TECHNICIAN', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(see AR 614-115).', 'bc437b419602c06bb0a95906eb85e6243fc770da4a3ef7360cccf79d1abf5680', 90, 90, null, 166, null, null, false, null),
  ('420e623b-deb9-5d0e-8c71-e5bc85b55cf9', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '351Y', 'AREA INTELLIGENCE TECHNICIAN', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(see AR 614-115).', 'bc437b419602c06bb0a95906eb85e6243fc770da4a3ef7360cccf79d1abf5680', 90, 90, null, 167, null, null, false, null),
  ('613b32fd-2d8a-5e9a-b8e8-d7868632afe5', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '351Y', 'AREA INTELLIGENCE TECHNICIAN', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(see AR 614-115).', 'bc437b419602c06bb0a95906eb85e6243fc770da4a3ef7360cccf79d1abf5680', 90, 90, null, 168, null, null, false, null),
  ('7b4965b4-0884-5681-b4ab-728777bbd103', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '351Y', 'AREA INTELLIGENCE TECHNICIAN', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(see AR 614-115).', 'bc437b419602c06bb0a95906eb85e6243fc770da4a3ef7360cccf79d1abf5680', 90, 90, null, 169, null, null, false, null),
  ('583b986b-2e29-55de-a7b2-c560fa502417', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '351Z', 'ATTACHE INTELLIGENCE OPERATIONS TECHNICIAN', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Leads joint operations and administrative support teams in Defense Attaché Offices (DAO) at diplomatic missions worldwide.
(b) Serves as principle advisor to the Senior Defense Official/Defense Attaché (SDO/DATT) and ensures operations are conducted in accordance with requisite policies.
(c) Represents the Department of Defense (DOD as diplomat and conducts liaison with host nation and third country officials per diplomatic protocols.
(d) Conducts inter-agency coordination with embassy partners to further DOD efforts and advance US foreign-policy.
(e) Synchronizes the DAO operations, performs management in support of strategic reporting and ensures compliance with relevant regulations and policies.
(f) Facilitates DOD activities in foreign countries by providing operational, administrative, and logistical support to personnel caring out of DOD initiatives.
(g) Serves as a key contributor to the embassy country team and advocates for DOD equities.
(h) Advises DOD personnel on embassy operations and inter-agency processes.
(i) Plans and manages DAO Administration, policy compliance, finance personnel, reporting, security and logistics.', '0d53c47abb8ebae8485f8145a6c7c45071727dceb7a3178b71141be557a70708', 91, 91, null, 170, null, null, false, null),
  ('99cd6b62-580f-5ee3-972e-a86780e4c541', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '351Z', 'ATTACHE INTELLIGENCE OPERATIONS TECHNICIAN', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1).
(b) Conducts inspections of both Defense Intelligence Agency internal elements and Defense Intelligence Agency military personnel, and investigations as directed by the Defense Intelligence Agency Inspector General.', '14264511246161b8f5017cab13ee6251f62ee02bf6cc01f98c9f4f70f16e99c6', 91, 91, null, 171, null, null, true, null),
  ('bbb8d71e-cad7-5cca-8445-8e873e27efae', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '351Z', 'ATTACHE INTELLIGENCE OPERATIONS TECHNICIAN', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(2).
(b) Implements DCSINT, DA, INSCOM, and Commander, FSC policies regarding the administration of Army attaché personnel.
(c) Coordinates policy with Defense Intelligence Agency and HRC; supervises the activities of warrant officers, enlisted personnel, and DA civilians responsible for providing administrative, personnel management, military pay, and Army representational support for Army personnel serving in 90 countries who are affiliated with the Defense Attaché Systems; and provides administrative management of the Army attaché and support staff personnel procurement programs.', '67924d1b2690570a1766069234ff3ab4b748b0469052ecc9c50c6e151139fa9e', 91, 92, null, 172, null, null, true, null),
  ('80d1ba9f-bac9-58fe-8d50-246f8244a7e9', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '351Z', 'ATTACHE INTELLIGENCE OPERATIONS TECHNICIAN', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(3).
(b) MI Senior Field Grade Warrant Officers are proficient in the duties described for Field Grade Warrant Officers in the duties paragraphs of one or more MI WO MOSs.
(c) MI Senior Field Warrant Officers are branch technical experts and master-level multidiscipline intelligence integrator, and advisor.
(d) Provide direction, guidance, resources, assistance, and supervision necessary for subordinates to perform duties.
(e) Provide leader development, talent and lifecycle management, mentorship, advice, and counsel to enlisted Soldiers, warrant officers, and branch officers and have special warrant officer leadership and representation responsibilities within their respective commands.
(f) Advise commanders and branch assignment managers on the assignments and placement of Military Intelligence warrant officers world-wide.
(g) Provide essential advice to commanders on warrant officer issues and perform other officer level duties as required consistent with senior staff officer responsibilities.
(h) May serve as the Senior WO advisor in MOS immaterial (011A) billets based on technical knowledge and understanding of Army and Joint doctrine.
(i) May serve on the Army Staff.
(j) May serve as a Capabilities Branch Chief.
(k) May serve as the MI WO Proponent.
(l) May serve as the CCWO of the MI Branch.
(m) MI Senior Field Grade Warrant Officers must have completed the WO Senior Service Education Course prior to nomination for specified CW5 billets.', '10abb5618353d4899d4f0022a75d4b6519be0dd46ff638f1b47bb7ac69126e74', 92, 92, null, 173, null, null, true, null),
  ('660c87d2-7dc6-5f25-ad51-de34a3eaba95', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '352N', 'SIGNALS INTELLIGENCE ANALYSIS TECHNICIAN', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Manages personnel and equipment to collect, process, exploit, locate, identify, analyze and report on SIGINT information to support tactical, operational, and strategic requirements across all domains.
(b) Establishes priorities and provides guidance and oversight for collection, exploitation, analysis and reporting missions.
(c) Manages training for subordinates and peers on technical, operational, and tactical SIGINT skills required to perform the mission.
(d) Coordinates staff actions to fulfill all requirements in support of SIGINT mission activities and the Commander’s intent.
(e) Advises the commander and staff with regard to tactical and technical SIGINT operations, activities, and personnel.
(f) May serve as Discipline Analyst or Functional Manager at any echelon.', 'f0b8013519c5b3b5289e3c3b17380c8975dd170042d0e983517ba92a213a5fc7', 93, 94, null, 174, null, null, false, null),
  ('93efd304-65ba-511b-b289-995d62ce2914', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '352N', 'SIGNALS INTELLIGENCE ANALYSIS TECHNICIAN', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Directs and performs duties shown in paragraph g(1)
(b) Directs, plans and conducts SIGINT coordination with Joint, Interagency, Intergovernmental, and Multinational partners.
(c) Enables subordinate processes by working as a liaison between lower echelons and Project Managers (PM), TRADOC Capability Managers (TCM), Joint Services, and Partner Nations.
(d) Advocates for development or modification of policies that ensure concurrence with DoD Directives while meeting Commander''s intent; develops and plans all SIGINT operations IAW applicable laws, policies.
(e) May serve as an OC/T at a CTC or MCTP.
(f) May serve as a Doctrine Writer.
(g) May serve as a Detachment Commander.
(h) May serve as an instructor at the WOCC, or at 111 th MI BDE.
(i) May serve on the Joint or Combined Staff.
(j) May serve as a Doctrine or Capabilities Developer.', '60cf0f0e8908b7672a117d6766773ff0b5a5557ee0d88156cceec89fd5440edf', 94, 94, null, 175, null, null, false, null),
  ('a64249e8-91aa-5dca-b9d2-139daf8568d0', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '352N', 'SIGNALS INTELLIGENCE ANALYSIS TECHNICIAN', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Manages, directs and performs duties shown in paragraph g(1) and g(2)
(b) Serves as principal advisor to senior staff members, decision, and policy makers on training, policies, procedures, and SIGINT operations in all domains.
(c) Directs, plans and conducts SIGINT coordination with Joint, Interagency, Intergovernmental, and Multinational partners.
(d) Enables subordinate processes by working as a liaison between lower echelons and Project Managers (PM), TRADOC Capability Managers (TCM), Joint Services, and Partner Nations.
(e) Advocates for development or modification of policies that ensure concurrence with DoD Directives while meeting Commander''s intent; develops and plans all SIGINT operations IAW applicable laws, policies.
(f) May serve as an OC/T at a CTC or MCTP.
(g) May serve as a Doctrine Writer.
(h) May serve as an instructor at the WOCC, or at 111 th MI BDE.
(i) May serve on the Joint or Combined Staff.
(j) May serve as a Doctrine or Capabilities Developer.
(k) May serve as the HRC MI WO Assignments Manager.', '1f58b88d5aafd9e40d4ad9e04e8900a731923581343f8162c5bd27fba488b684', 94, 94, null, 176, null, null, false, null),
  ('13903205-c32e-5e3d-9bc5-d2e489caca0c', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '352N', 'SIGNALS INTELLIGENCE ANALYSIS TECHNICIAN', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) MI CW5s are proficient in the duties described in the duties paragraphs of one or more MI WO MOSs.
(b) MI CW5s are branch technical experts and master-level technical and tactical experts who perform the primary duties of technical leader, manager, multidiscipline intelligence integrator, and advisor.
(c) Provide direction, guidance, resources, assistance, and supervision necessary for subordinates to perform their duties.
(d) Provide leader development, talent and lifecycle management, mentorship, advice, and counsel to enlisted Soldiers, warrant officers, and branch officers and have special warrant officer leadership and representation responsibilities within their respective commands
(e) Primarily support division, corps, echelons above corps, and major command operations.
(f) Advise commanders and branch assignment managers on the assignments and placement of Military Intelligence warrant officers world-wide.
(g) Provide essential advice to commanders on warrant officer issues and perform other officer level duties as required consistent with senior staff officer responsibilities.
(h) May serve as the Senior WO advisor in MOS immaterial (011A) billets based on technical knowledge and understanding of Army and Joint doctrine.
(i) May serve on the Army Staff.
(j) May serve as a Capabilities Branch Chief.
(k) May serve as the MI WO Proponent.
(l) May serve as the CCWO of the MI Branch.
(m) MI Senior Field Grade Warrant Officers must have competed the WO Senior Service Education Course prior to nomination for specified CW5 billets.', '18d34e705e10958fe557227ec8964b83ccc8ca1a5516243f5014765bbaa678d7', 94, 95, null, 177, null, null, false, null),
  ('575ee7b8-7b30-529d-a365-aa6e728cba28', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '352S', 'SIGNALS COLLECTOR TECHNICIAN', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Manages personnel and equipment to collect, process, locate, identify, analyze and report on SIGINT information to support tactical, operational, and strategic requirements across all domains
(b) Manages training for subordinates and peers on technical, operational, and tactical SIGINT skills required to perform the mission
(c) Coordinates staff actions to fulfill all requirements in support of SIGINT mission activities and the Commander’s intent.
(d) Advises the commander and staff with regard to SIGINT operations, activities, and personnel.
(e) May serve as a Discipline Analyst or Functional Manager at any echelon.', 'fd47437e7cb2567e107da65d8baeb80893825b035251cac431721135d758c607', 96, 97, null, 178, '2022-11-01', null, false, null),
  ('8ae34ae6-2d84-56a3-965b-0e857fcbc470', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '352S', 'SIGNALS COLLECTOR TECHNICIAN', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Directs and performs duties described in paragraph g(1).
(b) Provides technical guidance and direction to subordinate intelligence elements.
(c) Utilizes of signals intelligence collection personnel and equipment by the allocations of all non-Morse resources.
(d) Manages non-Morse related SIGINT systems to ensure cost and technically effective life-cycle training support is planned and provided for these systems.
(e) May serve as a Discipline Collection Manager at any echelon.
(f) May serve as a Doctrine Writer.
(g) May serve as a Detachment Commander.
(h) May serve as an instructor at the WOCC, or at 111 th MI BDE.
(i) May serve on the Joint or Combined Staff.
(j) May serve as a Doctrine or Capabilities Developer.', 'f58bb57b67db0fc84d405e2542dc448a43852de71481766b0a6b653fe52b072e', 97, 97, null, 179, '2022-11-01', null, true, null),
  ('a77af511-12ee-54d6-86fa-1a87d6c4b861', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '352S', 'SIGNALS COLLECTOR TECHNICIAN', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Manages, directs and performs duties shown in paragraph g(1) and g(2).
(b) Provides technical guidance and direction to subordinate intelligence elements. .
(c) Utilizes signals intelligence collection personnel and equipment to conduct the allocations of all non-Morse resources.
(d) Manages non-Morse related SIGINT systems to ensure cost and technically effective life-cycle training support is planned and provided for these systems.
(e) May serve as a Discipline Collection Manager at any echelon.
(f) May serve as a Doctrine Writer.
(g) May serve as an instructor at the WOCC, or at 111 th MI BDE.
(h) May serve on the Joint or Combined Staff.
(i) May serve as a Doctrine or Capabilities Developer.
(j) May serve as the HRC MI WO Assignments Manager.', 'e8dcbea99dee8159ef652dce0a3098cedc25817656387e596fa65b58b2bb393e', 97, 97, null, 180, '2022-11-01', null, false, null),
  ('f51fc934-15b5-574a-98db-caaeb485d464', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '352S', 'SIGNALS COLLECTOR TECHNICIAN', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) MI CW5s are proficient in the duties described in the duties paragraphs of one or more MI WO MOSs.
(b) MI CW5s are branch technical experts and master-level technical and tactical experts who perform the primary duties of technical leader, manager, multidiscipline intelligence integrator, and advisor.
(c) Provide direction, guidance, resources, assistance, and supervision necessary for subordinates to perform their duties.
(d) Provide leader development, talent and lifecycle management, mentorship, advice, and counsel to enlisted Soldiers, warrant officers, and branch officers and have special warrant officer leadership and representation responsibilities within their respective commands
(e) Primarily support division, corps, echelons above corps, and major command operations.
(f) Advise commanders and branch assignment managers on the assignments and placement of Military Intelligence warrant officers world-wide.
(g) Provide essential advice to commanders on warrant officer issues and perform other officer level duties as required consistent with senior staff officer responsibilities.
(h) May serve as the Senior WO advisor in MOS immaterial (011A) billets based on technical knowledge and understanding of Army and Joint doctrine.
(i) May serve on the Army Staff.
(j) May serve as a Capabilities Branch Chief.
(k) May serve as the MI WO Proponent.
(l) May serve as the CCWO of the MI Branch.
(m) MI Senior Field Grade Warrant Officers must have competed the WO Senior Service Education Course prior to nomination for specified CW5 billets..', '39e0d43ef615efdd48447f5400d02370d7f808bb093e1ecd7b8f20489498de87', 97, 97, null, 181, '2022-11-01', null, false, null),
  ('0abbd798-aa97-57bc-a42b-08cfe028931b', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '353T', 'INTELLIGENCE SYSTEMS INTEGRATION AND MAINTENANCE TECHNICIAN', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Provides technical guidance and advice to commanders and staff on the management and utilization of the Army and Joint Forces Military Intelligence /Intelligence, Surveillance, and Reconnaissance (MI/ISR) systems and networks.
(b) Oversees shop operations and facility work flow for both ground and airborne ISR systems.
(c) Serves as principal advisor to the Command and staff on intelligence maintenance operations, training, policies, and procedures.
(d) Employs external capabilities, and integrates automation ISO intelligence maintenance operations.
(e) Conducts all intelligence maintenance operations IAW applicable laws, policies.
(f) May serve as a Discipline Analyst or Functional Manager at any echelon.', 'bf73a029e1b71a25c462b7a774a4e9d2e97b06589a1510e3a4362b044fc1b104', 99, 99, null, 182, null, null, false, null),
  ('07e037a7-a0d3-58b6-bd44-9f694d515154', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '353T', 'INTELLIGENCE SYSTEMS INTEGRATION AND MAINTENANCE TECHNICIAN', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Directs and performs duties described in paragraph g(1).
(b) Advises senior staff members, decision, and policy makers on intelligence maintenance operations, training, policies, and procedures.
(c) Directs and conducts intelligence maintenance coordination with Joint, Interagency, Intergovernmental, and Multinational partners.
(d) Develops and plans all intelligence maintenance operations.
(e) May serve as Maintenance Shop OIC.
(f) May serve as a Discipline Collection Manager at any echelon.
(g) May serve as an OC/T at a CTC or MCTP.
(h) May serve as a Doctrine Writer.
(i) May serve as a Detachment Commander.
(j) May serve as an instructor at the WOCC, or at 111 th MI BDE.
(k) May serve on the Joint or Combined Staff.
(l) May serve as a Doctrine or Capabilities Developer.', '4aedfdd9b69029748316d8238953776976fcffa38861cdc310fe2c35c6952975', 99, 100, null, 183, null, null, true, null),
  ('ecd3ca53-0475-5434-b277-4a5ae3541633', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '353T', 'INTELLIGENCE SYSTEMS INTEGRATION AND MAINTENANCE TECHNICIAN', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Manages, directs and performs duties described in paragraph g(1) and g(2).
(b) Serves as the principal advisor to senior staff members, decision, and policy makers on intelligence maintenance operations, training, policies, and procedures.
(c) Directs and conducts intelligence maintenance coordination with Joint, Interagency, Intergovernmental, and Multinational partners.
(e) May serve as a Discipline Collection Manager at any echelon.
(f) May serve as an OC/T at a CTC or MCTP.
(g) May serve as a Doctrine Writer.
(h) May serve as an instructor at the WOCC, or at 111 th MI BDE.
(i) May serve on the Joint or Combined Staff.
(j) May serve as a Doctrine or Capabilities Developer.
(k) May serve as the HRC MI WO Assignments Manager.', '03416b8bead1402932047982621c69ec287ce12cb2da7aa47881fc4faf145cef', 100, 100, null, 184, null, null, true, null),
  ('22438f78-053d-5abf-87ce-642823f913e4', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '353T', 'INTELLIGENCE SYSTEMS INTEGRATION AND MAINTENANCE TECHNICIAN', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) MI CW5s are proficient in the duties described in the duties paragraphs of one or more MI WO MOSs.
(b) MI CW5s are branch technical experts and master-level technical and tactical experts who perform the primary duties of technical leader, manager, multidiscipline intelligence integrator, and advisor.
(c) Provide direction, guidance, resources, assistance, and supervision necessary for subordinates to perform their duties.
(d) Provide leader development, talent and lifecycle management, mentorship, advice, and counsel to enlisted Soldiers, warrant officers, and branch officers and have special warrant officer leadership and representation responsibilities within their respective commands
(e) Primarily support division, corps, echelons above corps, and major command operations.
(f) Advise commanders and branch assignment managers on the assignments and placement of Military Intelligence warrant officers world-wide.
(g) Provide essential advice to commanders on warrant officer issues and perform other officer level duties as required consistent with senior staff officer responsibilities.
(h) May serve as the Senior WO advisor in MOS immaterial (011A) billets based on technical knowledge and understanding of Army and Joint doctrine.
(i) May serve on the Army Staff
(j) May serve as a Capabilities Branch Chief
(k) May serve as the MI WO Proponent
(l) May serve as the CCWO of the MI Branch
(m) MI Senior Field Grade Warrant Officers must have competed the WO Senior Service Education Course prior to nomination for specified CW5 billets.', 'b16354cdb6e6c2e07d397d37216281b5865fdea5184a8c60da67f064a5243a8d', 100, 100, null, 185, null, null, false, null),
  ('b8aaa810-11f9-5b90-88d8-ecfea7701d77', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '390A', 'Robotics Technician', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Responsible for the design, build, employment and maintenance of Robotics and Autonomous Systems (RAS).
(b) Responsible for the planning and multi-domain integration in support of training and operations.
(c) Plans, organizes, implements, monitors, and evaluates operations, threat environment, and unit maintenance of RAS.
(d) Advises the Battalion Commander and staff on all RAS.
(e) Management of RAS institutional knowledge and emerging technology in support of training and operations.
(f) Coordinates with higher and subordinate units for employment of RAS.
(g) Develops, publishes, and updates RAS SOP.', '869f5f07ea2807eacbf45dd0d1cc9f21a504db5c3ecf5adf6c8abeef0f4a009b', 101, 101, null, 186, '2025-10-01', null, false, null),
  ('35d5095f-da6c-51a6-b9c8-399f05302170', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '390A', 'Robotics Technician', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1).
(b) Advises the Battalion Commander and staff on all Robotics and Autonomous Systems.
(c) Serves as Instructor at the Special Operations Robotics Technician Warrant Officer Basic Course.', '6dc6793b1ea95cd54d000f8fb6670ca00ad4b8e86f322628c16e87e011ba4db5', 101, 101, null, 187, '2025-10-01', null, true, null),
  ('286cd8cc-a9e3-50f9-95a0-9b2d06877d64', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '390A', 'Robotics Technician', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(2).
(b) Advises the Special Forces Group Commander and staff on all Robotics and Autonomous Systems.', 'f8529652394ce73d4706f82589dcd5db50bdb4e2d7d31d660b119a4300c10ab1', 101, 102, null, 188, '2025-10-01', null, true, null),
  ('94e459c5-d3b1-5a1d-a0cc-a19ad1c5b478', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '390A', 'Robotics Technician', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(3).
(b) Advises the Commander on all matters pertaining to warrant officer assignments, professional development, and accessions.', 'b9349c9c9ecb447b014b615577aa80abb74435f1f85053d62e029a0a1f0bab1e', 102, 102, null, 189, '2025-10-01', null, true, null),
  ('70a08e2f-463f-560d-a6f9-9c4281cd9820', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '420A', 'HUMAN RESOURCES TECHNICIAN', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Manage the personnel readiness management system at assigned command level.
(b) Manage the personnel information management system at assigned command level.
(c) Manage the personnel accounting and strength reporting system at assigned command level.
(d) Manage the casualty information management system at assigned command level.
(e) Manage the personnel replacement system at assigned command level.
(f) Manage the awards and decorations program at assigned command level.
(g) Manage the military personnel evaluations systems at assigned command level.
(h) Manage the officer and enlisted promotion systems at assigned command level.
(i) Manage the identification documents control and issuance function at assigned command level.
(j) Monitor and serve as functional proponent for the leaves and passes program at assigned command level.
(k) Manage the line of duty investigation program at assigned command level.
(l) Manage the officer procurement program at assigned command level.
(m) Manage the officer and enlisted transfer and separation programs at assigned command level.
(n) Manage the personnel aspects of the Soldier readiness program.
(o) Manage the processing of miscellaneous Soldier generated personnel actions.', '11486c8ce7695040ef7faddf5e86a0007ed869a7eef0e563161404ae8ba37b95', 103, 104, null, 190, null, null, false, null),
  ('5054a828-9bc3-5aff-b7b4-3ea698d0fd6b', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '420A', 'HUMAN RESOURCES TECHNICIAN', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1).
(b) Performs warrant officer duties at higher command levels.
(c) Performs personnel staff officer duties in TOE units and on major command and major subordinate command staffs.', '80f48fc3fea1ee1209acab936c299c87ffd58ed5f90c932decfcc7cf86ba1ac0', 104, 104, null, 191, null, null, true, null),
  ('a9eb1aa3-c908-5d97-bc2c-511eed6871da', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '420A', 'HUMAN RESOURCES TECHNICIAN', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(2).
(b) Performs personnel duties at the Combined Arms Command, U.S. Army Recruiting Command, and the U.S. Army Human Resources Command.', '2b2c0c5c4c2f058a659bede4e62eaefc70fb4711eab11e435e1cdbcfa21c4793', 104, 104, null, 192, null, null, true, null),
  ('754e7d53-1994-5ce2-9fa9-439e1e8e187a', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '420A', 'HUMAN RESOURCES TECHNICIAN', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(3).
(b) Performs personnel duties at MACOM, U.S. Army Human Resources Command, and the Warrant Officer Career Center.', '180b46d306b7c1e67fbda556b6e79c01245af4eee6c1150c0354cdb884534d6d', 104, 104, null, 193, null, null, true, null),
  ('ce4b6d27-3a29-524a-8c84-de561e49c893', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '420C', 'BANDMASTER', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Conduct or lead Army bands and Music Performance Teams (MPT) in support of official military and civilian ceremonies and functions.
(b) Select music appropriate for MPTs and their missions.
(c) Direct rehearsals and performances to achieve desired musical effects, technical knowledge, and talents of individual performers.
(d) Participate in CONUS and OCONUS civilian and military community relations functions representing the U.S. Army or the United States at the highest national and international levels.
(f) Provide subject matter expertise on military traditions, ceremonies, and music to assigned command.
(g) Supervise unit personnel in the execution of company level administrative duties.', '0cc333d8585b757eaa6d764df4001a18edb02ed342b7ec90d7ce28c68987ffe9', 105, 105, null, 194, null, null, false, null),
  ('0d36d786-d8bc-5e2b-b07e-a95712f7d9fa', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '420C', 'BANDMASTER', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', 'performs duties described in paragraph g (1).', '26cc31010a6bb69250005e39b9c8c5d88e2feeb8ad386f1d29f45d57c7ce8edd', 105, 105, null, 195, null, null, true, null),
  ('e30ef33e-aeb3-5168-b85b-f8340497f9e8', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '420C', 'BANDMASTER', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g (2).
(b) Supervise junior WO (WO1/CW2) assigned as unit executive officer.', 'be7a7dd7cfb05538330aac84609579917dda36798eb8772a36a7057128349b66', 105, 105, null, 196, null, null, true, null),
  ('8c6f4c97-e7b1-566b-a99e-26b6d49ab967', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '420C', 'BANDMASTER', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', 'performs duties described in paragraph g (3).
(a) Serve as Army Music Proponency Officer.
(b) Serve as Army School of Music Assistant Director of Training.', '00d02af115817e85135009ece2d177312a994952c07cd80337597c3ec5d85641', 105, 106, null, 197, null, null, true, null),
  ('c49fe7aa-9e97-5971-9099-a4e1156d7569', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '420T', 'TALENT ACQUISITION TECHNICIAN', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Perform basic to intermediate level of data literacy to include the ability to consolidate multiple data sets using data visualization tools.
(b) Perform basic level of understanding and ability to utilize Human Resources and USAREC systems at assigned command level.
(c) Conduct local marketing analysis.
(d) Understand marketing plans.
(e) Develop local marketing strategies.
(f) Employs advertising and content distribution.
(g) Conduct contract attribution.
(h) Conduct targeting.
(i) Understand how to integrate and the fusion process within the organization.
(j) Advise command on talent acquisition operations that support current recruiting operations at assigned command level.
(k) Analyze processing efficiency data at assigned command level.
(l) Develop external networks.', 'fdf28426cdd7ddc21bc540a4da55004fd558e344c07c031af633426563e2a55f', 107, 107, null, 198, '2025-08-01', '2027-10-01', false, null),
  ('1b386394-0683-505b-828e-4bb2467a1dc6', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '420T', 'TALENT ACQUISITION TECHNICIAN', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1).
(b) Performs warrant officer duties at higher command levels.
(c) Performs Talent Acquisition duties in support of Cadet Command, Innovation organizations and Regional Marketing Offices.', '7ba981a808b80be54a31d84338c391775b472add78ad7f84c2fc1a9fb0e9aa41', 107, 108, null, 199, '2025-08-01', '2027-10-01', true, null),
  ('cb5e0a8d-eb35-52bc-bd6c-372c9efc63c6', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '420T', 'TALENT ACQUISITION TECHNICIAN', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(2).
(b) Performs personnel duties at the U.S. Army Recruiting Commands and Adjutant General’s School (AGS).', '7925199d76d3a2cc0bcf2502c08539416c6c9d626589962218d25e543e5de345', 108, 108, null, 200, '2025-08-01', '2027-10-01', true, null),
  ('95391d0d-f707-56e0-8fce-8aa3bc22ea51', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '420T', 'TALENT ACQUISITION TECHNICIAN', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(3).
(b) Performs personnel duties at U.S. Army Recruiting Command and HQs Department of the Army G1.', 'c5075d9cf1b3e255b87cd254706ed631f327c1c7f897a82af8bbad397bc22e4d', 108, 108, null, 201, '2025-08-01', '2027-10-01', true, null),
  ('4b6346df-9670-53b7-8759-a4960edbd6c8', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '420T', 'TALENT ACQUISITION TECHNICIAN', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Perform basic to intermediate level of data literacy to include the ability to consolidate multiple data sets using data visualization tools.
(b) Perform basic level of understanding and ability to utilize Human Resources and USAREC systems at assigned command level.
(c) Conduct local marketing analysis.
(d) Understand marketing plans.
(e) Develop local marketing strategies.
(f) Employs advertising and content distribution.
(g) Conduct contract attribution.
(h) Conduct targeting.
(i) Understand how to integrate and the fusion process within the organization.
(j) Advise command on talent acquisition operations that support current recruiting operations at assigned command level.
(k) Analyze processing efficiency data at assigned command level.
(l) Develop external networks.', 'fdf28426cdd7ddc21bc540a4da55004fd558e344c07c031af633426563e2a55f', 109, 109, null, 202, '2027-10-01', null, false, null),
  ('518beae2-1f39-56d3-b13c-a18c3a34cabd', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '420T', 'TALENT ACQUISITION TECHNICIAN', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1).
(b) Performs warrant officer duties at higher command levels.
(c) Performs Talent Acquisition duties in support of Cadet Command, Innovation organizations and Regional Marketing Offices.', '7ba981a808b80be54a31d84338c391775b472add78ad7f84c2fc1a9fb0e9aa41', 109, 109, null, 203, '2027-10-01', null, true, null),
  ('fc91ff98-4d19-565d-979a-12d177fa8b44', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '420T', 'TALENT ACQUISITION TECHNICIAN', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(2).
(b) Performs personnel duties within U.S. Army Recruiting Commands and Adjutant General’s School (AGS).', '9f4e3c2498ee26351ef3ced26ad267a849ebaaba36f20fdcec51432f0bf1ff02', 109, 109, null, 204, '2027-10-01', null, true, null),
  ('adb84076-5e6e-5002-ad35-38b0a2115c84', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '420T', 'TALENT ACQUISITION TECHNICIAN', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(3).
(b) Performs personnel duties within U.S. Army Recruiting Command and HQs Department of the Army G1.', 'd683d023a98379485b0b6849d83d48618470f97b88ed91d92ce90e813d165e5c', 110, 110, null, 205, '2027-10-01', null, true, null),
  ('41a5e5fb-b8f8-5c34-9ba1-0662af5165c2', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '490B', 'Artificial Intelligence and Machine Learning Operations Technician', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) A Basic-level AI/ML Operations Technician applies fundamental skills of cloud native software development, data engineering, DevSecOps, AI model deployment, and computer scripting languages to facilitate AI solution development. Monitor, test, deploy, orchestrate, and maintain the development of AI solutions. Collaborate with Cyber and Signal team members to integrate appropriate security features, articulate network requirements, complete necessary documentation and diagrams to enable AI solution deployment onto Department of Defense Information Networks.
(b) Integrate into a multi-disciplined team comprised of Software, Cyber, Signal, and Operational Research and Systems Analysis (ORSA) personnel.
(c) Complete assigned tasks and modules, as required and assigned by a Senior- or Master-level level AI/ML Operations Technician.', '9510be595b23daa91fa0f90688fe1f6a725db5b80960c051a9d31d7dd840522a', 111, 112, null, 206, '2026-10-01', null, false, null),
  ('70006878-189b-50f0-a14c-a00980842d48', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '490B', 'Artificial Intelligence and Machine Learning Operations Technician', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Perform duties described in paragraph g (1).
(b) An Advanced-level AI/ML Operations Technician leverages Lean and Agile methodologies and management practices to lead AI-focused development projects. Collaborates with software, Cyber, Signal, and ORSA teams to determine organizational requirements and design feasible and maintainable solutions to address gaps. Integrates new practices or technologies into current operations. Provides training, direction, and oversight to Basic-level AI/ML Operations Technicians. Provides mentorship and talent management for career progression of Junior Warrant Officers.
(c) An Advanced-level AI/ML Operations Technician is responsible for completing assigned tasks and modules, as required and assigned by a Senior-level AI/ML Operations Technician.', '64ccea453ec0ca485e6c085bfa73f00618b3c536ce1133f9407832a875e7a0cb', 112, 112, null, 207, '2026-10-01', null, true, null),
  ('7fcd7194-8328-5ef5-b50a-ab86dc585f32', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '490B', 'Artificial Intelligence and Machine Learning Operations Technician', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Perform duties described in paragraph g (1 & 2).
(b) A Senior-level AI/ML Operations Technician possesses skills in negotiation, policy analysis, and development. Can demonstrate knowledge in force management and emerging technologies.
(c) Serves as a principal advisor to decision- and policy makers on AI/ML Operations training, policies, procedures, and best practices for AI capability development and deployment. Responsible for collaborating on operational and strategic-level solutions.
(d) Set conditions for training and mentorship of Basic and Advanced AI/ML Technicians. Reinforce training carrier progression opportunities and cross-functional collaboration to share best practices.', '9b1a4e16eb406f79d8b650927cdf6b0ff3f7e66deb8231dc7fe71006373f7497', 112, 112, null, 208, '2026-10-01', null, true, null),
  ('2c373ef8-6ca5-59f4-bbd2-7aca55a7b7ac', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '490B', 'Artificial Intelligence and Machine Learning Operations Technician', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Perform duties described in paragraph g (1, 2, & 3).
(b) Deliver master-level technical and tactical expertise on the primary duties of technical leader, manager, multidiscipline AI/ML integrator, and advisor.
(c) Provide direction, guidance, resources, assistance, and supervision necessary for subordinates to perform their duties.
(d) Support commanders with the development of new AI/ML Operations doctrine, organizational structure, methods and equipment to be utilized by AI/ML Operations Technicians.
(e) Provide leader development, talent and lifecycle management, mentorship, advice, and counsel to enlisted Soldiers, warrant officers, and branch officers.
(f) Possess special leadership abilities that interprets the commander’s intent and mission to support Multi-Domain Operations (MDO), representing and advising on the responsibilities of AI/ML Operations within their respective AOR.
(g) Primarily support corps, echelons above corps, major command, Joint, Interagency, Intergovernmental, and Multinational operations.', 'bb54ed4ec658c39c61e6513781f95521f5aba0f8d112a582a53408b2b4cc553f', 112, 112, null, 209, '2026-10-01', null, true, null),
  ('f449c785-aca0-53cb-a590-37b0a7b5368a', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '640A', 'FOOD SAFETY OFFICER', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Manages and directs military food safety and quality assurance programs to include personnel, facilities, and equipment under the guidance and supervision of the senior Veterinary Corps Officer (VCO).
(b) Organizes and conducts commercial sanitation audits and military sanitation inspections, recognizes sanitation deficiencies, and determines sanitary compliance ratings of civilian and government facilities that produce, process, prepare, manufacture, store, or otherwise handle subsistence.
(c) Provides technical advice concerning food safety, food defense, quality assurance issues to Medical Brigade/Group Command and Staff, military acquisition, supply, and retail activities.
(d) Identifies and provides technical information concerning microbiological, chemical, and physical deterioration of subsistence.
(e) Interfaces with DoD, Federal, State, local, and host-nation inspection authorities and regulatory health agencies concerning food safety and quality assurance matters.
(f) Observes, records, and reports on subsistence problems that may have public health significance.
(g) Interviews patients and collects data on food borne disease of public health significance to assist epidemiological investigations.
(h) Develops/conducts food safety and quality assurance training to support local unit mission requirements.', 'c1ca93be1d044b306c2952c0f60e9ca91884d130a12ade8893bc6855436cd074', 113, 114, null, 210, null, null, false, null),
  ('cf1b6c42-b365-55a0-969b-bb27cb5ca791', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '640A', 'FOOD SAFETY OFFICER', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1).
(b) Provides supervision/guidance for food safety, food defense and quality assurance programs in a tactical environment at Division/Corps level to include slaughter and processing of food animals in emergency situations and the procurement of food stocks from foreign establishments.
(c) Provides technical advice on food safety, food defense, and quality assurance engineering principles for the acquisition, assembly, storage, and distribution of operational rations for DoD.', '6dd1161286a54e215bbfa0ed486c1d9026c7714f521f710c1c48b8361186e570', 114, 114, null, 211, null, null, true, null),
  ('ca64247c-e272-5929-a455-31c281f67f12', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '640A', 'FOOD SAFETY OFFICER', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(2).
(b) Provides guidance for food safety, food defense and quality assurance programs to subordinate food inspection elements or other staff elements in a tactical environment at echelons above Corps or at a Major Medical Command Regional Medical Center.
(c) Serves as the technical consultant on the staff of the Senior Veterinary Officer within a tactical theater of operations or at a Major Medical Command Regional Medical Center concerning all food inspection matters.
(d) Provides guidance and technical advice concerning Statistical Process Control (SPC), Systems Auditing, Total Quality Management (TQM), and other quality engineering programs as a Quality Engineer at selected positions on the senior staff at a Major Medical Command or DoD Acquisition Agency Headquarters.', 'b53ceb8fb9912f08f147f104c9efae53f941eb9ab6d856dab60a4ca5f85e85df', 114, 114, null, 212, null, null, true, null),
  ('999c23e5-dd57-5cbe-8ae0-c969190085b8', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '640A', 'FOOD SAFETY OFFICER', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(3).
(b) Serves as the technical consultant on the staff of the Senior Veterinary Officer at a Major Medical Command concerning all food inspection matters.
(c) Provides guidance and technical advice to subordinate food inspection elements or other staff elements providing food inspection support to all levels of the Armed Forces.
(d) May serve as the Chief Warrant Officer of the Veterinary Corps Branch and Consultant to the Chief of the Veterinary Corps and the Surgeon General.', 'a807a860b4a4780519221f5ee92f59304905d469f221d0e929e3dfd5167fc836', 114, 114, null, 213, null, null, true, null),
  ('fee0545c-c2f2-58e6-9d9c-1fba07193260', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '670A', 'HEALTH SERVICES MAINTENANCE TECHNICIAN', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Supervises personnel and allocates resources to install, maintain and repair optical, dental, and medical technical diagnostic and treatment equipment and medical laboratory equipment at organizational and intermediate direct support level.
(b) Supervises personnel who maintain equipment and utilities is associated health service support fields.
(c) Distributes workload among subordinate and makes in process and quality assurance inspections of work.
(d) Repairs, modifies, and rehabilitates medical systems and subsystems.
(e) Performs scheduled (preventive maintenance) and unscheduled (repair) services on medical and related equipment.
(f) Serves as technical consultant to all members of the hospital staff for maintenance matters.
(g) Serves as contracting officer''s representative for equipment installation or service contracts.
(h) Instructs personnel in use of equipment and its care.
(i) Reviews internal operating procedures; instructs subordinates on section operations and repair procedures.
(j) Acquires and provides data regarding budget, maintenance, supply, and safety as required.
(k) Compiles data for material status reports DA Form 2406 (Materiel Condition Status Report).
(l) Provides training to subordinates in military, administrative, and technical matters.
(m) Takes action in support of the procurement of medical equipment.
(n) Reads and interprets for other electrical diagrams, schematic drawings, engineering specifications, and blueprints.
(o) Provides data in support of research, development, test and evaluation of medical equipment.
(p) Supervises maintenance of organic equipment, tools, and test sets.
(q) Prepares drawings, sketches, notes and other materials for installation of equipment.
(r) Develops plans for design and layout of equipment facilities for medical laboratory, operating room, sterile supply, etc.
(s) Presents written or oral briefings to line, staff, and professional personnel on maintenance related subject matter.
(t) Provides technical data to implement automated maintenance management systems.
(u) Inspects inoperative equipment, develops cost estimates for repair, and makes appropriate recommendations to Commander regarding economies of repair or replacement.
(v) Advises on and supervises use of oscilloscopes, voltmeters and other test equipment to isolate equipment malfunctions.
(w) Performs other officer level duties essential to the mission of the unit to which assigned.', '4bfb218643a5e42b7fa6f87792f08227f18a125f27c56f22726eb046befd719f', 116, 117, null, 214, null, null, false, null),
  ('5f86fa31-73e2-5fd3-8ad2-234b5d1d1798', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '670A', 'HEALTH SERVICES MAINTENANCE TECHNICIAN', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1).
(b) Develops maintenance policy and procedures for use by all AMEDD commands and organizations.', '5cd717177a761d5e5ea8fa089a1433e669485c3858e4748cbc822f8c7dca9173', 117, 117, null, 215, null, null, true, null),
  ('9eabf727-8f37-5be4-b9be-d527a196158f', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '670A', 'HEALTH SERVICES MAINTENANCE TECHNICIAN', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(2).
(b) Performs duties as an intermediate general support or depot support maintenance officer providing corps or theater level maintenance support to a variety of health care organizations/units.
(c) Responsible for overall readiness and mission performance factors related to maintenance.', '20e7e90f068c73f4483396bded07c852eecc385cf4cc0a8d218fa18f312c515f', 117, 117, null, 216, null, null, true, null),
  ('b7ebbcb7-8720-56ff-a327-b51c51316adb', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '670A', 'HEALTH SERVICES MAINTENANCE TECHNICIAN', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(3).
(b) Responsible for the maintenance elements of life cycle systems management.
(c) Develops programs to enhance training of other warrant officer and enlisted MOSs.
(d) Provides maintenance policy and guidance through the Surgeon General to all major commands and theater of operations.
(e) Represents the Army Medical Department at DOD level committees, boards, and joint working groups.', '3ad27b5aec693f099fe97e360276e064b31420b36e9cc6f6bb9c39d801e2250c', 117, 117, null, 217, null, null, true, null),
  ('82d5c046-0e1b-5565-9521-3c72037d0e2e', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '740A', 'CHEMICAL, BIOLOGICAL, RADIOLOGICAL AND NUCLEAR (CBRN) WARRANT OFFICER', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Serves as the standards and certification technician in a narrow technical functional area, in a CBRN Company and a CBRN Response Team in a Technical Escort Company.
(b) Manage, instruct and supervise personnel in the technical aspects of CBRN operations.
(c) Manage the company/team Hazardous Material (HAZMAT) certification program.
(d) Estimate requirements for personnel, equipment, user/organizational maintenance and repair of CBRN systems.
(e) Review, consolidate and prepare technical reports associated with CBRN operations in assigned unit.
(f) Assist in coordination and implementation of CBRN operations, and training programs.
(g) Develop standard operating procedures and performs administrative duties related to CBRN operations.', '3f8c9d5b09b90894d91707526ffa2d6729e20c4e68d767d9cf39d82b60fe65c6', 118, 118, null, 218, null, null, false, null),
  ('ef451b51-bc20-57b0-8758-dcb601284550', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '740A', 'CHEMICAL, BIOLOGICAL, RADIOLOGICAL AND NUCLEAR (CBRN) WARRANT OFFICER', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Perform duties described in paragraph g(1).
(b) Serves as a CBRN technician in mid-level management positions; generally in CBRN Battalion and Division CBRN Staffs.
(c) Serves as the division commander’s senior technical advisor/analyst in all areas of CBRN operations.
(d) Provide technical guidance to personnel of supported units/activities in order to establish and maintain adequate CBRN operation techniques for mission accomplishment.', 'ae2e3b6394190d002c66175083332057fc469c10a9504b071e6d70100b63f237', 118, 118, null, 219, null, null, true, null),
  ('d172751c-8dcf-5df9-89fb-207f445e93e8', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '740A', 'CHEMICAL, BIOLOGICAL, RADIOLOGICAL AND NUCLEAR (CBRN) WARRANT OFFICER', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described paragraphs g(2).
(b) Serves as the senior CBRN technician in positions requiring advanced level technical skills; generally at CBRN BN, CBRN BDE, and Corps CBRN staffs
(c) Responsible for coordinating CBRN operation activities with all subordinate units and integrating CBRN operations with higher echelon organizations.
(d) Provides direct interface with elements involved in joint, interagency, intergovernmental, multinational (JIIM), and combined arms CBRN operations.
(e) Serves in positions requiring advanced technical skills to perform duties related to CBRN training and evaluation and the development of standard operating policy and doctrine.
(f) Instructs and provides technical advice in the management and maintenance of CBRN operation systems.', '21f7a4b3adb824472be4503941610ec3943a9e62ec08663ea49d8f0a3f0f6995', 118, 119, null, 220, null, null, false, null),
  ('573bcdad-f107-5a33-aab2-c548ef6b95fc', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '740A', 'CHEMICAL, BIOLOGICAL, RADIOLOGICAL AND NUCLEAR (CBRN) WARRANT OFFICER', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties as described in paragraphs g(3).
(b) Serves as the most senior CBRN technician in positions that require unusual depth and breadth of technical knowledge for functional training and curriculum development or major systems integration skills.
(c) Provides technical advice and assistance in regards to CBRN operations in CBRN BDEs, to include all aspects of training, personnel, doctrine, force structure, requirements and use/maintenance of CBRN operations systems.
(d) Develop, review and updates the life-cycle management of the CBRN technician’s structure and force.
(e) Perform duties as proponent level personnel systems integrator.
(f) Instructs and monitors students in a service school environment.', '7caa7b4ae8a161f0522071cc7027d3ba9b72aa3c743def432b6378eb1f1e6a28', 119, 119, null, 221, null, null, false, null),
  ('5713ca78-2e7b-5c90-8310-51fa135ac564', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '880A', 'MARINE DECK OFFICER', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Commands Army Class A1 vessels operating on lakes, bays, sounds, and coastal waters.
(b) Is responsible for proper operation of vessel including discipline of crew and seaworthiness of vessel.
(c) Navigates vessel using nautical charts, area plotting sheets, compass, sextant, terrestrial bearings, and electronic navigational aids.
(d) Directs course of vessel to avoid surface and underwater hazards, to include areas where ice is seen or reported.
(e) Directs operation of ship-to-ship and ship-to-shore radio and visual communication systems.
(f) Directs fueling, ballasting, trimming operations, and cargo stowage.
(g) Assigns crew to general watches and prepares station bills.
(h) Inspects vessel to ensure crew and passengers observe operational and safety regulations and procedures.
(i) Maintains vessels on board records to include the Official Vessel Log.', '9376762cdd6d88a0fccbbaccafee937c1c85db637b1f9bc1ab477689a1195216', 120, 121, null, 222, null, null, false, null),
  ('3d721ea4-a4c4-54f4-9e76-3be00f510d88', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '880A', 'MARINE DECK OFFICER', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1).
(b) Commands Army Class A2 vessels operating upon oceans.
(c) Performs Harbormaster duties controlling all port operations, to include safety, security, maintenance, Marine communications, vessel berthing, and movements.
(d) Provides technical guidance and direction in regard to Marine related issues at battalion level.', 'ebd375c0bf5e23a026353fa1f0eeb207ca99105cab7b6027cb3ff10fbbcaa7bb', 121, 121, null, 223, null, null, true, null),
  ('967eecbc-8629-5e49-906c-06662e495159', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '880A', 'MARINE DECK OFFICER', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(2).
(b) Commands watercraft detachments either afloat or ashore.
(c) Provides technical guidance and direction in regard to Marine related issues above battalion level.', 'c047c0fdf9823ab6bb5afa6de93118fcbbb5f126d9a23f048a4ee09bc2783516', 121, 121, null, 224, null, null, true, null),
  ('57b9cde9-d3b9-5762-9b89-4b4026f1c3f3', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '880A', 'MARINE DECK OFFICER', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(3).
(b) Performs as technical or functional systems integrator at senior staff level.', 'cda1d7453f9d4e8a47f46fc25d5ab877202a946cf9709d711f1f380c8fefaf45', 121, 121, null, 225, null, null, true, null),
  ('89664db5-7b42-5faf-a806-1cd9c0f0f50b', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '881A', 'MARINE ENGINEERING OFFICER', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Directs the operation, maintenance, repair, and overhaul of engineering machinery and equipment installed aboard Army watercraft.
(b) Supervises and performs installation and repair of marine power plant, propulsion systems, heating and ventilation systems, and other mechanical plumbing and electrical equipment in ships and marine facilities.
(c) Inspects ship''s machinery to determine compliance with maintenance standards and/or to determine extent and nature of repairs required.
(d) Maintains maintenance logbooks and prepares maintenance reports and work orders.
(e) Implements the Army Maintenance Management System (TAMMS) as it applies to Marine material.', 'fa1e30d4ae0d0bd9a7eede9d952fcfded7547bdde4dde17db6552ed87c379171', 122, 123, null, 226, null, null, false, null),
  ('124047e8-adb0-59e7-9aa4-5c820ca26fac', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '881A', 'MARINE ENGINEERING OFFICER', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1).
(b) Is responsible for the safe, efficient operation and maintenance of all engineering systems aboard unlimited ocean transiting vessels.
(c) Initiates and coordinates all Marine engineering and maintenance functions associated with port operations at battalion level.
(d) Conducts technical inspections and Marine condition surveys.
(e) Provides technical guidance and direction in regard to Marine-related issues at battalion level staff.', 'aff4fcde4f841398242e229843b979550c6524d0500c75fcd886337299df5880', 123, 123, null, 227, null, null, true, null),
  ('a40a5367-f033-5093-bb06-a9e4a35f302c', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '881A', 'MARINE ENGINEERING OFFICER', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(2).
(b) Coordinates all Marine engineering and maintenance functions associated with port operations above battalion level.
(c) Manages maintenance and repair activities.', 'f033f47191b79b70c9fa43f1a948c8b009c4c196edf1d4d4ed96054195d69fed', 123, 123, null, 228, null, null, true, null),
  ('a124b7b7-fda4-55db-a331-2d6f279bd99f', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '881A', 'MARINE ENGINEERING OFFICER', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(3).
(b) Performs as technical or Functional Systems Integrator at senior staff level.', 'a087e3d51f09a03f139cbcafc3ea20b0e31152867c25bcedf718f5f3cb8fb9ad', 123, 123, null, 229, null, null, true, null),
  ('a51b9bb8-8327-58b7-ad98-3a4108df13d7', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '882A', 'MOBILITY OFFICER', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Directs and coordinates the implementation of Global Transportation Network (GTN), Department of the Army Movement Management System-Redesign (DASMMS-R), Automated Command and Control Information System (ACCIS), ACCIS-Air-Load Module (ALM), Automated Information Management System (AIMS-II), Automated Air Load Planning System (AALPS), Air Movement Flow Table (AMFT), Computer Aided Loading and Manifesting System (CALM), Movement Tracking System (MTS), Computerized Movement Planning and Status System (COMPASS), LOGMAR/BARCODE scanners, Combat Service Support System (CSSCS), Worldwide Port System (WPS), Frequency Tag System, Mobile Subscriber equipment (MSE) and Tactical Terminal Adapters (TTA).
(b) Plans, assesses, supervises and reports convoy and cargo handling operations at company, battalion, brigade of division level.
(c) Plans movement of personnel, unit equipment and port call.
(d) Facilitates international movement by rail, highway, air and water to, within and from the theater assigned.
(e) Coordinates transportation plans.
(f) Prepares, supervises and coordinates cargo handling, ensuring its compliance with U.S. Army, contracted and host nation regulatory requirement.
(g) Seaport operations, marshaling equipment, inspection standards for sealift, theater opening procedures.
(h) Schedules movements within a theater of operations.
(i) Plans intra and inter theater movement by any mode of transportation.', 'e545359a2efdb0cd3cd84351232ec99906093f6ed8a2b295027632f7ba77dbba', 124, 125, null, 230, null, null, false, null),
  ('2cc4343e-378d-5076-8e4f-058ecf48229b', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '882A', 'MOBILITY OFFICER', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g (1).
(b) Directs and coordinates the implementation of the Joint Operations Planning and Executing System (JOPES), Movement Planning Module (MPM), Improved Computerized Deployment System (ICODES) and Automated System for Processing Unit Requirements (ASPUR).
(c) Identifies the capabilities and limitations of the host nation transportation infrastructure.
(d) Recommends location of checkpoints along main and alternate supply routes.
(e) Supports development of OPLAN/OPS orders.
(f) Assesses unit transportation capabilities to support proposed operations.
(g) Assesses and incorporates non-programmed movements into the movement plan.', '16acfa4fcbc868426a9f43449a1cb2356a016ab1c8e7217c79c7678bf52ff4c2', 125, 125, null, 231, null, null, true, null),
  ('e5a85f31-dfc4-5017-8b6f-8dd7c859838f', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '882A', 'MOBILITY OFFICER', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g (2).
(b) Directs and coordinates the implementation of the Army Mobilization and Operations Planning Execution System (AMOPES).
(c) Reviews ocean cargo manifests and manifest recapitulation.', 'c80c0108808e730bbccb8fc91741cadbb7882a6b1a25a8cd0d53fbc707892fc6', 125, 125, null, 232, null, null, true, null),
  ('c62ba62a-75c0-506a-9d91-eb4a98336c74', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '882A', 'MOBILITY OFFICER', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g (3).
(b) Performs as technical advisor to higher echelons of command and allied armies on transportation matters.', '6825459978213442eb2f1c3ad67561f2fd731aa1d27fa3e70f443808d6d0b960', 125, 125, null, 233, null, null, true, null),
  ('cc10e997-a40b-5da5-9a94-a5f6aa858705', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '890A', 'AMMUNITION TECHNICIAN', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Directs and coordinates the implementation of the following activities: Receipt, storage, issue, surveillance test, maintenance, modification, destruction, and demilitarization of conventional ammunition, missile explosive components, and other explosive items at company, battalion, and brigade level.
(b) Investigates and reports conventional ammunition accidents, failures, or malfunctions.
(c) Supervises and manages Standard Army Ammunition Systems-Modernized (SAAS-MOD) at unit level and its associated ADP equipment.
(d) Prepares and/or reviews ammunition storage waivers.
(e) Prepares, reviews, and/or implements firefighting procedures for conventional ammunition, missiles and other explosive items.
(f) Plans, reviews, and/or implements emergency destruction of ammunition, missiles, and other explosive items.
(g) Plans, reviews, and/or implements policies and procedures for surveillance of chemical and biological waste materiel.
(h) Performs the duties of accountable officer when designated per AR 735-5.
(i) Advises commanders on the technical aspects of ammunition, missile, and other explosive items receipt, storage, maintenance and supply.
(j) Plans for and schedules work requirements, observes work practices, detects and corrects unsafe and/or improper procedures and techniques.
(k) Manages, examines, interprets, disseminates, and verifies requirements for technical publications in the unit.
(l) Directs ammunition receipt, storage, maintenance and supply operations in a tactical environment.
(m) Interprets technical data and instructs subordinates in the technical aspects of ammunition, missile, and other explosive items receipt, storage, maintenance and supply.
(n) Ensures ammunition quality assurance/quality control (QA/QC) procedures are followed.', '67cde610d2fef556e0efc804e43407e3bcf6fb4c57dd54f818e6633df1eec6a8', 126, 127, null, 234, '2021-10-01', null, false, null),
  ('574fb1b3-59cc-5fa5-af31-b484f8d0af1e', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '890A', 'AMMUNITION TECHNICIAN', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g (1).
(b) Conducts ammunition supply studies.
(c) Develops, implements, and monitors programs of instruction that enhance training of other warrant officer and enlisted MOSs.
(d) Supervises and manages SAAS-MOD at the Sustainment Level, along with associated ADP equipment.
(e) Analyzes and provides reports on complex ammunition malfunctions.
(f) Advises the brigade staff and allied armies on Class V supply, including forecasting, requisitioning, issue, transportation, security, storage, safety, accountability, maintenance, destruction, demilitarization, and turn-in of ammunition.', '1c5e45bab975739fe9d1dbc411557bd69587470c060a87b59250cc697fad7a55', 127, 127, null, 235, '2021-10-01', null, true, null),
  ('8e823c61-ec75-5aa1-9b0e-d44c42a7f43c', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '890A', 'AMMUNITION TECHNICIAN', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g (2).
(b) Supervises and manages SAAS-MOD at division and EAD level, along with associated ADP equipment.
(c) Advises Army staff and allied armies for Class V supply.
(d) Develops concepts, conducts studies, designs organizations, and prepares materiel requirements; tests and evaluates systems employment and organizations; and is proficient in the Total Life Cycle Systems Management (TLCSM) model.
(e) Provides technical and tactical assistance at any echelon of command or support activity for the U.S. Army, or liaison activities with allied armies.
(f) Presents written or oral briefings to line, staff, and professional personnel on ammunition supply, maintenance and related subject matters.
(g) Administers the MOS Life Cycle Management and oversees personnel proponent functions affecting CMF 89 --Ordnance.', '0ce1463d9fe306006509daf20524d9702892da0ef5b076823168bfc514e0d2cb', 127, 127, null, 236, '2021-10-01', null, true, null),
  ('b8ce56a7-93c8-5681-8c1b-9b4ef438eaf6', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '890A', 'AMMUNITION TECHNICIAN', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g (3).
(b) Acts as the technical advisor to higher echelons of command and to allied armies.
(c) Provides technical advisory services on contracting and production matters to commanders.
(d) Provides coordination between military and industry during development, testing and fielding of new munitions and missile explosive components.
(e) Manages the development of training packages to ensure Army personnel are prepared to receive, store, maintain and supply new munitions and missile systems prior to fielding.
(f) Serves as Army Theater subject matter expert (SME) and advisor for all aspects of munitions management, to include the development of command policies and procedures for munitions management, SAAS-MOD operations, and explosive safety.
(g) Performs other officer level duties as required consistent with senior staff officer responsibilities.', 'e742a252d74ecacedd78f41419b7a7a145aed2dea27a51f4f4c7e6934b773145', 127, 127, null, 237, '2021-10-01', null, true, null),
  ('25da7a5e-38f0-597f-b098-5c0e9998868c', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '913A', 'ARMAMENT SYSTEMS MAINTENANCE WARRANT OFFICER', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Manages activities and personnel engaged in field level maintenance and repair of small arms, field artillery and armament systems.
(b) Directs procedures for the identification and troubleshooting of malfunctions in electrical, hydraulic, fire control, and instrument items.
(c) Establishes evacuation and replacement procedures of such items that are unserviceable and beyond the repair capabilities of forward support companies.
(d) Manages quality assurance and production control programs to ensure established work standards are met and repairs are made on a timely basis.
(e) Administers The Army Maintenance Management System (TAMMS) and other maintenance reporting and management systems
(f) Administers regulations and procedures pertaining to physical security, accountability, and shipment of weapons.
(g) Directs repair teams in support of field units and activities.
(h) Establishes and directs a shop safety program per applicable regulations.
(i) Establishes a technical library and examines, interprets, and disseminates technical material, including orders and bulletins.', '20cbd837a17314692c74668d129f8243ecc2b3781184e68e077a43ff4cb05b0d', 129, 129, null, 238, '2020-10-01', null, false, null),
  ('49d256df-3e86-51f2-ba09-13a38ee908fb', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '913A', 'ARMAMENT SYSTEMS MAINTENANCE WARRANT OFFICER', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1).
(b) Manages maintenance activities and personnel at field level.
(c) Directs the repairs of complex malfunctions occurring in tank turret electrical, hydraulic, fire control and instrument systems.', '51341f9beb62dfc95f08339fe9b2894c223dd433bff9f3e1befae5ef0a5e888f', 129, 129, null, 239, '2020-10-01', null, true, null),
  ('516a2aa4-378a-579a-a743-1842e3fb1444', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '913A', 'ARMAMENT SYSTEMS MAINTENANCE WARRANT OFFICER', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(2).
(b) Serves as the senior armament systems maintenance technical advisor in echelons above brigade levels of command.
(c) Assists echelons above brigade staff in the planning, coordination, and execution of maintenance support.
(d) Provides technical expertise in maintenance doctrine on the battlefield for brigade and subordinate element level commanders and staff to efficiently employ armament systems maintenance personnel and equipment in support of the commanders’ mission.
(e) Manages materiel readiness reporting for echelons above brigade organizations.
(f) Performs materiel readiness management duties at sustainment command levels.
(g) Performs research, development, test and evaluation duties.
(h) Assists in coordination and evaluates maintenance performed by contract support.
(i) Serves as Ordnance technical subject matter expert in training, capability, and materiel development positions.
(j) Advises commanders on the progression and utilization of subordinate Ordnance warrant officers.', '4495b28c4579d88a2797bf33c1ccf3af04f16756c24fe3b45353e5663f504478', 129, 130, null, 240, '2020-10-01', null, true, null),
  ('2603ae79-7851-5a7e-ac00-597660eeba36', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '914A', 'ALLIED TRADES WARRANT OFFICER', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Directs the setup, operation, and maintenance of machine tools, computer numerical control (CNC), and welding equipment used to fabricate or repair parts, mechanisms, tools, and machinery.
(b) Manages automotive body, frame, and hull repair, painting, glass, radiator, canvas, and woodworking shop operations.
(c) Supervises and conducts recovery operations and maintenance of tracked and wheeled recovery equipment.
(d) Employs principles of mechanics, metals identification procedures, shop mathematics, and shop layout.
(e) Establishes and directs the upkeep of shop stock, materials, and maintenance- related items required per applicable regulations.
(f) Manages quality assurance and production control programs to ensure established work standards are met and repairs are made on a timely basis.
(g) Establishes training programs to ensure subordinates are qualified in current maintenance techniques and equipment operation.
(h) Coordinates shop activities with other repair shops to ensure equipment is quickly repaired and returned to user.
(i) Establishes and conducts a shop safety program per applicable regulations.
(j) Administers The Army Maintenance Management System (TAMMS).', '2d5dfe919b9713ec940c5ef9d7fcf98ffadef12ae6c7ceb9e6e771b2af1373b6', 131, 131, null, 241, '2020-10-01', null, false, null),
  ('bbc8f53c-66a8-523a-b46a-f079cdfae826', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '914A', 'ALLIED TRADES WARRANT OFFICER', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1).
(b) Manages personnel and activities in field level maintenance within Echelons above Brigade organizations.', 'f2848c409a2c60d8092f26db50586e07cd6405b093e2a161e7b2769bfea74d2f', 131, 131, null, 242, '2020-10-01', null, true, null),
  ('da584143-f615-5dcd-be15-cfd68630b77b', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '914A', 'ALLIED TRADES WARRANT OFFICER', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(2).
(b) Serves as the senior allied trades technical advisor in echelons above brigade levels of command.
(c) Assists echelons above brigade staff in the planning, coordination, and execution of maintenance support.
(d) Provides technical expertise in allied trades doctrine on the battlefield for brigade and subordinate element level commanders and staff to efficiently employ allied trades personnel and equipment in support of the commanders’ mission.
(e) Manages materiel readiness reporting for echelons above brigade organizations.
(f) Performs materiel readiness management duties at sustainment command levels.
(g) Performs research, development, test and evaluation duties.
(h) Assists in coordination and evaluates allied trades tasks performed by contract support.
(i) Serves as Ordnance technical subject matter expert in training, capability, and materiel development positions.
(j) Advises commanders on the progression and utilization of subordinate Ordnance warrant officers.', '56d9cd25764884489a3160818e3eea05ebf4efd57427999e262472c7db708019', 131, 132, null, 243, '2020-10-01', null, true, null),
  ('5d21dbd5-1e10-50c3-bf51-c2384aa7d7dc', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '915A', 'AUTOMOTIVE MAINTENANCE WARRANT OFFICER', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Plans, organizes, and allocates resources and facilities to execute maintenance and repair of light and heavy military and commercial wheeled vehicles; wheeled construction equipment; mobile electric power generation; armament systems; small arms; fire control; ground support equipment and power-driven chemical equipment.
(b) Evaluates and inspects maintenance operations and develops and implements corrective action plans where necessary to comply with regulatory and statutory requirements applicable to industrial maintenance operations in fixed facilities or field environments.
(c) Identifies technical training deficiencies within the military or civilian work force and develops comprehensive corrective action plans to provide necessary training. Personally trains maintenance personnel to accurately diagnose/troubleshoot mechanical, electrical, pneumatic and hydraulic malfunctions accurately using the latest test equipment, technical publications and procedures available.
(d) Provides management oversight and technical guidance on the establishment of unit Shop Stock, Bench Stock, and consumable shop supplies per applicable supply calculations. Coordinates for, or provides technical training for Army Logistics Information Systems (LIS) system operators.
(e) Develops and updates the commander’s Standing Operating Procedures (SOP) for the conduct of maintenance operations to include: safety, fire prevention and environmental protection and physical security within the maintenance facility. Assist the commander in preparation for all external inspections and visits by installation/ACOM safety, fire prevention, and environmental protection agencies.
(f) Oversees the commander’s calibration program and ensures calibration operations are treated as maintenance operations and are covered in the unit’s maintenance SOP.
(g) Oversees the Army Oil Analysis Program to ensure it is in compliance with regulatory requirements.
(h) Trains and directs recovery vehicle operators in safe and correct recovery operations.
(i) Utilizes LIS to provide maintenance and readiness information to the commander and supervisors. Submits Software Engineering Change Proposals to the appropriate agencies when automated maintenance management systems do not function as designed.
(j) Plans, schedules, and publishes scheduled service plans for all assigned equipment per the applicable technical manuals/lubrication orders.
(k) Coordinates with the installation/ACOM or AMC, on application of modification work orders on unit equipment.
(l) Conducts technical inspections of unit equipment to determine maintenance status. This includes CBRN, weapons, communications, ground support equipment, and required sets, kits, outfits, and tools (SKOT).
(m) Manages property accountability for the commander for all equipment used in the performance of maintenance.
(n) Ensures that maintenance personnel are using current technical publications. Inspects and verifies that pinpoint distribution accounts are current for all maintenance sections in the unit.
(o) Establishes the commander’s quality assurance program for maintenance and repairs. Oversee all quality control inspections and inspectors to validate their capability to identify improper repairs and scheduled services.
(p) Acts as the commander’s Command Inspection Program (CIP) maintenance team chief. Personally ensures that the CIP is fair and inspecting to the published standard in all areas associated with equipment maintenance.
(q) Coordinates with other maintenance activities and external agencies to resolve disagreements and maintenance quality control problems.
(r) Acts as the unit point of contact for Army Materiel Status System (AMSS) reporting and issues that arise between the unit, the support operations/distribution management center and Army level.', 'b555fff052c86f796826fe5b52723f442d17714a82d039b6e88dc5a282665ad7', 133, 134, null, 244, '2025-10-01', null, false, null),
  ('9c9d7625-e3aa-5c11-96ad-50a3bc4aa866', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '915A', 'AUTOMOTIVE MAINTENANCE WARRANT OFFICER', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1).
(b) Serves as the senior technical advisor to battalion commanders and the staffs of combat arms maneuver battalions, forward support companies, and task organized combat arms maneuver formations.
(c) Assists a combat arms maneuver battalion or forward support company staff in the planning, coordination, and execution of maintenance support during tactical training and combat operations.
(d) Provides technical expertise in maintenance doctrine on the battlefield necessary for a combat maneuver battalion or squadron staff to efficiently employ maintenance personnel and equipment in support of the commander’s mission.
(e) Coordinates maintenance support necessary for sustainment of readiness in a combat arms maneuver battalion or squadron.
(f) Provides input to supporting maintenance unit commanders and their staffs on tactical support requirements peculiar to the combat maneuver battalion or squadron.
(g) Directs and manages field level automotive, and related support equipment repair teams, sections, and platoons in forward support companies, support maintenance companies, and other combat service support units.
(h) Controls work flow in field maintenance shops under his/her control.
(i) Trains maintainers in correct diagnostics, repair, and quality control procedures on equipment repaired in shops under his/her control.
(j) Establishes internal controls for requesting, maintaining, and properly disposing of supplies, tools and parts, and technical reference material within shops under his/her control.
(k) Provides input to the commander for development of internal and external maintenance Standing Operating Procedures (SOP).
(l) Provides technical advice to the commander on the efficient employment of field repair capability in field training and combat environments.
(m) Employs automated maintenance management systems to improve productivity in shops under his/her control.
(n) Provides technical advice to supported unit commanders and staff on technical maintenance management and maintenance doctrine.
(o) Acts as installation, Army Command, or Army maintenance inspection or training team chief.
(p) Diagnoses complex malfunctions on automotive and support equipment when the malfunctions are beyond the capability of subordinates.
(q) Provides Ordnance related technical and doctrinal expertise to brigade and group level commanders and staffs. .', '2fcb66d2d915774d11338494c69dd665b9dc3e4c8559040d0ce1500835d25938', 134, 135, null, 245, '2025-10-01', null, true, null),
  ('206e66f7-2f51-59c6-bda2-788362c57aae', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '915A', 'AUTOMOTIVE MAINTENANCE WARRANT OFFICER', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1) and g(2).
(b) Serves as the senior ground maintenance technical advisor in brigade and group levels of command.
(c)Assists brigade and group staff in the planning, coordination, and execution of maintenance support.
(d) Provides technical expertise in maintenance doctrine on the battlefield for brigade and subordinate element level commanders and staff to efficiently employ maintenance personnel and equipment in support of the commanders’ mission.
(e) Manages materiel readiness reporting for brigade and echelons above brigade organizations.
(f) Performs materiel readiness management duties at sustainment brigade and sustainment command levels.
(g) Performs research, development, test and evaluation duties.
(h) Assists in coordination and evaluates maintenance performed by contract support.
(i) Serves as Ordnance technical subject matter expert in training, capability, and materiel development positions.
(j) Advises commanders on the progression and utilization of subordinate Ordnance warrant officers. (4) CW5 see MOS 915E.', '62f1ec7969eb98a5761b00f9573a677fc84ff93c4bf771d92246c346695a172f', 135, 135, null, 246, '2025-10-01', null, true, null),
  ('64f81f12-524d-58ed-b0ba-71f672b060fa', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '915E', 'SENIOR AUTOMOTIVE MAINTENANCE WARRANT OFFICER/SENIOR ORDNANCE LOGISTICS WARRANT OFFICER', 'rank_duties', 'W-1..W-3', null, 'Duties — WO1/CW2/CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', 'and CW4--see feeder MOS qualifications.', '4553d3229bc8a1af29b0939f04528cb9ffc813e6149a6ff747d1c929472f23ce', 136, 136, null, 247, '2025-10-01', null, false, null),
  ('723a7e4c-5b83-5e76-8e8e-614567cafe81', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '915E', 'SENIOR AUTOMOTIVE MAINTENANCE WARRANT OFFICER/SENIOR ORDNANCE LOGISTICS WARRANT OFFICER', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1).
(b) Administers the MOS Life Cycle Management and oversees personnel proponent functions affecting CMF 94, CMF 89 and CMF 91.
(c) Serves as the senior technical advisor at the highest echelons of command such as HQDA, ACOMs, ASCCs, DRUs, corps, and divisions, and to allied armies in all matters pertaining to maintenance and logistics.
(d) Provides technical advisory services on contracting and production matters to commanders.
(e) Manages the development of training packages to ensure Army personnel are prepared to maintain new equipment systems prior to fielding.
(f) Performs other officer level duties as required consistent with senior staff officer responsibilities.
(g) Serves as assignment officer at Human Resources Command.', 'b583636990a628397ddcfc5e3e726cbbdb98d746e2f9b969fdfd951e6a26f944', 136, 136, null, 248, '2025-10-01', null, true, null),
  ('11c91673-5d7e-58fd-8b54-ef2eb10a5161', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '915S', 'STRYKER MAINTENANCE WARRANT OFFICER', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Plans, organizes, and allocates resources and facilities to execute maintenance and repair of light and heavy military and commercial wheeled vehicles; Stryker combat vehicles; wheeled construction equipment; mobile electric power generation; armament systems; small arms; fire control; ground support equipment and power driven chemical equipment.
(b) Evaluates and inspects maintenance operations and develops and implements corrective action plans where necessary to comply with regulatory and statutory requirements applicable to industrial maintenance operations in fixed facilities or field environments.
(c) Identifies technical training deficiencies within the military or civilian work force and develops comprehensive corrective action plans to provide necessary training. Personally trains maintenance personnel to accurately diagnose/troubleshoot mechanical, electrical, pneumatic and hydraulic malfunctions accurately using the latest test equipment, technical publications and procedures available.
(d) Provides management oversight and technical guidance on the establishment of unit Shop Stock, Bench Stock, and consumable shop supplies per applicable supply calculations. Coordinates for, or provides technical training for Army Logistics Information Systems (LIS) system operators.
(e) Develops and updates the commander’s Standing Operating Procedures (SOP) for the conduct of maintenance operations to include: safety, fire prevention and environmental protection and physical security within the maintenance facility. Assist the commander in preparation for all external inspections and visits by installation/ACOM safety, fire prevention, and environmental protection agencies.
(f) Oversees the commander’s calibration program and ensures calibration operations are treated as maintenance operations and are covered in the unit’s maintenance SOP.
(g) Oversees the Army Oil Analysis Program to ensure it is in compliance with regulatory requirements.
(h) Trains and directs recovery vehicle operators in safe and correct recovery operations.
(i) Utilizes LIS to provide maintenance and readiness information to the commander and supervisors. Submits Software Engineering Change Proposals to the appropriate agencies when automated maintenance management systems do not function as designed.
(j) Plans, schedules, and publishes scheduled service plans for all assigned equipment per the applicable technical manuals/lubrication orders.
(k) Coordinates with the installation/ACOM or AMC, on application of modification work orders on unit equipment.
(l) Conducts technical inspections of unit equipment to determine maintenance status. This includes CBRN, weapons, communications, ground support equipment, and required sets, kits, outfits, and tools (SKOT).
(m) Manages property accountability for the commander for all equipment used in the performance of maintenance.
(n) Ensures that maintenance personnel are using current technical publications. Inspects and verifies that pinpoint distribution accounts are current for all maintenance sections in the unit.
(o) Establishes the commander’s quality assurance program for maintenance and repairs. Oversee all quality control inspections and inspectors to validate their capability to identify improper repairs and scheduled services.
(p) Acts as the commander’s Command Inspection Program (CIP) maintenance team chief. Personally ensures that the CIP is fair and inspecting to the published standard in all areas associated with equipment maintenance.
(q) Coordinates with other maintenance activities and external agencies to resolve disagreements and maintenance quality control problems.
(r) Acts as the unit point of contact for Army Materiel Status System (AMSS) reporting and issues that arise between the unit, the support operations/distribution management center and Army level.', '623c31134461914277e69ec2905ea14326317e1ad62a1b547394b753e36fedd5', 137, 138, null, 249, '2025-10-01', null, false, null),
  ('1191a871-45a3-5703-9eee-cc4fb14e9311', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '915S', 'STRYKER MAINTENANCE WARRANT OFFICER', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1).
(b) Serves as the senior technical advisor to battalion commanders and the staffs of combat arms maneuver battalions, forward support companies, and task organized combat arms maneuver formations.
(c) Assists a combat arms maneuver battalion or forward support company staff in the planning, coordination, and execution of maintenance support during tactical training and combat operations.
(d) Provides technical expertise in maintenance doctrine on the battlefield necessary for a combat maneuver battalion or squadron staff to efficiently employ maintenance personnel and equipment in support of the commander’s mission.
(e) Coordinates maintenance support necessary for sustainment of readiness in a combat arms maneuver battalion or squadron.
(f) Provides input to supporting maintenance unit commanders and their staffs on tactical support requirements peculiar to the combat maneuver battalion or squadron.
(g) Directs and manages field level Stryker, automotive, and related support equipment repair teams, sections, and platoons in forward support companies, support maintenance companies, and other combat service support units.
(h) Controls work flow in field maintenance shops under his/her control.
(i) Trains maintainers in correct diagnostics, repair, and quality control procedures on equipment repaired in shops under his/her control.
(j) Establishes internal controls for requesting, maintaining, and properly disposing of supplies, tools and parts, and technical reference material within shops under his/her control.
(k) Provides input to the commander for development of internal and external maintenance Standing Operating Procedures (SOP).
(l) Provides technical advice to the commander on the efficient employment of field repair capability in field training and combat environments.
(m) Employs automated maintenance management systems to improve productivity in shops under his/her control.
(n) Provides technical advice to supported unit commanders and staff on technical maintenance management and maintenance doctrine.
(o) Acts as installation, Army Command, or Army maintenance inspection or training team chief.
(p) Diagnoses complex malfunctions on Stryker, automotive and support equipment when the malfunctions are beyond the capability of subordinates.
(q) Provides Ordnance related technical and doctrinal expertise to brigade and group level commanders and staffs. .', '2e775c84ee3650376f9e0d66b6959d70ccaf5f74203e62e23b15191490058a91', 138, 139, null, 250, '2025-10-01', null, true, null),
  ('644899f5-60ae-5140-b8a4-54bb59c22f31', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '915S', 'STRYKER MAINTENANCE WARRANT OFFICER', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1) and g(2).
(b) Serves as the senior ground maintenance technical advisor in brigade and group levels of command.
(c)Assists brigade and group staff in the planning, coordination, and execution of maintenance support.
(d) Provides technical expertise in maintenance doctrine on the battlefield for brigade and subordinate element level commanders and staff to efficiently employ maintenance personnel and equipment in support of the commanders’ mission.
(e) Manages materiel readiness reporting for brigade and echelons above brigade organizations.
(f) Performs materiel readiness management duties at sustainment command levels.
(g) Performs research, development, test and evaluation duties.
(h) Assists in coordination and evaluates maintenance performed by contract support.
(i) Serves as Ordnance technical subject matter expert in training, capability, and materiel development positions.
(j) Advises commanders on the progression and utilization of subordinate Ordnance warrant officers.', 'f69c4df089853e2ab64a8a99d41b11f0483db30075eba882e8b0bfc28eb71d0a', 139, 139, null, 251, '2025-10-01', null, true, null),
  ('1690a4b8-a791-5ce0-9dd1-3b3798bba802', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '915T', 'TRACK MAINTENANCE WARRANT OFFICER', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Plans, organizes, and allocates resources and facilities to execute maintenance and repair of light and heavy military and commercial wheeled vehicles; track combat vehicles; wheeled and track construction equipment; mobile electric power generation; armament systems; small arms; fire control; ground support equipment and power driven chemical equipment.
(b) Evaluates and inspects maintenance operations and develops and implements corrective action plans where necessary to comply with regulatory and statutory requirements applicable to industrial maintenance operations in fixed facilities or field environments.
(c) Identifies technical training deficiencies within the military or civilian work force and develops comprehensive corrective action plans to provide necessary training. Personally trains maintenance personnel to accurately diagnose/troubleshoot mechanical, electrical, pneumatic and hydraulic malfunctions accurately using the latest test equipment, technical publications and procedures available.
(d) Provides management oversight and technical guidance on the establishment of unit Shop Stock, Bench Stock, and consumable shop supplies per applicable supply calculations. Coordinates for, or provides technical training for Army Logistics Information Systems (LIS) system operators.
(e) Develops and updates the commander’s Standing Operating Procedures (SOP) for the conduct of maintenance operations to include: safety, fire prevention and environmental protection and physical security within the maintenance facility. Assist the commander in preparation for all external inspections and visits by installation/ACOM safety, fire prevention, and environmental protection agencies.
(f) Oversees the commander’s calibration program and ensures calibration operations are treated as maintenance operations and are covered in the unit’s maintenance SOP.
(g) Oversees the Army Oil Analysis Program to ensure it is in compliance with regulatory requirements.
(h) Trains and directs recovery vehicle operators in safe and correct recovery operations.
(i) Utilizes LIS to provide maintenance and readiness information to the commander and supervisors. Submits Software Engineering Change Proposals to the appropriate agencies when automated maintenance management systems do not function as designed.
(j) Plans, schedules, and publishes scheduled service plans for all assigned equipment per the applicable technical manuals/lubrication orders.
(k) Coordinates with the installation/ACOM or AMC, on application of modification work orders on unit equipment.
(l) Conducts technical inspections of unit equipment to determine maintenance status. This includes CBRN, weapons, communications, ground support equipment, and required sets, kits, outfits, and tools (SKOT).
(m) Manages property accountability for the commander for all equipment used in the performance of maintenance.
(n) Ensures that maintenance personnel are using current technical publications. Inspects and verifies that pinpoint distribution accounts are current for all maintenance sections in the unit.
(o) Establishes the commander’s quality assurance program for maintenance and repairs. Oversee all quality control inspections and inspectors to validate their capability to identify improper repairs and scheduled services.
(p) Acts as the commander’s Command Inspection Program (CIP) maintenance team chief. Personally ensures that the CIP is fair and inspecting to the published standard in all areas associated with equipment maintenance.
(q) Coordinates with other maintenance activities and external agencies to resolve disagreements and maintenance quality control problems.
(r) Acts as the unit point of contact for Army Materiel Status System (AMSS) reporting and issues that arise between the unit, the support operations/distribution management center and Army level.', '1c361abdd44a8a93ae18e3171536b43bd194acb6d9b7de1a13b6ca40e3c8a60b', 140, 141, null, 252, '2025-10-01', null, false, null),
  ('2939f9c1-84c8-5bfe-86f8-0e266e511d9e', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '915T', 'TRACK MAINTENANCE WARRANT OFFICER', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1).
(b) Serves as the senior technical advisor to battalion commanders and the staffs of combat arms maneuver battalions, forward support companies, and task organized combat arms maneuver formations.
(c) Assists a combat arms maneuver battalion or forward support company staff in the planning, coordination, and execution of maintenance support during tactical training and combat operations.
(d) Provides technical expertise in maintenance doctrine on the battlefield necessary for a combat maneuver battalion or squadron staff to efficiently employ maintenance personnel and equipment in support of the commander’s mission.
(e) Coordinates maintenance support necessary for sustainment of readiness in a combat arms maneuver battalion or squadron.
(f) Provides input to supporting maintenance unit commanders and their staffs on tactical support requirements peculiar to the combat maneuver battalion or squadron.
(g) Directs and manages field level track, tank, automotive, and related support equipment repair teams, sections, and platoons in forward support companies, support maintenance companies, and other combat service support units.
(h) Controls work flow in field maintenance shops under his/her control.
(i) Trains maintainers in correct diagnostics, repair, and quality control procedures on equipment repaired in shops under his/her control.
(j) Establishes internal controls for requesting, maintaining, and properly disposing of supplies, tools and parts, and technical reference material within shops under his/her control.
(k) Provides input to the commander for development of internal and external maintenance Standing Operating Procedures (SOP).
(l) Provides technical advice to the commander on the efficient employment of field repair capability in field training and combat environments.
(m) Employs automated maintenance management systems to improve productivity in shops under his/her control.
(n) Provides technical advice to supported unit commanders and staff on technical maintenance management and maintenance doctrine.
(o) Acts as installation, Army Command, or Army maintenance inspection or training team chief.
(p) Diagnoses complex malfunctions on Stryker, automotive and support equipment when the malfunctions are beyond the capability of subordinates.
(q) Provides Ordnance related technical and doctrinal expertise to brigade and group level commanders and staffs. .', '9c776c4ce456c503c163e4f5f2ff6b194c87b7d7ef07f44ad9d1742765056915', 141, 142, null, 253, '2025-10-01', null, true, null),
  ('8b514445-e25f-5816-aac4-b2eb860b044a', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '915T', 'TRACK MAINTENANCE WARRANT OFFICER', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1) and g(2).
(b) Serves as the senior ground maintenance technical advisor in brigade and group levels of command.
(c)Assists brigade and group staff in the planning, coordination, and execution of maintenance support.
(d) Provides technical expertise in maintenance doctrine on the battlefield for brigade and subordinate element level commanders and staff to efficiently employ maintenance personnel and equipment in support of the commanders’ mission.
(e) Manages materiel readiness reporting for brigade and echelons above brigade organizations.
(f) Performs materiel readiness management duties at sustainment command levels.
(g) Performs research, development, test and evaluation duties.
(h) Assists in coordination and evaluates maintenance performed by contract support.
(i) Serves as Ordnance technical subject matter expert in training, capability, and materiel development positions.
(j) Advises commanders on the progression and utilization of subordinate Ordnance warrant officers.', 'f69c4df089853e2ab64a8a99d41b11f0483db30075eba882e8b0bfc28eb71d0a', 142, 142, null, 254, '2025-10-01', null, true, null),
  ('f00b72c9-398a-5cff-baf8-3b1b3045fe0b', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '919A', 'ENGINEER EQUIPMENT MAINTENANCE WARRANT OFFICER', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Supervises personnel in maintenance of engineer and ground support equipment.
(b) Analyzes malfunctions and supervises minor repair and adjustment of engineer equipment utilized for power generation, earthmoving, shaping and compacting, lifting and loading, quarrying and rock crushing, asphalt concrete mixing and surfacing, water purification, refrigeration and air conditioning, water gap crossing, POL transfer and engineer electronic application.
(c) Supervises maintenance of non-engineer equipment assigned by equipment authorization documents.
(d) Inspects incoming equipment to determine repair requirements, assigns work to subordinates, and ensures quality of work performed by inspection of outgoing equipment.
(e) Establishes maintenance and repair schedules based on equipment schedules and availability of parts, tools, and personnel and unit mission.
(f) Establishes internal administrative procedures to procure, store, and issue publications, tools, parts, and POL.
(g) Manages maintenance float items to replace equipment not repairable within prescribed time limits.', '593b6a04492bff837c1c23c54559b64b51ecc5b84e113fc190ff526fbe808a1c', 143, 143, null, 255, '2025-10-01', null, false, null),
  ('16fd8111-2c2b-5d55-ba3a-2d1fa5333fd1', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '920A', 'PROPERTY ACCOUNTING TECHNICIAN', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Serves as a technician or technical manager in a narrow technical functional area, generally at battalion or lower level organizations or as one of several property book team chiefs in the DISCOM, or where property book teams are established in support of the automated Standard Property Book System (SPBS). Additionally, will serve in a junior position in organizations where other senior Property Accounting Technician(s) are assigned.
(b) Supervises the technical aspects of unit property book records per AR 710-2.
(c) Performs in both manual and automated property book accounting environments with the related functions associated with accurate property accountability.
(d) Monitors and performs evaluations of subordinate supply operations per Command Supply Discipline Program (CSDP) and AR 710-2.
(e) Conducts financial inventory accounting as applied to the Army''s budgeting system.
(f) Complies with appropriate regulations, forms and procedures pertaining to property books, hand receipts and other property accounting documents.', '43cf6dd4df9f2069167e70a40b18113f7e867ff11f9d707d8a6e36483b7e759f', 144, 144, null, 256, null, null, false, null),
  ('bad39d7d-e044-51aa-8289-e5ab6df30d3e', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '920A', 'PROPERTY ACCOUNTING TECHNICIAN', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1).
(b) Serves as the senior Property Accounting Technician in mid-level management positions; generally at the brigade/group/regiment level; positions requiring a level of independence from supervision. Additionally, may serve as the Assistant Division Property Book Officer, or as the senior technician in the Reports Branch of DISCOM.
(c) Provides internal and external training and technical advice to junior Property Accounting Technicians.', '31606caed77287ee5f3d96bdba687d5a6a9a712568e1a719710c39adfc83befe', 144, 145, null, 257, null, null, true, null),
  ('151765f6-dfba-54b4-a8e8-0c479966e230', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '920A', 'PROPERTY ACCOUNTING TECHNICIAN', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(2).
(b) Instructs and provides technical advice to other countries in the development and management of their asset visibility programs.', '07d4d68700d6a6b439435b5c54858b0159ae941e85c4c6a5604a7759e7c96cfc', 145, 145, null, 258, null, null, true, null),
  ('b72536d4-dfe9-5087-90c1-57ffd2c47d3b', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '920A', 'PROPERTY ACCOUNTING TECHNICIAN', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(3).
(b) Serves as the most senior Property Accounting Technician in positions as technical advisor/analyses to commanders dealing in such complex areas as: force modernization, personnel management logistical support analysis, intergraded logistics support, project management development/analysis, logistics management and systems development.', 'ba9e30f1a53ae5e1f15a21fa477caab37170ae6b46b2c366f7de8c54d6927063', 145, 145, null, 259, null, null, true, null),
  ('67e4ad7f-229e-532f-9d35-0d7eb63fba54', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '920B', 'SUPPLY SYSTEMS TECHNICIAN', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Serves as technician or technical manager in a narrow technical functional area; generally at platoon, detachment, company or at the position in other organizations where senior Supply Systems Technician(s) are assigned.
(b) Generally this individual will serve alone in organizations which provide the following type supply support:
1. Nondivisional: Mission Supply Support Activity (SSA) with less than 3000 Authorized Stockage Line (ASL) and less than 30 personnel assigned or Customer Supply Support activity (SSA) with less than 3000 Authorized Stockage Lines (ASL) and less than 30 personnel assigned.
2. Divisional: All Forward Supply Support Activities. As a team member (Storage & Exchange section) in all Main Supply Support Activities.
(c) Serves as a team member in the following:
1. Division, DMMC.
2. Separate Brigade/Regiment/COSCOM/Group/Command.
3. Corps MMC.
(d) Instructs, manages and supervises personnel within a Supply Support Activity (SSA) concerning supply systems policy and functional procedures.
(e) Manages the receipt, storage and issuance of supplies and equipment at the SSA level in accordance with established policies and regulations.
(f) Plans stockage level requirements for stockage and control based on accumulation and demand.
(g) Controls management of operational float stocks to ensure compliance with Army policy.
(h) Inspects supported units to ensure stockage levels do not exceed prescribed levels.
(i) Provides technical guidance to personnel of supported units/activities in order to assist, establish, and maintain adequate stockage levels for mission accomplishment.
(j) Conducts periodic inventories of stockage supply items, initiates action for disposition of excesses and makes recommendations for changes to the authorized stockage list (ASL).
(k) Develops standard operating procedures and performs administrative duties related to the supply activity.', 'a8c43f11c6ad07ee45901c20488edf2d8e691d376d6f464b4b1f4e26e1dba581', 146, 147, null, 260, null, null, false, null),
  ('c73a2a0d-4448-5100-a624-a46c5aed9f27', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '920B', 'SUPPLY SYSTEMS TECHNICIAN', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1).
(b) Serves as the senior Supply Systems Technician in mid-level management positions; generally at the battalion (Separate Heavy Support and Main Support), and at the Brigade/Regiment level; positions requiring a level of independence from supervision. Additionally, will serve in senior level positions within the Division and COSCOM.
(c) Generally this individual will serve in positions which require the following advanced level MOS skills in supply support: --Nondivisional: Mission Supply Support Activity (SSA) with 3000 or more Authorized Stockage Lines (ASL) and 30 or more personnel authorized or Customer Supply Support Activity (SSA) with 3000 or more Authorized Stockage Lines (ASL) and 30 or more customers.
(d) Serves as a team leader or member at the following:
1. Division, DMMC.
2. Separate Brigade/Regiment/COSCOM/Group/Command.
3. Corps MMC.
(e) Instructs other countries in the development and management of their respective supply support systems.', '4d29ef60715f1c09dfba03b79765c4da07a05dd915f822060e7d806293db9567', 147, 147, null, 261, null, null, true, null),
  ('be2a05f6-8f15-5c9b-b96a-8348533f1a88', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '920B', 'SUPPLY SYSTEMS TECHNICIAN', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(2).
(b) As the senior Supply Systems Technician, serves in technical management and advisor positions requiring advanced level staff and technical skills and a high degree of independence from supervision. Will serve at selected Groups (Area Support or Corps Support), but will generally serve at Division, COSCOM, TAACOM or MACOM levels.
(c) Performs in contracting management and budgeting, requiring advanced written and oral skills.
(d) As the senior Supply Systems Technician, will generally serve as the supervisor of other MOS 920Bs who actually manage the supply accounts.
(e) Instructs and provides technical advice to other countries in the development and systems management of their supply systems.
(f) Serves as special project/action officer, technical analysis, technical advisor on the G-staffs, and as a systems designer/developer.', '1af70ad09f7a55bf966aad69322b50fa47f360d93fefd6d5f077ba9c3b9117fd', 147, 147, null, 262, null, null, true, null),
  ('305b79fe-8ef8-514d-bc0f-6bf91c652e76', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '920B', 'SUPPLY SYSTEMS TECHNICIAN', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(3).
(b) Serves as the most senior Supply Systems Technician in positions as technical advisor/analyses to major commanders in such complex areas as: force modernization, personnel management, logistical support analysis, integrated logistics support, project management development/analysis, logistics management and systems developments.
(c) Serves in positions which require an unusual depth and breadth of technical knowledge for functional training and curriculum development.
(d) Serves in selected QM branch MOS immaterial positions such as the career manager at PERSCOM, Chief of QM Warrant Officer Training, or as Chief Warrant Officer of the QM Corps. May be selected to serve in the CSS MOS immaterial position as CSS Warrant Officer Personnel Proponent at CASCOM. Additionally, may be selected to serve in Army Warrant Officer MOS immaterial positions at the DA level.', 'e472509d65925d0ebc749459e526d86a40cc2ebd05aebb9c7c63aa750e903779', 147, 147, null, 263, null, null, true, null),
  ('fd493ad4-141b-5c38-af3a-3d3640d044d5', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '921A', 'AIRDROP SYSTEMS TECHNICIAN', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Serves as a technician or technical manager in a narrow technical functional area; generally at platoon, detachment or company level. Additionally, will serve at battalion level in a junior position where other senior Airborne Systems Technician(s) are assigned.
(b) Provides broad general guidance and final approval of plans for the repair of parachutes and associated equipment; and establishment of rigging sites that support airdrop and airborne operations.
(c) Instructs and trains assigned personnel in airdrop procedures and equipment support techniques.
(d) Provides unit certification and continuing validation of technical proficiency of personnel and/or products.
(e) Ensures the use of doctrinal procedures in adjustments, care and preservation of parachutes, support equipment, tools and machinery.
(f) Coordinates loading of equipment and supplies into aircraft and participates in joint airdrop load inspections.
(g) Provides technical advice to the command and staff responsible for selecting, establishing and organizing fixed and mobile facilities for rigging and packaging equipment to be dropped from aircraft.
(h) Provides technical advice in all areas of airdrop operations for the organization''s mission responsibilities.', '83b223835ecb380e374fbd0e580b3fb436978500cec12a6fa51ba76ddb9fc2bc', 149, 149, null, 264, null, null, false, null),
  ('b1c40d68-32dd-5857-a1fa-1e96dcc35553', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '921A', 'AIRDROP SYSTEMS TECHNICIAN', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1).
(b) Serves as the senior Airdrop Systems Technician in mid-level management positions; generally at the platoon, detachment, company and battalion level requiring a certain degree of independence from supervision.
(c) Serves as the commander''s senior technical advisor/analysis in all areas of airdrop operations for the organization''s mission responsibilities.', '93367c7344bcbb04c25784c3ddfdefcabbf4ecccd63bd068763b99882c1ae170', 150, 150, null, 265, null, null, true, null),
  ('862ff8a2-d652-5b1d-bcab-a29bafa75b57', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '921A', 'AIRDROP SYSTEMS TECHNICIAN', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(2).
(b) Serves as the senior Airdrop Systems Technician in positions requiring advanced level staff and technical skills; generally at Corps or higher levels; positions requiring independence from supervision.
(c) Is responsible for synthesizing airdrop activities with all MACOMs, Integrating Centers and TRADOC schools.
(d) Synthesizes airdrop activities with all MACOMs, Integrating Centers and TRADOC schools.
(e) Provides direct interface with Air Force, Navy and Marine Corps elements involved in airdrop operations.
(f) Serves in positions requiring advanced technical skills to perform duties relate to test and evaluation and the development of safety policy and doctrine.
(g) Instructs and provide technical advice to countries in the development and management of their respective airdrop systems.', '8113b2d79837373249d52b1fc285834c9559b1d6371ba16a6ede61902aba4dc4', 150, 150, null, 266, null, null, true, null),
  ('8a273f4f-7da3-5ba6-8748-c0b000320027', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '921A', 'AIRDROP SYSTEMS TECHNICIAN', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(3).
(b) Serves as the most senior Airdrop Systems Technician in positions which require an unusual depth and breadth of technical knowledge for functional training and curriculum development or major systems integration skills.
(c) Provides technical advice and assistance in regards to airdrop activities worldwide, to include all aspects of training, personnel, doctrine, force structure, research, development, and requirements.
(d) Develops, reviews and updates the life-cycle management of Airborne Systems Technicians structure and force.', '5dae4ff1ea8ed348d2193c78615ca75c863b5f1f75ae8e4bae30d472201b7ccb', 150, 150, null, 267, null, null, true, null),
  ('d74af937-7f9f-5565-949f-50dd2201cc03', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '922A', 'FOOD SERVICE TECHNICIAN', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Serves as a technician or technical manager in a narrow technical functional area, generally as the Brigade/Group Food Service Technician or as the Assistant Division Food Service Advisor. Additionally, can serve as an Installation Food Program Manager.
(b) Manages personnel, equipment and facilities to implement the Army Field Feeding System, in training and mobilization during peace and wartime.
(c) Advises commanders on matters pertaining to the Army Field Feeding System and Theater of Operations.
(d) Supervises to subordinate unit dining facilities and field kitchens.
(e) Trains military and civilian personnel in procurement, storage, preparation and serving of food.
(f) Coordinates with Troop Issue Subsistence Activity (TISA) and Field Ration Break Point to ensure smooth and efficient flow of rations to dining facilities and field kitchens.
(g) Plan, train, oversees and evaluates ration break operations at all levels in the acquisition, receipt, storage, ration configuration, shipments, accountability for subsistence, water, ice religious operational rations, health and comfort packs in garrison, field training and theater of operations.
(h) Conducts surveys of food, equipment, personnel and facilities.
(i) Budgets for and requisitions supplies and equipment to include replacing equipment through life-cycle management. Prepares reports on design deficiencies in equipment and facilities.
(j) Coordinates with preventive medicine, veterinary and nutritional personnel on sanitation, nutritional surveys and in menu testing.
(k) Interprets and disseminates food service information, inspects field and installation food service operations and provides technical assistance to non-appropriated fund food service activities.
(l) Provides technical advice to the commander and staff during preparation of operational plans.', '97dc7bec39a3b9d4c1844f9bd26b3d192ebc6b69aa41d4ccfa5c199c29046f65', 151, 152, null, 268, null, null, false, null),
  ('6a1ec8de-bf66-5f4d-8373-793112a808cb', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '922A', 'FOOD SERVICE TECHNICIAN', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(1).
(b) Serves in positions requiring a level of independence from supervision; such as the Division Food Service Advisor or as Command Food Service Technician for an Area Support Group or Corp Support Group.
(c) Advises on matters pertaining to the establishment of programs in the culinary arts for Army food service personnel.', 'a06d053f155211ac9975b65dda504664b35b946d0ff06cc464fb7469660526bb', 152, 152, null, 269, null, null, true, null),
  ('8c9c5468-48e0-5578-9503-faa5e5cd8b87', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '922A', 'FOOD SERVICE TECHNICIAN', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in paragraph g(2).
(b) Serves as the senior Food Service Technician in positions requiring advanced level staff and technical skills; generally at the Corps or MACOM level, positions requiring independence from supervision.
(c) Instructs and provides technical advice to other countries in the development and management of their food service program.', 'd0e63a2c92faa6d7689536da250f596aa240cf02d61ac0f966d96e6f0eadf0a9', 152, 152, null, 270, null, null, true, null),
  ('0ab8270b-b8e8-577d-9595-28ae440e14fd', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '922A', 'FOOD SERVICE TECHNICIAN', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Perform duties described in paragraph g(3).
(b) Serves as the most senior Food Service Technician in positions which require an unusual depth and breadth of technical knowledge for functional training and curriculum development or major systems integration skills.
(c) Develops reviews and updates the life-cycle management for all Food Service warrant officers.
(d) Advises MACOM commanders dealing in force modernization, personnel management, logistic support analysis, integrated logistics support and integrated food service support.
(e) Serves in positions such as the Army''s Food Advisor, MACOM Food Service Technician or may be selected to serve in QM branch MOS immaterial positions such as the career manager at AHRC or as Chief Warrant Officer of the Quartermaster Corps. Additionally, may be selected to serve in Army Warrant Officer immaterial positions at the DA level.', 'b2d0c4eb52e180794f78e50192d10c35c3a5a7b6788fe6b8e010412bd56e0902', 152, 152, null, 271, null, null, true, null),
  ('f32fdf06-03aa-58d1-bfca-683f8ad4e74c', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '923A', 'PETROLEUM TECHNICIAN', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Serves as a technician or technical manager in a narrow technical functional area, generally at battalion or lower level organizations. Additionally, may serve in junior level position in organizations where other senior petroleum technician(s) are assigned.
(b) Service the technical aspects of petroleum operations.
(c) Instruct, manage and supervise personnel within a Petroleum Supply Company concerning petroleum policy and functional procedures.
(d) Provide technical guidance to personnel of supported units/activities in order to establish and maintain adequate petroleum stockage levels for mission accomplishment.
(e) Manage the assignment of duties, spot checks work adequacy and instructs and supervises subordinates in work techniques and procedures.
(f) Estimate requirements for personnel, equipment, user/organizational maintenance and repair of petroleum distribution facilities.
(g) Review, consolidate and prepare technical reports associated with POL activities in assigned unit. Supervise quality surveillance operation.
(h) Assist command and staff officers in appraisals of petroleum operations. Assist in coordination and implementation of operations, training programs, administrative matters and communication activities.
(i) Develop standard operating procedures and performs administrative duties related to the petroleum operation.', '8ffa6e17c088cf3d0ba841641de9eea3c99c39600f239cb7836fc8d1b9df564e', 153, 153, null, 272, null, null, false, null),
  ('6aac725b-b0f7-5e3f-bbd7-3678b766d647', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '923A', 'PETROLEUM TECHNICIAN', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Perform duties described in paragraph g(1).
(b) Serves as the senior petroleum technician in mid-level management positions; generally at the material manager level in Division/COSCOM.
(c) Serves as a team leader or member at the following:
1. Division, Division Material Management Center (DMMC).
2. Corps, Material Management Center.
3. Corps Support Command, Material Management Division
(d) Serves as the commander’s senior technical advisor/analyst in all areas of petroleum operations for the organization’s mission responsibilities.', '72999310a8765d8b1a9b79d76ee7b00d196682a716aae27d80298813828ddc0b', 153, 154, null, 273, null, null, true, null),
  ('d83add75-d8b0-5f3d-b7b4-68dfa417d939', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '923A', 'PETROLEUM TECHNICIAN', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described paragraphs g(2).
(b) Serves as the senior petroleum technician in positions required advanced level staff technical skills; generally at Corps or higher level; positions requiring independence from supervision.
(c) Responsible for synthesizing petroleum activities with all MACOMs, integrating centers and TRADOC schools.
(d) Provides direct interface with Air Force, Navy and Marine Corps elements involved in petroleum operations.
(e) Serves in positions requiring advanced technical skills to perform duties related to test and evaluation and the development of safety policy and doctrine.
(f) Instructs and provides technical advice to other countries in the development and management of their respective petroleum operation systems.
(g) Instructs and monitors students in a service school environment.', 'e6e4f69ddd7d316d8e8a01780cc31c5df436f1dae4f626a90df2f5b843cc7b48', 154, 154, null, 274, null, null, false, null),
  ('385affc5-3c00-5c79-84c2-07ee9be7952d', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '923A', 'PETROLEUM TECHNICIAN', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties as described in paragraphs g(3).
(b) Serves as the most senior petroleum technician in positions that require unusual depth and breadth of technical knowledge for functional training and curriculum development or major systems integration skills.
(c) Provides technical advice and assistance in regards to petroleum activities worldwide, to include all aspects of training, personnel, doctrine, force structure, research and development and requirements.
(d) Develop, review and updates the life-cycle management of the petroleum technician’s structure and force.
(e) Perform duties as proponent level personnel systems integrator.', '85cbfb4f95c2d9a3966243b4cc2d54aa37caf20ae1ad00485e7672f567397df6', 154, 154, null, 275, null, null, false, null),
  ('64f08184-ccd3-52ea-beea-fae3cfb9e4c7', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '948B', 'ELECTRONIC SYSTEMS MAINTENANCE WARRANT OFFICER', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Establishes section safety and crime/security prevention programs that ensures adherence to safety and crime/security prevention policies, practices, and regulations associated with these programs are followed.
(b) Manages personnel, equipment, and facility assets for the installation, operation, repair, maintenance, and modification of radio, radar, computer, electronic data processing, controlled cryptographic items, television, fiber optical, radiological and related communications equipment and associated tools, test and accessory equipment. Establishes section SOPs and instructions to ensure that a proper work environment is maintained. Ensures all assigned personnel adhere to maintenance schedules, The Army Maintenance Management Systems (TAMMS), Quality Assurance and Quality Control (QA-QC) procedures, and all Logistics Information Systems (LIS)
(c) Ensures that personnel are trained to use the tools, test equipment, applicable publications for the completion of the mission and are trained in automation skill relevant to their duties.
(d) Ensures that his/her section is deployable by supervising maintenance of the LIS develops, rehearses and implements load plans and deployment scenarios, establishes field SOPs and ensure that all facilities of the Mission Essential Task List (METL) are adhered to.
(e) Ensures that proper Logistics Information System tracking systems are utilized.
(f) Solves problems by interpreting technical data and schematics, researches and interprets supply data, fabricates repair parts when appropriate and uses outside resources when needed. Coordinate technical, and administrative and logistical interface between the maintenance activity and supported units.
(g) Advises commander and staff officers on electronic equipment’s development, procurement, capabilities, limitations and employment.
(h) Establishes, monitors, and maintains a comprehensive environmental protection program per national and local directives
(i) Performs other company grade officer level duties as required/essential to the unit mission.', 'ba4ef16ff4bf3e10f1f47e64b4ec86dfced4e91d99e47e014ce14f468312de0c', 155, 156, null, 276, null, null, false, null),
  ('f32efd4e-902c-55b2-b186-c835b3a8978a', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '948B', 'ELECTRONIC SYSTEMS MAINTENANCE WARRANT OFFICER', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described for the warrant officer level in para g (1) above.
(b) Serves as an instructor/writer in an Army or joint service school.
(c) Advises members of allied forces using signal and electronic equipment. Assists commanders of supported units in identifying and scheduling TMDE support requirements and provide technical assistance when needed.
(d) Serves as principal advisor to materiel management centers and all relevant staff offices on TMDE and subordinate maintenance facility matters.
(e) Responsible for all maintenance aspects related to Avionics Systems.
(f)Serves as Ordnance technical subject matter expert (SME) in training, capabilities and materiel development positions..
(g) Serves as Electronic Systems Maintenance Warrant Officer, with procurement activities, in research/development/test and evaluation activities or as an Electronic Systems Maintenance Warrant Officer in a MACOM/sub-MACOM involved in calibration equipment/TMDE development support activities.
(h) Interprets, applies, and disseminates administrative, technical, logistical, and supply publications and related data.
(i) Plans, prepares, and maintains an operating budget for the detachment/team and monitors fiscal allocation commitments and expenditures and maintains accountability. Certifies accuracy of instrumentation and ensures that accuracy is traceable to higher level standards. Manages Instrument Master Record File (IMRF) and Calibration Management Information System (CALMIS), for scheduled and supported items of TMDE and serves as system administrator for local Automated Data Processing Equipment (ADPE) systems.', '2876f458bbb8bc60b78e30c8caa44f9ae8e4fa2e5e091c6ae4ad181062022c67', 156, 156, null, 277, null, null, false, null),
  ('21699aed-5308-5b87-8c13-ffc8d87a933d', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '948B', 'ELECTRONIC SYSTEMS MAINTENANCE WARRANT OFFICER', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Is proficient in the duties described for the CW3 listed in paragraph g (2).
(b) Performs duties and serves with procurement as a research, development, test, and evaluation technician.
(c) Presents written or oral briefings to line, staff, and professional personnel on maintenance and related subject matters and provide staff studies or papers on pertinent maintenance and personnel issues.
(d) Provides technical and tactical assistance at any echelon of command or support activity for the U.S. Army or liaison activities with allied armies.
(e) Monitors, coordinate, analyze contracting, procurement, and material acquisition programs for new and existing electronic equipment. Provides data and technical guidance concerning future requirements, modification work order (MWO), product improvement program (PIP), and related program information that has an impact upon Life Cycle Systems Management (LCSM) of electronic equipment.
(f) Provides coordination between military and industry during development, testing, and fielding of new electronic equipment.
(g) Manages the development of training packages to ensure Army personnel are prepared to operate and maintain the new systems prior to fielding.', 'c9a0123024e4a2e49e2a836c501996edbfa94e204fd98b0135b1ca3dddba9ece', 156, 156, null, 278, null, null, false, null),
  ('17ddeb1e-3f59-5f66-8a5b-e5c2f03e92df', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '948D', 'ELECTRONIC MISSILE SYSTEMS MAINTENANCE WARRANT OFFICER', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Implements proper crime prevention, security and safety (IAW OSHA) procedures.
(b) Employs digital switching theory, logic, computer fundamentals and infrared fundamentals applicable to the Army’s missile systems and associated equipment. Responsible for the operation of maintenance support teams and field level maintenance facilities. Monitor unit status reporting requirements for tactical missile units and associated support elements. Supervise field level maintenance repair, organic tools, test sets, and associated training equipment. Estimates supply requirements, observes work practices, and detects and corrects improper procedures and techniques. Initiates and monitors Product Quality descripency report (PDQR) Supply Discrepancy Report (SDR) engineering changes proposal (ECP) documents. Ensures quality assurance/quality control (QA/QC) procedures are followed, to include calibration.
(c) Applies theory and fundamentals of solid-state devices and optics employed in guidance and sighting systems. Directs test procedures, diagnostic system analysis and troubleshooting techniques. Directs and assists personnel in solving complex problems of diagnosis, and modification, of automated test equipment used in support of missile systems.
(d) Directs the operation of Logistics Information Systems (LIS) for field level repairs and parts. Develops, coordinates, updates, and applies internal administration procedures to requisition, receive, issue, and store repair parts, tools, publication, supplies, appropriates shop supply procedures and maintenance related items.
(e) Advises commanders on technical aspects of missile systems maintenance, support testing and supply.
(f) Instructs subordinates in operating procedures, maintenance techniques, interpreting technical data used in care of special tools and supporting equipment, as well as The Army Maintenance Management System (TAMMS).
(g) Establishes, monitors, and maintains a comprehensive environmental protection program in accordance with international, national and local directives.', 'e8eacb957f1ed448e0432c89b7d1d20c996e59d251d65574d2f4f0a84ce4118e', 158, 159, null, 279, null, null, false, null),
  ('eb05ff96-ad61-5698-a9b1-160a2b1e5e45', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '948D', 'ELECTRONIC MISSILE SYSTEMS MAINTENANCE WARRANT OFFICER', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Performs duties described in para g(1) above.
(b) Provides technical guidance and direction to subordinate elements and serves as a technical or tactical advisor for missile systems. Manages the Army repair parts system and performs as a liaison to supported units to determine future support requirements and satisfaction with current support requirements.
(c) Develops and writes training material, and instructs/supervises at Army service schools. Serve as a service school instructor or project officer at staff level.
(d) Performs duties as a research, development, test, and evaluation technician.
(e) Is proficient in all aspects of missile maintenance operations and manages/directs maintenance operations in a tactical environment.
(f) Analyzes complex malfunctions occurring in missile systems and auxiliary equipment.
(g) Directs operations, maintenance, and calibrations of the ATE.
(h) Develops, implements, and monitors programs of instruction that enhance training of other warrant officer and enlisted MOSs.
(i) Monitors, identifies, and rectifies anomalies in the requisition life cycle of repair parts requisitions.
(j) Assists the commander or maintenance control officer in the application of available automation resources to optimize shop operations.', 'd7e0b6a075b083662522e495a88c7dfcc6f0e83b3fd9ff42a55361f75eb944e9', 159, 159, null, 280, null, null, false, null),
  ('d9160e44-826c-510c-9077-b28e13eba0e1', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '948D', 'ELECTRONIC MISSILE SYSTEMS MAINTENANCE WARRANT OFFICER', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Is proficient in the duties described for the CW3 listed in paragraph g(2).
(b) Performs duties and serves with procurement as a research, development, test, and evaluation technician.
(c) Presents written or oral briefings to line, staff, and professional personnel on maintenance and related subject matters and provide staff studies or papers on pertinent maintenance and personnel issues.
(d) Provides technical and tactical assistance at any echelon of command or support activity for the U.S. Army or liaison activities with allied armies.
(e) Monitors, coordinate, analyze contracting, procurement, and material acquisition programs for new and existing electronic equipment. Provides data and technical guidance concerning future requirements, modification work order (MWO), product improvement program (PIP), and related program information that has an impact upon Life Cycle Systems Management (LCSM) of electronic missile equipment.
(f) Provides coordination between military and industry during development, testing, and fielding of new electronic missile equipment.
(g) Manages the development of training packages to ensure Army personnel are prepared to operate and maintain the new systems prior to fielding.', '333491f87402e1c65129ee9cda6ed4521a2aa637022dc91213cc82d881a9ff17', 159, 159, null, 281, null, null, false, null),
  ('f2e910b9-0afb-57b2-bab9-558001e1799a', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '948E', 'SENIOR ELECTRONICS MAINTENANCE WARRANT OFFICER', 'rank_duties', 'W-1..W-2', null, 'Duties — WO1/CW2', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', 'see MOS 948B or MOS 948D.', 'e7bf029f99af6d56f80306069cbd77ff7bd8e578d154d0dcee57405a65aedd5f', 160, 160, null, 282, null, null, false, null),
  ('a66c81ab-30f2-59e7-8747-b6076c6719c9', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '948E', 'SENIOR ELECTRONICS MAINTENANCE WARRANT OFFICER', 'rank_duties', 'W-3', null, 'Duties — CW3', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', 'see MOS 948B or MOS 948D.', 'e7bf029f99af6d56f80306069cbd77ff7bd8e578d154d0dcee57405a65aedd5f', 160, 160, null, 283, null, null, false, null),
  ('278f64c2-422b-5c5f-b488-10a9a7024151', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '948E', 'SENIOR ELECTRONICS MAINTENANCE WARRANT OFFICER', 'rank_duties', 'W-4', null, 'Duties — CW4', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', 'see MOS 948B or MOS 948D', 'bd4d65c88f21ae417849d1f9687eab836173c304101761aa2a5d3c51dc2434c6', 160, 160, null, 284, null, null, false, null),
  ('030cb073-e7b2-5d1b-bf3e-dbc0616c9c16', '3021ff69-4dd8-5576-afdb-49874e1d8e20', 'Army', 'warrant', '948E', 'SENIOR ELECTRONICS MAINTENANCE WARRANT OFFICER', 'rank_duties', 'W-5', null, 'Duties — CW5', 'DA PAM 611-21, ch. 8 (warrant officer specifications)', '(a) Is proficient in the duties described for the CW4 level in paragraphs g(3) above.
(b) Manages various maintenance programs to include directing assembly line techniques, repair, and supply procedures appropriate to mobile, fixed, and depot shop conditions in the repair/rebuild of electronic systems and other depot activities.
(c) Coordinates contracting, procurement, and material acquisition programs and manages the development of training packages to ensure that Army personnel are prepared to operate and maintain new systems prior to fielding.
(d) Administers personnel management matters pertaining to CMFs 91 and 94; integrates electronics maintenance technical functions across MACOM or Department of the Army levels; oversees the MOS Life Cycle Management for all personnel proponent functions, for all Electronics Maintenance Ordnance Corps Warrant Officer MOS and serves as the electronic maintenance system or personnel integrator at MACOM or personnel proponent level.
(e) Serves as technical and tactical advisor for electronics systems at any echelon of command or support activity of the U.S. Army or in Military Advisory Groups assigned to allied armies and provides leadership, guidance, technical input and direction to subordinate elements, staff agencies and field commanders up to and including theater Army level.
(f) Manages the assignment of Electronics Maintenance Ordnance Corps Warrant Officers worldwide.
(g) Provides coordination between military and industry during development, testing, and fielding of new electronic equipment
(h) Technical advisor for the electronics equipment procurement process.
(i) Operates within the research and development area of electronics systems.
(j) Serves as a system or personnel integrator at MACOM or personnel proponent level.', 'ee3d72682a5c641651ad15df0b72d9911b6931a7a106407e892a69e8ac2fb2bb', 160, 160, null, 285, null, null, false, null);
commit;
