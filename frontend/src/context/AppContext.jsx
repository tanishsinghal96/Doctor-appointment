import { createContext, useEffect, useState, useCallback } from "react";
import { useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [userData, setUserData] = useState(null);
  const currencySymbol = "₹";

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUserData(null);
  }, []);

  const fetchDoctorsList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/doctor/all-doctors`);
      const data = response.data;
      if (data.success) {
        setDoctors(data.data);
      } else {
        toast.error("Failed to fetch doctors list. Please try again later.");
      }
    } catch (error) {
      toast.error("Failed to fetch doctors list. Please try again later.");
    }
  };

  useEffect(() => {
    fetchDoctorsList();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/v1/user/get-profile`, {
        headers: { token }
      });
      if (data.success) {
        setUserData(data.data);
      } else {
        toast.error("Failed to fetch user data.");
      }
    } catch (error) {
      // Auto-logout on 401 (expired/invalid token)
      if (error.response?.status === 401) {
        logout();
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Failed to fetch user data.");
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token]);

  const value = {
    doctors,
    fetchDoctorsList,
    currencySymbol,
    backendUrl,
    token,
    setToken,
    userData,
    setUserData,
    fetchUserData,
    logout,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
}
