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
  maxSks?: number;
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
  kapasitas?: number;
}

// Multiple schedule sessions per kelas
export interface JadwalKelas {
  id: string;
  kelasId: string;
  hari: string; // "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"
  jamMulai: string; // "08:00"
  jamSelesai: string; // "10:00"
  ruangan: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Kelas {
  id: string;
  mataKuliahId: string;
  nama: string;
  quota: number;
  ruangan: string | null;
  hari: string | null;
  jamMulai: string | null;
  jamSelesai: string | null;
  dosenId: string;
  createdAt: Date;
  updatedAt: Date;
  // Extended fields from API
  currentEnrollment?: number;
  remainingQuota?: number;
  isFull?: boolean;
  // Multiple schedules (NEW)
  jadwal?: JadwalKelas[];
  // Joined fields
  mataKuliahKode?: string;
  mataKuliahNama?: string;
  mataKuliahSks?: number;
}

export interface IrsEnrollment {
  id: string;
  semester: number;
  tahunAkademik: string;
  status: 'aktif' | 'dropped' | 'approved';
  isApproved: boolean;
  kelas: {
    id: string;
    nama: string;
    ruangan: string | null;
    hari: string | null;
    jamMulai: string | null;
    jamSelesai: string | null;
    // Multiple schedules (NEW)
    jadwal?: JadwalKelas[];
  };
  mataKuliah: {
    id: string;
    kode: string;
    nama: string;
    sks: number;
    semester: number;
  };
}

export interface IrsSummary {
  mahasiswa: {
    npm: string;
    nama: string;
    semester: number;
    maxSks: number;
  };
  totalSks: number;
  sisaSks: number;
  enrollments: IrsEnrollment[];
}

export interface IrsEnrollmentResponse {
  message: string;
  enrollment: {
    id: string;
    kelasId: string;
    kelasNama: string;
    mataKuliah: string;
    sks: number;
  };
  summary: {
    totalSksBaru: number;
    maxSks: number;
    sisaSks: number;
  };
}

export type MahasiswaWithUser = Mahasiswa & { user : User };
export type DosenWithUser = Dosen & { user : User };
export type AdminWithUser = Admin & { user : User };
