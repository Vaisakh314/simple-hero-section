import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CaseStudy } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const CaseStudyCard = ({ study }: { study: CaseStudy }) => {
  return (
    <Link
      to={`/work/${study.slug}`}
      className="group block rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md md:p-8"
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {study.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs font-medium">
            {tag}
          </Badge>
        ))}
      </div>

      <h3 className="font-heading text-xl text-card-foreground md:text-2xl">
        {study.title}
      </h3>

      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        {study.summary}
      </p>

      <div className="mt-5 flex flex-wrap gap-4">
        {study.metrics.slice(0, 3).map((metric) => (
          <div key={metric.label}>
            <div className="text-lg font-semibold text-primary">{metric.value}</div>
            <div className="text-xs text-muted-foreground">{metric.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
        View Case Study <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
};

export default CaseStudyCard;
