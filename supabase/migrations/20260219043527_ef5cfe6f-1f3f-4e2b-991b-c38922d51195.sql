
-- Add images array column to case_studies and blog_posts
ALTER TABLE public.case_studies ADD COLUMN IF NOT EXISTS images text[] NOT NULL DEFAULT '{}'::text[];
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS images text[] NOT NULL DEFAULT '{}'::text[];

-- Create storage bucket for CMS images
INSERT INTO storage.buckets (id, name, public) VALUES ('cms-images', 'cms-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for cms-images bucket
CREATE POLICY "Public can view cms images"
ON storage.objects FOR SELECT
USING (bucket_id = 'cms-images');

CREATE POLICY "Authenticated users can upload cms images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'cms-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update cms images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'cms-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete cms images"
ON storage.objects FOR DELETE
USING (bucket_id = 'cms-images' AND auth.role() = 'authenticated');

-- Add INSERT/UPDATE/DELETE policies for case_studies (authenticated users = admin)
CREATE POLICY "Authenticated users can insert case studies"
ON public.case_studies FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update case studies"
ON public.case_studies FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete case studies"
ON public.case_studies FOR DELETE
USING (auth.role() = 'authenticated');

-- Add INSERT/UPDATE/DELETE policies for blog_posts (authenticated users = admin)
CREATE POLICY "Authenticated users can insert blog posts"
ON public.blog_posts FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update blog posts"
ON public.blog_posts FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete blog posts"
ON public.blog_posts FOR DELETE
USING (auth.role() = 'authenticated');

-- Add INSERT/UPDATE/DELETE policies for site_content
CREATE POLICY "Authenticated users can update site content"
ON public.site_content FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert site content"
ON public.site_content FOR INSERT
WITH CHECK (auth.role() = 'authenticated');
