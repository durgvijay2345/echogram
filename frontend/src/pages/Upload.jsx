import React, { useState, useRef } from 'react';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { FiPlusSquare } from "react-icons/fi";
import VideoPlayer from '../components/VideoPlayer';
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setPostData } from '../redux/postSlice';
import { setCurrentUserStory } from '../redux/storySlice';
import { setLoopData } from '../redux/loopSlice';
import { ClipLoader } from 'react-spinners';

function Upload() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { postData } = useSelector(state => state.post);
    const { loopData } = useSelector(state => state.loop);
    const [uploadType, setUploadType] = useState("post");
    const [frontendMedia, setFrontendMedia] = useState(null);
    const [backendMedia, setBackendMedia] = useState(null);
    const [mediaType, setMediaType] = useState("");
    const [caption, setCaption] = useState("");
    const [loading, setLoading] = useState(false);
    const mediaInput = useRef();

    const handleMedia = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (uploadType === "loop" && !file.type.includes("video")) {
            alert("Loops can only be videos!");
            return;
        }

        setMediaType(file.type.includes("image") ? "image" : "video");
        setBackendMedia(file);
        setFrontendMedia(URL.createObjectURL(file));
    };

    const handleUpload = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("mediaType", mediaType);
            formData.append("media", backendMedia);
            if (uploadType !== "story") {
                formData.append("caption", caption);
            }

            let apiUrl = "";
            if (uploadType === "post") apiUrl = "/api/post/upload";
            else if (uploadType === "story") apiUrl = "/api/story/upload";
            else apiUrl = "/api/loop/upload";

            const result = await axios.post(`${serverUrl}${apiUrl}`, formData, { withCredentials: true });

            if (uploadType === "post") dispatch(setPostData([...postData, result.data]));
            else if (uploadType === "loop") dispatch(setLoopData([...loopData, result.data]));
            else dispatch(setCurrentUserStory(result.data));

            navigate("/");
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full h-[100vh] bg-black flex flex-col items-center overflow-y-auto'>
            
          
            <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px]'>
                <MdOutlineKeyboardBackspace
                    className='text-white cursor-pointer w-[25px] h-[25px]'
                    onClick={() => navigate('/')}
                />
                <h1 className='text-white text-[20px] font-semibold'>Upload Media</h1>
            </div>

          
            <div className='w-[90%] max-w-[600px] h-[80px] bg-white rounded-full flex justify-around items-center gap-[10px] my-[20px]'>
                {["post", "story", "loop"].map(type => (
                    <div
                        key={type}
                        className={`${uploadType === type ? "bg-black text-white shadow-2xl shadow-black" : ""} w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`}
                        onClick={() => setUploadType(type)}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </div>
                ))}
            </div>

         
            <div className='w-[90%] max-w-[500px] flex flex-col items-center gap-[20px]'>
                {!frontendMedia ? (
                    <div
                        className='w-full h-[250px] bg-[#0e1316] border-gray-800 border-2 flex flex-col items-center justify-center gap-[10px] rounded-2xl cursor-pointer hover:bg-[#353a3d]'
                        onClick={() => mediaInput.current.click()}
                    >
                        <FiPlusSquare className='text-white w-[30px] h-[30px]' />
                        <div className='text-white text-[19px] font-semibold'>Upload {uploadType}</div>
                    </div>
                ) : (
                    <div className='w-full flex flex-col items-center gap-[15px]'>
                        {mediaType === "image" && (
                            <img src={frontendMedia} alt="" className='w-full h-[250px] object-cover rounded-2xl' />
                        )}
                        {mediaType === "video" && (
                            <VideoPlayer media={frontendMedia} />
                        )}

                        {uploadType !== "story" && (
                            <input
                                type='text'
                                className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white'
                                placeholder='Write caption'
                                onChange={(e) => setCaption(e.target.value)}
                                value={caption}
                            />
                        )}

                        <button
                            className='text-blue-400 underline'
                            onClick={() => mediaInput.current.click()}
                        >
                            Change Media
                        </button>
                    </div>
                )}
            </div>

           
            {frontendMedia && (
                <button
                    className='px-[10px] w-[60%] max-w-[400px] py-[10px] h-[50px] bg-white mt-[40px] cursor-pointer rounded-2xl'
                    onClick={handleUpload}
                >
                    {loading ? <ClipLoader size={25} color='black' /> : `Upload ${uploadType}`}
                </button>
            )}

            <input
                type="file"
                accept={uploadType === "loop" ? "video/*" : ""}
                hidden
                ref={mediaInput}
                onChange={handleMedia}
            />
        </div>
    );
}

export default Upload;

