import React from "react";
import step1 from "../assets/images/step1.png"
import step2 from "../assets/images/step2.png"
import step3 from "../assets/images/step3.png"
import step4 from "../assets/images/step4.png"


const PrinterSettingSteps: React.FC = () => {
  return (
    <div className="p-10 border border-dashed border-black">
      <div className="mb-4">
        <h2 className="font-black text-3xl mb-2">Step 1</h2>
        <div className="w-full h-auto">
          <img src={step1} className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="mb-4">
        <h2 className="font-black text-3xl mb-2">Step 2</h2>
        <div className="w-full h-auto">
          <img src={step2} className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="mb-4">
        <h2 className="font-black text-3xl mb-2">Step 3</h2>
        <div className="w-full h-auto">
          <img src={step3} className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="mb-4">
        <h2 className="font-black text-3xl mb-2">Step 4</h2>
        <div className="w-full h-auto">
          <img src={step4} className="w-full h-full object-cover" />
        </div>
      </div>

    </div>
  )
}

export default PrinterSettingSteps;
