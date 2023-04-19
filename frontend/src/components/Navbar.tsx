import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom"


const Navbar: React.FC = () => {
  const location = useLocation()
  useEffect(() => {
    console.log(location.pathname)
  }, [location.pathname])
  return (
    <nav className="w-full bg-gray-100 p-4 mb-8">
      <ul className="flex justify-end items-center gap-6 uppercase font-medium underline">
        <Link to="/" className={`${location.pathname === '/' && 'text-blue-500'}`} >Configuration</Link>
        <Link to="/records" className={`${location.pathname.match('/records') && 'text-blue-500'}`}>Records</Link>
        <Link to="/report" className={`${location.pathname.match('/report') && 'text-blue-500'}`}>Report</Link>
        <Link to="/convert" className={`${location.pathname.match('/convert') && 'text-blue-500'}`}>Convert Excel</Link>
        <Link to="/print" className={`${location.pathname.match('/print') && 'text-blue-500'}`}>Print</Link>
      </ul>
    </nav>
  )
}

export default Navbar;
