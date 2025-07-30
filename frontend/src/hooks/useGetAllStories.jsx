import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { setStoryData } from '../redux/storySlice';

function useGetAllStories() {
    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.user);
     const {storyData}=useSelector(state=>state.story)

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/story/getAll`, { withCredentials: true });
                dispatch(setStoryData(result.data));
            } catch (error) {
                console.log(error);
            }
        };

        if (userData) { 
            fetchStories();
        }
    }, [userData,storyData]);  

}

export default useGetAllStories;

