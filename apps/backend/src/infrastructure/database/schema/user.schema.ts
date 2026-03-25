import { pgTable, uuid, varchar, integer, numeric, boolean, timestamp, pgEnum} from 'drizzle-orm/pg-core';
import {relations} from 'drizzle-orm';

export const userRoleEnum = pgEnum('user_role', ['MAHASISWA', 'DOSEN', 'ADMIN']);

// Database schema

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    nama: varchar('nama', {length:100}).notNull(),
    email: varchar('email', {length:50}).unique().notNull(),
    passwordHash: varchar('password_hash', {length:255}).notNull(),
    role: userRoleEnum('role').notNull(),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const mahasiswa = pgTable('mahasiswa', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
        .notNull()
        .unique()
        .references(() => users.id, {onDelete: 'cascade'}),
    npm: varchar('npm', { length: 10 }).unique().notNull(),
    prodi: varchar('prodi', { length: 50 }).notNull(),
    fakultas: varchar('fakultas', { length: 50 }).notNull(),
    angkatan: varchar('angkatan', { length: 4 }).notNull(),
    ipk: numeric('ipk', { precision: 3, scale: 2 }).notNull().default('0.00'),
    semester: integer('semester').notNull().default(1)
});

export const dosen = pgTable('dosen', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
        .notNull()
        .unique()
        .references(() => users.id, {onDelete: 'cascade'}),
    nip: varchar('nip', { length: 20 }).unique().notNull(),
    department: varchar('department', { length: 50 }).notNull(),
    fakultas: varchar('fakultas', { length: 50 }).notNull(),
    jabatan: varchar('jabatan', { length: 50 }),
});

export const admin = pgTable('admin', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
        .notNull()
        .unique()
        .references(() => users.id, { onDelete: 'cascade' }),
    accessLevel: varchar('access_level', { length: 1 }).notNull().default('1'),
    unit: varchar('unit', { length: 100 }),
});

// Relations

export const usersRelations = relations(users, ({ one }) => ({
  mahasiswa: one(mahasiswa, { fields: [users.id], references: [mahasiswa.userId] }),
  dosen:     one(dosen,     { fields: [users.id], references: [dosen.userId]     }),
  admin:     one(admin,    { fields: [users.id], references: [admin.userId]    }),
}));

export const mahasiswaRelations = relations(mahasiswa, ({ one }) => ({
  user: one(users, { fields: [mahasiswa.userId], references: [users.id] }),
}));

export const dosenRelations = relations(dosen, ({ one }) => ({
  user: one(users, { fields: [dosen.userId], references: [users.id] }),
}));

export const adminsRelations = relations(admin, ({ one }) => ({
  user: one(users, { fields: [admin.userId], references: [users.id] }),
}));