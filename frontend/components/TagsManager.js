import React, { useMemo } from "react";
import styles from "./TagsManager.module.css";
import AnimateOnView from "./AnimateOnView";

export default function TagsManager({ posts, toolsPosts }) {
  const { tagsMap, categoriesMap } = useMemo(() => {
    const allItems = [...posts, ...toolsPosts];
    const tMap = {};
    const cMap = {};

    allItems.forEach(item => {
      // Tags
      if (item.tags && Array.isArray(item.tags)) {
        item.tags.forEach(t => {
          tMap[t] = (tMap[t] || 0) + 1;
        });
      }
      
      // Categories
      if (item.categoryLabel) {
        cMap[item.categoryLabel] = (cMap[item.categoryLabel] || 0) + 1;
      }
    });

    return { 
      tagsMap: Object.entries(tMap).sort((a, b) => b[1] - a[1]),
      categoriesMap: Object.entries(cMap).sort((a, b) => b[1] - a[1])
    };
  }, [posts, toolsPosts]);

  return (
    <div className={styles.container}>
      <AnimateOnView>
        <div className={styles.header}>
          <h2>Thẻ & Danh mục</h2>
          <p className={styles.subtitle}>Quản lý và thống kê phân loại nội dung</p>
        </div>
      </AnimateOnView>

      <div className={styles.grid}>
        <AnimateOnView delay={100}>
          <div className={styles.card}>
            <h3>Danh mục (Categories)</h3>
            <p className={styles.desc}>Các chủ đề lớn của trang web</p>
            <div className={styles.list}>
              {categoriesMap.map(([cat, count]) => (
                <div key={cat} className={styles.listItem}>
                  <span className={styles.itemName}>📁 {cat}</span>
                  <span className={styles.itemCount}>{count} bài</span>
                </div>
              ))}
              {categoriesMap.length === 0 && <p className={styles.empty}>Chưa có danh mục nào.</p>}
            </div>
          </div>
        </AnimateOnView>

        <AnimateOnView delay={200}>
          <div className={styles.card}>
            <h3>Thẻ (Tags)</h3>
            <p className={styles.desc}>Thống kê tần suất sử dụng thẻ (Word Cloud)</p>
            <div className={styles.tagCloud}>
              {tagsMap.map(([tag, count]) => {
                // Calculate font size based on count (min 12px, max 24px)
                const maxCount = tagsMap[0]?.[1] || 1;
                const fontSize = Math.max(12, 12 + (count / maxCount) * 12);
                
                return (
                  <span 
                    key={tag} 
                    className={styles.tagItem}
                    style={{ fontSize: `${fontSize}px` }}
                    title={`${count} bài viết`}
                  >
                    #{tag}
                    <span className={styles.tagBadge}>{count}</span>
                  </span>
                );
              })}
              {tagsMap.length === 0 && <p className={styles.empty}>Chưa có thẻ nào.</p>}
            </div>
          </div>
        </AnimateOnView>
      </div>
    </div>
  );
}
