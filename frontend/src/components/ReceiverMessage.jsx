// ReceiverMessage.jsx
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

function ReceiverMessage({message}) {
    const {selectedUser}=useSelector(state=>state.message)
    const scroll = useRef()

    useEffect(()=>{
        scroll.current?.scrollIntoView({behavior:"smooth"})
    },[message])

    const renderContent = () => {
        if(message.image){
            const ext = message.image.split('.').pop().toLowerCase()
            if(ext === "pdf"){
                return <a href={message.image} target="_blank" rel="noreferrer" className='text-blue-500 underline'>Download PDF</a>
            } else if(["mp4","webm","ogg"].includes(ext)){
                return <video src={message.image} controls className='max-h-[200px] rounded-2xl'/>
            } else {
                return <img src={message.image} alt="msg" className='h-[200px] object-cover rounded-2xl'/>
            }
        }
        return <span>{message.message}</span>
    }

  return (
    <div ref={scroll} className='w-fit max-w-[60%] bg-[#1a1f1f] rounded-t-2xl rounded-br-2xl rounded-bl-0 px-[10px] py-[10px] relative left-0 flex flex-col gap-[10px]'>
        {renderContent()}  
        <div className='w-[30px] h-[30px] rounded-full cursor-pointer overflow-hidden absolute left-[-25px] bottom-[-40px]'>
            <img src={selectedUser?.profileImage || ""} alt="" className='w-full object-cover'/>
        </div>
    </div>
  )
}

export default ReceiverMessage
