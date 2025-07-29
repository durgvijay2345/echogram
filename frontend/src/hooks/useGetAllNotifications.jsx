import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNotificationData } from '../redux/userSlice';
import { serverUrl } from '../App';

function useGetAllNotifications() {
    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.user);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/getAllNotifications`, { withCredentials: true });
                dispatch(setNotificationData(result.data));
            } catch (error) {
                console.error(error);
            }
        };

        if (userData) {
            fetchNotifications();
        }
    }, [userData]);
}

export default useGetAllNotifications;


