import { pgTable, uuid, varchar, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { kelas } from './kelas.schema';

/**
 * JadwalKelas - Individual session schedule for a kelas
 * Satu kelas bisa memiliki multiple sesi pertemuan dengan hari/waktu berbeda
 * Example:
 *   - Kelas "A" MK "Algoritma" -> Senin 08:00-10:00
 *   - Kelas "A" MK "Algoritma" -> Kamis 10:00-12:00
 */
export const jadwalKelas = pgTable('jadwal_kelas', {
    id: uuid('id').primaryKey().defaultRandom(),
    kelasId: uuid('kelas_id')
        .notNull()
        .references(() => kelas.id, { onDelete: 'cascade' }),
    hari: varchar('hari', { length: 10 }).notNull(), // "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"
    jamMulai: varchar('jam_mulai', { length: 5 }).notNull(), // "08:00"
    jamSelesai: varchar('jam_selesai', { length: 5 }).notNull(), // "10:00"
    ruangan: varchar('ruangan', { length: 50 }), // "Ruang 101"
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const jadwalKelasRelations = relations(jadwalKelas, ({ one }) => ({
    kelas: one(kelas, {
        fields: [jadwalKelas.kelasId],
        references: [kelas.id],
    }),
}));