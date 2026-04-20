---
name: Node.js 后端部署上线
overview: 提供从代码完成到生产环境上线的完整部署流程,包括服务器配置、数据库设置、应用部署、域名配置、监控日志等关键步骤
todos:
  - id: server_setup
    content: 购买并配置云服务器,安装 Node.js、PM2、Nginx 等基础环境
    status: pending
  - id: database_setup
    content: 安装并配置数据库(MongoDB/MySQL),创建数据库和用户
    status: pending
  - id: code_deployment
    content: 克隆代码到服务器,配置环境变量,构建并启动应用
    status: pending
  - id: nginx_config
    content: 配置 Nginx 反向代理,设置静态文件服务
    status: pending
  - id: domain_ssl
    content: 配置域名解析,使用 Let's Encrypt 安装 SSL 证书
    status: pending
  - id: frontend_update
    content: 更新前端 API 地址,重新构建并部署前端
    status: pending
  - id: monitoring_logging
    content: 配置 PM2 监控、日志轮转和备份脚本
    status: pending
  - id: security_hardening
    content: 配置防火墙、禁用 root 登录、设置 fail2ban
    status: pending
  - id: testing
    content: 测试所有 API 接口,验证前后端联调正常
    status: pending
isProject: false
---

# Node.js 后端服务部署上线完整流程

假设你的 Node.js 后端代码已经开发完成,以下是从代码到上线的完整步骤。

## 一、代码准备与优化

### 1.1 项目结构检查

确保后端项目包含以下关键文件:

- `package.json` - 包含所有依赖和启动脚本
- `.env.example` - 环境变量模板文件
- `README.md` - 部署说明文档
- `.gitignore` - 排除 `node_modules`、`.env`、日志文件等

### 1.2 环境变量配置

创建 `.env.example` 文件,包含必需的环境变量:

```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=mongodb://localhost:27017/sickyeah
JWT_SECRET=your-secret-key
UPLOAD_DIR=./uploads
CORS_ORIGIN=https://yourdomain.com
```

### 1.3 启动脚本配置

在 `package.json` 中配置生产环境启动脚本:

```json
{
  "scripts": {
    "start": "node dist/index.js",
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "pm2:start": "pm2 start ecosystem.config.js",
    "pm2:stop": "pm2 stop ecosystem.config.js"
  }
}
```

### 1.4 代码质量检查

- 运行单元测试: `npm test`
- 代码检查: `npm run lint`
- 构建验证: `npm run build`

## 二、服务器环境准备

### 2.1 选择云服务器

常见选项:

- 阿里云 ECS / 腾讯云 CVM
- AWS EC2 / Google Cloud VM
- DigitalOcean Droplet
- Vultr / Linode

推荐配置(入门级):

- CPU: 2核
- 内存: 4GB
- 存储: 40GB SSD
- 操作系统: Ubuntu 22.04 LTS

### 2.2 服务器基础配置

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装必要工具
sudo apt install -y git curl wget vim ufw

# 配置防火墙
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp  # 后端端口
sudo ufw enable

# 创建非root用户
sudo adduser deployer
sudo usermod -aG sudo deployer
```

### 2.3 安装 Node.js 环境

```bash
# 使用 nvm 安装 Node.js (推荐)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20  # 或其他 LTS 版本
nvm use 20

# 验证安装
node -v
npm -v
```

### 2.4 安装 PM2 进程管理器

```bash
npm install -g pm2

# 配置 PM2 开机自启
pm2 startup
sudo env PATH=$PATH:/home/deployer/.nvm/versions/node/v20.x.x/bin pm2 startup systemd -u deployer --hp /home/deployer
```

## 三、数据库配置

### 3.1 MongoDB 安装(如使用 MongoDB)

```bash
# 导入公钥
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg

# 添加源
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# 安装
sudo apt update
sudo apt install -y mongodb-org

# 启动服务
sudo systemctl start mongod
sudo systemctl enable mongod

# 创建数据库用户
mongosh
use sickyeah
db.createUser({
  user: "sickyeah_user",
  pwd: "strong_password",
  roles: [{ role: "readWrite", db: "sickyeah" }]
})
```

### 3.2 MySQL 安装(如使用 MySQL)

```bash
sudo apt install -y mysql-server
sudo mysql_secure_installation

# 创建数据库和用户
sudo mysql
CREATE DATABASE sickyeah CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'sickyeah_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON sickyeah.* TO 'sickyeah_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3.3 云数据库(推荐用于生产环境)

使用托管数据库服务可以省去运维负担:

- 阿里云 RDS / MongoDB Atlas
- AWS RDS / DocumentDB
- 腾讯云 TencentDB

## 四、代码部署

### 4.1 使用 Git 部署

```bash
# 在服务器上克隆代码
cd /var/www
sudo mkdir sickyeah-backend
sudo chown deployer:deployer sickyeah-backend
cd sickyeah-backend

git clone https://github.com/your-username/sickyeah-backend.git .

# 创建 .env 文件
cp .env.example .env
vim .env  # 编辑生产环境配置
```

### 4.2 安装依赖与构建

```bash
# 安装生产依赖
npm ci --production=false

# 构建 TypeScript
npm run build

# 清理开发依赖(可选)
npm prune --production
```

### 4.3 配置 PM2

创建 `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'sickyeah-api',
    script: './dist/index.js',
    instances: 2,  // 使用 2 个实例
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G'
  }]
};
```

启动应用:

```bash
# 创建日志目录
mkdir -p logs

# 启动应用
pm2 start ecosystem.config.js

# 保存 PM2 配置
pm2 save

# 查看状态
pm2 status
pm2 logs
```

## 五、Nginx 反向代理配置

### 5.1 安装 Nginx

```bash
sudo apt install -y nginx
```

### 5.2 配置反向代理

创建 `/etc/nginx/sites-available/sickyeah-api`:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 静态文件(上传的图片等)
    location /uploads {
        alias /var/www/sickyeah-backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

启用配置:

```bash
sudo ln -s /etc/nginx/sites-available/sickyeah-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 六、域名与 HTTPS 配置

### 6.1 域名解析

在域名服务商处添加 DNS 记录:

- A 记录: `api.yourdomain.com` → 服务器 IP
- A 记录: `yourdomain.com` → 服务器 IP (前端)

### 6.2 配置 SSL 证书(Let's Encrypt)

```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 自动配置 HTTPS
sudo certbot --nginx -d api.yourdomain.com

# 测试自动续期
sudo certbot renew --dry-run
```

Certbot 会自动修改 Nginx 配置,添加 SSL 证书和 HTTP 重定向到 HTTPS。

## 七、前端配置更新

修改前端 [`src/config/api.ts`] 配置文件:

```typescript
export const API_BASE_URL = 
  process.env.NODE_ENV === 'production' 
    ? 'https://api.yourdomain.com'
    : 'http://localhost:3000';
```

重新构建并部署前端:

```bash
# 在前端项目中
npm run build

# 部署到静态托管(Vercel/Netlify)或服务器
```

## 八、监控与日志

### 8.1 PM2 监控

```bash
# 实时监控
pm2 monit

# 查看日志
pm2 logs sickyeah-api

# 查看资源占用
pm2 status
```

### 8.2 配置日志轮转

创建 `/etc/logrotate.d/sickyeah`:

```
/var/www/sickyeah-backend/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 deployer deployer
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 8.3 设置监控告警(可选)

集成第三方监控服务:

- PM2 Plus (官方监控)
- Sentry (错误追踪)
- Datadog / New Relic (APM)

## 九、备份策略

### 9.1 数据库定时备份

创建备份脚本 `/home/deployer/backup.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/deployer/backups"

# MongoDB 备份
mongodump --uri="mongodb://user:pass@localhost:27017/sickyeah" \
  --out="$BACKUP_DIR/mongo_$DATE"

# 压缩
tar -czf "$BACKUP_DIR/mongo_$DATE.tar.gz" "$BACKUP_DIR/mongo_$DATE"
rm -rf "$BACKUP_DIR/mongo_$DATE"

# 删除 7 天前的备份
find $BACKUP_DIR -type f -mtime +7 -delete
```

配置定时任务:

```bash
chmod +x /home/deployer/backup.sh
crontab -e
# 添加: 每天凌晨 2 点备份
0 2 * * * /home/deployer/backup.sh
```

### 9.2 上传备份到云存储

使用阿里云 OSS、AWS S3 等存储服务保存异地备份。

## 十、CI/CD 自动化部署(可选)

### 10.1 使用 GitHub Actions

创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/sickyeah-backend
            git pull origin main
            npm ci
            npm run build
            pm2 reload ecosystem.config.js
```

### 10.2 配置 Webhook 部署

在服务器上安装 webhook 服务,监听 Git 推送事件自动部署。

## 十一、性能优化建议

### 11.1 启用 Gzip 压缩

在 Nginx 配置中添加:

```nginx
gzip on;
gzip_types text/plain application/json application/javascript text/css;
gzip_min_length 1000;
```

### 11.2 配置缓存策略

- 静态资源使用 CDN 加速
- API 响应添加适当的 Cache-Control 头
- 使用 Redis 缓存热点数据

### 11.3 数据库优化

- 创建必要的索引
- 定期分析慢查询
- 考虑读写分离(高并发场景)

## 十二、安全加固

### 12.1 服务器安全

```bash
# 禁用 root SSH 登录
sudo vim /etc/ssh/sshd_config
# 设置: PermitRootLogin no
sudo systemctl restart sshd

# 配置 fail2ban 防暴力破解
sudo apt install -y fail2ban
```

### 12.2 应用安全

- 使用环境变量管理敏感信息
- 实施 CORS 白名单
- 添加请求频率限制(rate limiting)
- 输入验证和 SQL 注入防护
- 定期更新依赖包: `npm audit fix`

## 部署检查清单

- 服务器环境配置完成(Node.js、数据库、Nginx)
- 代码拉取并构建成功
- 环境变量正确配置
- PM2 启动应用成功
- Nginx 反向代理配置正确
- 域名解析生效
- HTTPS 证书配置成功
- 前端 API 地址更新
- 数据库连接正常
- 日志正常输出
- 监控系统正常
- 备份脚本配置
- 防火墙规则配置
- 测试所有 API 接口
- 压力测试(可选)

## 常见问题处理

### 应用启动失败

```bash
# 查看详细日志
pm2 logs sickyeah-api --lines 100

# 检查端口占用
sudo lsof -i :3000

# 检查环境变量
pm2 env 0
```

### Nginx 502 错误

- 检查后端服务是否运行: `pm2 status`
- 检查端口配置是否一致
- 查看 Nginx 错误日志: `sudo tail -f /var/log/nginx/error.log`

### 数据库连接失败

- 检查数据库服务状态
- 验证连接字符串和凭证
- 检查防火墙规则

## 替代部署方案

### Serverless 部署

使用 Vercel、Netlify Functions 或云函数服务,适合低流量场景:

- 优点: 自动扩容、按需付费、零运维
- 缺点: 冷启动、执行时间限制、WebSocket 支持有限

### Docker 容器化部署

创建 `Dockerfile` 和 `docker-compose.yml`,使用容器编排:

- 优点: 环境一致性、易于迁移、便于扩展
- 需要: Docker、Docker Compose 或 Kubernetes 知识

### PaaS 平台部署

使用 Heroku、Railway、Render 等平台:

- 优点: 简单快速、内置 CI/CD、管理方便
- 缺点: 成本较高、定制性受限

