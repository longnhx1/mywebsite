import AppShell from "@/components/AppShell";
import Terminal from "@/components/Terminal";
import AnimateOnView from "@/components/AnimateOnView";
import PostRow from "@/components/PostRow";
import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/posts";
import { projects, MINI_TOOL_COUNT } from "@/lib/projects";

export default function HomePage() {
  const posts = getAllPosts();
  const recentPosts = posts.slice(0, 3);

  const stats = {
    posts: posts.length,
    projects: projects.length,
    tools: MINI_TOOL_COUNT,
  };

  return (
    <AppShell>
      <section className="view page-enter" style={{ display: "block" }} id="home">
        <div className="hero">
          <div className="hero-main">
            <AnimateOnView>
              <p className="eyebrow">sinh viên ngành hệ thống thông tin</p>
            </AnimateOnView>

            <AnimateOnView delay={80}>
              <h1>
                Ghi lại quá trình học,
                <br />
                chia sẻ những gì học được
                <span className="cursor"></span>
              </h1>
            </AnimateOnView>

            <AnimateOnView delay={160}>
              <p className="lede">
                Đây là không gian riêng để lưu trải nghiệm học tập, viết lại
                kiến thức kỹ thuật, và trưng bày những sản phẩm nhỏ mình tự tay
                xây dựng.
              </p>
            </AnimateOnView>

            <AnimateOnView delay={240}>
              <div className="cta-row">
                <Link href="/blog" className="btn primary">
                  Đọc bài viết mới nhất
                </Link>
                <Link href="/projects" className="btn">
                  Xem project
                </Link>
              </div>
            </AnimateOnView>

            <div className="stat-grid">
              {[
                { n: stats.posts, l: "bài viết" },
                { n: stats.projects, l: "project" },
                { n: stats.tools, l: "mini-tool" },
              ].map((stat, i) => (
                <AnimateOnView key={stat.l} delay={320 + i * 80} className="stat-card-wrap">
                  <div className="stat-card">
                    <div className="n">{stat.n}</div>
                    <div className="l">{stat.l}</div>
                  </div>
                </AnimateOnView>
              ))}
            </div>
          </div>

          <AnimateOnView delay={200} className="terminal-wrap">
            <Terminal />
          </AnimateOnView>
        </div>

        {recentPosts.length > 0 && (
          <AnimateOnView className="recent-section">
            <p className="eyebrow">mới nhất</p>
            <h2>Bài viết gần đây</h2>
            <div className="post-list">
              {recentPosts.map((post, index) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="post-link"
                >
                  <PostRow
                    number={String(index + 1).padStart(2, "0")}
                    title={post.title}
                    description={post.description}
                    category={post.category}
                    categoryLabel={post.categoryLabel}
                    tags={post.tags}
                    date={formatDate(post.date)}
                  />
                </Link>
              ))}
            </div>
            <Link href="/blog" className="btn" style={{ marginTop: "20px" }}>
              Xem tất cả bài viết →
            </Link>
          </AnimateOnView>
        )}
      </section>
    </AppShell>
  );
}
