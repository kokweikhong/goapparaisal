import React, { createContext, useContext, useState } from "react";
import { IEmployeeProps, initialEmployeeData } from "../variables/employee";


const initialState: IEmployeeProps = {
  data: {
    raw: [initialEmployeeData],
    filtered: [initialEmployeeData],
  },
  setData: () => { }
}

const EmployeeContext = createContext<IEmployeeProps>(initialState)

interface Props {
  children: React.ReactNode
}

export const EmployeeContextProvider: React.FC<Props> = ({ children }) => {
  const [data, setData] = useState<IEmployeeProps>(initialState)
  return (
    <EmployeeContext.Provider value={{ ...data, setData }}>
      {children}
    </EmployeeContext.Provider>
  )
}

export const useEmployeeContext = () => useContext(EmployeeContext)
