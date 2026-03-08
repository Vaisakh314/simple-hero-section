import SectionHeading from "@/components/SectionHeading";
import BlogPostCard from "@/components/BlogPostCard";
import { useBlogPosts, useSiteContent } from "@/hooks/use-content";

const Blog = () => {
  const { data: posts } = useBlogPosts();
  const { data: content } = useSiteContent();

  const title = content?.blogTitle ?? "Blog";
  const subtitle = content?.blogSubtitle ?? "Thoughts on product thinking, frameworks, and lessons learned.";

  return (
    <div className="container py-16 md:py-24">
      <SectionHeading title={title} subtitle={subtitle} />
      <div className="mx-auto max-w-3xl space-y-6">
        {(posts ?? []).map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Blog;
