import { IIrsRepository, IRS_REPOSITORY } from "src/domain/repositories/irs.repository.interface";
import { DrizzleProvider } from "../drizzle.provider";
import { Inject } from "@nestjs/common";
import { irs, kelas, matakuliah, users, mahasiswa } from "../schema";
import { eq, and, sql } from "drizzle-orm";

export class IrsRepository implements IIrsRepository {
    constructor(
        @Inject('DRIZZLE')
        private readonly drizzle: ReturnType<typeof DrizzleProvider.useFactory>
    ) {}

    async findById(id: string): Promise<any | null> {
        const result = await this.drizzle
            .select()
            .from(irs)
            .where(eq(irs.id, id))
            .limit(1);
        return result.length > 0 ? result[0] : null;
    }

    async findByMahasiswaId(mahasiswaId: string, semester?: number, tahunAkademik?: string): Promise<any[]> {
        let query = this.drizzle
            .select({
                id: irs.id,
                semester: irs.semester,
                tahunAkademik: irs.tahunAkademik,
                status: irs.status,
                isApproved: irs.isApproved,
                createdAt: irs.createdAt,
                updatedAt: irs.updatedAt,
                kelasId: irs.kelasId,
                mahasiswaId: irs.mahasiswaId,
                // Kelas info
                kelasNama: kelas.nama,
                kelasQuota: kelas.quota,
                kelasRuangan: kelas.ruangan,
                kelasHari: kelas.hari,
                kelasJamMulai: kelas.jamMulai,
                kelasJamSelesai: kelas.jamSelesai,
                // Mata kuliah info
                mataKuliahId: matakuliah.id,
                mataKuliahKode: matakuliah.kode,
                mataKuliahNama: matakuliah.nama,
                mataKuliahSks: matakuliah.sks,
                mataKuliahSemester: matakuliah.semester,
            })
            .from(irs)
            .leftJoin(kelas, eq(irs.kelasId, kelas.id))
            .leftJoin(matakuliah, eq(kelas.mataKuliahId, matakuliah.id))
            .where(eq(irs.mahasiswaId, mahasiswaId));

        const conditions = [eq(irs.mahasiswaId, mahasiswaId)];
        if (semester) {
            conditions.push(eq(irs.semester, semester));
        }
        if (tahunAkademik) {
            conditions.push(eq(irs.tahunAkademik, tahunAkademik));
        }

        return this.drizzle
            .select({
                id: irs.id,
                semester: irs.semester,
                tahunAkademik: irs.tahunAkademik,
                status: irs.status,
                isApproved: irs.isApproved,
                createdAt: irs.createdAt,
                updatedAt: irs.updatedAt,
                kelasId: irs.kelasId,
                mahasiswaId: irs.mahasiswaId,
                // Kelas info
                kelasNama: kelas.nama,
                kelasQuota: kelas.quota,
                kelasRuangan: kelas.ruangan,
                kelasHari: kelas.hari,
                kelasJamMulai: kelas.jamMulai,
                kelasJamSelesai: kelas.jamSelesai,
                // Mata kuliah info
                mataKuliahId: matakuliah.id,
                mataKuliahKode: matakuliah.kode,
                mataKuliahNama: matakuliah.nama,
                mataKuliahSks: matakuliah.sks,
                mataKuliahSemester: matakuliah.semester,
            })
            .from(irs)
            .leftJoin(kelas, eq(irs.kelasId, kelas.id))
            .leftJoin(matakuliah, eq(kelas.mataKuliahId, matakuliah.id))
            .where(and(...conditions));
    }

    async findByKelasId(kelasId: string): Promise<any[]> {
        return this.drizzle
            .select({
                id: irs.id,
                semester: irs.semester,
                tahunAkademik: irs.tahunAkademik,
                status: irs.status,
                isApproved: irs.isApproved,
                createdAt: irs.createdAt,
                mahasiswaId: irs.mahasiswaId,
                // Mahasiswa info
                mahasiswaNpm: mahasiswa.npm,
                mahasiswaNama: users.nama,
                mahasiswaEmail: users.email,
                mahasiswaProdi: mahasiswa.prodi,
                mahasiswaFakultas: mahasiswa.fakultas,
            })
            .from(irs)
            .leftJoin(mahasiswa, eq(irs.mahasiswaId, mahasiswa.id))
            .leftJoin(users, eq(mahasiswa.userId, users.id))
            .where(eq(irs.kelasId, kelasId));
    }

    async findByMahasiswaAndKelas(mahasiswaId: string, kelasId: string): Promise<any | null> {
        const result = await this.drizzle
            .select()
            .from(irs)
            .where(and(
                eq(irs.mahasiswaId, mahasiswaId),
                eq(irs.kelasId, kelasId),
                eq(irs.status, 'aktif')
            ))
            .limit(1);
        return result.length > 0 ? result[0] : null;
    }

    async findByMahasiswaAndMataKuliah(mahasiswaId: string, mataKuliahId: string): Promise<any | null> {
        const result = await this.drizzle
            .select({
                irsId: irs.id,
                irsStatus: irs.status,
                kelasId: kelas.id,
                kelasNama: kelas.nama,
            })
            .from(irs)
            .leftJoin(kelas, eq(irs.kelasId, kelas.id))
            .where(and(
                eq(irs.mahasiswaId, mahasiswaId),
                eq(kelas.mataKuliahId, mataKuliahId)
            ))
            .limit(1);
        return result.length > 0 ? result[0] : null;
    }

    async getTotalSks(mahasiswaId: string, semester: number, tahunAkademik: string): Promise<number> {
        const result = await this.drizzle
            .select({
                total: sql<number>`COALESCE(SUM(${matakuliah.sks}), 0)`
            })
            .from(irs)
            .leftJoin(kelas, eq(irs.kelasId, kelas.id))
            .leftJoin(matakuliah, eq(kelas.mataKuliahId, matakuliah.id))
            .where(and(
                eq(irs.mahasiswaId, mahasiswaId),
                eq(irs.semester, semester),
                eq(irs.tahunAkademik, tahunAkademik),
                eq(irs.status, 'aktif')
            ));
        return Number(result[0]?.total) || 0;
    }

    async create(data: {
        kelasId: string;
        mahasiswaId: string;
        semester: number;
        tahunAkademik: string;
    }): Promise<any> {
        const result = await this.drizzle
            .insert(irs)
            .values({
                kelasId: data.kelasId,
                mahasiswaId: data.mahasiswaId,
                semester: data.semester,
                tahunAkademik: data.tahunAkademik,
                status: 'aktif',
                isApproved: false,
            })
            .returning();
        return result[0];
    }

    async updateStatus(id: string, status: string, isApproved?: boolean): Promise<any> {
        const updateData: Record<string, unknown> = { 
            status, 
            updatedAt: new Date() 
        };
        if (isApproved !== undefined) {
            updateData.isApproved = isApproved;
        }
        
        const result = await this.drizzle
            .update(irs)
            .set(updateData)
            .where(eq(irs.id, id))
            .returning();
        return result[0];
    }

    async delete(id: string): Promise<void> {
        await this.drizzle.delete(irs).where(eq(irs.id, id));
    }

    async deleteByMahasiswaAndKelas(mahasiswaId: string, kelasId: string): Promise<void> {
        await this.drizzle
            .delete(irs)
            .where(and(
                eq(irs.mahasiswaId, mahasiswaId),
                eq(irs.kelasId, kelasId)
            ));
    }

    async countByKelasId(kelasId: string): Promise<number> {
        const result = await this.drizzle
            .select()
            .from(irs)
            .where(and(
                eq(irs.kelasId, kelasId),
                eq(irs.status, 'aktif')
            ));
        return result.length;
    }
}
