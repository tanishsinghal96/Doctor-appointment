import React,{useEffect} from 'react'
import useAdminContext from '../../context/AdminContext'
import useAppContext from '../../context/AppContext'
import {assets} from '../../assets/assets.js'
function DashBoard() {
  const { getDashData, dashData ,aToken} = useAdminContext();
   const {calculateAge,formattedDate,currency} = useAppContext();
  useEffect(() => {
    if(aToken){ 
      getDashData();
    }
  },[aToken]);
    
 
  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center my-8 text-blue-700">Dashboard</h1>
      {dashData && (
        <>
          <div className="flex flex-wrap justify-between gap-6 mb-10">
            <div className="flex-1 min-w-[200px] flex items-center bg-white shadow-lg rounded-lg p-6">
              <img src={assets.appointment_icon} alt="" className="w-12 h-12 mr-4" />
              <div>
                <h2 className="text-lg font-semibold text-gray-700">Total Appointments</h2>
                <p className="text-2xl font-bold text-blue-600">{dashData.totalAppointments}</p>
              </div>
            </div>
            <div className="flex-1 min-w-[200px] flex items-center bg-white shadow-lg rounded-lg p-6">
              <img src={assets.doctor_icon} alt="" className="w-12 h-12 mr-4" />
              <div>
                <h2 className="text-lg font-semibold text-gray-700">Total Doctors</h2>
                <p className="text-2xl font-bold text-blue-600">{dashData.totalDoctors}</p>
              </div>
            </div>
            <div className="flex-1 min-w-[200px] flex items-center bg-white shadow-lg rounded-lg p-6">
              <img src={assets.patients_icon} alt="" className="w-12 h-12 mr-4" />
              <div>
                <h2 className="text-lg font-semibold text-gray-700">Total Patients</h2>
                <p className="text-2xl font-bold text-blue-600">{dashData.totalUsers}</p>
              </div>
            </div>
            <div className="flex-1 min-w-[200px] flex items-center bg-white shadow-lg rounded-lg p-6">
              <img src={assets.revenue_icon || assets.patients_icon} alt="" className="w-12 h-12 mr-4" />
              <div>
                <h2 className="text-lg font-semibold text-gray-700">Total Revenue</h2>
                <p className="text-2xl font-bold text-green-600">{currency}{dashData.totalEarnings}</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">#</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Patient Image</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Patient Name</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Patient Age</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Doctor Image</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Doctor Name</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Fees</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {dashData.appointments.map((appointment, index) => (
                  <tr key={appointment._id} className="hover:bg-blue-50 transition">
                    <td className="px-4 py-3 whitespace-nowrap font-semibold">{index + 1}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <img src={appointment.userId.image} alt="" className="w-12 h-12 rounded-full object-cover border" />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{appointment.userId.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{calculateAge(appointment.userId.dob)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <img src={appointment.docId.image} alt="" className="w-12 h-12 rounded-full object-cover border" />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{appointment.docId.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formattedDate(appointment.slotDate)}, {appointment.slotTime}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-semibold text-green-600">{currency}{appointment.amount}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {appointment.cancelled && (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">Cancelled</span>
                      )}
                      {appointment.cancelled === false && (
                        <button
                          onClick={() => cancelHandler(appointment._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition ml-2"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default DashBoard
