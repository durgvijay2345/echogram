import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';

const useFetchOnce = ({ url, reduxAction, condition = false }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (condition) {
      // Data already exists, no need to fetch
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(url, { withCredentials: true });
        dispatch(reduxAction(res.data));
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, reduxAction, dispatch, condition]);

  return { loading, error };
};

export default useFetchOnce;
