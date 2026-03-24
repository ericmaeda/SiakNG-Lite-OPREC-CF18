import { hash, verify } from '@node-rs/argon2';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordService {
    async hash(password: string): Promise<string> {
        return await hash(password);
    }
    
    async verify(hash: string, password: string): Promise<boolean> {
        return await verify(hash, password);
    }
}
