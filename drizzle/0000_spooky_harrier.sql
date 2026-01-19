CREATE TABLE "korisnik" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"lozinka" text NOT NULL,
	"ime" text NOT NULL,
	"prezime" text NOT NULL,
	"kreiran" timestamp DEFAULT now()
);
