import React, { useEffect, useState } from 'react';
import LeftHome from '../components/LeftHome';
import Feed from '../components/Feed';
import RightHome from '../components/RightHome';
import ExitModal from '../components/ExitModal';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [showExitModal, setShowExitModal] = useState(false);
  const navigate = useNavigate();

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
    if (window.history.length > 1) {

      window.history.back();
    } else {
     
      navigate('/goodbye');
    }
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


