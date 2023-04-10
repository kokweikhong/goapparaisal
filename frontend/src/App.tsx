import { useEffect, useState } from 'react';
// import { Greet } from "../wailsjs/go/main/App";
import ConfigurationForm from './components/ConfigurationForm';
// import { IConfig } from './variables/types';
import { initialEmployeeData, IEmployee } from './variables/employee';
import { EmployeeCard } from './components/EmployeeCard';
import { useEmployeeContext } from './context/employee';
import { EmployeeForm } from './components/EmployeeForm';
import { GenerateAllEmployeeData } from '../wailsjs/go/main/App';
import { useConfigContext } from './context/config';

function App() {
  const { data, setData } = useEmployeeContext()
  const { config } = useConfigContext()
  const [visible, setVisible] = useState<boolean>(false)
  const [selected, setSelected] = useState<IEmployee>(initialEmployeeData)
  useEffect(() => {
    console.log(visible)
  }, [visible])

  const handleGenerateAllEmployeeData = async () => {
    const generatedData = await GenerateAllEmployeeData(data.filtered) as unknown as IEmployee[]
    const addPeriodData = generatedData.map(ele => ({ ...ele, periodUnderReview: config.period }))
    setData(prev => ({ ...prev, data: { ...prev.data, filtered: addPeriodData } }))

  }

  return (
    <div id="App" className='containter mx-auto px-[15px] relative'>
      <div><ConfigurationForm /></div>

      <div className='grid grid-cols-4 gap-2 mt-[50px]'>
        {data.filtered.length > 1 &&
          <div className='col-span-full'>
            <button onClick={handleGenerateAllEmployeeData}
              className="bg-blue-500 px-4 py-2 rounded-xl text-[#fff] font-medium uppercase"
            >Auto Generate All Data</button>
          </div>
        }
        {data.filtered.length > 1
          ? data?.filtered.map((e, i) => (
            <EmployeeCard key={i} data={e}
              visible={visible} setVisible={setVisible} setSelected={setSelected} />
          ))
          : <p className='w-full text-center font-medium uppercase'>No Result</p>
        }
      </div>

      <div className={`${visible ? "block" : "hidden"} p-10 absolute w-full h-full max-h-screen overflow-y-auto top-0 left-0 z-10 bg-white/90`}>
        <button onClick={() => setVisible(!visible)}
          className='absolute top-0 right-5 font-black text-xl'>X</button>
        <EmployeeForm {...selected} />
      </div>
    </div>
  )
}

export default App
