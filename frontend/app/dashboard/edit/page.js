import AppShell from "@/components/AppShell";
import MarkdownEditor from "@/components/MarkdownEditor";
import AnimateOnView from "@/components/AnimateOnView";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "Soạn bài mới - Dashboard - longnhx",
  robots: { index: false, follow: false },
};

export default function DashboardEditNewPage() {
  const posts = getAllPosts();

  return (
    <AppShell>
      <section className="view page-enter md-editor-page" style={{ display: "block" }} id="dashboard">
        <AnimateOnView>
          <Link href="/dashboard" className="btn" style={{ marginBottom: "20px" }}>
            ← Dashboard
          </Link>
          <p className="eyebrow">soạn thảo</p>
          <h2>Bài viết mới</h2>
          <p>
            Soạn Markdown, xem preview trực tiếp, tải file về và đặt vào{" "}
            <code>content/posts/</code>.
          </p>
        </AnimateOnView>

        {posts.length > 0 && (
          <div className="md-editor-quick-links">
            <span>Hoặc sửa bài có sẵn:</span>
            {posts.map((p) => (
              <Link key={p.slug} href={`/dashboard/edit/${p.slug}`} className="chip">
                {p.title}
              </Link>
            ))}
          </div>
        )}

        <AnimateOnView delay={100}>
          <MarkdownEditor fileName="bai-viet-moi.md" />
        </AnimateOnView>
      </section>
    </AppShell>
  );
}
