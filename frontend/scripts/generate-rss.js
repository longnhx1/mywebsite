const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

function loadSiteUrl() {
  const envPath = path.join(__dirname, "..", ".env.production");
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
      const t = line.trim();
      if (t.startsWith("NEXT_PUBLIC_SITE_URL=")) {
        return t.split("=").slice(1).join("=").trim();
      }
    }
  }
  return process.env.NEXT_PUBLIC_SITE_URL || "https://longnhx.duckdns.org";
}

const SITE_URL = loadSiteUrl().replace(/\/$/, "");
const SITE_NAME = "longnhx — nhật ký số";

function getAllPosts(dir) {
  const d = path.join(__dirname, "..", "content", dir);
  if (!fs.existsSync(d)) return [];
  return fs
    .readdirSync(d)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const content = fs.readFileSync(path.join(d, f), "utf-8");
      const { data } = matter(content);
      return {
        slug: data.slug || f.replace(/\.md$/, ""),
        title: data.title || "",
        description: data.description || "",
        date: data.date || "",
        category: data.category || "",
        categoryLabel: data.categoryLabel || "",
        tags: data.tags || [],
      };
    })
    .filter((p) => p.title)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateRss() {
  const posts = getAllPosts("posts");
  const tools = getAllPosts("tools");
  const all = [...posts, ...tools].sort((a, b) => (a.date < b.date ? 1 : -1));
  const now = new Date().toISOString();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>Ghi lại quá trình học, chia sẻ những gì học được.</description>
    <language>vi</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/favicon.png</url>
      <title>${escapeXml(SITE_NAME)}</title>
      <link>${SITE_URL}</link>
    </image>`;

  for (const post of all) {
    const url = post.category === "tools"
      ? `${SITE_URL}/tools/${post.slug}`
      : `${SITE_URL}/blog/${post.slug}`;
    const pubDate = post.date ? new Date(post.date).toUTCString() : now;
    const tags = (post.tags || []).map((t) => `      <category>${escapeXml(t)}</category>`).join("\n");

    xml += `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.description || post.title)}</description>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(post.categoryLabel || post.category)}</category>
${tags}
    </item>`;
  }

  xml += `
  </channel>
</rss>`;

  fs.writeFileSync(path.join(__dirname, "..", "public", "rss.xml"), xml);
  console.log(`✅ RSS feed generated (${SITE_URL}/rss.xml)`);
  console.log(`   ${all.length} items`);
}

generateRss();
