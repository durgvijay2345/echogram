// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import axios from 'axios';
// import { serverUrl } from '../App';
// import { setStoryData } from '../redux/storySlice';

// function useGetAllStories() {
//     const dispatch = useDispatch();
//     const { userData } = useSelector(state => state.user);
//      const {storyData}=useSelector(state=>state.story)

//     useEffect(() => {
//         const fetchStories = async () => {
//             try {
//                 const result = await axios.get(`${serverUrl}/api/story/getAll`, { withCredentials: true });
//                 dispatch(setStoryData(result.data));
//             } catch (error) {
//                 console.log(error);
//             }
//         };

//         if (userData) { 
//             fetchStories();
//         }
//     }, [userData,storyData]);  

// }

// export default useGetAllStories;


import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { setStoryData, setStoryList, setCurrentUserStory } from '../redux/storySlice';

function useGetAllStories() {
    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.user);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/story/getAll`, { withCredentials: true });
                const allStories = result.data;

                dispatch(setStoryData(allStories));

                // Separate current user's story
                const myStory = allStories.find(story => story.author._id === userData._id);
                dispatch(setCurrentUserStory(myStory || null));

                // Set other users' stories
                const otherStories = allStories.filter(story => story.author._id !== userData._id);
                dispatch(setStoryList(otherStories));
            } catch (error) {
                console.log(error);
            }
        };

        if (userData) {
            fetchStories();
        }
    }, [userData, dispatch]);
}

export default useGetAllStories;


