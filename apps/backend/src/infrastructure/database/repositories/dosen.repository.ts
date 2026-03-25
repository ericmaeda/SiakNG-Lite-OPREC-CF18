import { IDosenRepository } from "src/domain/repositories/dosen.repository.interface";
import { DrizzleProvider } from "../drizzle.provider";
import { Inject } from "@nestjs/common";
import { DosenEntity } from "src/domain/entities/dosen.entity";
import { dosen } from "../schema";
import { eq } from "drizzle-orm";

export class DosenRepository implements IDosenRepository {
    constructor(
        @Inject()
        private readonly drizzle: ReturnType<typeof DrizzleProvider.useFactory>
    ) {}

    async findById(id: string): Promise<DosenEntity | null> {
        const lecturer = await this.drizzle
            .select()
            .from(dosen)
            .where(eq(dosen.id, id))
            .limit(1);

        if (lecturer.length === 0) {
            return null;
        }
        return this.mapToEntity(lecturer[0]);
    }

    async findByNip(nip: string): Promise<DosenEntity | null> {
        const lecturer = await this.drizzle
            .select()
            .from(dosen)
            .where(eq(dosen.nip, nip))
            .limit(1);

        if (lecturer.length === 0) {
            return null;
        }
        return this.mapToEntity(lecturer[0]);
    }

    async create(data: {
        userId: string;
        nip: string;
        department: string;
        fakultas: string;
        jabatan?: string;
    }): Promise<DosenEntity> {
        const result = await this.drizzle
            .insert(dosen)
            .values({
                userId: data.userId,
                nip: data.nip,
                department: data.department,
                fakultas: data.fakultas,
                jabatan: data.jabatan ?? null,
            })
            .returning();

        return this.mapToEntity(result[0]);
    }

    async update(id: string, data: Partial<{
        userId: string;
        nip: string;
        department: string;
        fakultas: string;
        jabatan: string;
    }>): Promise<DosenEntity> {
        const updateData: Record<string, unknown> = {};

        if (data.userId) updateData.userId = data.userId;
        if (data.nip) updateData.nip = data.nip;
        if (data.department) updateData.department = data.department;
        if (data.fakultas) updateData.fakultas = data.fakultas;
        if (data.jabatan !== undefined) updateData.jabatan = data.jabatan;

        const result = await this.drizzle
            .update(dosen)
            .set(updateData)
            .where(eq(dosen.id, id))
            .returning();

        if (result.length === 0) {
            throw new Error('Dosen not found');
        }
        return this.mapToEntity(result[0]);
    }

    async delete(id: string): Promise<void> {
        await this.drizzle
            .delete(dosen)
            .where(eq(dosen.id, id));
    }

    async findByUserId(userId: string): Promise<DosenEntity | null> {
        const lecturer = await this.drizzle
            .select()
            .from(dosen)
            .where(eq(dosen.userId, userId))
            .limit(1);

        if (lecturer.length === 0) {
            return null;
        }
        return this.mapToEntity(lecturer[0]);
    }

    private mapToEntity(data: {
        id: string;
        userId: string;
        nip: string;
        department: string;
        fakultas: string;
        jabatan: string | null;
    }): DosenEntity {
        return new DosenEntity(
            data.id,
            data.userId,
            data.nip,
            data.department,
            data.fakultas,
            data.jabatan
        );
    }
}
