import fs from "fs";
import path from "path";
import AppShell from "@/components/AppShell";
import PostContent from "@/components/PostContent";
import Giscus from "@/components/Giscus";
import { getPostBySlug, getAllPostSlugs, formatDateFull } from "@/lib/posts";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import Link from "next/link";

export function generateStaticParams() {
  const dir = path.join(process.cwd(), "content", "tools");
  if (!fs.existsSync(dir)) return [{ slug: "placeholder" }];
  const slugs = fs.readdirSync(dir).filter((n) => n.endsWith(".md")).map((n) => n.replace(/\.md$/, ""));
  return slugs.length > 0 ? slugs.map((slug) => ({ slug })) : [{ slug: "placeholder" }];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug, "tools");

  if (!post) {
    return { title: `Không tìm thấy — ${SITE_NAME}` };
  }

  const url = `${SITE_URL}/tools/${slug}`;

  return {
    title: `${post.title} — ${SITE_NAME}`,
    description: post.description || post.title,
    authors: [{ name: "Long N." }],
    openGraph: {
      title: post.title,
      description: post.description,
      url: url,
      siteName: SITE_NAME,
      type: "article",
      publishedTime: post.date,
      authors: ["Long N."],
      locale: "vi_VN",
    },
    twitter: {
      card: "summary",
      title: post.title,
      description: post.description,
    },
    alternates: { canonical: url },
  };
}

export default async function ToolPostPage({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug, "tools");

  if (!post) {
    return (
      <AppShell>
        <section className="view page-enter" style={{ display: "block" }}>
          <p className="eyebrow">404</p>
          <h2>Không tìm thấy</h2>
          <p>Bài viết không tồn tại hoặc đã bị xóa.</p>
          <Link href="/tools" className="btn" style={{ marginTop: "20px" }}>
            ← Quay về Apps & Tools
          </Link>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="view page-enter" style={{ display: "block" }}>
        <Link
          href="/tools"
          className="btn"
          style={{ marginBottom: "24px", display: "inline-block" }}
        >
          ← Quay về Apps & Tools
        </Link>

        <article>
          <header style={{ marginBottom: "32px" }}>
            <p className="eyebrow">Apps & Tools</p>
            <h1>{post.title}</h1>
            <p
              style={{
                fontFamily: "var(--mono)",
                fontSize: "13px",
                color: "var(--text-faint)",
              }}
            >
              📅 {formatDateFull(post.date)}
            </p>
            {post.tags?.length > 0 && (
              <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                {post.tags.map((tag) => (
                  <span key={tag} className="tag-pill">{tag}</span>
                ))}
              </div>
            )}
          </header>

          <div className="prose">
            <PostContent content={post.content} />
          </div>
        </article>

        <Giscus slug={slug} />
      </section>
    </AppShell>
  );
}
