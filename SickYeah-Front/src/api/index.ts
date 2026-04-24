import { http } from '@/utils/http';

// 认证 API
export const authAPI = {
  // 注册
  register: (data: { username: string; password: string; avatar?: string }) =>
    http.post('/auth/register', data),
  
  // 登录
  login: (data: { username: string; password: string }) =>
    http.post('/auth/login', data),
  
  // 获取当前用户
  getCurrentUser: () => http.get('/auth/me'),
};

// 餐厅 API
export const restaurantAPI = {
  // 获取餐厅列表
  getList: (params?: { status?: string; rating?: string }) =>
    http.get('/restaurants', { params }),
  
  // 获取餐厅详情
  getById: (id: string) => http.get(`/restaurants/${id}`),
  
  // 创建餐厅
  create: (data: {
    name: string;
    address: string;
    recommendedDishes?: string;
    description?: string;
    image?: string;
    status?: 'to-eat' | 'eaten';
  }) => http.post('/restaurants', data),
  
  // 更新餐厅
  update: (id: string, data: any) => http.put(`/restaurants/${id}`, data),
  
  // 更新餐厅状态
  updateStatus: (
    id: string,
    data: { status: string; rating?: 'good' | 'bad'; comment?: string }
  ) =>
    http.patch(`/restaurants/${id}/status`, data),
  
  // 删除餐厅
  delete: (id: string) => http.delete(`/restaurants/${id}`),
};

// 评价 API
export const reviewAPI = {
  // 上传餐厅照片
  uploadPhotos: (restaurantId: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('photos', file);
    });
    return http.post(`/restaurants/${restaurantId}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  // 获取餐厅的评价
  getByRestaurant: (restaurantId: string) =>
    http.get(`/reviews/restaurant/${restaurantId}`),
};
