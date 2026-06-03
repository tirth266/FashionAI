import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-6xl font-bold text-gray-700">404</h1>
      <p className="text-xl text-gray-400 mt-4">Page not found</p>
      <Link to="/" className="mt-6 text-blue-500 hover:text-blue-400 hover:underline">
        Return to Dashboard
      </Link>
    </div>
  );
};
