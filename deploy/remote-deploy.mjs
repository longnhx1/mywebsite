import { Client } from 'ssh2';

const conn = new Client();
const pwd = '462005';

const nginxSetupScript = `
# Chạy dưới quyền root (sudo)
export DEBIAN_FRONTEND=noninteractive
apt update && apt install -y nginx ufw

# Cấp quyền execute cho Nginx (www-data) có thể đọc được thư mục Documents
chmod +x /home/eve
chmod +x /home/eve/Documents

# Copy file config LAN đã được đồng bộ
cp /home/eve/Documents/myweb/deploy/nginx-lan.conf /etc/nginx/sites-available/myweb-lan
# Xóa tất cả các config cũ trong sites-enabled để tránh conflict
rm -f /etc/nginx/sites-enabled/*

# Tạo symlink mới
ln -sf /etc/nginx/sites-available/myweb-lan /etc/nginx/sites-enabled/myweb-lan

# Kiểm tra config và reload
nginx -t
systemctl reload nginx

# Đảm bảo ufw cho phép Nginx
ufw allow 'Nginx Full'
`;

console.log('Đang kết nối SSH tới eve@192.168.1.106...');

conn.on('ready', () => {
  console.log('✅ Đã kết nối SSH!');
  
  console.log('🌐 Đang cấu hình Nginx...');
  conn.exec('sudo -S bash -s', (err, stream) => {
    if (err) throw err;
    
    stream.on('close', (code) => {
      console.log('🎉 Setup hoàn tất! Code: ' + code);
      console.log('Bạn có thể truy cập web tại: http://192.168.1.106');
      conn.end();
    }).on('data', data => console.log('NGINX: ' + data))
      .stderr.on('data', data => console.error('NGINX: ' + data));
    
    // Gửi password vào cho sudo
    stream.write(pwd + '\n');
    // Gửi script vào bash
    stream.write(nginxSetupScript);
    stream.end();
  });
}).connect({
  host: '192.168.1.106',
  port: 22,
  username: 'eve',
  password: pwd,
  readyTimeout: 30000
});
