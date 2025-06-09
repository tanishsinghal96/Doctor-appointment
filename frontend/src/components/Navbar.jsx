import React, { useState } from 'react'
import { assets } from '../assets/assets.js'
import { NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
function Navbar() {
  const navigate = useNavigate();
  const [token, settoken] = useState(true);
  const [showMenu, setshowMenu] = useState(false)
  return (
    <div className='flex items-center justify-between bg-white p-4 shadow-md text-sm py-4 mb-5 border-b border-b-gray-400'>
      <img className="cursor-pointer w-44" src={assets.logo} alt="" />
      <ul className='hidden md:flex items-start gap-4 text-gray-600 font-medium'>
        <NavLink to='/'>
          <li className='py-1'>Home</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden ' />
        </NavLink>

        <NavLink to="/doctors">
          <li className='py-1'>All Doctors</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>

        <NavLink to="/about">
          <li className='py-1'>About</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>

        <NavLink to="/contact">
          <li className='py-1'>Contact Us</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>

      </ul>
      <div className='flex items-center gap-4'>
        {token?(
          <div className='flex items-center gap-2 relative cursor-pointer group' >
            <img src={assets.profile_pic}  alt="" className='w-8 rounded-full' />
            <img src={assets.dropdown_icon} alt="" className='w-2.5' />
            <div className='absolute top-0 right-0 pt-14 text-base  font-medium text-gray-600 z-20 hidden group-hover:block'>
              <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                <p className='hover:text-black cursor-pointer' onClick={()=>navigate("/my-profile")}>my_profile</p>
                <p className='hover:text-black cursor-pointer' onClick={()=>navigate("/my-appointments")}>my-appoinments</p>
                <p className='hover:text-black cursor-pointer' onClick={()=>{settoken(false); navigate("/login")}}>logout</p>
              </div>
            </div>
          </div>
        ):(<button onClick={() => {navigate('/login')}} className='bg-primary text-white px-8 py-3 rounded-full  font-light hidden md:block '>Create Account</button>)}

      </div>
    </div>
  )
}

export default Navbar
