import { useContext,createContext } from "react";

const AppContext=createContext();



const AppContextProvider=({children})=>{
  const  value={

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