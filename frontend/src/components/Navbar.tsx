import React from "react";
import { Link } from "react-router-dom"


const Navbar: React.FC = () => {
  return (
    <>
      <nav className="w-full bg-gray-100 p-4 mb-8">
        <ul className="flex justify-end items-center gap-6 uppercase font-medium underline">
          <Link to="/">Configuration</Link>
          <Link to="/records">Records</Link>
          <Link to="/records">Report</Link>
        </ul>
      </nav>
    </>
  )
}

export default Navbar;
