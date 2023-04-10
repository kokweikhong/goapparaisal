import { Dispatch, SetStateAction } from "react";

export interface IConfig {
  excelpath: string
  // periodFrom: string
  // periodTo: string
  year: string
  period: string
  sheet: string
  supervisor: string
}

export interface IConfigProps {
  config: IConfig;
  setConfig: Dispatch<SetStateAction<IConfig>>;
}


