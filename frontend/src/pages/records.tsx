import React, { useState } from "react";
import { EmployeeCard } from "../components/EmployeeCard";
import {
  OpenDirForExcelFile, GenerateAllEmployeeData,
  ReadEmployeeDataFromJsonFile, UpdateEmployeeDataToJson, MessageDialog
} from "../../wailsjs/go/main/App";
import { IEmployee } from "../variables/employee";
import { EmployeeForm } from "../components/EmployeeForm";
import { initialEmployeeData } from "../variables/employee";
import Loading from "../components/Loading";


const RecordsPage: React.FC = () => {
  const [data, setData] = useState<IEmployee[]>([])
  const [jsonFile, setJsonFile] = useState<string>('')
  const [visible, setVisible] = useState<boolean>(false)
  const [selected, setSelected] = useState<IEmployee>(initialEmployeeData)
  const [loading, setLoading] = useState<boolean>(false)

  const handleOpenFile = async () => {
    const res = await OpenDirForExcelFile()
    setJsonFile(res)
  }

  const handleReadJsonFile = async () => {
    setLoading(true)
    try {
      const res = await ReadEmployeeDataFromJsonFile(jsonFile)
      setData(res)
      await MessageDialog("info", "Read Data From Json File", `Read data from ${jsonFile} successfully.`)
    } catch (e) {
      await MessageDialog("error", "Read Data From Json File", `${e}`)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateAllEmployeeData = async () => {
    setLoading(true)
    try {
      const generatedData = await GenerateAllEmployeeData(data) as unknown as IEmployee[]
      setData(generatedData)
      await MessageDialog("info", "Generate all employees' data", `Generated ${data.length} employee data successfully.`)
    } catch (e) {
      await MessageDialog("error", "Generate all employees' data", `${e}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDataToJsonFile = async () => {
    setLoading(true)
    try {
      await UpdateEmployeeDataToJson(data, jsonFile)
      await MessageDialog("info", "Save Data To Json File", `Successfully save data to ${jsonFile}`)
    } catch (e) {
      await MessageDialog("error", "Save Data To Json File", `${e}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Loading isShow={loading} />
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
          <EmployeeForm setLoading={setLoading} selected={selected} setSelected={setSelected} data={data} setData={setData} />
        </div>
      </div>
    </div>
  )
}

export default RecordsPage;
