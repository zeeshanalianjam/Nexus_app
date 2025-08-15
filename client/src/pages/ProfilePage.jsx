import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';

const ProfilePage = () => {
  const [data, setData] = useState({
    name: 'Martin Johnson',
    bio: 'Hi Everyone! I am using Nexus',
    selectedImg: null,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  }

const handleSubmit = async (e) => {
    e.preventDefault();
    navigate('/');
}
  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>

      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
          <h3 className='text-lg'>Profile details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
          <input onChange={(e) => setData(prevData => ({...prevData, selectedImg: e.target.files[0]}))} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden/>  
          <img src={data.selectedImg ? URL.createObjectURL(data.selectedImg) : assets.avatar_icon} alt="" className={`w-12 h-12 ${data.selectedImg && 'rounded-full'}`}/>
          Upload profile image
          </label>  
          <input type="text" onChange={handleChange} name='name' value={data.name} required placeholder='Your name' className='p-2 border border-gray-500 rounded-md focus:outline-none focusColor' />
          <textarea onChange={handleChange} name="bio" value={data.bio} placeholder='Write profile bio...' required className='p-2 border border-gray-500 rounded-md focus:outline-none focusColor' rows={4}></textarea>

          <button type='submit' className='btnAuth'>Save</button>
        </form>
        <img src={assets.logo_icon} alt="" className='max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10' />
      </div>

    </div>
  )
}

export default ProfilePage