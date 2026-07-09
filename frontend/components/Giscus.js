"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

const GISCUS_CONFIG = {
  repo: "longnhx1/mywebsite",
  repoId: "R_kgDOTTSxAA",
  category: "General",
  categoryId: "DIC_kwDOTTSxAM4DA1lH",
};

const isConfigured =
  GISCUS_CONFIG.repoId.length > 0 && GISCUS_CONFIG.categoryId.length > 0;

export default function Giscus({ slug }) {
  const ref = useRef(null);
  const { theme } = useTheme();
  const giscusTheme = theme === "dark" ? "dark_dimmed" : "light";

  useEffect(() => {
    if (!isConfigured || !ref.current) return;

    ref.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", GISCUS_CONFIG.repo);
    script.setAttribute("data-repo-id", GISCUS_CONFIG.repoId);
    script.setAttribute("data-category", GISCUS_CONFIG.category);
    script.setAttribute("data-category-id", GISCUS_CONFIG.categoryId);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", giscusTheme);
    script.setAttribute("data-lang", "vi");
    script.setAttribute("data-loading", "lazy");
    script.crossOrigin = "anonymous";
    script.async = true;

    ref.current.appendChild(script);
  }, [slug, giscusTheme]);

  if (!isConfigured) {
    return (
      <div className="giscus-container giscus-placeholder">
        <p>
          Bình luận sẽ được bật qua <strong>Giscus</strong> (GitHub
          Discussions). Cấu hình tại <code>components/Giscus.js</code> — lấy{" "}
          <code>repoId</code> và <code>categoryId</code> từ{" "}
          <a
            href="https://giscus.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            giscus.app
          </a>
          .
        </p>
      </div>
    );
  }

  return <div className="giscus-container" ref={ref} />;
}
