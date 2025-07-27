imimport React, { useEffect } from 'react';
import LeftHome from '../components/LeftHome';
import Feed from '../components/Feed';
import RightHome from '../components/RightHome';

function Home() {
  useEffect(() => {
    const handlePopState = (event) => {
      
      const shouldExit = window.confirm("Do you want to exit the site?");
      if (shouldExit) {
      
      } else {
       
        window.history.pushState(null, null, window.location.pathname);
      }
    };

    window.history.pushState(null, null, window.location.pathname); // Push initial state
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <div className='w-full flex justify-center items-center'>
      <LeftHome />
      <Feed />
      <RightHome />
    </div>
  );
}

export default Home;
