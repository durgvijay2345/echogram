You said:
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { io } from "socket.io-client";

import { setOnlineUsers, setSocket } from './redux/socketSlice';
import { setNotificationData } from './redux/userSlice';

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
import Goodbye from './pages/Goodbye';

import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

import ClipLoader from "react-spinners/ClipLoader";

export const serverUrl = "https://echogram-backend-wkov.onrender.com";

function App() {

  // Custom Hooks
  useGetCurrentUser();
  useGetSuggestedUsers();
  useGetAllPost();
  useGetAllLoops();
  useGetAllStories();
  useGetFollowingList();
  useGetPrevChatUsers();
  useGetAllNotifications();

  const { userData, notificationData, loading } = useSelector(state => state.user);
  const { socket } = useSelector(state => state.socket);
  const dispatch = useDispatch();

  // Socket Setup
  React.useEffect(() => {
    if (userData) {
      const socketIo = io(${serverUrl}, {
        query: {
          userId: userData._id
        }
      });
      dispatch(setSocket(socketIo));

      socketIo.on('getOnlineUsers', (users) => {
        dispatch(setOnlineUsers(users));
      });

      return () => socketIo.close();
    } else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
  }, [userData]);

  socket?.on("newNotification", (noti) => {
    dispatch(setNotificationData([...notificationData, noti]));
  });

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-black">
        <ClipLoader color="#fff" size={50} />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path='/signup' element={
        <PublicRoute>
          <SignUp />
        </PublicRoute>
      } />
      <Route path='/signin' element={
        <PublicRoute>
          <SignIn />
        </PublicRoute>
      } />
      <Route path='/forgot-password' element={
        <PublicRoute>
          <ForgotPassword />
        </PublicRoute>
      } />

      {/* Protected Routes */}
      <Route path='/' element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
      <Route path='/profile/:userName' element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path='/editprofile' element={
        <ProtectedRoute>
          <EditProfile />
        </ProtectedRoute>
      } />
      <Route path='/upload' element={
        <ProtectedRoute>
          <Upload />
        </ProtectedRoute>
      } />
      <Route path='/loops' element={
        <ProtectedRoute>
          <Loops />
        </ProtectedRoute>
      } />
      <Route path='/story/:userName' element={
        <ProtectedRoute>
          <Story />
        </ProtectedRoute>
      } />
      <Route path='/messages' element={
        <ProtectedRoute>
          <Messages />
        </ProtectedRoute>
      } />
      <Route path='/messageArea' element={
        <ProtectedRoute>
          <MessageArea />
        </ProtectedRoute>
      } />
      <Route path='/search' element={
        <ProtectedRoute>
          <Search />
        </ProtectedRoute>
      } />
      <Route path='/notifications' element={
        <ProtectedRoute>
          <Notifications />
        </ProtectedRoute>
      } />

      {/* Public (No auth required) */}
      <Route path='/goodbye' element={<Goodbye />} />

      {/* Not Found Redirect */}
      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  );
}

export default App;

