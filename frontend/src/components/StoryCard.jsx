import React, { useEffect, useState } from 'react';
import dp from "../assets/dp.jpg";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import VideoPlayer from './VideoPlayer';
import { FaEye } from "react-icons/fa6";

function StoryCard({ storyData, currentIndex, setCurrentIndex, total }) {
    const { userData } = useSelector(state => state.user);
    const [showViewers, setShowViewers] = useState(false);
    const [progress, setProgress] = useState(0);
    const [activeStory, setActiveStory] = useState(null);
    const navigate = useNavigate();

    // Load new story with cleanup
    useEffect(() => {
        setActiveStory(null); 
        const timeout = setTimeout(() => {
            setActiveStory(storyData);
        }, 50);

        return () => clearTimeout(timeout);
    }, [storyData]);

   
    useEffect(() => {
        setProgress(0);
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    if (currentIndex + 1 < total) {
                        setCurrentIndex(currentIndex + 1);
                    } else {
                        navigate('/');
                    }
                    return 100;
                }
                return prev + 1.5;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [currentIndex, total, setCurrentIndex, navigate]);

    if (!activeStory) return null;

    return (
        <div className='w-full max-w-[500px] h-[100vh] border-x-2 border-gray-800 pt-[10px] relative flex flex-col justify-center'>
            {/* Header */}
            <div className='flex items-center gap-[10px] absolute top-[30px] px-[10px] z-10'>
                <MdOutlineKeyboardBackspace
                    className='text-white cursor-pointer w-[25px]  h-[25px]'
                    onClick={() => navigate(`/`)}
                />
                <div className='w-[30px] h-[30px] md:w-[40px] md:h-[40px] border-2 border-black rounded-full overflow-hidden'>
                    <img
                        src={activeStory?.author?.profileImage || dp}
                        alt=""
                        className='w-full h-full object-cover'
                        onError={e => e.target.src = dp}
                    />
                </div>
                <div className='w-[120px] font-semibold truncate text-white'>
                    {activeStory?.author?.userName}
                </div>
            </div>

            {/* Progress Bar */}
            <div className='absolute top-[10px] w-full h-[5px] bg-gray-900 z-10'>
                <div
                    className='h-full bg-white transition-all duration-100 ease-linear'
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            {/* Story Media */}
            {!showViewers && (
                <div className='w-full h-[90vh] flex items-center justify-center'>
                    {activeStory?.mediaType === "image" && (
                        <div className='w-[90%] flex items-center justify-center'>
                            <img
                                key={activeStory.media}
                                src={activeStory.media}
                                alt=""
                                className='w-[80%] rounded-2xl object-cover'
                            />
                        </div>
                    )}
                    {activeStory?.mediaType === "video" && (
                        <div className='w-[80%] flex flex-col items-center justify-center'>
                            <VideoPlayer key={activeStory.media} media={activeStory.media} />
                        </div>
                    )}
                </div>
            )}

            {/* Viewers (only for own story) */}
            {!showViewers && activeStory?.author?.userName === userData?.userName && (
                <div
                    className='absolute w-full flex items-center gap-[10px] text-white h-[70px] bottom-0 p-2 left-0 cursor-pointer'
                    onClick={() => setShowViewers(true)}
                >
                    <div className='flex items-center gap-[5px]'>
                        <FaEye />{activeStory.viewers.length}
                    </div>
                    <div className='flex relative'>
                        {activeStory?.viewers?.slice(0, 3).map((viewer, index) => (
                            <div
                                key={index}
                                className={`w-[30px] h-[30px] border-2 border-black rounded-full overflow-hidden absolute`}
                                style={{ left: `${index * 20}px` }}
                            >
                                <img
                                    src={viewer?.profileImage || dp}
                                    alt=""
                                    className='w-full h-full object-cover'
                                    onError={e => e.target.src = dp}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Viewers List */}
            {showViewers && (
                <>
                    <div
                        className='w-full h-[30%] flex items-center justify-center mt-[100px] cursor-pointer py-[30px] overflow-hidden'
                        onClick={() => setShowViewers(false)}
                    >
                        {activeStory?.mediaType === "image" && (
                            <div className='h-full flex items-center justify-center'>
                                <img
                                    key={activeStory.media}
                                    src={activeStory.media}
                                    alt=""
                                    className='h-full rounded-2xl object-cover'
                                />
                            </div>
                        )}
                        {activeStory?.mediaType === "video" && (
                            <div className='h-full flex flex-col items-center justify-center'>
                                <VideoPlayer key={activeStory.media} media={activeStory.media} />
                            </div>
                        )}
                    </div>

                    <div className='w-full h-[70%] border-t-2 border-t-gray-800 p-[20px] overflow-y-auto'>
                        <div className='text-white flex items-center gap-[10px]'>
                            <FaEye /><span>{activeStory?.viewers?.length}</span><span>Viewers</span>
                        </div>
                        <div className='flex flex-col gap-[10px] pt-[20px]'>
                            {activeStory?.viewers?.map((viewer, index) => (
                                <div key={index} className='flex items-center gap-[20px]'>
                                    <div className='w-[30px] h-[30px] md:w-[40px] md:h-[40px] border-2 border-black rounded-full overflow-hidden'>
                                        <img
                                            src={viewer?.profileImage || dp}
                                            alt=""
                                            className='w-full h-full object-cover'
                                            onError={e => e.target.src = dp}
                                        />
                                    </div>
                                    <div className='w-[120px] font-semibold truncate text-white'>
                                        {viewer?.userName}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default StoryCard;




