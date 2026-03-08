import { Link } from "react-router-dom";
import { Linkedin, Github, Mail } from "lucide-react";
import { useSiteContent } from "@/hooks/use-content";

const Footer = () => {
  const { data: content } = useSiteContent();

  const brandName = content?.footerBrandName ?? content?.navBrandName ?? "Sreehari";
  const brandRole = content?.footerBrandRole ?? content?.navBrandRole ?? "Product Manager";
  const email = content?.email ?? "hello@pmportfolio.com";
  const linkedin = content?.linkedin ?? "#";
  const github = content?.github ?? "#";
  const copyright = content?.footerCopyright ?? "";

  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="container py-12">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <Link to="/" className="flex flex-col leading-tight">
              <span className="font-heading text-lg text-foreground">{brandName}</span>
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{brandRole}</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`mailto:${email}`}
              className="text-muted-foreground transition-colors hover:text-primary"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-muted-foreground">
          {copyright || `© ${new Date().getFullYear()} ${brandName}. All rights reserved.`}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
