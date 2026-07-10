"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import matter from "gray-matter";
import PostContent from "@/components/PostContent";
import { getDraftKey, getNewPostTemplate } from "@/lib/markdown-template";
import styles from "./MarkdownEditor.module.css";

const pageTypes = [
  { key: "posts", label: "📝 Blog" },
  { key: "tools", label: "🔧 Apps & Tools" },
];

export default function MarkdownEditor({
  slug = null,
  initialContent = "",
  fileName = "bai-viet-moi.md",
  pageType: initialPageType = "posts",
  onSaved = () => {}
}) {
  const draftKey = getDraftKey(slug);
  const [content, setContent] = useState(initialContent || getNewPostTemplate());
  const [status, setStatus] = useState("");
  const [pageType, setPageType] = useState(initialPageType);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Responsive tabs state
  const [activeTab, setActiveTab] = useState("write"); // 'write', 'preview', or 'split'
  
  const fileInputRef = useRef(null);
  const mdInputRef = useRef(null);

  // Check window size to determine if we should default to split or write
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        if (activeTab !== "split") setActiveTab("split");
      } else {
        if (activeTab === "split") setActiveTab("write");
      }
    };
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeTab]);

  // Handle content sync when props change (e.g. user selects a different post to edit)
  useEffect(() => {
    setContent(initialContent || getNewPostTemplate());
    setPageType(initialPageType);
  }, [initialContent, initialPageType, slug]);

  // Parse frontmatter on content change for tags
  useEffect(() => {
    try {
      const { data } = matter(content);
      if (data.tags?.length) setTags(data.tags);
    } catch { /* ignore */ }
  }, [content]);

  useEffect(() => {
    try {
      const draft = localStorage.getItem(draftKey);
      if (draft && draft !== initialContent) {
        const useDraft = window.confirm(
          "Có bản nháp chưa lưu trong trình duyệt. Khôi phục?"
        );
        if (useDraft) setContent(draft);
      }
    } catch { /* ignore */ }
  }, [draftKey, initialContent]);

  useEffect(() => {
    const timer = setTimeout(() => {
      try { localStorage.setItem(draftKey, content); } catch { /* ignore */ }
    }, 800);
    return () => clearTimeout(timer);
  }, [content, draftKey]);

  const previewBody = useMemo(() => {
    try {
      const { content: body } = matter(content);
      return body;
    } catch { return content; }
  }, [content]);

  const wordCount = useMemo(() => {
    const text = previewBody.trim();
    return text ? text.split(/\s+/).length : 0;
  }, [previewBody]);

  const showStatus = useCallback((msg, duration = 3000) => {
    setStatus(msg);
    setTimeout(() => setStatus(""), duration);
  }, []);

  const clearDraft = useCallback(() => {
    try { localStorage.removeItem(draftKey); showStatus("Đã xóa nháp."); }
    catch { /* ignore */ }
  }, [draftKey, showStatus]);

  // Upload .md from computer
  const handleUploadMd = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setContent(ev.target.result);
      showStatus(`Đã tải ${file.name}`);
    };
    reader.readAsText(file);
    e.target.value = "";
  }, [showStatus]);

  // Upload image
  const handleUploadImage = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = ev.target.result;
        const res = await fetch("/api/upload-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64, name: file.name }),
        });
        const data = await res.json();
        if (data.ok) {
          const mdLink = `![${file.name}](${data.url})`;
          setContent((prev) => prev + "\n" + mdLink);
          showStatus(`Đã upload ảnh: ${data.url}`);
        } else showStatus("Upload ảnh thất bại");
      };
      reader.readAsDataURL(file);
    } catch { showStatus("Lỗi upload ảnh"); }
    e.target.value = "";
  }, [showStatus]);

  // Paste image from clipboard
  const handlePaste = useCallback(async (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) continue;
        const ta = e.target;
        const start = ta.selectionStart ?? content.length;
        const reader = new FileReader();
        reader.onload = async (ev) => {
          const base64 = ev.target.result;
          const res = await fetch("/api/upload-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: base64, name: file.name || `pasted-${Date.now()}.png` }),
          });
          const data = await res.json();
          if (data.ok) {
            const imgName = file.name?.replace(/\.[^.]+$/, "") || `pasted-${Date.now()}`;
            const mdLink = `![${imgName}](${data.url})`;
            setContent((prev) => prev.slice(0, start) + mdLink + prev.slice(start));
            showStatus(`Đã paste ảnh: ${data.url}`);
          }
        };
        reader.readAsDataURL(file);
        break;
      }
    }
  }, [showStatus, content]);

  // Drag & drop image
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file?.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target.result;
      const res = await fetch("/api/upload-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, name: file.name }),
      });
      const data = await res.json();
      if (data.ok) {
        const mdLink = `![${file.name}](${data.url})`;
        setContent((prev) => prev + "\n" + mdLink);
        showStatus(`Đã drop ảnh: ${data.url}`);
      }
    };
    reader.readAsDataURL(file);
  }, [showStatus]);

  // Add tag
  const addTag = useCallback(() => {
    const t = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (t && !tags.includes(t)) {
      setTags((prev) => [...prev, t]);
      updateContentWithTags(content, [...tags, t]);
    }
    setTagInput("");
  }, [tagInput, tags, content]);

  const removeTag = useCallback((tag) => {
    const next = tags.filter((t) => t !== tag);
    setTags(next);
    updateContentWithTags(content, next);
  }, [tags, content]);

  function updateContentWithTags(currentContent, newTags) {
    try {
      const parsed = matter(currentContent);
      parsed.data.tags = newTags;
      setContent(matter.stringify(parsed.content, parsed.data));
    } catch { /* ignore */ }
  }

  const getTitle = useCallback(() => {
    try {
      const { data } = matter(content);
      return data.title || "";
    } catch { return ""; }
  }, [content]);

  // Publish
  const handlePublish = useCallback(async () => {
    const title = getTitle();
    if (!title) { showStatus("❌ Cần điền 'title' ở phần đầu bài (giữa dấu ---)"); return; }

    setPublishing(true);
    showStatus("Đang publish...");

    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          rawContent: content, // We must send rawContent back so it preserves frontmatter properly
          type: pageType,
          tags,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        showStatus(`✅ Đã lưu thành công!`);
        try { localStorage.removeItem(draftKey); } catch { /* ignore */ }
        onSaved(); // Notify parent
      } else showStatus(`❌ ${data.error}`);
    } catch (e) {
      showStatus(`❌ Lỗi: ${e.message}`);
    }
    setPublishing(false);
  }, [content, pageType, tags, getTitle, showStatus, draftKey, onSaved]);

  return (
    <div className={styles.editorWrapper}>
      <div className={styles.toolbar}>
        <div className={styles.actions}>
          <select
            className={styles.select}
            value={pageType}
            onChange={(e) => setPageType(e.target.value)}
          >
            {pageTypes.map((t) => (
              <option key={t.key} value={t.key}>{t.label}</option>
            ))}
          </select>

          <button
            type="button"
            className="btn primary"
            style={{ padding: "6px 12px", fontSize: "13px" }}
            onClick={handlePublish}
            disabled={publishing}
          >
            {publishing ? "⏳ Đang lưu..." : "🚀 Lưu bài"}
          </button>

          <button type="button" className="btn" style={{ padding: "6px 10px", fontSize: "13px" }} onClick={() => fileInputRef.current?.click()}>
            🖼 Tải ảnh lên
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleUploadImage}
          />

          <button type="button" className="btn" style={{ padding: "6px 10px", fontSize: "13px" }} onClick={() => mdInputRef.current?.click()}>
            📂 Đọc file .md
          </button>
          <input
            ref={mdInputRef}
            type="file"
            accept=".md,.markdown"
            style={{ display: "none" }}
            onChange={handleUploadMd}
          />
        </div>

        <div className={styles.meta}>
          {status && <span className={styles.status}>{status}</span>}
          <span>{wordCount} từ</span>
        </div>
      </div>

      {/* Tabs for Mobile View */}
      {activeTab !== "split" && (
        <div className={styles.tabs}>
          <button 
            className={`${styles.tabBtn} ${activeTab === "write" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("write")}
          >
            Viết Markdown
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === "preview" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("preview")}
          >
            Xem trước
          </button>
        </div>
      )}

      <div className={styles.panels}>
        {/* Write Pane */}
        {(activeTab === "write" || activeTab === "split") && (
          <div 
            className={`${styles.pane} ${isDragging ? styles.dragging : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className={styles.paneLabel}>// markdown</div>
            <textarea
              className={styles.textarea}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onPaste={handlePaste}
              spellCheck={false}
              placeholder="Bắt đầu viết ở đây..."
              aria-label="Soạn Markdown"
            />
          </div>
        )}

        {/* Preview Pane */}
        {(activeTab === "preview" || activeTab === "split") && (
          <div className={`${styles.pane} ${styles.paneRight}`}>
            <div className={styles.paneLabel}>// xem trước</div>
            <div className={styles.preview}>
              <div className={`prose ${styles.prose}`}>
                <PostContent content={previewBody} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tags Manager Input */}
      <div className={styles.tagsBar}>
        <input
          type="text"
          className={styles.tagsInput}
          placeholder="Thêm thẻ (Nhấn Enter...)"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
        />
        <div className={styles.tagsList}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tagPill}>
              #{tag}
              <button type="button" onClick={() => removeTag(tag)} className={styles.tagRemove}>&times;</button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
