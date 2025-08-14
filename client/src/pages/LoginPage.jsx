import React, { useState } from 'react'
import assets from '../assets/assets'

const LoginPage = () => {
  const [currentSate, setCurrentState] = useState('Sign up')
  const [data, setData] = useState({
    fullName: '',
    email: '',
    password: '',
    bio: '',
    isDataSubmitted: false
  })

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }


   const onSubmitHandler = (e) => {
      e.preventDefault();

      if (currentSate === 'Sign up' && !data.isDataSubmitted) {
        setData(prevData => ({
          ...prevData,
          isDataSubmitted: true
        }))
        return;
      }
    }


  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>

      {/* left */}
      <img src={assets.logo_big} alt="" className='w-[min(30vw,250px)]' />


      {/* right */}
      <form onSubmit={onSubmitHandler} className='border-2 bg-white/10 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currentSate}
          {data.isDataSubmitted && (<img onClick={() => setData(prevData => ({...prevData, isDataSubmitted: false}))} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer' />)}
        </h2>

        {currentSate === 'Sign up' && !data.isDataSubmitted && (
          <input type="text" onChange={handleOnChange} value={data.fullName} name='fullName' className='p-2 border border-gray-500 rounded-md focus:outline-none focusColor' placeholder='Full Name' required />
        )}

        {!data.isDataSubmitted && (
          <>
            <input type="email" onChange={handleOnChange} value={data.email} name='email' className='p-2 border border-gray-500 rounded-md focus:outline-none focusColor' placeholder='Email Address' required />
            <input type="password" onChange={handleOnChange} value={data.password} name='password' className='p-2 border border-gray-500 rounded-md focus:outline-none focusColor' placeholder='Password' required />
          </>
        )}

        {currentSate === 'Sign up' && data.isDataSubmitted && (
          <textarea rows={4} onChange={handleOnChange} value={data.bio} name='bio' className='p-2 border border-gray-500 rounded-md focus:outline-none focusColor' placeholder='provide a short bio...' required> </textarea>
        )}

        <button type='submit' className='btnAuth'>
          {currentSate === 'Sign up' ? 'Create Account' : 'Login Now'}
        </button>

        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy</p>
        </div>

        <div className='flex flex-col gap-2'>
          {currentSate === 'Sign up' ? (
            <p className='text-sm text-gray-600'>Already have an account? <span onClick={() => { setCurrentState("Login"); setData(prevData => ({...prevData, isDataSubmitted:false})) }} className='font-medium text-violet-500 cursor-pointer'>Login here</span></p>
          ) : (
            <p className='text-sm text-gray-600'>Create an account <span onClick={() => setCurrentState("Sign up")} className='font-medium text-violet-500 cursor-pointer'>Click here</span></p>
          )}
        </div>
      </form>
    </div>
  )
}

export default LoginPage