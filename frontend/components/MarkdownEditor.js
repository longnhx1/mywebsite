"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import matter from "gray-matter";
import PostContent from "@/components/PostContent";
import { getDraftKey, getNewPostTemplate } from "@/lib/markdown-template";

const pageTypes = [
  { key: "posts", label: "📝 Blog" },
  { key: "tools", label: "🔧 Apps & Tools" },
];

export default function MarkdownEditor({
  slug = null,
  initialContent = "",
  fileName = "bai-viet-moi.md",
}) {
  const draftKey = getDraftKey(slug);
  const [content, setContent] = useState(initialContent || getNewPostTemplate());
  const [status, setStatus] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [pageType, setPageType] = useState("posts");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [publishing, setPublishing] = useState(false);
  const fileInputRef = useRef(null);
  const mdInputRef = useRef(null);

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

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content);
      showStatus("Đã copy vào clipboard!");
    } catch { showStatus("Không copy được."); }
  }, [content, showStatus]);

  const downloadFile = useCallback(() => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    showStatus(`Đã tải ${fileName}`);
  }, [content, fileName, showStatus]);

  const resetContent = useCallback(() => {
    if (!window.confirm("Đặt lại nội dung về bản gốc?")) return;
    setContent(initialContent || getNewPostTemplate());
    try { localStorage.removeItem(draftKey); } catch { /* ignore */ }
    showStatus("Đã đặt lại.");
  }, [initialContent, draftKey, showStatus]);

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

  // Drag & drop image
  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
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

  // Extract title from frontmatter
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
          content: previewBody,
          type: pageType,
          tags,
          description: (() => { try { return matter(content).data.description; } catch { return ""; } })(),
        }),
      });
      const data = await res.json();
      if (data.ok) {
        showStatus(`✅ Đã publish! /${pageType}/${data.slug}`);
        try { localStorage.removeItem(draftKey); } catch { /* ignore */ }
      } else showStatus(`❌ ${data.error}`);
    } catch (e) {
      showStatus(`❌ Lỗi: ${e.message}`);
    }
    setPublishing(false);
  }, [content, previewBody, pageType, tags, getTitle, draftKey, showStatus]);

  return (
    <div className="md-editor">
      <div className="md-editor-toolbar">
        <div className="md-editor-actions">
          <select
            className="md-editor-select"
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
            onClick={handlePublish}
            disabled={publishing}
          >
            {publishing ? "⏳ Đang publish..." : "🚀 Publish"}
          </button>

          <button type="button" className="btn" onClick={() => fileInputRef.current?.click()}>
            🖼 Upload ảnh
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleUploadImage}
          />

          <button type="button" className="btn" onClick={() => mdInputRef.current?.click()}>
            📂 Tải file .md
          </button>
          <input
            ref={mdInputRef}
            type="file"
            accept=".md,.markdown"
            style={{ display: "none" }}
            onChange={handleUploadMd}
          />

          <button type="button" className="btn" onClick={downloadFile}>
            ⬇ Tải .md
          </button>
          <button type="button" className="btn" onClick={copyToClipboard}>
            Copy
          </button>
          <button type="button" className="btn" onClick={resetContent}>
            Đặt lại
          </button>
          <button type="button" className="btn" onClick={clearDraft}>
            Xóa nháp
          </button>
          <button
            type="button"
            className={`btn${showPreview ? "" : " primary"}`}
            onClick={() => setShowPreview((v) => !v)}
          >
            {showPreview ? "Ẩn preview" : "Hiện preview"}
          </button>
        </div>

        <div className="md-editor-meta">
          {status && <span className="md-editor-status">{status}</span>}
          <span>{wordCount} từ</span>
        </div>
      </div>

      <div className={`md-editor-panels${showPreview ? "" : " md-editor-single"}`}>
        <div className="md-editor-pane">
          <div className="md-editor-pane-label">// markdown</div>
          <textarea
            className="md-editor-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            spellCheck={false}
            aria-label="Soạn Markdown"
          />
        </div>

        {showPreview && (
          <div className="md-editor-pane md-editor-preview">
            <div className="md-editor-pane-label">// preview</div>
            <div className="prose md-editor-prose">
              <PostContent content={previewBody} />
            </div>
          </div>
        )}
      </div>

      <div className="md-editor-tags">
        <div className="md-editor-tags-input">
          <input
            type="text"
            placeholder="Thêm tag... (Enter để thêm)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
          />
        </div>
        <div className="md-editor-tags-list">
          {tags.map((tag) => (
            <span key={tag} className="tag-pill md-editor-tag">
              #{tag}
              <button type="button" onClick={() => removeTag(tag)} className="md-editor-tag-remove">&times;</button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
