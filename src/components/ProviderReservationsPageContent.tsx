"use client";

import { useEffect, useState } from "react";
import BookingCard from "@/components/BookingCard";
import { Booking } from "@/shared/types";

export default function ProviderReservationsPageContent() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/bookings/me", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Greška pri učitavanju");
        setBookings([]);
        return;
      }

      if (Array.isArray(data)) {
        setBookings(data);
      } else {
        setBookings([]);
      }

    } catch (err) {
      console.error(err);
      setError("Server greška");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-400 via-blue-200 to-yellow-100 p-6">
        <p className="mt-7 text-center">Učitavanje...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 min-h-screen bg-gradient-to-r from-blue-400 via-blue-200 to-yellow-100 p-6">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 via-blue-200 to-yellow-100 p-6">

      <h1 className="text-4xl mt-3 mb-7 text-center">
        Pristigle rezervacije
      </h1>

      <div className="flex flex-col gap-4 items-center">
        {bookings.length === 0 ? (
          <p className="mt-5">Nema rezervacija.</p>
        ) : (
          bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onUpdated={fetchBookings}
            />
          ))
        )}
      </div>

    </div>
  );
}