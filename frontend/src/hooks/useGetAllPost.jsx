// Example: useGetAllPosts.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setPostData } from '../redux/postSlice';
import { serverUrl } from '../App';

function useGetAllPost() {
    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.user);

    useEffect(() => {
        if (userData) {
            axios.get(`${serverUrl}/api/post/getAll, { withCredentials: true }`)
                .then(res => {
                    dispatch(setPostData(res.data));
                })
                .catch(err => console.error(err));
        }
    }, [userData, dispatch]);
}

export default useGetAllPost;
