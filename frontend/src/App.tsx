import { useEffect, useState } from 'react';
// import { Greet } from "../wailsjs/go/main/App";
import ConfigurationForm from './components/ConfigurationForm';
// import { IConfig } from './variables/types';
import { IEmployeeProps, initialEmployeeData, IEmployee } from './variables/employee';
import { EmployeeCard } from './components/EmployeeCard';
import { useEmployeeContext } from './context/employee';
import { EmployeeForm } from './components/EmployeeForm';

// const initialConfig: IConfig = {
//   excelpath: "",
//   periodFrom: "",
//   periodTo: "",
//   sheet: "",
//   supervisor: "",
// }

// const initialDataProps: IEmployeeProps = {
//   data: initialEmployeeData,
//   setData: () => {}
// }

// export interface IDataProps {
//   raw: IEmployee[];
//   filtered: IEmployee[];
// }

function App() {
  const { data, setData } = useEmployeeContext()
  const [visible, setVisible] = useState<boolean>(false)
  const [selected, setSelected] = useState<IEmployee>(initialEmployeeData)
  useEffect(() => {
    console.log(visible)
  }, [visible])

  return (
    <div id="App" className='containter mx-auto px-[15px] relative'>
      <div><ConfigurationForm /></div>

      <div className='grid grid-cols-4 gap-2 mt-[50px]'>
        {data.filtered.length > 1
          ? data?.filtered.map((e, i) => (
            <EmployeeCard key={i} data={e}
              visible={visible} setVisible={setVisible} setSelected={setSelected} />
          ))
          : <p>No Result</p>
        }
      </div>

      <div>
        {selected && selected.employeeName}
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
