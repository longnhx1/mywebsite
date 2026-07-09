#!/bin/bash
# Cài DuckDNS updater trên VPS — cập nhật IP public tự động
# Biến môi trường: DUCKDNS_DOMAIN, DUCKDNS_TOKEN

set -e

DOMAIN="${DUCKDNS_DOMAIN:-longnhx}"
TOKEN="${DUCKDNS_TOKEN:-}"

if [ -z "$TOKEN" ]; then
  echo "❌ Thiếu DUCKDNS_TOKEN"
  echo "   1. Đăng ký tại https://www.duckdns.org (Google/GitHub)"
  echo "   2. Tạo subdomain → copy token"
  echo "   3. Thêm vào deploy/.env.deploy rồi chạy: npm run setup-duckdns"
  exit 1
fi

INSTALL_DIR="$HOME/duckdns"
mkdir -p "$INSTALL_DIR"

cat > "$INSTALL_DIR/duck.sh" << EOF
#!/bin/bash
echo url="https://www.duckdns.org/update?domains=${DOMAIN}&token=${TOKEN}&ip=" | curl -s -k -o ${INSTALL_DIR}/duck.log -K -
EOF

chmod 700 "$INSTALL_DIR/duck.sh"
"$INSTALL_DIR/duck.sh"
RESULT=$(cat "$INSTALL_DIR/duck.log")

if [ "$RESULT" = "OK" ]; then
  echo "✅ DuckDNS cập nhật thành công: ${DOMAIN}.duckdns.org"
else
  echo "⚠️  DuckDNS response: $RESULT"
fi

# Cron mỗi 5 phút
CRON_LINE="*/5 * * * * $INSTALL_DIR/duck.sh >/dev/null 2>&1"
(crontab -l 2>/dev/null | grep -v "duckdns/duck.sh"; echo "$CRON_LINE") | crontab -

echo "✅ Cron đã cài — cập nhật IP mỗi 5 phút"
echo "   Domain: https://${DOMAIN}.duckdns.org"
