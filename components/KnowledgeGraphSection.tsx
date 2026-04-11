"use client";

import dynamic from "next/dynamic";

const KnowledgeGraphExplorer = dynamic(
  () => import("@/components/KnowledgeGraphExplorer"),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
        Loading knowledge graph…
      </div>
    ),
  }
);

export default function KnowledgeGraphSection() {
  return <KnowledgeGraphExplorer />;
}
