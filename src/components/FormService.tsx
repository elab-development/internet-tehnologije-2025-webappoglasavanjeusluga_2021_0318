"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider"; 
import { Category, Employee } from "@/shared/types";

// interface Category {
//   id: number;
//   name: string;
// }

// interface Employee { 
//   id: number;
//   firstName: string;
//   lastName: string;
//   description: string;
// }

interface AppointmentInput {
  date: string;
  time: string | null;
}

interface AvailabilityInput { 
  appointmentIndex: number;
  employeeId: number;
}

export default function CreateServicePage() {
  const router = useRouter();
  const { user } = useAuth(); 

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const [appointments, setAppointments] = useState<AppointmentInput[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [employees, setEmployees] = useState<Employee[]>([]); 
  const [selectedAppointment, setSelectedAppointment] = useState<number | null>(null); 
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null); 
  const [availabilities, setAvailabilities] = useState<AvailabilityInput[]>([]); 

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  useEffect(() => { 
    if (user?.role !== "COMPANY") return;

    fetch("/api/employees")
      .then((res) => res.json())
      .then(setEmployees);
  }, [user]);

  const addAppointment = () => {
    if ((date && !time) || (!date && time)) {
      setErr("Morate uneti i datum i vreme.");
      return;
    }

    if (!date && !time) return;

    setAppointments([...appointments, { date, time }]);

    setDate("");
    setTime("");
    setErr("");
  };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeLastAppointment = () => {
    setAppointments((prev) => prev.slice(0, -1));
  };

  const addAvailability = () => { 
    if (selectedAppointment === null || selectedEmployee === null) return;

    setAvailabilities([
      ...availabilities,
      {
        appointmentIndex: selectedAppointment,
        employeeId: selectedEmployee,
      },
    ]);
  };

  const removeLastAvailability = () => { 
    setAvailabilities((prev) => prev.slice(0, -1));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      let imageUrl: string | null = null;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "profile_upload");

        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: "POST", body: formData }
        );

        const cloudData = await cloudRes.json();

        if (!cloudRes.ok) {
          throw new Error("Upload slike nije uspeo");
        }

        imageUrl = cloudData.secure_url;
      }

      const body = { 
        title,
        description,
        price: Number(price),
        categoryId,
        image: imageUrl,
        appointments,
        availabilities, 
      };

      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setErr(data.error || "Greška");
        return;
      }

      router.push("/dashboard");
    } catch {
      setErr("Greška na serveru");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-linear-to-r from-blue-400 via-blue-200 to-yellow-100">
    <div className="max-w-3xl mx-auto py-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-gray-100 p-5">

        <input
          className="border p-2 rounded focus:outline-none"
          placeholder="Naslov"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="border p-2 rounded focus:outline-none"
          placeholder="Opis"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="number"
          className="border p-2 rounded focus:outline-none w-60"
          placeholder="Cena"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <select
          className="border p-2 rounded focus:outline-none w-60"
          value={categoryId ?? ""}
          onChange={(e) => setCategoryId(Number(e.target.value))}
          required
        >
          <option value="">Izaberi kategoriju</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* SLIKA  */}
        <div className="flex items-center gap-4 my-5">
          <label className="bg-gray-200 px-4 py-2 rounded cursor-pointer">
            Dodaj sliku
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>

          {imagePreview && (
            <img
              src={imagePreview}
              className="w-80 h-40 object-cover border rounded scale-90"
            />
          )}
        </div>

        {/* TERMINI */}
        <p> Dodavanje termina: </p>
        <div className="flex flex-wrap gap-2">
          <input
            type="date"
            className= "border p-2 rounded w-36 focus:outline-none"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <input
            type="time"
             className="border p-2 rounded w-25 focus:outline-none"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />

          <button
            type="button"
            onClick={addAppointment}
            className="bg-blue-500 text-white px-4 rounded"
          >
            Dodaj
          </button>

          <button
            type="button"
            onClick={removeLastAppointment}
            className="bg-red-500 text-white px-4 rounded"
          >
            Obriši
          </button>
        </div>

        <textarea
          readOnly
          className="border p-2 rounded h-50 w-63 focus:outline-none pointer-events-none"
          value={appointments
            .map((a) =>
              `${a.date} u ${a.time}`
            )
            .join("\n")}
        />

        

        {/* COMPANY DODATAK */}
        {user?.role === "COMPANY" && appointments.length > 0 && (
          <>
            <p>Dodela radnika terminima:</p>

            <div className="flex flex-wrap gap-2">
              <select
                onChange={(e) =>
                  setSelectedAppointment(Number(e.target.value))
                }
                className="border p-2 rounded focus:outline-none w-60"
              >
                <option value="">Izaberi termin</option>
                {appointments.map((a, i) => (
                  <option key={i} value={i}>
                    {a.date} u {a.time}
                  </option>
                ))}
              </select>

              <select
                onChange={(e) =>
                  setSelectedEmployee(Number(e.target.value))
                }
                className="border p-2 rounded focus:outline-none w-60"
              >
                <option value="">Izaberi radnika</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} {emp.description}
                  </option>
                ))}
              </select>

              <button 
              type="button" 
              onClick={addAvailability}
              className="bg-blue-500 text-white px-4 rounded"
              >
                Dodaj
              </button>

              <button 
              type="button" 
              onClick={removeLastAvailability}
              className="bg-red-500 text-white px-4 rounded"
              >
                Obriši
              </button>
            </div>

            <textarea
              readOnly
              className="border p-2 rounded h-50 w-120 w-full focus:outline-none pointer-events-none"
              value={availabilities
                .map((a) => {
                  const ap = appointments[a.appointmentIndex];
                  const emp = employees.find(
                    (e) => e.id === a.employeeId
                  );
                  return `${emp?.firstName} ${emp?.lastName} → ${ap?.date} ${ap?.time}`;
                })
                .join("\n")}
            />
          </>
        )}


        {err && <p className="text-red-600">{err}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white p-2 rounded"
        >
          {loading ? "Čuvanje..." : "Kreiraj"}
        </button>

      </form>
    </div>
    </div>
  );
}