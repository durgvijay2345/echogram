
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFollowing, setUserData, clearUserData } from '../redux/userSlice';
import { setCurrentUserStory } from '../redux/storySlice';
import { serverUrl } from '../App';

function useGetCurrentUser() {
  const dispatch = useDispatch();
  const storyData = useSelector(state => state.story?.storyData);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(${serverUrl}/api/user/current, { withCredentials: true });
        dispatch(setUserData(result.data));  
        dispatch(setCurrentUserStory(result.data.story));
      } catch (error) {
        console.log(error);
        dispatch(clearUserData());  
      }
    };
    fetchUser();
  }, [storyData, dispatch]);
}

export default useGetCurrentUser;   
