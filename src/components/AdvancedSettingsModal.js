import React from 'react';

export default function AdvancedSettingsModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-8 w-full max-w-md shadow-2xl relative">
        <h3 className="text-2xl font-bold text-teal-400 mb-6 text-center">Advanced Settings</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="proxy" className="block text-sm font-medium text-gray-300 mb-1">Proxy Settings</label>
            <input type="text" id="proxy" className="block w-full rounded-md border-gray-600 bg-gray-900 text-gray-200 p-2" placeholder="e.g., http://user:pass@proxy.com:8080" />
          </div>
          <div>
            <label htmlFor="headers" className="block text-sm font-medium text-gray-300 mb-1">Custom Headers</label>
            <textarea id="headers" rows="3" className="block w-full rounded-md border-gray-600 bg-gray-900 text-gray-200 p-2" placeholder="e.g., User-Agent: MyCustomAgent"></textarea>
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="apiToggle" className="text-sm font-medium text-gray-300">Enable API Mode</label>
            <input type="checkbox" id="apiToggle" className="h-4 w-4 text-blue-600 rounded border-gray-600 focus:ring-blue-500" />
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <button
            className="px-6 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-200 ease-in-out"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center">
          These settings are for demonstration purposes only and do not affect the simulated checking process.
        </p>
      </div>
    </div>
  );
}
