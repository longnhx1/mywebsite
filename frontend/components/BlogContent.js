"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import PostRow from "@/components/PostRow";

const PAGE_SIZE = 5;

const defaultFilters = [
  { key: "all", label: "Tất cả" },
  { key: "exp", label: "Trải nghiệm" },
  { key: "know", label: "Kiến thức" },
];

export default function BlogContent({ posts, baseRoute = "/blog", filters: customFilters }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [listKey, setListKey] = useState(0);

  const filters = customFilters || defaultFilters;

  const allTags = useMemo(() => {
    const tagSet = new Set();
    posts.forEach((p) => (p.tags || []).forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let result = posts;
    if (activeFilter !== "all") {
      result = result.filter((p) => p.category === activeFilter);
    }
    if (activeTag) {
      result = result.filter((p) => (p.tags || []).includes(activeTag));
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q) ||
          (p.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [posts, activeFilter, activeTag, search]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  function handleFilter(key) {
    setActiveFilter(key);
    setActiveTag("");
    setVisibleCount(PAGE_SIZE);
    setListKey((k) => k + 1);
  }

  function handleTagClick(tag) {
    setActiveTag(activeTag === tag ? "" : tag);
    setVisibleCount(PAGE_SIZE);
    setListKey((k) => k + 1);
  }

  function handleSearch(e) {
    setSearch(e.target.value);
    setVisibleCount(PAGE_SIZE);
    setListKey((k) => k + 1);
  }

  function loadMore() {
    setVisibleCount((c) => c + PAGE_SIZE);
  }

  return (
    <>
      <div className="search-row">
        <input
          type="text"
          className="search-input"
          placeholder="Tìm kiếm bài viết..."
          value={search}
          onChange={handleSearch}
        />
      </div>

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

      {allTags.length > 0 && (
        <div className="tags-row">
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`tag-chip${activeTag === tag ? " active" : ""}`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className="post-list post-list-animated" id="postList" key={listKey}>
        {visiblePosts.length === 0 ? (
          <p className="empty-msg">Không tìm thấy bài viết nào.</p>
        ) : (
          visiblePosts.map((post, index) => (
            <Link
              key={post.slug}
              href={`${baseRoute}/${post.slug}`}
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
          ))
        )}
      </div>

      {hasMore && (
        <div className="load-more-row">
          <button className="btn" onClick={loadMore}>
            Xem thêm ({filteredPosts.length - visibleCount} bài viết)
          </button>
        </div>
      )}
    </>
  );
}
