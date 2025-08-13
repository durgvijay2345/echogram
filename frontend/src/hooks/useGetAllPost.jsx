// hooks/useGetAllPost.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setPostData } from '../redux/postSlice';
import { serverUrl } from '../App';

function useGetAllPost() {
    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.user);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get(`${serverUrl}/api/post/getAll`, {
                    withCredentials: true,
                });
                dispatch(setPostData(res.data));
            } catch (err) {
                console.error("Failed to fetch posts:", err);
                dispatch(setPostData([])); // fallback empty data
            }
        };

        if (userData?._id) {
            fetchPosts();
        }
    }, [userData?._id, dispatch]);
}

export default useGetAllPost;
