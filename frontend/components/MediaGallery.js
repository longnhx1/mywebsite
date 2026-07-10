import React, { useState } from "react";
import styles from "./MediaGallery.module.css";
import AnimateOnView from "./AnimateOnView";

export default function MediaGallery({ mediaFiles }) {
  const [copiedUrl, setCopiedUrl] = useState(null);

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={styles.container}>
      <AnimateOnView>
        <div className={styles.header}>
          <h2>Thư viện ảnh</h2>
          <p className={styles.description}>Quản lý hình ảnh tĩnh được sử dụng trong bài viết</p>
        </div>
      </AnimateOnView>

      <div className={styles.grid}>
        {mediaFiles.length > 0 ? (
          mediaFiles.map((file, index) => (
            <AnimateOnView delay={100 + (index % 10) * 50} key={index}>
              <div className={styles.card}>
                <div className={styles.imageWrapper}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={file.url} alt={file.name} className={styles.image} loading="lazy" />
                  <div className={styles.overlay}>
                    <button
                      className={styles.copyBtn}
                      onClick={() => handleCopy(file.url)}
                    >
                      {copiedUrl === file.url ? "Đã copy!" : "Copy Link"}
                    </button>
                  </div>
                </div>
                <div className={styles.info}>
                  <p className={styles.filename} title={file.name}>{file.name}</p>
                  <p className={styles.size}>{formatSize(file.size)}</p>
                </div>
              </div>
            </AnimateOnView>
          ))
        ) : (
          <div className={styles.emptyState}>
            Không có hình ảnh nào.
          </div>
        )}
      </div>
    </div>
  );
}
