
-- Case studies table
CREATE TABLE public.case_studies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  timeframe TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  metrics JSONB NOT NULL DEFAULT '[]',
  context TEXT NOT NULL DEFAULT '',
  problem_and_insights TEXT NOT NULL DEFAULT '',
  solution TEXT NOT NULL DEFAULT '',
  execution TEXT NOT NULL DEFAULT '',
  impact TEXT NOT NULL DEFAULT '',
  reflection TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  images TEXT[] NOT NULL DEFAULT '{}',
  blocks JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Blog posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  publish_date DATE NOT NULL DEFAULT CURRENT_DATE,
  tags TEXT[] NOT NULL DEFAULT '{}',
  read_time TEXT NOT NULL DEFAULT '5 min read',
  published BOOLEAN NOT NULL DEFAULT true,
  images TEXT[] NOT NULL DEFAULT '{}',
  blocks JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Site content (key-value for editable text)
CREATE TABLE public.site_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Analytics: page_views table
CREATE TABLE public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL,
  page_path TEXT NOT NULL,
  page_title TEXT NOT NULL DEFAULT '',
  referrer TEXT DEFAULT '',
  country TEXT DEFAULT '',
  city TEXT DEFAULT '',
  user_agent TEXT DEFAULT '',
  is_new_visitor BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('resume', 'resume', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('cms-images', 'cms-images', true) ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can read published case studies" ON public.case_studies FOR SELECT USING (published = true);
CREATE POLICY "Public can read published blog posts" ON public.blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Public can read site content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Public can read resume files" ON storage.objects FOR SELECT USING (bucket_id = 'resume');

-- Authenticated write policies for case_studies
CREATE POLICY "Authenticated users can insert case studies" ON public.case_studies FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update case studies" ON public.case_studies FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete case studies" ON public.case_studies FOR DELETE USING (auth.role() = 'authenticated');

-- Authenticated write policies for blog_posts
CREATE POLICY "Authenticated users can insert blog posts" ON public.blog_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update blog posts" ON public.blog_posts FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete blog posts" ON public.blog_posts FOR DELETE USING (auth.role() = 'authenticated');

-- Authenticated write policies for site_content
CREATE POLICY "Authenticated users can update site content" ON public.site_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert site content" ON public.site_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Page views policies
CREATE POLICY "Anyone can insert page views" ON public.page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can read page views" ON public.page_views FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete page views" ON public.page_views FOR DELETE USING (auth.role() = 'authenticated');

-- Storage policies for cms-images
CREATE POLICY "Public can view cms images" ON storage.objects FOR SELECT USING (bucket_id = 'cms-images');
CREATE POLICY "Authenticated users can upload cms images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cms-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update cms images" ON storage.objects FOR UPDATE USING (bucket_id = 'cms-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete cms images" ON storage.objects FOR DELETE USING (bucket_id = 'cms-images' AND auth.role() = 'authenticated');

-- Storage policies for resume
CREATE POLICY "Authenticated users can upload resume files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resume' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update resume files" ON storage.objects FOR UPDATE USING (bucket_id = 'resume' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete resume files" ON storage.objects FOR DELETE USING (bucket_id = 'resume' AND auth.role() = 'authenticated');

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_case_studies_updated_at BEFORE UPDATE ON public.case_studies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for analytics
CREATE INDEX idx_page_views_created_at ON public.page_views (created_at);
CREATE INDEX idx_page_views_page_path ON public.page_views (page_path);
CREATE INDEX idx_page_views_visitor_id ON public.page_views (visitor_id);
CREATE INDEX idx_page_views_country ON public.page_views (country);
