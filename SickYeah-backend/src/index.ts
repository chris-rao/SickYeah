import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import restaurantRoutes from './routes/restaurant.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// 中间件
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // 允许无 origin 的请求（如 Postman、服务器端请求）
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('不允许的跨域请求来源'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'SickYeah API is running' });
});

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: '接口未找到' });
});

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('错误:', err);
  res.status(err.status || 500).json({
    error: err.message || '服务器内部错误'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
  console.log(`📱 前端地址: ${process.env.CORS_ORIGIN}`);
  console.log(`🗄️  数据库: SQLite`);
});
