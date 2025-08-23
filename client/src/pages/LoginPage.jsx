import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../context/AuthContext'

const LoginPage = () => {
  const { login, profileLoading } = useContext(AuthContext)

  const [currentSate, setCurrentState] = useState('Sign up')
  const [data, setData] = useState({
    username: '',
    email: '',
    password: '',
    bio: '',
    role: "investor"
  })
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }


  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (currentSate === 'Sign up' && !isDataSubmitted) {
      setIsDataSubmitted(true)
      return;
    }

    login(currentSate === "Sign up" ? "register" : "login", data)
  }


  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>

      {/* left */}
      <img src={assets.logo_big} alt="" className='w-[min(30vw,250px)]' />

      {/* right */}
      <form onSubmit={onSubmitHandler} className='border-2 bg-white/10 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
        <h2 className='font-medium text-2xl flex text-white justify-between items-center'>
          {currentSate}
          {isDataSubmitted && (<img onClick={() => setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer' />)}
        </h2>

        {currentSate === 'Sign up' && !isDataSubmitted && (
          <input type="text" onChange={handleOnChange} value={data.username} name='username' className='p-2 border border-gray-500 rounded-md bg-transparent focus:outline-none focusColor' placeholder='Full Name' required />
        )}

        {!isDataSubmitted && (
          <>
            <input type="email" onChange={handleOnChange} value={data.email} name='email' className='p-2 border border-gray-500 rounded-md bg-transparent focus:outline-none focusColor' placeholder='Email Address' required />
            <input type="password" onChange={handleOnChange} value={data.password} name='password' className='p-2 border border-gray-500 rounded-md bg-transparent focus:outline-none focusColor ' placeholder='Password' required />
          </>
        )}

        {currentSate === "Sign up" && isDataSubmitted && (
          <select name="role" value={data.role} onChange={(e) => setData({ ...data, role: e.target.value })} className='p-2 border border-gray-500 rounded-md bg-transparent focus:outline-none focusColor'>
            <option className="bg-gray-900 text-white" value="investor">Investor</option>
            <option className="bg-gray-900 text-white" value="entrepreneur">Entrepreneur</option>
          </select>
        )}

        {currentSate === 'Sign up' && isDataSubmitted && (
          <textarea rows={4} onChange={handleOnChange} value={data.bio} name='bio' className='p-2 border border-gray-500 rounded-md bg-transparent focus:outline-none focusColor' placeholder='provide a short bio...' required> </textarea>
        )}


        <button type='submit' className='btnAuth'>
          {currentSate === 'Sign up'
            ? (profileLoading ? "Creating Account..." : "Create Account")
            : (profileLoading ? "Logging In..." : "Login")}
        </button>

        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy</p>
        </div>

        <div className='flex flex-col gap-2'>
          {currentSate === 'Sign up' ? (
            <p className='text-sm text-gray-600'>Already have an account? <span onClick={() => { setCurrentState("Login"); setIsDataSubmitted(false) }} className='font-medium text-violet-500 cursor-pointer'>Login here</span></p>
          ) : (
            <p className='text-sm text-gray-600'>Create an account <span onClick={() => setCurrentState("Sign up")} className='font-medium text-violet-500 cursor-pointer'>Click here</span></p>
          )}
        </div>
      </form>
    </div>
  )
}

export default LoginPage