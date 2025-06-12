import { createContext } from "react";
import { useContext } from "react";
import { doctors } from '../assets/assets'
export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  let currencySymbol= "₹";
  const value = {
    // Define your context values here
    doctors: doctors,
    currencySymbol: currencySymbol,
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