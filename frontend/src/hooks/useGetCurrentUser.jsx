import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserData, clearUserData } from '../redux/userSlice';
import { setCurrentUserStory } from '../redux/storySlice';
import { serverUrl } from '../App';

function useGetCurrentUser() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true });
        dispatch(setUserData(result.data));  
        dispatch(setCurrentUserStory(result.data.story));
      } catch (error) {
        console.log("User not authenticated", error);
        dispatch(clearUserData());  
      }
    };
    fetchUser();
  }, [dispatch]);  
}

export default useGetCurrentUser;

