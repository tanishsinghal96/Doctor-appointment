import { useContext,createContext, useState,useEffect } from "react";
import axios from "axios";
import {toast} from "react-toastify";
const AdminContext=createContext();
 
const AdminContextProvider=({children})=>{
   const [aToken,setAtoken]=useState(localStorage.getItem("aToken") || "");
   const backendUrl=import.meta.env.VITE_BACKEND_URL;
   const [DoctorsList, setDoctorsList] = useState([]);

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
         console.log(response);
         if (data.success) {
            setDoctorsList(data.data); // Assuming the response contains a 'doctors' array
            console.log("Doctors list fetched successfully:", data.data);
         } else {
            toast.error("Failed to fetch doctors list. Please try again later.");
            console.error("Failed to fetch doctors list:", data.message);
         }
      } catch (error) {
         toast.error("Failed to fetch doctors list. Please try again later.");
         console.error("Error fetching doctors list:", error.response.data.message || error.message);
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
        console.log("Doctor availability updated successfully:", data.data);
        toast.success('Doctor availability updated successfully');
        fetchDoctorsList(); // Refresh the list after updating
      } else {  
        toast.error('Failed to update availability');
      }
      
     
      fetchDoctorsList(); // Refresh the list
    } catch (error) {
      console.error("Error updating doctor availability:", error);
      toast.error('Failed to update availability',error.response?.data?.message || error.message );
    }
  };

  
   let value={
      aToken,
      setAtoken,
      DoctorsList,
      fetchDoctorsList,
      backendUrl
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