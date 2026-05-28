import React from 'react';
import { FaInstagram } from 'react-icons/fa';  

function Loader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 z-50">
      <FaInstagram className="text-white text-5xl animate-pulse mb-4" />
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-white"></div>
    </div>
  );
}

export default Loader;
