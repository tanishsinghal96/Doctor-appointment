import { useContext,createContext } from "react";

const DoctorContext=createContext();



const DoctorContextProvider=({children})=>{
  const  value={

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