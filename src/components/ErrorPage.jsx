import React from 'react';
import { Link } from 'react-router';


const ErrorPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-white px-4">
      <h1 className="text-6xl font-extrabold text-red-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link to="/">
        <button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition">
          Go Back Home
        </button>
      </Link>
    </div>
  );
};

export default ErrorPage;
