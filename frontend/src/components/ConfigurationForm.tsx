import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  OpenDirForExcelFile, GetExcelSheets,
  InitEmployeeData, OpenDirectory,
  SaveEmployeeDataToJson, MessageDialog
} from "../../wailsjs/go/main/App";
import { IEmployee } from "../variables/employee";
import { IConfig } from "../variables/types";

export interface IConfigurationFormProps {
  config: IConfig
  setConfig: Dispatch<SetStateAction<IConfig>>
  raw: IEmployee[]
  setRaw: Dispatch<SetStateAction<IEmployee[]>>
  data: IEmployee[]
  setData: Dispatch<SetStateAction<IEmployee[]>>
  setLoading: Dispatch<SetStateAction<boolean>>
}

const ConfigurationForm: React.FC<IConfigurationFormProps> = ({ config, setConfig, raw, setRaw, data, setData, setLoading }) => {
  const [sheets, setSheets] = useState<string[]>([])
  const [supervisors, setSupervisors] = useState<string[]>([])
  let years: string[] = [0, 1, -1].map(i => (String(new Date().getFullYear() - i)))

  useEffect(() => {
    const period: string = '01/07/' + String(new Date().getFullYear() - 1) + " to 30/06/" + String(new Date().getFullYear())
    setConfig(prev => ({ ...prev, period: period }))
  }, [])

  const handleYearOnChange = (year: string) => {
    setConfig({ ...config, supervisor: "ALL", year: year, period: "01/07/" + String(parseInt(year) - 1) + " to 30/06/" + year })
  }

  const handleOpenExcelFile = async () => {
    setLoading(true)
    try {
      const res = await OpenDirForExcelFile()
      const sheets = await GetExcelSheets(res)
      setConfig(prev => ({ ...prev, excelpath: res }))
      setSheets(sheets)
      await MessageDialog("info", "Read Appraisal Excel", "Get Excel Sheets Successfully.")
    } catch (e) {
      await MessageDialog("error", "Read Appraisal Excel", `${e}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSheetChange = async () => {
    setLoading(true)
    try {
      const res = await InitEmployeeData(config.excelpath, config.sheet)
      setRaw(res)
      setData(data)
      let supers: string[] = res.map(item => (item.supervisor))
      supers = [...new Set(supers)]
      supers = ["ALL"].concat(supers)
      setSupervisors(supers)
      await MessageDialog("info", "Get Supervisor List", "Get Supervisor Listing Successfully.")
    } catch (e) {
      await MessageDialog("error", "Get Supervisor List", `${e}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSupervisorChange = async () => {
    setLoading(true)
    const filteredData = raw.filter(ele => { return (config.supervisor === "ALL" ? ele : ele.supervisor === config.supervisor) })
    setData(filteredData)
    await MessageDialog("info", "Get Appraisal Name list", `Get ${config.supervisor}'s Appraisal Name List Successffuly.`)

    setLoading(false)
  }

  const handleOpenDirectory = async () => {
    const res = await OpenDirectory()
    setConfig({ ...config, jsondir: res })
  }

  const handleExportToJsonFile = async () => {
    setLoading(true)
    try {
      const dataWithDateReview = data.map(ele => ({ ...ele, periodUnderReview: config.period }))
      await SaveEmployeeDataToJson(dataWithDateReview, config.jsondir)
      await MessageDialog("info", "Export To Json File", `Export to ${config.jsondir} successfully.`)
    } catch (e) {
      await MessageDialog("error", "Export To Json File", `${e}`)
    } finally {
      setLoading(false)
    }
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
      <div className="flex w-full justify-between items-stretch gap-4">
        <label className="font-semibold self-center">Json Output Directory :</label>
        <input type="text" value={config?.jsondir} disabled className="grow" />
        <button onClick={handleOpenDirectory} className="text-[#fff] uppercase font-medium tracking-wider bg-blue-500 py-2 px-4 rounded-md">Browse</button>
        <button onClick={handleExportToJsonFile}
          disabled={data?.length < 2 ? true : false}
          className={`${data?.length < 2 ? 'bg-gray-500' : 'bg-pink-500'} text-[#fff] uppercase font-medium tracking-wider py-2 px-4 rounded-md`}>
          Export
        </button>
      </div>
    </div >
  )
}


export default ConfigurationForm
