#!/usr/bin/env node
/**
 * Cài DuckDNS updater lên VPS qua SSH
 * Cần DUCKDNS_DOMAIN + DUCKDNS_TOKEN trong deploy/.env.deploy
 */

import { Client } from "ssh2";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const envPath = path.join(__dirname, ".env.deploy");
  const env = {};
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const [k, ...v] = t.split("=");
      env[k.trim()] = v.join("=").trim();
    }
  }
  return {
    host: env.VPS_HOST || "192.168.1.106",
    username: env.VPS_USER || "eve",
    password: env.VPS_PASS || "",
    domain: env.DUCKDNS_DOMAIN || "longnhx",
    token: env.DUCKDNS_TOKEN || "",
  };
}

function exec(conn, cmd) {
  return new Promise((resolve, reject) => {
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let out = "";
      stream.on("data", (d) => { out += d; process.stdout.write(d); });
      stream.stderr.on("data", (d) => { out += d; process.stderr.write(d); });
      stream.on("close", (code) => {
        if (code !== 0) reject(new Error(`Exit ${code}`));
        else resolve(out);
      });
    });
  });
}

const cfg = loadEnv();

if (!cfg.password) {
  console.error("❌ Thiếu VPS_PASS trong deploy/.env.deploy");
  process.exit(1);
}

if (!cfg.token) {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║  Đăng ký DuckDNS (2 phút)                                ║
╠══════════════════════════════════════════════════════════╣
║  1. Mở https://www.duckdns.org                           ║
║  2. Đăng nhập bằng Google hoặc GitHub (không cần SĐT)    ║
║  3. Tạo subdomain, ví dụ: longnhx                        ║
║     → bạn sẽ có: longnhx.duckdns.org                     ║
║  4. Copy token (chuỗi dài trên trang)                   ║
║  5. Thêm vào deploy/.env.deploy:                         ║
║       DUCKDNS_DOMAIN=longnhx                             ║
║       DUCKDNS_TOKEN=your-token-here                      ║
║  6. Chạy lại: npm run setup-duckdns                      ║
╚══════════════════════════════════════════════════════════╝

Router (để truy cập từ ngoài mạng nhà):
  Port forward WAN :80  → 192.168.1.106:3080
  Hoặc truy cập: http://longnhx.duckdns.org:3080
`);
  process.exit(0);
}

const conn = new Client();
conn.on("ready", async () => {
  console.log(`\n🦆 Cài DuckDNS updater → ${cfg.domain}.duckdns.org\n`);

  const script = fs.readFileSync(path.join(__dirname, "setup-duckdns.sh"), "utf-8");
  const remoteScript = `/tmp/setup-duckdns.sh`;

  await new Promise((resolve, reject) => {
    conn.sftp((err, sftp) => {
      if (err) return reject(err);
      const ws = sftp.createWriteStream(remoteScript);
      ws.on("close", resolve);
      ws.on("error", reject);
      ws.end(script);
    });
  });

  await exec(
    conn,
    `chmod +x ${remoteScript} && DUCKDNS_DOMAIN=${cfg.domain} DUCKDNS_TOKEN=${cfg.token} bash ${remoteScript}`
  );

  conn.end();
  console.log("\n✅ Xong! Kiểm tra: http://" + cfg.domain + ".duckdns.org");
});

conn.on("error", (e) => { console.error(e); process.exit(1); });
conn.connect({
  host: cfg.host,
  port: 22,
  username: cfg.username,
  password: cfg.password,
});
