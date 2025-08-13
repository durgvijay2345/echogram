import React from 'react';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/messageSlice';
import OnlineUser from '../components/OnlineUser';
import dp from "../assets/dp.jpg";

function Messages() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user);
  const { onlineUsers } = useSelector(state => state.socket);
  const { prevChatUsers } = useSelector(state => state.message);

  const handleUserSelect = (user) => {
    dispatch(setSelectedUser(user));
    navigate('/messageArea');
  };

  // Ensure prevChatUsers is always an array
  const prevChats = Array.isArray(prevChatUsers) ? prevChatUsers : [];
  const followingUsers = Array.isArray(userData?.following) ? userData.following : [];

  return (
    <div className='w-full min-h-[100vh] flex flex-col bg-black gap-[20px] p-[10px]'>
      {/* Header */}
      <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px]'>
        <MdOutlineKeyboardBackspace
          className='text-white cursor-pointer lg:hidden w-[25px] h-[25px]'
          onClick={() => navigate('/')}
        />
        <h1 className='text-white text-[20px] font-semibold'>Messages</h1>
      </div>

      {/* Online Users */}
      <div className='w-full h-[80px] flex gap-[20px] justify-start items-center overflow-x-auto p-[20px] border-b-2 border-gray-800'>
        {followingUsers.filter(user => onlineUsers?.includes(user._id)).map((user, index) => (
          <OnlineUser user={user} key={index} />
        ))}
      </div>

      {/* Previous Chats */}
      <div className='w-full h-full overflow-auto flex flex-col gap-[15px] px-[10px]'>
        {prevChats.map((user, index) => (
          <div
            key={index}
            className='flex items-center gap-[15px] cursor-pointer hover:bg-gray-900 px-[10px] py-[10px] rounded-xl transition'
            onClick={() => handleUserSelect(user)}
          >
            <div className='relative'>
              <div className='w-[55px] h-[55px] rounded-full overflow-hidden border-2 border-black'>
                <img src={user.profileImage || dp} alt="" className='w-full h-full object-cover' />
              </div>
              {onlineUsers?.includes(user._id) && (
                <div className='w-[12px] h-[12px] bg-green-500 border-2 border-black rounded-full absolute bottom-0 right-0'></div>
              )}
            </div>

            <div className='flex flex-col'>
              <div className='text-white text-[18px] font-semibold'>{user.userName}</div>
              {onlineUsers?.includes(user._id) && (
                <div className='text-blue-500 text-[14px]'>Active Now</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Messages;


