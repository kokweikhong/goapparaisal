import Navbar from './components/Navbar';
import { Routes, Route } from "react-router-dom";
import ConfigPage from './pages/config';
import RecordsPage from './pages/records';
import ReportPage from './pages/report';

function App() {
  return (
    <div id="App" className='containter mx-auto px-[15px] relative'>
      <Navbar />
      <Routes>
        <Route path="/" element={<ConfigPage />} />
        <Route path="/records" element={<RecordsPage />} />
        <Route path="/report" element={<ReportPage />} />
      </Routes>
    </div>
  )
}

export default App
