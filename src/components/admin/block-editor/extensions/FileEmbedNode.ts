import { Node, mergeAttributes } from "@tiptap/core";

export const FileEmbedNode = Node.create({
  name: "fileEmbed",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      filename: { default: "file" },
      filetype: { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-file-embed]' }];
  },

  renderHTML({ HTMLAttributes }) {
    const { src, filename, filetype } = HTMLAttributes;
    const icon = filetype?.includes("pdf") ? "📄" : "📊";

    return [
      "div",
      mergeAttributes({
        "data-file-embed": "true",
        style:
          "display:flex;align-items:center;gap:12px;padding:16px;border:1px solid hsl(var(--border));border-radius:var(--radius);background:hsl(var(--card));margin:1em 0;",
      }),
      [
        "span",
        { style: "font-size:1.5rem;flex-shrink:0;" },
        icon,
      ],
      [
        "span",
        { style: "flex:1;min-width:0;" },
        [
          "span",
          {
            style:
              "display:block;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;",
          },
          filename || "File",
        ],
        [
          "span",
          {
            style:
              "display:block;font-size:0.8125rem;color:hsl(var(--muted-foreground));margin-top:2px;",
          },
          (filetype || "").toUpperCase(),
        ],
      ],
      [
        "a",
        {
          href: src,
          target: "_blank",
          rel: "noopener noreferrer",
          style:
            "display:inline-flex;align-items:center;padding:6px 14px;font-size:0.8125rem;font-weight:500;border-radius:var(--radius);background:hsl(var(--primary));color:hsl(var(--primary-foreground));text-decoration:none;flex-shrink:0;",
        },
        "View ↗",
      ],
    ];
  },
});
