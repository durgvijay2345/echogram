import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPostData } from '../redux/postSlice';
import { serverUrl } from '../App';

function useGetAllPost() {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/post/getAll`, { withCredentials: true });
                dispatch(setPostData(result.data));
            } catch (error) {
                console.log(error);
            }
        };

        fetchPosts();  
    }, []);
}

export default useGetAllPost;

