export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  summary: string;
  role: string;
  company: string;
  timeframe: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  context: string;
  problem_and_insights: string;
  solution: string;
  execution: string;
  impact: string;
  reflection: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  publish_date: string;
  tags: string[];
  read_time: string;
}

export interface SiteContent {
  key: string;
  value: string;
}
