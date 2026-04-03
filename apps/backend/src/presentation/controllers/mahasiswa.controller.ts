import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { JwtAuthGuard } from 'src/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '../guards/role.guard';
import { Roles } from '../guards/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DrizzleProvider } from 'src/infrastructure/database/drizzle.provider';
import { eq } from 'drizzle-orm';
import { mahasiswa, users } from 'src/infrastructure/database/schema';
import { NotFoundException } from '@nestjs/common';

@ApiTags('mahasiswa')
@ApiBearerAuth()
@Controller('mahasiswa')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MahasiswaController {
    constructor(
        @Inject('DRIZZLE')
        private readonly drizzle: ReturnType<typeof DrizzleProvider.useFactory>
    ) {}

    @Get(':id/profile')
    @Roles('DOSEN', 'ADMIN')
    @ApiOperation({ summary: 'Lihat profil mahasiswa' })
    @ApiResponse({ status: 200, description: 'Profil mahasiswa' })
    async getProfile(@Param('id') id: string) {
        const result = await this.drizzle
            .select({
                id: mahasiswa.id,
                npm: mahasiswa.npm,
                prodi: mahasiswa.prodi,
                fakultas: mahasiswa.fakultas,
                angkatan: mahasiswa.angkatan,
                ipk: mahasiswa.ipk,
                semester: mahasiswa.semester,
                maxSks: mahasiswa.maxSks,
                userId: users.id,
                nama: users.nama,
                email: users.email,
            })
            .from(mahasiswa)
            .leftJoin(users, eq(mahasiswa.userId, users.id))
            .where(eq(mahasiswa.id, id))
            .limit(1);

        if (!result.length) {
            throw new NotFoundException('Mahasiswa tidak ditemukan');
        }

        return result[0];
    }
}
