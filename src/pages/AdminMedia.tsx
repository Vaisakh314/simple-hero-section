import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, Upload, Trash2, Copy, FolderOpen,
  Image as ImageIcon, FileVideo, FileText, File, FileSpreadsheet,
  Play, Download,
} from "lucide-react";

/** Accepted file types for the upload input */
const ACCEPTED_TYPES = [
  "image/*",
  "video/*",
  "application/pdf",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/gif",
  "text/plain",
  "text/csv",
].join(",");

const IMAGE_EXTS = ["jpg", "jpeg", "png", "webp", "svg", "gif", "bmp", "avif"];
const VIDEO_EXTS = ["mp4", "webm", "mov", "avi", "mkv", "ogv"];
const PDF_EXTS = ["pdf"];
const DOC_EXTS = ["doc", "docx", "ppt", "pptx", "xls", "xlsx", "csv", "txt"];

function getFileType(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (IMAGE_EXTS.includes(ext)) return "image";
  if (VIDEO_EXTS.includes(ext)) return "video";
  if (PDF_EXTS.includes(ext)) return "pdf";
  if (DOC_EXTS.includes(ext)) return "document";
  return "other";
}

function FileIcon({ type }: { type: string }) {
  switch (type) {
    case "image": return <ImageIcon className="h-8 w-8 text-primary/60" />;
    case "video": return <FileVideo className="h-8 w-8 text-primary/60" />;
    case "pdf": return <FileText className="h-8 w-8 text-destructive/60" />;
    case "document": return <FileSpreadsheet className="h-8 w-8 text-primary/60" />;
    default: return <File className="h-8 w-8 text-muted-foreground/60" />;
  }
}

type FilterType = "all" | "image" | "video" | "pdf" | "document" | "other";
const filterLabels: { value: FilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "image", label: "Images" },
  { value: "video", label: "Videos" },
  { value: "pdf", label: "PDFs" },
  { value: "document", label: "Documents" },
];

const AdminMedia = () => {
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: files, isLoading } = useQuery({
    queryKey: ["admin-media"],
    queryFn: async () => {
      const folders = ["case-studies", "blog", "hero", "about", "general"];
      const allFiles: { name: string; url: string; folder: string; id: string; type: string }[] = [];

      for (const folder of folders) {
        const { data } = await supabase.storage.from("cms-images").list(folder, { limit: 500 });
        if (data) {
          for (const file of data) {
            if (file.name === ".emptyFolderPlaceholder") continue;
            const { data: urlData } = supabase.storage.from("cms-images").getPublicUrl(`${folder}/${file.name}`);
            allFiles.push({
              name: file.name,
              url: urlData.publicUrl,
              folder,
              id: `${folder}/${file.name}`,
              type: getFileType(file.name),
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
    let successCount = 0;

    for (const file of Array.from(fileList)) {
      const ext = file.name.split(".").pop();
      const path = `general/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("cms-images").upload(path, file);
      if (error) {
        toast({ title: "Upload failed", description: `${file.name}: ${error.message}`, variant: "destructive" });
      } else {
        successCount++;
      }
    }

    setUploading(false);
    e.target.value = "";
    qc.invalidateQueries({ queryKey: ["admin-media"] });
    if (successCount > 0) {
      toast({ title: `${successCount} file${successCount > 1 ? "s" : ""} uploaded!` });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this file? It may break references elsewhere.")) return;
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

  const filtered = (files ?? []).filter((f) => filter === "all" || f.type === filter);

  const counts = (files ?? []).reduce<Record<string, number>>((acc, f) => {
    acc[f.type] = (acc[f.type] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link to="/admin"><ArrowLeft className="mr-2 h-4 w-4" /> Admin</Link>
          </Button>
          <div>
            <h1 className="font-heading text-2xl text-foreground">Media Library</h1>
            <p className="text-xs text-muted-foreground">
              Upload images, videos, PDFs, presentations, and documents.
            </p>
          </div>
        </div>
        <div>
          <Input
            type="file"
            accept={ACCEPTED_TYPES}
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
            {uploading ? "Uploading…" : "Upload Files"}
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="mb-6 flex flex-wrap gap-2">
        {filterLabels.map((f) => {
          const count = f.value === "all" ? (files ?? []).length : (counts[f.value] ?? 0);
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              {f.label}
              <span className="opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="text-muted-foreground">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <FolderOpen className="mb-4 h-12 w-12 opacity-40" />
          <p>{filter === "all" ? "No files uploaded yet" : `No ${filter} files found`}</p>
          <p className="mt-1 text-xs">Drag & drop or click Upload to add files</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((file) => (
            <div key={file.id} className="group relative overflow-hidden rounded-lg border border-border bg-card">
              {/* Preview area */}
              <div className="aspect-square bg-muted/30">
                {file.type === "image" ? (
                  <img src={file.url} alt={file.name} className="h-full w-full object-cover" loading="lazy" />
                ) : file.type === "video" ? (
                  <div className="relative flex h-full w-full items-center justify-center">
                    <video src={file.url} className="h-full w-full object-cover" muted preload="metadata" />
                    <div className="absolute inset-0 flex items-center justify-center bg-foreground/10">
                      <Play className="h-8 w-8 text-background" />
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4">
                    <FileIcon type={file.type} />
                    <span className="text-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      {file.name.split(".").pop()}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-2">
                <p className="truncate text-xs text-muted-foreground" title={`${file.folder}/${file.name}`}>
                  {file.name}
                </p>
                <p className="text-[10px] text-muted-foreground/60">{file.folder}</p>
              </div>

              {/* Hover actions */}
              <div className="absolute right-1 top-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-background/90 p-1.5 text-foreground shadow-sm hover:bg-background"
                  title="Open / Download"
                >
                  <Download className="h-3 w-3" />
                </a>
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
