"use client"
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useEffect, useState } from 'react';
import { mockAppointments, mockAvailabilities } from '@/mock/data';
import { srLatn } from 'date-fns/locale';
import { FullEmployeeDto } from '@/shared/types';

type Mode = "company" | "freelancer";

export default function CalendarForBooking({mode, serviceId}: {mode:Mode, serviceId:number}) {
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [time, setTime]=useState("Po dogovoru");
  const [selectedEmployee, setSelectedEmployee] = useState("Slobodan zaposleni");

  // const [err, setErr]=useState("");
  // const [loading, setLoading]=useState(false);

  const availableAppointments = mockAppointments.filter((a) => a.service.id===serviceId && a.isBooked===false);
  const availableDates = availableAppointments.map((b) => b.date);

  const [times, setTimes] = useState<string[]>([]);

  const [timeId, setTimeId] = useState<number>();

 
  const [availableEmployees, setAvailableEmployees] = useState<FullEmployeeDto[]>([]);

  useEffect(() => {
    if (selectedDate !== undefined) {
      const data = mockAppointments.filter(
        d => d.service.id===serviceId && d.date.toDateString() === selectedDate.toDateString() && d.isBooked===false
      );
      const timesForDate = data.map(d => d.time);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTimes(timesForDate);
      setTimeId(undefined);
      setTime("Po dogovoru");
    } else {
      // Kada nema izabranog datuma, prazna lista
      setTimes([]);
      setTimeId(undefined);
      setTime("Po dogovoru");
    }

  }, [selectedDate]);

  useEffect(() => {
  if (!selectedDate || !time || time === "Po dogovoru") {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAvailableEmployees([]);
    setSelectedEmployee("Slobodan zaposleni");
    return;
  }

  // 1. Trazim odgovarajući termin
  const appointment = mockAppointments.find(
      (a) =>
      a.service.id === serviceId &&
      a.isBooked === false &&
      a.time === time &&
      a.date.toDateString() === selectedDate.toDateString()
  );

  if (!appointment) {
    setAvailableEmployees([]);
    return;
  }

  // 2. Trazim dostupnosti(raspolozive radnike) za taj termin
  const employees = mockAvailabilities
    .filter((e) => e.appointment.id === appointment.id)
    .map((e) => e.employee);

  setAvailableEmployees(employees);
  setSelectedEmployee("Slobodan zaposleni");
}, [time]);


  const modifiers = {
      available: availableDates
    };

  const modifiersClassNames = {
    available: 'bg-red-300 text-white rounded-full',
  };

  //Slanje podataka na Backend
  const handleBooking = async () => {
  if (!selectedDate || !time) {
    alert("Molimo izaberite datum i vreme!");
    return;
  }

  const endpoint = "/api/booking";

  //selectedDate - Date tip, backend mora znati da parsira ISO string
  const body= mode==="freelancer" ? {selectedDate, time}:{selectedDate, time, selectedEmployee};

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      alert("Termin uspešno rezervisan!");
      setSelectedDate(undefined);
      setTimes([]);
      setTime("");
      setTimeId(undefined);
    } else {
      alert("Greška pri rezervaciji.");
    }
  } catch (err) {
    console.error(err);
    alert("Greška pri povezivanju sa serverom.");
  }
};

  return (
    <div className='flex flex-col md:flex-row gap-5 md:gap-10 py-5 items-center'>
        <div className='flex flex-col bg-white p-5 w-85 h-95 rounded-xl border border-gray-400 '>  
      <DayPicker  //npm install react-day-picker
        mode="single"
        disabled={(day) =>
        !availableDates.some(
        d => d.toDateString() === day.toDateString()
        )
        }
        selected={selectedDate} 
        onSelect={setSelectedDate} 
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames} 
        locale={srLatn}
        />
        </div>
        <div className=' ml-5 min-h-70'>
            <div className='flex gap-2 my-5'>
                <p>Izabran datum: </p>
                <input className="border border-gray-500 text-center" disabled type="text" value={selectedDate ? selectedDate.toLocaleDateString("sr-RS"): ""}/>
            </div>

            <div className='flex flex-wrap gap-2 pt-5'>
              {selectedDate && <p>Izaberite vreme: </p>}
              {selectedDate && <button  onClick={()=> {
                                        setTimeId(undefined);
                                        setTime("Po dogovoru");
                                        }} 
                                        className={`border border-gray-500 rounded-xl p-1 bg-gray-50 hover:bg-red-400 ${timeId===undefined ? "bg-red-400" : "" }`}>Po dogovoru</button>}
              {times?.map((time, id)=>(
                <button key={id} 
                        onClick={()=> {
                          setTimeId(id);
                          setTime(time);
                          }} 
                          className={`border border-gray-500 rounded-xl p-1 bg-gray-50 hover:bg-red-400 ${timeId===id ? "bg-red-400" : "" }`}
                > 
                  {time}
                </button>
              ))}
            </div>

            {selectedDate && mode==="company" && 
            <div className='flex flex-row pt-2'>
              <p className='pt-7  pb-5 pr-3'>Radnik:</p> {/*Ovde se bira radnik (ako uslugu nudi preduzece) */}
              
               <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} className="bg-gray-50 border border-gray-500 rounded-xl h-10 w-70 mt-5 p-2 text-center">
                  <option value="Slobodan zaposleni">Slobodan zaposleni</option>

                    {availableEmployees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstname} {emp.lastname} {emp.description}
                  </option>
                  ))}
        
               </select>
            </div>
            }

            {selectedDate && <div className='mt-4'>
                <button
                  onClick={handleBooking}
                  className=' px-4 py-3 mt-10  bg-gray-700 text-white rounded-md hover:bg-gray-800'
                >
                  Rezerviši termin
                </button>
            </div>
            }
        </div>
        
    </div>
  );
}