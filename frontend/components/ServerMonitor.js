"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./ServerMonitor.module.css";
import AnimateOnView from "./AnimateOnView";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function formatBytesGB(bytes) {
  if (!bytes) return "0";
  return (bytes / 1024 / 1024 / 1024).toFixed(1);
}

function formatUptime(seconds) {
  if (!seconds) return "0m";
  const days = Math.floor(seconds / (3600 * 24));
  const hrs = Math.floor((seconds % (3600 * 24)) / 3600);
  if (days > 0) return `${days}d ${hrs}h`;
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hrs}h ${mins}m`;
}

// Giả lập lịch sử network bandwidth (7 ngày)
const mockNetLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const mockNetData = [6, 8, 5, 12, 9, 7, 10];

export default function ServerMonitor() {
  const [data, setData] = useState(null);
  const [cpuPercent, setCpuPercent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Lưu lịch sử để vẽ biểu đồ
  const [history, setHistory] = useState(() => {
    // Khởi tạo mảng rỗng (30 phần tử)
    const init = Array(30).fill(0);
    return { cpu: [...init], ram: [...init], labels: Array(30).fill('') };
  });

  const prevCpuRef = useRef(null);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/system", { method: "POST" });
      if (!res.ok) throw new Error("Failed to fetch system stats");
      const json = await res.json();
      
      let currentCpuPercent = 0;
      // Calculate CPU %
      if (prevCpuRef.current) {
        const prev = prevCpuRef.current;
        const current = json.cpu;
        const totalDiff = current.totalTicks - prev.totalTicks;
        const idleDiff = current.idleTicks - prev.idleTicks;
        
        if (totalDiff > 0) {
          currentCpuPercent = 100 - ((idleDiff / totalDiff) * 100);
          setCpuPercent(currentCpuPercent);
        }
      }
      prevCpuRef.current = json.cpu;
      
      const currentRamPercent = json.ram ? json.ram.usagePercent : 0;

      setData(json);
      
      // Update history
      setHistory(prev => {
        const newCpu = [...prev.cpu.slice(1), currentCpuPercent];
        const newRam = [...prev.ram.slice(1), currentRamPercent];
        const newLabels = [...prev.labels.slice(1), new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric", second: "numeric" })];
        return { cpu: newCpu, ram: newRam, labels: newLabels };
      });

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 2000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return <div className={styles.container}><div className={styles.loading}>Đang lấy thông tin hệ thống...</div></div>;
  }

  if (error) {
    return <div className={styles.container}><div className={styles.error}>Lỗi: {error}</div></div>;
  }

  const { ram, disk, uptime } = data;

  // Chart configs
  const lineChartData = {
    labels: history.labels,
    datasets: [
      {
        label: 'CPU %',
        data: history.cpu,
        borderColor: '#2a78d6',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
      },
      {
        label: 'RAM %',
        data: history.ram,
        borderColor: '#1baf7a',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false, // Tắt animation để cảm giác real-time mượt hơn
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { min: 0, max: 100, grid: { color: 'rgba(150, 150, 150, 0.1)' } },
      x: { grid: { display: false }, ticks: { maxTicksLimit: 5 } }
    }
  };

  const barChartData = {
    labels: mockNetLabels,
    datasets: [
      {
        label: 'GB',
        data: mockNetData,
        backgroundColor: '#2a78d6',
        borderRadius: 4
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { grid: { color: 'rgba(150, 150, 150, 0.1)' } },
      x: { grid: { display: false } }
    }
  };

  return (
    <div className={styles.container}>
      <AnimateOnView>
        {/* Top 4 Cards Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>CPU</p>
            <p className={styles.statValue}>{Math.round(cpuPercent)}%</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>RAM</p>
            <p className={styles.statValue}>{formatBytesGB(ram.used)} / {formatBytesGB(ram.total)} GB</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Disk</p>
            <p className={styles.statValue}>{formatBytesGB(disk.total - disk.free)} GB</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Uptime</p>
            <p className={styles.statValue}>{formatUptime(uptime)}</p>
          </div>
        </div>

        {/* Line Chart Section */}
        <div className={styles.chartLegend}>
          <span className={styles.legendItem}>
            <span className={styles.legendColor} style={{ background: '#2a78d6' }}></span>CPU %
          </span>
          <span className={styles.legendItem}>
            <span className={styles.legendColor} style={{ background: '#1baf7a' }}></span>RAM %
          </span>
        </div>
        <div className={styles.chartContainer}>
          <Line data={lineChartData} options={lineChartOptions} />
        </div>

        {/* Bar Chart Section */}
        <p className={styles.sectionTitle}>Network / bandwidth</p>
        <div className={styles.chartContainerBar}>
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </AnimateOnView>
    </div>
  );
}
