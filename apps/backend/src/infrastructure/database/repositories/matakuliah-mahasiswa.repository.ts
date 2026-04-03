import { IMatakuliahMahasiswaRepository } from "src/domain/repositories/matakuliah-mahasiswa.repository.interface";
import { DrizzleProvider } from "../drizzle.provider";
import { Inject } from "@nestjs/common";
import { matakuliahMahasiswa } from "../schema";
import { eq, and, count } from "drizzle-orm";
import { users } from "../schema";
import { matakuliah } from "../schema";

export class MatakuliahMahasiswaRepository implements IMatakuliahMahasiswaRepository {
    constructor(
        @Inject('DRIZZLE')
        private readonly drizzle: ReturnType<typeof DrizzleProvider.useFactory>
    ) {}

    async findByMataKuliahId(mataKuliahId: string): Promise<any[]> {
        const enrollments = await this.drizzle
            .select({
                id: matakuliahMahasiswa.id,
                mataKuliahId: matakuliahMahasiswa.mataKuliahId,
                mahasiswaId: matakuliahMahasiswa.mahasiswaId,
                nilai: matakuliahMahasiswa.nilai,
                createdAt: matakuliahMahasiswa.createdAt,
                nama: users.nama,
                email: users.email,
            })
            .from(matakuliahMahasiswa)
            .leftJoin(users, eq(matakuliahMahasiswa.mahasiswaId, users.id))
            .where(eq(matakuliahMahasiswa.mataKuliahId, mataKuliahId));
        
        return enrollments;
    }

    async findByMahasiswaId(mahasiswaId: string): Promise<any[]> {
        const enrollments = await this.drizzle
            .select({
                id: matakuliahMahasiswa.id,
                mataKuliahId: matakuliahMahasiswa.mataKuliahId,
                mahasiswaId: matakuliahMahasiswa.mahasiswaId,
                nilai: matakuliahMahasiswa.nilai,
                createdAt: matakuliahMahasiswa.createdAt,
                kode: matakuliah.kode,
                nama: matakuliah.nama,
                sks: matakuliah.sks,
                semester: matakuliah.semester,
                kapasitas: matakuliah.kapasitas,
            })
            .from(matakuliahMahasiswa)
            .leftJoin(matakuliah, eq(matakuliahMahasiswa.mataKuliahId, matakuliah.id))
            .where(eq(matakuliahMahasiswa.mahasiswaId, mahasiswaId));
        
        return enrollments;
    }

    async findByBothIds(mataKuliahId: string, mahasiswaId: string): Promise<any | null> {
        const enrollment = await this.drizzle
            .select()
            .from(matakuliahMahasiswa)
            .where(and(
                eq(matakuliahMahasiswa.mataKuliahId, mataKuliahId),
                eq(matakuliahMahasiswa.mahasiswaId, mahasiswaId)
            ))
            .limit(1);

        if (enrollment.length === 0) {
            return null;
        }
        return enrollment[0];
    }

    async create(data: {
        mataKuliahId: string;
        mahasiswaId: string;
        nilai?: string;
    }): Promise<any> {
        const result = await this.drizzle
            .insert(matakuliahMahasiswa)
            .values({
                mataKuliahId: data.mataKuliahId,
                mahasiswaId: data.mahasiswaId,
                nilai: data.nilai ?? null,
            })
            .returning();

        return result[0];
    }

    async updateNilai(id: string, nilai: string): Promise<any> {
        const result = await this.drizzle
            .update(matakuliahMahasiswa)
            .set({ nilai })
            .where(eq(matakuliahMahasiswa.id, id))
            .returning();

        return result[0];
    }

    async delete(id: string): Promise<void> {
        await this.drizzle
            .delete(matakuliahMahasiswa)
            .where(eq(matakuliahMahasiswa.id, id));
    }

    async deleteByBothIds(mataKuliahId: string, mahasiswaId: string): Promise<void> {
        await this.drizzle
            .delete(matakuliahMahasiswa)
            .where(and(
                eq(matakuliahMahasiswa.mataKuliahId, mataKuliahId),
                eq(matakuliahMahasiswa.mahasiswaId, mahasiswaId)
            ));
    }

    async countByMataKuliahId(mataKuliahId: string): Promise<number> {
        const result = await this.drizzle
            .select({ count: count() })
            .from(matakuliahMahasiswa)
            .where(eq(matakuliahMahasiswa.mataKuliahId, mataKuliahId));
        
        return result[0]?.count ?? 0;
    }

    async countByMahasiswaId(mahasiswaId: string): Promise<number> {
        const result = await this.drizzle
            .select({ count: count() })
            .from(matakuliahMahasiswa)
            .where(eq(matakuliahMahasiswa.mahasiswaId, mahasiswaId));
        
        return result[0]?.count ?? 0;
    }
}
