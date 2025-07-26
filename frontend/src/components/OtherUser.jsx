import React from 'react'
import { useSelector } from 'react-redux'
import dp from "../assets/dp.jpg"
import { useNavigate } from 'react-router-dom'
import FollowButton from './FollowButton'

function OtherUser({user}) {
    const {userData}=useSelector(state=>state.user)
    const navigate=useNavigate()
  return (
    <div className='w-full h-[80px] flex items-center justify-between border border-b-2 border-gray-800'>
         <div className='flex items-center gap-[10px]'>
          <div className='w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden ml-2 ' onClick={()=>navigate(`/profile/${user.userName}`)}>
            <img
              src={user.profileImage || dp}
              alt="profile"
              className='w-full h-full object-cover'
            />
          </div>
    <div>
    <div className='text-[18px] text-white font-semibold'>{user.userName}</div>
    <div className='text-[15px] text-gray-500 font-semibold'>{user.name}</div>
</div>
</div>
<FollowButton tailwind={'px[10px] w-[100px] py-[5px] h-[40px] bg-[white] rounded-2xl cursor-pointer mr-2'} targetUserId={user._id}/>

    </div>
  )
}

export default OtherUser