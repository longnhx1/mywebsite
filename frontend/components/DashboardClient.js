"use client";

import { useState } from "react";
import Link from "next/link";

import { useRouter } from "next/navigation";

const sideItems = [
  { key: "posts", label: "📝 Bài viết" },
  { key: "apps-games", label: "📦 Apps & Games" },
  { key: "editor", label: "✏️ Soạn Markdown", href: "/dashboard/edit" },
  { key: "media", label: "🖼️ Media" },
  { key: "stats", label: "📊 Thống kê" },
  { key: "settings", label: "⚙️ Cài đặt" },
];

const iconMap = {
  web: "🌐", game: "🎮", tool: "🔧", data: "📊",
};

export default function DashboardClient({ posts, toolsPosts, stats }) {
  const [activePanel, setActivePanel] = useState("posts");
  const router = useRouter();

  const handleDelete = async (slug, title, type = "posts") => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bài viết "${title}" không? Hành động này không thể hoàn tác.`)) {
      return;
    }
    
    try {
      const res = await fetch(`/api/delete?slug=${slug}&type=${type}`, { method: "DELETE" });
      const data = await res.json();
      if (data.ok) {
        alert("Đã xóa bài viết thành công!");
        router.refresh();
      } else {
        alert(`Lỗi khi xóa: ${data.error}`);
      }
    } catch (error) {
      alert(`Lỗi: ${error.message}`);
    }
  };

  return (
    <div className="dash-grid">
      <div className="dash-side">
        {sideItems.map((item) =>
          item.href ? (
            <Link
              key={item.key}
              href={item.href}
              className="item item-link"
            >
              {item.label}
            </Link>
          ) : (
            <button
              key={item.key}
              type="button"
              className={`item${activePanel === item.key ? " on" : ""}`}
              onClick={() => setActivePanel(item.key)}
            >
              {item.label}
            </button>
          )
        )}
      </div>

      <div className="dash-main">
        {activePanel === "posts" && (
          <>
            <div className="dash-stats">
              {stats.map((stat) => (
                <div key={stat.label} className="stat-card">
                  <div className="n">{stat.value}</div>
                  <div className="l">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="dash-toolbar">
              <span className="dash-toolbar-label">Quản lý bài viết</span>
              <Link href="/dashboard/edit" className="btn primary">
                + Bài viết mới
              </Link>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Tiêu đề</th>
                  <th>Danh mục</th>
                  <th>Ngày</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.slug}>
                    <td className="title">{post.title}</td>
                    <td>
                      <span
                        className={`status ${post.category === "exp" ? "draft" : "pub"}`}
                      >
                        {post.categoryLabel}
                      </span>
                    </td>
                    <td>{post.dateShort}</td>
                    <td className="dash-actions">
                      <Link
                        href={`/dashboard/edit/${post.slug}`}
                        className="btn btn-sm"
                      >
                        Sửa
                      </Link>
                      <button
                        onClick={() => handleDelete(post.slug, post.title, "posts")}
                        className="btn btn-sm"
                        style={{ color: "var(--danger, #ff4d4f)", borderColor: "var(--danger, #ff4d4f)" }}
                      >
                        Xóa
                      </button>
                      <Link href={`/blog/${post.slug}`} className="btn btn-sm">
                        Xem
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activePanel === "apps-games" && (
          <>
            <div className="dash-toolbar">
              <span className="dash-toolbar-label">Quản lý Apps &amp; Games</span>
              <Link href="/dashboard/edit" className="btn primary">
                + Bài viết mới
              </Link>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Tiêu đề</th>
                  <th>Danh mục</th>
                  <th>Ngày</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {toolsPosts.map((post) => (
                  <tr key={post.slug}>
                    <td className="title">{post.title}</td>
                    <td>
                      <span className="status pub">
                        {post.categoryLabel || "Apps & Games"}
                      </span>
                    </td>
                    <td>{post.dateShort}</td>
                    <td className="dash-actions">
                      <Link
                        href={`/dashboard/edit/${post.slug}`}
                        className="btn btn-sm"
                      >
                        Sửa
                      </Link>
                      <button
                        onClick={() => handleDelete(post.slug, post.title, "tools")}
                        className="btn btn-sm"
                        style={{ color: "var(--danger, #ff4d4f)", borderColor: "var(--danger, #ff4d4f)" }}
                      >
                        Xóa
                      </button>
                      <Link href={`/tools/${post.slug}`} className="btn btn-sm">
                        Xem
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activePanel === "media" && (
          <div className="dash-panel">
            <h3>Media</h3>
            <p>
              Ảnh bài viết lưu tại <code>public/images/posts/</code>. Chèn vào
              Markdown bằng{" "}
              <code>![mô tả](/images/posts/ten-anh.jpg)</code>.
            </p>
          </div>
        )}

        {activePanel === "stats" && (
          <div className="dash-panel">
            <h3>Thống kê</h3>
            <p>
              Website dùng Static Export — không có analytics server-side. Có
              thể tích hợp Plausible hoặc Umami sau (nhẹ, privacy-friendly).
            </p>
            <div className="dash-stats" style={{ marginTop: "20px" }}>
              <div className="stat-card">
                <div className="n">{posts.length}</div>
                <div className="l">bài đã xuất bản</div>
              </div>
              <div className="stat-card">
                <div className="n">
                  {posts.filter((p) => p.category === "know").length}
                </div>
                <div className="l">kiến thức</div>
              </div>
              <div className="stat-card">
                <div className="n">
                  {posts.filter((p) => p.category === "exp").length}
                </div>
                <div className="l">trải nghiệm</div>
              </div>
            </div>
          </div>
        )}

        {activePanel === "settings" && (
          <div className="dash-panel">
            <h3>Cài đặt</h3>
            <p>Workflow viết bài:</p>
            <ol className="dash-steps">
              <li>
                Soạn tại <Link href="/dashboard/edit">trang Markdown editor</Link>{" "}
                hoặc tạo file <code>content/posts/ten-bai.md</code>
              </li>
              <li>Thêm frontmatter (title, slug, date, category...)</li>
              <li>Chạy <code>npm run build</code></li>
              <li>Deploy bằng <code>bash deploy/update.sh</code></li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
