import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useGetAllPost from './useGetAllPost';
import useGetAllStories from './useGetAllStories';
import { setGlobalDataLoaded } from '../redux/userSlice';

const useGlobalDataLoader = () => {
  const dispatch = useDispatch();
  const { globalDataLoaded } = useSelector(state => state.user);

  useEffect(() => {
    const loadData = async () => {
      await useGetAllPost();
      await useGetAllStories();
      dispatch(setGlobalDataLoaded(true));
    };

    if (!globalDataLoaded) {
      loadData();
    }
  }, [globalDataLoaded, dispatch]);
};

export default useGlobalDataLoader;
