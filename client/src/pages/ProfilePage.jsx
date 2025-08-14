import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';

const ProfilePage = () => {
  const [data, setData] = useState({
    name: '',
    bio: 'Hi Everyone! I am using Nexus',
    selectedImg: null,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  }


  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>

      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form className='flex flex-col gap-5 p-10 flex-1'>
          <h3 className='text-lg'>Profile details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
          <input onChange={(e) => setData(prevData => ({...prevData, selectedImg: e.target.files[0]}))} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden/>  
          <img src={data.selectedImg ? URL.createObjectURL(data.selectedImg) : assets.avatar_icon} alt="" />
          </label>
        </form>
        <img src="" alt="" />
      </div>

    </div>
  )
}

export default ProfilePage