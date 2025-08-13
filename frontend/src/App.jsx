import React, { useEffect, useRef } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';

import {
  setNotificationData,
  setSuggestedUsers,
  setFollowing,
} from './redux/userSlice';
import { setPostData } from './redux/postSlice';
import { setLoopData } from './redux/loopSlice';
import { setStoryData } from './redux/storySlice';
import { setOnlineUsers } from './redux/socketSlice';

// Hooks
import useGetCurrentUser from './hooks/useGetCurrentUser';
import useFetchOnce from './hooks/useFetchOnce';
import useGetPrevChatUsers from './hooks/useGetPrevChatUsers';

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

// (Optional) loader component; ya to apna Loader import karo:
const Loader = () => (
  <div className="w-full h-screen flex items-center justify-center bg-black text-white">
    Loading...
  </div>
);

// 👇 PROD backend URL (Render). Trailing slash MAT lagana.
export const serverUrl = "https://echogram-backend-wkov.onrender.com";

function App() {
  const dispatch = useDispatch();
  const { userData, notificationData, following, suggestedUsers } = useSelector((s) => s.user);
  const { postData } = useSelector((s) => s.post);
  const { loopData } = useSelector((s) => s.loop);
  const { storyData } = useSelector((s) => s.story);

  const socketRef = useRef(null);

  // Always call hooks at top level
  const userLoading = useGetCurrentUser();
  useGetPrevChatUsers();

  // NOTE: Make sure your useFetchOnce internally uses axios with { withCredentials: true }
  const postsFetch = useFetchOnce({
    url: `${serverUrl}/api/post/getAll`,
    reduxAction: setPostData,
    condition: Array.isArray(postData) && postData.length > 0,
    config: { withCredentials: true }, // <-- ensure cookie goes
  });

  const loopsFetch = useFetchOnce({
    url: `${serverUrl}/api/loop/getAll`,
    reduxAction: setLoopData,
    condition: Array.isArray(loopData) && loopData.length > 0,
    config: { withCredentials: true },
  });

  const storiesFetch = useFetchOnce({
    url: `${serverUrl}/api/story/getAll`,
    reduxAction: setStoryData,
    condition: Array.isArray(storyData) && storyData.length > 0,
    config: { withCredentials: true },
  });

  const followingFetch = useFetchOnce({
    url: `${serverUrl}/api/user/followingList`,
    reduxAction: setFollowing,
    condition: following !== null,
    config: { withCredentials: true },
  });

  const notificationsFetch = useFetchOnce({
    url: `${serverUrl}/api/user/getAllNotifications`,
    reduxAction: setNotificationData,
    condition: Array.isArray(notificationData) && notificationData.length > 0,
    config: { withCredentials: true },
  });

  const suggestedUsersFetch = useFetchOnce({
    url: `${serverUrl}/api/user/suggested`,
    reduxAction: setSuggestedUsers,
    condition: Array.isArray(suggestedUsers) && suggestedUsers.length > 0,
    config: { withCredentials: true },
  });

  // --- Socket setup ---
  useEffect(() => {
    if (userData && !socketRef.current) {
      const socketIo = io(serverUrl, {
        query: { userId: userData._id },
        withCredentials: true,          // send cookies if any (CORS)
        transports: ['websocket'],      // avoid long-polling CORS noise
        forceNew: true,
      });

      socketRef.current = socketIo;

      socketIo.on('getOnlineUsers', (users) => {
        dispatch(setOnlineUsers(users));
      });

      // server emits 'newNotification'
      socketIo.on('newNotification', (noti) => {
        // append in Redux list
        dispatch(setNotificationData([...(notificationData || []), noti]));
      });

      return () => {
        socketIo.close();
        socketRef.current = null;
      };
    }

    if (!userData && socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  }, [userData, dispatch]); // keep deps minimal; inner state is read once

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
      <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to="/" />} />
      <Route path="/signin" element={!userData ? <SignIn /> : <Navigate to="/" />} />
      <Route path="/forgot-password" element={!userData ? <ForgotPassword /> : <Navigate to="/" />} />

      <Route path="/" element={userData ? <Home /> : <Navigate to="/signin" />} />
      <Route path="/profile/:userName" element={userData ? <Profile /> : <Navigate to="/signin" />} />
      <Route path="/story/:userName" element={userData ? <Story /> : <Navigate to="/signin" />} />
      <Route path="/upload" element={userData ? <Upload /> : <Navigate to="/signin" />} />
      <Route path="/search" element={userData ? <Search /> : <Navigate to="/signin" />} />
      <Route path="/editprofile" element={userData ? <EditProfile /> : <Navigate to="/signin" />} />
      <Route path="/messages" element={userData ? <Messages /> : <Navigate to="/signin" />} />
      <Route path="/messageArea" element={userData ? <MessageArea /> : <Navigate to="/signin" />} />
      <Route path="/notifications" element={userData ? <Notifications /> : <Navigate to="/signin" />} />
      <Route path="/loops" element={userData ? <Loops /> : <Navigate to="/signin" />} />
      <Route path="/goodbye" element={<Goodbye />} />
    </Routes>
  );
}

export default App;


export default App;



