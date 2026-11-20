---
title: "RAG là gì? Xây chatbot hỏi đáp tài liệu bằng Node.js trong 30 phút"
description: "Hướng dẫn từng bước xây dựng hệ thống Retrieval-Augmented Generation: chia nhỏ tài liệu, tạo embedding, tìm kiếm ngữ nghĩa và để LLM trả lời dựa trên dữ liệu của bạn."
date: 2026-10-31
category: tutorials
tags: [RAG, Node.js, embedding, chatbot, LLM]
key: rag-nodejs
hue: 190
author: Kendle Team
---

LLM rất giỏi ngôn ngữ nhưng không biết gì về tài liệu nội bộ của công ty bạn. **RAG (Retrieval-Augmented Generation)** giải quyết điều đó: trước khi trả lời, hệ thống *tìm* các đoạn tài liệu liên quan rồi đưa chúng cho LLM làm ngữ cảnh.

## Kiến trúc RAG trong 4 bước

1. **Chia nhỏ (chunking):** cắt tài liệu thành các đoạn 300–800 từ.
2. **Embedding:** chuyển mỗi đoạn thành vector và lưu lại.
3. **Truy xuất (retrieval):** khi có câu hỏi, tìm các đoạn có vector gần nhất.
4. **Sinh câu trả lời:** gửi câu hỏi kèm các đoạn tìm được cho LLM.

## Chuẩn bị

```bash
mkdir rag-demo && cd rag-demo
npm init -y
npm install dotenv
```

Bạn cần API key của một nhà cung cấp có cả API embedding và API chat. Lưu key vào file `.env` và **không bao giờ** commit file này lên GitHub.

## Bước 1: Chia nhỏ tài liệu

```js
function chunkText(text, size = 600, overlap = 100) {
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += size - overlap) {
    chunks.push(words.slice(i, i + size).join(' '));
  }
  return chunks;
}
```

Phần `overlap` (chồng lấn) giúp không mất ý khi một câu bị cắt ngang giữa hai đoạn.

## Bước 2: Tính độ tương đồng

Sau khi có vector cho từng đoạn (qua API embedding của nhà cung cấp bạn chọn), ta so sánh bằng **cosine similarity**:

```js
function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function topK(queryVec, store, k = 3) {
  return store
    .map((item) => ({ ...item, score: cosine(queryVec, item.vector) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
```

## Bước 3: Tạo prompt có ngữ cảnh

```js
function buildPrompt(question, chunks) {
  const context = chunks.map((c, i) => `[${i + 1}] ${c.text}`).join('\n\n');
  return `Chỉ trả lời dựa trên tài liệu dưới đây.
Nếu tài liệu không có thông tin, hãy nói "Tôi không tìm thấy thông tin này".
Trích dẫn số thứ tự đoạn tài liệu bạn dùng.

<tai_lieu>
${context}
</tai_lieu>

Câu hỏi: ${question}`;
}
```

## Bước 4: Ghép lại

Luồng hoàn chỉnh: nhận câu hỏi → embedding câu hỏi → `topK` → `buildPrompt` → gọi API chat → trả kết quả cho người dùng.

## Khi nào cần vector database?

Với vài trăm đoạn văn, lưu vector trong file JSON và tìm kiếm bằng vòng lặp như trên là đủ nhanh. Khi lên tới hàng chục nghìn đoạn, hãy cân nhắc các giải pháp chuyên dụng như **pgvector** (PostgreSQL), **Qdrant** hoặc **Chroma**.

## Mẹo nâng chất lượng

- **Làm sạch dữ liệu** trước khi chia nhỏ: bỏ header, footer, mục lục lặp lại.
- **Thêm metadata** (tên file, mục, ngày) cho từng đoạn để trích dẫn rõ ràng.
- **Đánh giá thường xuyên:** chuẩn bị 20–30 câu hỏi mẫu kèm đáp án đúng để kiểm tra mỗi khi thay đổi hệ thống.

> RAG không làm LLM "thông minh hơn", nhưng giúp nó **trung thực hơn** với dữ liệu của bạn.
