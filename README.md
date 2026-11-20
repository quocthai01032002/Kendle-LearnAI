# Kendle learnAI

Blog và tin tức AI song ngữ **Việt / Anh**, viết bằng **Node.js + Express + EJS**. Bài viết lưu bằng file Markdown, form liên hệ và newsletter gửi email qua SMTP. Không cần database.

## Tính năng

- Giao diện dark tech, responsive (375px → 1440px+), hỗ trợ bàn phím và `prefers-reduced-motion`
- Song ngữ: `/` (Tiếng Việt) và `/en` (English). Nút chuyển ngôn ngữ trỏ đúng bản dịch của từng bài
- Bài viết Markdown: highlight code, mục lục tự động, thời gian đọc, bài liên quan, chia sẻ, nút copy code
- Lọc theo chủ đề, phân trang, tìm kiếm toàn văn
- Form liên hệ + newsletter: validation từng trường, chống spam (honeypot + rate limit), gửi email SMTP và lưu bản sao vào `data/*.jsonl`
- SEO: meta/OG, `hreflang`, JSON-LD (WebSite, BlogPosting), `sitemap.xml`, `robots.txt`, RSS (`/rss.xml`, `/en/rss.xml`)
- Bảo mật: Helmet (CSP), gzip, cache tĩnh

## Chạy trên máy

```bash
npm install
cp .env.example .env   # rồi điền thông tin
npm run dev            # http://localhost:3000
```

## Viết bài mới

Tạo file `content/posts/vi/<slug>.md` (và bản tiếng Anh trong `content/posts/en/`):

```markdown
---
title: "Tiêu đề bài viết"
description: "Mô tả ngắn 1–2 câu (hiển thị trên thẻ bài và Google)."
date: 2026-11-20
category: generative-ai   # generative-ai | machine-learning | prompt-engineering | ai-tools | ai-ethics | tutorials
tags: [LLM, prompt]
key: ten-chung         # GIỐNG NHAU ở bản VI và EN để nút chuyển ngôn ngữ nối 2 bản
featured: false        # true = hiện ở mục "Nổi bật" trang chủ
hue: 260               # màu ảnh bìa tự sinh (0–360), bỏ trống = tự chọn
author: Kendle Team
draft: false           # true = ẩn bài
---

Nội dung Markdown…
```

Commit và push lên GitHub. Hostinger sẽ tự deploy lại.

## Push lên GitHub

1. Tạo repo mới (để trống, không thêm README) tại <https://github.com/new>, ví dụ `kendle-learnai`.
2. Trong thư mục dự án:

```bash
git remote add origin https://github.com/<tai-khoan>/kendle-learnai.git
git push -u origin main
```

## Deploy lên Hostinger (gói Business / Cloud, Node.js Web App)

> Tên các nút trong hPanel có thể thay đổi theo phiên bản. Các bước dưới đây theo luồng "Node.js Apps" của Hostinger.

1. **hPanel → Websites → Add website → Node.js Apps**.
2. Chọn **Import Git repository**, kết nối tài khoản GitHub và chọn repo `kendle-learnai`, nhánh `main`.
3. Cấu hình build:
   - Framework: **Express** (hoặc *Other*)
   - Node.js version: **20** hoặc **22**
   - Entry file: `server.js`
   - Install / build command: `npm install`
   - Start command: `npm start`
4. **Environment variables**: thêm các biến trong `.env.example`. Tối thiểu cần:
   - `NODE_ENV=production`
   - `SITE_URL=https://ten-mien-cua-ban.com`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_TO`, `CONTACT_EMAIL`
   - **Không** đặt `PORT` nếu Hostinger tự cấp cổng
5. Bấm **Deploy**. Sau khi chạy, gắn tên miền và bật SSL (miễn phí) trong hPanel.
6. Từ đó, mỗi lần `git push` lên `main` sẽ tự deploy lại (nếu bật auto-deploy).

### Email SMTP với Hostinger

1. hPanel → **Emails** → tạo hộp thư, ví dụ `hello@ten-mien.com`.
2. Dùng: `SMTP_HOST=smtp.hostinger.com`, `SMTP_PORT=465`, `SMTP_SECURE=true`, `SMTP_USER` là địa chỉ email đó, `SMTP_PASS` là mật khẩu hộp thư.
3. Khi chưa cấu hình SMTP, form vẫn hoạt động: dữ liệu được lưu vào `data/contacts.jsonl` và `data/subscribers.jsonl`, đồng thời in ra log.

> Lưu ý: thư mục `data/` có thể bị xóa khi deploy lại. Hãy coi email là kênh nhận dữ liệu chính, file JSONL chỉ là bản sao dự phòng.

## Cấu trúc thư mục

```
server.js              Điểm khởi chạy Express
src/config.js          Cấu hình & biến môi trường
src/i18n/              Từ điển giao diện vi.json / en.json
src/lib/posts.js       Đọc & render Markdown, tìm kiếm, bài liên quan
src/lib/mailer.js      Gửi email SMTP + lưu bản sao
src/routes/            Route trang và API
views/                 Template EJS (+ partials/)
public/                CSS, JS, logo, favicon
content/posts/{vi,en}/ Bài viết Markdown
```

## Kiểm tra nhanh sau deploy

- `/healthz` trả về `{"ok":true}`
- `/sitemap.xml` liệt kê đúng tên miền thật (từ `SITE_URL`)
- Gửi thử form liên hệ và kiểm tra hộp thư `MAIL_TO`
