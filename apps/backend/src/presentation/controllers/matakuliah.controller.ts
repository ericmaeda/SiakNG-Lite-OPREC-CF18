import { 
    Controller, 
    Get, 
    Post, 
    Patch, 
    Delete, 
    Body,
    Param, 
    UseGuards,
    Request 
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { IMataKuliahRepository, MATAKULIAH_REPOSITORY } from 'src/domain/repositories/matakuliah.repository.interface';
import { IKelasRepository, KELAS_REPOSITORY } from 'src/domain/repositories/kelas.repository.interface';
import { RolesGuard } from '../guards/role.guard';
import { Roles } from '../guards/roles.decorator';
import { JwtAuthGuard } from 'src/infrastructure/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DrizzleProvider } from 'src/infrastructure/database/drizzle.provider';
import { users, irs } from 'src/infrastructure/database/schema';
import { eq, count } from 'drizzle-orm';
import { NotFoundException } from '@nestjs/common';

@ApiTags('matakuliah')
@ApiBearerAuth()
@Controller('matakuliah')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MatakuliahController {
    constructor(
        @Inject(MATAKULIAH_REPOSITORY)
        private readonly matakuliahRepository: IMataKuliahRepository,
        @Inject(KELAS_REPOSITORY)
        private readonly kelasRepository: IKelasRepository,
        @Inject('DRIZZLE')
        private readonly drizzle: ReturnType<typeof DrizzleProvider.useFactory>
    ) {}

    @Get()
    async findAll() {
        return this.matakuliahRepository.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.matakuliahRepository.findById(id);
    }

    @Get('detail/:id')
    @UseGuards(JwtAuthGuard)
    async getDetail(@Param('id') id: string) {
        // Get mata kuliah
        const mataKuliah = await this.matakuliahRepository.findById(id);
        if (!mataKuliah) {
            throw new NotFoundException('Mata kuliah tidak ditemukan');
        }

        // Get kelas with enrollment count
        const kelasList = await this.kelasRepository.findByMataKuliahId(id);
        
        // Get dosen's info
        const dosenResult = await this.drizzle
            .select({
                id: users.id,
                nama: users.nama,
                email: users.email,
            })
            .from(users)
            .where(eq(users.id, mataKuliah.dosenId))
            .limit(1);

        const kelasWithEnrollment = await Promise.all(
            kelasList.map(async (k) => {
                const countResult = await this.drizzle
                    .select({ count: count() })
                    .from(irs)
                    .where(eq(irs.kelasId, k.id));
                return {
                    ...k,
                    currentEnrollment: countResult[0]?.count || 0,
                };
            })
        );

        return {
            mataKuliah: {
                id: mataKuliah.id,
                kode: mataKuliah.kode,
                nama: mataKuliah.nama,
                sks: mataKuliah.sks,
                semester: mataKuliah.semester,
            },
            dosen: dosenResult[0] || null,
            kelas: kelasWithEnrollment,
        };
    }

    @Post()
    @Roles('DOSEN')
    async create(
        @Body() data: {
            kode: string;
            nama: string;
            sks: number;
            semester: number;
            dosisId?: string;
            dosenId?: string;
        },
        @Request() req: any
    ) {
        // Create mata kuliah
        const mataKuliah = await this.matakuliahRepository.create({
            kode: data.kode,
            nama: data.nama,
            sks: data.sks,
            semester: data.semester,
            dosenId: data.dosenId || data.dosisId || req.user.id,
        });
        
        // Auto-create default kelas "A" for this mata kuliah
        await this.kelasRepository.create({
            mataKuliahId: mataKuliah.id,
            nama: 'A',
            quota: 40,  // Default quota
            ruangan: null,
            hari: null,
            jamMulai: null,
            jamSelesai: null,
            dosenId: data.dosenId || data.dosisId || req.user.id,
        });
        
        return mataKuliah;
    }

    @Patch(':id')
    @Roles('DOSEN')
    async update(
        @Param('id') id: string,
        @Body() data: Partial<{
            kode: string;
            nama: string;
            sks: number;
            semester: number;
            dosisId: string;
        }>
    ) {
        return this.matakuliahRepository.update(id, data);
    }

    @Delete(':id')
    @Roles('DOSEN')
    async delete(@Param('id') id: string) {
        await this.matakuliahRepository.delete(id);
        return { message: 'Mata kuliah berhasil dihapus' };
    }
}
