"use client";

import { useState, useEffect, useCallback } from "react";

export default function MediaGallery() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState("");

  const loadFiles = useCallback(async () => {
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      if (data.ok) setFiles(data.files);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadFiles(); }, [loadFiles]);

  function formatSize(bytes) {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }

  async function copyUrl(url) {
    try {
      await navigator.clipboard.writeText(`![alt](${url})`);
      setCopied(url);
      setTimeout(() => setCopied(""), 2000);
    } catch {
      //
    }
  }

  async function handleDelete(name) {
    if (!window.confirm(`Xóa ${name}?`)) return;
    try {
      const res = await fetch(`/api/media?name=${encodeURIComponent(name)}`, { method: "DELETE" });
      const data = await res.json();
      if (data.ok) loadFiles();
      else alert(`Lỗi: ${data.error}`);
    } catch (e) {
      alert(`Lỗi: ${e.message}`);
    }
  }

  if (loading) return <p style={{ color: "var(--text-faint)", fontFamily: "var(--mono)", fontSize: "13px" }}>Đang tải...</p>;

  return (
    <div>
      <div className="dash-toolbar">
        <span className="dash-toolbar-label">{files.length} file ảnh</span>
      </div>

      {files.length === 0 ? (
        <p className="empty-msg">Chưa có ảnh nào. Upload ảnh từ trình soạn thảo Markdown.</p>
      ) : (
        <div className="media-grid">
          {files.map((f) => (
            <div key={f.name} className="media-card">
              <div className="media-preview">
                <img src={f.url} alt={f.name} loading="lazy" />
              </div>
              <div className="media-info">
                <span className="media-name" title={f.name}>{f.name}</span>
                <span className="media-size">{formatSize(f.size)}</span>
              </div>
              <div className="media-actions">
                <button className="btn btn-sm" onClick={() => copyUrl(f.url)}>
                  {copied === f.url ? "✓ Đã copy" : "Copy Markdown"}
                </button>
                <button
                  className="btn btn-sm"
                  style={{ color: "var(--rose)", borderColor: "var(--rose)" }}
                  onClick={() => handleDelete(f.name)}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
