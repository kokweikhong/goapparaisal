import { Dispatch, SetStateAction } from "react";

export interface IConfig {
  excelpath: string
  year: string
  period: string
  sheet: string
  supervisor: string
  jsondir: string
}

export interface IConfigProps {
  config: IConfig;
  setConfig: Dispatch<SetStateAction<IConfig>>;
}


