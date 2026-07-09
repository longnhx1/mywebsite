# longn.dev — Nhật ký số

Website cá nhân xây bằng **Next.js** (Static Export), serve bằng **Nginx** trên VPS Debian.

## Tech Stack

| Thành phần | Công nghệ |
|---|---|
| Frontend | Next.js (Static Export) |
| Nội dung | Markdown files (frontmatter) |
| Server | Nginx (serve HTML tĩnh) |
| SSL | Let's Encrypt (Certbot) |
| Bảo mật | UFW + Fail2ban + Security Headers |

> **RAM tiêu thụ: ~0 MB** — Website là HTML tĩnh, Nginx serve trực tiếp, không cần Node.js runtime.

## Cấu trúc

```
myweb/
├── frontend/
│   ├── app/                 # Next.js pages
│   ├── components/          # React components
│   ├── content/
│   │   └── posts/           # 📝 Bài viết Markdown
│   │       ├── bai-viet.md
│   │       └── ...
│   ├── lib/
│   │   └── posts.js         # Đọc & parse Markdown
│   └── public/
│       └── images/          # 🖼️ Ảnh cho bài viết
│           └── posts/
├── deploy/
│   ├── nginx.conf           # Nginx config
│   ├── setup-vps.sh         # Script cài VPS
│   └── update.sh            # Script cập nhật
└── README.md
```

## Chạy local

```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

## Viết bài mới

1. Tạo file `frontend/content/posts/ten-bai-viet.md`
2. Thêm frontmatter:
   ```yaml
   ---
   title: "Tiêu đề bài viết"
   slug: "ten-bai-viet"
   category: "know"          # "know" hoặc "exp"
   categoryLabel: "Kiến thức" # hoặc "Trải nghiệm"
   date: "2025-07-09"
   description: "Mô tả ngắn..."
   cover: ""
   ---
   ```
3. Viết nội dung Markdown bên dưới
4. Chèn ảnh: `![mô tả](/images/posts/ten-anh.jpg)`
5. Build: `npm run build`

## Deploy lên VPS

Code trên máy local, deploy một lệnh lên VPS:

```bash
# Lần đầu — cài dependency
cd frontend && npm install
cd ../deploy && npm install

# Mỗi lần sửa code / thêm bài viết
npm run deploy          # build + upload lên VPS
# hoặc nếu đã build sẵn:
npm run deploy:files    # chỉ upload
```

Cấu hình VPS trong `deploy/.env.deploy` (copy từ `.env.deploy.example`).

Website live: **https://longnhx.duckdns.org**

## License

MIT
