import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setStoryArrayData } from '../redux/storySlice';
import StoryCard from '../components/StoryCard';

function Story() {
    const { userName } = useParams();
    const dispatch = useDispatch();
    const { storyArrayData } = useSelector(state => state.story);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleStory = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/story/getByUserName/${userName}`, { withCredentials: true });
            dispatch(setStoryArrayData(result.data));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (userName) {
            handleStory();
        }
    }, [userName]);

    useEffect(() => {
        if (storyArrayData.length > 0) {
            setCurrentIndex(0); // Reset to first story on load
        }
    }, [storyArrayData]);

    return (
        <div className='w-full h-[100vh] bg-black flex justify-center items-center'>
            {storyArrayData.length > 0 && (
                <StoryCard
                    storyData={storyArrayData[currentIndex]}
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                    total={storyArrayData.length}
                />
            )}
        </div>
    );
}

export default Story;






