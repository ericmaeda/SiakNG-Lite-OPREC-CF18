import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
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

export const CreateAdminSchema = z.object({
  userId: z.string().uuid("User ID harus berupa UUID yang valid"),
  accessLevel: z.string().length(1).default("1"),
  unit: z.string().min(1).optional(),
});

export const CreateMataKuliahSchema = z.object({
  kode: z.string()
    .min(6, "Kode MK minimal harus 6 karakter")
    .max(6, "Kode MK maksimal hanya 6 karakter")
    .regex(/^MK\d{4}$/, "Kode harus berformat MKxxxx (contoh: MK1234)"),
  nama: z.string().min(1, "Nama mata kuliah tidak boleh kosong"),
  sks: z.number().int().min(1).max(6, "SKS maksimal adalah 6"),
  semester: z.number().int().min(1).max(14, "Semester maksimal adalah 14"),
});

export const UpdateMataKuliahSchema = z.object({
  kode: z.string()
    .min(6, "Kode MK minimal harus 6 karakter")
    .max(6, "Kode MK maksimal hanya 6 karakter")
    .regex(/^MK\d{4}$/, "Kode harus berformat MKxxxx (contoh: MK1234)")
    .optional(),
  nama: z.string().min(1).optional(),
  sks: z.number().int().min(1).max(6).optional(),
  semester: z.number().int().min(1).max(14).optional(),
});

export type LoginDto = z.infer<typeof LoginSchema>;
export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type CreateMahasiswaDto = z.infer<typeof CreateMahasiswaSchema>;
export type CreateDosenDto = z.infer<typeof CreateDosenSchema>;
export type CreateAdminDto = z.infer<typeof CreateAdminSchema>;
export type CreateMataKuliahDto = z.infer<typeof CreateMataKuliahSchema>;
export type UpdateMataKuliahDto = z.infer<typeof UpdateMataKuliahSchema>;