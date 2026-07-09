import AppShell from "@/components/AppShell";
import BlogContent from "@/components/BlogContent";
import AnimateOnView from "@/components/AnimateOnView";
import { getAllPosts, formatDate } from "@/lib/posts";

export const metadata = {
  title: "Apps, Games & Tools — longnhx",
  description:
    "Những ứng dụng, tựa game nhỏ và công cụ phần mềm mình sử dụng, được lưu trữ dưới dạng Markdown.",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "Apps & Tools — longn.dev",
    url: "https://longnhx.duckdns.org/tools",
  },
};

export default function ToolsPage() {
  const posts = getAllPosts("tools").map((post) => ({
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
      <section className="view page-enter" style={{ display: "block" }} id="tools">
        <AnimateOnView>
          <p className="eyebrow">góc ứng dụng</p>
          <h2>Apps &amp; Games</h2>
          <p>
            Những ứng dụng, tựa game nhỏ và tiện ích mình đã tự tay xây dựng hoặc cấu hình, được viết dưới dạng Markdown.
          </p>
        </AnimateOnView>

        <BlogContent
          posts={posts}
          baseRoute="/tools"
          filters={[
            { key: "all", label: "Tất cả" },
            { key: "apps", label: "Apps" },
            { key: "tools", label: "Tools" },
            { key: "games", label: "Games" },
          ]}
        />
      </section>
    </AppShell>
  );
}
