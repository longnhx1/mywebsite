"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function PostContent({ content }) {
  if (!content) {
    return <p>Không có nội dung.</p>;
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2({ children }) {
          const text = extractText(children);
          return <h2 id={slugify(text)}>{children}</h2>;
        },
        h3({ children }) {
          const text = extractText(children);
          return <h3 id={slugify(text)}>{children}</h3>;
        },
        pre({ children }) {
          return <pre className="code-block">{children}</pre>;
        },
        code({ className, children, ...props }) {
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
        blockquote({ children }) {
          return <blockquote className="custom-quote">{children}</blockquote>;
        },
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

function extractText(children) {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) {
    return children.map((c) => extractText(c)).join("");
  }
  if (children?.props?.children) return extractText(children.props.children);
  return "";
}
