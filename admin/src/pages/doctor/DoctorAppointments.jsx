import React from 'react'
import useAdminContext from '../../context/AdminContext'
import { useEffect } from 'react'
import useAppContext from '../../context/AppContext'
import useDoctorContext from '../../context/DoctorContext';
import {toast} from "react-toastify";
import axios from 'axios';
import {assets} from '../../assets/assets.js';
function DoctorAppointments() {
    
    const {calculateAge,formattedDate,currency} = useAppContext();
    const {dToken,fetchAppData,appData,backendUrl,cancelHandler,markdone}=useDoctorContext();
    
   useEffect(()=>{
      if(dToken){
         fetchAppData();
      }},[dToken]);

     


return (
    <div>
        <h1 className="text-2xl font-bold text-center my-4">All Appointments</h1>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th>#</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Image</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Age</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fees</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {appData.length === 0 ? (
                        <tr>
                            <td colSpan="9" className="text-center py-8 text-gray-500">
                                No appointments found.
                            </td>
                        </tr>
                    ) : (
                        appData.reverse().map((appointment, index) => {
                            const isCancelled = appointment.cancelled === true;
                            const isCompleted = appointment.isCompleted === true;
                            return (
                                <tr key={appointment._id} className={isCancelled ? "bg-red-50" : ""}>
                                    <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap w-16 h-16">
                                        <img
                                            src={appointment.userId.image || assets.default_user}
                                            alt={appointment.userId.name}
                                            className="w-12 h-12 rounded-full object-cover border"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{appointment.userId.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{calculateAge(appointment.userId.dob)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {formattedDate(appointment.slotDate)}, {appointment.slotTime}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {currency}
                                        {appointment.amount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-3 py-1 rounded text-xs font-semibold ${
                                                appointment.payment
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                        >
                                            {appointment.payment ? "Online Paid" : "Not Paid"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {isCompleted ? (
                                            <span className="text-green-600 font-semibold">Completed</span>
                                        ) : isCancelled ? (
                                            <span className="text-red-600 font-semibold">Cancelled</span>
                                        ) : (
                                            <span className="text-blue-600 font-semibold">Active</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                                        {!isCancelled && !isCompleted && (
                                            <>
                                                <button
                                                    onClick={() => cancelHandler(appointment._id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                                                    title="Cancel Appointment"
                                                >
                                                    <img src={assets.cancel_icon} alt="Cancel" className="w-4 h-4 inline-block mr-1" />
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => markdone(appointment._id)}
                                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                                                    title="Mark as completed"
                                                >
                                                    <img src={assets.tick_icon} alt="Complete" className="w-4 h-4 inline-block mr-1" />
                                                    Complete
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    </div>
);
}

export default DoctorAppointments
