import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AuthContext } from '../context/AuthContext';

const ProfilePage = () => {

  const {updateUserProfile, authUser, updateUserProfileImage, profileLoading} = useContext(AuthContext)
  console.log("auth user : ", authUser)

  const [data, setData] = useState({
    username: authUser.username,
    bio: authUser.bio,
  });
  const [selectedImg, setSelectedImg] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  }

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedImg) {
      await updateUserProfile(authUser._id,data);
      navigate("/")
      return
    }
    
   await updateUserProfileImage(authUser._id, selectedImg)
   navigate("/")
}
  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>

      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
          <h3 className='text-lg'>Profile details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
          <input onChange={(e) => setSelectedImg(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden/>  
          <img src={selectedImg ? URL.createObjectURL(selectedImg) : authUser?.profilePicture || assets.avatar_icon} alt="" className={`w-12 h-12 rounded-full ${selectedImg && 'rounded-full'}`}/>
          Upload profile image
          </label>  
          <input type="text" onChange={handleChange} name='username' value={data.username} required placeholder='Your name' className='capitalize p-2 border border-gray-500 rounded-md bg-transparent focus:outline-none focusColor' />
          <textarea onChange={handleChange} name="bio" value={data.bio} placeholder='Write profile bio...' required className='capitalize p-2 border border-gray-500 rounded-md bg-transparent focus:outline-none focusColor' rows={4}></textarea>

          <button type='submit' className='btnAuth'>{profileLoading ? 'Updating...' : 'Update'}</button>
        </form>
        <img src={authUser?.profilePicture || assets.logo_big} alt="" className={`max-w-44 rounded-full mx-10 max-sm:mt-10 ${authUser?.profilePicture && 'rounded-full aspect-square'}`} />
      </div>

    </div>
  )
}

export default ProfilePage