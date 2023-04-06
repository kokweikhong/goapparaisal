import React from 'react'
import { createRoot } from 'react-dom/client'
import "./styles/main.css"
import App from './App'
import { ConfigContextProvider } from './context/config'
import { EmployeeContextProvider } from './context/employee'

const container = document.getElementById('root')

const root = createRoot(container!)

root.render(
  <React.StrictMode>
    <ConfigContextProvider>
      <EmployeeContextProvider>
        <App />
      </EmployeeContextProvider>
    </ConfigContextProvider>
  </React.StrictMode>
)
