import type { GraphNode, KnowledgeCategory } from "@/lib/knowledgeGraph";

/** Emoji per category (canvas-friendly; root uses photo instead). */
export const CATEGORY_EMOJI: Record<KnowledgeCategory, string> = {
  /** Shown only if profile photo is missing or still loading. */
  root: "👤",
  experience: "💼",
  education: "🎓",
  project: "📦",
  publication: "📄",
  news: "📰",
  certificate: "🎖️",
  award: "🏆",
  volunteering: "🤝",
  tag: "🏷️",
  language: "🌐",
  social: "🔗",
};

export function getNodeRadius(node: GraphNode & { id?: string }): number {
  if (node.id === "me") return 16;
  return 5 + Math.sqrt(node.val ?? 5) * 2.2;
}

export function drawKnowledgeNode(
  node: object,
  ctx: CanvasRenderingContext2D,
  globalScale: number,
  opts: {
    profileImage: HTMLImageElement | null;
    colors: Record<KnowledgeCategory, string>;
    labelDark: boolean;
  }
): void {
  const n = node as GraphNode & { x?: number; y?: number };
  if (n.x == null || n.y == null) return;

  const r = getNodeRadius(n);
  const group = n.group;
  const fill = opts.colors[group] ?? "#64748b";

  if (n.id === "me" && opts.profileImage?.complete && opts.profileImage.naturalWidth > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(n.x, n.y, r, 0, 2 * Math.PI, false);
    ctx.clip();
    ctx.drawImage(opts.profileImage, n.x - r, n.y - r, 2 * r, 2 * r);
    ctx.restore();
    ctx.beginPath();
    ctx.arc(n.x, n.y, r, 0, 2 * Math.PI, false);
    ctx.strokeStyle = opts.labelDark ? "#93c5fd" : "#2563eb";
    ctx.lineWidth = 3 / globalScale;
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(n.x, n.y, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = opts.labelDark ? "rgba(255,255,255,0.35)" : "rgba(15,23,42,0.2)";
    ctx.lineWidth = 1.5 / globalScale;
    ctx.stroke();

    const emoji = CATEGORY_EMOJI[group] || "●";
    if (emoji) {
      const emojiPx = Math.min(20, Math.max(11 / globalScale, 8));
      ctx.font = `${emojiPx}px system-ui, "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(emoji, n.x, n.y);
    }
  }

  const raw = String(n.name ?? "");
  const label = raw.length > 36 ? `${raw.slice(0, 34)}…` : raw;
  const fontPx = Math.min(12, Math.max(7 / globalScale, 2.5));
  ctx.font = `600 ${fontPx}px ui-sans-serif, system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const dy = r + 10 / globalScale + fontPx * 0.55;
  const ty = n.y + dy;
  ctx.lineJoin = "round";
  ctx.lineWidth = 3.5 / globalScale;
  ctx.strokeStyle = opts.labelDark ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.95)";
  ctx.strokeText(label, n.x, ty);
  ctx.fillStyle = opts.labelDark ? "rgba(248,250,252,0.98)" : "rgba(15,23,42,0.95)";
  ctx.fillText(label, n.x, ty);
}

export function paintNodePointerArea(
  node: object,
  color: string,
  ctx: CanvasRenderingContext2D,
  globalScale: number
): void {
  const n = node as GraphNode & { x?: number; y?: number };
  if (n.x == null || n.y == null) return;
  const r = getNodeRadius(n as GraphNode);
  ctx.beginPath();
  ctx.arc(n.x, n.y, r, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
}
