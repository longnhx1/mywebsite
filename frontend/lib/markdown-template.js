export function getNewPostTemplate() {
  const today = new Date().toISOString().split("T")[0];
  return `---
title: "Tiêu đề bài viết"
slug: "ten-bai-viet"
category: "know"
categoryLabel: "Kiến thức"
date: "${today}"
description: "Mô tả ngắn về bài viết..."
cover: ""
---

## Giới thiệu

Viết nội dung bài viết ở đây...

`;
}

export function getDraftKey(slug) {
  return slug ? `longn-draft-${slug}` : "longn-draft-new";
}
