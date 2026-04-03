import { pgTable, uuid, varchar, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './user.schema';
import { matakuliah } from './matakuliah.schema';

export const kelas = pgTable('kelas', {
    id: uuid('id').primaryKey().defaultRandom(),
    mataKuliahId: uuid('mata_kuliah_id')
        .notNull()
        .references(() => matakuliah.id, { onDelete: 'cascade' }),  // cascade delete when mata_kuliah deleted
    nama: varchar('nama', { length: 20 }).notNull(),
    quota: integer('quota').notNull(),
    ruangan: varchar('ruangan', { length: 50 }),
    hari: varchar('hari', { length: 10 }),
    jamMulai: varchar('jam_mulai', { length: 5 }),
    jamSelesai: varchar('jam_selesai', { length: 5 }),
    dosenId: uuid('dosen_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const kelasRelations = relations(kelas, ({ one }) => ({
    mataKuliah: one(matakuliah, {
        fields: [kelas.mataKuliahId],
        references: [matakuliah.id],
    }),
    dosen: one(users, {
        fields: [kelas.dosenId],
        references: [users.id],
    }),
}));
