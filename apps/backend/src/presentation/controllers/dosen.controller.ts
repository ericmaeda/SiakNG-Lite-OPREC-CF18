import { 
    Controller, 
    Get, 
    Post, 
    Patch, 
    Delete, 
    Body,
    Param, 
    UseGuards,
    Request,
    Inject
} from '@nestjs/common';
import { IDosenRepository, DOSEN_REPOSITORY } from 'src/domain/repositories/dosen.repository.interface';
import { IUserRepository, USER_REPOSITORY } from 'src/domain/repositories/user.repository.interface';
import { RolesGuard } from '../guards/role.guard';
import { Roles } from '../guards/roles.decorator';
import { JwtAuthGuard } from 'src/infrastructure/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('dosen')
@ApiBearerAuth()
@Controller('dosen')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DosenController {
    constructor(
        @Inject(DOSEN_REPOSITORY)
        private readonly dosenRepository: IDosenRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository
    ) {}

    @Get()
    async findAll() {
        const dosenList = await this.dosenRepository.findAll();
        
        // Join with user to get name
        const result = await Promise.all(
            dosenList.map(async (dosen) => {
                const user = await this.userRepository.findById(dosen.userId);
                return {
                    ...dosen,
                    nama: user?.nama || 'Unknown'
                };
            })
        );
        
        return result;
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const dosen = await this.dosenRepository.findById(id);
        if (!dosen) return null;
        
        const user = await this.userRepository.findById(dosen.userId);
        return {
            ...dosen,
            nama: user?.nama || 'Unknown'
        };
    }
}
