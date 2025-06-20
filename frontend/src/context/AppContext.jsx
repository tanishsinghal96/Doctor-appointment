import { createContext, useEffect ,useState} from "react";
import { useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl=import.meta.env.VITE_BACKEND_URL;
  const [doctors, setDoctors] = useState([]);
  let currencySymbol= "₹";

   const fetchDoctorsList = async () => {
      //using the axios to fetch the doctors list from the backend
      try {
         const response = await axios.get(`${backendUrl}/api/v1/doctor/all-doctors`, {
            
         });
         const data = response.data;
         console.log(response);
         if (data.success) {
            setDoctors(data.data); // Assuming the response contains a 'doctors' array
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

   useEffect(()=>{
    fetchDoctorsList();
   });

  const value = {
    // Define your context values here
    doctors: doctors,
    currencySymbol: currencySymbol,
    backendUrl
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export default function useAppContext ()  {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};