export interface IKelasRepository {
    findAll(): Promise<any[]>;
    findById(id: string): Promise<any | null>;
    findByMataKuliahId(mataKuliahId: string): Promise<any[]>;
    findByDosenId(dosenId: string): Promise<any[]>;
    create(data: {
        mataKuliahId: string;
        nama: string;
        quota: number;
        ruangan?: string;
        hari?: string;
        jamMulai?: string;
        jamSelesai?: string;
        dosenId: string;
    }): Promise<any>;
    update(id: string, data: Partial<{
        nama: string;
        quota: number;
        ruangan: string;
        hari: string;
        jamMulai: string;
        jamSelesai: string;
    }>): Promise<any>;
    delete(id: string): Promise<void>;
    getCurrentEnrollmentCount(kelasId: string): Promise<number>;
}

export const KELAS_REPOSITORY = Symbol('KELAS_REPOSITORY');
