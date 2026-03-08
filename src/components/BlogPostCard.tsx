import { Link } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import { BlogPost } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const BlogPostCard = ({ post }: { post: BlogPost }) => {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group block rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
    >
      <div className="mb-3 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs font-medium">
            {tag}
          </Badge>
        ))}
      </div>

      <h3 className="font-heading text-xl text-card-foreground group-hover:text-primary transition-colors">
        {post.title}
      </h3>

      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        {post.summary}
      </p>

      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {new Date(post.publish_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {post.read_time}
        </span>
      </div>
    </Link>
  );
};

export default BlogPostCard;
