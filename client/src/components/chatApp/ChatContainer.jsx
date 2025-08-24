import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../../assets/assets'
import { formatMessageTime } from '../../lib/utils';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ChatContainer = () => {
  const {messages, selectedUser, setSelectedUser, sendMessage, getMessages, sendMessageImage} = useContext(ChatContext)
  const {authUser, onlineUsers} = useContext(AuthContext)

  const scrollEnd = useRef();
  const [input, setInput] = useState('');

  // handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if(input.trim() === '') return null;
    await sendMessage({text: input.trim()});
    setInput('');
  }

  // handle sending an image
  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if(!file || !file.type.startsWith('image/')) {
      return toast.error("Please select an image file.");
    };

    const formData = new FormData();
    formData.append('image', file);
    await sendMessageImage(formData);
  }

  useEffect(() => {
    if(selectedUser){
      getMessages(selectedUser._id);
    }
  }, [selectedUser])

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages])

  return selectedUser ? (
    <div className='h-full overflow-scroll relative backdrop:blur-lg'>
      {/* header */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img src={selectedUser?.profilePicture || assets.avatar_icon} alt="profile" className='w-8 h-8 rounded-full' />
        <p className='flex-1 text-lg text-white flex items-center gap-2'>
          {selectedUser?.username}
         {onlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500'></span>}
        </p>
        <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="arrow" className='md:hidden max-w-7' />
        <img src={assets.help_icon} alt="help" className='max-md:hidden max-w-5' />
      </div>

      {/* chat area */}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
        {messages.map((message, index) => (
          <div key={index} className={`flex items-end gap-2 justify-end ${message.senderId !== authUser._id && 'flex-row-reverse'}`}>
            {message.image ? (
              <img src={message.image} alt="" className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8' />
            ) : (
              <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${message.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none'}`}>{message.text}</p>
            )}
            <div className='text-center text-xs'>
              <img src={message.senderId === authUser._id ? authUser?.profilePicture || assets.avatar_icon : selectedUser?.profilePicture || assets.avatar_icon} alt="profile" className='w-7 h-7 rounded-full' />
              <p className='text-gray-500'>{formatMessageTime(message.createdAt)}</p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* bottom area */}
      <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3 '>
        <div className='flex-1 flex items-center bg-gray-100/10 border px-3 rounded-full'>
          <input onChange={(e) => setInput(e.target.value)} value={input} onKeyDown={(e) => e.key === 'Enter' ? handleSendMessage(e) : null} type="text" placeholder='Send a message' className='flex-1 bg-transparent text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400' />
          <input onChange={handleSendImage} type="file" id='image' accept='image/png, image/jpeg' hidden />
          <label htmlFor="image">
            <img src={assets.gallery_icon} alt="" className='w-5 mr-2 cursor-pointer' />
          </label>
        </div>
        <img src={assets.send_button} alt="" className='w-7 cursor-pointer' />
      </div>


    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img onClick={handleSendMessage} src={assets.logo} alt="logoIcon" className='max-w-28' />
      <p className='text-lg font-medium text-white'>Chat anytime, anywhere</p>
    </div>
  )
}

export default ChatContainer