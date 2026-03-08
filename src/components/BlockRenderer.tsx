import DOMPurify from "dompurify";
import type { ContentBlock } from "@/components/admin/block-editor/types";
import { migrateBlocks } from "@/components/admin/block-editor/types";

interface Props {
  blocks: ContentBlock[];
}

const ALLOWED_TAGS = [
  "h1", "h2", "h3", "h4", "h5", "h6", "p", "br", "hr",
  "ul", "ol", "li", "blockquote", "pre", "code",
  "strong", "em", "u", "s", "a", "img",
  "figure", "figcaption", "div", "span",
  "video", "source",
  "table", "thead", "tbody", "tfoot", "tr", "th", "td", "colgroup", "col",
];

const ALLOWED_ATTR = [
  "href", "target", "rel", "src", "alt", "title", "class", "style", "width", "height",
  "controls", "preload", "type", "data-file-embed",
];

function sanitize(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: true,
  });
}

export default function BlockRenderer({ blocks }: Props) {
  const migrated = migrateBlocks(blocks);
  if (!migrated || migrated.length === 0) return null;

  return (
    <div className="space-y-10">
      {migrated.map((block) => (
        <section key={block.id}>
          {block.content && (
            <div
              className="leading-relaxed text-foreground/85 prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitize(block.content) }}
            />
          )}
        </section>
      ))}
    </div>
  );
}
