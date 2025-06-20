import React from 'react'
import { Outlet } from 'react-router-dom'
import './index.css'
import { Navbar } from "../src/components";
import { Footer } from "../src/components";
  import { ToastContainer } from 'react-toastify';
function App() {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <Navbar />
      <ToastContainer />
      <main>

        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default App
