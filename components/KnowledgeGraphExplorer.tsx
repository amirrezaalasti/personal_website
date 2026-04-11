"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import ForceGraph2D from "react-force-graph-2d";
import type { ForceGraphMethods } from "react-force-graph-2d";
import {
  buildKnowledgeGraph,
  type GraphNode,
  type KnowledgeCategory,
  type NodeMeta,
} from "@/lib/knowledgeGraph";
import {
  drawKnowledgeNode,
  paintNodePointerArea,
} from "@/components/knowledgeGraphCanvasDraw";
import heroPhoto from "../public/images/amirreza.jpeg";
import profile from "@/data/profile.json";
import projects from "@/data/projects.json";
import publications from "@/data/publications.json";
import news from "@/data/news.json";
import certificates from "@/data/certificates.json";
import { ExternalLink } from "lucide-react";

const GRAPH_HEIGHT = 560;

/** Categories shown in filter bar (order). */
const FILTER_ORDER: KnowledgeCategory[] = [
  "root",
  "experience",
  "education",
  "project",
  "publication",
  "news",
  "award",
  "volunteering",
  "certificate",
  "tag",
  "language",
  "social",
];

const CATEGORY_LABEL: Record<KnowledgeCategory, string> = {
  root: "Profile",
  experience: "Experience",
  education: "Education",
  project: "Project",
  publication: "Publication",
  news: "News",
  certificate: "Certificate",
  award: "Award",
  volunteering: "Volunteering",
  tag: "Topic",
  language: "Language",
  social: "Social",
};

function palette(isDark: boolean): Record<KnowledgeCategory, string> {
  if (isDark) {
    return {
      root: "#60a5fa",
      experience: "#a78bfa",
      education: "#c084fc",
      project: "#34d399",
      publication: "#fbbf24",
      news: "#38bdf8",
      certificate: "#94a3b8",
      award: "#f472b6",
      volunteering: "#fb923c",
      tag: "#94a3b8",
      language: "#22d3ee",
      social: "#818cf8",
    };
  }
  return {
    root: "#2563eb",
    experience: "#6d28d9",
    education: "#7c3aed",
    project: "#059669",
    publication: "#d97706",
    news: "#0284c7",
    certificate: "#475569",
    award: "#be185d",
    volunteering: "#c2410c",
    tag: "#475569",
    language: "#0e7490",
    social: "#4338ca",
  };
}

function ListPicker({
  items,
  selectedId,
  onSelect,
  idPrefix,
}: {
  items: { id: string; title: string; category: KnowledgeCategory }[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  idPrefix: string;
}) {
  const grouped = useMemo(() => {
    const m = new Map<KnowledgeCategory, typeof items>();
    for (const it of items) {
      const arr = m.get(it.category) ?? [];
      arr.push(it);
      m.set(it.category, arr);
    }
    return m;
  }, [items]);

  const order: KnowledgeCategory[] = [
    "root",
    "experience",
    "education",
    "project",
    "publication",
    "news",
    "award",
    "volunteering",
    "certificate",
    "tag",
    "language",
    "social",
  ];

  return (
    <nav className="max-h-[min(70vh,520px)] space-y-4 overflow-y-auto pr-1 text-left" aria-label="Knowledge graph as list">
      {order.map((cat) => {
        const list = grouped.get(cat);
        if (!list?.length) return null;
        return (
          <div key={cat}>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {CATEGORY_LABEL[cat]}
            </h3>
            <ul className="space-y-1">
              {list.map((it) => (
                <li key={it.id}>
                  <button
                    type="button"
                    id={`${idPrefix}-${it.id}`}
                    onClick={() => onSelect(it.id)}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                      selectedId === it.id
                        ? "bg-blue-600 text-white dark:bg-blue-500"
                        : "bg-black/[0.04] text-gray-900 hover:bg-black/[0.08] dark:bg-white/10 dark:text-gray-100 dark:hover:bg-white/15"
                    }`}
                  >
                    {it.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

function DetailPanel({ meta }: { meta: NodeMeta }) {
  const links = (meta.links ?? []).filter((l) => l.url && l.url !== "#");

  return (
    <div className="space-y-4">
      <div>
        <span className="inline-block rounded-full bg-black/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-gray-800 dark:bg-white/10 dark:text-gray-200">
          {CATEGORY_LABEL[meta.category]}
        </span>
        <h3 className="mt-2 text-lg font-bold text-gray-900 dark:text-white">{meta.title}</h3>
        {meta.subtitle && (
          <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">{meta.subtitle}</p>
        )}
      </div>
      {meta.body && (
        <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-400 whitespace-pre-wrap">{meta.body}</p>
      )}
      {links.length > 0 && (
        <ul className="flex flex-col gap-2">
          {links.map((l) => (
            <li key={l.url + l.label}>
              <a
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-800 hover:underline dark:text-blue-400"
              >
                {l.label}
                <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function KnowledgeGraphExplorer() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [graphWidth, setGraphWidth] = useState(0);
  const [profileImageEl, setProfileImageEl] = useState<HTMLImageElement | null>(null);
  const [categoryVisible, setCategoryVisible] = useState<Record<KnowledgeCategory, boolean>>(() => {
    const r = {} as Record<KnowledgeCategory, boolean>;
    for (const k of FILTER_ORDER) r[k] = true;
    return r;
  });
  const wrapRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const labelDarkRef = useRef(false);

  const bundle = useMemo(
    () =>
      buildKnowledgeGraph({
        profile,
        projects,
        publications,
        news,
        certificates,
      }),
    []
  );

  const isDark = mounted && resolvedTheme === "dark";
  const colors = useMemo(() => palette(isDark), [isDark]);
  labelDarkRef.current = isDark;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.decoding = "async";
    img.crossOrigin = "anonymous";
    img.onload = () => setProfileImageEl(img);
    img.onerror = () => setProfileImageEl(null);
    img.src = typeof heroPhoto === "object" && heroPhoto !== null && "src" in heroPhoto ? (heroPhoto as { src: string }).src : String(heroPhoto);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /** Measure width after layout — fixed height avoids 0-height flex bugs. */
  useLayoutEffect(() => {
    if (reduceMotion) return;
    const el = wrapRef.current;
    if (!el) return;

    const measure = () => {
      const w = el.clientWidth;
      if (!Number.isFinite(w) || w < 1) {
        const fallback = Math.min(1200, typeof window !== "undefined" ? Math.floor(window.innerWidth - 48) : 0);
        if (fallback > 200) setGraphWidth(fallback);
        return;
      }
      setGraphWidth(Math.floor(w));
    };

    measure();
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(measure);
    });
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [reduceMotion, mounted]);

  const filteredGraphData = useMemo(() => {
    const nodes = bundle.nodes.filter((n) => {
      if (n.id === "me") return true;
      return categoryVisible[n.group];
    });
    const ids = new Set(nodes.map((n) => n.id));
    const links = bundle.links.filter((l) => ids.has(l.source) && ids.has(l.target));
    return {
      nodes: nodes.map((n) => ({ ...n })),
      links: links.map((l) => ({ ...l })),
    };
  }, [bundle.nodes, bundle.links, categoryVisible]);

  const filteredExploreItems = useMemo(
    () =>
      bundle.exploreItems.filter((it) =>
        it.id === "me" ? categoryVisible.root : categoryVisible[it.category]
      ),
    [bundle.exploreItems, categoryVisible]
  );

  useEffect(() => {
    if (!selectedId) return;
    const node = bundle.nodes.find((n) => n.id === selectedId);
    if (!node) {
      setSelectedId(null);
      return;
    }
    if (node.id === "me" && !categoryVisible.root) {
      setSelectedId(null);
      return;
    }
    if (node.id !== "me" && !categoryVisible[node.group]) setSelectedId(null);
  }, [selectedId, bundle.nodes, categoryVisible]);

  const selectedMeta = selectedId ? bundle.nodeMetaById[selectedId] ?? null : null;

  const onNodeClick = useCallback((node: { id?: string | number }) => {
    if (node?.id != null) setSelectedId(String(node.id));
  }, []);

  /** Tune forces after graph mounts (spread dense graphs). */
  useEffect(() => {
    if (reduceMotion || graphWidth < 1) return;
    const fg = fgRef.current;
    if (!fg) return;
    try {
      const charge = fg.d3Force("charge") as unknown as { strength?: (n: number) => void } | undefined;
      charge?.strength?.(-220);
      const link = fg.d3Force("link") as unknown as { distance?: (n: number) => void } | undefined;
      link?.distance?.(55);
      fg.d3ReheatSimulation();
    } catch {
      /* ignore if d3 API differs */
    }
  }, [graphWidth, filteredGraphData, reduceMotion]);

  /** Fit when dimensions or data first become valid. */
  useEffect(() => {
    if (reduceMotion || graphWidth < 1) return;
    const t = window.setTimeout(() => {
      fgRef.current?.zoomToFit(600, 72);
    }, 400);
    return () => clearTimeout(t);
  }, [graphWidth, filteredGraphData, reduceMotion, isDark]);

  const nodeColorFn = useCallback(
    (n: object) => {
      const g = (n as { group?: KnowledgeCategory }).group;
      return g && colors[g] ? colors[g] : "#64748b";
    },
    [colors]
  );

  const drawCustomNode = useCallback(
    (node: object, ctx: CanvasRenderingContext2D, globalScale: number) => {
      labelDarkRef.current = isDark;
      drawKnowledgeNode(node, ctx, globalScale, {
        profileImage: profileImageEl,
        colors,
        labelDark: labelDarkRef.current,
      });
    },
    [profileImageEl, colors, isDark]
  );

  const pointerAreaPaint = useCallback(
    (node: object, color: string, ctx: CanvasRenderingContext2D, globalScale: number) => {
      paintNodePointerArea(node, color, ctx, globalScale);
    },
    []
  );

  const toggleCategory = useCallback((cat: KnowledgeCategory) => {
    setCategoryVisible((prev) => ({ ...prev, [cat]: !prev[cat] }));
  }, []);

  const showAllCategories = useCallback(() => {
    setCategoryVisible((prev) => {
      const next = { ...prev };
      for (const k of FILTER_ORDER) next[k] = true;
      return next;
    });
  }, []);

  const hideAllCategories = useCallback(() => {
    setCategoryVisible((prev) => {
      const next = { ...prev };
      for (const k of FILTER_ORDER) next[k] = false;
      return next;
    });
  }, []);

  const graphReady = !reduceMotion && graphWidth >= 200;

  return (
    <section className="px-4 pb-8 pt-4" aria-labelledby="knowledge-graph-heading">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="text-center lg:text-left">
          <h2
            id="knowledge-graph-heading"
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
          >
            Explore my work
          </h2>
          <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-400 md:text-base">
            Filter by type, drag nodes, scroll or pinch to zoom, click for details. Open{" "}
            <strong className="text-gray-900 dark:text-gray-200">Explore as list</strong> below if needed.
          </p>
        </div>

        <div
          className="flex flex-wrap items-center gap-2 rounded-xl border border-black/10 bg-white/70 px-3 py-2.5 dark:border-white/10 dark:bg-white/5"
          role="group"
          aria-label="Filter nodes by category"
        >
          <span className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Show
          </span>
          {FILTER_ORDER.map((cat) => {
            const on = categoryVisible[cat];
            const dot = colors[cat] ?? "#64748b";
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${
                  on
                    ? "border-black/15 bg-white text-gray-900 shadow-sm dark:border-white/20 dark:bg-white/10 dark:text-gray-100"
                    : "border-transparent bg-black/[0.04] text-gray-500 opacity-70 dark:bg-white/5 dark:text-gray-500"
                }`}
                aria-pressed={on}
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: dot }} aria-hidden />
                {CATEGORY_LABEL[cat]}
              </button>
            );
          })}
          <span className="mx-1 hidden h-4 w-px bg-black/10 sm:inline dark:bg-white/10" aria-hidden />
          <button
            type="button"
            onClick={showAllCategories}
            className="rounded-lg px-2 py-1 text-xs font-semibold text-blue-800 hover:underline dark:text-blue-400"
          >
            All
          </button>
          <button
            type="button"
            onClick={hideAllCategories}
            className="rounded-lg px-2 py-1 text-xs font-semibold text-gray-600 hover:underline dark:text-gray-400"
          >
            None
          </button>
        </div>

        <div className="glass grid grid-cols-1 gap-6 rounded-2xl p-4 md:p-6 lg:grid-cols-[1fr_min(100%,380px)]">
          <div className="flex min-h-0 min-w-0 flex-col gap-3">
            {!reduceMotion ? (
              <div
                ref={wrapRef}
                className="relative h-[560px] w-full min-w-0 overflow-hidden rounded-xl border border-black/15 bg-slate-100/90 shadow-inner dark:border-white/15 dark:bg-slate-950/85"
              >
                {!graphReady ? (
                  <div className="flex h-full w-full items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400">
                    Preparing graph…
                  </div>
                ) : (
                  <ForceGraph2D
                    ref={fgRef}
                    width={graphWidth}
                    height={GRAPH_HEIGHT}
                    graphData={filteredGraphData}
                    backgroundColor="rgba(0,0,0,0)"
                    nodeId="id"
                    nodeLabel="name"
                    nodeRelSize={6}
                    nodeVal="val"
                    nodeColor={nodeColorFn}
                    nodeCanvasObjectMode={() => "replace"}
                    nodeCanvasObject={drawCustomNode}
                    nodePointerAreaPaint={pointerAreaPaint}
                    linkColor={() => (isDark ? "rgba(148,163,184,0.55)" : "rgba(71,85,105,0.45)")}
                    linkWidth={1.8}
                    linkDirectionalParticles={0}
                    warmupTicks={80}
                    cooldownTicks={200}
                    d3VelocityDecay={0.22}
                    onEngineStop={() => {
                      fgRef.current?.zoomToFit(500, 80);
                    }}
                    onNodeClick={onNodeClick}
                    enablePointerInteraction
                    minZoom={0.25}
                    maxZoom={8}
                  />
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-black/10 bg-white/80 p-4 dark:border-white/10 dark:bg-zinc-900/60">
                <p className="mb-3 text-sm font-medium text-gray-800 dark:text-gray-300">
                  Reduced motion is on — pick an entry to read details on the right.
                </p>
                <ListPicker
                  items={filteredExploreItems}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  idPrefix="kg-rm"
                />
              </div>
            )}

            {!reduceMotion && (
              <details className="rounded-xl border border-black/10 bg-white/60 dark:border-white/10 dark:bg-white/5">
                <summary className="cursor-pointer select-none px-4 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Explore as list
                </summary>
                <div className="border-t border-black/10 px-3 py-3 dark:border-white/10">
                  <ListPicker
                    items={filteredExploreItems}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                    idPrefix="kg-list"
                  />
                </div>
              </details>
            )}
          </div>

          <aside
            className="flex min-h-[280px] flex-col rounded-xl border border-black/10 bg-white/90 p-5 dark:border-white/10 dark:bg-zinc-900/80 lg:min-h-[520px]"
            aria-label="Selected node details"
            aria-live="polite"
            aria-atomic="true"
          >
            <h3 className="sr-only">Details</h3>
            {!selectedMeta ? (
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Click a node in the graph, or choose an item from the list, to see title, description, and links.
              </p>
            ) : (
              <DetailPanel meta={selectedMeta} />
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
