import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtTokenService } from './jwt.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PasswordService } from './password.service';

@Module({
    imports: [
        ConfigModule.forRoot(),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',
                signOptions: {
                    expiresIn: '7d' as const,
                },
            }),
        }),
    ],
    providers: [JwtTokenService, JwtStrategy, JwtAuthGuard, PasswordService],
    exports: [JwtTokenService, JwtModule, JwtAuthGuard, PasswordService, ConfigModule],
})

export class AuthModule {}
