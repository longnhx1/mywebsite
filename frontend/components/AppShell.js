"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import WindowChrome from "./WindowChrome";
import TabBar, { getTabForPath } from "./TabBar";

export default function AppShell({ children }) {
  const pathname = usePathname();
  const currentTab = getTabForPath(pathname);
  const [crumb, setCrumb] = useState(currentTab?.crumb || "— home.tsx");

  useEffect(() => {
    const tab = getTabForPath(pathname);
    if (tab?.crumb) setCrumb(tab.crumb);
  }, [pathname]);

  return (
    <WindowChrome crumb={crumb}>
      <TabBar onCrumbChange={setCrumb} />
      <div className="stage">{children}</div>
      <footer>
        © longnhx — {new Date().getFullYear()}
      </footer>
    </WindowChrome>
  );
}
