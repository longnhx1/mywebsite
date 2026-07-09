import AppShell from "@/components/AppShell";
import BlogContent from "@/components/BlogContent";
import AnimateOnView from "@/components/AnimateOnView";
import { getAllPosts, formatDate } from "@/lib/posts";

export const metadata = {
  title: "Blog & Kiến thức — longnhx",
  description:
    "Trải nghiệm cá nhân và các bài viết kỹ thuật — kiến thức lập trình, học tập.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog & Kiến thức — longn.dev",
    url: "https://longnhx.duckdns.org/blog",
  },
};

export default function BlogPage() {
  const posts = getAllPosts().map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    category: post.category,
    categoryLabel: post.categoryLabel,
    tags: post.tags || [],
    dateShort: formatDate(post.date),
  }));

  return (
    <AppShell>
      <section className="view page-enter" style={{ display: "block" }} id="blog">
        <AnimateOnView>
          <p className="eyebrow">kho nội dung</p>
          <h2>Blog &amp; Kiến thức</h2>
          <p>
            Trải nghiệm cá nhân và các bài viết kỹ thuật, gom về một chỗ.
          </p>
        </AnimateOnView>

        <BlogContent posts={posts} />
      </section>
    </AppShell>
  );
}
