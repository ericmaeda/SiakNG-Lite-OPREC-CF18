import { IJadwalKelasRepository, JADWAL_KELAS_REPOSITORY } from "src/domain/repositories/jadwal-kelas.repository.interface";
import { DrizzleProvider } from "../drizzle.provider";
import { Inject } from "@nestjs/common";
import { jadwalKelas, kelas, irs, matakuliah } from "../schema";
import { eq, and, ne, sql } from "drizzle-orm";

/**
 * Maps day names to numbers for overlap detection
 * Using ISO standard: Monday = 1, Tuesday = 2, etc.
 */
const DAY_MAP: Record<string, number> = {
    'Senin': 1,
    'Selasa': 2,
    'Rabu': 3,
    'Kamis': 4,
    'Jumat': 5,
    'Sabtu': 6,
    'Minggu': 7,
};

/**
 * Converts time string (HH:MM) to minutes since midnight
 */
function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

/**
 * Checks if two time ranges overlap
 */
function isTimeOverlap(
    start1: string,
    end1: string,
    start2: string,
    end2: string
): boolean {
    const s1 = timeToMinutes(start1);
    const e1 = timeToMinutes(end1);
    const s2 = timeToMinutes(start2);
    const e2 = timeToMinutes(end2);
    return s1 < e2 && s2 < e1;
}

export class JadwalKelasRepository implements IJadwalKelasRepository {
    constructor(
        @Inject('DRIZZLE')
        private readonly drizzle: ReturnType<typeof DrizzleProvider.useFactory>
    ) {}

    async findById(id: string): Promise<any | null> {
        const result = await this.drizzle
            .select()
            .from(jadwalKelas)
            .where(eq(jadwalKelas.id, id))
            .limit(1);
        return result.length > 0 ? result[0] : null;
    }

    async findByKelasId(kelasId: string): Promise<any[]> {
        return this.drizzle
            .select({
                id: jadwalKelas.id,
                kelasId: jadwalKelas.kelasId,
                hari: jadwalKelas.hari,
                jamMulai: jadwalKelas.jamMulai,
                jamSelesai: jadwalKelas.jamSelesai,
                ruangan: jadwalKelas.ruangan,
                createdAt: jadwalKelas.createdAt,
                updatedAt: jadwalKelas.updatedAt,
            })
            .from(jadwalKelas)
            .where(eq(jadwalKelas.kelasId, kelasId));
    }

    /**
     * Checks if enrolling in targetKelas would cause schedule conflict with existing enrollments
     * Returns conflicting jadwal if overlap found, null otherwise
     */
    async findConflictingJadwal(
        mahasiswaId: string,
        semester: number,
        tahunAkademik: string,
        targetKelasId: string,
        targetJadwalId?: string
    ): Promise<any | null> {
        // Get all jadwal for the target kelas
        const targetJadwals = await this.findByKelasId(targetKelasId);
        
        // If targetJadwalId provided, exclude it from conflict check (when updating)
        const checkTargets = targetJadwalId
            ? targetJadwals.filter(j => j.id !== targetJadwalId)
            : targetJadwals;

        // Get all active IRS enrollments for this mahasiswa in the semester
        const existingEnrollments = await this.drizzle
            .select({
                irsId: irs.id,
                irsStatus: irs.status,
                irsKelasId: irs.kelasId,
                kelasNama: kelas.nama,
                mataKuliahId: kelas.mataKuliahId,
                mataKuliahKode: matakuliah.kode,
                mataKuliahNama: matakuliah.nama,
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

        // Check each target jadwal against each existing jadwal
        for (const targetJadwal of checkTargets) {
            const targetDayNum = DAY_MAP[targetJadwal.hari];
            if (!targetDayNum) continue;

            for (const enrollment of existingEnrollments) {
                // Skip if same kelas (shouldn't happen, but safety check)
                if (enrollment.irsKelasId === targetKelasId) continue;

                // Get all jadwal for the enrolled kelas
                const existingJadwals = await this.findByKelasId(enrollment.irsKelasId);

                for (const existingJadwal of existingJadwals) {
                    const existingDayNum = DAY_MAP[existingJadwal.hari];
                    if (!existingDayNum) continue;

                    // Same day check
                    if (targetDayNum === existingDayNum) {
                        // Time overlap check
                        if (isTimeOverlap(
                            targetJadwal.jamMulai,
                            targetJadwal.jamSelesai,
                            existingJadwal.jamMulai,
                            existingJadwal.jamSelesai
                        )) {
                            // Found conflict!
                            return {
                                conflictingWith: {
                                    jadwalId: existingJadwal.id,
                                    hari: existingJadwal.hari,
                                    jamMulai: existingJadwal.jamMulai,
                                    jamSelesai: existingJadwal.jamSelesai,
                                    ruangan: existingJadwal.ruangan,
                                    kelas: enrollment.kelasNama,
                                    mataKuliah: {
                                        kode: enrollment.mataKuliahKode,
                                        nama: enrollment.mataKuliahNama,
                                    },
                                },
                                targetJadwal: {
                                    jadwalId: targetJadwal.id,
                                    hari: targetJadwal.hari,
                                    jamMulai: targetJadwal.jamMulai,
                                    jamSelesai: targetJadwal.jamSelesai,
                                    ruangan: targetJadwal.ruangan,
                                },
                            };
                        }
                    }
                }
            }
        }

        return null;
    }

    async create(data: {
        kelasId: string;
        hari: string;
        jamMulai: string;
        jamSelesai: string;
        ruangan?: string;
    }): Promise<any> {
        const result = await this.drizzle
            .insert(jadwalKelas)
            .values({
                kelasId: data.kelasId,
                hari: data.hari,
                jamMulai: data.jamMulai,
                jamSelesai: data.jamSelesai,
                ruangan: data.ruangan ?? null,
            })
            .returning();
        return result[0];
    }

    async update(
        id: string,
        data: Partial<{
            hari: string;
            jamMulai: string;
            jamSelesai: string;
            ruangan: string;
        }>
    ): Promise<any> {
        const updateData: Record<string, unknown> = { updatedAt: new Date() };
        if (data.hari) updateData.hari = data.hari;
        if (data.jamMulai) updateData.jamMulai = data.jamMulai;
        if (data.jamSelesai) updateData.jamSelesai = data.jamSelesai;
        if (data.ruangan) updateData.ruangan = data.ruangan;

        const result = await this.drizzle
            .update(jadwalKelas)
            .set(updateData)
            .where(eq(jadwalKelas.id, id))
            .returning();
        return result[0];
    }

    async delete(id: string): Promise<void> {
        await this.drizzle.delete(jadwalKelas).where(eq(jadwalKelas.id, id));
    }

    async findByMahasiswaSemester(
        mahasiswaId: string,
        semester: number,
        tahunAkademik: string
    ): Promise<any[]> {
        return this.drizzle
            .select({
                jadwalId: jadwalKelas.id,
                kelasId: jadwalKelas.kelasId,
                kelasNama: kelas.nama,
                hari: jadwalKelas.hari,
                jamMulai: jadwalKelas.jamMulai,
                jamSelesai: jadwalKelas.jamSelesai,
                ruangan: jadwalKelas.ruangan,
                mataKuliah: {
                    kode: matakuliah.kode,
                    nama: matakuliah.nama,
                    sks: matakuliah.sks,
                },
            })
            .from(irs)
            .leftJoin(kelas, eq(irs.kelasId, kelas.id))
            .leftJoin(jadwalKelas, eq(kelas.id, jadwalKelas.kelasId))
            .leftJoin(matakuliah, eq(kelas.mataKuliahId, matakuliah.id))
            .where(and(
                eq(irs.mahasiswaId, mahasiswaId),
                eq(irs.semester, semester),
                eq(irs.tahunAkademik, tahunAkademik),
                eq(irs.status, 'aktif')
            ));
    }
}