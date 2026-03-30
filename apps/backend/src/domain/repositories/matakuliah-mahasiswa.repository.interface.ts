export interface IMatakuliahMahasiswaRepository {
    findByMataKuliahId(mataKuliahId: string): Promise<any[]>;
    findByMahasiswaId(mahasiswaId: string): Promise<any[]>;
    findByBothIds(mataKuliahId: string, mahasiswaId: string): Promise<any | null>;
    create(data: {
        mataKuliahId: string;
        mahasiswaId: string;
        nilai?: string;
    }): Promise<any>;
    updateNilai(id: string, nilai: string): Promise<any>;
    delete(id: string): Promise<void>;
    deleteByBothIds(mataKuliahId: string, mahasiswaId: string): Promise<void>;
    countByMataKuliahId(mataKuliahId: string): Promise<number>;
    countByMahasiswaId(mahasiswaId: string): Promise<number>;
}

export const MATAKULIAH_MAHASISWA_REPOSITORY = Symbol('MATAKULIAH_MAHASISWA_REPOSITORY');
