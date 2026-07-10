import { NextResponse } from "next/server";
import os from "os";
import fs from "fs/promises";
import path from "path";

// Function to calculate CPU usage over an interval since os.cpus() just gives total ticks since boot
function getCpuUsage() {
  const cpus = os.cpus();
  let totalUser = 0;
  let totalSys = 0;
  let totalIdle = 0;

  cpus.forEach((cpu) => {
    totalUser += cpu.times.user;
    totalSys += cpu.times.sys;
    totalIdle += cpu.times.idle;
  });

  const total = totalUser + totalSys + totalIdle;
  const idle = totalIdle;
  
  return { total, idle, model: cpus[0].model, cores: cpus.length };
}

export async function POST() {
  try {
    // 1. Uptime
    const uptime = os.uptime();

    // 2. RAM
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memUsagePercent = (usedMem / totalMem) * 100;

    // 3. Disk (Root/Current Drive)
    let diskTotal = 0;
    let diskFree = 0;
    let diskUsagePercent = 0;

    try {
      // Use fs.statfs to get the disk stats of the root path (or C: on Windows)
      const rootPath = os.platform() === 'win32' ? path.parse(process.cwd()).root : '/';
      const stats = await fs.statfs(rootPath);
      diskTotal = stats.blocks * stats.bsize;
      diskFree = stats.bavail * stats.bsize;
      const diskUsed = diskTotal - diskFree;
      diskUsagePercent = (diskUsed / diskTotal) * 100;
    } catch (e) {
      console.error("Error fetching disk usage:", e);
    }

    // 4. CPU (We return the raw ticks, frontend will calculate the diff between calls)
    const cpu = getCpuUsage();

    return NextResponse.json({
      uptime,
      ram: {
        total: totalMem,
        used: usedMem,
        free: freeMem,
        usagePercent: memUsagePercent,
      },
      disk: {
        total: diskTotal,
        free: diskFree,
        usagePercent: diskUsagePercent,
      },
      cpu: {
        totalTicks: cpu.total,
        idleTicks: cpu.idle,
        model: cpu.model,
        cores: cpu.cores,
      },
      os: {
        platform: os.platform(),
        release: os.release(),
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
