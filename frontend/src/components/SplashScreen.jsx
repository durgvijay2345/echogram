import React from 'react';
import favinsta from '../assets/favinsta.png';

function SplashScreen() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-black">
     
      <img
        src={favinsta}
        alt="Echogram"
        className="w-[70px] h-[70px] mb-6 spin-slow filter invert"
      />
      
      <p className="text-sm shimmer-text tracking-wide">
        from <span className="font-semibold">Echotech</span>
      </p>
    </div>
  );
}

export default SplashScreen;
