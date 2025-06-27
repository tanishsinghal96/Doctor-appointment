import { useContext,createContext } from "react";

const AppContext=createContext();
  
const currency="$";
const calculateAge=(birthDate)=>{
   const today = new Date();
   const birth = new Date(birthDate);
   let age = today.getFullYear() - birth.getFullYear();
   const monthDiff = today.getMonth() - birth.getMonth();
   
   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
   }
   
   return age;
}

const months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const formattedDate=(datestring)=>{
   const arr=datestring.split("-");
   const day=arr[0];
   const month=arr[1];  
   const year=arr[2];
   return `${day}-${months[month-1]}-${year}`;
}



const AppContextProvider=({children})=>{
  const  value={
calculateAge,
formattedDate,currency
   };
 return (
    <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
 )
}

export {AppContextProvider}

   
const useAppContext=()=>{
   return  useContext(AppContext)
}
 
export default useAppContext