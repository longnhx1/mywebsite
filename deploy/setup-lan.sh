#!/bin/bash
# ===================================================
# Cài đặt nhẹ cho VPS LAN — KHÔNG tắt SSH password
# Chạy trên VPS: bash setup-lan.sh
# ===================================================

set -e

echo "🚀 Cài đặt Nginx cho longn.dev (LAN)..."

sudo apt update
sudo apt install -y nginx curl git

# Thư mục serve static site
sudo mkdir -p /var/www/longn.dev
sudo chown -R "$USER":www-data /var/www/longn.dev
sudo chmod -R 775 /var/www/longn.dev

# Nginx config
sudo cp nginx-lan.conf /etc/nginx/sites-available/longn.dev
sudo ln -sf /etc/nginx/sites-available/longn.dev /etc/nginx/sites-enabled/longn.dev
sudo rm -f /etc/nginx/sites-enabled/default

sudo nginx -t
sudo systemctl enable nginx
sudo systemctl reload nginx

echo ""
echo "✅ Nginx đã sẵn sàng tại http://192.168.1.106:3080"
echo "   Document root: /var/www/longn.dev"
echo ""
echo "Tiếp theo: chạy deploy từ máy Windows:"
echo "   cd deploy && npm run deploy"
