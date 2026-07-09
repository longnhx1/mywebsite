import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function POST(req) {
  try {
    // Only allow in development mode
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json({ ok: false, error: "API only available in local development" }, { status: 403 });
    }

    const body = await req.json();
    const { title, rawContent, type = "posts" } = body;

    if (!title) {
      return NextResponse.json({ ok: false, error: "Missing title" }, { status: 400 });
    }

    // Attempt to extract slug from frontmatter if it exists, otherwise slugify the title
    let slug = slugify(title);
    const slugMatch = rawContent.match(/^slug:\s*['"]?([^'"\n]+)['"]?/m);
    if (slugMatch && slugMatch[1]) {
      slug = slugMatch[1].trim();
    }

    // Determine target directory
    const dirMap = {
      posts: "posts",
      tools: "tools", // Although tools might not be used anymore, keeping for fallback
    };
    const targetDirName = dirMap[type] || "posts";
    const dir = path.join(process.cwd(), "content", targetDirName);
    
    // Ensure directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const filePath = path.join(dir, `${slug}.md`);

    // Write file
    fs.writeFileSync(filePath, rawContent, "utf-8");

    return NextResponse.json({ ok: true, slug });
  } catch (error) {
    console.error("Publish error:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
