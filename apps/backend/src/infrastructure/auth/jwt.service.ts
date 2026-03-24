import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

export interface JwtPayload {
    sub: string;      // user ID
    email: string;
    role: 'MAHASISWA' | 'DOSEN' | 'ADMIN';
}

@Injectable()
export class JwtTokenService {
    constructor(private readonly jwtService: NestJwtService) {}
  
    // Generate JWT token for user 
    generateToken(payload: JwtPayload): string {
        return this.jwtService.sign(payload);
    }

    
    // Verify and decode JWT token 
    verifyToken(token: string): JwtPayload {
        return this.jwtService.verify<JwtPayload>(token);
    }

    
    // Decode token without verification (for debugging)
    decodeToken(token: string): JwtPayload | null {
        return this.jwtService.decode(token);
    }
}
