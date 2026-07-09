#!/usr/bin/env node
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
  };
}

function exec(conn, cmd) {
  return new Promise((resolve, reject) => {
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let out = "";
      stream.on("data", (d) => { out += d; process.stdout.write(d); });
      stream.stderr.on("data", (d) => { out += d; process.stderr.write(d); });
      stream.on("close", (code) => resolve({ code, out }));
    });
  });
}

const cfg = loadEnv();
const conn = new Client();
conn.on("ready", async () => {
  console.log("=== Port 80 ===");
  await exec(conn, `echo '${cfg.password.replace(/'/g, "'\\''")}' | sudo -S ss -tlnp | grep ':80 ' || true`);
  console.log("\n=== Nginx status ===");
  await exec(conn, "systemctl status nginx --no-pager 2>&1 | head -20");
  console.log("\n=== Nginx journal ===");
  await exec(conn, `echo '${cfg.password.replace(/'/g, "'\\''")}' | sudo -S journalctl -u nginx --no-pager -n 15 2>&1`);
  console.log("\n=== Ports 8080, 3080, 8888 ===");
  await exec(conn, `echo '${cfg.password.replace(/'/g, "'\\''")}' | sudo -S ss -tlnp | grep -E ':8080 |:3080 |:8888 |:3000 ' || true`);
  conn.end();
});
conn.connect({ host: cfg.host, username: cfg.username, password: cfg.password });
conn.on("error", (e) => { console.error(e); process.exit(1); });
