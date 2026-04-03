import { Controller, Post, Delete, Get, Body, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { IMatakuliahMahasiswaRepository, MATAKULIAH_MAHASISWA_REPOSITORY } from 'src/domain/repositories/matakuliah-mahasiswa.repository.interface';
import { IMataKuliahRepository, MATAKULIAH_REPOSITORY } from 'src/domain/repositories/matakuliah.repository.interface';
import { JwtAuthGuard } from 'src/infrastructure/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('enrollment')
@ApiBearerAuth()
@Controller('enrollment')
@UseGuards(JwtAuthGuard)
export class EnrollmentController {
    constructor(
        @Inject(MATAKULIAH_MAHASISWA_REPOSITORY)
        private readonly enrollmentRepo: IMatakuliahMahasiswaRepository,
        @Inject(MATAKULIAH_REPOSITORY)
        private readonly matakuliahRepo: IMataKuliahRepository
    ) {}

    @ApiOperation({ summary: 'Ambil mata kuliah' })
    @ApiResponse({ status: 201, description: 'Berhasil mengambil mata kuliah' })
    @ApiResponse({ status: 400, description: 'Gagal - kapasitas penuh atau sudah terdaftar' })
    @Post('matakuliah/:id/enroll')
    async enroll(
        @Param('id') mataKuliahId: string,
        @Request() req: any
    ) {
        const mahasiswaId = req.user.userId;

        // 1. Cek mahasiswa belum exceeds 5 matkul
        const currentEnrollments = await this.enrollmentRepo.countByMahasiswaId(mahasiswaId);
        if (currentEnrollments >= 5) {
            throw new ForbiddenException('Maksimal 5 mata kuliah per semester!');
        }

        // 2. Cek mahasiswa belum ambil ini matkul
        const existing = await this.enrollmentRepo.findByBothIds(mataKuliahId, mahasiswaId);
        if (existing) {
            throw new ForbiddenException('Anda sudah terdaftar di mata kuliah ini!');
        }

        // 3. Cek kapasitas tidak penuh
        const matakuliah = await this.matakuliahRepo.findById(mataKuliahId);
        if (!matakuliah) {
            throw new ForbiddenException('Mata kuliah tidak ditemukan!');
        }

        const currentCapacity = await this.enrollmentRepo.countByMataKuliahId(mataKuliahId);
        if (currentCapacity >= matakuliah.kapasitas) {
            throw new ForbiddenException('Kapasitas mata kuliah sudah penuh!');
        }

        // 4. Insert enrollment
        const enrollment = await this.enrollmentRepo.create({
            mataKuliahId,
            mahasiswaId,
        });

        return {
            message: 'Berhasil mengambil mata kuliah',
            enrollment
        };
    }

    @ApiOperation({ summary: 'Batalkan pengambilan mata kuliah' })
    @ApiResponse({ status: 200, description: 'Berhasil membatalkan' })
    @Delete('matakuliah/:id/enroll')
    async unenroll(
        @Param('id') mataKuliahId: string,
        @Request() req: any
    ) {
        const mahasiswaId = req.user.userId;

        await this.enrollmentRepo.deleteByBothIds(mataKuliahId, mahasiswaId);

        return { message: 'Berhasil membatalkan pengambilan mata kuliah' };
    }

    @ApiOperation({ summary: 'Get semua mata kuliah yang diambil' })
    @ApiResponse({ status: 200, description: 'List mata kuliah mahasiswa' })
    @Get('my-matakuliah')
    async getMyEnrollments(@Request() req: any) {
        const mahasiswaId = req.user.userId;
        return this.enrollmentRepo.findByMahasiswaId(mahasiswaId);
    }

    @ApiOperation({ summary: 'Get semua mahasiswa di sebuah mata kuliah' })
    @ApiResponse({ status: 200, description: 'List mahasiswa dalam matkul' })
    @Get('matakuliah/:id/mahasiswa')
    async getMatakuliahStudents(@Param('id') mataKuliahId: string) {
        return this.enrollmentRepo.findByMataKuliahId(mataKuliahId);
    }
}
