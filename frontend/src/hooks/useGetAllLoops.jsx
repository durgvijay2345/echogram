import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoopData } from '../redux/loopSlice';
import { serverUrl } from '../App';

function useGetAllLoops() {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchLoops = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/loop/getAll`, { withCredentials: true });
                dispatch(setLoopData(result.data));
            } catch (error) {
                console.error(error);
            }
        };

        fetchLoops();  // Run once on component mount
    }, []);
}

export default useGetAllLoops;

