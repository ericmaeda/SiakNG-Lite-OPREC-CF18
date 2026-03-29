import type { User, UserRole } from '@siakng/types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export interface LoginResponse {
  access_token: string;
  user?: {
    id: string
    email: string
    nama: string
    role: UserRole
  }
}

export interface ApiError {
  message: string;
  statusCode?: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  private removeToken(): void {
    localStorage.removeItem('access_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.access_token) {
      this.setToken(response.access_token);
    }
    
    return response;
  }

  async register(data: {
    email: string
    password: string
    nama: string
    role: UserRole
  }): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.access_token) {
      this.setToken(response.access_token);
    }
    
    return response;
  }

  logout(): void {
    this.removeToken();
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  setCurrentUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Mata Kuliah endpoints
  async getMataKuliah() {
    return this.request('/matakuliah');
  }

  async getMataKuliahById(id: string) {
    return this.request(`/matakuliah/${id}`);
  }

  async createMataKuliah(data: {
    kode: string
    nama: string
    sks: number
    semester: number
    dosenId: string
  }) {
    return this.request('/matakuliah', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMataKuliah(id: string, data: Partial<{
    kode: string
    nama: string
    sks: number
    semester: number
    dosenId: string
  }>) {
    return this.request(`/matakuliah/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteMataKuliah(id: string) {
    return this.request(`/matakuliah/${id}`, {
      method: 'DELETE',
    });
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const api = new ApiClient(API_BASE_URL);