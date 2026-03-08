import { useMemo } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { useSiteContent } from "@/hooks/use-content";
import { identityHighlights as defaultHighlights } from "@/lib/mock-data";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

const About = () => {
  const { data: content } = useSiteContent();

  const highlights = useMemo(() => {
    if (content?.identityHighlights) {
      try {
        const parsed = JSON.parse(content.identityHighlights);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { /* use defaults */ }
    }
    return defaultHighlights;
  }, [content?.identityHighlights]);

  const aboutPhotoUrl = content?.aboutPhotoUrl;

  return (
    <div className="container py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <SectionHeading title="About Me" />

        <div className="flex flex-col items-start gap-8 md:flex-row">
          {aboutPhotoUrl ? (
            <img src={aboutPhotoUrl} alt="Profile" className="h-32 w-32 shrink-0 rounded-full object-cover" />
          ) : (
            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
              PM
            </div>
          )}
          <div>
            <p className="text-lg leading-relaxed text-foreground">
              {content?.aboutIntro ?? ""}
            </p>
          </div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {highlights.map((item: { label: string; description: string }, i: number) => (
            <motion.div
              key={item.label}
              custom={i}
              variants={fadeUp}
              className="rounded-lg border border-border bg-card p-4 text-center"
            >
              <div className="text-sm font-semibold text-primary">{item.label}</div>
              <div className="mt-1 text-xs text-muted-foreground">{item.description}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-14">
          <h3 className="font-heading text-2xl text-foreground">How I Think About Product</h3>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            {content?.aboutPhilosophy ?? ""}
          </p>
        </div>

        <div className="mt-14">
          <h3 className="font-heading text-2xl text-foreground">Background</h3>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            {content?.aboutBackground ?? ""}
          </p>
        </div>

        <div className="mt-14">
          <h3 className="font-heading text-2xl text-foreground">Domains</h3>
          <p className="mt-4 text-lg font-medium tracking-wide text-primary">
            {content?.aboutDomains ?? ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
