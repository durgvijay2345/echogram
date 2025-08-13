import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import NotificationCard from '../components/NotificationCard';
import axios from 'axios';
import { serverUrl } from '../App';
import { setNotificationData } from '../redux/userSlice';

function Notifications() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { notificationData } = useSelector(state => state.user);

  const ids = Array.isArray(notificationData) ? notificationData.map(n => n._id) : [];

  const markAsRead = async () => {
    try {
      if(ids.length > 0) {
        await axios.post(`${serverUrl}/api/user/markAsRead`, { notificationId: ids }, { withCredentials: true });
      }
      await fetchNotifications();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/getAllNotifications`, { withCredentials: true });
      dispatch(setNotificationData(Array.isArray(result.data) ? result.data : []));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    markAsRead();
  }, []);

  return (
    <div className='w-full h-[100vh] bg-black overflow-auto'>
      {/* Header */}
      <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px] lg:hidden'>
        <MdOutlineKeyboardBackspace
          className='text-white cursor-pointer w-[25px] h-[25px]'
          onClick={() => navigate('/')}
        />
        <h1 className='text-white text-[20px] font-semibold'>Notifications</h1>
      </div>

      {/* Notifications List */}
      <div className='w-full flex flex-col gap-[20px] px-[10px]'>
        {Array.isArray(notificationData) && notificationData.map((noti, index) => (
          <NotificationCard noti={noti} key={index} />
        ))}
      </div>
    </div>
  );
}

export default Notifications;

