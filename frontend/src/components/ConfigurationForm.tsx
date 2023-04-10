import React, { useEffect, useState } from "react";
import { OpenDirForExcelFile, GetExcelSheets, InitEmployeeData } from "../../wailsjs/go/main/App";
// import { IEmployeeProps } from "../variables/employee";
import { useConfigContext } from "../context/config";
import { useEmployeeContext } from "../context/employee";
import { IEmployee } from "../variables/employee";

// type Props = IEmployeeProps

const ConfigurationForm: React.FC = () => {
  const { config, setConfig } = useConfigContext()
  const { data, setData } = useEmployeeContext()
  const [sheets, setSheets] = useState<string[]>([])
  const [supervisors, setSupervisors] = useState<string[]>([])
  let years: string[] = [0, 1, -1].map(i => (String(new Date().getFullYear() - i)))

  console.log(data.raw)

  useEffect(() => {
    const period: string = '01/07/' + String(new Date().getFullYear() - 1) + " to 30/06/" + String(new Date().getFullYear())
    setConfig({ ...config, period: period })
  }, [])

  const handleYearOnChange = (year: string) => {
    setConfig({ ...config, supervisor: "ALL", year: year, period: "01/07/" + String(parseInt(year) - 1) + " to 30/06/" + year })
  }

  const handleOpenExcelFile = async () => {
    const res = await OpenDirForExcelFile()
    const sheets = await GetExcelSheets(res)
    setConfig(prev => ({ ...prev, excelpath: res }))
    setSheets(sheets)
  }
  const handleSheetChange = async () => {
    const res = await InitEmployeeData(config.excelpath, config.sheet)
    setData(prev => ({ ...prev, data: { ...prev.data, raw: res } }))
    let supers: string[] = res.map(item => (item.supervisor))
    supers = [...new Set(supers)]
    supers = ["ALL"].concat(supers)
    setSupervisors(supers)
  }
  const handleSupervisorChange = () => {
    const filteredData = data.raw.filter(ele => { return (config.supervisor === "ALL" ? ele : ele.supervisor === config.supervisor) })
    setData(prev => ({ ...prev, data: { ...prev.data, filtered: filteredData } }))
  }

  return (
    <div className="text-[14px] w-full flex flex-col gap-4 p-4 border border-dashed border-black">
      <div className="flex w-full justify-between items-stretch gap-4">
        <label className="font-semibold self-center">Appraisal Excel File :</label>
        <input type="text" value={config?.excelpath} disabled className="grow" />
        <button onClick={handleOpenExcelFile} className="text-[#fff] uppercase font-medium tracking-wider bg-blue-500 py-2 px-4 rounded-md">Browse</button>
      </div>
      <div className="flex justify-start gap-10">
        <div className="flex gap-4">
          <label className="font-semibold self-center">Year :</label>
          <select value={config.year} onChange={(e) => handleYearOnChange(e.target.value)} className="tracking-wider w-[150px]">
            {years.map((year, index) => (
              <option value={year} key={index}>{year}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-4 grow">
          <label className="font-semibold self-center">Period :</label>
          <input type="text" value={config?.period} disabled className="grow p-2 tracking-wider" />
        </div>
      </div>
      <div className="grid grid-cols-2 items-center gap-20">
        <div className="flex gap-3">
          <label className="font-semibold self-center">Sheet :</label>
          <select value={config?.sheet} className="grow"
            onChange={(e) => setConfig(prev => ({ ...prev, sheet: e.target.value }))}>
            {sheets?.map((sheet, index) => (
              <option key={index} value={sheet}>{sheet}</option>
            ))}
          </select>
          <button onClick={handleSheetChange}
            className="text-[#fff] uppercase font-medium tracking-wider bg-blue-500 py-2 px-4 rounded-md">Get Sup</button>
        </div>
        <div className="flex gap-3">
          <label className="font-semibold self-center">Supervisor :</label>
          <select value={config?.supervisor} className="grow"
            onChange={(e) => setConfig(prev => ({ ...prev, supervisor: e.target.value }))}>
            {supervisors?.map((sup, index) => (
              <option key={index} value={sup}>{sup}</option>
            ))}
          </select>
          <button onClick={handleSupervisorChange}
            className="text-[#fff] uppercase font-medium tracking-wider bg-blue-500 py-2 px-4 rounded-md">Get Data</button>
        </div>
      </div>
    </div >
  )
}


export default ConfigurationForm
