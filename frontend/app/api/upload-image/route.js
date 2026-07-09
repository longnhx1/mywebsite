import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json({ ok: false, error: "API only available in local development" }, { status: 403 });
    }

    const body = await req.json();
    const { image, name } = body;

    if (!image || !name) {
      return NextResponse.json({ ok: false, error: "Missing image data or name" }, { status: 400 });
    }

    // `image` is expected to be a data URL: "data:image/png;base64,iVBORw0KGgo..."
    const matches = image.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return NextResponse.json({ ok: false, error: "Invalid image format" }, { status: 400 });
    }

    const imageBuffer = Buffer.from(matches[2], "base64");
    
    // Ensure filename is safe (remove spaces, special chars)
    const safeName = name.toLowerCase().replace(/[^a-z0-9.-]/g, "-");
    const dir = path.join(process.cwd(), "public", "images", "posts");
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const filePath = path.join(dir, safeName);
    fs.writeFileSync(filePath, imageBuffer);

    // Return the URL path to be used in markdown
    const url = `/images/posts/${safeName}`;

    return NextResponse.json({ ok: true, url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
