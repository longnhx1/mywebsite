import AppShell from "@/components/AppShell";
import PostContent from "@/components/PostContent";
import Giscus from "@/components/Giscus";
import { getPostBySlug, getAllPostSlugs, formatDateFull } from "@/lib/posts";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import Link from "next/link";

// Generate static params cho tất cả bài viết tools (đọc từ content/tools/)
export function generateStaticParams() {
  const slugs = getAllPostSlugs("tools");
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata SEO cho mỗi bài viết tools
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug, "tools");

  if (!post) {
    return { title: `Apps & Games không tồn tại — ${SITE_NAME}` };
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
    alternates: {
      canonical: url,
    },
  };
}

export default async function ToolPostPage({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug, "tools");

  // 404 nếu không tìm thấy
  if (!post) {
    return (
      <AppShell>
        <section className="view page-enter" style={{ display: "block" }}>
          <p className="eyebrow">404</p>
          <h2>Bài viết không tồn tại</h2>
          <p>Nội dung bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Link href="/tools" className="btn" style={{ marginTop: "20px" }}>
            ← Quay về Apps & Games
          </Link>
        </section>
      </AppShell>
    );
  }

  // JSON-LD Structured Data cho Google
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: "Long N.",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "Long N.",
    },
    url: `${SITE_URL}/tools/${slug}`,
    mainEntityOfPage: `${SITE_URL}/tools/${slug}`,
  };

  return (
    <AppShell>
      {/* JSON-LD cho search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="view page-enter" style={{ display: "block" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          {/* Nút quay lại */}
          <Link
            href="/tools"
            className="btn"
          >
            ← Quay về Apps & Games
          </Link>

          {/* Nút Edit chỉ hiện ở Local */}
          {process.env.NODE_ENV === "development" && (
            <Link
              href={`/dashboard/edit/${slug}`}
              className="btn"
              style={{ color: "var(--gold)", borderColor: "var(--gold)" }}
            >
              ✏️ Sửa bài viết
            </Link>
          )}
        </div>

        <div className="post-container">
          {/* Header bài viết */}
          <article>
          <header style={{ marginBottom: "32px" }}>
            <p className="eyebrow">{post.categoryLabel || "Apps & Games"}</p>
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

          {/* Nội dung Markdown */}
          <div className="prose">
            <PostContent content={post.content} />
          </div>
        </article>

          {/* Giscus Comments */}
          <Giscus slug={slug} />
        </div>
      </section>
    </AppShell>
  );
}
