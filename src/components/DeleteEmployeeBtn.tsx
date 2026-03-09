"use client";

import React from "react";

type Props = {
  employeeId: number;
  onDeleted: () => void;
};

export default function DeleteEmployeeButton({
  employeeId,
  onDeleted,
}: Props) {
  const handleDelete = async () => {
  const confirmDelete = confirm("Da li želite da obrišete zaposlenog?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`/api/employees/${employeeId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      onDeleted(); // refresh liste
    } else {
      const data = await res.json();
      // Prikazi poruku iz API-ja, ili default ako nema
      alert(data?.error || "Greška pri brisanju");
    }
  } catch (err) {
    console.error(err);
    alert("Greška pri brisanju: server nedostupan");
  }
};

  return (
    <button
      onClick={handleDelete}
      className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded w-full"
    >
      Obriši
    </button>
  );
}