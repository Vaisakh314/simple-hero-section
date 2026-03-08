
-- Analytics: page_views table for tracking all site visits
CREATE TABLE public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id text NOT NULL,
  page_path text NOT NULL,
  page_title text NOT NULL DEFAULT '',
  referrer text DEFAULT '',
  country text DEFAULT '',
  city text DEFAULT '',
  user_agent text DEFAULT '',
  is_new_visitor boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert page views (tracking from frontend)
CREATE POLICY "Anyone can insert page views"
ON public.page_views FOR INSERT
WITH CHECK (true);

-- Only authenticated users can read (admin analytics dashboard)
CREATE POLICY "Authenticated users can read page views"
ON public.page_views FOR SELECT
USING (auth.role() = 'authenticated');

-- Only authenticated users can delete page views
CREATE POLICY "Authenticated users can delete page views"
ON public.page_views FOR DELETE
USING (auth.role() = 'authenticated');

-- Indexes for analytics queries
CREATE INDEX idx_page_views_created_at ON public.page_views (created_at);
CREATE INDEX idx_page_views_page_path ON public.page_views (page_path);
CREATE INDEX idx_page_views_visitor_id ON public.page_views (visitor_id);
CREATE INDEX idx_page_views_country ON public.page_views (country);
