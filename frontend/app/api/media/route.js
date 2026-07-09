import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  const dir = path.join(process.cwd(), "public", "images", "posts");
  if (!fs.existsSync(dir)) {
    return NextResponse.json({ ok: true, files: [] });
  }

  const files = fs.readdirSync(dir)
    .filter((f) => /\.(png|jpe?g|gif|svg|webp|ico)$/i.test(f))
    .map((f) => {
      const stat = fs.statSync(path.join(dir, f));
      return {
        name: f,
        url: `/images/posts/${f}`,
        size: stat.size,
        mtime: stat.mtime.toISOString(),
      };
    })
    .sort((a, b) => b.mtime.localeCompare(a.mtime));

  return NextResponse.json({ ok: true, files });
}

export async function DELETE(req) {
  const dir = path.join(process.cwd(), "public", "images", "posts");
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json({ ok: false, error: "Missing name" }, { status: 400 });
  }

  const safeName = path.basename(name);
  const filePath = path.join(dir, safeName);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "File not found" }, { status: 404 });
}
