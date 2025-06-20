import React,{useState,useEffect} from 'react'
import useAdminContext from '../../context/AdminContext'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import axios from 'axios'

function DoctorsList() {
    

  const { DoctorsList, fetchDoctorsList,aToken,handleToggleAvailability } = useAdminContext();

  useEffect(() => {
    // Fetch the doctors list when the component mounts
    const fetchData = async () => {
      try {
        await fetchDoctorsList();
      } catch (error) {
        toast.error("Failed to fetch doctors list. Please try again later.");
        console.error("Error fetching doctors list:", error);
      }
    };
    fetchData();
  }, [aToken]);

  

  return (
    <div className="w-full grid grid-cols-auto sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
      {DoctorsList.map((doctor, index) => (
        <div className="w-full" key={index}>
          <div className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 ">
            <img src={doctor.image} alt={doctor.name} className="bg-blue-50 hover:bg-primary" />
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm text-center">
                <label className="flex items-center cursor-pointer">
                  <span className="mr-2">{doctor.available ? 'Available' : 'Unavailable'}</span>
                  <input
                    type="checkbox"
                    checked={doctor.available}
                    onChange={() => handleToggleAvailability(doctor._id, !doctor.available)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-primary relative transition-colors duration-300">
                    <div className={`absolute top-0 left-0 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ${doctor.available ? 'translate-x-5' : ''}`}></div>
                  </div>
                </label>
              </div>
              <h2 className="text-lg font-semibold">{doctor.name}</h2>
              <p className="text-sm text-gray-600">{doctor.speciality}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DoctorsList
