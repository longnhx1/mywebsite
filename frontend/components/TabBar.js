"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { name: "Home", ext: ".tsx", path: "/", crumb: "— home.tsx" },
  { name: "Blog", ext: ".md", path: "/blog", crumb: "— blog.md" },
  { name: "Projects", ext: ".json", path: "/projects", crumb: "— projects.json" }
];

const dashboardTab = { name: "Dashboard", ext: ".admin", path: "/dashboard", crumb: "— dashboard.admin" };

export function getTabForPath(pathname) {
  if (pathname.startsWith("/dashboard/edit")) {
    return { crumb: "— editor.md" };
  }
  const tab = tabs.find((t) =>
    t.path === "/" ? pathname === "/" : pathname.startsWith(t.path)
  );
  if (tab) return tab;
  if (pathname.startsWith(dashboardTab.path)) return dashboardTab;
}

export default function TabBar({ onCrumbChange }) {
  const pathname = usePathname();

  return (
    <div className="tabbar" role="tablist" aria-label="Điều hướng chính">
      {tabs.map((tab) => {
        const isActive =
          tab.path === "/"
            ? pathname === "/"
            : pathname.startsWith(tab.path);

        return (
          <Link
            key={tab.path}
            href={tab.path}
            className={`tab${isActive ? " active" : ""}`}
            role="tab"
            aria-selected={isActive}
            onClick={() => onCrumbChange && onCrumbChange(tab.crumb)}
          >
            <span className="dice"></span>
            {tab.name}
            <span className="ext">{tab.ext}</span>
          </Link>
        );
      })}
    </div>
  );
}

export { tabs };
