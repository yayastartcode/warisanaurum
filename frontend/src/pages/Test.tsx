import React from 'react';

const Test: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Test Page</h1>
        <p className="text-gray-600">This is a test to verify Tailwind CSS is working.</p>
        <div className="mt-4 p-4 bg-blue-100 rounded-lg">
          <p className="text-blue-800">If you can see this styled content, Tailwind CSS is working!</p>
        </div>
      </div>
    </div>
  );
};

export default Test;