import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFollowing } from '../redux/userSlice';
import { serverUrl } from '../App';

function useGetFollowingList() {
    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.user);

    useEffect(() => {
        const fetchFollowing = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/followingList`, { withCredentials: true });
                dispatch(setFollowing(result.data));
            } catch (error) {
                console.log(error);
            }
        };

        if (userData) {
            fetchFollowing();
        }
    }, [userData]);
}

export default useGetFollowingList;

