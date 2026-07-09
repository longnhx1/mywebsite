"use client";

// Component: Terminal — Đoạn code giả lập với hiệu ứng gõ từng dòng

import { useEffect, useState } from "react";

const LINES = [
  {
    parts: [
      { t: "eve@longnhx", c: "kw" },
      { t: ":", c: "" },
      { t: "~", c: "str" },
      { t: "$ whoami" },
    ],
  },
  { parts: [{ t: "Nguyễn Huỳnh Long (eve)" }] },
  {
    parts: [
      { t: "eve@longnhx", c: "kw" },
      { t: ":", c: "" },
      { t: "~", c: "str" },
      { t: "$ cat contact.txt" },
    ],
  },
  {
    parts: [
      { t: "Discord: ", c: "tag-syntax" },
      { t: "https://discord.gg/NankzV8mRw", c: "str terminal-link", href: "https://discord.gg/NankzV8mRw" },
    ],
  },
  {
    parts: [
      { t: "Facebook: ", c: "tag-syntax" },
      { t: "https://www.facebook.com/longnhk5/", c: "str terminal-link", href: "https://www.facebook.com/longnhk5/" },
    ],
  },
  {
    parts: [
      { t: "Email: ", c: "tag-syntax" },
      { t: "nguyeenhuynhlong@gmail.com", c: "str terminal-link", href: "mailto:nguyeenhuynhlong@gmail.com" },
    ],
  },
  {
    parts: [
      { t: "eve@longnhx", c: "kw" },
      { t: ":", c: "" },
      { t: "~", c: "str" },
      { t: "$ " },
    ],
  },
];

function renderLine(line) {
  return line.parts.map((part, i) => {
    if (part.href) {
      return (
        <a key={i} href={part.href} className={part.c} target="_blank" rel="noopener noreferrer">
          {part.t}
        </a>
      );
    }
    return part.c ? (
      <span key={i} className={part.c}>
        {part.t}
      </span>
    ) : (
      <span key={i}>{part.t}</span>
    );
  });
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
