import { IMahasiswaRepository } from "src/domain/repositories/mahasiswa.repository.interface";
import { DrizzleProvider } from "../drizzle.provider";
import { Inject } from "@nestjs/common";
import { MahasiswaEntity } from "src/domain/entities/mahasiswa.entity";
import { mahasiswa } from "../schema";
import { eq } from "drizzle-orm";

export class MahasiswaRepository implements IMahasiswaRepository {
    constructor(
        @Inject()
        private readonly drizzle: ReturnType<typeof DrizzleProvider.useFactory>
    ) {}

    async findById(id: string): Promise<MahasiswaEntity | null> {
        const student = await this.drizzle
            .select()
            .from(mahasiswa)
            .where(eq(mahasiswa.id, id))
            .limit(1);
        
        if (student.length === 0) {
            return null;
        }
        return this.mapToEntity(student[0]);
    }

    async findByNpm(npm: string): Promise<MahasiswaEntity | null> {
        const student = await this.drizzle
            .select()
            .from(mahasiswa)
            .where(eq(mahasiswa.npm, npm))
            .limit(1);

        if (student.length === 0) {
            return null;
        }
        return this.mapToEntity(student[0]);
    }

        async findByUserId(userId: string): Promise<MahasiswaEntity | null> {
        const student = await this.drizzle
            .select()
            .from(mahasiswa)
            .where(eq(mahasiswa.userId, userId))
            .limit(1);

        if (student.length === 0) {
            return null;
        }
        return this.mapToEntity(student[0]);
    }

    async create(data: {
        userId: string;
        npm: string;
        prodi: string;
        fakultas: string;
        angkatan: string;
        ipk?: number;
        semester?: number;
    }): Promise<MahasiswaEntity> {
        const result = await this.drizzle
            .insert(mahasiswa)
            .values({
                userId: data.userId,
                npm: data.npm,
                prodi: data.prodi,
                fakultas: data.fakultas,
                angkatan: data.angkatan,
                ipk: data.ipk?.toString() ?? '0.00',
                semester: data.semester ?? 1,
            })
            .returning();

        return this.mapToEntity(result[0]);
    }

    async update(id: string, data: Partial<{
        userId: string;
        npm: string;
        prodi: string;
        fakultas: string;
        angkatan: string;
        ipk: number;
        semester: number;
    }>): Promise<MahasiswaEntity> {
        const updateData: Record<string, unknown> = {};

        if (data.userId) updateData.userId = data.userId;
        if (data.npm) updateData.npm = data.npm;
        if (data.prodi) updateData.prodi = data.prodi;
        if (data.fakultas) updateData.fakultas = data.fakultas;
        if (data.angkatan) updateData.angkatan = data.angkatan;
        if (data.ipk !== undefined) updateData.ipk = data.ipk.toString();
        if (data.semester !== undefined) updateData.semester = data.semester;

        const result = await this.drizzle
            .update(mahasiswa)
            .set(updateData)
            .where(eq(mahasiswa.id, id))
            .returning();

        if (result.length === 0) {
            throw new Error('Mahasiswa not found');
        }
        return this.mapToEntity(result[0]);
    }

    async delete(id: string): Promise<void> {
        await this.drizzle
            .delete(mahasiswa)
            .where(eq(mahasiswa.id, id));
    }

    private mapToEntity(data: {
        id: string;
        userId: string;
        npm: string;
        prodi: string;
        fakultas: string;
        angkatan: string;
        ipk: string | number;
        semester: number;
    }): MahasiswaEntity {
        return new MahasiswaEntity(
            data.id,
            data.userId,
            data.npm,
            data.prodi,
            data.fakultas,
            data.angkatan,
            typeof data.ipk === 'string' ? parseFloat(data.ipk) : data.ipk,
            data.semester
        );
    }
}
