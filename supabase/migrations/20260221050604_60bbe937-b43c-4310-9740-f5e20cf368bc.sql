
-- Add blocks column to blog_posts and case_studies for block-based editing
ALTER TABLE public.blog_posts ADD COLUMN blocks jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.case_studies ADD COLUMN blocks jsonb NOT NULL DEFAULT '[]'::jsonb;
