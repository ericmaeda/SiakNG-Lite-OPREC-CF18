export interface IJadwalKelasRepository {
    // Find operations
    findById(id: string): Promise<any | null>;
    findByKelasId(kelasId: string): Promise<any[]>;
    
    // Check if a specific schedule conflicts with existing schedules for a given mahasiswa
    // Returns conflicting jadwal if any exists
    findConflictingJadwal(
        mahasiswaId: string,
        semester: number,
        tahunAkademik: string,
        targetKelasId: string,
        targetJadwalId?: string
    ): Promise<any | null>;
    
    // CRUD operations
    create(data: {
        kelasId: string;
        hari: string;
        jamMulai: string;
        jamSelesai: string;
        ruangan?: string;
    }): Promise<any>;
    
    update(id: string, data: Partial<{
        hari: string;
        jamMulai: string;
        jamSelesai: string;
        ruangan: string;
    }>): Promise<any>;
    
    delete(id: string): Promise<void>;
    
    // Get all schedules for a mahasiswa in a given semester
    findByMahasiswaSemester(
        mahasiswaId: string,
        semester: number,
        tahunAkademik: string
    ): Promise<any[]>;
}

export const JADWAL_KELAS_REPOSITORY = Symbol('JADWAL_KELAS_REPOSITORY');