export class MataKuliahEntity {
    constructor(
        public readonly id: string,
        public readonly kode: string,
        public readonly dosenId: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public nama: string,
        public sks: number,
        public semester: number,
        public kapasitas: number
    ) {}
}