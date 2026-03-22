export type UserRole = 'MAHASISWA' | 'DOSEN' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Mahasiswa {
  id: string;
  userId: string;
  npm: string;
  prodi: string;
  fakultas: string;
  angkatan: number;
  ipk: string;
  semester: number;
}

export interface Dosen {
  id: string;
  userId: string;
  nip: string;
  department: string;
  fakultas: string;
  jabatan: string | null;
}

export interface Admin {
  id: string;
  userId: string;
  accessLevel: number;
  unit: string | null;
}

export interface MataKuliah {
  id: string;
  kode: string;
  nama: string;
  sks: number;
  semester: number;
}

export type MahasiswaWithUser = Mahasiswa & { user : User };
export type DosenWithUser = Dosen & { user : User };
export type AdminWithUser = Admin & { user : User };
