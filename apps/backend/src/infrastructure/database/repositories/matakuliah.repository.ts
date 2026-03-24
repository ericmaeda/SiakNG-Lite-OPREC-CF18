import { IMataKuliahRepository } from "src/domain/repositories/matakuliah.repository.interface";
import { DrizzleProvider } from "../drizzle.provider";
import { Inject } from "@nestjs/common";
import { MataKuliahEntity } from "src/domain/entities/matakuliah.entity";
import { matakuliah } from "../schema";
import { eq } from "drizzle-orm";

export class MataKuliahRepository implements IMataKuliahRepository {
    constructor(
        @Inject('DRIZZLE')
        private readonly drizzle: ReturnType<typeof DrizzleProvider.useFactory>
    ) {}

    async findByKode(kode: string): Promise<MataKuliahEntity | null> {
        const mk = await this.drizzle
            .select()
            .from(matakuliah)
            .where(eq(matakuliah.kode, kode))
            .limit(1);

        if (mk.length === 0) {
            return null;
        }
        return this.mapToEntity(mk[0]);
    }

    async findByNama(nama: string): Promise<MataKuliahEntity | null> {
        const mk = await this.drizzle
            .select()
            .from(matakuliah)
            .where(eq(matakuliah.nama, nama))
            .limit(1);

        if (mk.length === 0) {
            return null;
        }
        return this.mapToEntity(mk[0]);
    }

    async findById(id: string): Promise<MataKuliahEntity | null> {
        const mk = await this.drizzle
            .select()
            .from(matakuliah)
            .where(eq(matakuliah.id, id))
            .limit(1);
        
        if (mk.length === 0) {
            return null;
        }
        return this.mapToEntity(mk[0]);
    }

    async create(data: {
        kode: string;
        nama: string;
        sks: number;
        semester: number;
        dosenId: string;
    }): Promise<MataKuliahEntity> {
        const result = await this.drizzle
            .insert(matakuliah)
            .values({
                kode: data.kode,
                nama: data.nama,
                sks: data.sks,
                semester: data.semester,
                dosenId: data.dosenId,
            })
            .returning();

        return this.mapToEntity(result[0]);
    }

    async update(id: string, data: Partial<{
        kode: string;
        nama: string;
        sks: number;
        semester: number;
        dosenId: string;
    }>): Promise<MataKuliahEntity> {
        const updateData: Record<string, unknown> = { updatedAt: new Date() };

        if (data.kode) updateData.kode = data.kode;
        if (data.nama) updateData.nama = data.nama;
        if (data.sks) updateData.sks = data.sks;
        if (data.semester) updateData.semester = data.semester;
        if (data.dosenId) updateData.dosenId = data.dosenId;

        const result = await this.drizzle
            .update(matakuliah)
            .set(updateData)
            .where(eq(matakuliah.id, id))
            .returning();

        if (result.length === 0) {
            throw new Error('MataKuliah not found');
        }
        return this.mapToEntity(result[0]);
    }

    async delete(id: string): Promise<void> {
        await this.drizzle
            .delete(matakuliah)
            .where(eq(matakuliah.id, id));
    }

    private mapToEntity(data: {
        id: string;
        kode: string;
        dosenId: string;
        createdAt: Date;
        updatedAt: Date;
        nama: string;
        sks: number;
        semester: number;
    }): MataKuliahEntity {
        return new MataKuliahEntity(
            data.id,
            data.kode,
            data.dosenId,
            data.createdAt,
            data.updatedAt,
            data.nama,
            data.sks,
            data.semester
        );
    }
}
