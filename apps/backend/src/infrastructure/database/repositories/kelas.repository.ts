import { IKelasRepository, KELAS_REPOSITORY } from "src/domain/repositories/kelas.repository.interface";
import { DrizzleProvider } from "../drizzle.provider";
import { Inject } from "@nestjs/common";
import { kelas, irs } from "../schema";
import { eq, and, count } from "drizzle-orm";
import { matakuliah } from "../schema";

export class KelasRepository implements IKelasRepository {
    constructor(
        @Inject('DRIZZLE')
        private readonly drizzle: ReturnType<typeof DrizzleProvider.useFactory>
    ) {}

    async findAll(): Promise<any[]> {
        return this.drizzle.select().from(kelas);
    }

    async findById(id: string): Promise<any | null> {
        const result = await this.drizzle
            .select()
            .from(kelas)
            .where(eq(kelas.id, id))
            .limit(1);
        return result.length > 0 ? result[0] : null;
    }

    async findByMataKuliahId(mataKuliahId: string): Promise<any[]> {
        return this.drizzle
            .select({
                id: kelas.id,
                nama: kelas.nama,
                quota: kelas.quota,
                ruangan: kelas.ruangan,
                hari: kelas.hari,
                jamMulai: kelas.jamMulai,
                jamSelesai: kelas.jamSelesai,
                dosenId: kelas.dosenId,
                createdAt: kelas.createdAt,
                updatedAt: kelas.updatedAt,
                mataKuliahId: kelas.mataKuliahId,
            })
            .from(kelas)
            .where(eq(kelas.mataKuliahId, mataKuliahId));
    }

    async findByDosenId(dosenId: string): Promise<any[]> {
        return this.drizzle
            .select({
                id: kelas.id,
                nama: kelas.nama,
                quota: kelas.quota,
                ruangan: kelas.ruangan,
                hari: kelas.hari,
                jamMulai: kelas.jamMulai,
                jamSelesai: kelas.jamSelesai,
                createdAt: kelas.createdAt,
                updatedAt: kelas.updatedAt,
                mataKuliahId: kelas.mataKuliahId,
                mataKuliahKode: matakuliah.kode,
                mataKuliahNama: matakuliah.nama,
                mataKuliahSks: matakuliah.sks,
            })
            .from(kelas)
            .leftJoin(matakuliah, eq(kelas.mataKuliahId, matakuliah.id))
            .where(eq(kelas.dosenId, dosenId));
    }

    async create(data: {
        mataKuliahId: string;
        nama: string;
        quota: number;
        ruangan?: string;
        hari?: string;
        jamMulai?: string;
        jamSelesai?: string;
        dosisId: string;
        dosenId: string;
    }): Promise<any> {
        const result = await this.drizzle
            .insert(kelas)
            .values({
                mataKuliahId: data.mataKuliahId,
                nama: data.nama,
                quota: data.quota,
                ruangan: data.ruangan ?? null,
                hari: data.hari ?? null,
                jamMulai: data.jamMulai ?? null,
                jamSelesai: data.jamSelesai ?? null,
                dosenId: data.dosenId,
            })
            .returning();
        return result[0];
    }

    async update(id: string, data: Partial<{
        nama: string;
        quota: number;
        ruangan: string;
        hari: string;
        jamMulai: string;
        jamSelesai: string;
    }>): Promise<any> {
        const updateData: Record<string, unknown> = { updatedAt: new Date() };
        if (data.nama) updateData.nama = data.nama;
        if (data.quota) updateData.quota = data.quota;
        if (data.ruangan) updateData.ruangan = data.ruangan;
        if (data.hari) updateData.hari = data.hari;
        if (data.jamMulai) updateData.jamMulai = data.jamMulai;
        if (data.jamSelesai) updateData.jamSelesai = data.jamSelesai;

        const result = await this.drizzle
            .update(kelas)
            .set(updateData)
            .where(eq(kelas.id, id))
            .returning();
        return result[0];
    }

    async delete(id: string): Promise<void> {
        await this.drizzle.delete(kelas).where(eq(kelas.id, id));
    }

    async getCurrentEnrollmentCount(kelasId: string): Promise<number> {
        const result = await this.drizzle
            .select({ count: count() })
            .from(irs)
            .where(and(
                eq(irs.kelasId, kelasId),
                eq(irs.status, 'aktif')
            ));
        return result[0]?.count ?? 0;
    }
}
