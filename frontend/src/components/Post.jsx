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

  return (
    <div className='w-full max-w-[500px] flex flex-col bg-white shadow-md rounded-none border border-gray-300'>
      
      {/* Post Header */}
      <div className='w-full flex items-center justify-between px-3 py-2'>
        <div className='flex items-center gap-3 cursor-pointer' onClick={() => navigate(`/profile/${author?.userName}`)}>
          <img src={author?.profileImage || dp} alt="" className='w-10 h-10 rounded-full border object-cover' />
          <div className='font-semibold text-[14px]'>{author?.userName || "Unknown"}</div>
        </div>
        {userData._id !== author?._id &&
          <FollowButton
            tailwind={'px-3 py-1 text-[12px] bg-black text-white rounded-full whitespace-nowrap'}
            targetUserId={author?._id}
          />
        }
      </div>

      {/* Post Media */}
      <div className='w-full'>
        {post.mediaType === "image" && (
          <img src={post.media} alt="" className='w-full object-cover' />
        )}
        {post.mediaType === "video" && (
          <VideoPlayer media={post.media} />
        )}
      </div>

      {/* Post Actions */}
      <div className='w-full flex justify-between items-center px-3 py-2'>
        <div className='flex gap-4 items-center'>
          {!post.likes.includes(userData._id)
            ? <GoHeart className='w-6 h-6 cursor-pointer' onClick={handleLike} />
            : <GoHeartFill className='w-6 h-6 text-red-600 cursor-pointer' onClick={handleLike} />}
          <MdOutlineComment className='w-6 h-6 cursor-pointer' onClick={() => setShowComment(prev => !prev)} />
        </div>
        <div onClick={handleSaved}>
          {!userData.saved.includes(post._id)
            ? <MdOutlineBookmarkBorder className='w-6 h-6 cursor-pointer' />
            : <GoBookmarkFill className='w-6 h-6 cursor-pointer' />}
        </div>
      </div>

      {/* Like Count */}
      <div className='w-full px-3 text-[14px] font-semibold'>
        {post.likes.length} likes
      </div>

      {/* Caption */}
      {post.caption && (
        <div className='w-full px-3 py-1 text-[14px]'>
          <span className='font-semibold mr-1'>{author?.userName || "Unknown"}</span>
          {post.caption}
        </div>
      )}

      {/* Comments Section */}
      {showComment && (
        <div className='w-full flex flex-col gap-2 px-3 py-2'>
          {post.comments?.map((com, index) => (
            <div key={index} className='flex items-center gap-3'>
              <img src={com.author?.profileImage || dp} alt="" className='w-8 h-8 rounded-full object-cover' />
              <div className='text-[14px]'>
                <span className='font-semibold mr-1'>{com.author?.userName || "User"}</span>
                {com.message}
              </div>
            </div>
          ))}

          <div className='w-full flex items-center gap-3 pt-2 border-t border-gray-200'>
            <img src={userData?.profileImage || dp} alt="" className='w-8 h-8 rounded-full object-cover' />
            <input
              type="text"
              placeholder="Add a comment..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className='flex-1 outline-none text-[14px]'
            />
            <IoSendSharp className='w-5 h-5 cursor-pointer' onClick={handleComment} />
          </div>
        </div>
      )}

    </div>
  );
}

export default Post;
