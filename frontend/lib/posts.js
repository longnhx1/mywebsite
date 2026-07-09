import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDir = path.join(process.cwd(), "content", "posts");
const toolsDir = path.join(process.cwd(), "content", "tools");

const dirs = { posts: postsDir, tools: toolsDir };

function readPostsFrom(dir) {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((n) => n.endsWith(".md"))
    .map((fileName) => {
      const filePath = path.join(dir, fileName);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      return {
        slug: data.slug || fileName.replace(/\.md$/, ""),
        title: data.title || "Không có tiêu đề",
        description: data.description || "",
        category: data.category || "know",
        categoryLabel: data.categoryLabel || "Kiến thức",
        date: data.date || "",
        cover: data.cover || "",
        tags: data.tags || [],
        order: data.order ?? 0,
        content,
      };
    })
    .sort((a, b) => {
      const dateDiff = new Date(b.date || 0) - new Date(a.date || 0);
      if (dateDiff !== 0) return dateDiff;
      const orderDiff = (a.order ?? 0) - (b.order ?? 0);
      if (orderDiff !== 0) return orderDiff;
      return a.title.localeCompare(b.title);
    });
}

export function getAllPosts(type = "posts") {
  return readPostsFrom(dirs[type] || dirs.posts);
}

export function getPostBySlug(slug, type = "posts") {
  const posts = getAllPosts(type);
  return posts.find((p) => p.slug === slug) || null;
}

export function getPostRawBySlug(slug, type = "posts") {
  const dir = dirs[type] || dirs.posts;
  if (!fs.existsSync(dir)) return null;

  const files = fs.readdirSync(dir).filter((n) => n.endsWith(".md"));
  for (const fileName of files) {
    const filePath = path.join(dir, fileName);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);
    if ((data.slug || fileName.replace(/\.md$/, "")) === slug) {
      return fileContent;
    }
  }
  return null;
}

export function getAllPostSlugs(type = "posts") {
  return getAllPosts(type).map((p) => p.slug);
}

export function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function formatDateFull(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export function estimateReadingTime(text) {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
