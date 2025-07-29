import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setPostData } from '../redux/postSlice';
import { setStoryList } from '../redux/storySlice';
import { setGlobalDataLoaded } from '../redux/userSlice';
import { serverUrl } from '../App';

function useGlobalDataLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, storiesRes] = await Promise.all([
          axios.get(`${serverUrl}/api/post/all`, { withCredentials: true }),
          axios.get(`${serverUrl}/api/story/all`, { withCredentials: true }),
        ]);

        dispatch(setPostData(postsRes.data));
        dispatch(setStoryList(storiesRes.data));

        dispatch(setGlobalDataLoaded(true)); 
      } catch (error) {
        console.error("Global Data Load Error:", error);
        dispatch(setGlobalDataLoaded(true));  
      }
    };

    fetchData();
  }, [dispatch]);
}

export default useGlobalDataLoader;

