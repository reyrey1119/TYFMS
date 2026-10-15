# Military reference sources — how it works, and what is and isn't verified

Last updated 2026-10-15. This file is the honest inventory. If something is not listed as verified, it is not verified.

## How lookups work (unchanged architecture)

Official publications are downloaded **once by an administrator**, their text is extracted **once**, and the results are stored in Supabase. A user's lookup only **reads** those stored passages. It never downloads a publication and never calls an AI model to return a stored record. An older publication is accepted as long as it is still the applicable one; age alone is not treated as a defect.

Code: `api/_lib/milReference.js` (retrieval) · `api/resume-tools.js` (`mil-reference` action) · `supabase/migrations/004_reference_registry.sql` (schema).

### What a lookup needs

Branch, **rank (pay grade)**, and an exact occupation code. A missing rank is a question back to the user, never a silent "enlisted". Component (Active / Reserve / Guard) is a separate optional field; Guard and Reserve are not branches.

### What a lookup returns — five honest statuses

| Status | Meaning | Shown to the user as |
|---|---|---|
| `verified` | Approved source, re-checked within 135 days | "Verified reference" + publication number, chapter, publication date, last-checked date, link, PDF page |
| `stale` | Approved source, not re-checked within 135 days | "Reference not re-checked recently" |
| `unverified` | A stored row with no recorded source version | "Stored reference — publication version not recorded" |
| `ai_only` | Model-written draft; nothing stored | "AI-written draft — not from an official publication" (never cached, never cited as a publication, never fed to the resume generator as authoritative) |
| `none` / `source_error` | Nothing usable on file / source could not be read | Explains the gap and asks for the person's own duties |

Reference text always describes what a specialty **typically** involves at a grade. It is never presented as what a person did. Recommended training, credentials, and developmental assignments are kept as separate categories and labeled "not proof anyone completed them". The resume generator may only write reference duties as the person's own if they tick the confirmation box.

## Coverage inventory (as of this commit)

| Area | Stored data | Status today |
|---|---|---|
| Army enlisted | `mos_reference_enlisted` (legacy) | **Unverified.** Row count and contents not inspected (no database access from the repo). Rows are not rank-specific. |
| Army officer / warrant | `aoc_reference_officer` (legacy) | **Unverified.** Exact-code match only (the old "first two-character prefix" match was removed; near-misses are offered as "did you mean"). Not rank-specific. |
| Navy | `navy_rating_reference` (legacy) | **Unverified.** |
| Marine Corps | `usmc_mos_reference` (legacy) | **Unverified.** |
| Air Force, Space Force, Coast Guard | none | No stored source. Shows a labeled AI draft or an explicit gap. The hardcoded "DAFECD/DAFOCD (Oct 2025)" label has been removed. |
| Registry (`reference_sources` / `reference_passages`) | **empty** — migration 004 creates it | Nothing imported yet, so nothing can currently show as `verified`. |

**Unknown until the inventory SQL is run:** the real column layout, row counts, and policies of the five legacy tables. Run `supabase/inventory/reference_inventory.sql` (read-only) in the Supabase SQL editor and send the results; this section gets real numbers then.

The legacy `mil_reference_cache` table is no longer read or written. Its keys omitted rank, so entries could serve an E-5 answer to an E-7. It can be dropped later; it was left in place so nothing is deleted.

## Source list and conflicts — taken from the plan, not yet independently verified

These came from the planning document. **I have not yet downloaded or opened any of these publications**, so none of the dates below are verified by this repo's tooling.

| Source | Reported detail | Open question |
|---|---|---|
| Army G-1 index (army.mil/g-1) | Discovery index for base DA PAMs and separately updated Smartbook chapters | Index is a discovery aid, not proof of currency |
| CMF 36 enlisted guidance | Reported updated 2024-07-19 | Separate from the board brief (reported 2025-08-25); different documents, not interchangeable dates |
| Finance officer chapter | Reported newer file dated 2025-09-10 | **Conflict:** the G-1 Finance link reportedly points to an older April-2024-hosted PDF. Confirm with the proponent which applies |
| AG officer material | Reported 2026-01-26 | Verify the document header and effective date on ingestion |
| CMF 42 enlisted | Reported updated 2025-09-30 | Verify header; chapter 4 holds 42A-specific guidance, chapter 3 is general (do not mix them) |
| DA PAM 611-21 | Cover points users to a Microsoft Teams Smartbook | Possibly access-restricted. Do not bypass; do not publish restricted content |

Page references must be **PDF page indices**, not printed page numbers (the registry stores both).

## Importing a publication (not built yet — deliberately)

The schema, retrieval and labeling are done and tested. The **importer is not**, because a section parser that preserves chapter → occupation → rank hierarchy must be tested against the real PDFs, and I will not ship an untested parser and call it done. Plan:

1. An administrator downloads an official publication to a local folder (official `army.mil` hosts only, size-capped).
2. A script computes the SHA-256, extracts text by page, splits on the document's own headings (general CMF guidance vs. occupation chapter vs. rank section), and writes `reference_sources` (status `pending`) + `reference_passages` with page references.
3. A human reviews the extracted sections against the PDF, then sets `review_status = 'approved'`. Only approved, non-superseded sources are ever served.
4. A newer publication is imported as a new source and the old one gets `superseded_by`; the old approved version is kept, only affected cache entries change (cache keys include the source version).
5. A quarterly check compares official metadata/headers and flags changes; nothing re-downloads on a user's lookup.

## What was NOT done in this batch (separate follow-up phases)

Privacy disclosures and vault deletion fixes, AdSense/SEO/public guides, operational cost metrics, fixing the rate-limiter's fail-open behavior, GA duplicate-pageview fix and campaign links, federal-resume/two-page validation. These were deliberately left as separately reviewable phases.

Also not done: a full catalog covering every certification the UI lists. `api/_lib/certCatalog.js` holds 29 entries whose provider links were checked on 2026-10-15; recommendations are restricted to it, and anything the model suggests outside it is dropped.

## Costs

Not measured. No usage or billing data was inspected; any cost figure would be an estimate.
