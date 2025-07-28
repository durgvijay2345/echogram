import React from 'react';
import favinsta from '../public/favInsta.png'; 

function SplashScreen() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-black text-orange-400">
      <img
        src={favinsta}
        alt="Echogram"
        className="w-[70px] h-[70px] mb-6 animate-spin-slow"
      />
      <p className="text-gray-500 text-sm tracking-wide">
        from <span className="font-semibold">Echotech</span>
      </p>
    </div>
  );
}

export default SplashScreen;
