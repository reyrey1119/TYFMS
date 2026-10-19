-- Document Vault: the live vault_documents table was created before these two columns were added to the setup SQL in
-- src/tabs/DocumentVaultTab.jsx, so every upload's row insert failed (PGRST204). Additive and idempotent: existing rows,
-- RLS and policies are untouched.
ALTER TABLE public.vault_documents
  ADD COLUMN IF NOT EXISTS content_type text,
  ADD COLUMN IF NOT EXISTS extraction_summary jsonb;

NOTIFY pgrst, 'reload schema';
