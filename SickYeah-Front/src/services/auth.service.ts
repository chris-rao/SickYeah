import http from '../utils/http';

export interface RegisterData {
  username: string;
  password: string;
  avatar?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface CurrentUserResponse {
  user: User;
}

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    return http.post<AuthResponse>('/auth/register', data);
  }

  async login(data: LoginData): Promise<AuthResponse> {
    return http.post<AuthResponse>('/auth/login', data);
  }

  async getCurrentUser(): Promise<CurrentUserResponse> {
    return http.get<CurrentUserResponse>('/auth/me');
  }

  logout() {
    localStorage.removeItem('token');
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

export const authService = new AuthService();
export default authService;
