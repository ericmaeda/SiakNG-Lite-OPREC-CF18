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
        private readonly matakuliahRepository: IMataKuliahRepository
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
        return this.matakuliahRepository.create(data);
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
