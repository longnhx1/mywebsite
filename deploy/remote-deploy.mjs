#!/usr/bin/env node
/**
 * Deploy static site lên VPS qua SSH/SFTP
 *
 * Usage:
 *   npm run deploy          # build + upload (từ thư mục gốc myweb)
 *   npm run deploy:files    # chỉ upload (đã build sẵn)
 *   node remote-deploy.mjs --nginx   # cập nhật nginx config (hiếm khi cần)
 */

import { Client } from "ssh2";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "frontend", "out");
const FRONTEND_DIR = path.join(ROOT, "frontend");

const args = process.argv.slice(2);
const shouldBuild = args.includes("--build");
const shouldUpdateNginx = args.includes("--nginx");

function loadEnv() {
  const envPath = path.join(__dirname, ".env.deploy");
  const env = {};
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
    }
  }
  return {
    host: process.env.VPS_HOST || env.VPS_HOST || "192.168.1.106",
    username: process.env.VPS_USER || env.VPS_USER || "eve",
    password: process.env.VPS_PASS || env.VPS_PASS || "",
    webRoot: process.env.VPS_WEB_ROOT || env.VPS_WEB_ROOT || "/var/www/longn.dev",
    port: process.env.VPS_PORT || env.VPS_PORT || "443",
    domain: process.env.DUCKDNS_DOMAIN || env.DUCKDNS_DOMAIN || "longnhx",
  };
}

function runBuild() {
  return new Promise((resolve, reject) => {
    console.log("🔨 Building frontend...\n");
    const isWin = process.platform === "win32";
    const child = spawn(isWin ? "npm.cmd" : "npm", ["run", "build"], {
      cwd: FRONTEND_DIR,
      stdio: "inherit",
      shell: isWin,
    });
    child.on("close", (code) => {
      if (code !== 0) reject(new Error(`Build failed (exit ${code})`));
      else resolve();
    });
    child.on("error", reject);
  });
}

function exec(conn, cmd, useSudo = false, sudoPass = "") {
  const fullCmd = useSudo
    ? `echo '${sudoPass.replace(/'/g, "'\\''")}' | sudo -S bash -c ${JSON.stringify(cmd)}`
    : cmd;

  return new Promise((resolve, reject) => {
    conn.exec(fullCmd, (err, stream) => {
      if (err) return reject(err);
      let stdout = "";
      let stderr = "";
      stream.on("data", (d) => {
        stdout += d.toString();
        process.stdout.write(d);
      });
      stream.stderr.on("data", (d) => {
        stderr += d.toString();
        process.stderr.write(d);
      });
      stream.on("close", (code) => {
        if (code !== 0) reject(new Error(`Exit ${code}: ${stderr || stdout}`));
        else resolve(stdout);
      });
    });
  });
}

function sftpMkdir(sftp, dir) {
  return new Promise((resolve, reject) => {
    sftp.mkdir(dir, (err) => {
      if (err && err.code !== 4) reject(err);
      else resolve();
    });
  });
}

async function uploadDir(sftp, localDir, remoteDir) {
  const entries = fs.readdirSync(localDir, { withFileTypes: true });
  await sftpMkdir(sftp, remoteDir);

  for (const entry of entries) {
    const localPath = path.join(localDir, entry.name);
    const remotePath = `${remoteDir}/${entry.name}`.replace(/\\/g, "/");

    if (entry.isDirectory()) {
      await uploadDir(sftp, localPath, remotePath);
    } else {
      await new Promise((resolve, reject) => {
        sftp.fastPut(localPath, remotePath, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      process.stdout.write(".");
    }
  }
}

async function uploadNginxConfig(conn, pass) {
  const nginxConf = fs.readFileSync(path.join(__dirname, "nginx-lan.conf"), "utf-8");
  const nginxTmp = "/tmp/longn-nginx.conf";

  await new Promise((resolve, reject) => {
    conn.sftp((err, sftp) => {
      if (err) return reject(err);
      const ws = sftp.createWriteStream(nginxTmp);
      ws.on("close", resolve);
      ws.on("error", reject);
      ws.end(nginxConf);
    });
  });

  await exec(
    conn,
    `cp ${nginxTmp} /etc/nginx/sites-available/longn.dev && ln -sf /etc/nginx/sites-available/longn.dev /etc/nginx/sites-enabled/longn.dev && nginx -t && systemctl reload nginx`,
    true,
    pass
  );
  console.log("✅ Nginx config đã cập nhật\n");
}

async function main() {
  const cfg = loadEnv();

  if (!cfg.password) {
    console.error("❌ Thiếu VPS_PASS — tạo file deploy/.env.deploy");
    process.exit(1);
  }

  if (shouldBuild) {
    await runBuild();
    console.log("");
  }

  if (!fs.existsSync(OUT_DIR)) {
    console.error("❌ Chưa có frontend/out — chạy: npm run build");
    process.exit(1);
  }

  console.log(`🚀 Deploy → ${cfg.username}@${cfg.host}:${cfg.webRoot}\n`);

  const conn = new Client();

  await new Promise((resolve, reject) => {
    conn
      .on("ready", resolve)
      .on("error", reject)
      .connect({
        host: cfg.host,
        port: 22,
        username: cfg.username,
        password: cfg.password,
        readyTimeout: 20000,
      });
  });

  console.log("✅ SSH kết nối thành công\n");

  const pass = cfg.password;

  if (shouldUpdateNginx) {
    await uploadNginxConfig(conn, pass);
  }

  await exec(conn, `rm -rf ${cfg.webRoot}/*`, true, pass);
  await exec(
    conn,
    `chown -R ${cfg.username}:www-data ${cfg.webRoot} && chmod -R 775 ${cfg.webRoot}`,
    true,
    pass
  );
  console.log("📤 Upload static files...");

  await new Promise((resolve, reject) => {
    conn.sftp(async (err, sftp) => {
      if (err) return reject(err);
      try {
        await uploadDir(sftp, OUT_DIR, cfg.webRoot);
        console.log("\n✅ Upload hoàn tất\n");
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  });

  await exec(
    conn,
    `chown -R www-data:www-data ${cfg.webRoot} && find ${cfg.webRoot} -type d -exec chmod 755 {} \\; && find ${cfg.webRoot} -type f -exec chmod 644 {} \\;`,
    true,
    pass
  );

  conn.end();

  const siteUrl =
    cfg.port === "443"
      ? `https://${cfg.domain}.duckdns.org`
      : `http://${cfg.host}:${cfg.port}`;

  console.log("=====================================================");
  console.log("🎉 Deploy thành công!");
  console.log(`   → ${siteUrl}`);
  console.log(`   → https://${cfg.host} (LAN)`);
  console.log("=====================================================\n");
}

main().catch((err) => {
  console.error("\n❌ Deploy thất bại:", err.message);
  process.exit(1);
});
