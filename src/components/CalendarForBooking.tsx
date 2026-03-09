"use client";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useEffect, useState } from "react";
import { srLatn } from "date-fns/locale";
import { format } from "date-fns";
import { useAuth } from "@/components/AuthProvider";
import { Employee } from "@/shared/types";
import { useRouter } from "next/navigation";

type Mode = "company" | "freelancer";

export default function CalendarForBooking({
  mode,
  appointments,
  availabilities,
  serviceId,
}: {
  mode: Mode;
  appointments: any[];
  availabilities: any[];
  serviceId: number;
}) {
  const { user, status, refresh } = useAuth(); 

  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [times, setTimes] = useState<string[]>([]);
  const [time, setTime] = useState("Po dogovoru");
  const [timeId, setTimeId] = useState<number | undefined>();

  const [availableEmployees, setAvailableEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("Slobodan zaposleni");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  if (status === "loading") {
    return null;
  }

  const availableDates = appointments
    .filter((a) => !a.isBooked)
    .map((a) => new Date(a.date));

  const modifiers = {
    available: availableDates,
  };

  const modifiersClassNames = {
    available: "bg-red-300 text-white rounded-full",
  };

  useEffect(() => {
    if (!selectedDate) {
      setTimes([]);
      return;
    }

    const timesForDate = appointments
      .filter(
        (a) =>
          new Date(a.date).toDateString() ===
          selectedDate.toDateString()
      )
      .map((a) => a.time);

    setTimes(timesForDate);
    setTime("Po dogovoru");
    setTimeId(undefined);
  }, [selectedDate, appointments]);

  useEffect(() => {
    if (!selectedDate || !time || time === "Po dogovoru") {
      setAvailableEmployees([]);
      setSelectedEmployee("Slobodan zaposleni");
      return;
    }

    const appointment = appointments.find(
      (a) =>
        a.time === time &&
        new Date(a.date).toDateString() ===
          selectedDate.toDateString()
    );

    if (!appointment) return;

    const employees = availabilities
      .filter((a) => a.appointment?.id === appointment.id)
      .map((a) => a.employee);

    setAvailableEmployees(employees);
  }, [time, selectedDate, appointments, availabilities]);

  const handleBooking = async () => {
  if (!selectedDate) {
    setErr("Molimo izaberite datum.");
    return;
  }

  setErr("");
  setLoading(true);

  const reservatedDate = format(selectedDate, "yyyy-MM-dd");

  const body =
    mode === "freelancer"
      ? {
          reservatedDate,
          time: time === "Po dogovoru" ? null : time,
          serviceId,
        }
      : {
          reservatedDate,
          time: time === "Po dogovoru" ? null : time,
          selectedEmployee,
          serviceId,
        };

  try {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      alert("Greška. Rezervacija nije sačuvana.");
      setErr("Greška pri rezervaciji.");
      return;
    }

      router.refresh();
      await refresh();

     confirm("Uspešno sačuvana rezervacija.");

    setSelectedDate(undefined);
    setTime("Po dogovoru");
    setTimeId(undefined);
    setSelectedEmployee("Slobodan zaposleni");

 } catch {
    alert("Greška. Rezervacija nije sačuvana.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex flex-col md:flex-row gap-5 md:gap-10 py-5 items-center">

      <div className="flex flex-col bg-white p-5 w-85 h-95 rounded-xl border border-gray-400">
        <DayPicker
          mode="single"
          disabled={(day) =>
            !availableDates.some(
              (d) => d.toDateString() === day.toDateString()
            )
          }
          selected={selectedDate}
          onSelect={setSelectedDate}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          locale={srLatn}
        />
      </div>

      {user?.role === "USER" && ( // USLOVNO PRIKAZIVANJE
        <div className="ml-5 min-h-70">

          <div className="flex gap-2 my-5">
            <p>Izabran datum:</p>
            <input
              className="border border-gray-500 text-center"
              disabled
              value={
                selectedDate
                  ? selectedDate.toLocaleDateString("sr-RS")
                  : ""
              }
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-5">

            {selectedDate && <p>Izaberite vreme:</p>}

            {selectedDate && (
              <button
                onClick={() => {
                  setTimeId(undefined);
                  setTime("Po dogovoru");
                }}
                className={`border border-gray-500 rounded-xl p-1 bg-gray-50 hover:bg-red-400 ${
                  timeId === undefined ? "bg-red-400" : ""
                }`}
              >
                Po dogovoru
              </button>
            )}

            {times.map((t, id) => {
              const appointment = appointments.find(
                (a) =>
                  a.time === t &&
                  new Date(a.date).toDateString() ===
                    selectedDate?.toDateString()
              );

              return (
                <button
                  key={id}
                  disabled={appointment?.isBooked}
                  onClick={() => {
                    setTimeId(id);
                    setTime(t);
                  }}
                  className={`border border-gray-500 rounded-xl p-1
                    ${
                      appointment?.isBooked
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-gray-50 hover:bg-red-400"
                    }
                    ${timeId === id ? "bg-red-400" : ""}
                  `}
                >
                  {t}
                </button>
              );
            })}
          </div>

          {selectedDate && mode === "company" && (
            <div className="flex flex-row pt-2">

              <select
                value={selectedEmployee}
                onChange={(e) =>
                  setSelectedEmployee(e.target.value)
                }
                className="bg-gray-50 border border-gray-500 rounded-xl h-10 w-70 mt-5 p-2 text-center"
              >
                <option value="Slobodan zaposleni">
                  Dostupni radnici
                </option>

                {availableEmployees.map(
                  (emp) =>
                    emp && ( //provera zbog brisanja radnika
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName} {emp.description || ""}
                      </option>
                    )
                )}
              </select>
            </div>
          )}

          {selectedDate && (
            <div className="mt-4">
              <button
                onClick={handleBooking}
                disabled={loading}
                className="px-3 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-800 disabled:opacity-60"
              >
                {loading ? "Obrada..." : "Rezerviši termin"}
              </button>
            </div>
          )}

          {err && (
            <p className="mt-3 text-sm text-red-600">{err}</p>
          )}

        </div>
      )}

      { (user?.role === "COMPANY" || user?.role === "FREELANCER")  && ( // USLOVNO PRIKAZIVANJE
        <div className="ml-5 min-h-70">

          <div className="flex flex-wrap gap-2 pt-5">

            {selectedDate && <p>Vreme:</p>}
            
            {times.map((t, id) => {
              const appointment = appointments.find(
                (a) =>
                  a.time === t &&
                  new Date(a.date).toDateString() ===
                    selectedDate?.toDateString()
              );

              return (
                <button
                  key={id}
                  disabled={appointment?.isBooked}
                  onClick={() => {
                    setTimeId(id);
                    setTime(t);
                  }}
                  className={`border border-gray-500 rounded-xl p-1
                    ${
                      appointment?.isBooked
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-gray-50 hover:bg-red-400"
                    }
                    ${timeId === id ? "bg-red-400" : ""}
                  `}
                >
                  {t}
                </button>
              );
            })}
          </div>

          {selectedDate && mode === "company" && (
            <div className="flex flex-row pt-2">

              <select
                value={selectedEmployee}
                onChange={(e) =>
                  setSelectedEmployee(e.target.value)
                }
                className="bg-gray-50 border border-gray-500 rounded-xl h-10 w-70 mt-5 p-2 text-center"
              >
                <option value="Slobodan zaposleni">
                  Dostupni radnici
                </option>

                {availableEmployees.map(
                  (emp) =>
                    emp && ( //provera zbog brisanja radnika
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName} {emp.description || ""}
                      </option>
                    )
                )}
              </select>
            </div>
          )}
          
        </div>
      )}

    </div>
  );
}