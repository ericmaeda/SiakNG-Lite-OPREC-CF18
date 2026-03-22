import { MataKuliahEntity } from "../entities/matakuliah.entity";

export interface IMataKuliahRepository {
    findById(id: string): Promise<MataKuliahEntity | null>;
    findByKode(kode: string): Promise<MataKuliahEntity | null>;
    findByNama(nama: string): Promise<MataKuliahEntity | null>;
    create(data: Omit<MataKuliahEntity, 'id'>): Promise<MataKuliahEntity>;
    update(id: string, data: Partial<MataKuliahEntity>): Promise<MataKuliahEntity>;
    delete(id: string): Promise<void>;
}
