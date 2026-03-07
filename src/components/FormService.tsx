"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
}

interface AppointmentInput {
  date: string;
  time: string | null;
}

export default function CreateServicePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const [appointments, setAppointments] = useState<AppointmentInput[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

   //BRISANJE POSLEDNJEG TERMINA
  const removeLastAppointment = () => {
    setAppointments((prev) => prev.slice(0, -1));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // DODAVANJE TERMINA
  const addAppointment = () => {
    // ako je popunjeno samo jedno polje - greška
    if ((date && !time) || (!date && time)) {
      setErr("Morate uneti i datum i vreme.");
      return;
    }

    // ako je sve prazno - samo izađi
    if (!date && !time) return;

    setAppointments([
      ...appointments,
      { date, time },
    ]);

    setDate("");
    setTime("");
    setErr("");
  };

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setErr("");
  setLoading(true);

  try {
    let imageUrl: string | null = null;

    // SLika je opciona
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
      <h1 className="text-2xl font-bold text-center mb-4">
        Kreiraj uslugu
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-gray-50 p-6 rounded-xl  shadow"
      >
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
        <div className="flex gap-2">
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