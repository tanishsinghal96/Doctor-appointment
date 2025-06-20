import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { DoctorContextProvider } from './context/DoctorContext.jsx'
import { AdminContextProvider } from './context/AdminContext.jsx'
import { AppContextProvider } from './context/AppContext.jsx'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import AddDoctor from './pages/admin/AddDoctor.jsx'
import AllApoointments from './pages/admin/AllApoointments.jsx' 
import DoctorsList from './pages/admin/DoctorsList.jsx'
import DashBoard from './pages/admin/DashBoard.jsx'
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, 
    children: [
      {
        path: "/",
        index: true,
      },
      {
        path: "/add-doctor",
        element: <AddDoctor />  
      },
      {
        path: "/doctors-list",
        element: <DoctorsList />
      },
      {
        path: "/all-appointments",
        element: <AllApoointments />
      },
      {
        path: "/admin-dashboard",
        element: <DashBoard />
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
   <DoctorContextProvider>
    <AdminContextProvider>
      <AppContextProvider>
        
          <RouterProvider router={router} />
        
      </AppContextProvider>
    </AdminContextProvider>
   </DoctorContextProvider>

  
    
  
)
