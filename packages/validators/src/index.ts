import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const CreateCourseSchema = z.object({
  kode: z.string().min(3).max(10),
  nama: z.string().min(3).max(100),
  sks: z.number().int().min(1).max(6),
  semester: z.number().int().min(1).max(8),
});

export const CreateUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['MAHASISWA', 'DOSEN', 'ADMIN']),
});

export const CreateMahasiswaSchema = z.object({
  npm: z.string().length(10),
  prodi: z.string().min(3),
  fakultas: z.string().min(3),
  angkatan: z.number().int().min(2000).max(new Date().getFullYear()),
  semester: z.number().int().min(1).max(14),
});

export const CreateDosenSchema = z.object({
  nip: z.string().length(20),
  department: z.string().min(3),
  fakultas: z.string().min(3),
  jabatan: z.string().optional(),
});

export type LoginDto = z.infer<typeof LoginSchema>;
export type CreateCourseDto = z.infer<typeof CreateCourseSchema>;
export type CreateUserDto = z.infer<typeof CreateUserSchema>;