#!/bin/bash
# ===================================================
# Script cài đặt VPS Debian cho longn.dev (Static Site)
# Chạy với quyền root: sudo bash setup-vps.sh
# ===================================================

set -e

echo "🚀 Bắt đầu cài đặt VPS cho longn.dev..."

# ---- 1. Cập nhật hệ thống ----
echo "📦 Cập nhật hệ thống..."
apt update && apt upgrade -y

# ---- 2. Cài đặt packages cần thiết ----
echo "📦 Cài đặt packages..."
apt install -y curl git nginx certbot python3-certbot-nginx ufw fail2ban unattended-upgrades

# ---- 3. Cài Node.js (chỉ cần để build, không chạy runtime) ----
echo "📦 Cài đặt Node.js (dùng để build)..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
apt install -y nodejs

# ---- 4. Firewall (UFW) ----
echo "🔒 Cấu hình firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 'Nginx Full'
ufw --force enable

# ---- 5. SSH Hardening ----
echo "🔒 Tăng cường bảo mật SSH..."
sed -i 's/#PermitRootLogin yes/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
sed -i 's/PermitRootLogin yes/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart sshd

# ---- 6. Auto Security Updates ----
echo "🔒 Cấu hình auto security updates..."
dpkg-reconfigure -plow unattended-upgrades

# ---- 7. Fail2ban ----
echo "🔒 Cấu hình Fail2ban..."
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = ssh
logpath = %(sshd_log)s
maxretry = 3

[nginx-http-auth]
enabled = true
EOF
systemctl restart fail2ban

# ---- 8. Tạo user cho ứng dụng ----
echo "👤 Tạo user 'deploy'..."
if ! id "deploy" &>/dev/null; then
    adduser --disabled-password --gecos "" deploy
    usermod -aG sudo deploy
    mkdir -p /home/deploy/.ssh
    cp /root/.ssh/authorized_keys /home/deploy/.ssh/
    chown -R deploy:deploy /home/deploy/.ssh
    chmod 700 /home/deploy/.ssh
    chmod 600 /home/deploy/.ssh/authorized_keys
fi

echo ""
echo "====================================================="
echo "✅ Cài đặt cơ bản hoàn tất!"
echo ""
echo "Bước tiếp theo (chạy thủ công):"
echo ""
echo "1. Clone project:"
echo "   su - deploy"
echo "   git clone https://github.com/longnhx1/mywebsite.git /home/deploy/myweb"
echo ""
echo "2. Build static site:"
echo "   cd /home/deploy/myweb/frontend"
echo "   npm install"
echo "   npm run build"
echo "   # → HTML tĩnh sẽ ở thư mục out/"
echo ""
echo "3. Copy Nginx config:"
echo "   sudo cp deploy/nginx.conf /etc/nginx/sites-available/longn.dev"
echo "   sudo ln -s /etc/nginx/sites-available/longn.dev /etc/nginx/sites-enabled/"
echo "   sudo rm -f /etc/nginx/sites-enabled/default"
echo "   sudo nginx -t && sudo systemctl reload nginx"
echo ""
echo "4. SSL (thay domain thật):"
echo "   sudo certbot --nginx -d longn.dev -d www.longn.dev"
echo ""
echo "📝 Để cập nhật bài viết:"
echo "   1. Tạo file .md mới trong content/posts/"
echo "   2. cd frontend && npm run build"
echo "   3. Nginx tự serve file mới → xong!"
echo "====================================================="
