---
title: "Tối ưu vòng lặp trong xử lý dữ liệu lớn"
slug: "toi-uu-vong-lap"
category: "know"
categoryLabel: "Kiến thức"
date: "2025-07-02"
description: "Một vài mẹo nhỏ giúp giảm thời gian chạy khi làm việc với tập dữ liệu hàng triệu dòng."
cover: ""
---

## Giới thiệu

Khi làm việc với tập dữ liệu lớn (hàng triệu dòng), hiệu suất vòng lặp trở nên cực kỳ quan trọng. Bài viết này chia sẻ một vài mẹo nhỏ mình học được.

## 1. Tránh vòng lặp lồng nhau

Vòng lặp lồng nhau `O(n²)` là kẻ thù số một. Hãy cân nhắc dùng **hash map** để tra cứu:

```python
# ❌ Chậm — O(n²)
for item in list_a:
    for other in list_b:
        if item.id == other.id:
            process(item, other)

# ✅ Nhanh — O(n)
lookup = {item.id: item for item in list_b}
for item in list_a:
    if item.id in lookup:
        process(item, lookup[item.id])
```

## 2. Dùng Generator thay List

Khi không cần toàn bộ kết quả cùng lúc, generator tiết kiệm bộ nhớ:

```python
# ❌ Tốn bộ nhớ
results = [process(x) for x in huge_list]

# ✅ Tiết kiệm bộ nhớ
results = (process(x) for x in huge_list)
```

## 3. Vectorization với NumPy

Với dữ liệu số, NumPy nhanh hơn Python thuần rất nhiều:

```python
import numpy as np

# ❌ Python loop
total = sum(x ** 2 for x in data)

# ✅ NumPy vectorization (nhanh gấp 100x)
total = np.sum(np.array(data) ** 2)
```

## Kết luận

Tối ưu vòng lặp không khó, chỉ cần nhớ 3 nguyên tắc: **giảm complexity**, **tiết kiệm bộ nhớ**, và **dùng thư viện chuyên dụng**.
