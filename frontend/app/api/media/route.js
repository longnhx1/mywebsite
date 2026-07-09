import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ ok: false, error: "API only available in local development" }, { status: 403 });
  }

  const { name } = await req.json();

  if (!name) {
    return NextResponse.json({ ok: false, error: "Missing name" }, { status: 400 });
  }

  const safeName = path.basename(name);
  const dir = path.join(process.cwd(), "public", "images", "posts");
  const filePath = path.join(dir, safeName);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "File not found" }, { status: 404 });
}
