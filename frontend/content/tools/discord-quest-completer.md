---
title: "Discord Quest Completer"
slug: "discord-quest-completer"
date: "2026-07-09"
description: "Discord Quest Completer"
category: "tools"
categoryLabel: "Tools"
tags: ["Discord"]
---


**Repo:** https://github.com/markterence/discord-quest-completer
**Tác giả:** Mark Terence Tiglao
**Giấy phép:** MIT
**Nền tảng:** Windows (⭐ 659, 🍴 51 fork tính đến thời điểm viết bài)

## Đây là gì?

Discord Quest Completer là một ứng dụng desktop dành cho Windows, giúp bạn hoàn thành **Discord Quests** (nhiệm vụ trên Discord — thường yêu cầu chơi một tựa game được Discord "verify" trong khoảng 15 phút) mà **không cần cài đặt game thật**.

Thay vì tải về một game nặng vài chục GB chỉ để Discord nhận diện là bạn đang chơi, công cụ này tạo ra các file thực thi giả (dummy .exe) rất nhỏ (~250KB) giả lập tên tiến trình của game đó. Discord sẽ nhận diện các file này như thể game thật đang chạy, từ đó cho phép Quest tiến triển bình thường.

## Cách hoạt động

Discord phát hiện "Registered Games" chủ yếu dựa vào **tên file thực thi** (và đôi khi là thư mục chứa game). Discord Quest Completer khai thác cơ chế này bằng cách:

1. Lấy danh sách các game được Discord verify (qua API `applications/detectable`).
2. Tạo một file `.exe` giả mang đúng tên file mà Discord tìm kiếm.
3. Khi bạn "chạy" game giả này, Discord Rich Presence/Quest sẽ nhận diện như đang chơi game thật.

Ứng dụng được xây dựng bằng **Rust + Vue.js + Tauri**; phần dummy runner cho Windows viết bằng Rust/WinAPI để giữ kích thước nhỏ gọn.

## Vì sao người dùng thường dùng công cụ này?

- Hoàn thành Discord Quests mà không cần tải game dung lượng lớn.
- Tiết kiệm ổ đĩa, băng thông mạng (hữu ích với người có mạng/ổ cứng hạn chế).
- Không cần cài anti-cheat hoặc phần mềm đi kèm của game.
- Vẫn có thể "khoe" trạng thái đang chơi game trên Discord nếu muốn.

## Yêu cầu:
- Cần cài **WebView2** (đã có sẵn trên Windows 11; Windows cũ hơn có thể cần tải thủ công).
- Hiện chỉ hỗ trợ **Windows** (chưa hỗ trợ Linux/macOS).

## Cài đặt và sử dụng

1. Tải bản build sẵn từ trang [Releases](https://github.com/markterence/discord-quest-completer/releases), hoặc tự build từ mã nguồn.
2. Giải nén vào thư mục mà bạn có quyền ghi/thực thi (ứng dụng sẽ tạo file game giả trong chính thư mục đó).
3. Chạy file `discord-quest-completer.exe`
4. Tìm kiếm phần mềm, game,... mà bạn muốn làm nhiều quest:
5. Bấm nút `Play` để tools bắt đầu chạy và tạo 1 file .exe giả.
![image.png](/images/posts/image.png)

## Một vài lưu ý quan trọng

⚠️ **Đây là hành vi giả lập, không phải hack hay malware**, nhưng nó **lách qua cơ chế xác thực của Discord** để "đánh lừa" hệ thống Quest — điều này có thể vi phạm **Điều khoản dịch vụ (ToS) của Discord**. Tác giả dự án nêu rõ:

- Công cụ chỉ nhằm mục đích **giáo dục và sử dụng cá nhân**.
- Người dùng cần tự chịu trách nhiệm về mọi hậu quả (kể cả việc bị khóa tài khoản) khi sử dụng.
- Nhóm phát triển không chịu trách nhiệm cho bất kỳ thiệt hại nào phát sinh.
- Discord là thương hiệu của Discord Inc., dự án không có bất kỳ liên kết hay được Discord tài trợ/xác nhận.

Nếu bạn cân nhắc sử dụng, nên hiểu rõ rủi ro (khả năng bị Discord phát hiện và xử lý tài khoản) trước khi thử.

## Tech stack

| Thành phần | Công nghệ |
|---|---|
| Backend/desktop shell | Rust + Tauri |
| Giao diện | Vue.js + TypeScript |
| Dummy game runner | Rust (Win32 API) |

## Link tham khảo

- Repo GitHub: https://github.com/markterence/discord-quest-completer
- Trang Releases: https://github.com/markterence/discord-quest-completer/releases



