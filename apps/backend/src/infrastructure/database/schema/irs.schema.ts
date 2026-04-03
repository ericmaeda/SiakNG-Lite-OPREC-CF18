import { pgTable, uuid, varchar, integer, timestamp, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { kelas } from './kelas.schema';
import { mahasiswa } from './user.schema';

export const irs = pgTable('irs', {
    id: uuid('id').primaryKey().defaultRandom(),
    kelasId: uuid('kelas_id')
        .notNull()
        .references(() => kelas.id, { onDelete: 'cascade' }),
    mahasiswaId: uuid('mahasiswa_id')
        .notNull()
        .references(() => mahasiswa.id, { onDelete: 'cascade' }),
    semester: integer('semester').notNull(), // e.g., 1, 2, 3, etc.
    tahunAkademik: varchar('tahun_akademik', { length: 9 }).notNull(), // e.g., "2024/2025"
    status: varchar('status', { length: 20 }).notNull().default('aktif'), // aktif, dropped, approved
    isApproved: boolean('is_approved').notNull().default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
