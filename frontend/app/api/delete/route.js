import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json({ ok: false, error: "API only available in local development" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const type = searchParams.get("type") || "posts";

    if (!slug) {
      return NextResponse.json({ ok: false, error: "Missing slug" }, { status: 400 });
    }

    const dirMap = {
      posts: "posts",
      tools: "tools",
    };
    
    const targetDirName = dirMap[type] || "posts";
    const filePath = path.join(process.cwd(), "content", targetDirName, `${slug}.md`);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return NextResponse.json({ ok: true });
    } else {
      return NextResponse.json({ ok: false, error: "File not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
