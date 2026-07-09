import AppShell from "@/components/AppShell";
import MarkdownEditor from "@/components/MarkdownEditor";
import AnimateOnView from "@/components/AnimateOnView";
import Link from "next/link";
import {
  getAllPostSlugs,
  getPostBySlug,
  getPostRawBySlug,
} from "@/lib/posts";

export function generateStaticParams() {
  const postSlugs = getAllPostSlugs("posts");
  const toolSlugs = getAllPostSlugs("tools");
  const allSlugs = [...new Set([...postSlugs, ...toolSlugs])];
  return allSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug, "posts") || getPostBySlug(slug, "tools");
  return {
    title: post
      ? `Sửa: ${post.title} — Dashboard`
      : "Sửa bài viết — Dashboard",
    robots: { index: false, follow: false },
  };
}

export default async function DashboardEditSlugPage({ params }) {
  const { slug } = await params;
  
  // Kiểm tra posts trước, nếu không có thì kiểm tra tools
  let post = getPostBySlug(slug, "posts");
  let raw = getPostRawBySlug(slug, "posts");
  let type = "posts";
  
  if (!post) {
    post = getPostBySlug(slug, "tools");
    raw = getPostRawBySlug(slug, "tools");
    type = "tools";
  }

  if (!post || !raw) {
    return (
      <AppShell>
        <section className="view page-enter" style={{ display: "block" }}>
          <p className="eyebrow">404</p>
          <h2>Không tìm thấy bài viết</h2>
          <Link href="/dashboard/edit" className="btn primary">
            Soạn bài mới
          </Link>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="view page-enter md-editor-page" style={{ display: "block" }} id="dashboard">
        <AnimateOnView>
          <Link href="/dashboard" className="btn" style={{ marginBottom: "20px" }}>
            ← Dashboard
          </Link>
          <p className="eyebrow">soạn thảo {type === "tools" ? "apps & games" : "blog"}</p>
          <h2>{post.title}</h2>
          <p>
            Chỉnh sửa file <code>{slug}.md</code>. Ấn nút Publish để lưu đè.
          </p>
        </AnimateOnView>

        <AnimateOnView delay={100}>
          <MarkdownEditor
            slug={slug}
            initialContent={raw}
            fileName={`${slug}.md`}
            pageType={type}
          />
        </AnimateOnView>
      </section>
    </AppShell>
  );
}
