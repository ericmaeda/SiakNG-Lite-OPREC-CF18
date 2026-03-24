import { Inject } from "@nestjs/common";
import { IUserRepository } from "src/domain/repositories/user.repository.interface";
import { DrizzleProvider } from "../drizzle.provider";
import { UserEntity } from "src/domain/entities/user.entity";
import { users } from "../schema";
import { eq } from "drizzle-orm";

export class UserRepository implements IUserRepository {
    constructor(
        @Inject('DRIZZLE')
        private readonly drizzle: ReturnType<typeof DrizzleProvider.useFactory>
    ) {}

    async findById(id: string): Promise<UserEntity | null> {
        const user = await this.drizzle
            .select()
            .from(users)
            .where(eq(users.id, id))
            .limit(1);

        if (user.length === 0) {
            return null;
        }
        return this.mapToEntity(user[0]);
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const user = await this.drizzle
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);
        
        if (user.length === 0) {
            return null;
        }
        return this.mapToEntity(user[0]);
    }

    async create(data: {
        nama: string;
        email: string;
        passwordHash: string;
        role: 'MAHASISWA' | 'DOSEN' | 'ADMIN';
        isActive: boolean;
    }): Promise<UserEntity> {
        const result = await this.drizzle
            .insert(users)
            .values({
                nama: data.nama,
                email: data.email,
                passwordHash: data.passwordHash,
                role: data.role,
                isActive: data.isActive,
            })
            .returning();

        return this.mapToEntity(result[0]);
    }

    async update(id: string, data: Partial<{
        nama: string;
        email: string;
        passwordHash: string;
        role: 'MAHASISWA' | 'DOSEN' | 'ADMIN';
        isActive: boolean;
    }>): Promise<UserEntity> {
        const updateData: Record<string, unknown> = { updatedAt: new Date() };
        
        if (data.nama) updateData.nama = data.nama;
        if (data.email) updateData.email = data.email;
        if (data.passwordHash) updateData.passwordHash = data.passwordHash;
        if (data.role) updateData.role = data.role;
        if (data.isActive !== undefined) updateData.isActive = data.isActive;

        const result = await this.drizzle
            .update(users)
            .set(updateData)
            .where(eq(users.id, id))
            .returning();

        if (result.length === 0) {
            throw new Error('User not found');
        }
        return this.mapToEntity(result[0]);
    }

    async delete(id: string): Promise<void> {
        await this.drizzle
            .delete(users)
            .where(eq(users.id, id));
    }

    private mapToEntity(data: {
        id: string;
        nama: string;
        email: string;
        passwordHash: string;
        role: 'MAHASISWA' | 'DOSEN' | 'ADMIN';
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }): UserEntity {
        return new UserEntity(
            data.id,
            data.nama,
            data.email,
            data.passwordHash,
            data.role,
            data.isActive,
            data.createdAt,
            data.updatedAt
        );
    }
}