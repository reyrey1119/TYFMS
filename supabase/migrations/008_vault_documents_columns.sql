-- Document Vault: the live vault_documents table predates the columns the app writes (first content_type, then file_size were
-- found missing: every upload's row insert failed with PGRST204). This adds every non-key column the setup SQL in
-- src/tabs/DocumentVaultTab.jsx defines, only where it is missing. Additive and idempotent: existing rows, columns, RLS and
-- policies are untouched.
ALTER TABLE public.vault_documents
  ADD COLUMN IF NOT EXISTS file_size integer,
  ADD COLUMN IF NOT EXISTS content_type text,
  ADD COLUMN IF NOT EXISTS extracted_text text,
  ADD COLUMN IF NOT EXISTS extraction_summary jsonb,
  ADD COLUMN IF NOT EXISTS uploaded_at timestamptz DEFAULT now();

NOTIFY pgrst, 'reload schema';
