import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData, clearUserData } from '../redux/userSlice';
import { setCurrentUserStory } from '../redux/storySlice';
import { serverUrl } from '../App';
import { useNavigate ,useLocation} from 'react-router-dom';

function useGetCurrentUser() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { userData } = useSelector(state => state.user);

    useEffect(() => {
        const publicPaths = ['/signin', '/signup', '/forgot-password'];
        if (publicPaths.includes(location.pathname)) return;

        // Only fetch if userData is null
        if (!userData) {
            const fetchUser = async () => {
                try {
                    const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true });
                    if (result.data) {
                        dispatch(setUserData(result.data));
                        dispatch(setCurrentUserStory(result.data.story));
                    } else {
                        dispatch(clearUserData());
                        navigate('/signin');
                    }
                } catch (error) {
                    console.log("User Fetch Error", error);
                    dispatch(clearUserData());
                    navigate('/signin');
                }
            };
            fetchUser();
        }
    }, [dispatch, navigate, location.pathname, userData]);
}

export default useGetCurrentUser;

