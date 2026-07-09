// Cấu hình domain — đổi trong .env.production hoặc biến môi trường khi build

export const SITE_HOST =
  process.env.NEXT_PUBLIC_SITE_HOST || "longnhx.duckdns.org";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || `https://${SITE_HOST}`;

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "longnhx";

export const SITE_TITLE = `longnhx — nhật ký số`;
