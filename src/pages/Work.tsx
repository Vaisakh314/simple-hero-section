import SectionHeading from "@/components/SectionHeading";
import CaseStudyCard from "@/components/CaseStudyCard";
import { useCaseStudies, useSiteContent } from "@/hooks/use-content";

const Work = () => {
  const { data: studies } = useCaseStudies();
  const { data: content } = useSiteContent();

  const title = content?.workTitle ?? "Work & Case Studies";
  const subtitle = content?.workSubtitle ?? "A closer look at products I've shaped — the thinking, execution, and outcomes.";

  return (
    <div className="container py-16 md:py-24">
      <SectionHeading title={title} subtitle={subtitle} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(studies ?? []).map((study) => (
          <CaseStudyCard key={study.id} study={study} />
        ))}
      </div>
    </div>
  );
};

export default Work;
