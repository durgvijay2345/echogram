import React from 'react'
import { AiFillHome } from "react-icons/ai"
import { MdPersonSearch } from "react-icons/md"
import { RxVideo } from "react-icons/rx"
import { FiPlusCircle } from "react-icons/fi"
import dp from "../assets/dp.jpg"
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Nav() {
  const navigate = useNavigate()
  const { userData } = useSelector(state => state.user)

  return (
    <div className='w-[90%] lg:w-[40%] h-[65px] bg-black flex justify-around items-center fixed bottom-5 left-1/2 transform -translate-x-1/2 rounded-full shadow-lg z-50 px-3'>
      <AiFillHome
        className='text-white w-6 h-6 cursor-pointer hover:scale-110 transition'
        onClick={() => navigate("/")}
      />
      <MdPersonSearch
        className='text-white w-6 h-6 cursor-pointer hover:scale-110 transition'
        onClick={() => navigate("/search")}
      />
      <FiPlusCircle
        className='text-white w-6 h-6 cursor-pointer hover:scale-110 transition'
        onClick={() => navigate("/upload")}
      />
      <RxVideo
        className='text-white w-6 h-6 cursor-pointer hover:scale-110 transition'
        onClick={() => navigate("/loops")}
      />
      <div
        className='w-[35px] h-[35px] rounded-full overflow-hidden border-2 border-white cursor-pointer'
        onClick={() => navigate(`/profile/${userData.userName}`)}
      >
        <img
          src={userData?.profileImage || dp}
          alt="profile"
          className='w-full h-full object-cover'
        />
      </div>
    </div>
  )
}

export default Nav
