"use client";

// Component: PostContent — Render nội dung Markdown thành HTML
// Dùng react-markdown với remark-gfm (hỗ trợ bảng, strikethrough, task list...)

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function PostContent({ content }) {
  if (!content) {
    return <p>Không có nội dung.</p>;
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Fix hydration: react-markdown mặc định bọc code block trong <p>,
        // nhưng HTML không cho phép <pre> nằm trong <p>.
        // Giải pháp: override cả <pre> và <code>
        pre({ children }) {
          return <pre className="code-block">{children}</pre>;
        },
        code({ className, children, ...props }) {
          // Nếu code nằm trong <pre> (code block), giữ nguyên
          // Nếu code inline (không có className), style riêng
          const isInline = !className;
          if (isInline) {
            return (
              <code className="inline-code" {...props}>
                {children}
              </code>
            );
          }
          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        // Custom render cho blockquote
        blockquote({ children }) {
          return <blockquote className="custom-quote">{children}</blockquote>;
        },
        // Custom render cho links — mở tab mới
        a({ href, children }) {
          return (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
