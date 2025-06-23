import React, { useState } from 'react'
import { assets } from '../assets/assets.js'
import { NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import useAppContext from '../context/AppContext'
function Navbar() {
  const navigate = useNavigate();
  const { token, setToken,userData } = useAppContext();
  const [showMenu, setshowMenu] = useState(false);
  
  const logouthandler = () => {
    setToken(null);
    localStorage.removeItem('token');
    navigate('/');
  }

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
        {token&&userData?(
          <div className='flex items-center gap-2 relative cursor-pointer group' >
            <img src={userData.image}  alt="" className='w-8 rounded-full' />
            <img src={assets.dropdown_icon} alt="" className='w-2.5' />
            <div className='absolute top-0 right-0 pt-14 text-base  font-medium text-gray-600 z-20 hidden group-hover:block'>
              <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                <p className='hover:text-black cursor-pointer' onClick={()=>navigate("/my-profile")}>my_profile</p>
                <p className='hover:text-black cursor-pointer' onClick={()=>navigate("/my-appointments")}>my-appoinments</p>
                <p className='hover:text-black cursor-pointer' onClick={logouthandler}>logout</p>
              </div>
            </div>
          </div>
        ):(<button onClick={() => {navigate('/login')}} className='bg-primary text-white px-2 py-2 rounded-full  font-light  '>Create <br /> Account</button>)}
        
        <button className='md:hidden' onClick={() => setshowMenu(!showMenu)}>
          <img src={assets.menu_icon} alt="" className='w-6' />   
          {
            showMenu && (
              <div className='absolute top-16 right-4 bg-white shadow-lg rounded-lg p-4 w-48 z-10'>
                <ul className='flex flex-col gap-2 text-gray-600 font-medium'>
                  <NavLink to='/'>
                    <li className='py-1'><p>Home</p></li>
                  </NavLink>
                  <NavLink to="/doctors">
                    <li className='py-1'><p>All doctors</p></li>
                  </NavLink>
                  <NavLink to="/about">
                    <li className='py-1'><p>About</p></li>
                  </NavLink>
                  <NavLink to="/contact">
                    <li className='py-1'><p>Contact Us</p></li>
                  </NavLink>
                </ul>
              </div>
            )
          }
        </button>
      </div>
    </div>
  )
}

export default Navbar
