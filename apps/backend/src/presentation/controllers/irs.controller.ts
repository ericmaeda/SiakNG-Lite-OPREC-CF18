import { Controller, Post, Delete, Get, Patch, Body, Param, UseGuards, Request, ForbiddenException, NotFoundException, Query } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { IIrsRepository, IRS_REPOSITORY } from 'src/domain/repositories/irs.repository.interface';
import { IKelasRepository, KELAS_REPOSITORY } from 'src/domain/repositories/kelas.repository.interface';
import { IJadwalKelasRepository, JADWAL_KELAS_REPOSITORY } from 'src/domain/repositories/jadwal-kelas.repository.interface';
import { JwtAuthGuard } from 'src/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '../guards/role.guard';
import { Roles } from '../guards/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DrizzleProvider } from 'src/infrastructure/database/drizzle.provider';
import { eq, and, sql } from 'drizzle-orm';
import { mahasiswa, matakuliah, users, irs, jadwalKelas } from 'src/infrastructure/database/schema';

@ApiTags('IRS - Isian Rencana Studi')
@ApiBearerAuth()
@Controller('irs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IrsController {
    constructor(
        @Inject(IRS_REPOSITORY)
        private readonly irsRepo: IIrsRepository,
        @Inject(KELAS_REPOSITORY)
        private readonly kelasRepo: IKelasRepository,
        @Inject(JADWAL_KELAS_REPOSITORY)
        private readonly jadwalRepo: IJadwalKelasRepository,
        @Inject('DRIZZLE')
        private readonly drizzle: ReturnType<typeof DrizzleProvider.useFactory>
    ) {}

    // ==================== MAHASISWA ENDPOINTS ====================

    @Post('enroll')
    @Roles('MAHASISWA')
    @ApiOperation({ summary: 'Ambil kelas (Enroll ke IRS)' })
    @ApiResponse({ status: 201, description: 'Berhasil enroll ke kelas' })
    @ApiResponse({ status: 400, description: 'Gagal - kapasitas penuh, SKS exceeded, atau sudah terdaftar' })
    async enroll(
        @Body() data: {
            kelasId: string;
            semester: number;
            tahunAkademik: string;
        },
        @Request() req: any
    ) {
        const userId = req.user.id;  // JWT payload has 'id', not 'userId'

        // 1. Get mahasiswa ID from user ID
        const mahasiswaResult = await this.drizzle
            .select()
            .from(mahasiswa)
            .where(eq(mahasiswa.userId, userId))
            .limit(1);
        
        if (!mahasiswaResult.length) {
            throw new NotFoundException('Data mahasiswa tidak ditemukan');
        }
        const mahasiswaData = mahasiswaResult[0];
        const mahasiswaId = mahasiswaData.id;
        const maxSks = mahasiswaData.maxSks || 24;

        // 2. Get kelas info
        const kelas = await this.kelasRepo.findById(data.kelasId);
        if (!kelas) {
            throw new NotFoundException('Kelas tidak ditemukan');
        }

        // 3. Check if already enrolled in this kelas
        const existingEnrollment = await this.irsRepo.findByMahasiswaAndKelas(mahasiswaId, data.kelasId);
        if (existingEnrollment) {
            throw new ForbiddenException('Anda sudah terdaftar di kelas ini!');
        }

        // 4. Check if already enrolled in any kelas of the same mata kuliah
        const existingSameMatkul = await this.irsRepo.findByMahasiswaAndMataKuliah(mahasiswaId, kelas.mataKuliahId);
        if (existingSameMatkul) {
            throw new ForbiddenException('Anda sudah terdaftar di mata kuliah ini (kelas lain)!');
        }

        // 5. Check schedule overlap (jadwal bentrok)
        const conflict = await this.jadwalRepo.findConflictingJadwal(
            mahasiswaId,
            data.semester,
            data.tahunAkademik,
            data.kelasId
        );
        if (conflict) {
            throw new ForbiddenException(
                `Jadwal bentrok! Kelas yang ingin diambil (${conflict.targetJadwal.hari} ${conflict.targetJadwal.jamMulai}-${conflict.targetJadwal.jamSelesai}) ` +
                `bertabrakan dengan ${conflict.conflictingWith.mataKuliah.nama} ` +
                `(${conflict.conflictingWith.hari} ${conflict.conflictingWith.jamMulai}-${conflict.conflictingWith.jamSelesai} di ${conflict.conflictingWith.ruangan || 'ruangan sama'}). ` +
                `Silakan pilih kelas lain atau jadwal lain.`
            );
        }

        // 6. Check class capacity (quota)
        const currentEnrollment = await this.irsRepo.countByKelasId(data.kelasId);
        if (currentEnrollment >= kelas.quota) {
            throw new ForbiddenException('Kapasitas kelas sudah penuh!');
        }

        // 7. Check SKS limit
        const totalSks = await this.irsRepo.getTotalSks(mahasiswaId, data.semester, data.tahunAkademik);
        
        // Get SKS of the mata kuliah being enrolled
        const matkulResult = await this.drizzle
            .select()
            .from(matakuliah)
            .where(eq(matakuliah.id, kelas.mataKuliahId))
            .limit(1);
        
        if (!matkulResult.length) {
            throw new NotFoundException('Mata kuliah tidak ditemukan');
        }
        const matkulSks = matkulResult[0].sks;

        if (totalSks + matkulSks > maxSks) {
            throw new ForbiddenException(
                `Melebihi batas SKS! Total SKS: ${totalSks + matkulSks}, Batas maksimal: ${maxSks} SKS. ` +
                `Sisa SKS yang dapat diambil: ${maxSks - totalSks}`
            );
        }

        // 7. Create enrollment
        const enrollment = await this.irsRepo.create({
            kelasId: data.kelasId,
            mahasiswaId: mahasiswaId,
            semester: data.semester,
            tahunAkademik: data.tahunAkademik,
        });

        return {
            message: 'Berhasil enroll ke kelas',
            enrollment: {
                id: enrollment.id,
                kelasId: data.kelasId,
                kelasNama: kelas.nama,
                mataKuliah: matkulResult[0].nama,
                sks: matkulSks,
            },
            summary: {
                totalSksBaru: totalSks + matkulSks,
                maxSks: maxSks,
                sisaSks: maxSks - (totalSks + matkulSks),
            }
        };
    }

    @Delete('unenroll/:kelasId')
    @Roles('MAHASISWA')
    @ApiOperation({ summary: 'Lepas kelas dari IRS (Unenroll)' })
    @ApiResponse({ status: 200, description: 'Berhasil melepas kelas' })
    async unenroll(
        @Param('kelasId') kelasId: string,
        @Request() req: any
    ) {
        const userId = req.user.id;  // JWT payload has 'id', not 'userId'

        // Get mahasiswa ID
        const mahasiswaResult = await this.drizzle
            .select()
            .from(mahasiswa)
            .where(eq(mahasiswa.userId, userId))
            .limit(1);
        
        if (!mahasiswaResult.length) {
            throw new NotFoundException('Data mahasiswa tidak ditemukan');
        }
        const mahasiswaId = mahasiswaResult[0].id;

        // Check if enrolled
        const enrollment = await this.irsRepo.findByMahasiswaAndKelas(mahasiswaId, kelasId);
        if (!enrollment) {
            throw new ForbiddenException('Anda tidak terdaftar di kelas ini!');
        }

        // Delete enrollment
        await this.irsRepo.deleteByMahasiswaAndKelas(mahasiswaId, kelasId);

        return { message: 'Berhasil melepas kelas dari IRS' };
    }

    @Get('my-irs')
    @Roles('MAHASISWA')
    @ApiOperation({ summary: 'Lihat IRS saya' })
    @ApiResponse({ status: 200, description: 'Daftar mata kuliah yang diambil' })
    async getMyIrs(
        @Request() req: any,
        @Query() query: { semester?: number; tahunAkademik?: string }
    ) {
        const userId = req.user.id;  // JWT payload has 'id', not 'userId'

        // Get mahasiswa ID with user info (join to get nama)
        const mahasiswaResult = await this.drizzle
            .select({
                id: mahasiswa.id,
                npm: mahasiswa.npm,
                semester: mahasiswa.semester,
                maxSks: mahasiswa.maxSks,
                userNama: users.nama,
            })
            .from(mahasiswa)
            .leftJoin(users, eq(mahasiswa.userId, users.id))
            .where(eq(mahasiswa.userId, userId))
            .limit(1);
        
        if (!mahasiswaResult.length) {
            throw new NotFoundException('Data mahasiswa tidak ditemukan');
        }
        const mahasiswaId = mahasiswaResult[0].id;
        const mahasiswaData = mahasiswaResult[0];

        const enrollments = await this.irsRepo.findByMahasiswaId(
            mahasiswaId,
            query.semester,
            query.tahunAkademik
        );

        // Calculate total SKS
        let totalSks = 0;
        enrollments.forEach(e => {
            if (e.status === 'aktif') {
                totalSks += e.mataKuliahSks || 0;
            }
        });

        return {
            mahasiswa: {
                npm: mahasiswaData.npm,
                nama: mahasiswaData.userNama || mahasiswaData.npm,  // From users table via join
                semester: mahasiswaData.semester,
                maxSks: mahasiswaData.maxSks || 24,
            },
            totalSks,
            sisaSks: (mahasiswaData.maxSks || 24) - totalSks,
            enrollments: enrollments.map(e => ({
                id: e.id,
                status: e.status,
                isApproved: e.isApproved,
                kelas: {
                    id: e.kelasId,
                    nama: e.kelasNama,
                    ruangan: e.kelasRuangan,
                    hari: e.kelasHari,
                    jamMulai: e.kelasJamMulai,
                    jamSelesai: e.kelasJamSelesai,
                },
                mataKuliah: {
                    id: e.mataKuliahId,
                    kode: e.mataKuliahKode,
                    nama: e.mataKuliahNama,
                    sks: e.mataKuliahSks,
                    semester: e.mataKuliahSemester,
                },
            })),
        };
    }

    // ==================== DOSEN ENDPOINTS ====================

    @Get('dosen/my-kelas')
    @Roles('DOSEN')
    @ApiOperation({ summary: 'Lihat semua kelas saya (DOSEN)' })
    @ApiResponse({ status: 200, description: 'Daftar kelas yang diajar' })
    async getMyKelas(@Request() req: any) {
        const dosenId = req.user.id;
        
        const kelasList = await this.kelasRepo.findByDosenId(dosenId);
        
        if (kelasList.length === 0) {
            return [];
        }
        
        // Get all enrollment counts in a single query using IN clause
        const kelasIds = kelasList.map(k => k.id);
        const enrollmentCounts = await this.drizzle
            .select({
                kelasId: irs.kelasId,
                count: sql<number>`count(*)::int`,
            })
            .from(irs)
            .where(and(
                eq(irs.status, 'aktif'),
                sql`${irs.kelasId} IN ${kelasIds}`
            ))
            .groupBy(irs.kelasId);
        
        // Create a map for quick lookup
        const countMap = new Map(enrollmentCounts.map(e => [e.kelasId, e.count]));
        
        // Attach counts to kelas
        const kelasWithCount = kelasList.map(k => {
            const count = countMap.get(k.id) ?? 0;
            return {
                ...k,
                currentEnrollment: count,
                remainingQuota: k.quota - count,
            };
        });

        return kelasWithCount;
    }

    @Get('dosen/kelas/:kelasId/mahasiswa')
    @Roles('DOSEN')
    @ApiOperation({ summary: 'Lihat semua mahasiswa di kelas (DOSEN)' })
    @ApiResponse({ status: 200, description: 'Daftar mahasiswa dalam kelas' })
    async getKelasMahasiswa(@Param('kelasId') kelasId: string) {
        const students = await this.irsRepo.findByKelasId(kelasId);
        return students.map(s => ({
            irsId: s.id,
            status: s.status,
            isApproved: s.isApproved,
            mahasiswa: {
                id: s.mahasiswaId,
                npm: s.mahasiswaNpm,
                nama: s.mahasiswaNama,
                email: s.mahasiswaEmail,
                prodi: s.mahasiswaProdi,
                fakultas: s.mahasiswaFakultas,
            },
        }));
    }

    // ==================== KELAS CRUD (DOSEN) ====================

    @Post('kelas')
    @Roles('DOSEN')
    @ApiOperation({ summary: 'Buat kelas baru (DOSEN)' })
    @ApiResponse({ status: 201, description: 'Kelas berhasil dibuat' })
    async createKelas(
        @Body() data: {
            mataKuliahId: string;
            nama: string;
            quota: number;
            ruangan?: string;
            hari?: string;
            jamMulai?: string;
            jamSelesai?: string;
        },
        @Request() req: any
    ) {
        const dosenId = req.user.id;  // JWT payload has 'id', not 'userId'
        return this.kelasRepo.create({
            ...data,
            dosenId,
        });
    }

    @Patch('kelas/:id')
    @Roles('DOSEN')
    @ApiOperation({ summary: 'Update kelas (DOSEN)' })
    @ApiResponse({ status: 200, description: 'Kelas berhasil diupdate' })
    async updateKelas(
        @Param('id') id: string,
        @Body() data: Partial<{
            nama: string;
            quota: number;
            ruangan: string;
            hari: string;
            jamMulai: string;
            jamSelesai: string;
        }>
    ) {
        const updated = await this.kelasRepo.update(id, data);
        if (!updated) {
            throw new NotFoundException('Kelas tidak ditemukan');
        }
        return updated;
    }

    @Delete('kelas/:id')
    @Roles('DOSEN')
    @ApiOperation({ summary: 'Hapus kelas (DOSEN)' })
    @ApiResponse({ status: 200, description: 'Kelas berhasil dihapus' })
    async deleteKelas(@Param('id') id: string) {
        await this.kelasRepo.delete(id);
        return { message: 'Kelas berhasil dihapus' };
    }

    // ==================== KELAS VIEW (ALL AUTHENTICATED) ====================

    @Get('kelas/mata-kuliah/:mataKuliahId')
    @ApiOperation({ summary: 'Lihat semua kelas dari sebuah mata kuliah' })
    async getKelasByMataKuliah(@Param('mataKuliahId') mataKuliahId: string) {
        const kelasList = await this.kelasRepo.findByMataKuliahId(mataKuliahId);
        
        // Filter out kelas that don't have proper schedule (hari + jam_mulai + jam_selesai)
        // These are "dummy" kelas that haven't been set up by DOSEN
        const validKelasList = kelasList.filter(k => k.hari && k.jamMulai && k.jamSelesai);
        
        // If no valid kelas, return empty array (will show "belum ada kelas" to student)
        if (validKelasList.length === 0) {
            return [];
        }
        
        // Get all enrollment counts in a single query
        const kelasIds = validKelasList.map(k => k.id);
        const [enrollmentCounts, allJadwals] = await Promise.all([
            this.drizzle
                .select({
                    kelasId: irs.kelasId,
                    count: sql<number>`count(*)::int`,
                })
                .from(irs)
                .where(and(
                    eq(irs.status, 'aktif'),
                    sql`${irs.kelasId} IN ${kelasIds}`
                ))
                .groupBy(irs.kelasId),
            this.drizzle
                .select({
                    id: jadwalKelas.id,
                    kelasId: jadwalKelas.kelasId,
                    hari: jadwalKelas.hari,
                    jamMulai: jadwalKelas.jamMulai,
                    jamSelesai: jadwalKelas.jamSelesai,
                    ruangan: jadwalKelas.ruangan,
                })
                .from(jadwalKelas)
                .where(sql`${jadwalKelas.kelasId} IN ${kelasIds}`),
        ]);
        
        // Create maps for quick lookup
        const countMap = new Map(enrollmentCounts.map(e => [e.kelasId, e.count]));
        const jadwalMap = new Map<string, typeof allJadwals>();
        for (const j of allJadwals) {
            const existing = jadwalMap.get(j.kelasId) || [];
            existing.push(j);
            jadwalMap.set(j.kelasId, existing);
        }
        
        // Attach counts and jadwal to each kelas
        const kelasWithCount = validKelasList.map(k => {
            const count = countMap.get(k.id) ?? 0;
            return {
                ...k,
                currentEnrollment: count,
                remainingQuota: k.quota - count,
                isFull: count >= k.quota,
                jadwal: jadwalMap.get(k.id) || [],
            };
        });

        return kelasWithCount;
    }

    @Get('kelas/:id')
    @ApiOperation({ summary: 'Lihat detail kelas' })
    async getKelasById(@Param('id') id: string) {
        const kelas = await this.kelasRepo.findById(id);
        if (!kelas) {
            throw new NotFoundException('Kelas tidak ditemukan');
        }
        
        // Get enrollment count and jadwal in parallel (2 queries instead of 2 sequential)
        const [countResult, jadwalList] = await Promise.all([
            this.drizzle
                .select({ count: sql<number>`count(*)::int` })
                .from(irs)
                .where(and(
                    eq(irs.kelasId, id),
                    eq(irs.status, 'aktif')
                ))
                .limit(1),
            this.jadwalRepo.findByKelasId(id),
        ]);
        
        const count = countResult[0]?.count ?? 0;
        return {
            ...kelas,
            currentEnrollment: count,
            remainingQuota: kelas.quota - count,
            isFull: count >= kelas.quota,
            jadwal: jadwalList,
        };
    }
}
