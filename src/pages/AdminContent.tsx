import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Upload } from "lucide-react";
import ResumeEditor from "@/components/admin/ResumeEditor";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Upload } from "lucide-react";

interface ContentField {
  key: string;
  label: string;
  help?: string;
  type: "text" | "textarea" | "url" | "file-pdf";
}

const sections: { title: string; fields: ContentField[] }[] = [
  {
    title: "Hero Section",
    fields: [
      { key: "heroName", label: "Your Name", help: "Shown below hero photo", type: "text" },
      { key: "heroSubtitle", label: "Role / Subtitle", help: "e.g. 'Product Manager' — shown above headline", type: "text" },
      { key: "heroTitle", label: "Headline", help: "Main hero headline on the Home page", type: "text" },
      { key: "heroDescription", label: "Description", help: "Hero body text below headline", type: "textarea" },
      { key: "heroPhotoUrl", label: "Hero Photo URL", help: "Photo shown in hero section", type: "url" },
      { key: "heroCTA1Text", label: "CTA 1 Text", help: "First button label (e.g. 'Explore Work')", type: "text" },
      { key: "heroCTA1Link", label: "CTA 1 Link", help: "First button link (e.g. '/work')", type: "text" },
      { key: "heroCTA2Text", label: "CTA 2 Text", help: "Second button label", type: "text" },
      { key: "heroCTA2Link", label: "CTA 2 Link", type: "text" },
      { key: "heroCTA3Text", label: "CTA 3 Text", type: "text" },
      { key: "heroCTA3Link", label: "CTA 3 Link", type: "text" },
    ],
  },
  {
    title: "Navbar",
    fields: [
      { key: "navBrandName", label: "Brand Name (line 1)", help: "Top-left logo text, e.g. 'Sreehari'", type: "text" },
      { key: "navBrandRole", label: "Brand Role (line 2)", help: "Subtitle under name, e.g. 'Product Manager'", type: "text" },
      { key: "navLinks", label: "Nav Links (JSON)", help: 'Array of {\"to\":\"/\",\"label\":\"Home\"} objects', type: "textarea" },
    ],
  },
  {
    title: "About Page",
    fields: [
      { key: "aboutIntro", label: "Introduction", help: "Opening paragraph on the About page", type: "textarea" },
      { key: "aboutPhilosophy", label: "Product Philosophy", help: "'How I Think About Product' section", type: "textarea" },
      { key: "aboutBackground", label: "Background", help: "'Background' section on About page", type: "textarea" },
      { key: "aboutDomains", label: "Domains", help: "'Domains' section — comma-separated text", type: "text" },
      { key: "aboutPhotoUrl", label: "About Photo URL", help: "Profile photo on About page", type: "url" },
      { key: "identityHighlights", label: "Identity Highlights (JSON)", help: "Array of {label, description} shown as cards", type: "textarea" },
    ],
  },
  {
    title: "Section Headings",
    fields: [
      { key: "workTitle", label: "Work Page Title", help: "Heading on /work page (default: 'Work & Case Studies')", type: "text" },
      { key: "workSubtitle", label: "Work Page Subtitle", type: "text" },
      { key: "blogTitle", label: "Blog Page Title", help: "Heading on /blog page (default: 'Blog')", type: "text" },
      { key: "blogSubtitle", label: "Blog Page Subtitle", type: "text" },
      { key: "selectedWorkTitle", label: "Home Selected Work Title", help: "Section heading on Home page (default: 'Selected Work')", type: "text" },
      { key: "selectedWorkSubtitle", label: "Home Selected Work Subtitle", type: "text" },
      { key: "contactTitle", label: "Contact Page Title", help: "Heading on /contact (default: 'Get in Touch')", type: "text" },
    ],
  },
  {
    title: "Footer",
    fields: [
      { key: "footerBrandName", label: "Footer Name", help: "Name displayed in footer", type: "text" },
      { key: "footerBrandRole", label: "Footer Role", type: "text" },
      { key: "footerCopyright", label: "Copyright Text", help: "Custom copyright line; leave empty for auto-generated", type: "text" },
    ],
  },
  {
    title: "Contact & Social",
    fields: [
      { key: "email", label: "Email", help: "Shown on Contact page and footer", type: "text" },
      { key: "linkedin", label: "LinkedIn URL", type: "url" },
      { key: "github", label: "GitHub URL", type: "url" },
      { key: "contactNote", label: "Contact Note", help: "Subtitle text on Contact page", type: "textarea" },
    ],
  },
  {
    title: "CTA Section (Homepage)",
    fields: [
      { key: "ctaTitle", label: "CTA Heading", help: "Bottom CTA section on Home page", type: "text" },
      { key: "ctaSubtitle", label: "CTA Subtext", type: "textarea" },
      { key: "ctaButtonText", label: "CTA Button Text", type: "text" },
      { key: "ctaButtonLink", label: "CTA Button Link", type: "text" },
    ],
  },
  {
    title: "Resume",
    fields: [
      { key: "resumeTitle", label: "Resume Page Title", help: "Heading shown on the Resume page (default: 'Resume')", type: "text" },
      { key: "resumeDescription", label: "Resume Description", help: "Subtitle on Resume page", type: "text" },
      { key: "resumeDownloadLabel", label: "Download Button Label", help: "Default: 'Download PDF'", type: "text" },
      { key: "resumeUrl", label: "Resume PDF", help: "Upload a PDF or paste a URL. The PDF will be shown as preview and downloadable.", type: "file-pdf" },
      { key: "resumeData", label: "Resume Data (JSON)", help: 'Paste JSON with keys: experience (array of {title, company, period, highlights[]}), education (array of {degree, school, year}), skills (string[]), tools (string[]). Example: {"experience":[{"title":"PM","company":"Acme","period":"2020–Now","highlights":["Led launch"]}],"education":[{"degree":"B.Tech","school":"MIT","year":"2020"}],"skills":["Roadmapping"],"tools":["Jira"]}', type: "textarea" },
    ],
  },
];

const AdminContent = () => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
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

  if (isLoading) {
    return <div className="container py-12 text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="container max-w-3xl py-12">
      <div className="mb-6 flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link to="/admin"><ArrowLeft className="mr-2 h-4 w-4" /> Admin</Link>
        </Button>
        <h1 className="font-heading text-2xl text-foreground">Global Content</h1>
      </div>

      <div className="space-y-10">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="mb-4 border-b border-border pb-2 font-heading text-xl text-foreground">
              {section.title}
            </h2>
            <div className="space-y-3">
              {section.fields.map((field) => (
                <div key={field.key} className="space-y-1">
                  <Label className="text-sm">{field.label}</Label>
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
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileRef.current?.click()}
                          disabled={uploading}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          {uploading ? "Uploading…" : "Upload"}
                        </Button>
                        <input
                          ref={fileRef}
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={handleResumeUpload}
                        />
                      </div>
                      {values[field.key] && (
                        <div className="overflow-hidden rounded border border-border">
                          <iframe src={values[field.key]} className="h-48 w-full" title="Resume preview" />
                        </div>
                      )}
                    </div>
                  ) : field.type === "textarea" ? (
                    <Textarea
                      value={values[field.key] ?? ""}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      rows={field.key.includes("JSON") || field.key === "navLinks" || field.key === "resumeData" || field.key === "identityHighlights" ? 6 : 3}
                      className={field.key.includes("JSON") || field.key === "navLinks" || field.key === "resumeData" || field.key === "identityHighlights" ? "font-mono text-xs" : ""}
                    />
                  ) : (
                    <Input
                      type={field.type === "url" ? "url" : "text"}
                      value={values[field.key] ?? ""}
                      onChange={(e) => updateField(field.key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-4 mt-8 flex justify-end">
        <Button onClick={() => save.mutate()} disabled={save.isPending} size="lg">
          <Save className="mr-2 h-4 w-4" />
          {save.isPending ? "Saving…" : "Save All Content"}
        </Button>
      </div>
    </div>
  );
};

export default AdminContent;
