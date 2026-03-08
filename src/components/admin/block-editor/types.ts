export interface ContentBlock {
  id: string;
  /** @deprecated – kept for migration only. New blocks put headings inline in content. */
  headline?: string;
  /** Rich HTML content (headings, paragraphs, lists, images, quotes, hr, code blocks, etc.) */
  content?: string;
}

export function createBlock(): ContentBlock {
  return { id: crypto.randomUUID(), content: "" };
}

/**
 * Migrate legacy blocks into the current format.
 * - Old typed blocks (heading, paragraph, image, …) are flattened.
 * - Old headline+content blocks have the headline folded into content as an <h2>.
 */
export function migrateBlocks(raw: any[]): ContentBlock[] {
  if (!raw || raw.length === 0) return [];

  return raw.map((b: any) => {
    const id = b.id ?? crypto.randomUUID();

    // Legacy typed blocks (v1)
    if (b.type) {
      switch (b.type) {
        case "heading":
          return { id, content: `<h2>${stripTags(b.content ?? "")}</h2>` };
        case "paragraph":
        case "bullet-list":
        case "numbered-list":
        case "callout":
          return { id, content: b.content ?? "" };
        case "image": {
          const img = b.imageUrl
            ? `<img src="${b.imageUrl}" alt="${b.altText ?? ""}" />${b.caption ? `<p><em>${b.caption}</em></p>` : ""}`
            : "";
          return { id, content: img };
        }
        case "quote":
          return {
            id,
            content: `<blockquote>${b.content ?? ""}${b.attribution ? `<p>— ${b.attribution}</p>` : ""}</blockquote>`,
          };
        case "divider":
          return { id, content: "<hr>" };
        default:
          return { id, content: b.content ?? "" };
      }
    }

    // v2 headline+content blocks → fold headline into content
    if (b.headline && b.headline.trim()) {
      const headlineHtml = `<h2>${stripTags(b.headline)}</h2>`;
      return { id, content: headlineHtml + (b.content ?? "") };
    }

    return { id, content: b.content ?? "" };
  });
}

function stripTags(html: string): string {
  const div = typeof document !== "undefined" ? document.createElement("div") : null;
  if (!div) return html.replace(/<[^>]*>/g, "");
  div.innerHTML = html;
  return div.textContent ?? "";
}
