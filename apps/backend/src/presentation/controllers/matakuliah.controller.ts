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

@ApiTags('matakuliah')
@ApiBearerAuth()
@Controller('matakuliah')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MatakuliahController {
    constructor(
        @Inject(MATAKULIAH_REPOSITORY)
        private readonly matakuliahRepository: IMataKuliahRepository,
        @Inject(KELAS_REPOSITORY)
        private readonly kelasRepository: IKelasRepository
    ) {}

    @Get()
    async findAll() {
        return this.matakuliahRepository.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.matakuliahRepository.findById(id);
    }

    @Post()
    @Roles('DOSEN')
    async create(
        @Body() data: {
            kode: string;
            nama: string;
            sks: number;
            semester: number;
            dosenId: string;
        },
        @Request() req: any
    ) {
        // Create mata kuliah
        const mataKuliah = await this.matakuliahRepository.create(data);
        
        // Auto-create default kelas "A" for this mata kuliah
        await this.kelasRepository.create({
            mataKuliahId: mataKuliah.id,
            nama: 'A',
            quota: 40,  // Default quota
            ruangan: null,
            hari: null,
            jamMulai: null,
            jamSelesai: null,
            dosenId: data.dosenId || req.user.id,
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
            dosenId: string;
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
