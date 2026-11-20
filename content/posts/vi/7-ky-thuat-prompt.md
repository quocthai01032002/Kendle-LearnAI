---
title: "7 kỹ thuật prompt giúp AI trả lời chính xác hơn ngay hôm nay"
description: "Những kỹ thuật viết prompt đã được kiểm chứng: giao vai trò, cung cấp ngữ cảnh, ví dụ mẫu, chia nhỏ bước… kèm prompt mẫu bạn có thể sao chép và dùng ngay."
date: 2026-11-07
category: prompt-engineering
tags: [prompt, ChatGPT, Claude, năng suất]
key: prompt-techniques
hue: 300
author: Kendle Team
---

Cùng một mô hình AI, người biết viết prompt có thể nhận được câu trả lời tốt hơn hẳn. Dưới đây là 7 kỹ thuật đơn giản, áp dụng được cho ChatGPT, Claude, Gemini và hầu hết các LLM khác.

## 1. Nói rõ bạn là ai và cần gì

AI không biết bối cảnh của bạn. Hãy nói rõ: bạn là ai, kết quả dùng để làm gì, người đọc là ai.

```text
Tôi là trưởng phòng marketing của một chuỗi cà phê tại Đà Nẵng.
Hãy viết 3 tiêu đề email giới thiệu menu mùa đông
cho khách hàng thân thiết, độ tuổi 25–35, giọng thân thiện.
```

## 2. Cung cấp ví dụ mẫu (few-shot)

Thay vì mô tả phong cách, hãy **cho AI xem 1–3 ví dụ**. Mô hình bắt chước mẫu rất tốt.

```text
Chuyển phản hồi khách hàng thành nhãn cảm xúc.
"Giao hàng nhanh, đóng gói đẹp" → Tích cực
"Áo bị lỗi đường may" → Tiêu cực
"Sản phẩm tạm ổn, giá hơi cao" → ?
```

## 3. Chia nhỏ nhiệm vụ phức tạp

Đừng yêu cầu "viết kế hoạch kinh doanh" trong một lần. Hãy đi từng bước: phân tích thị trường → đối thủ → chiến lược → ngân sách. Mỗi bước, bạn kiểm tra và điều chỉnh trước khi đi tiếp.

## 4. Yêu cầu suy nghĩ từng bước

Với bài toán logic, tính toán hoặc phân tích, thêm câu *"Hãy suy luận từng bước trước khi đưa ra kết luận"* giúp mô hình ít sai hơn đáng kể.

## 5. Quy định định dạng đầu ra

Nói rõ bạn muốn bảng, danh sách, JSON hay đoạn văn, và độ dài bao nhiêu.

```text
Trả lời dưới dạng bảng 3 cột: Công cụ | Ưu điểm | Giá.
Tối đa 5 dòng. Không giải thích thêm.
```

## 6. Dùng dấu phân cách cho dữ liệu

Khi dán tài liệu dài, hãy bọc trong thẻ để AI phân biệt rõ đâu là chỉ dẫn, đâu là dữ liệu:

```text
Tóm tắt hợp đồng dưới đây thành 5 ý chính, chú ý các điều khoản phạt.

<hop_dong>
...dán nội dung hợp đồng...
</hop_dong>
```

## 7. Cho phép AI nói "không biết"

Thêm câu: *"Nếu không chắc chắn, hãy nói rõ là bạn không biết thay vì đoán."* Chỉ một dòng này đã giảm đáng kể việc AI bịa thông tin.

## Mẫu prompt tổng hợp

Kết hợp tất cả kỹ thuật trên thành một khung dùng lại được:

```text
[Vai trò & bối cảnh] Tôi là ... , cần ... để ...
[Nhiệm vụ] Hãy ...
[Dữ liệu] <du_lieu> ... </du_lieu>
[Ví dụ] ...
[Định dạng] Trả lời dưới dạng ..., tối đa ... từ.
[Ràng buộc] Nếu không chắc, hãy nói rõ.
```

> **Mẹo:** Lưu các prompt hiệu quả vào một file ghi chú. Sau vài tuần, bạn sẽ có một "thư viện prompt" riêng giúp tiết kiệm hàng giờ mỗi tuần.
