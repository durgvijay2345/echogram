import React from 'react';

function ExitModal({ onExit, onStay }) {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50'>
      <div className='bg-white rounded-2xl p-6 w-[300px] flex flex-col items-center text-center'>
        <h2 className='text-xl font-semibold mb-4'>Exit Site?</h2>
        <p className='text-gray-600 mb-6'>Are you sure you want to exit this website?</p>
        <div className='flex gap-4'>
          <button
            onClick={onStay}
            className='px-4 py-2 bg-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-400'
          >
            Stay
          </button>
          <button
            onClick={onExit}
            className='px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600'
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExitModal;
