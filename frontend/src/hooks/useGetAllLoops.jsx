import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { setLoopData } from '../redux/loopSlice';
import { serverUrl } from '../App';

function useGetAllLoops() {
    const dispatch = useDispatch();
        const {userData}=useSelector(state=>state.user)

    useEffect(() => {
        const fetchLoops = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/loop/getAll`, { withCredentials: true });
                dispatch(setLoopData(result.data));
            } catch (error) {
                console.error(error);
            }
        };

        fetchLoops();  
    }, [userData,dispatch]);
}

export default useGetAllLoops;

