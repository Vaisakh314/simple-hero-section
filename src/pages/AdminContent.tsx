import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Upload, Eye, EyeOff, RefreshCw } from "lucide-react";
import ResumeEditor from "@/components/admin/ResumeEditor";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ContentField {
  key: string;
  label: string;
  help?: string;
  type: "text" | "textarea" | "url" | "file-pdf" | "resume-editor";
  placeholder?: string;
}

/** Map section id → the public route to preview */
const sectionPreviewRoute: Record<string, string> = {
  profile: "/",
  homepage: "/",
  cta: "/",
  about: "/about",
  resume: "/resume",
  contact: "/contact",
  branding: "/",
  headings: "/work",
};

const sections: { id: string; title: string; description: string; fields: ContentField[] }[] = [
  {
    id: "profile",
    title: "Profile & Identity",
    description: "Your name, role, and social links used across the site.",
    fields: [
      { key: "heroName", label: "Your Name", placeholder: "e.g. Vaisakh Viswanath", type: "text" },
      { key: "heroSubtitle", label: "Your Role", placeholder: "e.g. Mechanical Engineer", type: "text" },
      { key: "email", label: "Email", placeholder: "e.g. hello@example.com", type: "text" },
      { key: "linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/yourhandle", type: "url" },
      { key: "github", label: "GitHub URL", placeholder: "https://github.com/yourhandle", help: "Leave empty to hide.", type: "url" },
      { key: "behance", label: "Behance URL", placeholder: "https://behance.net/yourhandle", help: "Leave empty to hide.", type: "url" },
      { key: "dribbble", label: "Dribbble URL", placeholder: "https://dribbble.com/yourhandle", help: "Leave empty to hide.", type: "url" },
      { key: "heroPhotoUrl", label: "Profile Photo URL", help: "Used in hero section. Leave empty to use default.", type: "url" },
    ],
  },
  {
    id: "homepage",
    title: "Homepage",
    description: "Hero headline, description, and call-to-action buttons.",
    fields: [
      { key: "heroTitle", label: "Headline", placeholder: "e.g. Building products that matter", type: "text" },
      { key: "heroDescription", label: "Short Description", placeholder: "A one-liner about what you do", type: "textarea" },
      { key: "heroCTA1Text", label: "Button 1 Label", placeholder: "Explore Work", type: "text" },
      { key: "heroCTA1Link", label: "Button 1 Link", placeholder: "/work", type: "text" },
      { key: "heroCTA2Text", label: "Button 2 Label", placeholder: "View Resume", type: "text" },
      { key: "heroCTA2Link", label: "Button 2 Link", placeholder: "/resume", type: "text" },
      { key: "heroCTA3Text", label: "Button 3 Label", placeholder: "Read Blog", type: "text" },
      { key: "heroCTA3Link", label: "Button 3 Link", placeholder: "/blog", type: "text" },
      { key: "identityHighlights", label: "Highlight Cards (JSON)", help: 'Array of {"label":"...", "description":"..."} shown below hero', type: "textarea" },
    ],
  },
  {
    id: "cta",
    title: "Bottom CTA (Homepage)",
    description: "The call-to-action section at the bottom of the homepage.",
    fields: [
      { key: "ctaTitle", label: "Heading", placeholder: "Let's build something meaningful.", type: "text" },
      { key: "ctaSubtitle", label: "Subtext", placeholder: "Open to roles, advisory, and conversations.", type: "textarea" },
      { key: "ctaButtonText", label: "Button Text", placeholder: "Get in Touch", type: "text" },
      { key: "ctaButtonLink", label: "Button Link", placeholder: "/contact", type: "text" },
    ],
  },
  {
    id: "about",
    title: "About Page",
    description: "Content shown on your About page.",
    fields: [
      { key: "aboutIntro", label: "Introduction", type: "textarea" },
      { key: "aboutPhilosophy", label: "Product Philosophy", type: "textarea" },
      { key: "aboutBackground", label: "Background", type: "textarea" },
      { key: "aboutDomains", label: "Domains", placeholder: "e.g. B2B SaaS · AI · EdTech", type: "text" },
      { key: "aboutPhotoUrl", label: "About Photo URL", type: "url" },
    ],
  },
  {
    id: "resume",
    title: "Resume",
    description: "Upload your resume PDF and manage experience details.",
    fields: [
      { key: "resumeTitle", label: "Page Title", placeholder: "Resume", type: "text" },
      { key: "resumeDescription", label: "Page Subtitle", placeholder: "A snapshot of my experience and skills.", type: "text" },
      { key: "resumeDownloadLabel", label: "Download Button Label", placeholder: "Download PDF", type: "text" },
      { key: "resumeUrl", label: "Resume PDF", help: "Upload a PDF or paste a URL.", type: "file-pdf" },
      { key: "resumeData", label: "Resume Details", help: "Add your experience, education, skills, and tools.", type: "resume-editor" },
    ],
  },
  {
    id: "contact",
    title: "Contact Page",
    description: "Heading and note shown on the Contact page.",
    fields: [
      { key: "contactTitle", label: "Page Title", placeholder: "Get in Touch", type: "text" },
      { key: "contactNote", label: "Subtitle / Note", placeholder: "Feel free to reach out.", type: "textarea" },
    ],
  },
  {
    id: "branding",
    title: "Branding & Navigation",
    description: "Site name, footer text, and navigation links.",
    fields: [
      { key: "navBrandName", label: "Site Name", placeholder: "Your Name", type: "text" },
      { key: "navBrandRole", label: "Site Tagline", placeholder: "Product Manager", type: "text" },
      { key: "footerBrandName", label: "Footer Name", type: "text" },
      { key: "footerBrandRole", label: "Footer Role", type: "text" },
      { key: "footerCopyright", label: "Copyright Text", help: "Leave empty for auto-generated.", type: "text" },
      { key: "navLinks", label: "Nav Links (JSON)", help: 'Array of {"to":"/","label":"Home"} objects', type: "textarea" },
    ],
  },
  {
    id: "headings",
    title: "Page Headings",
    description: "Override default page titles and subtitles.",
    fields: [
      { key: "workTitle", label: "Work Page Title", placeholder: "Work & Case Studies", type: "text" },
      { key: "workSubtitle", label: "Work Page Subtitle", type: "text" },
      { key: "blogTitle", label: "Blog Page Title", placeholder: "Blog", type: "text" },
      { key: "blogSubtitle", label: "Blog Page Subtitle", type: "text" },
      { key: "selectedWorkTitle", label: "Homepage Work Section Title", placeholder: "Selected Work", type: "text" },
      { key: "selectedWorkSubtitle", label: "Homepage Work Section Subtitle", type: "text" },
    ],
  },
];

const AdminContent = () => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [previewRoute, setPreviewRoute] = useState("/");
  const [previewKey, setPreviewKey] = useState(0);
  const { toast } = useToast();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: content, isLoading } = useQuery({
    queryKey: ["admin-site-content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("*");
      if (error) throw error;
      const map: Record<string, string> = {};
      for (const row of data) map[row.key] = row.value;
      return map;
    },
  });

  useEffect(() => {
    if (content) setValues(content);
  }, [content]);

  const save = useMutation({
    mutationFn: async () => {
      const rows = Object.entries(values).map(([key, value]) => ({ key, value }));
      for (const row of rows) {
        const { error } = await supabase
          .from("site_content")
          .upsert(row, { onConflict: "key" });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ title: "All content saved!" });
      qc.invalidateQueries({ queryKey: ["admin-site-content"] });
      qc.invalidateQueries({ queryKey: ["site-content"] });
      // Refresh preview after save
      setPreviewKey((k) => k + 1);
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const updateField = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast({ title: "Invalid file", description: "Please upload a PDF file.", variant: "destructive" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max file size is 10MB.", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const path = `resume-${Date.now()}.pdf`;
      const { error } = await supabase.storage.from("resume").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("resume").getPublicUrl(path);
      updateField("resumeUrl", data.publicUrl);
      toast({ title: "Resume uploaded!" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleAccordionChange = useCallback((openSections: string[]) => {
    if (openSections.length > 0) {
      const lastOpened = openSections[openSections.length - 1];
      const route = sectionPreviewRoute[lastOpened] ?? "/";
      setPreviewRoute(route);
    }
  }, []);

  // Build preview URL — use the current origin but navigate to public route
  const previewSrc = `${window.location.origin}${previewRoute}`;

  if (isLoading) {
    return <div className="container py-12 text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Editor panel */}
      <div className={`flex flex-col overflow-hidden ${showPreview ? "w-1/2" : "w-full"} transition-all duration-300`}>
        {/* Header */}
        <div className="shrink-0 border-b border-border bg-background px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" size="sm">
                <Link to="/admin"><ArrowLeft className="mr-2 h-4 w-4" /> Admin</Link>
              </Button>
              <div>
                <h1 className="font-heading text-xl text-foreground">Site Settings</h1>
                <p className="text-xs text-muted-foreground">Edit content, then save to update the preview.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline" size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="gap-2"
              >
                {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="hidden sm:inline">{showPreview ? "Hide" : "Show"} Preview</span>
              </Button>
              <Button onClick={() => save.mutate()} disabled={save.isPending} size="sm">
                <Save className="mr-2 h-4 w-4" />
                {save.isPending ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
        </div>

        {/* Scrollable form */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <Accordion
            type="multiple"
            defaultValue={["profile", "homepage"]}
            onValueChange={handleAccordionChange}
            className="space-y-3"
          >
            {sections.map((section) => (
              <AccordionItem key={section.id} value={section.id} className="rounded-lg border border-border bg-card px-5">
                <AccordionTrigger className="py-4 hover:no-underline">
                  <div className="text-left">
                    <div className="font-semibold text-foreground">{section.title}</div>
                    <div className="text-xs text-muted-foreground">{section.description}</div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <div className="space-y-4">
                    {section.fields.map((field) => (
                      <div key={field.key} className="space-y-1.5">
                        <Label className="text-sm font-medium">{field.label}</Label>
                        {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}

                        {field.type === "file-pdf" ? (
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <Input
                                type="url"
                                value={values[field.key] ?? ""}
                                onChange={(e) => updateField(field.key, e.target.value)}
                                placeholder="PDF URL (or upload below)"
                                className="flex-1"
                              />
                              <Button type="button" variant="outline" size="sm"
                                onClick={() => fileRef.current?.click()} disabled={uploading}>
                                <Upload className="mr-2 h-4 w-4" />
                                {uploading ? "Uploading…" : "Upload"}
                              </Button>
                              <input ref={fileRef} type="file" accept="application/pdf"
                                className="hidden" onChange={handleResumeUpload} />
                            </div>
                            {values[field.key] && (
                              <div className="overflow-hidden rounded border border-border">
                                <iframe src={values[field.key]} className="h-48 w-full" title="Resume preview" />
                              </div>
                            )}
                          </div>
                        ) : field.type === "resume-editor" ? (
                          <ResumeEditor
                            value={values[field.key]}
                            onChange={(json) => updateField(field.key, json)}
                          />
                        ) : field.type === "textarea" ? (
                          <Textarea
                            value={values[field.key] ?? ""}
                            onChange={(e) => updateField(field.key, e.target.value)}
                            placeholder={field.placeholder}
                            rows={field.key.includes("JSON") || field.key === "navLinks" || field.key === "identityHighlights" ? 5 : 3}
                            className={field.key.includes("JSON") || field.key === "navLinks" || field.key === "identityHighlights" ? "font-mono text-xs" : ""}
                          />
                        ) : (
                          <Input
                            type={field.type === "url" ? "url" : "text"}
                            value={values[field.key] ?? ""}
                            onChange={(e) => updateField(field.key, e.target.value)}
                            placeholder={field.placeholder}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="sticky bottom-4 mt-8 flex justify-end">
            <Button onClick={() => save.mutate()} disabled={save.isPending} size="lg" className="shadow-lg">
              <Save className="mr-2 h-4 w-4" />
              {save.isPending ? "Saving…" : "Save All Changes"}
            </Button>
          </div>
        </div>
      </div>

      {/* Preview panel */}
      {showPreview && (
        <div className="flex w-1/2 flex-col border-l border-border bg-muted/30">
          {/* Preview header */}
          <div className="flex shrink-0 items-center justify-between border-b border-border bg-background px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive/40" />
                <div className="h-3 w-3 rounded-full bg-accent/60" />
                <div className="h-3 w-3 rounded-full bg-primary/40" />
              </div>
              <span className="ml-2 rounded bg-muted px-3 py-1 font-mono text-xs text-muted-foreground">
                {previewRoute}
              </span>
            </div>
            <Button
              variant="ghost" size="sm"
              onClick={() => setPreviewKey((k) => k + 1)}
              className="gap-1 text-xs"
            >
              <RefreshCw className="h-3 w-3" /> Refresh
            </Button>
          </div>

          {/* iframe */}
          <div className="flex-1 overflow-hidden">
            <iframe
              key={previewKey}
              src={previewSrc}
              className="h-full w-full border-0"
              title="Live Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContent;
