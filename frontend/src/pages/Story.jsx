// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { serverUrl } from '../App';
// import { useDispatch, useSelector } from 'react-redux';
// import { setStoryArrayData } from '../redux/storySlice';
// import StoryCard from '../components/StoryCard';

// function Story() {
//     const { userName } = useParams();
//     const dispatch = useDispatch();
//     const { storyArrayData } = useSelector(state => state.story);
//     const [currentIndex, setCurrentIndex] = useState(0);

//     const handleStory = async () => {
//         try {
//             const result = await axios.get(`${serverUrl}/api/story/getByUserName/${userName}`, { withCredentials: true });
//             dispatch(setStoryArrayData(result.data));
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     useEffect(() => {
//         if (userName) {
//             handleStory();
//         }
//     }, [userName]);

//     useEffect(() => {
//         if (storyArrayData.length > 0) {
//             setCurrentIndex(0); // Reset to first story on load
//         }
//     }, [storyArrayData]);

//     return (
//         <div className='w-full h-[100vh] bg-black flex justify-center items-center'>
//             {storyArrayData.length > 0 && (
//                <StoryCard
//     key={storyArrayData[currentIndex]?._id} 
//     storyData={storyArrayData[currentIndex]}
//     currentIndex={currentIndex}
//     setCurrentIndex={setCurrentIndex}
//     total={storyArrayData.length}
// />
//             )}
//         </div>
//     );
// }

// export default Story;

import React, { useState, useEffect } from "react";
import StoryCard from "./StoryCard";
import axios from "axios";

function Story() {
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);

  // Stories fetch
  useEffect(() => {
    let isMounted = true;
    axios.get("/api/stories")
      .then(res => {
        if (isMounted) {
          setStories(res.data || []);
        }
      })
      .catch(err => console.error(err));

    return () => {
      isMounted = false;
    };
  }, []);

  // Select story to view
  const handleStoryClick = (story) => {
    setSelectedStory(story);
  };

  // Close story view
  const handleClose = () => {
    setSelectedStory(null);
  };

  return (
    <div className="flex gap-3 p-4 overflow-x-auto">
      {stories.map((story) => (
        <div key={story._id} onClick={() => handleStoryClick(story)}>
          <img
            src={story.user.profileImg}
            alt={story.user.username}
            className="w-16 h-16 rounded-full object-cover cursor-pointer border-2 border-pink-500"
          />
          <p className="text-center text-sm">{story.user.username}</p>
        </div>
      ))}

      {selectedStory && (
        <StoryCard
          story={selectedStory}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

export default Story;







