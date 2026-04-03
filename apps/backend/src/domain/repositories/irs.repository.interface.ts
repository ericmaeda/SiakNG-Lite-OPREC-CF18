export interface IIrsRepository {
    // Find operations
    findById(id: string): Promise<any | null>;
    findByMahasiswaId(mahasiswaId: string, semester?: number, tahunAkademik?: string): Promise<any[]>;
    findByKelasId(kelasId: string): Promise<any[]>;
    findByMahasiswaAndKelas(mahasiswaId: string, kelasId: string): Promise<any | null>;
    
    // Check if mahasiswa already enrolled in any kelas of the same mata kuliah
    findByMahasiswaAndMataKuliah(mahasiswaId: string, mataKuliahId: string): Promise<any | null>;
    
    // Calculate total SKS for a semester
    getTotalSks(mahasiswaId: string, semester: number, tahunAkademik: string): Promise<number>;
    
    // CRUD operations
    create(data: {
        kelasId: string;
        mahasiswaId: string;
        semester: number;
        tahunAkademik: string;
    }): Promise<any>;
    
    updateStatus(id: string, status: string, isApproved?: boolean): Promise<any>;
    
    delete(id: string): Promise<void>;
    deleteByMahasiswaAndKelas(mahasiswaId: string, kelasId: string): Promise<void>;
    
    // Count enrollments
    countByKelasId(kelasId: string): Promise<number>;
}

export const IRS_REPOSITORY = Symbol('IRS_REPOSITORY');
