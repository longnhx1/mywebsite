#!/bin/bash
# ===================================================
# Script cập nhật website trên VPS
# Chạy mỗi khi thêm/sửa bài viết
# Usage: bash deploy/update.sh
# ===================================================

set -e

echo "📥 Pulling latest changes..."
git pull origin main

echo "📦 Installing dependencies..."
cd frontend
npm install --production=false

echo "🔨 Building static site..."
npm run build

echo "✅ Done! Website đã cập nhật."
echo "   HTML tĩnh ở: frontend/out/"
echo "   Nginx sẽ tự serve file mới."
