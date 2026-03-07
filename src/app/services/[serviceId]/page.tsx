
import ServiceDetails from "@/components/ServiceDetails";


type Props = {
  params: {
    serviceId: string;
  }
}

export default async function Service({ params }: Props) {

  const p = await params;
  const serviceId = Number(p.serviceId);

  const res = await fetch(`http://localhost:3000/api/services/${serviceId}`, {cache: "no-store",});

  if (!res.ok) {
    throw new Error("Greška pri učitavanju usluge");
  }

  const service = await res.json(); 

  return(
  <div>
    <ServiceDetails service={service}></ServiceDetails>
  </div>
  );

}



