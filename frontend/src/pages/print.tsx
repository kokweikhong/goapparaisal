import React, { useEffect, useState } from "react";
import {
  SelectMultipleFiles, GetPrinterSettings,
  SelectPrintApplication, PrintPDF,
  MessageDialog
} from "../../wailsjs/go/main/App";
import PrinterSettingSteps from "../components/PrinterSettingSteps";


export interface IPrinterSettingsProps {
  printerName: printerSetting
  paperSize: printerSetting
  orientation: printerSetting
  duplex: printerSetting
}

type printerSetting = {
  value: string | number
  isValid: boolean
}

const PrintPage: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([])
  const [printerSettings, setPrinterSettings] = useState<IPrinterSettingsProps>()
  const [printApp, setPrintApp] = useState<string>('')
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handlePrintPDF = async () => {
    if (!printerSettings?.duplex.isValid ||
      !printerSettings?.orientation.isValid ||
      !printerSettings.paperSize.isValid) {
      await MessageDialog("error", "PrintPDF", "Please check the printer settings.")
      return
    }
    try {
      selected.forEach(async (file) => {
        await PrintPDF(printApp, file, String(printerSettings?.printerName.value))
        await MessageDialog("info", "Print PDF", `Sent ${file} to printer.`)
      })
    } catch (e) {
      await MessageDialog("error", "Print PDF", `${e}`)
    }
  }

  const handleSelectMultipleFiles = async () => {
    const res = await SelectMultipleFiles()
    setSelected(res)
  }

  const handleGetPrinterSettings = async () => {
    try {
      const res = await GetPrinterSettings() as unknown as IPrinterSettingsProps
      setPrinterSettings(res)
      await MessageDialog("info", "Get Printer Setting", "Successfully get printer settings.")
    } catch (e) {
      await MessageDialog("error", "Get Printer Setting", `${e}`)
    }
  }

  const handleSelectPrintApplication = async () => {
    const res = await SelectPrintApplication()
    setPrintApp(res)
  }

  useEffect(() => {
    handleGetPrinterSettings()
  }, [])

  return (
    <div>
      <div className="border border-dashed border-black p-4 flex flex-col gap-2">
        <div className="flex w-full justify-between items-stretch gap-4">
          <label className="font-semibold self-center">Total Selected Print Files :</label>
          <input type="number" value={selected.length} disabled className="text-center font-bold grow" />
          <button onClick={handleSelectMultipleFiles} className="text-[#fff] uppercase font-medium tracking-wider bg-blue-500 py-2 px-4 rounded-md">Browse</button>
        </div>
        <div className="flex w-full justify-between items-stretch gap-4">
          <label className="font-semibold self-center">Select Print Application :</label>
          <input type="text" value={printApp} disabled className="text-center grow" />
          <button onClick={handleSelectPrintApplication} className="text-[#fff] uppercase font-medium tracking-wider bg-blue-500 py-2 px-4 rounded-md">Browse</button>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-2 p-10 mt-4 border border-black">
        <div className="flex gap-4 items-center">
          <h2 className="font-extrabold">Printer Settings</h2>
          <button
            onClick={handleGetPrinterSettings}
            className="bg-blue-500 font-medium px-4 py-2 text-[#fff] rounded-xl text-sm">Re-generate Setting</button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-blue-500 font-medium px-4 py-2 text-[#fff] rounded-xl text-sm">{`${isOpen ? 'HIDE' : 'SHOW'} How to Configure Printer Settings`}</button>
        </div>
        <div className="flex gap-4 items-center text-sm">
          <span className={`${printerSettings?.printerName.isValid ? 'bg-green-500' : 'bg-red-500'} w-6 h-6`}></span>
          <span className="font-medium">Printer Name : </span>
          <span className="font-medium">{printerSettings?.printerName.value}</span>
        </div>
        <div className="flex gap-4 items-center text-sm">
          <span className={`${printerSettings?.paperSize.isValid ? 'bg-green-500' : 'bg-red-500'} w-6 h-6`}></span>
          <span className="font-medium">Paper Size : </span>
          <span className="font-medium">{printerSettings?.paperSize.value}</span>
        </div>
        <div className="flex gap-4 items-center text-sm">
          <span className={`${printerSettings?.orientation.isValid ? 'bg-green-500' : 'bg-red-500'} w-6 h-6`}></span>
          <span className="font-medium">Orientation : </span>
          <span className="font-medium">{printerSettings?.orientation.value}</span>
        </div>
        <div className="flex gap-4 items-center text-sm">
          <span className={`${printerSettings?.duplex.isValid ? 'bg-green-500' : 'bg-red-500'} w-6 h-6`}></span>
          <span className="font-medium">Printer Name : </span>
          <span className="font-medium">{printerSettings?.duplex.value}</span>
        </div>
      </div>


      <div className={`${isOpen ? 'block' : 'hidden'}`}>
        <PrinterSettingSteps />
      </div>

      <div className="mt-4">
        <div className="py-4 flex gap-2">
          <button
            className="uppercase font-medium px-4 py-2 bg-violet-500 text-[#fff] text-2xl rounded-xl"
            onClick={handlePrintPDF}>Print</button>
          <button
            className="uppercase font-medium px-4 py-2 bg-blue-500 text-[#fff] text-2xl rounded-xl"
            onClick={() => setSelected([])}>reset</button>
        </div>
        <ul className="flex flex-col gap-1">
          {selected?.map((file, index) => {
            return (
              <li
                className="text-sm italic"
                key={index}>{file}</li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default PrintPage;
