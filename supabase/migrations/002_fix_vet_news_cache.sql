-- Fix vet_news_cache: recreate with correct schema, no RLS (cache table holds no user data)
-- Run this in the Supabase SQL editor before redeploying.

DROP TABLE IF EXISTS public.vet_news_cache;

CREATE TABLE public.vet_news_cache (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content      jsonb NOT NULL,
  generated_at timestamptz NOT NULL DEFAULT now()
);
