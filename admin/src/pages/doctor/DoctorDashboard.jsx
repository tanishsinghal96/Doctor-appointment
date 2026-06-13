import React, { useEffect } from 'react'
import useAppContext from '../../context/AppContext'
import useDoctorContext from '../../context/DoctorContext';
import { toast } from "react-toastify";
import { assets } from '../../assets/assets.js'
function DoctorDashboard() {
    const { calculateAge, formattedDate, currency } = useAppContext();
    const { dToken, cancelHandler, markdone, dashData, getDashData } = useDoctorContext();

    useEffect(() => {
        if (dToken) {
            getDashData();
        }
    }, [dToken]);

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

                                    <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Fees</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
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
                                        
                                        <td className="px-4 py-3 whitespace-nowrap">{formattedDate(appointment.slotDate)}, {appointment.slotTime}</td>
                                        <td className="px-4 py-3 whitespace-nowrap font-semibold text-green-600">{currency}{appointment.amount}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-3 py-1 rounded text-xs font-semibold ${appointment.payment
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >
                                                {appointment.payment ? "Online Paid" : "Not Paid"}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {appointment.isCompleted ? (
                                                <span className="text-green-600 font-semibold">Completed</span>
                                            ) : appointment.cancelled ? (
                                                <span className="text-red-600 font-semibold">Cancelled</span>
                                            ) : (
                                                <span className="text-blue-600 font-semibold">Active</span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                                            {!appointment.cancelled && !appointment.isCompleted && (
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    )
}

export default DoctorDashboard
