import React, { useEffect, useState } from 'react';
import dp from "../assets/dp.jpg";
import VideoPlayer from './VideoPlayer';
import { GoHeart, GoHeartFill } from "react-icons/go";
import { MdOutlineComment, MdOutlineBookmarkBorder } from "react-icons/md";
import { GoBookmarkFill } from "react-icons/go";
import { IoSendSharp } from "react-icons/io5";
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setPostData } from '../redux/postSlice';
import { setUserData } from '../redux/userSlice';
import FollowButton from './FollowButton';
import { useNavigate } from 'react-router-dom';

function Post({ post }) {
  const { userData } = useSelector(state => state.user);
  const { postData } = useSelector(state => state.post);
  const { socket } = useSelector(state => state.socket);

  const [showComment, setShowComment] = useState(false);
  const [visibleCount, setVisibleCount] = useState(2);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLike = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/post/like/${post._id}`, { withCredentials: true });
      const updatedPost = result.data;
      const updatedPosts = postData.map(p => p._id === post._id ? updatedPost : p);
      dispatch(setPostData(updatedPosts));
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async () => {
    try {
      const result = await axios.post(`${serverUrl}/api/post/comment/${post._id}`, { message }, { withCredentials: true });
      const updatedPost = result.data;
      const updatedPosts = postData.map(p => p._id === post._id ? updatedPost : p);
      dispatch(setPostData(updatedPosts));
      setMessage("");
    } catch (error) {
      console.log(error.response);
    }
  };

  const handleSaved = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/post/saved/${post._id}`, { withCredentials: true });
      dispatch(setUserData(result.data));
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    socket?.on("likedPost", (updatedData) => {
      const updatedPosts = postData.map(p => p._id === updatedData.postId ? { ...p, likes: updatedData.likes } : p);
      dispatch(setPostData(updatedPosts));
    });

    socket?.on("commentedPost", (updatedData) => {
      const updatedPosts = postData.map(p => p._id === updatedData.postId ? { ...p, comments: updatedData.comments } : p);
      dispatch(setPostData(updatedPosts));
    });

    return () => {
      socket?.off("likedPost");
      socket?.off("commentedPost");
    };
  }, [socket, postData, dispatch]);

  const author = post.author;

  
  const visibleComments = post.comments.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 2); 
  };

  const handleHideComments = () => {
    setVisibleCount(2);
    setShowComment(false);
  };

  return (
    <div className='w-full flex flex-col items-center'>
      {/* Top Section: Profile & Follow */}
      <div className='w-full max-w-[600px] flex justify-between items-center px-4 py-3'>
        <div className='flex items-center gap-3 cursor-pointer' onClick={() => navigate(`/profile/${author?.userName}`)}>
          <div className='w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden border'>
            <img src={author?.profileImage || dp} alt="" className='w-full h-full object-cover' />
          </div>
          <span className='font-semibold text-sm md:text-base'>{author?.userName || "Unknown"}</span>
        </div>
        {userData._id !== author?._id &&
          <FollowButton
            tailwind='px-3 py-1 bg-black text-white text-sm md:text-base rounded-full'
            targetUserId={author?._id}
          />}
      </div>

      {/* Media Section */}
      <div className='w-full flex justify-center'>
        {post.mediaType === "image" && (
          <img src={post.media} alt="" className='w-full max-w-[600px] object-cover' />
        )}
        {post.mediaType === "video" && (
          <div className='w-full max-w-[600px]'>
            <VideoPlayer media={post.media} />
          </div>
        )}
      </div>

      {/* Actions Section */}
      <div className='w-full max-w-[600px] flex justify-between items-center px-4 py-3'>
        <div className='flex items-center gap-4'>
          {!post.likes.includes(userData._id)
            ? <GoHeart className='w-6 h-6 cursor-pointer' onClick={handleLike} />
            : <GoHeartFill className='w-6 h-6 text-red-600 cursor-pointer' onClick={handleLike} />}
          <MdOutlineComment className='w-6 h-6 cursor-pointer' onClick={() => setShowComment(prev => !prev)} />
        </div>
        <div>
          {!userData.saved.includes(post._id)
            ? <MdOutlineBookmarkBorder className='w-6 h-6 cursor-pointer' onClick={handleSaved} />
            : <GoBookmarkFill className='w-6 h-6 cursor-pointer' onClick={handleSaved} />}
        </div>
      </div>

      {/* Likes Count */}
      <div className='w-full max-w-[600px] px-4'>
        <span className='font-semibold text-sm'>{post.likes.length} likes</span>
      </div>

      {/* Caption */}
      {post.caption && (
        <div className='w-full max-w-[600px] px-4 py-2 text-sm'>
          <span className='font-semibold mr-2'>{author?.userName}</span>
          <span>{post.caption}</span>
        </div>
      )}

      {/* View All Comments Button */}
      {post.comments.length > 2 && !showComment && (
        <div className='w-full max-w-[600px] px-4 text-sm text-gray-500 cursor-pointer' onClick={() => setShowComment(true)}>
          View all {post.comments.length} comments
        </div>
      )}

      {/* Comments Section */}
      {showComment && (
        <div className='w-full max-w-[600px] px-4'>
          {visibleComments.map((com, index) => (
            <div key={index} className='flex items-center gap-3 py-2'>
              <div className='w-8 h-8 rounded-full overflow-hidden border'>
                <img src={com.author?.profileImage || dp} alt="" className='w-full h-full object-cover' />
              </div>
              <div>
                <span className='font-semibold text-sm mr-2'>{com.author?.userName}</span>
                <span className='text-sm'>{com.message}</span>
              </div>
            </div>
          ))}

          {visibleCount < post.comments.length && (
            <div className='text-sm text-blue-500 cursor-pointer mb-2' onClick={handleShowMore}>
              View more comments
            </div>
          )}

          {visibleCount >= post.comments.length && post.comments.length > 2 && (
            <div className='text-sm text-blue-500 cursor-pointer mb-2' onClick={handleHideComments}>
              Hide comments
            </div>
          )}
        </div>
      )}

      {/* Add Comment */}
      {showComment && (
        <div className='w-full max-w-[600px] flex items-center px-4 py-3 border-t'>
          <div className='w-10 h-10 rounded-full overflow-hidden border'>
            <img src={userData?.profileImage || dp} alt="" className='w-full h-full object-cover' />
          </div>
          <input
            type="text"
            placeholder="Add a comment..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className='flex-1 mx-3 border-b outline-none py-1 text-sm'
          />
          <IoSendSharp onClick={handleComment} className='w-5 h-5 cursor-pointer' />
        </div>
      )}
    </div>
  );
}

export default Post;

