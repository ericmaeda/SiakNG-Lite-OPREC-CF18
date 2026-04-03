ALTER TABLE "mahasiswa" ALTER COLUMN "ipk" SET DATA TYPE numeric(3, 2);--> statement-breakpoint
ALTER TABLE "mahasiswa" ALTER COLUMN "ipk" SET DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "mahasiswa" ALTER COLUMN "semester" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "mahasiswa" ALTER COLUMN "semester" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "mata_kuliah" ADD COLUMN "kapasitas" integer NOT NULL;