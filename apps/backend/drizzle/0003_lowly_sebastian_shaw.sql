CREATE TABLE "jadwal_kelas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kelas_id" uuid NOT NULL,
	"hari" varchar(10) NOT NULL,
	"jam_mulai" varchar(5) NOT NULL,
	"jam_selesai" varchar(5) NOT NULL,
	"ruangan" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "jadwal_kelas" ADD CONSTRAINT "jadwal_kelas_kelas_id_kelas_id_fk" FOREIGN KEY ("kelas_id") REFERENCES "public"."kelas"("id") ON DELETE cascade ON UPDATE no action;