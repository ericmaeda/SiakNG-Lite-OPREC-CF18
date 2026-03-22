export class DosenEntity {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public nip: string,
        public department: string,
        public fakultas: string,
        public jabatan: string | null
    ) {}
}