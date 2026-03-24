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
import { IMataKuliahRepository } from 'src/domain/repositories/matakuliah.repository.interface';
import { RolesGuard } from '../guards/role.guards';
import { Roles } from '../guards/roles.decorator';
import { UserRole } from 'src/domain/entities/user.entity';

@Controller('matakuliah')
@UseGuards(RolesGuard)
export class MatakuliahController {
    constructor(
        @Inject('MATAKULIAH_REPOSITORY')
        private readonly matakuliahRepository: IMataKuliahRepository
    ) {}

    @Get()
    async findAll() {
        // TODO: Implement findAll
        return [];
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
