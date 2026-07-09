import Link from "next/link";
import AppShell from "@/components/AppShell";
import AnimateOnView from "@/components/AnimateOnView";
import { getAllPosts, formatDate } from "@/lib/posts";

export const metadata = {
  title: "Apps & Tools — longn.dev",
  description: "Chia sẻ apps, tools hay ho và hướng dẫn cài đặt chi tiết.",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "Apps & Tools — longn.dev",
    url: "https://longn.dev/tools",
  },
};

export default function ToolsPage() {
  const toolPosts = getAllPosts("tools");

  return (
    <AppShell>
      <section className="view page-enter" style={{ display: "block" }} id="tools">
        <AnimateOnView>
          <p className="eyebrow">chia sẻ công cụ</p>
          <h2>Apps &amp; Tools</h2>
          <p>
            Review, hướng dẫn cài đặt và những app/tool hay ho mình tìm được.
          </p>
        </AnimateOnView>

        {toolPosts.length > 0 ? (
          <AnimateOnView delay={80}>
            <div className="post-list post-list-animated" id="toolList">
              {toolPosts.map((post, i) => (
                <Link
                  key={post.slug}
                  href={`/tools/${post.slug}`}
                  className="post-link"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="post-row">
                    <span className="no">{String(i + 1).padStart(2, "0")}</span>
                    <div className="meta">
                      <h3>{post.title}</h3>
                      <p className="sub">{post.description}</p>
                    </div>
                    {post.tags?.length > 0 && (
                      <div className="post-tags">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="tag-pill">{tag}</span>
                        ))}
                      </div>
                    )}
                    <span className="date">{formatDate(post.date)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </AnimateOnView>
        ) : (
          <AnimateOnView delay={80}>
            <p style={{ color: "var(--text-dim)", marginTop: 24, fontSize: 14 }}>
              Chưa có bài viết nào. Soạn bài mới tại{" "}
              <Link href="/dashboard/edit" style={{ textDecoration: "underline" }}>
                Dashboard → Editor
              </Link>
              .
            </p>
          </AnimateOnView>
        )}
      </section>
    </AppShell>
  );
}
