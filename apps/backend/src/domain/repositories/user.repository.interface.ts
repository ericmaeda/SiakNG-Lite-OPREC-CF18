import { UserEntity } from '../entities/user.entity';

export interface IUserRepository {
    findById(id: string): Promise<UserEntity | null>;
    findByEmail(email: string): Promise<UserEntity | null>;
    create(data: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserEntity>;
    update(id: string, data: Partial<UserEntity>): Promise<UserEntity>;
    delete(id: string): Promise<void>;
}


export const USER_REPOSITORY = Symbol('USER_REPOSITORY');