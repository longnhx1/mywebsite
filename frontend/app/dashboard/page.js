import fs from "fs";
import path from "path";
import AppShell from "@/components/AppShell";
import DashboardClient from "@/components/DashboardClient";
import AnimateOnView from "@/components/AnimateOnView";
import { getAllPosts, formatDate } from "@/lib/posts";

export const metadata = {
  title: "Dashboard — longnhx",
  description: "Trang quản trị nội dung — xem danh sách bài viết, projects, tools.",
  robots: { index: false, follow: false },
};

function readRawJson(name) {
  try {
    const p = path.join(process.cwd(), "content", name);
    return fs.readFileSync(p, "utf-8");
  } catch { return "[]"; }
}

export default function DashboardPage() {
  const posts = getAllPosts("posts").map((post) => ({
    slug: post.slug,
    title: post.title,
    category: post.category,
    categoryLabel: post.categoryLabel,
    dateShort: formatDate(post.date),
    type: "posts",
  }));

  const toolsPosts = getAllPosts("tools").map((post) => ({
    slug: post.slug,
    title: post.title,
    category: post.category,
    categoryLabel: post.categoryLabel,
    dateShort: formatDate(post.date),
    type: "tools",
  }));

  const knowCount = posts.filter((p) => p.category === "know").length;
  const expCount = posts.filter((p) => p.category === "exp").length;

  const dashStats = [
    { value: String(posts.length), label: "bài viết blog" },
    { value: String(toolsPosts.length), label: "bài viết apps" },
    { value: `${knowCount}/${expCount}`, label: "know/exp (blog)" },
  ];

  return (
    <AppShell>
      <section className="view page-enter" style={{ display: "block" }} id="dashboard">
        <AnimateOnView>
          <p className="eyebrow">trang quản trị</p>
          <h2>Dashboard</h2>
          <p>
            Quản lý nội dung website — bài viết Markdown cho Blog và Apps &amp; Games.
          </p>
        </AnimateOnView>

        <AnimateOnView delay={120}>
          <DashboardClient
            posts={posts}
            toolsPosts={toolsPosts}
            stats={dashStats}
          />
        </AnimateOnView>
      </section>
    </AppShell>
  );
}
