import { Link } from "react-router-dom";
import { Linkedin, Github, Mail } from "lucide-react";
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

const MediumIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
  </svg>
);


  const { data: content } = useSiteContent();

  const brandName = content?.footerBrandName ?? content?.navBrandName ?? "Portfolio";
  const brandRole = content?.footerBrandRole ?? content?.navBrandRole ?? "Designer";
  const email = content?.email ?? "";
  const linkedin = content?.linkedin ?? "";
  const github = content?.github ?? "";
  const behance = content?.behance ?? "";
  const dribbble = content?.dribbble ?? "";
  const medium = content?.medium ?? "";
  const copyright = content?.footerCopyright ?? "";

  const socialLinks = [
    { url: email ? `mailto:${email}` : "", label: "Email", icon: <Mail className="h-5 w-5" />, isExternal: false },
    { url: linkedin, label: "LinkedIn", icon: <Linkedin className="h-5 w-5" />, isExternal: true },
    { url: github, label: "GitHub", icon: <Github className="h-5 w-5" />, isExternal: true },
    { url: behance, label: "Behance", icon: <BehanceIcon className="h-5 w-5" />, isExternal: true },
    { url: dribbble, label: "Dribbble", icon: <DribbbleIcon className="h-5 w-5" />, isExternal: true },
    { url: medium, label: "Medium", icon: <MediumIcon className="h-5 w-5" />, isExternal: true },
  ].filter((l) => l.url);

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

          {socialLinks.length > 0 && (
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  {...(link.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="text-muted-foreground transition-colors hover:text-primary"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-xs text-muted-foreground">
          {copyright || `© ${new Date().getFullYear()} ${brandName}. All rights reserved.`}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
