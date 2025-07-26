import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { setOnlineUsers, setSocket } from './redux/socketSlice'
import { setNotificationData } from './redux/userSlice';

import {io} from "socket.io-client"

// Import Hooks
import useGetCurrentUser from './hooks/useGetCurrentUser';
import useGetAllPost from './hooks/useGetAllPost';
import useGetAllLoops from './hooks/useGetAllLoops';
import useGetAllStories from './hooks/useGetAllStories';
import useGetFollowingList from './hooks/useGetFollowingList';
import useGetPrevChatUsers from './hooks/useGetPrevChatUsers';
import useGetAllNotifications from './hooks/useGetAllNotifications';
import useGetSuggestedUsers from './hooks/useGetSuggestedUsers';

// Import Pages
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Upload from './pages/Upload';
import Loops from './pages/Loops';
import Story from './pages/Story';
import Messages from './pages/Messages';
import MessageArea from './pages/MessageArea';
import Search from './pages/Search';
import Notifications from './pages/Notifications';

export const serverUrl = "http://localhost:8001";

function App() {
 
  // Custom Hooks (Call here inside component)
  useGetCurrentUser();
  useGetSuggestedUsers();
  useGetAllPost();
  useGetAllLoops();
  useGetAllStories();
  useGetFollowingList();
  useGetPrevChatUsers();
  useGetAllNotifications();

  // Socket Connection + Listeners
  
  const {userData,notificationData}=useSelector(state=>state.user)
   
    const {socket}=useSelector(state=>state.socket)
    const dispatch=useDispatch()
 useEffect(()=>{
  if(userData){
    const socketIo=io(`${serverUrl}`,{
      query:{
        userId:userData._id
      }
    })
dispatch(setSocket(socketIo))


socketIo.on('getOnlineUsers',(users)=>{
  dispatch(setOnlineUsers(users))
  console.log(users)
})


return ()=>socketIo.close()
  }else{
    if(socket){
      socket.close()
      dispatch(setSocket(null))
    }
  }
 },[userData])


socket?.on("newNotification",(noti)=>{
  dispatch(setNotificationData([...notificationData,noti]))
})


  return (
    <Routes>
      <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to='/' />} />
      <Route path='/signin' element={!userData ? <SignIn /> : <Navigate to='/' />} />
      <Route path='/' element={userData ? <Home /> : <Navigate to='/signin' />} />
      <Route path='/forgot-password' element={!userData ? <ForgotPassword /> : <Navigate to='/' />} />
      <Route path='/profile/:userName' element={userData ? <Profile /> : <Navigate to='/' />} />
      <Route path='/story/:userName' element={userData ? <Story /> : <Navigate to='/' />} />
      <Route path='/upload' element={userData ? <Upload /> : <Navigate to='/' />} />
      <Route path='/search' element={userData ? <Search /> : <Navigate to='/' />} />
      <Route path='/editprofile' element={userData ? <EditProfile /> : <Navigate to='/' />} />
      <Route path='/messages' element={userData ? <Messages /> : <Navigate to='/' />} />
      <Route path='/messageArea' element={userData ? <MessageArea /> : <Navigate to='/' />} />
      <Route path='/notifications' element={userData ? <Notifications /> : <Navigate to='/' />} />
      <Route path='/loops' element={userData ? <Loops /> : <Navigate to='/' />} />
    </Routes>
  );
}

export default App;
