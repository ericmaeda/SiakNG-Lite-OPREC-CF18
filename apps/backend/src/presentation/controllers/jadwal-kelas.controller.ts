import { Controller, Post, Delete, Get, Patch, Body, Param, UseGuards, Request, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { IJadwalKelasRepository, JADWAL_KELAS_REPOSITORY } from 'src/domain/repositories/jadwal-kelas.repository.interface';
import { JwtAuthGuard } from 'src/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '../guards/role.guard';
import { Roles } from '../guards/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Jadwal Kelas')
@ApiBearerAuth()
@Controller('jadwal-kelas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JadwalKelasController {
    constructor(
        @Inject(JADWAL_KELAS_REPOSITORY)
        private readonly jadwalRepo: IJadwalKelasRepository,
    ) {}

    @Get('kelas/:kelasId')
    @ApiOperation({ summary: 'Get all schedules for a kelas' })
    @ApiResponse({ status: 200, description: 'List of jadwal for kelas' })
    async getJadwalByKelas(@Param('kelasId') kelasId: string) {
        const jadwalList = await this.jadwalRepo.findByKelasId(kelasId);
        return {
            kelasId,
            count: jadwalList.length,
            jadwal: jadwalList,
        };
    }

    @Post()
    @Roles('DOSEN')
    @ApiOperation({ summary: 'Create new jadwal for a kelas' })
    @ApiResponse({ status: 201, description: 'Jadwal created' })
    async createJadwal(
        @Body() data: {
            kelasId: string;
            hari: string;
            jamMulai: string;
            jamSelesai: string;
            ruangan?: string;
        }
    ) {
        const jadwal = await this.jadwalRepo.create(data);
        return {
            message: 'Jadwal berhasil dibuat',
            jadwal,
        };
    }

    @Patch(':id')
    @Roles('DOSEN')
    @ApiOperation({ summary: 'Update jadwal' })
    @ApiResponse({ status: 200, description: 'Jadwal updated' })
    async updateJadwal(
        @Param('id') id: string,
        @Body() data: Partial<{
            hari: string;
            jamMulai: string;
            jamSelesai: string;
            ruangan: string;
        }>
    ) {
        const updated = await this.jadwalRepo.update(id, data);
        if (!updated) {
            throw new NotFoundException('Jadwal tidak ditemukan');
        }
        return {
            message: 'Jadwal berhasil diupdate',
            jadwal: updated,
        };
    }

    @Delete(':id')
    @Roles('DOSEN')
    @ApiOperation({ summary: 'Delete jadwal' })
    @ApiResponse({ status: 200, description: 'Jadwal deleted' })
    async deleteJadwal(@Param('id') id: string) {
        await this.jadwalRepo.delete(id);
        return { message: 'Jadwal berhasil dihapus' };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get jadwal by ID' })
    @ApiResponse({ status: 200, description: 'Jadwal detail' })
    async getJadwalById(@Param('id') id: string) {
        const jadwal = await this.jadwalRepo.findById(id);
        if (!jadwal) {
            throw new NotFoundException('Jadwal tidak ditemukan');
        }
        return jadwal;
    }
}