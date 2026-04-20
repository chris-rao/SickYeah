// API 配置和封装
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

// 创建 axios 实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 自动添加 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 统一错误处理
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token 过期或无效，清除 token 并跳转到登录页
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 认证 API
export const authAPI = {
  // 注册
  register: (data: { username: string; password: string; avatar?: string }) =>
    api.post('/auth/register', data),
  
  // 登录
  login: (data: { username: string; password: string }) =>
    api.post('/auth/login', data),
  
  // 获取当前用户
  getCurrentUser: () => api.get('/auth/me'),
};

// 餐厅 API
export const restaurantAPI = {
  // 获取餐厅列表
  getList: (params?: { status?: string; rating?: string }) =>
    api.get('/restaurants', { params }),
  
  // 获取餐厅详情
  getById: (id: string) => api.get(`/restaurants/${id}`),
  
  // 创建餐厅
  create: (data: {
    name: string;
    address: string;
    recommendedDishes?: string;
    description?: string;
    image?: string;
    status?: 'to-eat' | 'eaten';
  }) => api.post('/restaurants', data),
  
  // 更新餐厅
  update: (id: string, data: any) => api.put(`/restaurants/${id}`, data),
  
  // 更新餐厅状态
  updateStatus: (id: string, data: { status: string; rating?: string }) =>
    api.patch(`/restaurants/${id}/status`, data),
  
  // 删除餐厅
  delete: (id: string) => api.delete(`/restaurants/${id}`),
};

// 评价 API
export const reviewAPI = {
  // 创建评价
  create: (data: {
    restaurantId: string;
    rating: 'good' | 'bad';
    comment?: string;
  }) => api.post('/reviews', data),
  
  // 上传评价照片
  uploadPhotos: (reviewId: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('photos', file);
    });
    return api.post(`/reviews/${reviewId}/photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // 获取餐厅的评价
  getByRestaurant: (restaurantId: string) =>
    api.get(`/reviews/restaurant/${restaurantId}`),
};

export default api;
