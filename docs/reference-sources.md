# Military reference sources — what is imported, what is verified, what is not

Last updated 2026-10-16. If something is not listed as verified, it is not verified.

## How lookups work (unchanged architecture)

An administrator downloads an official publication **once**, its text is extracted **once**, and the passages are stored in Supabase. A user's lookup only **reads** stored passages. It never downloads a publication, never parses a PDF, and never calls an AI model to return a stored record.

- Retrieval: `api/_lib/milReference.js` · action `mil-reference` in `api/resume-tools.js`
- Schema: `supabase/migrations/004_reference_registry.sql` then `005_reference_components_and_sections.sql`
- Importer (admin-time only, never in the request path): `scripts/import-reference-source.js`, `scripts/lib/careerGuides.js`
- Independent verifier: `scripts/verify-reference-bundle.js`

### What a lookup needs and returns

Branch, **rank (pay grade)**, an exact occupation code, and optionally a **component** (Active / Reserve / Guard). A missing rank or an invalid value is rejected before any paid model call (`translate`, `resume`) or answered as "needs input" (`mil-reference`). Result statuses: `verified` · `stale` (not re-checked in 135 days) · `unverified` (legacy row, no recorded version) · `ai_only` · `none`.

Every returned **section** carries its own source id, source reference (S1, S2…), PDF page(s), grade band and component. Sources are reported per section, with their own `verified`/`stale` status. Promotion-board criteria are stored but never returned or sent to a model.

## Publications imported

All three official PDFs were obtained from `api.army.mil` URLs listed on the Army G-1 page (https://www.army.mil/g-1), checked 2026-10-15. PDF page numbers throughout are PDF page **indices**, not printed page numbers.

| Source | SHA-256 | Date, and its basis | Passages | Specialty | Components |
|---|---|---|---|---|---|
| DA PAM 600-25, CMF 42 (AG Corps) | `d38d44c1…5286744` | 30 Sep 2025 — from the official file name and G-1 listing; **the PDF body prints no date** | 58 | 42A (enlisted) | all; Reserve+Guard (Ch. 6) |
| DA PAM 600-25, CMF 36 (Finance) | `799eb94c…526b660` | 19 Jul 2024 — file name, server `Last-Modified`, G-1 listing; **no date in the PDF body** | 66 | 36B (enlisted) | all; Reserve+Guard (Ch. 6) |
| Finance and Comptroller Branch (officer guide) | `996719b2…8eef` | 10 Sep 2025 — **printed on page 1** | 66 | 36A (officer); warrant statement | Active · Reserve · Guard |

The CMF 42 file supplied by the project owner is byte-identical (same SHA-256) to the official download.

**Chapters deliberately not imported** (listed per bundle in `data/reference/bundles/*.bundle.json` → `report.skippedChapters`): CMF-wide overviews (Ch. 1–2), pointer-only chapters (Ch. 5), and in CMF 42 every other MOS — 42R musician, 42S special bands, 42T talent acquisition (Ch. 7–15, PDF pp. 15–79). They are present in the PDF and absent from the registry, and a test asserts none of their text can appear in a 42A result.

**Mapping decision to confirm:** CMF-wide "Recommended career management, by rank" (Ch. 3) is attached to the document's own MOS (42A, 36B). It is general CMF guidance, so a reviewer should confirm that attachment.

## DA PAM 611-21: the primary source for every Army specialty (added 2026-10-16)

The Army's classification pamphlet (Smartbook, **November 2025**; chapter files posted to api.army.mil on 2025-12-04; no day is printed, so the 1st is stored) states what every enlisted MOS, warrant officer specialty and officer AOC does. It is the one uniform source, so it is what lets **MOS/AOC + rank alone** produce a translation without the person typing duties. The G-1 page lists no newer or superseding edition (checked 2026-10-16; Appendix A is a 2022 file and is not used).

| Imported chapter | Passages | Specialties with text | What is stored |
|---|---|---|---|
| Ch. 10c, enlisted MOS specifications | 853 | 194 codes (178 current) | "Major duties" and the duties of each skill level, mapped to grades by Table 9-2 (SL1 = E-1..E-4, SL2 = E-5 ... SL6 = E-9) |
| Ch. 8b, warrant officer specifications | 286 | 75 codes (75 current) | Duties for WO1/CW2, CW3, CW4, CW5 |
| Ch. 3, officer branches and functional areas | 365 | 168 codes (157 current) | Description of duties, special grading of positions, unique duty positions |

Where a specification changes on a stated date ("Effective 202610") each passage carries its own effective window and only the one in force today is returned (e.g. 92Y). Skill-level text that says "performs the duties of the preceding level" brings the lower level along, marked as included for that reason. Requirements, physical demands, ASIs, restrictions and standards-of-grade tables are **not** imported (they are rules about the MOS, not what it does). Lines skipped from each block are counted in `data/reference/bundles/army-611-21-*.bundle.json` → `report`.

**How it was checked.** (1) Every passage is verbatim on the PDF pages it cites, re-read independently by `scripts/verify-reference-bundle.js` (853/853, 286/286, 365/365; zero duplicates; `CLASS611_DIR=… npm test` repeats it). (2) Structure checks: every `(n) MOSC xxY n O` skill-level paragraph in the chapter text is either stored or is a "(Personnel Only)" administrative level; no passage contains a requirements-section label; stored grades compared with the structure chart. (3) Visual comparison of rendered PDF pages with the stored text, **27 pages**: the 8 enlisted MOS, 5 warrant specialties and 6 officer AOCs drawn at random (seed `review-611-21-2026-10-16`; 17X has no description) plus 92Y (two dated versions), 351L, 923A, 89E, 90A. It found and fixed: stray printed page numbers inside text, requirements text swallowed into the last skill level, a two-column layout joining one section's label to another's text, a trailing "Major" fragment, and sections the PDF prints twice. This was done by an AI model, not a human subject-matter expert; the review record is in `data/reference/approvals.json`. It is a sample plus complete automated checks, not a page-by-page review of the roughly 700 pages involved.

**Gaps (exact).**
- Officer AOCs with no description in the chapter (30 of 187 current): 17X, 37X, 38X, 46X, 48X, 49W, 49X, 50A, 56X, 60V, 64Z, 65X (designation / immaterial codes and sections the pamphlet does not describe), and the Health Services functional areas 70A-70K, 71A-71F, 72A-72D, 73A-73B (listed only in the structure chart). These get the official title and a request for the person's own tasks.
- Warrant grades where the pamphlet gives no duties of its own: 919A CW3 ("See MOS 915T") and 915E CW4. 140X is a MOS-immaterial code.
- Enlisted codes the pamphlet describes only with "major duties" and no per-grade text (about 18 current ones, e.g. 12A, 15K, 31Z, 51C): general duties only, and the answer says no grade-specific text exists.
- 35Z and 46Y have text only at their senior grades.
- Rescinded, future-effective, special-reporting and immaterial codes get no current specialty reference by design.
- DA PAM 600-25 / 600-3 career-development guidance (training, credentials, assignments by rank) is still imported for only 42A, 36B and 36A. The other guides in the collected set (59 enlisted and about 40 officer files) are not imported. A guide is also only a place to look: 32 current enlisted MOS have a guide older than their latest classification change.
- Component-specific guidance (Reserve/Guard) exists only in those three guides and is not shown, because the component choice was removed from the app.
- Air Force and the other services remain deferred.

## Where the data lives at run time

The reviewed data **ships with the app** (`api/_lib/referenceStore.data.js`, generated by `scripts/build-reference-store.js` from `data/reference/approvals.json` + the bundles). The build refuses a bundle whose content fingerprint differs from the reviewed one, and a test fails if the committed file is out of date. Lookups read it directly: no database, download or model call. The Supabase registry (migrations 004-007, `data/reference/sql/01-install.sql` and `02-approve.sql`) is still supported and is read in addition; a source that exists in both is read from the shipped copy. Claude has no database connection and by design does not pull the service-role key out of Vercel, so the SQL has **not** been run: running it is optional now, and is only needed if you want the same data visible in the database.

## What was checked, and how

Two different questions, kept in two different test files:

**Retrieval logic** (`tests/realdata.test.js`, `tests/milReference.test.js`, `tests/migrations.test.js`) — given stored passages, does the code return the right sections for the right grade/component, with the right source and page, and nothing else? These run over the **real extracted passages**, in memory and in a real Postgres engine.

**Publication accuracy** (`scripts/verify-reference-bundle.js`, `tests/pdfAccuracy.test.js`) — is what was stored actually what the PDF says? These re-read the PDF independently and need the PDF files (`CMF42_PDF`, `CMF36_PDF`, `FC_PDF`); **without them the tests are reported as skipped, not passed.**

Results on 2026-10-15:

| Check | CMF 42 | CMF 36 | Finance officer |
|---|---|---|---|
| Stored passages verbatim on the exact PDF pages claimed | 58 / 58 | 66 / 66 | 66 / 66 |
| In-scope lines accounted for by the parser | 589 / 589 | 794 / 794 | 559 / 559 |
| Duplicate passages | 0 | 0 | 0 |
| Characters on imported pages inside a passage | 85.6% | 94.8% | 92.2% |

The remainder is exactly: chapter/rank headings, item labels like "(d) Institutional Training:" (kept as the passage heading), and the skipped chapters. The full list is in `data/reference/reports/<id>.verification.json`; a passage-by-passage table is in `<id>.passages.md`.

**Visual review (corrected 2026-10-16).** An earlier version of this file said the stored text had been compared with rendered page images. That was not supported: most of those image reads were not actually visible when the claim was written, so it has been removed. A real review was then done: every imported page of the three sources was rendered and looked at, side by side with what was stored. That is CMF 42 PDF pp. 2–15, CMF 36 pp. 2–18 and Finance officer pp. 1–11 and 13–15 (figures on pp. 8, 9, 12, 13 are not imported). It checks that the text layer matches what is printed (columns, italics, page breaks, lettering) and that nothing visible was left out of an imported section. It was done once, by an AI model, not by a human subject-matter expert. It found: the printed typo "Awa rdee" (CMF 42 p. 7) preserved as printed; Reserve/Guard chapter text in CMF 36 that mixes whole-component and Guard-only paragraphs (fixed with explicit component rules); and no text missing from any imported section.

## Things in the source documents preserved as printed

- CMF 42 p. 7 prints "Distinguished Leadership Awa  rdee" with a visible gap. Preserved; it is the publication's own typo.
- CMF 42 p. 13 letters the SGM promotion block "(h)" (there is no "(g)"). The parser accepts the skip and classifies it as promotion criteria.
- Words split across a line at a hyphen appear as "three- phase", "Pre- Course". Text is stored as extracted, not "repaired".
- CMF 42 Private–Specialist/Corporal lists "Generating assignments" inline inside item (a); the other ranks list it as its own item (b). Both are stored as a separate "Generating assignments" passage.
- Italic/bold formatting is not preserved; words are.

## Findings about the sources

- **Finance officer chapter vs G-1 link (resolved as observed):** the plan reported that the G-1 Finance link pointed to an older April 2024 PDF. On 2026-10-15 the link *text* still shows an April 2024 path, but the link *target* is `…/2025/09/10/640a0b16/fc-10sep25.pdf`, the 10 Sep 2025 document imported here. Whether the proponent considers it the applicable edition was not independently confirmed.
- **CMF 42T/79:** G-1 also lists a separate `cmf-42t-79-da-pam-600-25-9-sep-26.pdf` (9 Sep 2026). The 42T chapter inside the 30 Sep 2025 CMF 42 edition may be superseded by it. This does not affect 42A, which is all that is imported, but any future 42T import should start from the newer document.
- **CMF 36 board brief** (25 Aug 2025) is a different document from the DA PAM chapter (19 Jul 2024). Not interchangeable; the board brief is not imported.
- **Finance officer guide Figures 1–4** (development models, KSBs, Reserve assignment tables) are images. Their content is **not** extracted, so assignment tables that exist only inside those figures are not in the registry.
- **Finance officer section 4:** "There are no warrant officers in the FC branch." Stored for grades W-1..W-5, so a warrant request gets the document's own statement rather than invented guidance.
- **DA PAM 611-21** (occupational classification) points to a Microsoft Teams/milSuite Smartbook. Not accessed, not imported.
- **AG officer DA PAM 600-3 (26 Jan 2026)** is listed on G-1 and is **not** imported.

## What is NOT verified

- **Coverage beyond these three documents.** Every other MOS/AOC/rating/AFSC is either a legacy row (shown as `unverified`) or a labeled AI draft or nothing. Air Force, Space Force, Coast Guard, Navy and Marine Corps have no registry sources.
- **The production database.** No credentials were available. The legacy tables' row counts, columns, and how they store rank sections are unknown until `supabase/inventory/reference_inventory.sql` is run (sections 1–4) and the results are shared. Until then, no reprocessing decision for legacy rows can be made.
- **The migrations against Supabase itself.** They ran in a real Postgres engine (PGlite): applied three times with no change, constraints enforced, row-level security enforced for the `anon` role, import idempotent, and the real retrieval code returned correct results from the imported data. That is a stand-in for staging, not a run on your Supabase project.
- **A Vercel preview with real data.** Not produced — see "Getting real data into a preview" below.
- **Costs.** Not measured.

## Importing, reviewing and approving a publication

```bash
# 1. Extract (needs the PDF; refuses a file whose SHA-256 differs from the manifest)
node scripts/import-reference-source.js --manifest data/reference/manifests/<id>.json --pdf /path/to/file.pdf

# 2. Check it against the PDF independently, and read the listing
node scripts/verify-reference-bundle.js --bundle data/reference/bundles/<id>.bundle.json --pdf /path/to/file.pdf
#    then read data/reference/reports/<id>.passages.md next to the PDF

# 3. Load it into Supabase as UNREVIEWED (invisible to users): run data/reference/sql/<id>.import.sql in the SQL editor

# 4. After a person has reviewed it, print the approval SQL and run it
node scripts/approve-reference-source.js --bundle data/reference/bundles/<id>.bundle.json --reviewer "Your Name"
```

A newly issued edition gets a **new manifest** (new SHA-256, new `id`). Import it, review it, approve it, then set `superseded_by` on the old source; the old approved version is kept, and cache keys include the source version so only affected answers change.

### Getting real data into a preview

Imports go in as `unreviewed`, and retrieval serves only `approved` sources, so nothing appears until you load and approve. The registry tables are separate from the legacy tables, and production (`main`) does not read them, so loading them does not change the live site; only a build of this branch reads the registry. Run migrations 004, 005 and 006, then the three import files, then approve after review. Vercel normally builds a preview for a pushed branch automatically, but no preview URL was visible from here.


## Extraction approval and generation safeguards (migration 006)

Apply 006 after 004 and 005. It adds an extraction fingerprint and revokes any
existing approval that has no fingerprint. Every import, including an identical
reimport, now resets approval and clears the reviewer and review timestamp.
Approval SQL targets the exact bundle fingerprint and returns the updated row.
If it returns zero rows, stop: the database contains a different extraction.
Generate approval SQL from the bundle currently being reviewed, not an old copy.

The content fingerprint includes source metadata and all extracted passage
mappings, not only the PDF checksum. The runtime cache includes this fingerprint,
so correcting a rank/component mapping in the same PDF cannot keep an old answer
cached after the corrected extraction is approved.

Both generators only use registry context with status `verified`. Legacy rows,
AI drafts, missing sections and references overdue for a currency check are not
authoritative generator context. Without a reviewed reference or personal duty/
service-record facts, the translator asks the person to describe tasks before
making a paid model call. The resume builder can still produce a template, but
must leave unprovided experience as prompts. This is a safeguard, not a claim that
model output is error-free: the connected preview and output still need review.

## Army code inventory (re-reconciled 2026-10-16, corrected)

**Correction.** The 2026-10-15 version of this inventory (187 enlisted listed / 171 current, 76 warrant current) was wrong: the parser anchored on "a. Major duties" and on exact heading spellings, and so missed 7 enlisted codes whose headings contain typos (e.g. `1110-15G.`, `10-17. MOS 17E`) and some warrant specialties that appear only in the specifications. The numbers below come from the heading-based parser in `scripts/lib/classification611.js` and agree with the passages actually imported.

`data/reference/corpus/army-code-inventory.{md,json}` is generated by `scripts/reconcile-army-inventory.js` from the official DA PAM 611-21 classification chapters (10c enlisted, 3 officer, 8a/8b warrant). It replaces the earlier 455-candidate queue, which was not a certified list. All 125 collected PDFs were re-downloaded and each matched its recorded SHA-256 exactly.

| Category | Codes listed | Current | Future-effective | Rescinded | Special reporting | Immaterial |
|---|--:|--:|--:|--:|--:|--:|
| Enlisted MOS | 194 | 178 | 1 (79S, Oct 2027) | 3 (12M; 15E and 15W from Oct 2026) | 6 | 6 |
| Officer AOC | 190 | 187 | 0 | 3 (88A, 91A, 92A from Oct 2026) | 0 | 0 |
| Warrant specialty | 78 | 75 | 0 | 0 | 0 | 3 |

How "current" was decided: by the latest dated marker on or before the as-of date (`(Effective 202610)`, `(Rescind 202610)`, chart notation `del 2610`/`add 2510`, and branch-level headings). Of the current codes, a dated marker supports the call for 63 of 178 enlisted (all on the code itself), 69 of 187 officer (64 via the branch heading, 5 on the code) and 19 of 75 warrant. **The rest (119 enlisted, 121 officer, 56 warrant) are current only because the classification chapter lists them with no contrary marker.** That is a weaker basis, and the data file records it per code. A code the chapter formats unusually could be missed. Four enlisted codes were flagged for a person: 91S (nonstandard date "251010", read as 10 Oct 2025) and 92A, 92F, 92Y (two effective dates on one heading; the later one is already in effect).

Handled by the app from this inventory (`api/_lib/armyCodeStatus.js`, generated data): a rescinded, future-effective, special-reporting or immaterial code never gets a "current specialty" reference. The person sees the plain reason with the PDF page and is asked for their own tasks. Their past code is never rewritten.

Enlisted guide chapters found in the 29 collected DA PAM 600-25 editions: 144 of the 178 current MOS. For 32 of those the guide edition is older than the code's latest classification change, so the guide may describe the earlier specification.

## What is reviewed and live-eligible

Three levels of checking are kept apart on purpose, and every approval record in `data/reference/approvals.json` states which applies:

1. **Verbatim check (automated, every passage).** `scripts/verify-reference-bundle.js` re-reads the PDF independently and confirms each passage is text found on the pages it cites, nothing is stored twice, and everything that was *not* stored (headings, labels, skipped chapters, removed running headers and table rows) is listed. Every approved bundle passes.
2. **Sampled visual review (AI model, not every page).** Rendered PDF pages were compared with the stored passages, concentrating on rank boundaries, tables and figures. The pages looked at are named in each approval's `scope`. The rest of each document was checked only by level 1 plus structural checks (grades in order, grades cross-checked against DA PAM 611-21, no heading-like line of another grade inside a passage, no unassigned lines).
3. **Human subject-matter review: none.** No Army career manager or proponent has reviewed anything here. Reviewer strings say "Claude Sonnet 5.5 (AI-assisted) ... authorized by project owner Rey Rodriguez. Not a human subject-matter-expert review."

What is live-eligible (ships with the app in `api/_lib/referenceStore.data.js`):

- **DA PAM 611-21 duties for every Army specialty**: 178 current enlisted MOS (plus 79S, effective 1 Oct 2027), 75 current warrant specialties, 161 of 189 current officer AOCs (see `coverage-reconciliation.md` for the 28 that have no description and why). Levels 1 and 2 (27 pages for the 611-21 import).
- **DA PAM 600-25 enlisted career guides, 28 guides (added 2026-10-17)**: development guidance by grade (training, assignments, credentials, self-development) for 174 of 179 current enlisted MOS. Level 1 on every passage; level 2 on about 40 rendered pages named in the approvals. Not every page was viewed.
- **DA PAM 600-3 officer pamphlets, 16 pamphlets (added 2026-10-18) plus the earlier Finance and Comptroller pilot**: grade-by-grade development guidance for 22 officer AOCs. Level 1 on every passage; level 2 on one to three pages per pamphlet.
- **Earlier pilots** (42A, 36B, 36A): reviewed page by page by an AI model (level 2 on every imported page), still no human review.

Imported but **not** approved and **not** served: the DA PAM 600-4 Medical Service Corps chapter (`army-600-4-20220223-medical-service-corps`): descriptions of duties for 70A to 73B. See "Medical Service Corps chapter" below.

Coverage of development guidance, with every exception and its reason: `data/reference/corpus/guide-coverage-reconciliation.md` (generated by `scripts/reconcile-guide-coverage.js`; a test fails if it is out of date or a specialty is unexplained).

## Career guides: how they are used and what they are not (2026-10-17)

- **Duties and recommendations are separate.** Only `general_duties`, `rank_duties` and `skills` text is ever sent to the writers (translator, quick resume, full resume builder) or used to ground a quote. Recommended training, credentials, assignments, self-development and the like are returned only as a labelled panel ("Recommended for your specialty and rank ... suggestions, not things you did"). A test (`tests/bundledReference.test.js`, "recommended training ... never reach a prompt") checks six specialties through the translator and both resume prompts.
- **Promotion-board criteria** (most/highly qualified indicators) are stored as `promotion_criteria` and never shown.
- **Running headers/footers and table rows removed.** Each removed line is listed in the bundle's `report.removedLines` and the verifier removes the same lines from the PDF text before comparing. Tables whose columns do not survive extraction are not imported: the CMF 68 ASI/SQI and 68W critical-leader tables and the CMF 18 education table.
- **Nonstandard guides** are handled by per-guide manifests (`data/reference/guide-manifests/`, `guide-manifests-600-3/`): outline-format guides (CMF 40), guides with no numbered chapters (CMF 51), chapters renumbered after a typo (CMF 88), chapters cut into their two by-rank lists (CMF 38), one-grade chapters (35Z), Reserve Component chapters skipped, drafts skipped.

### Enlisted exceptions (guide guidance)

08H, 79R, 88P: no guide chapter. 42S: four unit-specific chapters that cannot be told apart (withheld). 79T: two Active Guard/Reserve tracks per grade (withheld). 37F and 38B: the guide has no E-1 to E-4 section. 92Z: no E-8 section. 31 CID guide (30 Jan 2025) not imported because the 21 Aug 2025 CMF 31 guide supersedes it.

### Inventory count: 178 vs 179

178 enlisted MOS are *current* as of 2026-10-16. 79S (Career Counselor) is in the register as effective 1 Oct 2027, so it is *future-effective*, not current; the guide check lists it with the current codes (179). The duty reconciliation still counts 178 current.

### Army Medical Department: Medical Service Corps chapter (not approved)

The chapter file `20220223-medical-service-corps.pdf` (file name date 23 Feb 2022) is hosted on api.army.mil under an upload path dated 3 May 2023. The base pamphlet DA PAM 600-4, *Army Medical Department Officer Career Management*, is listed as active at 27 Apr 2023 (GlobalSpec search listing only; armypubs.army.mil was unreachable from here). The pamphlet says it is used with a "Smart Book" of per-corps chapters. **None of the official pages that could list the chapter does so**: army.mil/armymedicine (raw HTML searched), the Army G-1 publications page, and medcoe.army.mil/amedd-medical-service-corps have no DA PAM 600-4 chapter, and the AMEDD chapter of DA PAM 600-3 (text dated 1 June 2017) only refers to DA PAM 600-4. So the chapter's currency, and its exact relationship to the 27 Apr 2023 pamphlet, are **not confirmed**. The bundle is imported (so it can be reviewed later) but has no approval record, is not in the shipped store, and the 18 AOCs it describes (70A, 70B, 70C, 70D, 70E, 70F, 70H, 70K, 71A, 71B, 71E, 71F, 72A, 72B, 72C, 72D, 73A, 73B) remain documented exceptions. For 70D and 72D the chapter uses different title words than DA PAM 611-21; that is recorded.

The Veterinary Corps (17 Dec 2021) and Specialist Corps (2 Feb 2022) chapters were downloaded and read but not imported; 64Z is described as an AOC-immaterial position code on the strength of DA PAM 611-21's own chart title, and 65X is left as "no description" because the only source that calls it immaterial is the unconfirmed chapter.

### AOC 50A

DA PAM 611-21 section 3-50 describes Functional Area 50 ("Force Management"); the structure chart lists FA 50 with exactly one AOC, 50A, titled "Force Development". The section is applied to 50A (description, special grading, unique duty positions; the functional-area description paragraph is not). The FA50 career pamphlet (25 Apr 2024) calls the functional area Force Management and refers to "50A coded" positions.

### Officer pamphlets

Imported (Regular Army run, officers only): Air Defense Artillery 14A; Engineer 12A; Military Police 31A; Military Intelligence 35A, 35B; Signal 25A; Data Network Engineering 26A, 26B, 26Z; Aviation 15A; Information Operations 30A; Judge Advocate General's Corps 27A; Public Affairs 46A; Force Management 50A; Operations Research/Systems Analysis 49A; Marketing 58A; Strategist 59A; Psychological Operations 37A; Adjutant General 42B, 42C, 42H; plus the earlier Finance and Comptroller pilot (36A). Reserve Component runs, warrant-officer sections, figures and drafts are not imported. Every pamphlet that was not imported, with the reason, is in `guide-coverage-reconciliation.md`.

## Release tests for the career-guide release (2026-10-17/18)

Evidence files: `data/reference/audits/2026-10-18/` (plans, results, logs, the downloaded resumes). All real-model calls went to a **Vercel preview** with the personal-duties field **empty** and no Vault unless stated; each row checks HTTP 200 (or 422 for a code with no description), every entry labeled "publication" with a quote and PDF page, and that quote found in the official PDF at the cited page, re-read independently (the 611-21 chapter, or the career-guide PDF named in the entry's source URL).

| Run | What | Result |
|---|---|---|
| Preview build 1, first plan | 13M, 18Z, 25H, 17C, 94S, 19C, 64E, 47M, 11A (random draw, seed `release-2026-10-17-guides`, 6 enlisted + 4 officer + 2 warrant) at 1-2 ranks, plus one synthetic bullet each | 25 of 25 rows passed before the script's connection dropped (curl exit 56); the script now retries and saves each row |
| Preview build 1, second plan | 28A, 882A, 351M (rest of the draw) and 40D, 51C, 68W, 27D (new guides) | 18 of 18 rows run passed; stopped after 27D E-7 so the remainder could be re-run on the final build |
| **Preview, final build (commit 885bb91)** | 37F, 38B, 35Z, 92Z (E-8 and E-9), 42S, 79T, 51C; officer 14A, 31A, 35A, 25A, 12A, 58A, 49A, 37A, 42B, 27A, 30A, 46A, 15A, 50A, 26Z; 70A and 64Z (no description: must ask for details) | **32 of 32 rows passed**: 70A and 64Z returned HTTP 422 with no model call; 70A with a personal bullet returned a personal entry |
| Browser flow A (preview, real model, relayed through the local UI) | Translator, Army 15K E-7, nothing typed, no Vault, then "Build my resume draft", **Download .txt**; then "Build my resume with these results" through the wizard, **Generate**, **Download Word**, **Download PDF** (print) | Entries labeled "typical for your specialty and rank, from DA PAM 611-21, p. 89"; rank note "gives no separate duties for E-7"; the recommendation panel was collapsed and labeled as suggestions. TXT and DOCX: SPECIALTY SCOPE bullets all start "[CONFIRM]"; YOUR ACCOMPLISHMENTS only "[ADD: ...]" prompts; none of the 10 recommendation passages for 15K appears in either file |
| Browser flow B (same, with synthetic personal bullets and a synthetic Vault record) | Army 68D E-5; typed two synthetic sentences; the relay added a synthetic Vault record (no account can be created for a test) | Entries labeled "from what you described", "from your uploaded records" and one "typical for your specialty" entry; the resume's YOUR ACCOMPLISHMENTS restate only the typed and Vault sentences; SPECIALTY SCOPE bullets are "[CONFIRM]"; none of the 24 recommendation passages for 68D appears in the TXT or DOCX |

**Findings from flow B, fixed after the preview (commit 66e3a1a):** the model wrote "Recognized for training new team members" and, in accomplishments, "without gaps or missed entries" and "clearly and on schedule", none of which the person said, and the claim check did not flag them. The check (`api/_lib/claimLint.js`) now also flags recognition words and quality/timing phrases that are not in the person's own text (tests added). The check remains a word list, not a proof: other embellishments can still pass.

**Known unchanged behavior:** the translator's "Transferable skills" list is a model suggestion list, not a claim; for 68D it included "Sterile field creation and maintenance during surgical procedures" which the synthetic person never described. In the resume it appears only under CORE COMPETENCIES behind "[CONFIRM: keep only the skills below that you can demonstrate]".

## Release tests for the DA PAM 611-21 release (2026-10-16)

All with the personal-duties field **empty** and no Vault documents, against the real model. Each row checks: HTTP 200, every entry labeled "publication" with a quote and a PDF page, and that quote found in the official PDF text (re-read independently) on the cited page; the cited grade is the requested grade or a lower one the text says it includes. `scripts/reference-spot-check.mjs`; draws by `scripts/random-audit-sample.js` (seeds `predeploy-611-21-2026-10-16`, `predeploy-warrant-2026-10-16`, `production-611-21-2026-10-16`; nothing excluded or replaced after the draw).

| Run | Codes (ranks) | Result |
|---|---|---|
| Preview, build before the final data fixes | 08H, 15M, 68X, 47D, 63F, 56A at 2-3 ranks each, plus 1 personal bullet per code (23 calls) | 23 of 23 passed |
| Preview, final data | the same six + 49B, 60U (added AOCs) + warrant 255N, 890A, and 351Y (a cross-reference-only code; it must ask for details, and did, HTTP 422 with no model call) (16 calls) | 16 of 16 passed |
| Production, new random draw | 17E, 31B, 18F, 38A, 67E, 47A, 880A, 150U + 3 personal bullets (12 calls) | 11 passed; 150U CW4 failed (HTTP 502/429): its only text was "Performs all duties outlined in paragraph g (2)", which the warrant importer did not recognize as "includes the lower grades". Fixed (shared pattern, plus one retry when nothing can be traced) |
| Preview with the fix | 150U W-4/W-5, 420C W-3, 155A W-3/W-4, 151A W-3 | 6 of 6 passed |
| Production after the fix | 150U W-4, 25B E-6, 17A O-3, and the production UI with 25B E-6 and the duties box empty | passed; 150U W-4 now returns W-4 plus the W-3 and W-1..W-2 text it refers to |

Exhaustive, no model (`tests/bundledReference.test.js`): every current code at every grade through the translator handler: 3,867 combinations; 3,527 produced a translation from that code's own text only, 340 asked for details because the publication has nothing for that code and grade, 0 showed another code's text or another grade's duties, and 2,196 had no grade-specific text and said so. Optional personal bullets and Vault text were tested with real-model calls (a "personal" entry appeared in every one) and in unit tests.

## Earlier post-deployment random spot check (2026-10-16, before DA PAM 611-21 was imported; superseded by the section below)

A supplement to the full audit above, **not** a coverage claim. Evidence: `data/reference/audits/` (plan, run 1 before fixes, run 2 after, run 3 focused confirmation). All personal experience used was clearly synthetic ("SYNTHETIC TEST PROFILE, not a real person").

**Method.** `scripts/random-audit-sample.js`: SHA-256 of a fixed seed string, then a mulberry32 shuffle of the code-sorted pool of `current` codes in `army-code-inventory.json` (171 enlisted, 187 officer, as of 2026-10-15); first 3 enlisted and first 3 officer. The seed string was `tyfms-army-accuracy-6258126b0dd9eb50d8b8dd60b27d4ecb1fe57cb5`. It was meant to embed the full deployed commit hash but its tail was mistyped, so it is simply a fixed string set before any lookup; the draw is reproducible from it. Nothing was excluded or replaced afterwards. Drawn: enlisted **25E, 92Z, 15M**; officer **47M, 40A, 51C**. Ranks were taken from each code's documented structure (skill levels in DA PAM 611-21 for enlisted, the grade range in its officer chart).

| Code | Ranks / components tested | Official sources compared | Lookup (production) | Result |
|---|---|---|---|---|
| 25E Electromagnetic Spectrum Manager | E-6 active, E-7 reserve, E-6 guard | 611-21 ch.10c PDF p.146 (spec); CMF 25 guide 25 Jun 2024, PDF p.10 | `unverified` legacy row; its text matches the CMF 25 guide verbatim (p.10) but the guide's duties section is only a pointer to 611-21; no rank or component content | **Honest, but no reviewed reference (gap).** Generation checks passed after fixes |
| 92Z Senior Noncommissioned Logistician | E-8 active, E-9 guard | 611-21 ch.10c pp.340 (Effective 202610) and 342 (Eff 202510); CMF 92 guide 28 Jan 2025, PDF p.42 | `unverified` legacy row that is **out of date**: says duties of "92A and 92Y at the 6 skill level"; the CMF 92 guide names seven MOS and the current spec says "at the grade SFC" | **Gap, and a stored row contradicts the current spec.** Labeled "may be out of date" |
| 15M MQ-1 Repairer | E-4 active, E-6 reserve | 611-21 ch.10c PDF p.91; CMF 15 guide 25 Aug 2026, PDF p.15 (Chapter 14) | `none` | **Gap.** Run 1 found the model calling it a "UH-72 Repairer" (wrong); fixed |
| 47M USMA Professor of Chemistry | O-5, O-6 (chart grades 5-6), active | 611-21 ch.3 PDF p.18; DA PAM 600-3 FA 47 pamphlet "as of 13 April 2020" | `none` | **Gap** (the only pamphlet is dated 2020) |
| 40A Space Operations | O-3 active, O-5 guard (chart grades 3-6) | 611-21 ch.3 PDF p.16; DA PAM 600-3 supplement whose summary of change is dated 25 Aug 2026 (file name says "final-draft") | `none` | **Gap.** Run 1 gave it an unrelated "Army Signal" line; fixed |
| 51C Contract and Industrial Management | O-3 active, O-5 reserve (chart grades 2-6) | 611-21 ch.3 PDF p.20; DA PAM 600-3 Acquisition FA 51, 7 Nov 2022 | `none` | **Gap** |

**What passed in every run, for all six codes and both ranks:** repeat lookups were identical and none came from an AI path; the translator refused with no personal facts (HTTP 422) before any model call; no invented numbers or credential claims appeared in the resume text; the translator-to-resume handoff carried branch, MOS, rank and the described tasks (checked through the API for all six and in the production UI for 25E).

**What failed in run 1 (before fixes), all with no reviewed reference available:** 15M described as a UH-72 Repairer (official title: MQ-1 Repairer, confirmed by the CMF 15 guide); 40A given an "Army Signal" line; invented civilian job titles on the position line; effects the person never stated ("reducing the risk of missed discrepancies", "before sign-off"); PMP recommended to a trainee (PMI lists 3+ years leading projects). **Fixed:** every Army code's official title (from 611-21) is now the only thing the generators may say about what a code is; the position line states the official title with civilian equivalents only as `[CONFIRM: ...]`; a no-embellishment rule in all prompts; a deterministic check that annotates quality or result wording the person did not use; verified eligibility text on PMP and CISSP.

**Residual limits.** The wording check covers a fixed list of claim words, not every possible embellishment (run 3 still showed "precision" and "procedural discipline" phrasing in a summary). With no reviewed reference, the model still produces civilian-sounding paraphrases of the person's own tasks; they are labeled and must be confirmed by the person. For none of the six was there a reviewed reference to compare returned content against, so "returned information matches the official PDF" could not be demonstrated for any of them; that is a coverage gap, not a pass.

## Installing and approving in Supabase

**Deployment does not need any Supabase change.** The approved reference data ships inside the app (`api/_lib/referenceStore.data.js`); the app reads the registry tables only to add anything approved there, and they are empty. Running the SQL stays optional. If it is ever run, `01-install.sql` is regenerated by `node scripts/build-install-sql.js` and now includes the career-guide bundles and the `skills` and `grades_authorized` section types (migrations 005 and 007 were edited in place; nothing has been run against a database before, so there is no migration to apply on top).

```sh
node scripts/build-install-sql.js
```

The reviewer recorded for each source, and what was reviewed, come from `data/reference/approvals.json`; a source with no matching review record is imported but never approved. This step is **optional** now: the reviewed data also ships with the app. Run `data/reference/sql/01-install.sql` in the Supabase SQL editor (migrations 004–007 plus every imported source, left **unreviewed**; users see nothing from it). After reviewing, run `02-approve.sql`: each statement matches the exact content fingerprint, so a source re-imported with different content since review matches 0 rows and stays unapproved. Re-running 01 revokes approval by design. Both files are idempotent and were tested in a real Postgres engine (PGlite) including row-level security. They have **not** been run against the TYFMS Supabase project by Claude: no database connection is available to it, and it declined to extract the service-role key from Vercel to write to production.

## Remaining requirements for full Army coverage

Record every chapter/section of each source as imported, superseded, not applicable, future-effective or pending, with a reason for each skip. Keep Active, Reserve and Guard scopes separate. Review image-only charts visually or transcribe them with a second check. Resolve conflicting editions and future effective dates before approving current use. Passing tests, extracted text and character coverage are separate from, and do not establish, complete or current coverage.
