import { Booking } from "@/shared/types";

type Props = {
  booking: Booking;
  onUpdated: () => void;
};

export default function BookingCard({ booking, onUpdated }: Props) {
  const toggleStatus = async () => {
    await fetch(`/api/bookings/${booking.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ finished: !booking.finished }),
    });
    onUpdated();
  };

  return (
    <div className="flex flex-wrap justify-between gap-3 sm:flex-nowrap bg-gray-100 border p-3 rounded-xl bg-white w-full max-w-5xl max-h-xl mx-auto ">
      
      <div className="w-80">
        <h1 className="text-xl font-semibold text-blue-800 mb-2">Rezervacija info</h1>
        <p><b>Usluga:</b> <i className="text-blue-700">{booking.service?.title}</i></p>
        <p><b>Datum:</b> {booking.reservedDate}</p>
        {booking.time ? (<p><b>Vreme:</b> {booking.time}</p>):(<p ><b>Vreme:</b> <i className="text-red-700">Po dogovoru</i></p>)}
        {booking.employee ? (
          <p>
            <b>Radnik:</b> <i className="text-green-700">{booking.employee.firstName} {booking.employee.lastName}</i>
          </p>
        ):(
          <p>
            <b>Radnik:</b> <i className="text-red-700">Slobodan zaposleni</i>
          </p>
        )}
        <p><b>Poslato:</b> {new Date(booking.createdAt).toLocaleString()}</p>
      </div>

      <div className="w-80">
        <h1 className="text-xl font-semibold text-blue-800 mb-2">Klijent info</h1>
        <p><b>Klijent:</b> {booking.user?.firstName} {booking.user?.lastName}</p>
        <p><b>Email:</b> {booking.user?.email}</p>
        <p><b>Telefon:</b> {booking.user?.phone}</p>
      </div>

      <button
        onClick={toggleStatus}
        className={`flex items-center px-5 py-5 rounded text-white  h-10 ${
          booking.finished ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
        }`}
      >
        {booking.finished ? "Obradjena" : "Neobradjena"}
      </button>
    </div>
  );
}