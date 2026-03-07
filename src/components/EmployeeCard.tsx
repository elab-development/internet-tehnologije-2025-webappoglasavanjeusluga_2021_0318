
import React from "react";
import { FullEmployeeDto } from "@/shared/types";
import DeleteEmployeeBtn from "@/components/DeleteEmployeeBtn";

type Props = {
  employee: FullEmployeeDto;
  onDeleted: () => void;
};

export default function EmployeeCard({ employee, onDeleted }: Props) {
  return (
    <div className="flex flex-wrap sm:flex-nowrap bg-gray-600 mx-auto w-full max-w-[600px] p-4 text-white gap-8 rounded ">

      <div className="flex flex-col w-12">
        <p className="text-gray-300 text-sm">ID</p>
        <p>{employee.id}</p>
      </div>

      <div className="flex flex-col w-24">
        <p className="text-gray-300 text-sm">Ime</p>
        <p>{employee.firstName}</p>
      </div>

      <div className="flex flex-col w-24">
        <p className="text-gray-300 text-sm">Prezime</p>
        <p>{employee.lastName}</p>
      </div>

      <div className="flex flex-col w-24">
        <p className="text-gray-300 text-sm">Opis</p>
        <p>{employee.description}</p>
      </div>

        <div className="ml-auto mt-2">
          <DeleteEmployeeBtn
            employeeId={employee.id}
            onDeleted={onDeleted}
          />
        </div>
      

    </div>
  );
}