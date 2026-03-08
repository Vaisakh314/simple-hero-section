import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Pencil, Trash2, Eye, X } from "lucide-react";
import BlockEditor from "@/components/admin/block-editor/BlockEditor";
import BlockRenderer from "@/components/BlockRenderer";
import { type ContentBlock, migrateBlocks } from "@/components/admin/block-editor/types";
import { Badge } from "@/components/ui/badge";

interface CaseStudyForm {
  id?: string;
  slug: string;
  title: string;
  summary: string;
  role: string;
  company: string;
  timeframe: string;
  tags: string;
  metrics: string;
  published: boolean;
  sort_order: number;
  images: string[];
  blocks: ContentBlock[];
}

const empty: CaseStudyForm = {
  slug: "", title: "", summary: "", role: "", company: "", timeframe: "",
  tags: "", metrics: "[]", published: true, sort_order: 0, images: [], blocks: [],
};

const AdminCaseStudies = () => {
  const [editing, setEditing] = useState<CaseStudyForm | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: studies } = useQuery({
    queryKey: ["admin-case-studies"],
    queryFn: async () => {
      const { data, error } = await supabase.from("case_studies").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async (form: CaseStudyForm) => {
      let parsedMetrics: { label: string; value: string }[];
      try { parsedMetrics = JSON.parse(form.metrics); } catch { parsedMetrics = []; }
      const tagsArray = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
      const record = {
        slug: form.slug, title: form.title, summary: form.summary,
        role: form.role, company: form.company, timeframe: form.timeframe,
        tags: tagsArray, metrics: parsedMetrics,
        published: form.published, sort_order: form.sort_order,
        images: form.images, blocks: form.blocks as any,
        context: "", problem_and_insights: "", solution: "",
        execution: "", impact: "", reflection: "",
      };
      if (form.id) {
        const { error } = await supabase.from("case_studies").update(record).eq("id", form.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("case_studies").insert(record);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ title: "Saved!" });
      qc.invalidateQueries({ queryKey: ["admin-case-studies"] });
      qc.invalidateQueries({ queryKey: ["case-studies"] });
      setEditing(null);
      setPreviewing(false);
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("case_studies").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Deleted" });
      qc.invalidateQueries({ queryKey: ["admin-case-studies"] });
      qc.invalidateQueries({ queryKey: ["case-studies"] });
    },
  });

  const openEdit = (s: any) => {
    setEditing({
      id: s.id, slug: s.slug, title: s.title, summary: s.summary,
      role: s.role, company: s.company, timeframe: s.timeframe,
      tags: (s.tags ?? []).join(", "), metrics: JSON.stringify(s.metrics ?? [], null, 2),
      published: s.published, sort_order: s.sort_order,
      images: s.images ?? [], blocks: migrateBlocks((s.blocks as any[]) ?? []),
    });
    setPreviewing(false);
  };

  // Preview panel
  if (editing && previewing) {
    const tagsArray = editing.tags.split(",").map((t) => t.trim()).filter(Boolean);
    let parsedMetrics: { label: string; value: string }[] = [];
    try { parsedMetrics = JSON.parse(editing.metrics); } catch {}
    return (
      <div className="container max-w-3xl py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-heading text-lg text-muted-foreground">Preview</h2>
          <Button variant="outline" size="sm" onClick={() => setPreviewing(false)}>
            <X className="mr-2 h-4 w-4" /> Close Preview
          </Button>
        </div>
        <article className="rounded-lg border border-border bg-background p-6 md:p-10">
          <div className="flex flex-wrap gap-2">
            {tagsArray.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
          </div>
          <h1 className="mt-4 font-heading text-3xl tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {editing.title || "Untitled"}
          </h1>
          <div className="mt-4 flex flex-wrap gap-6 text-sm text-muted-foreground">
            {editing.role && <span><strong className="text-foreground">Role:</strong> {editing.role}</span>}
            {editing.company && <span><strong className="text-foreground">Company:</strong> {editing.company}</span>}
            {editing.timeframe && <span><strong className="text-foreground">Timeline:</strong> {editing.timeframe}</span>}
          </div>
          {parsedMetrics.length > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-4 rounded-lg border border-border bg-muted/40 p-6 md:grid-cols-3">
              {parsedMetrics.map((m) => (
                <div key={m.label}>
                  <div className="text-2xl font-bold text-primary">{m.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{m.label}</div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-12">
            <BlockRenderer blocks={editing.blocks} />
          </div>
        </article>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="container max-w-3xl py-12">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to list
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPreviewing(true)}>
            <Eye className="mr-2 h-4 w-4" /> Preview
          </Button>
        </div>
        <h1 className="mb-6 font-heading text-2xl text-foreground">
          {editing.id ? "Edit Case Study" : "New Case Study"}
        </h1>
        <form onSubmit={(e) => { e.preventDefault(); save.mutate(editing); }} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1"><Label>Title</Label><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required /></div>
            <div className="space-y-1"><Label>Slug</Label><Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} required /></div>
            <div className="space-y-1"><Label>Role</Label><Input value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })} /></div>
            <div className="space-y-1"><Label>Company</Label><Input value={editing.company} onChange={(e) => setEditing({ ...editing, company: e.target.value })} /></div>
            <div className="space-y-1"><Label>Timeframe</Label><Input value={editing.timeframe} onChange={(e) => setEditing({ ...editing, timeframe: e.target.value })} /></div>
            <div className="space-y-1"><Label>Tags (comma-separated)</Label><Input value={editing.tags} onChange={(e) => setEditing({ ...editing, tags: e.target.value })} /></div>
            <div className="space-y-1"><Label>Sort Order</Label><Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} /></div>
            <div className="flex items-center gap-2 pt-6"><Switch checked={editing.published} onCheckedChange={(v) => setEditing({ ...editing, published: v })} /><Label>Published</Label></div>
          </div>
          <div className="space-y-1"><Label>Summary</Label><Input value={editing.summary} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} /></div>
          <div className="space-y-1"><Label>Metrics (JSON array of {`{label, value}`})</Label><Textarea value={editing.metrics} onChange={(e) => setEditing({ ...editing, metrics: e.target.value })} rows={4} className="font-mono text-xs" /></div>

          <div className="space-y-2">
            <Label>Content Blocks</Label>
            <BlockEditor
              blocks={editing.blocks}
              onChange={(blocks) => setEditing({ ...editing, blocks })}
              imageFolder="case-studies"
            />
          </div>

          <Button type="submit" disabled={save.isPending}>{save.isPending ? "Saving…" : "Save"}</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm"><Link to="/admin"><ArrowLeft className="mr-2 h-4 w-4" /> Admin</Link></Button>
          <h1 className="font-heading text-2xl text-foreground">Case Studies</h1>
        </div>
        <Button size="sm" onClick={() => setEditing({ ...empty })}><Plus className="mr-2 h-4 w-4" /> New</Button>
      </div>
      <div className="space-y-2">
        {(studies ?? []).map((s) => (
          <div key={s.id} className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
            <div>
              <span className="font-medium text-foreground">{s.title}</span>
              <span className="ml-2 text-xs text-muted-foreground">{s.published ? "Published" : "Draft"}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => { if (confirm("Delete this case study?")) remove.mutate(s.id); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCaseStudies;
