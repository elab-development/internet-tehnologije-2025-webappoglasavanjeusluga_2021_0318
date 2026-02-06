import Navbar from '@/components/Navbar'
import React from 'react'
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="bg-linear-to-r from-blue-400 via-blue-200 to-yellow-100">
        <Navbar></Navbar>
        <div className="mx-10 lg:mx-40 my-5">
            <h1 className='text-center font-semibold text-xl md:text-2xl mb-5 text-blue-900'>Upoznajte platformu SveUsluge - Vaš Pouzdani Partner u Oglašavanju</h1>
            <h2 className='font-semibold md:text-xl my-2 text-blue-950'>Naša Priča</h2>
            <p className='mb-2'>  Platforma <b>SveUsluge</b> je kreirana s idejom da postane jedinstveno mesto gde pojedinci i firme mogu lako da pronađu i predstave svoje usluge.
                 Naša platforma omogućava korisnicima da se povežu i međusobno pomognu u pronalaženju 
                 pouzdanih rešenja za svoje potrebe. Kroz inovativan pristup, posvećenost korisnicima i pouzdane metode oglašavanja, <b>SveUsluge</b> se 
                 izdvaja kao lider u svetu usluga.
            </p>
            <hr />
            <h2 className='font-semibold md:text-xl my-2 text-blue-950'>Zašto Odabrati SveUsluge?</h2>
            <ul className='mb-2'> 
                <li><b>Jednostavna Registracija:</b>  Kreirajte nalog/profil brzo i lako i počnite s pretragom i rezervacijom ili oglašavanjem usluga u samo nekoliko koraka.</li>
                <li><b>Transparentna Komunikacija:</b> Na platformi možete pronaći kontakt informacije pružaoca i direktno komunicirati sa pružaocima, uz mogućnost dogovora o detaljima bez posrednika.</li>
                <li><b>Sistem za Zakazivanje:</b> Prilagodite dostupnost svojih usluga i omogućite korisnicima jednostavno zakazivanje po njihovim potrebama.</li>
                <li><b>Ocene i Recenzije:</b>  Prikupite povratne informacije od klijenata kako biste dodatno ojačali svoj ugled i privukli nove klijente.</li>
            </ul>
            <hr />
            <h2 className='font-semibold md:text-xl my-2 text-blue-950'>Kako Funkcioniše SveUsluge?</h2>
            <h3 className='text-lg text-blue-950'><i>Za Pružaoca Usluga</i></h3>
            <ul className='mb-2'>
                <li><b>Kreiranje Profila:</b>  Registrujte se ostavljanjem podataka i kontakt informacija, popunjavanjem informacija o uslugama koje nudite.</li>
                <li><b>Postavljanje Oglasa:</b>  Detaljno opišite svoje usluge, dodajte fotografiju, cenu, dodelite kategoriju, opciono definišite termine</li>
                <li><b>Povezivanje sa Klijentima:</b> Komunicirajte direktno sa potencijalnim klijentima, odgovarajte na njihove zahteve i dogovarajte poslove.</li>
                <li><b>Praćenje Ocena i Recenzija:</b> Povratne informacije pomažu u izgradnji ugleda i poboljšanju ponude.</li>
            </ul>
            <h3 className='text-lg text-blue-950'><i>Za Korisnike Usluga</i></h3>
            <ul className='mb-2'>
                <li><b>Kreiranje Naloga:</b> Kreirajte svoj nalog u nekoliko koraka.</li>
                <li><b>Pretraga Usluga:</b> Pronađite usluge koje su vam potrebne brzo i lako uz pomoć napredne pretrage i filtriranja prema kategorijama.</li>
                <li><b>Pretraga Profila:</b> Pronađite profil kompanije ili samostalca za čiju uslugu ste zainteresovani</li>
                <li><b>Rezervacija termina:</b> Odaberite odgovarajući datum, vreme, radnika za željenu uslugu</li> 
            </ul>
            <hr />
            <h2 className='font-semibold md:text-xl my-2 text-blue-950'>Postanite Deo Zajednice</h2>
            <p className='mb-2'> Naša platforma svakodnevno raste zahvaljujući hiljadama korisnika koji se oslanjaju na <b>SveUsluge</b> za pronalaženje i pružanje usluga širom Srbije. 
                Pridružite se danas i postanite deo priče koja olakšava život i unapređuje poslovanje.
            </p>
        </div>
        <Footer></Footer>
    </div>
  )
}
