import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import App from './App.jsx'
import { AppContextProvider } from './context/AppContext.jsx'
import {About,Appoinment,Contact,Home,Login,Doctors,MyAppointments,MyProfile} from  './pages/index.js'

const router = createBrowserRouter([{
  path: "/",
  element: <App />,
  children: [
    {
      path: "/",
      element: <Home />
    },
    {
      path: "/about",
      element: <About />
    },
    {
      path: "/contact",
      element: <Contact />
    },
    {
      path: "/appointments/:id",
      // Assuming doctorId is a dynamic parameter in the URL
      // You can access it in the Appointment component using useParams hook
      element: <Appoinment />
    },
    {
        path: "/doctors",
        element: <Doctors />
    },
    {
      path: "/doctors/:speciality",
      // Assuming specialization is a dynamic parameter in the URL
      // You can access it in the Doctors component using useParams hook
      // This will render the Doctors component based on the specialization
      // For example, if the URL is /doctors/cardiology, it will render the Doctors component with specialization "card
      element: <Doctors />

    },
    {
      path: "/login", 
      element: <Login />
    },
    {
      path: "/my-appointments",
      element: <MyAppointments />
    },
    {
      path: "/my-profile",
      element: <MyProfile />
    }
  ]
},])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppContextProvider>
      <RouterProvider router={router} /> 
    </AppContextProvider>
    

  </StrictMode>,
)
