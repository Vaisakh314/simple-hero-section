import { Mail, Linkedin, Github, ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { useSiteContent } from "@/hooks/use-content";

const Contact = () => {
  const { data: content } = useSiteContent();

  const title = content?.contactTitle ?? "Get in Touch";
  const email = content?.email ?? "hello@pmportfolio.com";
  const linkedin = content?.linkedin ?? "#";
  const github = content?.github ?? "#";
  const contactNote = content?.contactNote ?? "";

  return (
    <div className="container py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <SectionHeading
          title={title}
          subtitle={contactNote}
          className="text-center [&_p]:mx-auto"
        />

        <div className="mt-12 space-y-6">
          <a
            href={`mailto:${email}`}
            className="group flex items-center justify-center gap-3 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/30"
          >
            <Mail className="h-5 w-5 text-primary" />
            <span className="text-foreground">{email}</span>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </a>

          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-3 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/30"
          >
            <Linkedin className="h-5 w-5 text-primary" />
            <span className="text-foreground">LinkedIn Profile</span>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </a>

          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-3 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/30"
          >
            <Github className="h-5 w-5 text-primary" />
            <span className="text-foreground">GitHub</span>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
