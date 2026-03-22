import { DosenEntity } from "../entities/dosen.entity";

export interface IDosenRepository {
    findById(id: string): Promise<DosenEntity | null>;
    findByUserId(userId: string): Promise<DosenEntity | null>;
    findByNip(nip: string): Promise<DosenEntity | null>;
    create(data: Omit<DosenEntity, 'id'>): Promise<DosenEntity>;
    update(id: string, data: Partial<DosenEntity>): Promise<DosenEntity>;
    delete(id: string): Promise<void>
}

export const DOSEN_REPOSITORY = Symbol('DOSEN_REPOSITORY');