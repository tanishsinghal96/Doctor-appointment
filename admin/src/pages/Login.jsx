import React, { useState } from 'react'
import { assets } from "../assets/assets"
import axios from "axios"
import useAdminContext from '../context/AdminContext'
import { toast } from 'react-toastify'
function Login() {
  const [state, setstate] = useState("Admin")
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");

  const { setAtoken, backendUrl } = useAdminContext();
  
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    //apply first checks here
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    //axios throw error goes to catch part
    try {
      if (state === "Admin") {
        const  res  = await axios.post(backendUrl+'/api/v1/admin/login', { email, password });
        console.log(res.data);
        console.log(res.data.data.success);
        if (res.data.success) {
          console.log( res.data.data.atoken);
          localStorage.setItem("aToken", res.data.data.atoken);
          setAtoken(res.data.data.atoken);
        }
        
      }
      else {

      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.error(error.response?.data);
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg' >
        <p className='text-2xl font-semibold m-auto'><span className='text-primary'>{state} Login</span></p>
        <div className='w-full'>
          <p>Email</p>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className='border border-[#DADADA] rounded w-full p-2 mt-1' />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input value={password} onChange={(e) => setpassword(e.target.value)} type="password" required className='border border-[#DADADA] rounded w-full p-2 mt-1' />
        </div>
        <button className='bg-primary text-white w-full py-2 rounded-md text-base '>Login</button>

        {state === 'Admin'
          ? <p>Doctor Login? <span onClick={() => setstate("Doctor")} className='text-primary underline cursor-pointer'>Click Here</span></p>
          : <p>Admin Login? <span onClick={() => setstate("Admin")} className='text-primary underline cursor-pointer'>Click Here</span></p>
        }
      </div>

    </form>
  )
}

export default Login
