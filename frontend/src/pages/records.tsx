import React, { useState } from "react";
import { EmployeeCard } from "../components/EmployeeCard";
import {
  OpenDirForExcelFile, GenerateAllEmployeeData,
  ReadEmployeeDataFromJsonFile, UpdateEmployeeDataToJson
} from "../../wailsjs/go/main/App";
import { IEmployee } from "../variables/employee";
import { EmployeeForm } from "../components/EmployeeForm";
import { initialEmployeeData } from "../variables/employee";


const RecordsPage: React.FC = () => {
  const [data, setData] = useState<IEmployee[]>([])
  const [jsonFile, setJsonFile] = useState<string>('')
  const [visible, setVisible] = useState<boolean>(false)
  const [selected, setSelected] = useState<IEmployee>(initialEmployeeData)
  const handleOpenFile = async () => {
    const res = await OpenDirForExcelFile()
    setJsonFile(res)
  }

  const handleReadJsonFile = async () => {
    const res = await ReadEmployeeDataFromJsonFile(jsonFile)
    setData(res)
  }

  const handleGenerateAllEmployeeData = async () => {
    const generatedData = await GenerateAllEmployeeData(data) as unknown as IEmployee[]
    setData(generatedData)
  }

  const handleSaveDataToJsonFile = async () => {
    await UpdateEmployeeDataToJson(data, jsonFile)
  }

  return (
    <div>
      <div className="border border-dashed border-black p-4">
        <div className="flex w-full justify-between items-stretch gap-4">
          <label className="font-semibold self-center">Json Output Directory :</label>
          <input type="text" value={jsonFile} disabled className="grow" />
          <button onClick={handleOpenFile} className="text-[#fff] uppercase font-medium tracking-wider bg-blue-500 py-2 px-4 rounded-md">Browse</button>
          <button onClick={handleReadJsonFile}
            className={`bg-pink-500 text-[#fff] uppercase font-medium tracking-wider py-2 px-4 rounded-md`}>
            Get Data
          </button>
        </div>
      </div>
      <div>
        <div className='grid grid-cols-4 gap-2 mt-[50px]'>
          {data.length > 1 &&
            <div className='col-span-full flex gap-4 mb-[30px]'>
              <button onClick={handleGenerateAllEmployeeData}
                className="bg-blue-500 px-4 py-2 rounded-xl text-[#fff] font-medium uppercase"
              >Auto Generate All Data</button>
              <button onClick={handleSaveDataToJsonFile}
                className="bg-pink-500 px-4 py-2 rounded-xl text-[#fff] font-medium uppercase"
              >Save Data To Json File</button>
            </div>
          }
          {data?.length > 1
            ? data?.map((e, i) => (
              <EmployeeCard key={i} data={e}
                visible={visible} setVisible={setVisible} setSelected={setSelected} />
            ))
            : <p className='w-full text-center font-medium uppercase'>No Result</p>
          }
        </div>

        <div className={`${visible ? "block" : "hidden"} p-10 absolute w-full h-full overflow-y-auto top-0 left-0 z-10 bg-white/90`}>
          <button onClick={() => setVisible(!visible)}
            className='absolute top-0 right-5 font-black text-xl'>X</button>
          <EmployeeForm selected={selected} setSelected={setSelected} data={data} setData={setData} />
        </div>
      </div>
    </div>
  )
}

export default RecordsPage;
