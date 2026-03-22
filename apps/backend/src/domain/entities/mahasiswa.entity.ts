export class MahasiswaEntity {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public npm: string,
        public prodi: string,
        public fakultas: string,
        public angkatan: number,
        public ipk: string,
        public semester: number
    ) {}
}