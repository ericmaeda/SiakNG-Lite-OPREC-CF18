import { pgTable, uuid, varchar, timestamp, integer, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './user.schema';
import { matakuliah } from './matakuliah.schema';

export const matakuliahMahasiswa = pgTable('matakuliah_mahasiswa', {
    id: uuid('id').primaryKey().defaultRandom(),
    mataKuliahId: uuid('mata_kuliah_id')
        .notNull()
        .references(() => matakuliah.id, { onDelete: 'cascade' }),
    mahasiswaId: uuid('mahasiswa_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    nilai: varchar('nilai', { length: 2 }),  // A, B, C, D, E
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const matakuliahMahasiswaRelations = relations(matakuliahMahasiswa, ({ one }) => ({
    mataKuliah: one(matakuliah, {
        fields: [matakuliahMahasiswa.mataKuliahId],
        references: [matakuliah.id],
    }),
    mahasiswa: one(users, {
        fields: [matakuliahMahasiswa.mahasiswaId],
        references: [users.id],
    }),
}));
