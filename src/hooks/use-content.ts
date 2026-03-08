import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { siteContent as mockSiteContent, caseStudies as mockCaseStudies, blogPosts as mockBlogPosts } from "@/lib/mock-data";
import type { CaseStudy, BlogPost } from "@/lib/types";

// Fetch site content as a key-value map
export function useSiteContent() {
  return useQuery({
    queryKey: ["site-content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("*");
      if (error) throw error;
      const map: Record<string, string> = {};
      for (const row of data) {
        map[row.key] = row.value;
      }
      return map;
    },
    placeholderData: () => mockSiteContent,
    staleTime: 60_000,
  });
}

// Fetch all published case studies
export function useCaseStudies() {
  return useQuery({
    queryKey: ["case-studies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("case_studies")
        .select("*")
        .eq("published", true)
        .order("sort_order");
      if (error) throw error;
      return data.map((row) => ({
        ...row,
        metrics: row.metrics as unknown as { label: string; value: string }[],
      })) as CaseStudy[];
    },
    placeholderData: () => mockCaseStudies,
    staleTime: 60_000,
  });
}

// Fetch single case study by slug
export function useCaseStudy(slug: string | undefined) {
  return useQuery({
    queryKey: ["case-study", slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from("case_studies")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return {
        ...data,
        metrics: data.metrics as unknown as { label: string; value: string }[],
      } as CaseStudy;
    },
    enabled: !!slug,
    staleTime: 60_000,
  });
}

// Fetch all published blog posts
export function useBlogPosts() {
  return useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("publish_date", { ascending: false });
      if (error) throw error;
      return data as BlogPost[];
    },
    placeholderData: () => mockBlogPosts,
    staleTime: 60_000,
  });
}

// Fetch single blog post by slug
export function useBlogPost(slug: string | undefined) {
  return useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data as BlogPost | null;
    },
    enabled: !!slug,
    staleTime: 60_000,
  });
}
