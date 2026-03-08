import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, Trash2, Copy, Image as ImageIcon } from "lucide-react";

const AdminMedia = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: files, isLoading } = useQuery({
    queryKey: ["admin-media"],
    queryFn: async () => {
      // List all files from cms-images bucket in all folders
      const folders = ["case-studies", "blog", "hero", "about", "general"];
      const allFiles: { name: string; url: string; folder: string; id: string }[] = [];

      for (const folder of folders) {
        const { data } = await supabase.storage.from("cms-images").list(folder, { limit: 200 });
        if (data) {
          for (const file of data) {
            if (file.name === ".emptyFolderPlaceholder") continue;
            const { data: urlData } = supabase.storage.from("cms-images").getPublicUrl(`${folder}/${file.name}`);
            allFiles.push({
              name: file.name,
              url: urlData.publicUrl,
              folder,
              id: `${folder}/${file.name}`,
            });
          }
        }
      }
      return allFiles;
    },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    setUploading(true);

    for (const file of Array.from(fileList)) {
      const ext = file.name.split(".").pop();
      const path = `general/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("cms-images").upload(path, file);
      if (error) {
        toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      }
    }

    setUploading(false);
    e.target.value = "";
    qc.invalidateQueries({ queryKey: ["admin-media"] });
    toast({ title: "Upload complete!" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image? It may break references elsewhere.")) return;
    const { error } = await supabase.storage.from("cms-images").remove([id]);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted" });
      qc.invalidateQueries({ queryKey: ["admin-media"] });
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "URL copied to clipboard" });
  };

  return (
    <div className="container py-12">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link to="/admin"><ArrowLeft className="mr-2 h-4 w-4" /> Admin</Link>
          </Button>
          <h1 className="font-heading text-2xl text-foreground">Media Library</h1>
        </div>
        <div>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
            id="media-upload"
          />
          <Button
            size="sm"
            disabled={uploading}
            onClick={() => document.getElementById("media-upload")?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? "Uploading…" : "Upload Images"}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground">Loading…</div>
      ) : (files ?? []).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <ImageIcon className="mb-4 h-12 w-12 opacity-40" />
          <p>No images uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {(files ?? []).map((file) => (
            <div key={file.id} className="group relative overflow-hidden rounded-lg border border-border bg-card">
              <div className="aspect-square">
                <img src={file.url} alt={file.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-2">
                <p className="truncate text-xs text-muted-foreground">{file.folder}/{file.name}</p>
              </div>
              <div className="absolute right-1 top-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => copyUrl(file.url)}
                  className="rounded-full bg-background/90 p-1.5 text-foreground shadow-sm hover:bg-background"
                  title="Copy URL"
                >
                  <Copy className="h-3 w-3" />
                </button>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="rounded-full bg-destructive p-1.5 text-destructive-foreground shadow-sm"
                  title="Delete"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMedia;
