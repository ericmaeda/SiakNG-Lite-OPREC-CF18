CREATE TABLE "matakuliah_mahasiswa" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mata_kuliah_id" uuid NOT NULL,
	"mahasiswa_id" uuid NOT NULL,
	"nilai" varchar(2),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kelas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mata_kuliah_id" uuid NOT NULL,
	"nama" varchar(20) NOT NULL,
	"quota" integer NOT NULL,
	"ruangan" varchar(50),
	"hari" varchar(10),
	"jam_mulai" varchar(5),
	"jam_selesai" varchar(5),
	"dosen_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "irs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kelas_id" uuid NOT NULL,
	"mahasiswa_id" uuid NOT NULL,
	"semester" integer NOT NULL,
	"tahun_akademik" varchar(9) NOT NULL,
	"status" varchar(20) DEFAULT 'aktif' NOT NULL,
	"is_approved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "mahasiswa" ADD COLUMN "max_sks" integer DEFAULT 24 NOT NULL;--> statement-breakpoint
ALTER TABLE "matakuliah_mahasiswa" ADD CONSTRAINT "matakuliah_mahasiswa_mata_kuliah_id_mata_kuliah_id_fk" FOREIGN KEY ("mata_kuliah_id") REFERENCES "public"."mata_kuliah"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matakuliah_mahasiswa" ADD CONSTRAINT "matakuliah_mahasiswa_mahasiswa_id_users_id_fk" FOREIGN KEY ("mahasiswa_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kelas" ADD CONSTRAINT "kelas_mata_kuliah_id_mata_kuliah_id_fk" FOREIGN KEY ("mata_kuliah_id") REFERENCES "public"."mata_kuliah"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kelas" ADD CONSTRAINT "kelas_dosen_id_users_id_fk" FOREIGN KEY ("dosen_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "irs" ADD CONSTRAINT "irs_kelas_id_kelas_id_fk" FOREIGN KEY ("kelas_id") REFERENCES "public"."kelas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "irs" ADD CONSTRAINT "irs_mahasiswa_id_mahasiswa_id_fk" FOREIGN KEY ("mahasiswa_id") REFERENCES "public"."mahasiswa"("id") ON DELETE cascade ON UPDATE no action;