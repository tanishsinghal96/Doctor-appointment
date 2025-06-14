import React from 'react'
import useAppContext from '../context/AppContext'
import { useNavigate } from "react-router-dom"
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
function Doctors() {
  //speciality come from the params

  const { speciality } = useParams();
  const { doctors } = useAppContext();
  const navigate = useNavigate();
  const [filteredDoctors, setfilteredDoctors] = useState([]);
 const [showFilters, setshowFilters] = useState(true)

  // Filter doctors based on speciality
  useEffect(() => {
    console.log("jai jo ")
    if (speciality) {
      setfilteredDoctors(doctors.filter((doctor) => doctor.speciality === speciality));
    } else {
      setfilteredDoctors(doctors);
    }
  }, [speciality, doctors]);


  const categories = [
    "General physician",
    "Dermatologist",
    "Gynecologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist",
  ];

  return (
    <div className="p-5 md:px-20 mt-10">
      <p className="text-gray-600">Browse through the doctors specialist.</p>

      {/* Specialties List */}
      <div className="flex flex-col sm:flex-row items-start  gap-5 mt-5">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setshowFilters((prev) => !prev)}
            className={` sm:hidden mb-2 px-4 py-2 rounded border border-indigo-400 bg-indigo-50 text-indigo-700 font-medium hover:bg-indigo-100 transition-all duration-200 w-fit`}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
          {showFilters && categories.map((category) => (
            <p
              key={category}
              onClick={(e) =>
                speciality === e.target.textContent
                  ? navigate('/doctors')
                  : navigate(`/doctors/${e.target.textContent}`)
              }
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
                speciality === category
                  ? "bg-indigo-100 text-black border-gray-500"
                  : ""
              }`}
            >
              {category}
            </p>
          ))}
        </div>
        <div className="w-full grid grid-cols-auto sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
          {
          filteredDoctors.map((doctor, index) => (
            <Link to={`/appointments/${doctor._id}`}  className='w-full' key={index}>
              <div className='border border-blue-200  rounded-xl overflow-hidden cursor-pointer  hover:translate-y-[-10px] transition-all duration-500'>
                <img src={doctor.image} alt={doctor.name} className='bg-blue-50' />
                <div className='p-4'>
                  <div className='flex items-center gap-2 text-sm text-center text-green-500'>
                    <p className='bg-green-500 w-2 h-2 rounded-full'></p><p>Available</p>
                  </div>
                  <h2 className='text-lg font-semibold'>{doctor.name}</h2>
                  <p className='text-sm text-gray-600'>{doctor.speciality}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}


export default Doctors
