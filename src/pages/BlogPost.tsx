import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBlogPost } from "@/hooks/use-content";
import BlockRenderer from "@/components/BlockRenderer";
import { type ContentBlock, migrateBlocks } from "@/components/admin/block-editor/types";

const BlogPost = () => {
  const { slug } = useParams();
  const { data: post, isLoading } = useBlogPost(slug);
  if (isLoading) {
    return (
      <div className="container flex items-center justify-center py-24">
        <div className="text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-24 text-center">
        <h1 className="font-heading text-3xl text-foreground">Post not found</h1>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/blog">Back to Blog</Link>
        </Button>
      </div>
    );
  }

  const blocks = migrateBlocks(((post as any).blocks as any[]) ?? []);
  const images = (post as any).images as string[] | undefined;
  const hasBlocks = blocks.length > 0;

  // Legacy content renderer for posts created before block editor
  const renderLegacyContent = () => {
    const paragraphs = post.content.split("\n\n");
    return paragraphs.map((paragraph, i) => {
      const imageMatch = paragraph.match(/^\[image:(.*)\]$/);
      if (imageMatch) {
        return (
          <div key={i} className="overflow-hidden rounded-lg">
            <img src={imageMatch[1]} alt="" className="w-full object-cover" />
          </div>
        );
      }
      return <p key={i}>{paragraph}</p>;
    });
  };

  return (
    <div className="container py-16 md:py-24">
      <article className="mx-auto max-w-2xl">
        <Button asChild variant="ghost" size="sm" className="mb-8">
          <Link to="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" /> All Posts
          </Link>
        </Button>

        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>

        <h1 className="mt-4 font-heading text-3xl tracking-tight text-foreground md:text-4xl">
          {post.title}
        </h1>

        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(post.publish_date).toLocaleDateString("en-US", {
              month: "long", day: "numeric", year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {post.read_time}
          </span>
        </div>

        {/* Hero image (only for legacy posts without blocks) */}
        {!hasBlocks && images && images.length > 0 && (
          <div className="mt-8 overflow-hidden rounded-lg">
            <img src={images[0]} alt={post.title} className="w-full object-cover" />
          </div>
        )}

        <div className="mt-10">
          {hasBlocks ? (
            <BlockRenderer blocks={blocks} />
          ) : (
            <div className="space-y-5 leading-relaxed text-foreground/85">
              {renderLegacyContent()}
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
