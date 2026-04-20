import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  avatar: string;
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
  setUser: (user: User | null) => void;
  clearUser: () => void;
  addRestaurant: (restaurant: Omit<Restaurant, 'id'>) => void;
  updateRestaurantStatus: (id: string, status: 'to-eat' | 'eaten', rating?: 'good' | 'bad') => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  restaurants: [
    {
      id: '1',
      name: '超级汉堡王',
      address: '美食街123号',
      recommendedDishes: '芝士厚牛堡',
      description: '听说这里的汉堡比脸还大！',
      status: 'to-eat',
    },
    {
      id: '2',
      name: '脆皮炸鸡店',
      address: '快乐路456号',
      recommendedDishes: '秘制大鸡腿',
      description: '外焦里嫩，汁水丰富。',
      status: 'eaten',
      rating: 'good',
    }
  ],
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  addRestaurant: (restaurant) => set((state) => ({
    restaurants: [...state.restaurants, { ...restaurant, id: Math.random().toString(36).substr(2, 9) }]
  })),
  updateRestaurantStatus: (id, status, rating) => set((state) => ({
    restaurants: state.restaurants.map((r) => r.id === id ? { ...r, status, rating } : r)
  })),
}));
