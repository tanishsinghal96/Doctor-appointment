import React from 'react'
import './index.css'
import Login from "./pages/Login"
import { ToastContainer } from 'react-toastify';
import useAdminContext from './context/AdminContext'
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Outlet } from 'react-router-dom';
function App() {
  const { aToken } = useAdminContext();

  return aToken?(
    <div className='bg-[#F9F9F9]'>
      <ToastContainer />
      <Navbar />
      <div className='flex item-start'>
        <Sidebar />
         <Outlet />  
      </div>
     
    </div>
  ):(
    <>
      <Login/>
      <Outlet/>
       <ToastContainer />
    </>
  )
}

export default App
