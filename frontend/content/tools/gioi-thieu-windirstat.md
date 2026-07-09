---
title: WinDirStat – Công cụ phân tích và dọn dẹp dung lượng ổ đĩa cho Windows
slug: gioi-thieu-windirstat
category: tools
categoryLabel: Tools
date: '2026-07-09'
description: >-
  Tìm hiểu về WinDirStat, phần mềm miễn phí, mã nguồn mở giúp trực quan hóa
  dung lượng ổ đĩa Windows bằng treemap, hỗ trợ tìm và dọn file lớn nhanh chóng.
cover: ''
tags:
  - apps
  - windows
  - utility
---

## Giới thiệu

**WinDirStat** (viết tắt của Windows Directory Statistics) là phần mềm miễn phí, mã nguồn mở, giúp bạn xem trực quan ổ cứng đang bị "ăn" dung lượng ở đâu. Thay vì phải tự bấm vào từng thư mục để dò, WinDirStat quét toàn bộ ổ đĩa và hiển thị kết quả bằng **treemap** — mỗi file/thư mục là một ô màu, ô càng lớn thì file càng chiếm nhiều dung lượng.

Trang chủ: https://windirstat.net
![image.webp](/images/posts/image.webp)

## Cách hoạt động

Sau khi quét xong, WinDirStat hiển thị 3 khung nhìn đồng bộ với nhau:

- **Directory List**: danh sách thư mục dạng cây, sắp xếp theo dung lượng.
- **Extension List**: liệt kê theo loại file (đuôi mở rộng), mỗi loại có một màu riêng.
- **Treemap**: bản đồ hình chữ nhật màu sắc, click vào ô nào là biết ngay file/thư mục đó nằm ở đâu và nặng bao nhiêu.

<!-- 📷 ẢNH 2: cận cảnh phần treemap để thấy rõ các ô màu -->

## Tính năng nổi bật

- Quét ổ đĩa nội bộ, ổ ngoài và cả ổ mạng.
- Có bản portable, không cần cài đặt.
- Tìm file trùng lặp theo hash, xem dung lượng logic vs vật lý.
- Tích hợp thao tác dọn dẹp: xóa file, mở trong Explorer, dọn Recycle Bin, chạy Disk Cleanup...
- Hỗ trợ dark mode, đa ngôn ngữ, tích hợp menu chuột phải trong Explorer.
- Hoàn toàn không tự động xóa gì cả — bạn luôn là người quyết định.

## Cài đặt

Có thể cài qua nhiều cách khác nhau tùy thói quen:

- Microsoft Store (tự động cập nhật)
- `winget install -e --id WinDirStat.WinDirStat`
- `choco install windirstat`
- `scoop install extras/windirstat`
- Hoặc tải trực tiếp file `.msi`/`.zip` tại trang [Download](https://windirstat.net/download.html)

## Giấy phép

WinDirStat phát hành theo giấy phép **GPL-2.0**, miễn phí sử dụng, có thể xem và đóng góp mã nguồn trên GitHub.

## Link tham khảo

- Trang chủ: https://windirstat.net
- Trang tải về: https://windirstat.net/download.html
- GitHub: https://github.com/windirstat/windirstat
