import React from 'react'
import useAppContext from '../context/AppContext'

function MyAppointments() {
   const { doctors } = useAppContext();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">My Appointments</h2>
      <div className="space-y-6">
        {doctors.slice(0, 3).map((doctor, index) => (
          <div
            key={doctor.id}
            className="flex flex-col md:flex-row items-center bg-white shadow-md rounded-lg p-4 gap-6"
          >
            <div className="flex-shrink-0 w-32 h-32">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-32 h-max rounded-lg object-cover border-2 border-blue-500 bg-indigo-50"
              />
            </div>
            <div className="flex-1">
              <p className="text-lg font-semibold">{doctor.name}</p>
              <p className="text-blue-600">{doctor.speciality}</p>
              <div className="text-gray-600 mt-2">
                <p className="font-medium">Address:</p>
                <p>{doctor.address.line1}</p>
                <p>{doctor.address.line2}</p>
              </div>
              <p className="mt-2">
                <span className="font-medium">Date &amp; Time:</span> 25, July, 2025
              </p>
              <p className="mt-1 font-semibold text-green-600">Price: {doctor.price}</p>
            </div>
            <div className="flex flex-col gap-2 mt-4 md:mt-0">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                Pay online
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
                Cancel appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointments
