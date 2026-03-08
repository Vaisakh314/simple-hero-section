import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X, ChevronDown } from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import type { ContentBlock } from "./types";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Props {
  block: ContentBlock;
  onChange: (block: ContentBlock) => void;
  onDelete: () => void;
  imageFolder?: string;
}

export default function SortableBlock({ block, onChange, onDelete, imageFolder }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  const [collapsed, setCollapsed] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group rounded-lg border border-border bg-card",
        isDragging && "opacity-50 shadow-lg"
      )}
    >
      {/* Block header */}
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Content Box
        </span>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-muted-foreground hover:text-foreground"
        >
          <ChevronDown className={cn("h-4 w-4 transition-transform", collapsed && "-rotate-90")} />
        </button>
        <button
          type="button"
          onClick={() => { if (confirm("Delete this content box?")) onDelete(); }}
          className="text-muted-foreground hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {!collapsed && (
        <div className="p-3">
          <RichTextEditor
            content={block.content ?? ""}
            onChange={(c) => onChange({ ...block, content: c })}
            imageFolder={imageFolder}
          />
        </div>
      )}
    </div>
  );
}
