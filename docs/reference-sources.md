# Military reference sources — what is imported, what is verified, what is not

Last updated 2026-10-15. If something is not listed as verified, it is not verified.

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

**Direct visual comparison** against rendered PDF pages: CMF 42 pp. 7, 8, 13; CMF 36 p. 11; Finance officer p. 10. Stored text matched the page images, including text that runs across a page break. **This was spot-checking, not a full page-by-page read.**

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

Imports go in as `unreviewed`, and retrieval serves only `approved` sources, so nothing appears until you load and approve. The registry tables are separate from the legacy tables, and production (`main`) does not read them, so loading them does not change the live site; only a build of this branch reads the registry. Run migrations 004 and 005, then the three import files, then approve after review. Vercel normally builds a preview for a pushed branch automatically, but no preview URL was visible from here.
