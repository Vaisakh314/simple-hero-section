import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Pencil, Trash2, Eye, X } from "lucide-react";
import BlockEditor from "@/components/admin/block-editor/BlockEditor";
import BlockRenderer from "@/components/BlockRenderer";
import { type ContentBlock, migrateBlocks } from "@/components/admin/block-editor/types";
import { Badge } from "@/components/ui/badge";

interface BlogForm {
  id?: string;
  slug: string;
  title: string;
  summary: string;
  publish_date: string;
  tags: string;
  read_time: string;
  published: boolean;
  images: string[];
  blocks: ContentBlock[];
}

const empty: BlogForm = {
  slug: "", title: "", summary: "", publish_date: new Date().toISOString().slice(0, 10),
  tags: "", read_time: "5 min read", published: true, images: [], blocks: [],
};

const AdminBlog = () => {
  const [editing, setEditing] = useState<BlogForm | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: posts } = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").order("publish_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async (form: BlogForm) => {
      const tagsArray = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
      const record = {
        slug: form.slug, title: form.title, summary: form.summary,
        publish_date: form.publish_date, tags: tagsArray,
        read_time: form.read_time, published: form.published,
        images: form.images, blocks: form.blocks as any,
        content: "",
      };
      if (form.id) {
        const { error } = await supabase.from("blog_posts").update(record).eq("id", form.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_posts").insert(record);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ title: "Saved!" });
      qc.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      qc.invalidateQueries({ queryKey: ["blog-posts"] });
      setEditing(null);
      setPreviewing(false);
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Deleted" });
      qc.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      qc.invalidateQueries({ queryKey: ["blog-posts"] });
    },
  });

  const openEdit = (p: any) => {
    setEditing({
      id: p.id, slug: p.slug, title: p.title, summary: p.summary,
      publish_date: p.publish_date, tags: (p.tags ?? []).join(", "),
      read_time: p.read_time, published: p.published,
      images: p.images ?? [], blocks: migrateBlocks((p.blocks as any[]) ?? []),
    });
    setPreviewing(false);
  };

  // Preview panel
  if (editing && previewing) {
    const tagsArray = editing.tags.split(",").map((t) => t.trim()).filter(Boolean);
    return (
      <div className="container max-w-2xl py-12">
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
          <h1 className="mt-4 font-heading text-3xl tracking-tight text-foreground md:text-4xl">
            {editing.title || "Untitled"}
          </h1>
          <div className="mt-4 text-sm text-muted-foreground">{editing.publish_date} · {editing.read_time}</div>
          <div className="mt-10">
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
          {editing.id ? "Edit Blog Post" : "New Blog Post"}
        </h1>
        <form onSubmit={(e) => { e.preventDefault(); save.mutate(editing); }} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1"><Label>Title</Label><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required /></div>
            <div className="space-y-1"><Label>Slug</Label><Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} required /></div>
            <div className="space-y-1"><Label>Publish Date</Label><Input type="date" value={editing.publish_date} onChange={(e) => setEditing({ ...editing, publish_date: e.target.value })} /></div>
            <div className="space-y-1"><Label>Read Time</Label><Input value={editing.read_time} onChange={(e) => setEditing({ ...editing, read_time: e.target.value })} /></div>
            <div className="space-y-1"><Label>Tags (comma-separated)</Label><Input value={editing.tags} onChange={(e) => setEditing({ ...editing, tags: e.target.value })} /></div>
            <div className="flex items-center gap-2 pt-6"><Switch checked={editing.published} onCheckedChange={(v) => setEditing({ ...editing, published: v })} /><Label>Published</Label></div>
          </div>
          <div className="space-y-1"><Label>Summary</Label><Input value={editing.summary} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} /></div>

          <div className="space-y-2">
            <Label>Content Blocks</Label>
            <BlockEditor
              blocks={editing.blocks}
              onChange={(blocks) => setEditing({ ...editing, blocks })}
              imageFolder="blog"
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
          <h1 className="font-heading text-2xl text-foreground">Blog Posts</h1>
        </div>
        <Button size="sm" onClick={() => setEditing({ ...empty })}><Plus className="mr-2 h-4 w-4" /> New</Button>
      </div>
      <div className="space-y-2">
        {(posts ?? []).map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
            <div>
              <span className="font-medium text-foreground">{p.title}</span>
              <span className="ml-2 text-xs text-muted-foreground">{p.published ? "Published" : "Draft"} · {p.publish_date}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => { if (confirm("Delete this post?")) remove.mutate(p.id); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBlog;
