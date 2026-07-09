"use client";

// Component: WordCounter — Mini-tool đếm từ & thời gian đọc
// Hoạt động hoàn toàn ở client (không gửi data lên server)

import { useState } from "react";

export default function WordCounter() {
  const [text, setText] = useState("");

  // Tính toán thống kê
  const trimmed = text.trim();
  const wordCount = trimmed.length > 0 ? trimmed.split(/\s+/).length : 0;
  const charCount = text.length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="tool-box">
      <p className="eyebrow">thử ngay — mini-tool đếm từ</p>
      <h3 style={{ marginBottom: "10px" }}>Đếm số từ &amp; thời gian đọc</h3>
      <textarea
        id="toolInput"
        placeholder="Dán đoạn văn vào đây để xem thống kê..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="tool-out">
        <div>
          <b>{wordCount}</b>từ
        </div>
        <div>
          <b>{charCount}</b>ký tự
        </div>
        <div>
          <b>{readTime} phút</b>thời gian đọc
        </div>
      </div>
    </div>
  );
}
