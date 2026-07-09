"use client";

import { useState } from "react";
import ToolCard from "@/components/ToolCard";
import { toolCategories } from "@/lib/tools";

export default function ToolsContent({ tools }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [listKey, setListKey] = useState(0);

  const filtered =
    activeFilter === "all"
      ? tools
      : tools.filter((t) => t.category === activeFilter);

  function handleFilter(key) {
    setActiveFilter(key);
    setListKey((k) => k + 1);
  }

  return (
    <>
      <div className="filter-row">
        {toolCategories.map((f) => (
          <button
            key={f.key}
            className={`chip${activeFilter === f.key ? " active" : ""}`}
            onClick={() => handleFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid tools-grid" key={listKey}>
        {filtered.map((tool, index) => (
          <div
            key={tool.name}
            className="tool-card-wrap"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <ToolCard {...tool} />
          </div>
        ))}
      </div>
    </>
  );
}
