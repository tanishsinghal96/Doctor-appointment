import { useContext,createContext,useState,useEffect } from "react";
import axios from "axios";
const DoctorContext=createContext();
import {toast} from "react-toastify";



const DoctorContextProvider=({children})=>{
   const [dToken,setDtoken]=useState(localStorage.getItem("dToken") || "");
   const backendUrl=import.meta.env.VITE_BACKEND_URL;
   const [appData,setAppData]=useState([]);
   const [dashData, setDashData] = useState(null); 
   const [docData, setDocData] = useState(null); // To store doctor profile data
   
   const fetchAppData=async()=>{
      try { 
         const {data}=await axios.get(`${backendUrl}/api/v1/doctor/appointments`,{
           headers:{
               "dtoken":dToken
            }
         });
         
         if(data.success){
            console.log("Appointments fetched successfully:",data.data); 
            setAppData(data.data);
         }else{
            console.error("Failed to fetch appointments:",data.message);
         }
      } catch (error) {
         console.error("Error fetching appointments:",error.response ? error.response.data : error.message);
      }
   }

   const cancelHandler = async (id) => {
               try {
                 const {data} = await axios.patch(`${backendUrl}/api/v1/doctor/cancel-appointment`,{appointmentId:id}, {
                   headers: { dtoken: dToken }});
                   if(data.success){
                     toast.success("Appointment cancelled successfully");
                     // Remove the cancelled appointment from the state
                    console.log("Appointment cancelled successfully:", data.data);
                    fetchAppData(); // Refresh the appointments list
                     
                   }
                   else{
                     toast.error(data.message || "Failed to cancel appointment. Please try again later.");
                     console.log("Failed to cancel appointment:", data.message);
                   }
                 
                 }
                 catch (error) {
                 toast.error(error.response?.data?.message || error.message);
                 console.log("Error cancelling appointment:", error.response?.data?.message || error.message);
                 
               }}
        
   const markdone=async(id)=>{
       try {
           const {data} = await axios.patch(`${backendUrl}/api/v1/doctor/complete-appointment`,{appointmentId:id}, {
               headers: { dtoken: dToken }});
           if(data.success){
               toast.success("Appointment marked as completed successfully");
               fetchAppData(); // Refresh the appointments list
           } else {
               toast.error(data.message || "Failed to mark appointment as completed. Please try again later.");
               console.log("Failed to mark appointment as completed:", data.message);
           }
       } catch (error) {
           toast.error(error.response?.data?.message || error.message);
           console.log("Error marking appointment as completed:", error.response?.data?.message || error.message); 
       }
   } 

   const getDashData=async()=>{
     
      try {
         const {data}=await axios.get(`${backendUrl}/api/v1/doctor/dashboard-data`, {
            headers: {
               'dToken': dToken // Include the token in the request headers
            }
         });
         if(data.success){
            setDashData(data.data);
            console.log("dashboard data fetched successfully:", data.data);
         }
         else{
            toast.error("Failed to fetch dashboard data. Please try again later.");
            console.error("Failed to fetch dashboard data:", data.message);
         }
      } catch (error) {
         console.error("Error fetching dashboard data:", error);
         toast.error('Failed to fetch dashboard data', error.response?.data?.message || error.message);
      }    
     }

   const fetchDoctorProfile = async () => {
      try {
         const { data } = await axios.get(`${backendUrl}/api/v1/doctor/profile`, {
            headers: { dtoken: dToken }
         });
         if (data.success) {
            setDocData(data.data);
            console.log("Doctor profile fetched successfully:", data.data);
         } else {
            toast.error("Failed to fetch doctor profile. Please try again later.");
            console.log("Failed to fetch doctor profile:", data.message);
         }
      } catch (error) {
         console.log("Error fetching doctor profile:", error);
         toast.error('Failed to fetch doctor profile', error.response?.data?.message || error.message);
      }
   }

   



  const  value={
      dToken,setDtoken,
      backendUrl,
      appData,setAppData,
      fetchAppData,
      cancelHandler,
      markdone,
      getDashData,
      dashData,
      fetchDoctorProfile,
      docData,
      setDocData
   };
 return (
    <DoctorContext.Provider value={value}>
        {children}
    </DoctorContext.Provider>
 )
}

export {DoctorContextProvider}


const useDoctorContext=()=>{
   return  useContext(DoctorContext)
}
 
export default useDoctorContext