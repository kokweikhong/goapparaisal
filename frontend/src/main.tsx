import React from 'react'
import { createRoot } from 'react-dom/client'
import "./styles/main.css"
import App from './App'
import { ConfigContextProvider } from './context/config'
import { EmployeeContextProvider } from './context/employee'
import { HashRouter } from "react-router-dom"

const container = document.getElementById('root')

const root = createRoot(container!)

root.render(
  <React.StrictMode>
    <HashRouter>
      <ConfigContextProvider>
        <EmployeeContextProvider>
          <App />
        </EmployeeContextProvider>
      </ConfigContextProvider>
    </HashRouter>
  </React.StrictMode>
)
