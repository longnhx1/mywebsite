import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import { SITE_HOST, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";
import Script from "next/script";

export const metadata = {
  title: {
    default: SITE_TITLE,
    template: "%s",
  },
  description:
    "Không gian riêng của Long — ghi lại quá trình học, chia sẻ kiến thức, tools và phần mềm bổ ích.",
  keywords: [
    SITE_HOST,
    "blog",
    "sinh viên IT",
    "hệ thống thông tin",
    "portfolio",
    "lập trình",
    "kiến thức kỹ thuật",
  ],
  authors: [{ name: "Long N.", url: SITE_URL }],
  creator: "Long N.",
  openGraph: {
    title: SITE_TITLE,
    description: "Ghi lại quá trình học, chia sẻ những gì học được.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: "Ghi lại quá trình học, chia sẻ những gì học được.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
};

const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.setAttribute("data-theme","dark")}}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="vi" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script id="theme-script" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
