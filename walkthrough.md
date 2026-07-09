# longn.dev — Walkthrough

## Tổng quan

Website cá nhân **code editor theme**, chuyển từ phác thảo HTML sang **Next.js Static Export** + **Markdown files**. Deploy trên Debian VPS chỉ bằng Nginx, **0 MB RAM** cho website.

### Thay đổi kiến trúc quan trọng

Ban đầu plan dùng **Strapi CMS** (headless), nhưng phát hiện VPS (i5-3320M, 4GB RAM) đã chạy nhiều service (Pi-hole, Code-server, Syncthing, Minecraft). Strapi sẽ ngốn thêm ~700MB-1.3GB RAM → swap → chậm toàn bộ.

**Giải pháp**: Chuyển sang **Markdown files** + **Static Export**:
- Viết bài bằng `.md` (soạn qua Code-server có sẵn trên VPS)
- Build thành HTML tĩnh → Nginx serve trực tiếp
- Kết quả: **0 MB RAM** thay vì ~1.3GB

---

## Cấu trúc dự án

```
myweb/
├── frontend/
│   ├── app/
│   │   ├── layout.js             # Root layout (fonts, SEO)
│   │   ├── globals.css           # CSS design system
│   │   ├── page.js               # Home (đọc stats từ Markdown)
│   │   ├── blog/
│   │   │   ├── page.js           # Blog listing
│   │   │   └── [slug]/page.js    # Blog detail (Markdown render)
│   │   ├── projects/page.js      # Projects + mini-tools
│   │   └── dashboard/page.js     # Dashboard mockup
│   ├── components/
│   │   ├── AppShell.js           # Window + TabBar + Footer
│   │   ├── BlogContent.js        # Client-side filter
│   │   ├── PostContent.js        # Markdown → HTML renderer
│   │   └── ...                   # WindowChrome, TabBar, Terminal...
│   ├── content/
│   │   └── posts/                # 📝 Bài viết Markdown
│   │       ├── toi-uu-vong-lap.md
│   │       ├── do-an-phan-tich-thiet-ke.md
│   │       ├── ai-ho-tro-lap-trinh.md
│   │       └── chuyen-di-va-code.md
│   ├── lib/
│   │   └── posts.js              # Đọc & parse Markdown
│   └── next.config.mjs           # output: 'export'
├── deploy/
│   ├── nginx.conf                # Serve static HTML
│   ├── setup-vps.sh              # Cài đặt VPS Debian
│   └── update.sh                 # Script cập nhật bài viết
└── README.md
```

---

## Kết quả kiểm tra

### Home — Đếm bài viết tự động từ Markdown
![Homepage](file:///C:/Users/yamiyamiyami/.gemini/antigravity-ide/brain/ddb67feb-ccbc-4fde-8959-bee24097dc71/homepage_1783571776072.png)

✅ Stats tự đếm từ file `.md` (4 bài viết)

### Blog Detail — Markdown render hoàn chỉnh
![Blog detail](file:///C:/Users/yamiyamiyami/.gemini/antigravity-ide/brain/ddb67feb-ccbc-4fde-8959-bee24097dc71/blog_detail_page_1783571803570.png)

✅ Headings, code blocks, inline code, bold, blockquote  
✅ 0 hydration errors  
✅ Footer đã cập nhật: "nội dung viết bằng Markdown"

### Static Build — 10/10 trang
```
Route (app)
├ ○ /
├ ○ /blog
├ ● /blog/toi-uu-vong-lap
├ ● /blog/do-an-phan-tich-thiet-ke
├ ● /blog/ai-ho-tro-lap-trinh
├ ● /blog/chuyen-di-va-code
├ ○ /dashboard
└ ○ /projects
```

### Demo Navigation
![Navigation recording](file:///C:/Users/yamiyamiyami/.gemini/antigravity-ide/brain/ddb67feb-ccbc-4fde-8959-bee24097dc71/static_site_test_1783571763326.webp)

---

## Workflow viết bài mới

```bash
# 1. Tạo file Markdown
vim frontend/content/posts/bai-viet-moi.md

# 2. Thêm frontmatter + nội dung
---
title: "Tiêu đề bài viết"
slug: "bai-viet-moi"
category: "know"
categoryLabel: "Kiến thức"
date: "2025-07-09"
description: "Mô tả ngắn"
---
Nội dung ở đây...
![ảnh minh họa](/images/posts/anh.jpg)

# 3. Build
cd frontend && npm run build

# 4. Nginx tự serve file HTML mới → xong!
```

---

## So sánh RAM

| Plan | RAM thêm |
|---|---|
| ❌ Strapi + Next.js SSR | ~700 MB - 1.3 GB |
| ✅ Static HTML + Nginx | **~0 MB** |

---

## Bước tiếp theo (tùy chọn)

- **Giscus**: Comment bằng GitHub account (iframe, 0 RAM)
- **SEO**: Sitemap.xml, robots.txt, OG images
- **Deploy**: Khi bạn sẵn sàng, chạy `sudo bash deploy/setup-vps.sh` trên Debian
