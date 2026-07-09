// scripts/generate-sitemap.js — Tạo sitemap.xml + robots.txt lúc build

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

// Đọc từ .env.production nếu có
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
  return process.env.NEXT_PUBLIC_SITE_URL || "http://longnhx.duckdns.org";
}

const SITE_URL = loadSiteUrl().replace(/\/$/, "");
const postsDir = path.join(__dirname, "..", "content", "posts");
const publicDir = path.join(__dirname, "..", "public");

function getAllPosts() {
  if (!fs.existsSync(postsDir)) return [];
  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const content = fs.readFileSync(path.join(postsDir, f), "utf-8");
      const { data } = matter(content);
      return {
        slug: data.slug || f.replace(/\.md$/, ""),
        date: data.date || "",
      };
    });
}

function generateSitemap() {
  const posts = getAllPosts();
  const today = new Date().toISOString().split("T")[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${SITE_URL}/projects</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_URL}/tools</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;

  for (const post of posts) {
    xml += `
  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>${post.date ? `\n    <lastmod>${post.date}</lastmod>` : ""}
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }

  xml += `
</urlset>
`;

  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), xml);

  const robots = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

Disallow: /dashboard

Sitemap: ${SITE_URL}/sitemap.xml
`;

  fs.writeFileSync(path.join(publicDir, "robots.txt"), robots);

  console.log(`✅ Sitemap + robots.txt generated (${SITE_URL})`);
  console.log(`   ${4 + posts.length} URLs (${posts.length} bài viết)`);
}

generateSitemap();
