---
title: "Machine Learning cho người mới: 5 khái niệm cốt lõi phải nắm"
description: "Dữ liệu huấn luyện, mô hình, overfitting, học có giám sát và đánh giá mô hình: nền móng để bạn hiểu mọi bài viết AI khác, giải thích bằng ví dụ đời thường."
date: 2026-10-24
category: machine-learning
tags: [machine learning, cơ bản, overfitting, dữ liệu]
key: ml-basics
hue: 225
author: Kendle Team
---

Machine Learning (học máy) là nền tảng của gần như mọi ứng dụng AI hiện đại. Bạn không cần giỏi toán để hiểu những ý tưởng chính. Hãy bắt đầu với 5 khái niệm sau.

## 1. Học từ ví dụ thay vì viết luật

Lập trình truyền thống: con người viết luật → máy làm theo. Machine Learning: con người đưa **ví dụ** → máy tự tìm ra luật.

Muốn máy nhận biết email rác? Thay vì liệt kê hàng nghìn từ khóa, ta đưa cho nó 100.000 email đã gắn nhãn "rác" hoặc "không rác". Mô hình tự học ra các dấu hiệu.

## 2. Dữ liệu huấn luyện quyết định tất cả

> "Garbage in, garbage out": dữ liệu rác thì kết quả cũng rác.

Một mô hình chỉ tốt bằng dữ liệu nó được học. Nếu dữ liệu ảnh mèo chỉ toàn mèo trắng, mô hình có thể không nhận ra mèo đen. Dữ liệu cần **đủ nhiều, đa dạng và chính xác**.

## 3. Ba kiểu học chính

| Kiểu học | Cách hoạt động | Ví dụ |
|---|---|---|
| **Có giám sát** | Học từ dữ liệu đã gắn nhãn | Dự đoán giá nhà, lọc thư rác |
| **Không giám sát** | Tự tìm nhóm/cấu trúc trong dữ liệu | Phân nhóm khách hàng |
| **Tăng cường** | Học qua thử – sai và phần thưởng | AI chơi cờ, robot tự đi |

## 4. Overfitting: học vẹt

Hãy tưởng tượng một học sinh thuộc lòng đáp án đề thi năm ngoái nhưng không hiểu bài. Gặp đề mới là bí. Đó chính là **overfitting**: mô hình nhớ dữ liệu huấn luyện quá kỹ nên không áp dụng được cho dữ liệu mới.

Cách phòng tránh phổ biến:

- Dùng thêm dữ liệu, đa dạng hơn.
- Giữ mô hình đơn giản vừa đủ.
- Luôn kiểm tra trên dữ liệu mà mô hình **chưa từng thấy**.

## 5. Đánh giá mô hình đúng cách

Dữ liệu thường được chia thành 3 phần:

- **Train (70%)**: để mô hình học.
- **Validation (15%)**: để tinh chỉnh.
- **Test (15%)**: chỉ dùng một lần ở cuối, như kỳ thi thật.

Đừng chỉ nhìn vào **độ chính xác (accuracy)**. Với bài toán phát hiện gian lận, nơi 99% giao dịch là hợp lệ, một mô hình luôn trả lời "hợp lệ" cũng đạt 99%, nhưng hoàn toàn vô dụng. Hãy xem thêm *precision* và *recall*.

## Bước tiếp theo

Nếu muốn thực hành, hãy thử **scikit-learn** (Python) với các bộ dữ liệu mẫu có sẵn. Chỉ khoảng 10 dòng code là bạn đã huấn luyện được mô hình đầu tiên.
