// Cấu hình domain — đổi trong .env.production hoặc biến môi trường khi build

export const SITE_HOST =
  process.env.NEXT_PUBLIC_SITE_HOST || "longnhx.duckdns.org";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || `http://${SITE_HOST}`;

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "longn";

export const SITE_TITLE = `${SITE_NAME} — nhật ký số`;
