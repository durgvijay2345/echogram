import React, { useEffect, useState } from 'react';
import LeftHome from '../components/LeftHome';
import Feed from '../components/Feed';
import RightHome from '../components/RightHome';
import ExitModal from '../components/ExitModal';

function Home() {
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    const handlePopState = (event) => {
      setShowExitModal(true);
      
      window.history.pushState(null, null, window.location.pathname);
    };

 
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleExit = () => {
   
    window.history.back();
  };

  const handleStay = () => {
    setShowExitModal(false);
  };

  return (
    <div className='w-full flex justify-center items-center'>
      <LeftHome />
      <Feed />
      <RightHome />

      {showExitModal && <ExitModal onExit={handleExit} onStay={handleStay} />}
    </div>
  );
}

export default Home;

