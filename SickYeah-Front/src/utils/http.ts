import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

class HttpClient {
  private instance: AxiosInstance;
  private loadingCount = 0;

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        this.incrementLoading();
        
        const token = localStorage.getItem('token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
      },
      (error: AxiosError) => {
        this.decrementLoading();
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        this.decrementLoading();
        return response.data;
      },
      (error: AxiosError<ApiError>) => {
        this.decrementLoading();
        
        if (error.response) {
          const { status, data } = error.response;
          
          if (status === 401) {
            localStorage.removeItem('token');
            // 只有在非登录页面时才重定向
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
            return Promise.reject({
              message: data?.message || '用户名或密码错误',
              status,
            });
          }
          
          const errorMessage = data?.message || error.message || '请求失败';
          return Promise.reject({
            message: errorMessage,
            status,
            code: data?.code,
          });
        }
        
        if (error.code === 'ECONNABORTED') {
          return Promise.reject({
            message: '请求超时，请稍后重试',
          });
        }
        
        return Promise.reject({
          message: error.message || '网络错误，请检查您的网络连接',
        });
      }
    );
  }

  private incrementLoading() {
    this.loadingCount++;
    this.updateLoadingState(true);
  }

  private decrementLoading() {
    this.loadingCount = Math.max(0, this.loadingCount - 1);
    if (this.loadingCount === 0) {
      this.updateLoadingState(false);
    }
  }

  private updateLoadingState(isLoading: boolean) {
    window.dispatchEvent(
      new CustomEvent('http-loading', { detail: { isLoading } })
    );
  }

  public get<T = any>(url: string, config?: any): Promise<T> {
    return this.instance.get(url, config);
  }

  public post<T = any>(url: string, data?: any, config?: any): Promise<T> {
    return this.instance.post(url, data, config);
  }

  public put<T = any>(url: string, data?: any, config?: any): Promise<T> {
    return this.instance.put(url, data, config);
  }

  public patch<T = any>(url: string, data?: any, config?: any): Promise<T> {
    return this.instance.patch(url, data, config);
  }

  public delete<T = any>(url: string, config?: any): Promise<T> {
    return this.instance.delete(url, config);
  }
}

export const http = new HttpClient();
export default http;
