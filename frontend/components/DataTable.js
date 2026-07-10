import React, { useState } from "react";
import styles from "./DataTable.module.css";
import AnimateOnView from "./AnimateOnView";

export default function DataTable({ data, title, description, type }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <AnimateOnView>
        <div className={styles.header}>
          <div>
            <h2>{title}</h2>
            <p className={styles.description}>{description}</p>
          </div>
          <div className={styles.actions}>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </AnimateOnView>

      <AnimateOnView delay={100}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Thể loại</th>
                <th>Ngày đăng</th>
                <th className={styles.actionsCol}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={index}>
                    <td className={styles.titleCell}>
                      <span className={styles.titleText}>{item.title}</span>
                      <span className={styles.slugText}>/{item.slug}</span>
                    </td>
                    <td>
                      <span className={styles.badge}>{item.categoryLabel || item.category}</span>
                    </td>
                    <td className={styles.dateCell}>{item.dateShort}</td>
                    <td className={styles.actionsCol}>
                      <a href={`/dashboard/edit?type=${type}&slug=${item.slug}`} className={styles.editBtn}>
                        Sửa
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className={styles.emptyState}>
                    Không tìm thấy dữ liệu nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AnimateOnView>
    </div>
  );
}
