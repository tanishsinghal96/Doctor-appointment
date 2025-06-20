import React from 'react'
import { assets } from "../assets/assets"
import useAdminContext from '../context/adminContext'
import { useNavigate } from 'react-router-dom'
function Navbar() {
    const { aToken,setAtoken } = useAdminContext();
   const navigate=useNavigate();
    const logout = () => {
    //  Optionally, you can also clear the token from the context state
        aToken&&setAtoken(''); // Uncomment if you want to clear the context state as well   
        aToken&&localStorage.removeItem("aToken"); 
        navigate('/')
    }


  return (
    <div className='flex justify-between items-center bg-white px-4 sm:px-10 py-3  shadow-md'>
      <div className='flex items-center gap-2 text-xs'>
        <img src={assets.admin_logo} alt="" className='w-36 sm:w-40 cursor-pointer' />
        <p className='border px-2.5 py-.5 rounded-full border-gray-500 text-gray-600'>{aToken?'Admin':'Doctor'}</p>
      </div>
      <button className='bg-primary text-white text-sm px-10 rounded-full' onClick={logout}>Logout</button>
    </div>
  )
}

export default Navbar
