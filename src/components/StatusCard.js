import React from 'react';

export default function StatusCard({ icon, label, value, color }) {
  return (
    <div className="bg-gray-900 rounded-lg p-4 flex flex-col items-center justify-center shadow-md">
      <div className={`text-3xl mb-2 ${color}`}>{icon}</div>
      <div className="text-xl font-bold text-gray-100">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}
