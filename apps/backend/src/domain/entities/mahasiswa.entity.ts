export class MahasiswaEntity {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public npm: string,
        public prodi: string,
        public fakultas: string,
        public angkatan: string,
        public ipk: number,
        public semester: number
    ) {}
}