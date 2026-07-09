/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static Export — build thành HTML tĩnh, serve bằng Nginx
  // Không cần Node.js runtime trên server = 0 MB RAM
  output: "export",

  // Tối ưu ảnh cho static export
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
