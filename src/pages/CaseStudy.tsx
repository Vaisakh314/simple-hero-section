import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCaseStudy } from "@/hooks/use-content";
import BlockRenderer from "@/components/BlockRenderer";
import { type ContentBlock, migrateBlocks } from "@/components/admin/block-editor/types";

const legacySections = [
  { key: "context", title: "Context" },
  { key: "problem_and_insights", title: "Problem & Insights" },
  { key: "solution", title: "Solution" },
  { key: "execution", title: "Execution" },
  { key: "impact", title: "Impact" },
  { key: "reflection", title: "Reflection" },
] as const;

const CaseStudy = () => {
  const { slug } = useParams();
  const { data: study, isLoading } = useCaseStudy(slug);

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center py-24">
        <div className="text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!study) {
    return (
      <div className="container py-24 text-center">
        <h1 className="font-heading text-3xl text-foreground">Case study not found</h1>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/work">Back to Work</Link>
        </Button>
      </div>
    );
  }

  const blocks = migrateBlocks(((study as any).blocks as any[]) ?? []);
  const images = (study as any).images as string[] | undefined;
  const hasBlocks = blocks.length > 0;

  return (
    <div className="container py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <Button asChild variant="ghost" size="sm" className="mb-8">
          <Link to="/work">
            <ArrowLeft className="mr-2 h-4 w-4" /> All Case Studies
          </Link>
        </Button>

        <div className="flex flex-wrap gap-2">
          {study.tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>

        <h1 className="mt-4 font-heading text-3xl tracking-tight text-foreground md:text-4xl lg:text-5xl">
          {study.title}
        </h1>

        <div className="mt-4 flex flex-wrap gap-6 text-sm text-muted-foreground">
          <span><strong className="text-foreground">Role:</strong> {study.role}</span>
          <span><strong className="text-foreground">Company:</strong> {study.company}</span>
          <span><strong className="text-foreground">Timeline:</strong> {study.timeframe}</span>
        </div>

        {/* Hero image only for legacy */}
        {!hasBlocks && images && images.length > 0 && (
          <div className="mt-8 overflow-hidden rounded-lg">
            <img src={images[0]} alt={study.title} className="w-full object-cover" />
          </div>
        )}

        <div className="mt-8 grid grid-cols-2 gap-4 rounded-lg border border-border bg-muted/40 p-6 md:grid-cols-3">
          {study.metrics.map((m) => (
            <div key={m.label}>
              <div className="text-2xl font-bold text-primary">{m.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{m.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          {hasBlocks ? (
            <BlockRenderer blocks={blocks} />
          ) : (
            <div className="space-y-10">
              {legacySections.map(({ key, title }, sectionIndex) => (
                <section key={key}>
                  <h2 className="mb-3 font-heading text-2xl text-foreground">{title}</h2>
                  <p className="leading-relaxed text-muted-foreground">{study[key]}</p>
                  {images && images.length > 1 && sectionIndex < images.length - 1 && (
                    <div className="mt-4 overflow-hidden rounded-lg">
                      <img src={images[sectionIndex + 1]} alt={`${study.title} - ${title}`} className="w-full object-cover" />
                    </div>
                  )}
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseStudy;
