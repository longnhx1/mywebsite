"use client";

import { useState } from "react";
import Link from "next/link";
import PostRow from "@/components/PostRow";

export default function BlogContent({ posts }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [listKey, setListKey] = useState(0);

  const filters = [
    { key: "all", label: "Tất cả" },
    { key: "exp", label: "Trải nghiệm" },
    { key: "know", label: "Kiến thức" },
  ];

  const filteredPosts =
    activeFilter === "all"
      ? posts
      : posts.filter((p) => p.category === activeFilter);

  function handleFilter(key) {
    setActiveFilter(key);
    setListKey((k) => k + 1);
  }

  return (
    <>
      <div className="filter-row">
        {filters.map((f) => (
          <button
            key={f.key}
            className={`chip${activeFilter === f.key ? " active" : ""}`}
            onClick={() => handleFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="post-list post-list-animated" id="postList" key={listKey}>
        {filteredPosts.map((post, index) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="post-link"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <PostRow
              number={String(index + 1).padStart(2, "0")}
              title={post.title}
              description={post.description}
              category={post.category}
              categoryLabel={post.categoryLabel}
              tags={post.tags}
              date={post.dateShort}
            />
          </Link>
        ))}
      </div>
    </>
  );
}
