import React from 'react'
import Navbar from '../Navbar'
import { assets } from '../../assets/assets'

function Header() {
  return (
    <div className='flex flex-col md:flex-row bg-primary rounded-lg px-6 md:px-10 lg:px-20'>
      {/* left side part with some button and text */}
      <div className='md:1/2 flex flex-col justify-center items-start gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]'>
        <p className='text-white text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight md:leading-tight lg:leading-tight'>
          Book Appointment <br/> With Trusted Doctors
        </p>
        <div className='text-white text-sm font-light flex flex-col md:flex-row items-center gap-3 '>
          <img className='w-28' src={assets.group_profiles} alt="" />
          simply browse and book the appointment with the doctor <br className='hidden sm:block'/> Schedule your appointment, and get the best healthcare services.
        </div>

        <a href="#speciality" className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600  text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300 ease-in-out'>
          Book Appointment <img src={assets.arrow_icon} className='w-3' alt="" />
        </a>
      </div>
      {/* right side part with image */}
      <div className='md:w-1/2 relative'>
        <img className='w-full md:absolute bottom-0 h-auto rounded-lg ' src={assets.header_img} alt="" />
      </div>
    </div>
  )
}

export default Header
