import React from 'react'
import {assets} from '../../assets/assets'
function Footer() {
  return (
    <div className="mt-20 border-t pt-10 pb-5 px-5 md:px-20 text-gray-700">
      <div className="flex flex-col md:flex-row justify-between gap-10">
        
        {/* Left Section */}
        <div className="flex-1 max-w-lg">
          <div className="flex items-center gap-2 mb-4">
            <img src={assets.logo} alt="Logo" className="w-18 h-18" />
           
          </div>
          <p className="text-sm leading-relaxed text-gray-600">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">COMPANY</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#">Home</a></li>
            <li><a href="#">About us</a></li>
            <li><a href="#">Contact us</a></li>
            <li><a href="#">Privacy policy</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">GET IN TOUCH</h3>
          <p className="text-sm mb-2">+1-212-456-7890</p>
          <p className="text-sm">greatstackdev@gmail.com</p>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="mt-10 text-center text-sm text-gray-400 border-t pt-5">
        
        Copyright © 2024 Prescripto. All Rights Reserved.
      </div>
    </div>
  )
}

export default Footer
