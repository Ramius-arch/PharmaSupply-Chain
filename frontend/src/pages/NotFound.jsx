import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-9xl font-bold text-slate-200">404</h1>
      <h2 className="text-3xl font-semibold mt-4 text-slate-800">Page Not Found</h2>
      <p className="text-slate-500 mt-2 max-w-md">
        Oops! The page you are looking for does not exist or has been moved to a new URL.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Go Back
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
