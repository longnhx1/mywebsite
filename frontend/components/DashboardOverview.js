import React from "react";
import styles from "./DashboardOverview.module.css";
import AnimateOnView from "./AnimateOnView";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
);

export default function DashboardOverview({ stats }) {
  return (
    <div className={styles.overview}>
      <AnimateOnView>
        <div className={styles.header}>
          <h2>Tổng quan</h2>
          <p className={styles.subtitle}>Tóm tắt trạng thái hiện tại của hệ thống</p>
        </div>
      </AnimateOnView>

      <AnimateOnView delay={100}>
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </AnimateOnView>

      <AnimateOnView delay={200}>
        <div className={styles.activitySection}>
          <div className={styles.sectionHeader}>
            <h3>Website Analytics</h3>
            <span className={styles.badge}>Mock Data</span>
          </div>
          <p className={styles.analyticsDesc}>
            Khu vực này chuẩn bị sẵn cho việc tích hợp Umami hoặc Plausible sau này. Hiện tại đang hiển thị dữ liệu giả định.
          </p>
          <div className={styles.chartContainer}>
            <Line 
              data={{
                labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
                datasets: [{
                  label: 'Page Views',
                  data: [120, 190, 150, 280, 210, 350, 420],
                  borderColor: '#2a78d6',
                  backgroundColor: 'rgba(42, 120, 214, 0.1)',
                  borderWidth: 2,
                  pointRadius: 4,
                  pointBackgroundColor: '#2a78d6',
                  fill: true,
                  tension: 0.4
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { 
                  y: { beginAtZero: true, grid: { color: 'rgba(150, 150, 150, 0.1)' } },
                  x: { grid: { display: false } }
                }
              }}
            />
          </div>
        </div>
      </AnimateOnView>
    </div>
  );
}
