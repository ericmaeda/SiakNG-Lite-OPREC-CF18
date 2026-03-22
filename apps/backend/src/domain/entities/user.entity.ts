export type UserRole = `'MAHASISWA'` | `'DOSEN'` | `'ADMIN'`;

export class UserEntity {
  constructor(
    public readonly id: string,
    public nama: string,
    public email: string,
    public passwordHash: string,
    public role: UserRole,
    public isActive: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}
}
