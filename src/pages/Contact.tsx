import { Mail, Linkedin, Github, ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { useSiteContent } from "@/hooks/use-content";

const BehanceIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 11C9.43 11 11 9.43 11 7.5S9.43 4 7.5 4H2v14h5.5c2.21 0 4-1.79 4-4s-1.79-4-4-4zm-.25 5.5H4.5v-3h2.75a1.5 1.5 0 110 3zm0-5H4.5v-3h2.75a1.5 1.5 0 110 3zM16.5 9c-2.76 0-5 2.24-5 5s2.24 5 5 5c1.95 0 3.64-1.12 4.46-2.75h-2.27a2.49 2.49 0 01-2.19 1.25 2.5 2.5 0 01-2.42-2h7.17c.05-.32.08-.66.08-1 0-2.76-2.24-5-5-5zm-2.42 4a2.5 2.5 0 014.84 0h-4.84zM15 6h5v1.5h-5z" />
  </svg>
);

const DribbbleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.424 25.424 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.245.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" />
  </svg>
);

const Contact = () => {
  const { data: content } = useSiteContent();

  const title = content?.contactTitle ?? "Get in Touch";
  const email = content?.email ?? "";
  const linkedin = content?.linkedin ?? "";
  const github = content?.github ?? "";
  const behance = content?.behance ?? "";
  const dribbble = content?.dribbble ?? "";
  const medium = content?.medium ?? "";
  const contactNote = content?.contactNote ?? "";

  const links = [
    { url: email ? `mailto:${email}` : "", label: email, icon: <Mail className="h-5 w-5 text-primary" />, display: email },
    { url: linkedin, label: "LinkedIn Profile", icon: <Linkedin className="h-5 w-5 text-primary" />, display: linkedin },
    { url: github, label: "GitHub", icon: <Github className="h-5 w-5 text-primary" />, display: github },
    { url: behance, label: "Behance Portfolio", icon: <BehanceIcon className="h-5 w-5 text-primary" />, display: behance },
    { url: dribbble, label: "Dribbble Profile", icon: <DribbbleIcon className="h-5 w-5 text-primary" />, display: dribbble },
    { url: medium, label: "Medium Blog", icon: <MediumIcon className="h-5 w-5 text-primary" />, display: medium },
  ].filter((l) => l.display);

  return (
    <div className="container py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <SectionHeading
          title={title}
          subtitle={contactNote}
          className="text-center [&_p]:mx-auto"
        />

        <div className="mt-12 space-y-6">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              {...(link.url.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
              className="group flex items-center justify-center gap-3 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/30"
            >
              {link.icon}
              <span className="text-foreground">{link.label}</span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;
