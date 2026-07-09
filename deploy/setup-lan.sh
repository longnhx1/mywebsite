#!/bin/bash
# ===================================================
# Cài đặt nhẹ cho VPS LAN — KHÔNG tắt SSH password
# Chạy trên VPS: bash setup-lan.sh
# ===================================================

set -e

echo "🚀 Cài đặt Nginx cho longnhx (LAN)..."

sudo apt update
sudo apt install -y nginx curl git

# Thư mục serve static site
sudo mkdir -p /var/www/longnhx
sudo chown -R "$USER":www-data /var/www/longnhx
sudo chmod -R 775 /var/www/longnhx

# Nginx config
sudo cp nginx-lan.conf /etc/nginx/sites-available/longnhx
sudo ln -sf /etc/nginx/sites-available/longnhx /etc/nginx/sites-enabled/longnhx
sudo rm -f /etc/nginx/sites-enabled/default

sudo nginx -t
sudo systemctl enable nginx
sudo systemctl reload nginx

echo ""
echo "✅ Nginx đã sẵn sàng tại http://192.168.1.106:3080"
echo "   Document root: /var/www/longnhx"
echo ""
echo "Tiếp theo: chạy deploy từ máy Windows:"
echo "   cd deploy && npm run deploy"
