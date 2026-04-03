import type { User, UserRole, MataKuliah, Kelas, IrsEnrollment, IrsSummary, IrsEnrollmentResponse } from '@siakng/types'

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

  isAuthenticated(): boolean {
    return !!this.getToken();
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
    return this.request<MataKuliah[]>('/matakuliah');
  }

  async getMataKuliahById(id: string) {
    return this.request<MataKuliah>(`/matakuliah/${id}`);
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
    dosisId: string
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

  // Dosen endpoints
  async getDosen() {
    return this.request('/dosen');
  }

  // ============ IRS (Study Plan) Endpoints ============

  // Get student's IRS (Isian Rencana Studi)
  async getMyIrs(query?: { semester?: number; tahunAkademik?: string }): Promise<IrsSummary> {
    const params = new URLSearchParams();
    if (query?.semester) params.append('semester', query.semester.toString());
    if (query?.tahunAkademik) params.append('tahunAkademik', query.tahunAkademik);
    const queryString = params.toString();
    return this.request<IrsSummary>(`/irs/my-irs${queryString ? `?${queryString}` : ''}`);
  }

  // Enroll to a kelas
  async enrollToKelas(data: {
    kelasId: string;
    semester: number;
    tahunAkademik: string;
  }): Promise<IrsEnrollmentResponse> {
    return this.request<IrsEnrollmentResponse>('/irs/enroll', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Unenroll from a kelas
  async unenrollFromKelas(kelasId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/irs/unenroll/${kelasId}`, {
      method: 'DELETE',
    });
  }

  // Get all kelas for a mata kuliah (with enrollment status)
  async getKelasByMataKuliah(mataKuliahId: string): Promise<Kelas[]> {
    return this.request<Kelas[]>(`/irs/kelas/mata-kuliah/${mataKuliahId}`);
  }

  // Get single kelas details
  async getKelasById(kelasId: string): Promise<Kelas> {
    return this.request<Kelas>(`/irs/kelas/${kelasId}`);
  }

  // ============ DOSEN Endpoints for IRS ============

  // Get dosen's classes
  async getDosenMyKelas(): Promise<Kelas[]> {
    return this.request<Kelas[]>('/irs/dosen/my-kelas');
  }

  // Get students in a class
  async getKelasMahasiswa(kelasId: string): Promise<any[]> {
    return this.request<any[]>(`/irs/dosen/kelas/${kelasId}/mahasiswa`);
  }

  // Create a new kelas (Dosen only)
  async createKelas(data: {
    mataKuliahId: string;
    nama: string;
    quota: number;
    ruangan?: string;
    hari?: string;
    jamMulai?: string;
    jamSelesai?: string;
  }): Promise<Kelas> {
    return this.request<Kelas>('/irs/kelas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Update a kelas
  async updateKelas(kelasId: string, data: Partial<{
    nama: string;
    quota: number;
    ruangan: string;
    hari: string;
    jamMulai: string;
    jamSelesai: string;
  }>): Promise<Kelas> {
    return this.request<Kelas>(`/irs/kelas/${kelasId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Delete a kelas
  async deleteKelas(kelasId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/irs/kelas/${kelasId}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient(API_BASE_URL);