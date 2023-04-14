import React, { useState } from "react";
import { OpenDirForExcelFile, ReadEmployeeDataFromJsonFile, GenerateNonExecAppraisalPDF, OpenDirectory } from "../../wailsjs/go/main/App";
import { IEmployee } from "../variables/employee";

const ReportPage = () => {
  const [jsonFile, setJsonFile] = useState<string>('')
  const [data, setData] = useState<IEmployee[]>([])
  const [outputDir, setOutputDir] = useState<string>('')
  const [selected, setSelected] = useState<IEmployee[]>([])

  const handleOpenFile = async () => {
    const res = await OpenDirForExcelFile()
    setJsonFile(res)
  }

  const handleReadJsonFile = async () => {
    const res = await ReadEmployeeDataFromJsonFile(jsonFile) as unknown as IEmployee[]
    setData(res)
  }

  const handleCheckboxChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const find = data.find(ele => ele.employeeCode === event.target.value)
      if (find !== undefined) {
        setSelected(prev => [...prev, find])
      }
    } else if (!event.target.checked) {
      setSelected(selected.filter(ele => ele.employeeCode !== event.target.value))
    }
    console.log(selected)
  }

  const handleSelectAll = () => {
    const options = document.querySelectorAll<HTMLInputElement>(".name-option")
    options.forEach(o => o.checked = true)
    setSelected(data)
  }

  const handleResetAll = () => {
    const options = document.querySelectorAll<HTMLInputElement>(".name-option")
    options.forEach(o => o.checked = false)
    setSelected([])

  }

  const handleSelectOutputDir = async () => {
    const res = await OpenDirectory()
    setOutputDir(res)
  }

  const handleGenerateSelectedPFG = () => {
    selected.forEach(async (ele) => {
      await GenerateNonExecAppraisalPDF(ele, outputDir)
    })
  }

  return (
    <div>

      <div className="border border-dashed border-black p-4 flex flex-col gap-2">
        <div className="flex w-full justify-between items-stretch gap-4">
          <label className="font-semibold self-center">Json File :</label>
          <input type="text" value={jsonFile} disabled className="grow" />
          <button onClick={handleOpenFile} className="text-[#fff] uppercase font-medium tracking-wider bg-blue-500 py-2 px-4 rounded-md">Browse</button>
          <button onClick={handleReadJsonFile}
            className={`bg-pink-500 text-[#fff] uppercase font-medium tracking-wider py-2 px-4 rounded-md`}>
            Get Data
          </button>
        </div>
        <div className="flex w-full justify-between items-stretch gap-4">
          <label className="font-semibold self-center">PDF Output Directory :</label>
          <input type="text" value={outputDir} disabled className="grow" />
          <button onClick={handleSelectOutputDir} className="text-[#fff] uppercase font-medium tracking-wider bg-blue-500 py-2 px-4 rounded-md">Browse</button>
        </div>
      </div>


      <div>
        <div className="flex gap-3 border border-double p-4 my-4 border-black">
          <button
            className="bg-blue-500 text-[#fff] font-medium px-4 py-2 rounded-xl uppercase"
            onClick={handleSelectAll}>
            Select All
          </button>
          <button

            className="bg-blue-500 text-[#fff] font-medium px-4 py-2 rounded-xl uppercase"
            onClick={handleResetAll}>
            Reset All
          </button>
          <button
            className="bg-violet-500 text-[#fff] font-medium px-4 py-2 rounded-xl uppercase"
            onClick={handleGenerateSelectedPFG}>
            {`Generate Selected PDF (${selected.length})`}
          </button>
        </div>
        <div>
          <ul>
            {data?.map((ele, index) => (
              <li key={index} className="text-xs">
                <label className="flex gap-2 cursor-pointer">
                  <input
                    className="name-option"
                    type="checkbox"
                    value={ele.employeeCode}
                    onChange={(e) => handleCheckboxChecked(e)}
                  />
                  <span>{ele.employeeCode}</span>
                  <span>{ele.employeeName}</span>
                  <span>{ele.score}</span>
                  <span className="text-red-500">{ele.rating}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div >
  )
}

export default ReportPage;
