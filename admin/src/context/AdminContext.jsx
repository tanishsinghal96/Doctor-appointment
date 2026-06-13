import { useContext,createContext, useState,useEffect } from "react";
import axios from "axios";
import {toast} from "react-toastify";
const AdminContext=createContext();
 
const AdminContextProvider=({children})=>{
   const [aToken,setAtoken]=useState(localStorage.getItem("aToken") || "");
   const backendUrl=import.meta.env.VITE_BACKEND_URL;
   const [DoctorsList, setDoctorsList] = useState([]);
   const [appointmentData, setAppointmentData] = useState([]);
   const [dashData, setDashData] = useState(null); // Assuming you might want to use this later      
   // Set aToken from localStorage only once on mount
   //  useEffect(() => {
   //     console.log("AdminContextProvider mounted");
   //     return () => {
   //       console.log("AdminContextProvider unmounted");
   //     }
   //  }, [aToken]);
    //make a functoin that find the all the doctors from the backend and set the DoctorsList state
   const fetchDoctorsList = async () => {
      //using the axios to fetch the doctors list from the backend
      try {
         const response = await axios.get(`${backendUrl}/api/v1/admin/all-doctors`, {
            headers: {
               'aToken': aToken // Include the token in the request headers
            }
         });
         const data = response.data;
         if (data.success) {
            setDoctorsList(data.data);
         } else {
            toast.error("Failed to fetch doctors list. Please try again later.");
         }
      } catch (error) {
         toast.error(error.response?.data?.message || error.message);
      }
   };

   const handleToggleAvailability = async (doctorId, updatedStatus) => {
    try {
      // Replace with your actual API endpoint with the axios call
      //use the 
      const response = await axios.patch(`${backendUrl}/api/v1/admin/toggle-doctor-availability/${doctorId}`,
        { available: updatedStatus },{
          headers:{
            aToken:aToken // Include the token in the request headers
          }
        });
      const data = response.data;
      if (data.success) {
        toast.success('Doctor availability updated successfully');
        fetchDoctorsList();
      } else {
        toast.error('Failed to update availability');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update availability');
    }
  };

  const getAllAppointments=async()=>{
  
   try {
      const {data}=await axios.get(`${backendUrl}/api/v1/admin/list-appointments`, {
         headers: {
            'aToken': aToken // Include the token in the request headers
         }
      });
      if(data.success){
         setAppointmentData(data.data);
         console.log("Appointments fetched successfully:", data.data);
      }
      else{
         toast.error("Failed to fetch appointments. Please try again later.");
         console.error("Failed to fetch appointments:1", data.message);
      }
   } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error('Failed to fetch appointments', error.response?.data?.message || error.message);
   }    
  }

  const getDashData=async()=>{
  
   try {
      const {data}=await axios.get(`${backendUrl}/api/v1/admin/dashboard-data`, {
         headers: {
            'aToken': aToken // Include the token in the request headers
         }
      });
      if(data.success){
         setDashData(data.data);
         console.log("Appointments fetched successfully:", data.data);
      }
      else{
         toast.error("Failed to fetch appointments. Please try again later.");
         console.error("Failed to fetch appointments:1", data.message);
      }
   } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error('Failed to fetch appointments', error.response?.data?.message || error.message);
   }    
  }

  
   let value={
      aToken,
      setAtoken,
      DoctorsList,
      fetchDoctorsList,
      backendUrl,
      handleToggleAvailability,
      getAllAppointments,
      appointmentData,
      getDashData,
      dashData
   }


 return (
    <AdminContext.Provider value={value}>
        {children}
    </AdminContext.Provider>
 )
}

export {AdminContextProvider}


const useAdminContext=()=>{
   return  useContext(AdminContext)
}
 
export default useAdminContext;