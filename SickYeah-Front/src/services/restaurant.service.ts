import http from '../utils/http';

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  recommendedDishes?: string;
  description?: string;
  image?: string;
  status: 'to-eat' | 'eaten' | 'liked';
  rating?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  reviews?: Review[];
}

export interface Review {
  id: string;
  content: string;
  userId: string;
  restaurantId: string;
  createdAt: string;
  photos?: ReviewPhoto[];
  user?: {
    id: string;
    username: string;
    avatar: string;
  };
}

export interface ReviewPhoto {
  id: string;
  url: string;
  reviewId: string;
}

export interface GetRestaurantsParams {
  status?: 'to-eat' | 'eaten' | 'liked';
  rating?: string;
}

export interface CreateRestaurantData {
  name: string;
  address: string;
  recommendedDishes?: string;
  description?: string;
  image?: string;
  status?: 'to-eat' | 'eaten' | 'liked';
}

export interface UpdateRestaurantData {
  name?: string;
  address?: string;
  recommendedDishes?: string;
  description?: string;
  image?: string;
}

export interface UpdateRestaurantStatusData {
  status: 'to-eat' | 'eaten' | 'liked';
  rating?: string;
}

export interface RestaurantsResponse {
  restaurants: Restaurant[];
}

export interface RestaurantResponse {
  restaurant: Restaurant;
}

export interface DeleteRestaurantResponse {
  message: string;
}

class RestaurantService {
  async getRestaurants(params?: GetRestaurantsParams): Promise<RestaurantsResponse> {
    return http.get<RestaurantsResponse>('/restaurants', { params });
  }

  async getRestaurantById(id: string): Promise<RestaurantResponse> {
    return http.get<RestaurantResponse>(`/restaurants/${id}`);
  }

  async createRestaurant(data: CreateRestaurantData): Promise<RestaurantResponse> {
    return http.post<RestaurantResponse>('/restaurants', data);
  }

  async updateRestaurant(id: string, data: UpdateRestaurantData): Promise<RestaurantResponse> {
    return http.put<RestaurantResponse>(`/restaurants/${id}`, data);
  }

  async updateRestaurantStatus(
    id: string,
    data: UpdateRestaurantStatusData
  ): Promise<RestaurantResponse> {
    return http.patch<RestaurantResponse>(`/restaurants/${id}/status`, data);
  }

  async deleteRestaurant(id: string): Promise<DeleteRestaurantResponse> {
    return http.delete<DeleteRestaurantResponse>(`/restaurants/${id}`);
  }
}

export const restaurantService = new RestaurantService();
export default restaurantService;
