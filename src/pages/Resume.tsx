import { useMemo } from "react";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import { useSiteContent } from "@/hooks/use-content";
import { resumeSections as defaultResume } from "@/lib/mock-data";

const Resume = () => {
  const { data: content } = useSiteContent();

  const resumeTitle = content?.resumeTitle ?? "Resume";
  const resumeDescription = content?.resumeDescription ?? "A snapshot of my experience, skills, and achievements.";
  const resumeUrl = content?.resumeUrl ?? "";
  const resumeDownloadLabel = content?.resumeDownloadLabel ?? "Download PDF";

  const resume = useMemo(() => {
    if (content?.resumeData) {
      try {
        const parsed = JSON.parse(content.resumeData);
        if (parsed && parsed.experience) return parsed;
      } catch { /* use defaults */ }
    }
    return defaultResume;
  }, [content?.resumeData]);

  return (
    <div className="container py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-start justify-between gap-4">
          <SectionHeading
            title={resumeTitle}
            subtitle={resumeDescription}
          />
          {resumeUrl ? (
            <Button asChild variant="outline" size="sm" className="shrink-0 mt-1">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" download>
                <Download className="mr-2 h-4 w-4" /> {resumeDownloadLabel}
              </a>
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="shrink-0 mt-1" disabled>
              <Download className="mr-2 h-4 w-4" /> {resumeDownloadLabel}
            </Button>
          )}
        </div>

        {/* PDF Preview */}
        {resumeUrl ? (
          <div className="mt-6 overflow-hidden rounded-lg border border-border">
            <iframe
              src={resumeUrl}
              className="h-[600px] w-full"
              title="Resume Preview"
            />
          </div>
        ) : (
          <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 p-12 text-center">
            <FileText className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">Resume not available yet. Please check back soon.</p>
          </div>
        )}

        {/* Experience */}
        <section className="mt-10">
          <h3 className="mb-6 border-b border-border pb-2 font-heading text-xl text-foreground">
            Experience
          </h3>
          <div className="space-y-8">
            {(resume.experience ?? []).map((job: any) => (
              <div key={job.title + job.company}>
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                  <h4 className="font-semibold text-foreground">{job.title}</h4>
                  <span className="text-sm text-muted-foreground">{job.period}</span>
                </div>
                <div className="text-sm font-medium text-primary">{job.company}</div>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm leading-relaxed text-muted-foreground">
                  {(job.highlights ?? []).map((h: string) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="mt-12">
          <h3 className="mb-6 border-b border-border pb-2 font-heading text-xl text-foreground">
            Education
          </h3>
          <div className="space-y-4">
            {(resume.education ?? []).map((edu: any) => (
              <div key={edu.degree} className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                <div>
                  <div className="font-semibold text-foreground">{edu.degree}</div>
                  <div className="text-sm text-muted-foreground">{edu.school}</div>
                </div>
                <span className="text-sm text-muted-foreground">{edu.year}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Skills & Tools */}
        <div className="mt-12 grid gap-12 sm:grid-cols-2">
          <section>
            <h3 className="mb-4 border-b border-border pb-2 font-heading text-xl text-foreground">
              Skills
            </h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {(resume.skills ?? []).map((s: string) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="mb-4 border-b border-border pb-2 font-heading text-xl text-foreground">
              Tools
            </h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {(resume.tools ?? []).map((t: string) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Resume;
