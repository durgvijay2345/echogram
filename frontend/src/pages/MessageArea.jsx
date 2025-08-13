import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { LuImage } from "react-icons/lu";
import { IoMdSend } from "react-icons/io";
import dp from "../assets/dp.jpg";
import SenderMessage from '../components/SenderMessage';
import ReceiverMessage from '../components/ReceiverMessage';
import axios from 'axios';
import { serverUrl } from '../App';
import { setMessages, setSelectedUser } from '../redux/messageSlice';

function MessageArea() {
    const { selectedUser, messages } = useSelector(state => state.message);
    const { userData } = useSelector(state => state.user);
    const { socket } = useSelector(state => state.socket);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [input, setInput] = useState("");
    const imageInput = useRef();
    const [frontendImage, setFrontendImage] = useState(null);
    const [backendImage, setBackendImage] = useState(null);

    // Restore selected user from localStorage if missing
    useEffect(() => {
        if (!selectedUser) {
            const savedUser = localStorage.getItem("selectedUser");
            if (savedUser) {
                dispatch(setSelectedUser(JSON.parse(savedUser)));
            } else {
                navigate("/messages");
            }
        }
    }, [selectedUser, dispatch, navigate]);

    // Save selected user to localStorage
    useEffect(() => {
        if (selectedUser) {
            localStorage.setItem("selectedUser", JSON.stringify(selectedUser));
        }
    }, [selectedUser]);

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBackendImage(file);
            setFrontendImage(URL.createObjectURL(file));
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input && !backendImage) return;

        try {
            const formData = new FormData();
            formData.append("message", input);
            if (backendImage) formData.append("image", backendImage);

            const result = await axios.post(
                `${serverUrl}/api/message/send/${selectedUser._id}`,
                formData,
                { withCredentials: true }
            );

            // Immediately update messages safely
            dispatch(setMessages(prev => Array.isArray(prev) ? [...prev, result.data] : [result.data]));

            setInput("");
            setBackendImage(null);
            setFrontendImage(null);
        } catch (error) {
            console.log("Send Message Error:", error);
        }
    };

    const getAllMessages = async () => {
        try {
            const result = await axios.get(
                `${serverUrl}/api/message/getAll/${selectedUser._id}`,
                { withCredentials: true }
            );

            // Ensure messages is always array
            dispatch(setMessages(Array.isArray(result.data) ? result.data : []));
        } catch (error) {
            console.log("Get Messages Error:", error);
        }
    };

    useEffect(() => {
        if (selectedUser) getAllMessages();
    }, [selectedUser]);

    // Socket listener for new messages
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (mess) => {
            // Ignore messages not from/to this chat
            if (mess.sender === selectedUser._id || mess.receiver === selectedUser._id) {
                dispatch(setMessages(prev => Array.isArray(prev) ? [...prev, mess] : [mess]));
            }
        };

        socket.on("newMessage", handleNewMessage);
        return () => socket.off("newMessage", handleNewMessage);
    }, [socket, dispatch, selectedUser]);

    // Ensure selectedUser exists before rendering
    if (!selectedUser) {
        return (
            <div className='w-full h-[100vh] bg-black flex justify-center items-center text-white text-xl'>
                Loading...
            </div>
        );
    }

    const safeMessages = Array.isArray(messages) ? messages : [];

    return (
        <div className='w-full h-[100vh] bg-black relative'>
            {/* Header */}
            <div className='w-full flex items-center gap-[15px] px-[20px] py-[10px] fixed top-0 z-[100] bg-black'>
                <div className='h-[80px] flex items-center gap-[20px] px-[20px]'>
                    <MdOutlineKeyboardBackspace
                        className='text-white cursor-pointer w-[25px] h-[25px]'
                        onClick={() => navigate(`/`)}
                    />
                </div>
                <div
                    className='w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden'
                    onClick={() => navigate(`/profile/${selectedUser.userName}`)}
                >
                    <img src={selectedUser.profileImage || dp} alt="" className='w-full object-cover' />
                </div>
                <div className='text-white text-[18px] font-semibold'>
                    <div>{selectedUser.userName}</div>
                    <div className='text-[14px] text-gray-400'>{selectedUser.name}</div>
                </div>
            </div>

            {/* Messages */}
            <div className='w-full h-[80%] pt-[100px] px-[40px] flex flex-col gap-[50px] overflow-auto bg-black'>
                {safeMessages.map((mess, index) =>
                    mess.sender === userData._id
                        ? <SenderMessage key={index} message={mess} />
                        : <ReceiverMessage key={index} message={mess} />
                )}
            </div>

            {/* Input */}
            <div className='w-full h-[80px] fixed bottom-0 flex justify-center items-center bg-black z-[100]'>
                <form
                    className='w-[90%] max-w-[800px] h-[80%] rounded-full bg-[#131616] flex items-center gap-[10px] px-[20px] relative'
                    onSubmit={handleSendMessage}
                >
                    {frontendImage && (
                        <div className='w-[100px] rounded-2xl h-[100px] absolute top-[-120px] right-[10px] overflow-hidden'>
                            <img src={frontendImage} alt="" className='h-full object-cover' />
                        </div>
                    )}
                    <input type="file" accept='image/*' hidden ref={imageInput} onChange={handleImage} />
                    <input
                        type="text"
                        placeholder='Message'
                        className='w-full h-full px-[20px] text-[18px] text-white outline-0'
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                    />
                    <div onClick={() => imageInput.current.click()}>
                        <LuImage className='w-[28px] h-[28px] text-white' />
                    </div>
                    {(input || frontendImage) && (
                        <button className='w-[60px] h-[40px] rounded-full bg-gradient-to-br from-[#9500ff] to-[#ff0095] flex items-center justify-center cursor-pointer'>
                            <IoMdSend className='w-[25px] h-[25px] text-white' />
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}

export default MessageArea;



