import React from 'react'
import useAdminContext from '../../context/AdminContext'
import { useEffect } from 'react'
 import useAppContext from '../../context/AppContext'
 import axios from 'axios';
import { toast } from 'react-toastify';
function AllApoointments() {
    const {getAllAppointments, appointmentData,aToken,backendUrl} =  useAdminContext();
    const {calculateAge,formattedDate,currency} = useAppContext();
    useEffect(() => {
       if(aToken)  getAllAppointments();
    }, [aToken]);
    
    const cancelHandler = async (id) => {
        try {
          const {data} = await axios.patch(`${backendUrl}/api/v1/admin/cancel-appointment`,{appointmentId:id}, {
            headers: { atoken: aToken }});
            if(data.success){
              toast.success("Appointment cancelled successfully");
              // Remove the cancelled appointment from the state
             console.log("Appointment cancelled successfully:", data.data);
             getAllAppointments(); // Refresh the appointments list
              
            }
            else{
              toast.error(data.message || "Failed to cancel appointment. Please try again later.");
              console.log("Failed to cancel appointment:", data.message);
            }
          
          }
            


         catch (error) {
          toast.error(error.response?.data?.message || error.message);
          console.log("Error cancelling appointment:", error.response?.data?.message || error.message);
          
        }
   }

  return (
 
    <div>
      <h1 className='text-2xl font-bold text-center my-4'>All Appointments</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th>#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fees</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointmentData.map((appointment,index) => (
              <tr key={appointment._id}>
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap w-24 h-16 rounded-full"><img src={appointment.userId.image} alt="" /></td>
                <td className="px-6 py-4 whitespace-nowrap">{appointment.userId.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{calculateAge(appointment.userId.dob)}</td>
                  <td className="px-6 py-4 whitespace-nowrap w-24 h-16 rounded-full"><img src={appointment.docId.image} alt="" /></td>
                <td className="px-6 py-4 whitespace-nowrap">{appointment.docId.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formattedDate(appointment.slotDate)}, {appointment.slotTime}</td>
                <td className="px-6 py-4 whitespace-nowrap">{currency}{appointment.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                { appointment.cancelled  && <button className="bg-blue-500 text-white px-4 py-2 rounded">cancelled </button>}
                  {appointment.cancelled===false &&<button onClick={()=>cancelHandler(appointment._id)} className="bg-red-500 text-white px-4 py-2 rounded ml-2">cancel</button>  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AllApoointments
