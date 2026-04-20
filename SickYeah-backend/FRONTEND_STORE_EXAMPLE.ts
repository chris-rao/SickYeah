// 前端 Zustand Store 更新示例
// 将原来的本地状态改为调用后端 API

import { create } from 'zustand';
import { authAPI, restaurantAPI, reviewAPI } from './api'; // 假设 api.ts 在同一目录

interface User {
  id: string;
  username: string;
  avatar?: string;
}

interface Restaurant {
  id: string;
  name: string;
  address: string;
  recommendedDishes: string;
  description: string;
  image?: string;
  status: 'to-eat' | 'eaten';
  rating?: 'good' | 'bad';
}

interface AppState {
  user: User | null;
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
  
  // 认证方法
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
  
  // 餐厅方法
  fetchRestaurants: (params?: { status?: string; rating?: string }) => Promise<void>;
  fetchRestaurantById: (id: string) => Promise<Restaurant>;
  addRestaurant: (restaurant: Omit<Restaurant, 'id'>) => Promise<void>;
  updateRestaurantStatus: (id: string, status: 'to-eat' | 'eaten', rating?: 'good' | 'bad') => Promise<void>;
  
  // 评价方法
  createReview: (restaurantId: string, rating: 'good' | 'bad', comment?: string) => Promise<string>;
  uploadReviewPhotos: (reviewId: string, files: File[]) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  restaurants: [],
  loading: false,
  error: null,

  // 登录
  login: async (username: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const { data } = await authAPI.login({ username, password });
      
      // 保存 token 和用户信息
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      set({ user: data.user, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.error || '登录失败', loading: false });
      throw error;
    }
  },

  // 注册
  register: async (username: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const { data } = await authAPI.register({ username, password });
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      set({ user: data.user, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.error || '注册失败', loading: false });
      throw error;
    }
  },

  // 登出
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, restaurants: [] });
  },

  // 获取当前用户
  fetchCurrentUser: async () => {
    try {
      const { data } = await authAPI.getCurrentUser();
      set({ user: data.user });
    } catch (error) {
      // Token 无效，清除本地数据
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null });
    }
  },

  // 获取餐厅列表
  fetchRestaurants: async (params) => {
    try {
      set({ loading: true, error: null });
      const { data } = await restaurantAPI.getList(params);
      set({ restaurants: data.restaurants, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.error || '获取餐厅列表失败', loading: false });
      throw error;
    }
  },

  // 获取餐厅详情
  fetchRestaurantById: async (id: string) => {
    try {
      const { data } = await restaurantAPI.getById(id);
      return data.restaurant;
    } catch (error: any) {
      throw error;
    }
  },

  // 添加餐厅
  addRestaurant: async (restaurant) => {
    try {
      set({ loading: true, error: null });
      const { data } = await restaurantAPI.create(restaurant);
      
      // 更新本地状态
      set((state) => ({
        restaurants: [data.restaurant, ...state.restaurants],
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.error || '创建餐厅失败', loading: false });
      throw error;
    }
  },

  // 更新餐厅状态
  updateRestaurantStatus: async (id, status, rating) => {
    try {
      set({ loading: true, error: null });
      const { data } = await restaurantAPI.updateStatus(id, { status, rating });
      
      // 更新本地状态
      set((state) => ({
        restaurants: state.restaurants.map((r) =>
          r.id === id ? data.restaurant : r
        ),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.error || '更新状态失败', loading: false });
      throw error;
    }
  },

  // 创建评价
  createReview: async (restaurantId, rating, comment) => {
    try {
      const { data } = await reviewAPI.create({
        restaurantId,
        rating,
        comment
      });
      return data.review.id; // 返回评价 ID，用于后续上传照片
    } catch (error: any) {
      throw error;
    }
  },

  // 上传评价照片
  uploadReviewPhotos: async (reviewId, files) => {
    try {
      await reviewAPI.uploadPhotos(reviewId, files);
    } catch (error: any) {
      throw error;
    }
  },
}));
