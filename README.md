Ovo je web aplikacija `"SveUsluge"`, namenjena oglašavanju uslužnih aktivnosti

## O aplikaciji

Aplikacija `"SveUsluge"` okuplja na jednom mestu ljude koji traže usluge i pružaoce usluga (samostalce i preduzeća)

Šta omogućava aplikacija?

*Za Korisnike Usluga:*
- Kreiranje Naloga
- Pretragu i pregled Usluga
- Pretragu i pregled Profila pružaoca
- Rezervaciju termina
- Ostavljanje recenzija

*Za Pružaoce Usluga:*
- Kreiranje Profila
- Postavljanje i brisanje Oglasa
- Praćenje Ocena i Recenzija
- Praćenje rezervacija
- Upravljanje zaposlenima (samo preduzeća)

## Pokretanje aplikacije

Preduslov za pokretanje aplikacije je da na lokalnom računaru budu instalirani Git i Docker. Najpre je potrebno da pomoću Git-a povučemo izvorni kod aplikacije sa GitHub-a u lokalni repozitorijum. Zatim, otvorimo folder koji smo povukli kroz Visual Studio Code, kopiramo .env.template fajl i preimenujemo ga u .env. U .env fajlu postavimo odgovarajuće parametre za pristup bazi (odgovarajući USER, PASSWORD i DATABASE). 

U terminal unosimo sledeću komandu:

```bash
docker compose up --build
```

Prethodno navedenom komandom pokreću se dva kontejnera. Najpre se pokreće kontejner u kojem se nalazi servis `usluge-db` (podiže PostgreSQL bazu podataka), a zatim i kontejner u kojem se nalazi servis `usluge-app` (instalira potrebne zavisnosti, izvršava migracije, seeduje podatke, pokreće aplikaciju).

Nakon uspešnog pokretanja kontejnera, aplikaciju je moguće otvoriti pristupom sledećoj URL adresi: [http://localhost:3000](http://localhost:3000)

