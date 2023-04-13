import React, { useState } from "react";
import ConfigurationForm from "../components/ConfigurationForm";
import { IConfig } from "../variables/types";
import { IEmployee } from "../variables/employee";


const ConfigPage: React.FC = () => {

  const [config, setConfig] = useState<IConfig>({
    excelpath: "",
    year: "",
    jsondir: "",
    period: "",
    sheet: "",
    supervisor: "",
  })
  const [data, setData] = useState<IEmployee[]>([])

  const [raw, setRaw] = useState<IEmployee[]>([])
  return (
    <div>
      <div>
        <ConfigurationForm config={config} setConfig={setConfig} raw={raw} setRaw={setRaw} data={data} setData={setData} />
      </div>
      <div className="my-8 font-semibold text-xl">{`Total ${data?.length}`}</div>
      <div>
        <ul className="text-xs flex flex-col gap-1">
          {data?.map((ele, index) => {
            return (
              <li key={index} className="grid grid-cols-3 gap-4 border-b border-b-gray-700 mt-2" >
                <span>{`${index + 1}. ${ele.employeeCode}`}</span>
                <span>{ele.employeeName}</span>
                <span>{ele.supervisor}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default ConfigPage;
