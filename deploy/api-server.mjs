#!/usr/bin/env node
import http from "http";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND = path.resolve(__dirname, "..", "frontend");
const IMAGES_DIR = path.join(FRONTEND, "public", "images", "posts");
const PORT = parseInt(process.env.API_PORT || "3001", 10);
const API_KEY = process.env.API_KEY || "";

// Ensure images directory exists
fs.mkdirSync(IMAGES_DIR, { recursive: true });

function bad(res, msg) {
  res.writeHead(400, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: false, error: msg }));
}

function ok(res, data = {}) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: true, ...data }));
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const ct = req.headers["content-type"] || "";
        if (ct.includes("application/json")) resolve(JSON.parse(body));
        else resolve(body);
      } catch {
        resolve(body);
      }
    });
  });
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || `post-${Date.now()}`;
}

async function runBuild() {
  return new Promise((resolve, reject) => {
    const proc = spawn("npm", ["run", "build"], {
      cwd: FRONTEND,
      stdio: ["ignore", "pipe", "pipe"],
      shell: true,
    });
    let out = "";
    proc.stdout.on("data", (d) => (out += d));
    proc.stderr.on("data", (d) => (out += d));
    proc.on("close", (code) => {
      if (code === 0) resolve(out);
      else reject(new Error(`Build exit ${code}:\n${out.slice(-500)}`));
    });
  });
}

const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const route = url.pathname;

  // Simple API key check
  const auth = req.headers["authorization"] || "";
  if (API_KEY && auth !== `Bearer ${API_KEY}`) {
    res.writeHead(401);
    return res.end(JSON.stringify({ ok: false, error: "Unauthorized" }));
  }

  try {
    // POST /api/publish - save markdown + rebuild
    if (route === "/api/publish" && req.method === "POST") {
      const data = await parseBody(req);
      const { title, content, type = "posts", slug: customSlug, tags } = data;

      if (!title || !content) return bad(res, "Missing title or content");

      const slug = customSlug || generateSlug(title);
      const dir = path.join(FRONTEND, "content", type === "tools" ? "tools" : "posts");
      fs.mkdirSync(dir, { recursive: true });

      const now = new Date();
      const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      const tagStr = tags?.length ? `\ntags: [${tags.map((t) => `"${t}"`).join(", ")}]` : "";

      const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
slug: "${slug}"
date: "${date}"
description: "${(data.description || title).replace(/"/g, '\\"')}"
category: "${data.category || "know"}"
categoryLabel: "${data.categoryLabel || (type === "tools" ? "Apps & Tools" : "Kiến thức")}"${tagStr}
---

${content}`;

      const filePath = path.join(dir, `${slug}.md`);
      fs.writeFileSync(filePath, frontmatter, "utf-8");

      const buildLog = await runBuild();

      return ok(res, { slug, file: filePath, build: "ok" });
    }

    // POST /api/upload-image
    if (route === "/api/upload-image" && req.method === "POST") {
      const raw = await parseBody(req);
      // Expect base64 or binary
      let buffer, ext, filename;
      const ct = req.headers["content-type"] || "";

      if (ct.includes("application/json")) {
        const { image, name } = typeof raw === "string" ? JSON.parse(raw) : raw;
        if (!image) return bad(res, "Missing image data");
        const match = image.match(/^data:image\/(\w+);base64,(.+)/);
        if (!match) return bad(res, "Invalid image format");
        ext = match[1];
        buffer = Buffer.from(match[2], "base64");
      } else {
        // raw binary upload
        buffer = Buffer.from(raw, "binary");
        ext = "png";
      }

      filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      fs.writeFileSync(path.join(IMAGES_DIR, filename), buffer);

      return ok(res, { url: `/images/posts/${filename}` });
    }

    // POST /api/upload-md - upload .md file content
    if (route === "/api/upload-md" && req.method === "POST") {
      const data = await parseBody(req);
      const mdContent = typeof data === "string" ? data : data.content;
      if (!mdContent) return bad(res, "Missing markdown content");

      return ok(res, { content: mdContent });
    }

    // Health check
    if (route === "/api/health") {
      return ok(res, { status: "ok", uptime: process.uptime() });
    }

    bad(res, "Not found");
  } catch (e) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: false, error: e.message }));
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`📡 API server running on port ${PORT}`);
});

process.on("SIGTERM", () => server.close(() => process.exit(0)));
process.on("SIGINT", () => server.close(() => process.exit(0)));
