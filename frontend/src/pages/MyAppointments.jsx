import React, { useEffect, useState } from 'react'
import useAppContext from '../context/AppContext'
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function MyAppointments() {
   const {token,backendUrl,fetchDoctorsList}=useAppContext();
   const [appdata,setAppData]=useState([]);
    const navigate = useNavigate();
   const fetchAppointments = async () => {
        try {
          const {data}=await axios.get(`${backendUrl}/api/v1/user/list-appointments`, {
            headers: {  token: token,}}) ;
            console.log("Response data:", data);
          if (data.success) {
            setAppData(data?.data);
            console.log("Appointments fetched successfully:", data?.data); 
          } else {
            console.error("Failed to fetch appointments:", data.message);
            // Handle error case
            toast.error("Failed to fetch appointments. Please try again later.");
          }
          }catch (error) {
            console.error("Error fetching appointments:", error);
          toast.error(error.response?.data?.message || error.message);
          console.error("Error fetching appointments:", error.response?.data?.message || error.message);
        }
   }
   

   const cancelHandler = async (id) => {
        try {
          const {data} = await axios.patch(`${backendUrl}/api/v1/user/cancel-appointment`,{appointmentId:id}, {
            headers: { token: token }});
            if(data.success){
              toast.success("Appointment cancelled successfully");
              // Remove the cancelled appointment from the state
             console.log("Appointment cancelled successfully:", data.data);
              fetchAppointments(); // Refresh the appointments list
               fetchDoctorsList();
            }
            else{
              toast.error(data.message || "Failed to cancel appointment. Please try again later.");
              console.error("Failed to cancel appointment:", data.message);
            }
          
          }
            


         catch (error) {
          toast.error(error.response?.data?.message || error.message);
          console.error("Error cancelling appointment:", error.response?.data?.message || error.message);
          
        }
   }

   const initpay=(order)=>{
       const options={
        key:import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount:order.amount,
        currency:order.currency,  
        name:"appointment payment",
        description:"Payment for appointment",
        order_id:order.id,
        receipt:order.receipt,
        handler:async function(response){
          console.log("Payment response:", response);
          try {
            const {data} = await axios.post(`${backendUrl}/api/v1/user/verify-payment`, {
              razorpay_id: response.razorpay_order_id,
              
            }, {
              headers: { token: token }
            });
            if(data.success){
              toast.success("Payment successful and appointment confirmed");
              console.log("Payment verification successful:", data.data);
              fetchAppointments(); // Refresh the appointments list
              navigate('/my-appointments'); // Redirect to appointments page
            } else {
              toast.error(data.message || "Payment verification failed. Please try again later.");
              console.error("Payment verification failed:", data.message);
            }
          } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            console.error("Error verifying payment:", error.response?.data?.message || error.message);
          }

        }
       }

       const razorpay = new window.Razorpay(options);
       razorpay.open();
   }

   const appointmentRazoray=async(appointmentId)=>{
    try {
      const {data} = await axios.post(`${backendUrl}/api/v1/user/payment-razorpay`,{appointmentId:appointmentId}, {
        headers: { token: token }});
      if(data.success){
        // Handle successful payment

        console.log("order initiated successfully:", data.data);
        initpay(data.data);
        //now verify this order with razorpay and make payent then aftwr this is also checked in backend
      } else {
        // Handle payment initiation failure
        console.error("Failed to initiate payment:", data.message);
        toast.error(data.message || "Failed to initiate payment. Please try again later.");
      }
    } catch (error) {
      console.error("Error initiating payment:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || error.message);
    }
   }


    
   useEffect(()=>{
    if(token) {
      fetchAppointments();
    }
   },[token]);
   
  if(appdata.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">My Appointments</h2>
        <p className="text-gray-600 text-center">You have no appointments scheduled.</p>
      </div>
    )
  }
  
  
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">My Appointments</h2>
      <div className="space-y-6">
        {appdata.map((doctor, index) => (
          
          <div
            key={doctor._id}    
            className="flex flex-col md:flex-row items-center bg-white shadow-md rounded-lg p-4 gap-6"
          >
            <div className="flex-shrink-0 w-32 h-32">
              <img
                src={doctor.docId.image}
                alt={doctor.docId.name}
                className="w-32 h-max rounded-lg object-cover border-2 border-blue-500 bg-indigo-50"
              />
            </div>
            <div className="flex-1">
              <p className="text-lg font-semibold">{doctor.docId.name}</p>
              <p className="text-blue-600">{doctor.docId.speciality}</p>
              <div className="text-gray-600 mt-2">
                <p className="font-medium">Address:</p>
                <p>{doctor.docId.address.line1}</p>
                <p>{doctor.docId.address.line2}</p>
              </div>
              <p className="mt-2">
                <span className="font-medium">Date &amp; Time:</span>{doctor.slotDate} at {doctor.slotTime}
              </p>
              <p className="mt-1 font-semibold text-green-600">Price: {doctor.docId.fees}</p>
            </div>
            <div className="flex flex-col gap-2 mt-4 md:mt-0">
              {doctor.payment && <p className="text-green-500 font-medium">Payment Done</p>}
              {doctor.cancelled===false&&doctor.payment===false&&<button onClick={()=>(appointmentRazoray(doctor._id))} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                Pay online  
              </button>}
              {(doctor.cancelled==false)&&<button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition" onClick={()=>cancelHandler(doctor._id)}>
                Cancel appointment
              </button>}
              {doctor.cancelled && <p className="text-red-500 font-medium">Appointment Cancelled</p> }
            </div>
          </div>
        ))}
      </div>
    </div>
  )
  
  
}

export default MyAppointments
