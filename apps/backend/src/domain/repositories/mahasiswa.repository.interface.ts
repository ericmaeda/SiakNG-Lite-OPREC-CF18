import { MahasiswaEntity } from "../entities/mahasiswa.entity";

export interface IMahasiswaRepository {
    findById(id: string): Promise<MahasiswaEntity | null>;
    findByUserId(userId: string): Promise<MahasiswaEntity | null>;
    findByNpm(npm: string): Promise<MahasiswaEntity | null>;
    create(data: Omit<MahasiswaEntity, 'id'>): Promise<MahasiswaEntity>;
    update(id: string, data: Partial<MahasiswaEntity>): Promise<MahasiswaEntity>;
    delete(id: string): Promise<void>;
}


export const MAHASISWA_REPOSITORY = Symbol('MAHASISWA_REPOSITORY');