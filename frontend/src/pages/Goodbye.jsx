import React, { useEffect } from 'react';

function Goodbye() {
  useEffect(() => {
    // After 2 seconds, close tab (mobile only, desktop won't close programmatically)
    setTimeout(() => {
      window.location.href = 'about:blank';
    }, 2000);
  }, []);

  return (
    <div className='w-full h-[100vh] flex flex-col justify-center items-center bg-black text-white text-center'>
      <h1 className='text-4xl font-bold mb-4'>Goodbye!</h1>
      <p className='text-lg'>Thanks for visiting. See you again!</p>
      <div className='mt-8 animate-bounce text-6xl'>👋</div>
    </div>
  );
}

export default Goodbye;
