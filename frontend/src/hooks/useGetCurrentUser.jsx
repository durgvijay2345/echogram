import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData, clearUserData } from '../redux/userSlice';
import { setCurrentUserStory } from '../redux/storySlice';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../utils/axios';  // Axios instance with token

function useGetCurrentUser() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { userData } = useSelector(state => state.user);

    useEffect(() => {
        const publicPaths = ['/signin', '/signup', '/forgot-password'];

        const token = localStorage.getItem('token');
        if (!token) {
            if (!publicPaths.includes(location.pathname)) {
                navigate('/signin');
            }
            return; // No token, no API call
        }

        if (!userData) {
            const fetchUser = async () => {
                try {
                    const result = await axios.get('/user/current');
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

