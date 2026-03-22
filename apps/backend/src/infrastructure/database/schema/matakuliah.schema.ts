import { pgTable, uuid, varchar, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './user.schema';

export const matakuliah = pgTable('mata_kuliah', {
    id: uuid('id').primaryKey().defaultRandom(),
    kode: varchar('kode', { length: 6 }).unique().notNull(),
    nama: varchar('nama', { length: 100 }).notNull(),
    sks: integer('sks').notNull(),
    semester: integer('semester').notNull(),
    // Relasi ke DOSEN yang membuat/mengelola mata kuliah
    dosenId: uuid('dosen_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const matakuliahRelations = relations(matakuliah, ({ one }) => ({
    dosen: one(users, {
        fields: [matakuliah.dosenId],
        references: [users.id],
    }),
}));