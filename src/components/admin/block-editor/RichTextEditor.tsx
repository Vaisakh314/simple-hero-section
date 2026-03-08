import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { useRef, useState, useEffect, useCallback } from "react";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Link as LinkIcon, List, ListOrdered, Quote, Minus, ImagePlus, Code,
  Heading1, Heading2, Heading3, Plus, Film, FileText, Image as GifIcon,
  TableIcon, Rows3, Columns3, Trash2, ArrowUpFromLine, ArrowDownFromLine,
  ArrowLeftFromLine, ArrowRightFromLine,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { VideoNode } from "./extensions/VideoNode";
import { FileEmbedNode } from "./extensions/FileEmbedNode";
import { Progress } from "@/components/ui/progress";

interface Props {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  imageFolder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder, className, imageFolder = "blog" }: Props) {
  const imageRef = useRef<HTMLInputElement>(null);
  const gifRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const editorContainerRef = useRef<HTMLDivElement>(null);

  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);
  const [plusMenuPos, setPlusMenuPos] = useState<{ top: number; left: number } | null>(null);
  const [tableCtx, setTableCtx] = useState<{ x: number; y: number } | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: {},
      }),
      Underline,
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: false, allowBase64: true }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      VideoNode,
      FileEmbedNode,
    ],
    content,
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-sm dark:prose-invert max-w-none min-h-[200px] px-3 py-2 focus:outline-none",
      },
    },
  });

  // Track cursor position for the "+" button on empty lines
  const updatePlusButton = useCallback(() => {
    if (!editor) return;

    const { selection } = editor.state;
    const { $from } = selection;
    const isEmptyLine =
      $from.parent.isTextblock &&
      $from.parent.content.size === 0 &&
      selection.empty;

    if (!isEmptyLine) {
      setPlusMenuPos(null);
      setPlusMenuOpen(false);
      return;
    }

    // Get the DOM coordinates of the cursor
    const coords = editor.view.coordsAtPos($from.pos);
    const containerRect = editorContainerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    setPlusMenuPos({
      top: coords.top - containerRect.top,
      left: -16, // offset to the left of the editor
    });
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    editor.on("selectionUpdate", updatePlusButton);
    editor.on("update", updatePlusButton);
    return () => {
      editor.off("selectionUpdate", updatePlusButton);
      editor.off("update", updatePlusButton);
    };
  }, [editor, updatePlusButton]);

  if (!editor) return null;

  const btn = (active: boolean) =>
    cn(
      "h-7 w-7 p-0 text-background hover:text-background hover:bg-primary/80 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
      active && "bg-primary text-primary-foreground"
    );

  const setLink = () => {
    const url = window.prompt("URL:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
    else editor.chain().focus().unsetLink().run();
  };

  // Generic upload helper
  const uploadFile = async (file: File, maxSizeMB = 50): Promise<string> => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      throw new Error(`File must be under ${maxSizeMB}MB.`);
    }
    setUploadProgress(10);
    setUploadError(null);

    const ext = file.name.split(".").pop();
    const path = `${imageFolder}/${crypto.randomUUID()}.${ext}`;

    setUploadProgress(30);
    const { error } = await supabase.storage.from("cms-images").upload(path, file);
    if (error) throw error;

    setUploadProgress(80);
    const { data } = supabase.storage.from("cms-images").getPublicUrl(path);
    setUploadProgress(100);

    setTimeout(() => setUploadProgress(null), 600);
    return data.publicUrl;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Only JPG, PNG, and WebP images are allowed.");
      return;
    }

    const altText = window.prompt("Alt text for this image:", file.name) ?? file.name;

    try {
      const url = await uploadFile(file, 5);
      editor.chain().focus().setImage({ src: url, alt: altText }).run();
    } catch (err: any) {
      setUploadError(err.message || "Image upload failed.");
      // Fallback to base64
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          editor.chain().focus().setImage({ src: reader.result, alt: altText }).run();
        }
      };
      reader.readAsDataURL(file);
    }
    if (imageRef.current) imageRef.current.value = "";
    setPlusMenuOpen(false);
  };

  const handleGifUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "image/gif") {
      setUploadError("Only GIF files are allowed.");
      return;
    }

    const altText = window.prompt("Alt text for this GIF:", file.name) ?? file.name;

    try {
      const url = await uploadFile(file, 10);
      editor.chain().focus().setImage({ src: url, alt: altText }).run();
    } catch (err: any) {
      setUploadError(err.message || "GIF upload failed.");
    }
    if (gifRef.current) gifRef.current.value = "";
    setPlusMenuOpen(false);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["video/mp4", "video/webm", "video/quicktime"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Only MP4, WebM, and MOV videos are allowed.");
      return;
    }

    try {
      const url = await uploadFile(file, 50);
      editor.chain().focus().insertContent({
        type: "video",
        attrs: { src: url, alt: file.name },
      }).run();
    } catch (err: any) {
      setUploadError(err.message || "Video upload failed.");
    }
    if (videoRef.current) videoRef.current.value = "";
    setPlusMenuOpen(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Only PDF and PPT/PPTX files are allowed.");
      return;
    }

    try {
      const url = await uploadFile(file, 20);
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      editor.chain().focus().insertContent({
        type: "fileEmbed",
        attrs: { src: url, filename: file.name, filetype: ext },
      }).run();
    } catch (err: any) {
      setUploadError(err.message || "File upload failed.");
    }
    if (fileRef.current) fileRef.current.value = "";
    setPlusMenuOpen(false);
  };

  const sep = <div className="mx-0.5 h-4 w-px bg-background/20" />;

  const toolbarButtons = (
    <>
      <Toggle size="sm" pressed={editor.isActive("heading", { level: 1 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btn(editor.isActive("heading", { level: 1 }))}><Heading1 className="h-3.5 w-3.5" /></Toggle>
      <Toggle size="sm" pressed={editor.isActive("heading", { level: 2 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive("heading", { level: 2 }))}><Heading2 className="h-3.5 w-3.5" /></Toggle>
      <Toggle size="sm" pressed={editor.isActive("heading", { level: 3 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btn(editor.isActive("heading", { level: 3 }))}><Heading3 className="h-3.5 w-3.5" /></Toggle>

      {sep}

      <Toggle size="sm" pressed={editor.isActive("bold")} onPressedChange={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive("bold"))}><Bold className="h-3.5 w-3.5" /></Toggle>
      <Toggle size="sm" pressed={editor.isActive("italic")} onPressedChange={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive("italic"))}><Italic className="h-3.5 w-3.5" /></Toggle>
      <Toggle size="sm" pressed={editor.isActive("underline")} onPressedChange={() => editor.chain().focus().toggleUnderline().run()} className={btn(editor.isActive("underline"))}><UnderlineIcon className="h-3.5 w-3.5" /></Toggle>
      <Toggle size="sm" pressed={editor.isActive("strike")} onPressedChange={() => editor.chain().focus().toggleStrike().run()} className={btn(editor.isActive("strike"))}><Strikethrough className="h-3.5 w-3.5" /></Toggle>

      {sep}

      <Toggle size="sm" pressed={editor.isActive("bulletList")} onPressedChange={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive("bulletList"))}><List className="h-3.5 w-3.5" /></Toggle>
      <Toggle size="sm" pressed={editor.isActive("orderedList")} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive("orderedList"))}><ListOrdered className="h-3.5 w-3.5" /></Toggle>
      <Toggle size="sm" pressed={editor.isActive("blockquote")} onPressedChange={() => editor.chain().focus().toggleBlockquote().run()} className={btn(editor.isActive("blockquote"))}><Quote className="h-3.5 w-3.5" /></Toggle>
      <Toggle size="sm" pressed={editor.isActive("codeBlock")} onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()} className={btn(editor.isActive("codeBlock"))}><Code className="h-3.5 w-3.5" /></Toggle>
      <Toggle size="sm" pressed={false} onPressedChange={() => editor.chain().focus().setHorizontalRule().run()} className={btn(false)}><Minus className="h-3.5 w-3.5" /></Toggle>

      {sep}

      <Toggle size="sm" pressed={editor.isActive("link")} onPressedChange={setLink} className={btn(editor.isActive("link"))}><LinkIcon className="h-3.5 w-3.5" /></Toggle>
      <Toggle size="sm" pressed={false} onPressedChange={() => imageRef.current?.click()} className={btn(false)}><ImagePlus className="h-3.5 w-3.5" /></Toggle>

      {sep}

      <Toggle size="sm" pressed={editor.isActive("table")} onPressedChange={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} className={btn(editor.isActive("table"))}><TableIcon className="h-3.5 w-3.5" /></Toggle>

      {/* Table row/column controls — only visible when inside a table */}
      {editor.isActive("table") && (
        <>
          {sep}
          <Toggle size="sm" pressed={false} onPressedChange={() => editor.chain().focus().addRowBefore().run()} className={btn(false)} title="Insert row above"><ArrowUpFromLine className="h-3.5 w-3.5" /></Toggle>
          <Toggle size="sm" pressed={false} onPressedChange={() => editor.chain().focus().addRowAfter().run()} className={btn(false)} title="Insert row below"><ArrowDownFromLine className="h-3.5 w-3.5" /></Toggle>
          <Toggle size="sm" pressed={false} onPressedChange={() => editor.chain().focus().deleteRow().run()} className={btn(false)} title="Delete row"><Rows3 className="h-3.5 w-3.5 text-destructive" /></Toggle>
          {sep}
          <Toggle size="sm" pressed={false} onPressedChange={() => editor.chain().focus().addColumnBefore().run()} className={btn(false)} title="Insert column left"><ArrowLeftFromLine className="h-3.5 w-3.5" /></Toggle>
          <Toggle size="sm" pressed={false} onPressedChange={() => editor.chain().focus().addColumnAfter().run()} className={btn(false)} title="Insert column right"><ArrowRightFromLine className="h-3.5 w-3.5" /></Toggle>
          <Toggle size="sm" pressed={false} onPressedChange={() => editor.chain().focus().deleteColumn().run()} className={btn(false)} title="Delete column"><Columns3 className="h-3.5 w-3.5 text-destructive" /></Toggle>
          {sep}
          <Toggle size="sm" pressed={false} onPressedChange={() => editor.chain().focus().deleteTable().run()} className={btn(false)} title="Delete table"><Trash2 className="h-3.5 w-3.5 text-destructive" /></Toggle>
        </>
      )}
    </>
  );

  const insertMenuItems = [
    { icon: ImagePlus, label: "Image", onClick: () => imageRef.current?.click() },
    { icon: GifIcon, label: "GIF", onClick: () => gifRef.current?.click() },
    { icon: Film, label: "Video", onClick: () => videoRef.current?.click() },
    { icon: FileText, label: "PPT / PDF", onClick: () => fileRef.current?.click() },
    { icon: TableIcon, label: "Table", onClick: () => { editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(); setPlusMenuOpen(false); } },
    { icon: Minus, label: "Divider", onClick: () => { editor.chain().focus().setHorizontalRule().run(); setPlusMenuOpen(false); } },
  ];

  return (
    <div ref={editorContainerRef} className={cn("relative rounded-md border border-input bg-background", className)}>
      {/* Selection-based formatting toolbar */}
      <BubbleMenu
        editor={editor}
        options={{
          placement: isMobile ? "bottom" : "top",
          strategy: "fixed",
        }}
        className={cn(
          "flex flex-wrap items-center gap-0.5 rounded-[var(--radius)] px-1.5 py-1",
          "bg-foreground text-background",
          "shadow-lg",
          "animate-in fade-in-0 slide-in-from-bottom-1",
          "z-[9999]",
          isMobile && "fixed bottom-0 left-0 right-0 rounded-none"
        )}
      >
        {toolbarButtons}
      </BubbleMenu>

      {/* "+" insert button on empty lines */}
      {plusMenuPos && (
        <div
          className="absolute z-50 flex items-start"
          style={{ top: plusMenuPos.top, left: plusMenuPos.left }}
        >
          <button
            type="button"
            onClick={() => setPlusMenuOpen((v) => !v)}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full",
              "bg-primary text-primary-foreground",
              "transition-all duration-150",
              "hover:scale-110",
              plusMenuOpen && "rotate-45"
            )}
          >
            <Plus className="h-4 w-4" />
          </button>

          {plusMenuOpen && (
            <div
              className={cn(
                "ml-2 flex items-center gap-1 rounded-[var(--radius)] px-1.5 py-1",
                "bg-foreground text-background shadow-lg",
                "animate-in fade-in-0 slide-in-from-left-2",
              )}
            >
              {insertMenuItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.onClick}
                  className="flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-background transition-colors hover:bg-primary hover:text-primary-foreground"
                  title={item.label}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Upload progress */}
      {uploadProgress !== null && (
        <div className="absolute left-3 right-3 top-1 z-50">
          <Progress value={uploadProgress} className="h-1" />
        </div>
      )}

      {/* Upload error */}
      {uploadError && (
        <div className="mx-3 mt-1 rounded-md bg-destructive/10 px-3 py-1.5 text-xs text-destructive">
          {uploadError}
          <button type="button" className="ml-2 underline" onClick={() => setUploadError(null)}>Dismiss</button>
        </div>
      )}

      {/* Hidden file inputs */}
      <input ref={imageRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageUpload} />
      <input ref={gifRef} type="file" accept="image/gif" className="hidden" onChange={handleGifUpload} />
      <input ref={videoRef} type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" onChange={handleVideoUpload} />
      <input ref={fileRef} type="file" accept=".pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation" className="hidden" onChange={handleFileUpload} />

      <EditorContent editor={editor} />
    </div>
  );
}
