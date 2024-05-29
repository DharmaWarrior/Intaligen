import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Mastercard ({ name, imageSrc, route })  {
  
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate(route); // use the route prop for navigation
  };

  return (
    <div className="ml-14 mb-12 flex flex-col items-center px-10 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 w-60 h-auto p-5">
        <h5 className="mt-2 mb-2 text-2xl font-medium font-sans text-center text-gray-900 dark:text-white">{name}</h5>
        <img className="h-[50%] mb-2" src={imageSrc} alt="Bonnie image" />
        <button 
            onClick={handleViewClick}
            className="mt-1 font-sans btn bg-gradient-to-r from-purple-400 to-teal-600 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full"
        >
            View
        </button>
    </div>
  );
}

