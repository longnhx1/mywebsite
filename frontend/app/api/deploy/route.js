import { NextResponse } from "next/server";
import { exec } from "child_process";
import util from "util";

const execAsync = util.promisify(exec);

export async function POST(req) {
  try {
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json({ ok: false, error: "API only available in local development" }, { status: 403 });
    }

    // Run npm run build
    // On Windows, use cmd to bypass PowerShell execution policies if any
    const isWin = process.platform === "win32";
    const cmd = isWin ? 'cmd.exe /c "npm run build"' : 'npm run build';
    
    // We execute it in the current working directory which is the Next.js project root (frontend)
    const { stdout, stderr } = await execAsync(cmd, { cwd: process.cwd() });
    
    return NextResponse.json({ ok: true, stdout, stderr });
  } catch (error) {
    console.error("Deploy error:", error);
    return NextResponse.json({ ok: false, error: error.message, stderr: error.stderr }, { status: 500 });
  }
}
