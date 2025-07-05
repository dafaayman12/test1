import React from 'react';

export default function TabButton({ label, isActive, onClick }) {
  return (
    <button
      className={`px-6 py-3 text-lg font-medium rounded-t-lg transition duration-200 ease-in-out ${isActive ? 'bg-gray-900 text-teal-400 border-b-2 border-teal-400' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
