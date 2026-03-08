
-- Add unique constraint on site_content.key for upsert support
ALTER TABLE public.site_content ADD CONSTRAINT site_content_key_unique UNIQUE (key);
