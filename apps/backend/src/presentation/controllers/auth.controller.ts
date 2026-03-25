import { Controller, Post, Body, UnauthorizedException, Inject } from "@nestjs/common";
import { JwtTokenService } from "src/infrastructure/auth/jwt.service";
import { PasswordService } from "src/infrastructure/auth/password.service";
import { UserRepository } from "src/infrastructure/database/repositories/user.repository";
import { USER_REPOSITORY } from "src/domain/repositories/user.repository.interface";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly jwtService: JwtTokenService,
        private readonly passwordService: PasswordService,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository
    ) {}

    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({ status: 200, description: 'Login sukses!' })
    @ApiResponse({ status: 401, description: 'Kredensial tidak valid!' })
    @Post('login')
    async login(@Body() body: {
        email: string;
        password: string;
    }) {
        const user = await this.userRepository.findByEmail(body.email);

        if (!user) {
            throw new UnauthorizedException('Email atau password salah!');
        }

        const isValid = await this.passwordService.verify(user.passwordHash, body.password);

        if (!isValid) {
            throw new UnauthorizedException('Email atau password salah!')
        }

        const token = this.jwtService.generateToken({
            sub: user.id,
            email: user.email,
            role: user.role
        });

        return { access_token: token };
    }

    @ApiOperation({ summary: 'Register new user' })
    @ApiResponse({ status: 201, description: 'Registrasi berhasil!' })
    @Post('register')
    async register(@Body() body: {
        email: string;
        password: string;
        nama: string;
        role: 'MAHASISWA' | 'DOSEN' | 'ADMIN';
    }) {
        const existing = await this.userRepository.findByEmail(body.email);
        if (existing) {
            throw new Error('Email sudah terdaftar!');
        }

        const passwordHash = await this.passwordService.hash(body.password);

        const user = await this.userRepository.create({
            email: body.email,
            nama: body.nama,
            passwordHash,
            role: body.role,
            isActive: true,
        });

        const token = this.jwtService.generateToken({
            sub: user.id,
            email: user.email,
            role: user.role
        });

        return {
            access_token: token,
            user: {
                id: user.id,
                email: user.email,
                nama: user.nama,
                role: user.role
            }
        }
    }
}