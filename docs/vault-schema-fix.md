# Document Vault: production upload fails (found 2026-10-19)

**Symptom:** a signed-in user uploads a file. The file reaches storage, but no `vault_documents` row is created, so the
document never appears and is never read for resumes. The page shows no error.

**Cause:** the live `public.vault_documents` table has no `content_type` column. The browser's insert is rejected with
`PGRST204: Could not find the 'content_type' column of 'vault_documents' in the schema cache`. The setup SQL in
`src/tabs/DocumentVaultTab.jsx` includes `content_type` and `extraction_summary`; the live table was evidently created from
an older version and never updated.

## Fix (owner runs this in the Supabase SQL editor)

```sql
ALTER TABLE public.vault_documents
  ADD COLUMN IF NOT EXISTS content_type text,
  ADD COLUMN IF NOT EXISTS extraction_summary jsonb;

NOTIFY pgrst, 'reload schema';

-- check: should list content_type and extraction_summary
SELECT column_name, data_type FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'vault_documents' ORDER BY ordinal_position;
```

## Clean up the test's leftover files (owner, in the Supabase dashboard)

The failed upload attempts left synthetic files in storage with no database row. In **Storage → document-vault → the
folder named for the signed-in account → `other`**, delete every file whose name contains `SYNTHETIC-TEST-DOCUMENT-QX7`
(up to three). Delete them in the dashboard, not with SQL: removing `storage.objects` rows with SQL does not remove the
stored bytes.

## Not changed

No code or approval was changed for this. Two code weaknesses are worth fixing afterwards: `uploadFile` ignores the insert
error (the person sees nothing), and it does not remove the just-uploaded file when the insert fails; `deleteDoc` ignores
errors from both the storage removal and the row delete and removes the row from the screen regardless.
