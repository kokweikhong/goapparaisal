import React, { useState } from "react";
import {
  OpenDirForExcelFile, GetExcelSheets,
  MessageDialog, ReadEmployeeDataFromJsonFile,
  ConvertJsonToExcel
} from "../../wailsjs/go/main/App";
import { IEmployee } from "../variables/employee";

const ConvertPage: React.FC = () => {
  const [excel, setExcel] = useState<string>('')
  const [json, setJson] = useState<string>('')
  const [sheet, setSheet] = useState<string>('')
  const [sheets, setSheets] = useState<string[]>([])
  const [data, setData] = useState<IEmployee[]>([])

  const handleSelectExcel = async () => {
    try {
      const res = await OpenDirForExcelFile()
      setExcel(res)
      const sh = await GetExcelSheets(res)
      setSheets(sh)
      await MessageDialog("info", "Read Excel File", `Successfully read data from ${res}`)
    } catch (e) {
      await MessageDialog("error", "Read Excel File", `${e}`)
    }
  }

  const handleSelectJson = async () => {
    try {
      const res = await OpenDirForExcelFile()
      setJson(res)
      const d = await ReadEmployeeDataFromJsonFile(res) as unknown as IEmployee[]
      setData(d)
      await MessageDialog("info", "Read Json Data", `Successfully read data from ${res}`)
    } catch (e) {
      await MessageDialog("error", "Read Json Data", `${e}`)
    }
  }

  const handleConvertJsonToExcel = async () => {
    if (excel.length < 3 || json.length < 3) {
      await MessageDialog("error", "Convert Data to Excel", "Not valid data.")
      return
    }
    try {
      await ConvertJsonToExcel(excel, sheet, data)
      await MessageDialog("info", "Convert Data To Excel", `Successfully convert to data to ${excel}`)
    } catch (e) {
      await MessageDialog("error", "Convert Data To Excel", `${e}`)
    }
  }

  return (
    <div>
      <div className="border border-dashed border-black p-4 flex flex-col gap-2">
        <div className="flex w-full justify-between items-stretch gap-4">
          <label className="font-semibold self-center">Appraisal Excel File :</label>
          <input type="text" value={excel} disabled className="grow" />
          <button onClick={handleSelectExcel} className="text-[#fff] uppercase font-medium tracking-wider bg-blue-500 py-2 px-4 rounded-md">Browse</button>
        </div>
        <div className="flex w-full justify-between items-stretch gap-4">
          <label className="font-semibold self-center">Appraisal Excel Sheet :</label>
          <select value={sheet} className="grow p-2" onChange={(e) => setSheet(e.target.value)} >
            <option value="">Select Excel Sheet</option>
            {sheets?.map((sheet, index) => (
              <option value={sheet} key={index}>{sheet}</option>
            ))}
          </select>
        </div>

        <div className="flex w-full justify-between items-stretch gap-4">
          <label className="font-semibold self-center">Appraisal Json File :</label>
          <input type="text" value={json} disabled className="grow" />
          <button onClick={handleSelectJson} className="text-[#fff] uppercase font-medium tracking-wider bg-blue-500 py-2 px-4 rounded-md">Browse</button>
        </div>
        <div className="py-4 flex w-full justify-between items-stretch gap-4">
          <button
            onClick={handleConvertJsonToExcel}
            className="px-4 py-2 bg-blue-500 text-[#fff] font-medium rounded-xl"
          >Convert Data From Json To Excel</button>
        </div>
      </div>
    </div>
  )
}

export default ConvertPage;
