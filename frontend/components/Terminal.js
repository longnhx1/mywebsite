"use client";

// Component: Terminal — Đoạn code giả lập với hiệu ứng gõ từng dòng

import { useEffect, useState } from "react";

const LINES = [
  { parts: [{ t: "const", c: "kw" }, { t: " author = {" }] },
  {
    parts: [
      { t: "  role: ", c: "" },
      { t: '"student"', c: "str" },
      { t: "," },
    ],
  },
  {
    parts: [
      { t: "  major: ", c: "" },
      { t: '"information systems"', c: "str" },
      { t: "," },
    ],
  },
  {
    parts: [
      { t: "  writes: [", c: "" },
      { t: '"blog"', c: "tag-syntax" },
      { t: ", " },
      { t: '"tutorial"', c: "tag-syntax" },
      { t: ", " },
      { t: '"story"', c: "tag-syntax" },
      { t: "]," },
    ],
  },
  {
    parts: [
      { t: "  status: ", c: "" },
      { t: '"đang học mỗi ngày"', c: "str" },
    ],
  },
  { parts: [{ t: "}" }] },
];

function renderLine(line) {
  return line.parts.map((part, i) =>
    part.c ? (
      <span key={i} className={part.c}>
        {part.t}
      </span>
    ) : (
      <span key={i}>{part.t}</span>
    )
  );
}

export default function Terminal() {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount >= LINES.length) return;

    const timer = setTimeout(() => {
      setVisibleCount((c) => c + 1);
    }, visibleCount === 0 ? 400 : 180);

    return () => clearTimeout(timer);
  }, [visibleCount]);

  return (
    <div className="terminal terminal-animated" aria-hidden="true">
      {LINES.map((line, index) => (
        <div
          key={index}
          className={`ln${index < visibleCount ? " ln-visible" : ""}`}
          style={{ transitionDelay: `${index * 60}ms` }}
        >
          <span className="no">{index + 1}</span>
          <span>{renderLine(line)}</span>
        </div>
      ))}
      {visibleCount < LINES.length && (
        <span className="terminal-cursor" aria-hidden="true" />
      )}
    </div>
  );
}
