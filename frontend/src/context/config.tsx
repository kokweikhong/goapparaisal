import React, { createContext, useContext, useState } from "react";
import { IConfig, IConfigProps } from "../variables/types";

const initialConfig: IConfig = {
  excelpath: "",
  supervisor: "",
  sheet: "",
  year: "",
  period: "",
  jsondir: "",
}

const ConfigContext = createContext<IConfigProps>({
  config: initialConfig,
  setConfig: () => { }
})

interface Props {
  children: React.ReactNode
}

export const ConfigContextProvider: React.FC<Props> = ({ children }) => {
  const [config, setConfig] = useState<IConfig>(initialConfig)
  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </ConfigContext.Provider>
  )
}

export const useConfigContext = () => useContext(ConfigContext)

