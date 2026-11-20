---
title: "LLM hoạt động như thế nào? Giải thích dễ hiểu cho người không chuyên"
description: "Từ token, embedding đến cơ chế attention: hiểu cách các mô hình ngôn ngữ lớn như ChatGPT, Claude hay Gemini tạo ra câu trả lời, và vì sao đôi khi chúng sai."
date: 2026-11-14
category: generative-ai
tags: [LLM, transformer, ChatGPT, Claude, cơ bản]
key: how-llms-work
featured: true
hue: 262
author: Kendle Team
---

Mỗi ngày hàng trăm triệu người trò chuyện với ChatGPT, Claude hay Gemini. Nhưng bên trong "hộp đen" đó thực sự diễn ra điều gì? Bài viết này giải thích cơ chế của **mô hình ngôn ngữ lớn (Large Language Model, LLM)** mà không cần một công thức toán nào.

## Ý tưởng cốt lõi: dự đoán từ tiếp theo

Về bản chất, một LLM làm một việc duy nhất: **đoán phần tiếp theo của văn bản**. Khi bạn gõ *"Thủ đô của Việt Nam là"*, mô hình tính xác suất cho hàng nghìn khả năng và chọn khả năng hợp lý nhất: *"Hà Nội"*.

Lặp lại việc này hàng trăm lần liên tiếp, mỗi lần thêm một mẩu chữ vào cuối, ta có được một đoạn văn hoàn chỉnh. Mọi khả năng "thông minh" của LLM, từ viết code đến tóm tắt tài liệu, đều sinh ra từ việc dự đoán này ở quy mô cực lớn.

> Một LLM không "tra cứu" câu trả lời. Nó *tạo ra* câu trả lời dựa trên các mẫu hình đã học từ dữ liệu.

## Bước 1: Token, cách máy "đọc" chữ

Máy tính không hiểu chữ cái, nó chỉ hiểu con số. Vì vậy văn bản được cắt thành các **token**: có thể là một từ, một phần của từ hoặc dấu câu.

| Văn bản | Token (minh họa) |
|---|---|
| `Hello world` | `Hello` · ` world` |
| `Trí tuệ nhân tạo` | `Tr` · `í` · ` tu` · `ệ` · ` nhân` · ` tạo` |

Tiếng Việt có dấu thường tốn **nhiều token hơn** tiếng Anh cho cùng một ý. Đó là lý do cùng một nội dung, dùng tiếng Việt có thể tốn chi phí API cao hơn.

## Bước 2: Embedding, biến từ thành tọa độ

Mỗi token được chuyển thành một **vector**: một dãy hàng nghìn con số, giống tọa độ trong một không gian nhiều chiều. Những từ có nghĩa gần nhau sẽ nằm gần nhau trong không gian đó: "vua" gần "hoàng hậu", "Hà Nội" gần "Sài Gòn".

## Bước 3: Attention, hiểu ngữ cảnh

Đây là phát minh quan trọng nhất của kiến trúc **Transformer** (2017). Cơ chế *attention* cho phép mỗi từ "nhìn" sang mọi từ khác trong câu để hiểu ngữ cảnh.

Ví dụ trong câu *"Con mèo không nhảy lên bàn vì **nó** quá mệt"*, attention giúp mô hình hiểu "nó" là con mèo, không phải cái bàn.

## Bước 4: Huấn luyện ở quy mô khổng lồ

Mô hình được cho đọc lượng văn bản tương đương hàng triệu cuốn sách. Mỗi lần đoán sai từ tiếp theo, các tham số (có thể lên tới hàng trăm tỷ) được điều chỉnh một chút. Sau đó là các giai đoạn tinh chỉnh với phản hồi của con người để mô hình trả lời hữu ích và an toàn hơn.

## Vì sao LLM đôi khi "bịa" thông tin?

Vì LLM tối ưu cho việc tạo ra văn bản **nghe hợp lý**, không phải văn bản **đúng sự thật**. Khi thiếu thông tin, nó vẫn có thể tạo ra một câu trả lời trôi chảy nhưng sai. Hiện tượng này gọi là **hallucination** (ảo giác).

Cách giảm thiểu:

- Cung cấp tài liệu gốc ngay trong prompt và yêu cầu trả lời *chỉ dựa trên tài liệu đó*.
- Yêu cầu mô hình trích dẫn nguồn và tự kiểm chứng các con số quan trọng.
- Dùng kỹ thuật **RAG** để kết nối mô hình với dữ liệu thật (xem bài hướng dẫn RAG của chúng tôi).

## Tóm tắt

1. LLM dự đoán token tiếp theo, lặp lại nhiều lần để tạo văn bản.
2. Token → embedding → attention là chuỗi xử lý cốt lõi.
3. Sức mạnh đến từ quy mô dữ liệu và số tham số.
4. LLM có thể sai một cách tự tin, nên luôn kiểm chứng thông tin quan trọng.
