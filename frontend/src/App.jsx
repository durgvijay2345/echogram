import React, { useEffect, useRef } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';

import {  setNotificationData, setUserData, setSuggestedUsers, setFollowing } from './redux/userSlice';
import { setPostData } from './redux/postSlice';
import { setLoopData } from './redux/loopSlice';
import { setStoryData } from './redux/storySlice';
import { setOnlineUsers } from './redux/socketSlice';


// Custom Hooks
import useGetCurrentUser from './hooks/useGetCurrentUser';
import useFetchOnce from './hooks/useFetchOnce';

// Pages
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
import Goodbye from './pages/Goodbye';

export const serverUrl = "http://localhost:8001";

function App() {
  const dispatch = useDispatch();
  const { userData, notificationData, following, suggestedUsers } = useSelector((state) => state.user);
  const { postData } = useSelector((state) => state.post);
  const { loopData } = useSelector((state) => state.loop);
  const { storyData } = useSelector((state) => state.story);

  const socketRef = useRef(null);

  const userLoading = useGetCurrentUser();
  useGetPrevChatUsers();


  const postsFetch = useFetchOnce({
    url: `${serverUrl}/api/post/getAll`,
    reduxAction: setPostData,
    condition: Array.isArray(postData) && postData.length > 0,
  });

  const loopsFetch = useFetchOnce({
    url: `${serverUrl}/api/loop/getAll`,
    reduxAction: setLoopData,
    condition: Array.isArray(loopData) && loopData.length > 0,
  });

  const storiesFetch = useFetchOnce({
    url: `${serverUrl}/api/story/getAll`,
    reduxAction: setStoryData,
    condition: Array.isArray(storyData) && storyData.length > 0,
  });

  const followingFetch = useFetchOnce({
  url: `${serverUrl}/api/user/followingList`,
  reduxAction: setFollowing,
  condition: following !== null  
});


  const notificationsFetch = useFetchOnce({
    url: `${serverUrl}/api/user/getAllNotifications`,
    reduxAction: setNotificationData,
    condition: Array.isArray(notificationData) && notificationData.length > 0,
  });

  const suggestedUsersFetch = useFetchOnce({
    url: `${serverUrl}/api/user/suggested`,
    reduxAction: setSuggestedUsers,
    condition: Array.isArray(suggestedUsers) && suggestedUsers.length > 0,
  });

  

  useEffect(() => {
    if (userData && !socketRef.current) {
      const socketIo = io(serverUrl, {
        query: { userId: userData._id },
      });
      socketRef.current = socketIo;

      socketIo.on('getOnlineUsers', (users) => {
        dispatch(setOnlineUsers(users));
      });

      socketIo.on('newNotification', (noti) => {
        dispatch(setNotificationData((prevNoti) => [...prevNoti, noti]));
      });

      return () => {
        socketIo.disconnect();
        socketRef.current = null;
      };
    }

    if (!userData && socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, [userData, dispatch]);

  if (
    userLoading ||
    postsFetch.loading ||
    loopsFetch.loading ||
    storiesFetch.loading ||
    followingFetch.loading ||
    notificationsFetch.loading ||
    suggestedUsersFetch.loading
  ) {
    return <Loader />;
  }

  return (
    <Routes>
      <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to='/' />} />
      <Route path='/signin' element={!userData ? <SignIn /> : <Navigate to='/' />} />
      <Route path='/' element={userData ? <Home /> : <Navigate to='/signin' />} />
     <Route path="/goodbye" element={<Goodbye />} />
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



