import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, BookOpen, TrendingUp, Target, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import CaseStudyCard from "@/components/CaseStudyCard";
import HeroPhoto from "@/components/HeroPhoto";
import { useSiteContent, useCaseStudies } from "@/hooks/use-content";
import { identityHighlights as defaultHighlights } from "@/lib/mock-data";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

const Index = () => {
  const { data: content } = useSiteContent();
  const { data: studies } = useCaseStudies();

  const heroTitle = content?.heroTitle ?? "Building products that make life a little easier and a lot better";
  const heroSubtitle = content?.heroSubtitle ?? "Product Manager";
  const heroDescription = content?.heroDescription ?? "";
  const heroPhotoUrl = content?.heroPhotoUrl;
  const heroName = content?.heroName ?? "";

  const cta1Text = content?.heroCTA1Text ?? "Explore Work";
  const cta1Link = content?.heroCTA1Link ?? "/work";
  const cta2Text = content?.heroCTA2Text ?? "View Resume";
  const cta2Link = content?.heroCTA2Link ?? "/resume";
  const cta3Text = content?.heroCTA3Text ?? "Read Blog";
  const cta3Link = content?.heroCTA3Link ?? "/blog";

  const ctaTitle = content?.ctaTitle ?? "Let's build something meaningful.";
  const ctaSubtitle = content?.ctaSubtitle ?? "Open to product roles, advisory, and conversations about craft.";
  const ctaButtonText = content?.ctaButtonText ?? "Get in Touch";
  const ctaButtonLink = content?.ctaButtonLink ?? "/contact";

  const selectedWorkTitle = content?.selectedWorkTitle ?? "Selected Work";
  const selectedWorkSubtitle = content?.selectedWorkSubtitle ?? "Deep dives into products I've shaped — the problems, decisions, and outcomes.";

  const highlights = useMemo(() => {
    if (content?.identityHighlights) {
      try {
        const parsed = JSON.parse(content.identityHighlights);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { /* use defaults */ }
    }
    return defaultHighlights;
  }, [content?.identityHighlights]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/20 dark:from-primary/10 dark:to-secondary/5" />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }} />

        <div className="container relative px-8 py-20 md:py-[120px]">
          <div className="grid items-center gap-12 md:grid-cols-[1fr_auto] md:gap-[8vw]">
            <div className="order-2 md:order-1">
              <motion.p initial="hidden" animate="visible" custom={0} variants={fadeUp}
                className="mb-3 inline-flex items-center gap-2 text-[22px] font-normal uppercase tracking-widest text-primary md:text-[26px]">
                <Target className="h-4 w-4" aria-hidden="true" />
                {heroSubtitle}
              </motion.p>
              <motion.h1 initial="hidden" animate="visible" custom={1} variants={fadeUp}
                className="max-w-2xl font-normal text-[42px] leading-[1.1] tracking-tight text-foreground md:text-[52px]">
                {heroTitle}
              </motion.h1>
              <motion.p initial="hidden" animate="visible" custom={2} variants={fadeUp}
                className="mt-5 max-w-xl text-[18px] leading-relaxed text-muted-foreground line-clamp-2">
                {heroDescription}
              </motion.p>
              <motion.div initial="hidden" animate="visible" custom={3} variants={fadeUp}
                className="mt-8 flex flex-wrap items-center gap-4">
                <Button asChild size="lg">
                  <Link to={cta1Link}>
                    <TrendingUp className="mr-2 h-4 w-4" aria-hidden="true" />
                    {cta1Text}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to={cta2Link}>
                    <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
                    {cta2Text}
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="lg">
                  <Link to={cta3Link}>
                    <BookOpen className="mr-2 h-4 w-4" aria-hidden="true" />
                    {cta3Text}
                  </Link>
                </Button>
              </motion.div>
            </div>

            <div className="order-1 flex justify-center p-6 md:order-2">
              <HeroPhoto
                src={heroPhotoUrl}
                alt={heroName ? `${heroName}, Product Manager` : "Product Manager"}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Identity highlights */}
      <section className="border-y border-border bg-muted/30">
        <div className="container py-12">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {highlights.map((item: { label: string; description: string }, i: number) => (
              <motion.div key={item.label} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
                <div className="text-sm font-semibold text-primary">{item.label}</div>
                <div className="mt-1 text-sm text-muted-foreground">{item.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured case studies */}
      <section className="container py-20 md:py-28">
        <SectionHeading title={selectedWorkTitle} subtitle={selectedWorkSubtitle} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(studies ?? []).map((study) => (
            <CaseStudyCard key={study.id} study={study} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="outline">
            <Link to="/work">All Case Studies <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-muted/30">
        <div className="container py-20 text-center md:py-28">
          <h2 className="font-heading text-3xl text-foreground md:text-4xl">{ctaTitle}</h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">{ctaSubtitle}</p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link to={ctaButtonLink}>{ctaButtonText}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
