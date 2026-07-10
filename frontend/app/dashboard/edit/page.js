import MarkdownEditor from "@/components/MarkdownEditor";
import { getPostRawBySlug, getPostBySlug } from "@/lib/posts";
import Link from "next/link";

export const metadata = {
  title: "Soạn thảo bài viết - Dashboard",
  robots: { index: false, follow: false },
};

export default async function FullscreenEditorPage({ searchParams }) {
  const { slug, type = "posts" } = await searchParams;

  let rawContent = "";
  let post = null;

  if (slug) {
    rawContent = getPostRawBySlug(slug, type);
    post = getPostBySlug(slug, type);
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "var(--bg)", 
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Link href="/dashboard" className="btn" style={{ textDecoration: "none", display: "inline-block", marginBottom: "10px" }}>
            ← Quay lại Dashboard
          </Link>
          <h1 style={{ margin: 0, fontSize: "24px", color: "var(--text)" }}>
            {post ? `Chỉnh sửa: ${post.title}` : "Soạn bài viết mới"}
          </h1>
          <p style={{ margin: "5px 0 0 0", color: "var(--text-dim)", fontSize: "14px" }}>
            {slug ? `Đang sửa file ${slug}.md` : "Hãy viết nội dung tuyệt vời nhé!"}
          </p>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <MarkdownEditor
          slug={slug}
          initialContent={rawContent}
          fileName={slug ? `${slug}.md` : "bai-viet-moi.md"}
          pageType={type}
          onSaved={() => {}}
        />
      </div>
    </div>
  );
}
