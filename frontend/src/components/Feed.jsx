import React from 'react';
import logo from "../assets/echo1.png";
import { IoMdNotifications } from "react-icons/io";
import StoryDp from './StoryDp';
import Nav from './Nav';
import { useSelector } from 'react-redux';
import Post from './Post';
import { useNavigate } from 'react-router-dom';

// ✅ Simple Post Skeleton Loader Component
const PostSkeleton = () => (
  <div className="w-[90%] animate-pulse bg-gray-200 h-[300px] rounded-2xl"></div>
);

function Feed() {
  const { postData } = useSelector(state => state.post);
  const { userData, notificationData } = useSelector(state => state.user);
  const { storyList, currentUserStory } = useSelector(state => state.story);
  const navigate = useNavigate();

  const isLoading = !postData || postData.length === 0;

  return (
    <div className='lg:w-[50%] w-full bg-black min-h-[100vh] lg:h-[100vh] relative lg:overflow-y-auto'>
      
      <div className='w-full h-[100px] flex items-center justify-between p-[20px] lg:hidden'>
        <img src={logo} alt="" className='w-[80px]' />
        <div className='flex items-center gap-[10px]'>
          <div className='relative' onClick={() => navigate("/notifications")}>
            <IoMdNotifications className='text-[white] w-[25px] h-[25px]' />
            {notificationData?.length > 0 && notificationData.some((noti) => noti.isRead === false) && (
              <div className='w-[10px] h-[10px] bg-blue-600 rounded-full absolute top-0 right-[-5px]'></div>
            )}
          </div>
        </div>
      </div>

      {/* Story DP Section */}
      <div className='flex w-full justify-start overflow-x-auto gap-[10px] items-center p-[20px]'>
        
        {/* Your Story */}
        <StoryDp 
          userName={"Your Story"} 
          ProfileImage={userData?.profileImage} 
          story={currentUserStory} 
        />

        {/* Other Stories */}
        {storyList
          ?.filter((story) => story.author._id !== userData._id)
          .map((story) => (
            <StoryDp
              userName={story.author.userName}
              ProfileImage={story.author.profileImage}
              story={story}
              key={story._id}
            />
          ))
        }

      </div>

      {/* Post Section */}
      <div className='w-full min-h-[100vh] flex flex-col items-center gap-[20px] p-[10px] pt-[40px] bg-white rounded-t-[60px] relative pb-[120px]'>
        <Nav />
        
        {/* Loader or Post Feed */}
        {isLoading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : (
          postData.map((post) => (
            <Post post={post} key={post._id} onPostUpdate={() => {}} />
          ))
        )}
      </div>

    </div>
  );
}

export default Feed;
