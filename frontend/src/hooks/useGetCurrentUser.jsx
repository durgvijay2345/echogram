import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { setCurrentUserStory } from '../redux/storySlice';
import { serverUrl } from '../App';


function useGetCurrentUser() {
    const dispatch = useDispatch();
    const userData=useSelector(state=>state.user

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true });
                dispatch(setUserData(result.data));
                dispatch(setCurrentUserStory(result.data.story));
            } catch (error) {
                console.log(error);
            }
        };

        fetchUser();
    }, [userData]);
}

export default useGetCurrentUser;


