import React, { SetStateAction } from "react";
import { IEmployee } from "../variables/employee";

interface IEmployeeCardProps {
  data: IEmployee
  visible: boolean;
  setVisible: React.Dispatch<SetStateAction<boolean>>
  // selected: IEmployee;
  setSelected: React.Dispatch<SetStateAction<IEmployee>>
}


export const EmployeeCard: React.FC<IEmployeeCardProps> = ({ data, visible, setVisible, setSelected }) => {
  const handleToggleForm = () => {
    setVisible(!visible)
    setSelected(data)
  }
  return (
    <div className="flex flex-col p-4 border border-black rounded-md relative">
      <button
        onClick={handleToggleForm}
        className="absolute top-3 right-5 bg-blue-500 text-[10px] text-white py-1 px-2 rounded-md uppercase font-medium tracking-wider">
        Edit
      </button>
      <h1 className="text-[14px] font-semibold">{data.employeeCode}</h1>
      <h1 className="text-[14px] font-semibold">{data.employeeName}</h1>
      <div className="flex flex-col py-1">
        <span className="uppercase text-[#D9D9D9] text-[10px]">Date Join</span>
        <span className="text-[12px]">{data.dateJoin}</span>
      </div>
      <div className="flex flex-col py-1">
        <span className="uppercase text-[#D9D9D9] text-[10px]">supervisor</span>
        <span className="text-[12px]">{data.supervisor}</span>
      </div>
      <div className="flex flex-col py-1">
        <span className="uppercase text-[#D9D9D9] text-[10px]">designation</span>
        <span className="text-[12px]">{data.designation}</span>
      </div>
      <div className="flex flex-col py-1">
        <span className="uppercase text-[#D9D9D9] text-[10px]">division</span>
        <span className="text-[12px]">{data.division}</span>
      </div>
      <div className="flex flex-col py-1">
        <span className="uppercase text-[#D9D9D9] text-[10px]">department</span>
        <span className="text-[12px]">{data.department}</span>
      </div>
      <div className="flex gap-4">
        <div className="flex flex-col py-1">
          <span className="uppercase text-[#D9D9D9] text-[10px]">rating</span>
          <span className="text-[12px] font-medium">{data.rating}</span>
        </div>
        <div className="flex flex-col py-1">
          <span className="uppercase text-[#D9D9D9] text-[10px]">score</span>
          <span className="text-[12px] font-medium">{data.score}</span>
        </div>
      </div>
    </div>
  )
}
