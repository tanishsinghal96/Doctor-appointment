import React, { useState, useEffect } from 'react'

function Login() {
  const [state, setstate] = useState('Sign Up')
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);
  const [password, setPassword] = useState(null);
  return (
    <form className='min-h-[80vh] flex items-center justify-center bg-zinc-100'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[-340px] sm:min-w-96-border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state === 'Sign Up' ? "create account" : "Login"}</p>
        <p>Please {state === 'Sign Up' ? "sign Up" : "log in"} to book appointment</p>
        
          {state === 'Sign Up' &&
          <div className='w-full'>
            <label htmlFor="name" >Name</label>
            <input
              type="text" 
              id='name'
              placeholder='Enter your name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm sm:text-sm'/>
          </div>
          }
          <div className='w-full'>
            <label htmlFor="email" >Email</label>
            <input
              type="email"
              id='email'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm sm:text-sm'/>
          </div>

          <div className='w-full'>
            <label htmlFor="password" >Password</label>
            <input
              type="password"
              id='password'
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm sm:text-sm'   />
          </div>

          <button className='bg-primary text-white w-full py-2 rounded-md text-sm'>{state === 'Sign Up' ? "create account" : "Login"}</button>

      {
          state === 'Sign Up' ? 
            <p className='text-sm mt-2'>Already have an account? <span onClick={() => setstate('Login')} className='text-primary cursor-pointer underline'>Login</span></p> 
            : 
            <p className='text-sm mt-2'>Don't have an account? <span onClick={() => setstate('Sign Up')} className='text-primary cursor-pointer underline'>Sign Up</span></p>
      }
        

      </div>
    </form>
  )
}

export default Login
