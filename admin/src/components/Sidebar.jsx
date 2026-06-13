import React, { use, useState } from 'react'
import useAdminContext from "../context/AdminContext"
import { NavLink } from 'react-router-dom'
import {assets} from '../assets/assets'  
import useDoctorContext from '../context/DoctorContext'
function Sidebar() {
  const { aToken } = useAdminContext();
  const { dToken } = useDoctorContext();
  return (
    <div className='min-h-screen bg-gray-50 rounded-lg shadow-md p-4 sticky top-0 left-0 h-screen'>
      {
        aToken && (
          <ul className='text-[#515151] mt-5'>
            <li>
              <NavLink
                to="/admin-dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer rounded transition-colors ${
                    isActive ? 'bg-blue-600 border-r-4 border-blue-700 text-white' : 'hover:bg-blue-300'
                  }`
                }
              >
                <img src={assets.home_icon} alt="" />
                <p>Dashboard</p>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/all-appointments"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer rounded transition-colors ${
                    isActive ? 'bg-blue-600 border-r-4 border-blue-700 text-white' : 'hover:bg-blue-100'
                  }`
                }
              >
                <img src={assets.appointment_icon} alt="" />
                <p>Appointments</p>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/add-doctor"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer rounded transition-colors ${
                    isActive ? 'bg-blue-600 border-r-4 border-blue-700 text-white' : 'hover:bg-blue-100'
                  }`
                }
              >
                <img src={assets.add_icon} alt="" />
                <p>Add Doctor</p>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/doctors-list"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer rounded transition-colors ${
                    isActive ? 'bg-blue-600 border-r-4 border-blue-700 text-white' : 'hover:bg-blue-100'
                  }`
                }
              >
                <img src={assets.people_icon} alt="" />
                <p>Doctor List</p>
              </NavLink>
            </li>
          </ul>
        )
      }
      {
        dToken && (
          <ul className='text-[#515151] mt-5'>
            <li>
              <NavLink
                to="/doctor-profile"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer rounded transition-colors ${
                    isActive ? 'bg-blue-600 border-r-4 border-blue-700 text-white' : 'hover:bg-blue-300'
                  }`
                }
              >
                <img src={assets.home_icon} alt="" />
                <p>Doctor Profiles</p>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/doctor-dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer rounded transition-colors ${
                    isActive ? 'bg-blue-600 border-r-4 border-blue-700 text-white' : 'hover:bg-blue-100'
                  }`
                }
              >
                <img src={assets.appointment_icon} alt="" />
                <p>Doctor Dashboard</p>
              </NavLink>
            </li>
            
            <li>
              <NavLink
                to="/doctor-appointments"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer rounded transition-colors ${
                    isActive ? 'bg-blue-600 border-r-4 border-blue-700 text-white' : 'hover:bg-blue-100'
                  }`
                }
              >
                <img src={assets.people_icon} alt="" />
                <p>Doctor Appointments</p>
              </NavLink>
            </li>
          </ul>
        )
      }
    </div>
  )
}

export default Sidebar
