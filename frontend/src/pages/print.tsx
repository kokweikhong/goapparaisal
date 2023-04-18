import React, { useState } from "react";
import { SelectMultipleFiles } from "../../wailsjs/go/main/App";


const PrintPage: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([])

  const handleSelectMultipleFiles = async () => {
    const res = await SelectMultipleFiles()
    setSelected(res)
  }
  return (
    <div>

      <div className="border border-dashed border-black p-4 flex flex-col gap-2">
        <div className="flex w-full justify-between items-stretch gap-4">
          <p className="font-semibold self-center">Total Selected Print Files :</p>
          <input type="number" value={selected.length} disabled className="text-center font-bold" />
          <button onClick={handleSelectMultipleFiles} className="text-[#fff] uppercase font-medium tracking-wider bg-blue-500 py-2 px-4 rounded-md">Browse</button>
        </div>
      </div>

      <div>
        <div>
        <button>Print</button>
        </div>
        <ul>
          {selected?.map((file, index) => {
            return (
              <li key={index}>{file}</li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default PrintPage;
