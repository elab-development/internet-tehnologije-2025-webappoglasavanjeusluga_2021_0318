"use client";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useEffect, useState } from "react";
import { srLatn } from "date-fns/locale";
import { format } from "date-fns";

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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [times, setTimes] = useState<string[]>([]);
  const [time, setTime] = useState("Po dogovoru");
  const [timeId, setTimeId] = useState<number | undefined>();

  const [availableEmployees, setAvailableEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] =useState("Slobodan zaposleni");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // dostupni dani
  const availableDates = appointments
    .filter((a) => !a.isBooked)
    .map((a) => new Date(a.date));

  const modifiers = {available: availableDates};

  const modifiersClassNames = {available: "bg-red-300 text-white rounded-full"};

  // ucitavanje termina za datum
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

  // dostupni radnici
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

  // REZERVACIJA
  const handleBooking = async () => {
    if (!selectedDate || !time) {
      setErr("Molimo izaberite datum i vreme.");
      return;
    }

    setErr("");
    setLoading(true);

    const reservatedDate = format(selectedDate, "yyyy-MM-dd");

    const body =
      mode === "freelancer"
        ? { reservatedDate, time, serviceId }
        : { reservatedDate, time, selectedEmployee, serviceId };

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        setErr("Greška pri rezervaciji termina.");
        return;
      }

      setSelectedDate(undefined);
      setTimes([]);
      setTime("Po dogovoru");
      setTimeId(undefined);
      setSelectedEmployee("Slobodan zaposleni");
    } catch {
      setErr("Greška pri povezivanju sa serverom.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-5 md:gap-10 py-5 items-center">

      {/* KALENDAR */}
      <div className="flex flex-col bg-white p-5 w-85 h-95 rounded-xl border border-gray-400">
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          disabled={(day) =>
            !availableDates.some(
              (d) => d.toDateString() === day.toDateString()
            )
          }
          locale={srLatn}
        />
      </div>

      {/* TERMINI */}
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

          {/* PO DOGOVORU */}
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

          {/* TERMINI */}
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

        {/* RADNIK */}
        {selectedDate && mode === "company" && (
          <div className="flex flex-row pt-2">
            <p className="pt-7 pb-5 pr-3">Radnik:</p>

            <select
              value={selectedEmployee}
              onChange={(e) =>
                setSelectedEmployee(e.target.value)
              }
              className="bg-gray-50 border border-gray-500 rounded-xl h-10 w-70 mt-5 p-2 text-center"
            >
              <option value="Slobodan zaposleni">
                Slobodan zaposleni
              </option>

              {availableEmployees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* DUGME */}
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
    </div>
  );
}

// "use client";

// import { DayPicker } from "react-day-picker";
// import "react-day-picker/dist/style.css";
// import { useEffect, useState } from "react";
// import { srLatn } from "date-fns/locale";
// import { format } from "date-fns";

// type Mode = "company" | "freelancer";

// export default function CalendarForBooking({
//   mode,
//   appointments,
//   availabilities,
//   serviceId, 
// }: {
//   mode: Mode;
//   appointments: any[];
//   availabilities: any[];
//   serviceId: number;
// }) {
//   const [selectedDate, setSelectedDate] = useState<Date | undefined>();
//   const [times, setTimes] = useState<string[]>([]);
//   const [time, setTime] = useState("Po dogovoru");

//   const [availableEmployees, setAvailableEmployees] = useState<any[]>([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("Slobodan zaposleni");

//   const [loading, setLoading] = useState(false); 
//   const [err, setErr] = useState(""); 

//   const availableDates = appointments
//     .filter((a) => !a.isBooked)
//     .map((a) => new Date(a.date));

//   useEffect(() => {
//     if (!selectedDate) {
//       setTimes([]);
//       return;
//     }

//     const timesForDate = appointments
//       .filter(
//         (a) =>
//           !a.isBooked &&
//           new Date(a.date).toDateString() === selectedDate.toDateString()
//       )
//       .map((a) => a.time);

//     setTimes(timesForDate);
//     setTime("Po dogovoru");
//   }, [selectedDate, appointments]);

//   useEffect(() => {
//     if (!selectedDate || !time || time === "Po dogovoru") {
//       setAvailableEmployees([]);
//       setSelectedEmployee("Slobodan zaposleni");
//       return;
//     }

//     const appointment = appointments.find(
//       (a) =>
//         !a.isBooked &&
//         a.time === time &&
//         new Date(a.date).toDateString() === selectedDate.toDateString()
//     );

//     if (!appointment) {
//       setAvailableEmployees([]);
//       return;
//     }

//     const employees = availabilities
//       .filter((a) => a.appointment?.id === appointment.id)
//       .map((a) => a.employee);

//     setAvailableEmployees(employees);
//   }, [time, selectedDate, appointments, availabilities]);

//   // DUGME ZA REZERVACIJU
//   const handleBooking = async () => {
//     if (!selectedDate || !time) {
//       setErr("Molimo izaberite datum i vreme.");
//       return;
//     }

//     setErr("");
//     setLoading(true);

//     const reservatedDate = format(selectedDate, "yyyy-MM-dd");

//     const body =
//       mode === "freelancer"
//         ? { reservatedDate, time, serviceId }
//         : { reservatedDate, time, selectedEmployee, serviceId };

//     try {
//       const res = await fetch("/api/booking", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });

//       if (!res.ok) {
//         setErr("Greška pri rezervaciji termina.");
//         return;
//       }

//       setSelectedDate(undefined);
//       setTimes([]);
//       setTime("Po dogovoru");
//       setSelectedEmployee("Slobodan zaposleni");
//     } catch {
//       setErr("Greška pri povezivanju sa serverom.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const modifiers = {
//     available: availableDates,
//   };

//   const modifiersClassNames = {
//     available: "bg-red-300 text-white rounded-full",
//   };

//   return (
//     <div className="flex flex-col md:flex-row gap-5 md:gap-10 py-5 items-center">

//       <div className="flex flex-col bg-white p-5 w-85 h-95 rounded-xl border border-gray-400">
//         <DayPicker
//           mode="single"
//           disabled={(day) =>
//             !availableDates.some(
//               (d) => d.toDateString() === day.toDateString()
//             )
//           }
//           selected={selectedDate}
//           onSelect={setSelectedDate}
//            modifiers={modifiers}                 // 🟢 DODATO
//   modifiersClassNames={modifiersClassNames} // 🟢 DODATO
//           locale={srLatn}
//         />
//       </div>

//       <div className="ml-5 min-h-70">

//         {/* Datum */}
//         <div className="flex gap-2 my-5">
//           <p>Izabran datum:</p>
//           <input
//             className="border border-gray-500 text-center"
//             disabled
//             value={
//               selectedDate
//                 ? selectedDate.toLocaleDateString("sr-RS")
//                 : ""
//             }
//           />
//         </div>

//         {/* Vreme */}
//         <div className="flex flex-wrap gap-2 pt-5">
//           {selectedDate && <p>Izaberite vreme:</p>}

//           {times.map((t, id) => (
//             <button
//               key={id}
//               onClick={() => setTime(t)}
//               className="border border-gray-500 rounded-xl p-1 bg-gray-50 hover:bg-red-400"
//             >
//               {t}
//             </button>
//           ))}
//         </div>

//         {/* Radnik (samo company) */}
//         {selectedDate && mode === "company" && (
//           <div className="flex flex-row pt-2">
//             <p className="pt-7 pb-5 pr-3">Radnik:</p>

//             <select
//               value={selectedEmployee}
//               onChange={(e) => setSelectedEmployee(e.target.value)}
//               className="bg-gray-50 border border-gray-500 rounded-xl h-10 w-70 mt-5 p-2 text-center"
//             >
//               <option value="Slobodan zaposleni">
//                 Slobodan zaposleni
//               </option>

//               {availableEmployees.map((emp) => (
//                 <option key={emp.id} value={emp.id}>
//                   {emp.firstName} {emp.lastName}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         {/* DUGME ZA REZERVACIJU */}
//         {selectedDate && (
//           <div className="mt-4">
//             <button
//               onClick={handleBooking}
//               disabled={loading}
//               className="px-3 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-800 disabled:opacity-60"
//             >
//               {loading ? "Obrada..." : "Rezerviši termin"}
//             </button>
//           </div>
//         )}

//         {err && (
//           <p className="mt-3 text-sm text-red-600">{err}</p>
//         )}

//       </div>
//     </div>
//   );
// }

// "use client";

// import { DayPicker } from "react-day-picker";
// import "react-day-picker/dist/style.css";
// import { useEffect, useState } from "react";
// import { srLatn } from "date-fns/locale";

// type Mode = "company" | "freelancer";

// export default function CalendarForBooking({mode, appointments, availabilities,}: {
//   mode: Mode;
//   appointments: any[];
//   availabilities: any[];
// }) {
//   const [selectedDate, setSelectedDate] = useState<Date | undefined>();
//   const [times, setTimes] = useState<string[]>([]);
//   const [time, setTime] = useState("Po dogovoru");

//   const [availableEmployees, setAvailableEmployees] = useState<any[]>([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("Slobodan zaposleni");

//   const availableDates = appointments.filter((a) => !a.isBooked).map((a) => new Date(a.date));

//   useEffect(() => {
//       if (!selectedDate) {
//         setTimes([]);
//         return;
//       }

//       const timesForDate = appointments
//         .filter(
//           (a) =>
//             !a.isBooked &&
//             new Date(a.date).toDateString() === selectedDate.toDateString()
//         )
//         .map((a) => a.time);

//       setTimes(timesForDate);
//       setTime("Po dogovoru"); 
//   }, [selectedDate, appointments]);


//   useEffect(() => {
//       if (!selectedDate || !time || time === "Po dogovoru") {
//         setAvailableEmployees([]);
//         setSelectedEmployee("Slobodan zaposleni");
//         return;
//       }

//       const appointment = appointments.find(
//         (a) =>
//           !a.isBooked &&
//           a.time === time &&
//           new Date(a.date).toDateString() === selectedDate.toDateString()
//       );

//       if (!appointment) {
//         setAvailableEmployees([]);
//         return;
//       }

//       const employees = availabilities
//         .filter((a) => a.appointment?.id === appointment.id)
//         .map((a) => a.employee);

//       setAvailableEmployees(employees);
//       setSelectedEmployee("Slobodan zaposleni");

//   }, [time, selectedDate, appointments, availabilities]);

//   const modifiers = {
//     available: availableDates,
//   };

//   const modifiersClassNames = {
//     available: "bg-red-300 text-white rounded-full",
//   };

//   return (
//     <div className="flex flex-col md:flex-row gap-5 md:gap-10 py-5 items-center">

//       <div className="flex flex-col bg-white p-5 w-85 h-95 rounded-xl border border-gray-400">
//         <DayPicker
//           mode="single"
//           disabled={(day) =>
//             !availableDates.some(
//               (d) => d.toDateString() === day.toDateString()
//             )
//           }
//           selected={selectedDate}
//           onSelect={setSelectedDate}
//           modifiers={modifiers}
//           modifiersClassNames={modifiersClassNames}
//           locale={srLatn}
//         />
//       </div>

//       <div className="ml-5 min-h-70">

//         <div className="flex gap-2 my-5">
//           <p>Izabran datum:</p>

//           <input className="border border-gray-500 text-center"
//             disabled
//             type="text"
//             value={
//               selectedDate
//                 ? selectedDate.toLocaleDateString("sr-RS")
//                 : ""
//             }
//             />
//         </div>

//         <div className="flex flex-wrap gap-2 pt-5">

//           {selectedDate && <p>Izaberite vreme:</p>}

//           {selectedDate && (
//             <button
//               onClick={() => setTime("Po dogovoru")}
//               className={`border border-gray-500 rounded-xl p-1 bg-gray-50 hover:bg-red-400 ${
//                 time === "Po dogovoru" ? "bg-red-400" : ""
//               }`}
//             >
//               Po dogovoru
//             </button>
//           )}

//           {times.map((t, id) => (
//             <button
//               key={id}
//               onClick={() => setTime(t)}
//               className={`border border-gray-500 rounded-xl p-1 bg-gray-50 hover:bg-red-400 ${
//                 time === t ? "bg-red-400" : ""
//               }`}
//             >
//               {t}
//             </button>
//           ))}
//         </div>

//         {/* izbor radnika samo za company */}
//         {selectedDate && mode === "company" && (
//           <div className="flex flex-row pt-2">

//             <p className="pt-7 pb-5 pr-3">Radnik:</p>

//             <select
//               value={selectedEmployee}
//               onChange={(e) => setSelectedEmployee(e.target.value)}
//               className="bg-gray-50 border border-gray-500 rounded-xl h-10 w-70 mt-5 p-2 text-center"
//             >
//               <option value="Slobodan zaposleni">
//                 Slobodan zaposleni
//               </option>

//               {availableEmployees.map((emp) => (
//                 <option key={emp.id} value={emp.id}>
//                   {emp.firstName} {emp.lastName} {emp.description}
//                 </option>
//               ))}
//             </select>

//           </div>
//         )}
//       </div>
//     </div>
//   );
// }





// "use client";

// import { DayPicker } from "react-day-picker";
// import "react-day-picker/dist/style.css";
// import { useEffect, useState } from "react";
// import { srLatn } from "date-fns/locale";

// type Mode = "company" | "freelancer";

// export default function CalendarForBooking({
//   mode,
//   appointments,
//   availabilities,
// }: {
//   mode: Mode;
//   appointments: any[];
//   availabilities: any[];
// }) {
//   const [selectedDate, setSelectedDate] = useState<Date | undefined>();
//   const [times, setTimes] = useState<string[]>([]);
//   const [time, setTime] = useState("Po dogovoru");

//   const availableDates = appointments
//     .filter((a) => !a.isBooked)
//     .map((a) => new Date(a.date));

//   useEffect(() => {
//     if (!selectedDate) {
//       setTimes([]);
//       return;
//     }

//     const timesForDate = appointments
//       .filter(
//         (a) =>
//           !a.isBooked &&
//           new Date(a.date).toDateString() === selectedDate.toDateString()
//       )
//       .map((a) => a.time);

//     setTimes(timesForDate);
//   }, [selectedDate, appointments]);

//   const modifiers = {
//     available: availableDates,
//   };

//   const modifiersClassNames = {
//     available: "bg-red-300 text-white rounded-full",
//   };

//   return (
//     <div className="flex flex-col md:flex-row gap-5 md:gap-10 py-5 items-center">
//       <div className="flex flex-col bg-white p-5 w-85 h-95 rounded-xl border border-gray-400">
//         <DayPicker
//           mode="single"
//           disabled={(day) =>
//             !availableDates.some(
//               (d) => d.toDateString() === day.toDateString()
//             )
//           }
//           selected={selectedDate}
//           onSelect={setSelectedDate}
//           modifiers={modifiers}
//           modifiersClassNames={modifiersClassNames}
//           locale={srLatn}
//         />
//       </div>

//       <div className="ml-5 min-h-70">
//         <div className="flex gap-2 my-5">
//           <p>Izabran datum:</p>

//           <input
//             className="border border-gray-500 text-center"
//             disabled
//             type="text"
//             value={
//               selectedDate
//                 ? selectedDate.toLocaleDateString("sr-RS")
//                 : ""
//             }
//           />
//         </div>

//         <div className="flex flex-wrap gap-2 pt-5">
//           {selectedDate && <p>Izaberite vreme:</p>}

//           {times.map((t, id) => (
//             <button
//               key={id}
//               onClick={() => setTime(t)}
//               className="border border-gray-500 rounded-xl p-1 bg-gray-50 hover:bg-red-400"
//             >
//               {t}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }



// "use client"
// import { DayPicker } from 'react-day-picker';
// import 'react-day-picker/dist/style.css';
// import { useEffect, useState } from 'react';
// import { mockAppointments, mockAvailabilities } from '@/mock/data';
// import { srLatn } from 'date-fns/locale';
// import { FullEmployeeDto } from '@/shared/types';
// import { format } from "date-fns";

// type Mode = "company" | "freelancer";

// export default function CalendarForBooking({mode, serviceId}: {mode:Mode, serviceId:number}) {
  
//   const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
//   const [time, setTime]=useState("Po dogovoru");
//   const [selectedEmployee, setSelectedEmployee] = useState("Slobodan zaposleni");

//    const [err, setErr]=useState("");
//    const [loading, setLoading]=useState(false);

//   const availableAppointments = mockAppointments.filter((a) => a.service.id===serviceId && a.isBooked===false);
//   const availableDates = availableAppointments.map((b) => b.date);

//   const [times, setTimes] = useState<string[]>([]);

//   const [timeId, setTimeId] = useState<number>();

 
//   const [availableEmployees, setAvailableEmployees] = useState<FullEmployeeDto[]>([]);

//   useEffect(() => {
//     if (selectedDate !== undefined) {
//       const data = mockAppointments.filter(
//         d => d.service.id===serviceId && d.date.toDateString() === selectedDate.toDateString() && d.isBooked===false
//       );
//       const timesForDate = data.map(d => d.time);
//       // eslint-disable-next-line react-hooks/set-state-in-effect
//       setTimes(timesForDate);
//       setTimeId(undefined);
//       setTime("Po dogovoru");
//     } else {
//       // Kada nema izabranog datuma, prazna lista
//       setTimes([]);
//       setTimeId(undefined);
//       setTime("Po dogovoru");
//     }

//   }, [selectedDate]);

//   useEffect(() => {
//   if (!selectedDate || !time || time === "Po dogovoru") {
//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     setAvailableEmployees([]);
//     setSelectedEmployee("Slobodan zaposleni");
//     return;
//   }

//   // 1. Trazim odgovarajući termin
//   const appointment = mockAppointments.find(
//       (a) =>
//       a.service.id === serviceId &&
//       a.isBooked === false &&
//       a.time === time &&
//       a.date.toDateString() === selectedDate.toDateString()
//   );

//   if (!appointment) {
//     setAvailableEmployees([]);
//     return;
//   }

//   // 2. Trazim dostupnosti(raspolozive radnike) za taj termin
//   const employees = mockAvailabilities
//     .filter((e) => e.appointment.id === appointment.id)
//     .map((e) => e.employee);

//   setAvailableEmployees(employees);
//   setSelectedEmployee("Slobodan zaposleni");
// }, [time]);


//   const modifiers = {
//       available: availableDates
//     };

//   const modifiersClassNames = {
//     available: 'bg-red-300 text-white rounded-full',
//   };

//   //Slanje podataka na Backend
//   const handleBooking = async () => {
//   if (!selectedDate || !time) {
//     setErr("Molimo izaberite datum i vreme.");
//     return;
//   }

//   setErr("");
//   setLoading(true);

//   const endpoint = "/api/booking";
//   const reservatedDate = format(selectedDate, "yyyy-MM-dd");
//   const now = new Date().toISOString().split("T")[0];

//   const body =
//     mode === "freelancer"
//       ? { reservatedDate, time, serviceId, createdAt: now }
//       : { reservatedDate, time, selectedEmployee, serviceId, createdAt: now };

//   try {
//     const res = await fetch(endpoint, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body),
//     });

//     if (!res.ok) {
//       setErr("Greška pri rezervaciji termina.");
//       return;
//     }

//     setSelectedDate(undefined);
//     setTimes([]);
//     setTime("Po dogovoru");
//     setTimeId(undefined);
//   } catch (e) {
//     setErr("Greška pri povezivanju sa serverom.");
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className='flex flex-col md:flex-row gap-5 md:gap-10 py-5 items-center'>
//         <div className='flex flex-col bg-white p-5 w-85 h-95 rounded-xl border border-gray-400 '>  
//       <DayPicker  //npm install react-day-picker
//         mode="single"
//         disabled={(day) =>
//         !availableDates.some(
//         d => d.toDateString() === day.toDateString()
//         )
//         }
//         selected={selectedDate} 
//         onSelect={setSelectedDate} 
//         modifiers={modifiers}
//         modifiersClassNames={modifiersClassNames} 
//         locale={srLatn}
//         />
//         </div>
//         <div className=' ml-5 min-h-70'>
//             <div className='flex gap-2 my-5'>
//                 <p>Izabran datum: </p>
//                 <input className="border border-gray-500 text-center" disabled type="text" value={selectedDate ? selectedDate.toLocaleDateString("sr-RS"): ""}/>
//             </div>

//             <div className='flex flex-wrap gap-2 pt-5'>
//               {selectedDate && <p>Izaberite vreme: </p>}
//               {selectedDate && <button  onClick={()=> {
//                                         setTimeId(undefined);
//                                         setTime("Po dogovoru");
//                                         }} 
//                                         className={`border border-gray-500 rounded-xl p-1 bg-gray-50 hover:bg-red-400 ${timeId===undefined ? "bg-red-400" : "" }`}>Po dogovoru</button>}
//               {times?.map((time, id)=>(
//                 <button key={id} 
//                         onClick={()=> {
//                           setTimeId(id);
//                           setTime(time);
//                           }} 
//                           className={`border border-gray-500 rounded-xl p-1 bg-gray-50 hover:bg-red-400 ${timeId===id ? "bg-red-400" : "" }`}
//                 > 
//                   {time}
//                 </button>
//               ))}
//             </div>

//             {selectedDate && mode==="company" && 
//             <div className='flex flex-row pt-2'>
//               <p className='pt-7  pb-5 pr-3'>Radnik:</p> {/*Ovde se bira radnik (ako uslugu nudi preduzece) */}
              
//                <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} className="bg-gray-50 border border-gray-500 rounded-xl h-10 w-70 mt-5 p-2 text-center">
//                   <option value="Slobodan zaposleni">Slobodan zaposleni</option>

//                     {availableEmployees.map(emp => (
//                   <option key={emp.id} value={emp.id}>
//                     {emp.firstname} {emp.lastname} {emp.description}
//                   </option>
//                   ))}
        
//                </select>
//             </div>
//             }

//             <div className='flex items-center'>

//               {selectedDate && <div className='mt-4'>
//                   <button
//                     onClick={handleBooking}
//                     disabled={loading}
//                     className="px-3 py-3 mt-5 bg-gray-700 text-white rounded-md hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
//                     > {loading ? "Obrada..." : "Rezerviši termin"}
//                 </button>
//               </div>
//               }
//               {err && (
//               <p className="ml-5 mt-10 text-sm text-red-600 text-center">
//                 {err}
//               </p>
//             )}
//           </div>
//             </div>  
//     </div>
//   );
// }