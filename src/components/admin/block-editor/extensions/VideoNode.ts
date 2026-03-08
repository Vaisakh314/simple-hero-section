import { Node, mergeAttributes } from "@tiptap/core";

export const VideoNode = Node.create({
  name: "video",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: "video[src]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "video",
      mergeAttributes(HTMLAttributes, {
        controls: "true",
        style: "width:100%;border-radius:var(--radius);",
        preload: "metadata",
      }),
    ];
  },
});
