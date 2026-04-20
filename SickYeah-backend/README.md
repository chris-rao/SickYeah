# SickYeah Backend API

餐厅打卡应用的后端服务 - 基于 Express + SQLite + Prisma

## 技术栈

- **Node.js** + **TypeScript**
- **Express.js** - Web 框架
- **Prisma** - ORM
- **SQLite** - 轻量级数据库
- **JWT** - 用户认证
- **Multer** - 文件上传
- **bcryptjs** - 密码加密

## 项目结构

```
backend/
├── src/
│   ├── controllers/         # 控制器层
│   │   ├── auth.controller.ts
│   │   ├── restaurant.controller.ts
│   │   └── review.controller.ts
│   ├── routes/              # 路由定义
│   │   ├── auth.routes.ts
│   │   ├── restaurant.routes.ts
│   │   └── review.routes.ts
│   ├── middlewares/         # 中间件
│   │   ├── auth.middleware.ts
│   │   └── upload.middleware.ts
│   ├── utils/               # 工具函数
│   │   └── prisma.ts
│   └── index.ts             # 入口文件
├── prisma/
│   ├── schema.prisma        # 数据库模型定义
│   └── migrations/          # 数据库迁移文件
├── uploads/                 # 上传文件存储
├── .env                     # 环境变量
├── package.json
└── README.md
```

## 快速开始

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 配置环境变量

复制 `.env.example` 并重命名为 `.env`，然后根据需要修改配置：

```bash
cp .env.example .env
```

主要环境变量说明：

```env
DATABASE_URL="file:./dev.db"                          # 数据库路径
JWT_SECRET="your-super-secret-jwt-key-change-this"    # ⚠️ 必须修改！
PORT=4000                                             # 服务器端口
NODE_ENV=development                                  # 运行环境
CORS_ORIGIN="http://localhost:3000"                   # 前端地址
```

⚠️ **生产环境请务必修改 `JWT_SECRET` 为强随机密钥**

### 3. 初始化数据库

数据库已经初始化完成。如需重新初始化：

```bash
npm run prisma:migrate
npm run prisma:generate
```

### 4. 启动开发服务器

```bash
npm run dev
```

服务器将在 `http://localhost:4000` 启动。

### 5. 测试 API

```bash
node test-api.js
```

## API 文档

### 认证相关

#### 注册用户
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123",
  "avatar": "https://example.com/avatar.png" // 可选
}
```

响应：
```json
{
  "user": {
    "id": "uuid",
    "username": "testuser",
    "avatar": "https://..."
  },
  "token": "jwt_token"
}
```

#### 登录
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

#### 获取当前用户
```http
GET /api/auth/me
Authorization: Bearer {token}
```

### 餐厅相关

所有餐厅接口都需要认证（需要在 Header 中携带 JWT token）。

#### 获取餐厅列表
```http
GET /api/restaurants
Authorization: Bearer {token}

# 可选查询参数：
?status=to-eat     # 筛选待食餐厅
?status=eaten      # 筛选已食餐厅
?rating=good       # 筛选好评餐厅
?rating=bad        # 筛选避雷餐厅
```

#### 获取餐厅详情
```http
GET /api/restaurants/:id
Authorization: Bearer {token}
```

#### 创建餐厅（上报）
```http
POST /api/restaurants
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "超级汉堡王",
  "address": "美食街123号",
  "recommendedDishes": "芝士厚牛堡",
  "description": "听说这里的汉堡比脸还大！",
  "status": "to-eat",  // 可选: 'to-eat' | 'eaten'
  "image": "https://..." // 可选
}
```

#### 更新餐厅信息
```http
PUT /api/restaurants/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "新名字",
  "address": "新地址",
  // ... 其他字段
}
```

#### 更新餐厅状态（打卡）
```http
PATCH /api/restaurants/:id/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "eaten",
  "rating": "good"  // 可选: 'good' | 'bad'
}
```

#### 删除餐厅
```http
DELETE /api/restaurants/:id
Authorization: Bearer {token}
```

### 评价相关

#### 创建评价
```http
POST /api/reviews
Authorization: Bearer {token}
Content-Type: application/json

{
  "restaurantId": "uuid",
  "rating": "good",  // 'good' | 'bad'
  "comment": "非常好吃！" // 可选
}
```

#### 上传评价照片
```http
POST /api/reviews/:id/photos
Authorization: Bearer {token}
Content-Type: multipart/form-data

photos: [File, File, ...]  // 最多 10 张，每张最大 5MB
```

#### 获取餐厅的所有评价
```http
GET /api/reviews/restaurant/:restaurantId
Authorization: Bearer {token}
```

## 数据库模型

### User（用户）
- id - UUID
- username - 用户名（唯一）
- password - 加密密码
- avatar - 头像 URL
- createdAt - 创建时间
- updatedAt - 更新时间

### Restaurant（餐厅）
- id - UUID
- name - 餐厅名称
- address - 地址
- recommendedDishes - 推荐菜品
- description - 描述
- image - 主图
- status - 状态（'to-eat' | 'eaten'）
- rating - 评分（'good' | 'bad' | null）
- userId - 创建者 ID
- createdAt - 创建时间
- updatedAt - 更新时间

### Review（评价）
- id - UUID
- restaurantId - 餐厅 ID
- userId - 用户 ID
- rating - 评分（'good' | 'bad'）
- comment - 评论
- createdAt - 创建时间
- updatedAt - 更新时间

### ReviewPhoto（评价照片）
- id - UUID
- reviewId - 评价 ID
- photoUrl - 图片 URL
- createdAt - 创建时间

## 开发命令

```bash
# 开发模式（热重载）
npm run dev

# 编译 TypeScript
npm run build

# 生产模式
npm run start

# 生成 Prisma Client
npm run prisma:generate

# 运行数据库迁移
npm run prisma:migrate

# 打开 Prisma Studio（数据库可视化工具）
npm run prisma:studio
```

## 前端集成

前端需要：

1. **安装 axios**（或使用 fetch）
2. **配置 API 基础 URL**: `http://localhost:4000/api`
3. **处理 JWT Token**：
   - 登录后保存 token 到 localStorage
   - 每个请求在 Header 中携带：`Authorization: Bearer {token}`

示例代码：

```typescript
// api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
});

// 请求拦截器 - 自动添加 token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

```typescript
// 使用示例
import api from './api';

// 登录
const { data } = await api.post('/auth/login', {
  username: 'user',
  password: 'pass'
});
localStorage.setItem('token', data.token);

// 获取餐厅列表
const { data } = await api.get('/restaurants');

// 创建餐厅
const { data } = await api.post('/restaurants', {
  name: '餐厅名',
  address: '地址'
});
```

## 注意事项

1. **生产环境**：
   - 修改 `JWT_SECRET` 为强密码
   - 使用 PostgreSQL/MySQL 替代 SQLite
   - 配置 HTTPS
   - 配置正确的 CORS_ORIGIN

2. **文件上传**：
   - 支持格式：jpeg, jpg, png, gif, webp
   - 单文件最大 5MB
   - 文件存储在 `uploads/` 目录
   - 通过 `/uploads/filename` 访问

3. **数据隔离**：
   - 每个用户只能看到自己创建的餐厅
   - 餐厅和评价通过 userId 关联

## 测试

运行自动化测试：

```bash
node test-api.js
```

测试涵盖：
- ✅ 用户注册和登录
- ✅ JWT 认证
- ✅ 餐厅 CRUD
- ✅ 状态更新和评分
- ✅ 评价创建
- ✅ 数据筛选

## License

MIT
