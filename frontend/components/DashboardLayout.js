"use client";

import React, { useState } from "react";
import styles from "./DashboardLayout.module.css";

export default function DashboardLayout({ children, activeTab, setActiveTab }) {
  const [deploying, setDeploying] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 4000);
  };

  const handleDeploy = async () => {
    if (!window.confirm("Bắt đầu quá trình Build tĩnh (Static Export)? Thao tác này sẽ đồng bộ nội dung mới lên server.")) return;
    
    setDeploying(true);
    showToast("Đang build tĩnh... (Vui lòng đợi vài giây)");
    
    try {
      const res = await fetch("/api/deploy", { method: "POST" });
      const data = await res.json();
      
      if (data.ok) {
        showToast("✅ Build thành công! Đã sẵn sàng sync lên server.");
      } else {
        showToast(`❌ Lỗi Build: ${data.error}`, true);
      }
    } catch (err) {
      showToast(`❌ Lỗi mạng: ${err.message}`, true);
    }
    
    setDeploying(false);
  };

  const tabs = [
    { id: "overview", label: "Tổng quan", icon: "📊" },
    { id: "posts", label: "Bài viết", icon: "📝" },
    { id: "tools", label: "Ứng dụng", icon: "🛠️" },
    { id: "tags", label: "Thẻ & Danh mục", icon: "🏷️" },
    { id: "media", label: "Thư viện ảnh", icon: "🖼️" },
    { id: "server", label: "Server Monitor", icon: "🖥️" },
  ];

  return (
    <div className={styles.layout}>
      {toast && (
        <div className={`${styles.toast} ${toast.isError ? styles.toastError : ''}`}>
          {toast.msg}
        </div>
      )}

      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h3>Dashboard</h3>
          <button 
            className={styles.deployBtn} 
            onClick={handleDeploy} 
            disabled={deploying}
          >
            {deploying ? "⏳ Đang build..." : "🚀 Deploy"}
          </button>
        </div>
        <nav className={styles.nav}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.navItem} ${activeTab === tab.id ? styles.active : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.icon}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
