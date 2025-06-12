import React from 'react'
import { Outlet } from 'react-router-dom'
import './index.css'
import { Navbar } from "../src/components";
import { Footer } from "../src/components";

function App() {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <Navbar />

      <main>

        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default App
