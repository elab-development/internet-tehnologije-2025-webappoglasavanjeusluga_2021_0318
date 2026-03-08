"use client";

import React, { useEffect, useState, FormEvent } from "react";
import EmployeeCard from "./EmployeeCard";
import { FullEmployeeDto } from "@/shared/types";

export default function EmployeesPageContent() {
  const [employees, setEmployees] = useState<FullEmployeeDto[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch zaposlenih
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/employees");
        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        console.error("Greška pri učitavanju zaposlenih:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleDeleted = async () => {
  const res = await fetch("/api/employees");
  const data = await res.json();
  setEmployees(data);
};

  // Dodavanje novog zaposlenog
  const handleAddEmployee = async (e: FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName) return;

    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, description }),
      });

      const newEmployee = await res.json();

      // Dodaj novog zaposlenog u state
      setEmployees(prev => [...prev, newEmployee]);

      // reset forme
      setFirstName("");
      setLastName("");
      setDescription("");
    } catch (err) {
      console.error("Greška pri dodavanju zaposlenog:", err);
    }
  };

  return (
    <div className="bg-linear-to-r from-blue-400 via-blue-200 to-yellow-100 pb-50 pt-10 ">
        <p className="text-4xl mb-3 mt-3 text-center">Radnici</p>
        <div className="flex flex-col md:flex-row gap-5 max-w-[800px] mx-auto p-4 ">
          {/* Forma za dodavanje zaposlenog */}
          <form onSubmit={handleAddEmployee} className="mx-auto flex flex-col gap-3 mb-6 bg-white p-5 max-w-70 h-60 rounded-xl">
            <input
              type="text"
              placeholder="Ime"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Prezime"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Opis"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="border p-2 rounded"
            />
            <button type="submit" className="bg-blue-600 text-white py-2 rounded">
              Dodaj radnika
            </button>
          </form>

          {/* Render zaposlenih */}
          <div className="flex flex-col gap-4 ">
          {loading ? (
            <p className="text-lg font-medium text-gray-700 mx-auto">
              Učitavanje...
            </p>
          ) : employees.length === 0 ? (
            <p>Nema radnika.</p>
          ) : (
            employees.map(emp => (
              <EmployeeCard
                key={emp.id}
                employee={emp}
                onDeleted={handleDeleted}
              />
            ))
          )}
          </div>
        </div>
    </div>
   
  );
}