CREATE TYPE "public"."user_role" AS ENUM('MAHASISWA', 'DOSEN', 'ADMIN');--> statement-breakpoint
CREATE TABLE "admin" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"access_level" varchar(1) DEFAULT '1' NOT NULL,
	"unit" varchar(100),
	CONSTRAINT "admin_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "dosen" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"nip" varchar(20) NOT NULL,
	"department" varchar(50) NOT NULL,
	"fakultas" varchar(50) NOT NULL,
	"jabatan" varchar(50),
	CONSTRAINT "dosen_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "dosen_nip_unique" UNIQUE("nip")
);
--> statement-breakpoint
CREATE TABLE "mahasiswa" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"npm" varchar(10) NOT NULL,
	"prodi" varchar(50) NOT NULL,
	"fakultas" varchar(50) NOT NULL,
	"angkatan" varchar(4) NOT NULL,
	"ipk" varchar(4) DEFAULT '0.00' NOT NULL,
	"semester" varchar(2) DEFAULT '1' NOT NULL,
	CONSTRAINT "mahasiswa_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "mahasiswa_npm_unique" UNIQUE("npm")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" varchar(100) NOT NULL,
	"email" varchar(50) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role" "user_role" NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "mata_kuliah" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kode" varchar(6) NOT NULL,
	"nama" varchar(100) NOT NULL,
	"sks" integer NOT NULL,
	"semester" integer NOT NULL,
	"dosen_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mata_kuliah_kode_unique" UNIQUE("kode")
);
--> statement-breakpoint
ALTER TABLE "admin" ADD CONSTRAINT "admin_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dosen" ADD CONSTRAINT "dosen_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mahasiswa" ADD CONSTRAINT "mahasiswa_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mata_kuliah" ADD CONSTRAINT "mata_kuliah_dosen_id_users_id_fk" FOREIGN KEY ("dosen_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;