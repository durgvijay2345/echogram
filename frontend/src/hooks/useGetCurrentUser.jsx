import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setFollowing, setUserData } from '../redux/userSlice';
import { setCurrentUserStory } from '../redux/storySlice';
import { serverUrl } from '../App';

function useGetCurrentUser() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true });
                dispatch(setUserData(result.data));
                dispatch(setCurrentUserStory(result.data.story));
                dispatch(setFollowing(result.data.following)); // If needed
            } catch (error) {
                console.log(error);
                dispatch(setUserData(null));
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [dispatch]);

    return loading;  
}

export default useGetCurrentUser;

