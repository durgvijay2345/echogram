import axios from 'axios';
import React, { useEffect } from 'react';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setPrevChatUsers } from '../redux/messageSlice';

function useGetPrevChatUsers() {
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/message/prevChats`, { withCredentials: true });
        dispatch(setPrevChatUsers(result.data));
      } catch (error) {
        console.error(error);
      }
    };

    if (userData) {  
      fetchUsers();
    }
  }, [userData]); 
}

export default useGetPrevChatUsers;

