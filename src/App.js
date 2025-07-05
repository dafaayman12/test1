import React, { useState, useEffect, useRef } from 'react';
import useLogs from "./hooks/useLogs";
import StatusCard from "./components/StatusCard";
import TabButton from "./components/TabButton";
import AdvancedSettingsModal from "./components/AdvancedSettingsModal";


export default function App() {
  // Configuration
  const [comboFilePath, setComboFilePath] = useState('');
  const [outputDirectory, setOutputDirectory] = useState('results');
  const [threads, setThreads] = useState(10);
  const [maxRetries, setMaxRetries] = useState(1);
  const [retryDelay, setRetryDelay] = useState(1.0);
  const [timeout, setTimeoutVal] = useState(15);

  // Dashboard state
  const [checkedCount, setCheckedCount] = useState(0);
  const [validCount, setValidCount] = useState(0);
  const [invalidCount, setInvalidCount] = useState(0);
  const [steamGuardCount, setSteamGuardCount] = useState(0);
  const [cpuUsage, setCpuUsage] = useState(13);
  const [ramUsage, setRamUsage] = useState(83);

  const { logEntries, addLogEntry, clearLog, copyLog } = useLogs();
  const [resultsData, setResultsData] = useState([]);
  const [activeTab, setActiveTab] = useState('log');
  const [isChecking, setIsChecking] = useState(false);
  const [showAdvancedSettingsModal, setShowAdvancedSettingsModal] = useState(false);

  const checkingIntervalRef = useRef(null);
  const logContainerRef = useRef(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logEntries]);

  const handleStartChecking = () => {
    if (isChecking) {
      clearInterval(checkingIntervalRef.current);
      setIsChecking(false);
      addLogEntry('Checking process stopped.', 'warning');
      return;
    }

    setIsChecking(true);
    setCheckedCount(0);
    setValidCount(0);
    setInvalidCount(0);
    setSteamGuardCount(0);
    clearLog();
    setResultsData([]);
    addLogEntry('Starting simulated checking process...', 'info');

    let simulatedTotalChecks = 0;
    const maxSimulatedChecks = 100;

    checkingIntervalRef.current = setInterval(() => {
      if (simulatedTotalChecks >= maxSimulatedChecks) {
        clearInterval(checkingIntervalRef.current);
        setIsChecking(false);
        addLogEntry('Simulated checking completed!', 'success');
        setCpuUsage(prev => Math.max(10, prev - 5));
        setRamUsage(prev => Math.max(20, prev - 10));
        return;
      }

      simulatedTotalChecks++;
      setCheckedCount(prev => prev + 1);
      setCpuUsage(prev => Math.min(95, prev + Math.floor(Math.random() * 5)));
      setRamUsage(prev => Math.min(98, prev + Math.floor(Math.random() * 3)));

      const outcome = Math.random();
      if (outcome < 0.6) {
        setValidCount(prev => prev + 1);
        addLogEntry(`[${simulatedTotalChecks}] Account checked: Valid!`, 'success');
      } else if (outcome < 0.8) {
        setInvalidCount(prev => prev + 1);
        addLogEntry(`[${simulatedTotalChecks}] Account checked: Invalid.`, 'error');
      } else {
        setSteamGuardCount(prev => prev + 1);
        addLogEntry(`[${simulatedTotalChecks}] Account checked: Steam Guard detected.`, 'warning');
      }
    }, 500);
  };

  useEffect(() => () => {
    if (checkingIntervalRef.current) clearInterval(checkingIntervalRef.current);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-inter p-4 flex items-center justify-center">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-6xl flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
        {/* Left Panel */}
        <div className="lg:w-1/3 p-4 bg-gray-700 rounded-lg shadow-inner">
          <h2 className="text-2xl font-bold text-teal-400 mb-6 text-center">Configuration Settings</h2>

          {/* Combo File */}
          <div className="mb-4">
            <label htmlFor="comboFile" className="block text-sm font-medium text-gray-300 mb-1">Combo File</label>
            <div className="flex rounded-md shadow-sm">
              <input
                type="text"
                id="comboFile"
                className="flex-1 block w-full rounded-l-md border-gray-600 bg-gray-900 text-gray-200 p-2 focus:ring-blue-500 focus:border-blue-500"
                value={comboFilePath}
                onChange={e => setComboFilePath(e.target.value)}
                placeholder="e.g., C:\\Users\\User\\Desktop\\combos.txt"
              />
              <button
                className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-600 rounded-r-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                onClick={() => alert('File browsing is simulated. Please enter a path manually.')}
              >
                Browse
              </button>
            </div>
          </div>

          {/* Output Directory */}
          <div className="mb-4">
            <label htmlFor="outputDir" className="block text-sm font-medium text-gray-300 mb-1">Output Directory</label>
            <div className="flex rounded-md shadow-sm">
              <input
                type="text"
                id="outputDir"
                className="flex-1 block w-full rounded-l-md border-gray-600 bg-gray-900 text-gray-200 p-2 focus:ring-blue-500 focus:border-blue-500"
                value={outputDirectory}
                onChange={e => setOutputDirectory(e.target.value)}
              />
              <button
                className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-600 rounded-r-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                onClick={() => alert("Directory browsing is simulated. Path will be 'results'.")}
              >
                Browse
              </button>
            </div>
          </div>

          {/* Threads Slider */}
          <div className="mb-4">
            <label htmlFor="threads" className="block text-sm font-medium text-gray-300 mb-1">
              Threads: <span className="text-blue-400">{threads}</span>
            </label>
            <input
              type="range"
              id="threads"
              min="1"
              max="50"
              value={threads}
              onChange={e => setThreads(Number(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Max Retries */}
          <div className="mb-4">
            <label htmlFor="maxRetries" className="block text-sm font-medium text-gray-300 mb-1">Max Retries</label>
            <input
              type="number"
              id="maxRetries"
              min="1"
              max="5"
              value={maxRetries}
              onChange={e => setMaxRetries(Number(e.target.value))}
              className="block w-full rounded-md border-gray-600 bg-gray-900 text-gray-200 p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Retry Delay */}
          <div className="mb-4">
            <label htmlFor="retryDelay" className="block text-sm font-medium text-gray-300 mb-1">Retry Delay (s)</label>
            <input
              type="number"
              id="retryDelay"
              step="0.1"
              value={retryDelay}
              onChange={e => setRetryDelay(Number(e.target.value))}
              className="block w-full rounded-md border-gray-600 bg-gray-900 text-gray-200 p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Timeout */}
          <div className="mb-6">
            <label htmlFor="timeout" className="block text-sm font-medium text-gray-300 mb-1">Timeout (s)</label>
            <input
              type="number"
              id="timeout"
              value={timeout}
              onChange={e => setTimeoutVal(Number(e.target.value))}
              className="block w-full rounded-md border-gray-600 bg-gray-900 text-gray-200 p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col space-y-3">
            <button
              className={`flex items-center justify-center px-4 py-2 rounded-md font-semibold text-white transition duration-200 ease-in-out ${isChecking ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
              onClick={handleStartChecking}
            >
              {isChecking ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Stop Checking
                </>
              ) : (
                'Start Checking'
              )}
            </button>
            <button
              className="px-4 py-2 rounded-md bg-gray-600 text-white font-semibold hover:bg-gray-700 transition duration-200 ease-in-out"
              onClick={clearLog}
            >
              Clear Log
            </button>
            <button
              className="px-4 py-2 rounded-md bg-gray-600 text-white font-semibold hover:bg-gray-700 transition duration-200 ease-in-out"
              onClick={copyLog}
            >
              Copy Log
            </button>
            <button
              className="px-4 py-2 rounded-md bg-gray-600 text-white font-semibold hover:bg-gray-700 transition duration-200 ease-in-out"
              onClick={() => setShowAdvancedSettingsModal(true)}
            >
              Advanced Settings
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="lg:w-2/3 p-4 bg-gray-700 rounded-lg shadow-inner flex flex-col">
          <h2 className="text-2xl font-bold text-teal-400 mb-6 text-center">Real-Time Dashboard</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <StatusCard icon="✅" label="Valid Accounts" value={validCount} color="text-green-400" />
            <StatusCard icon="❌" label="Invalid Accounts" value={invalidCount} color="text-red-400" />
            <StatusCard icon="🔒" label="Steam Guard Accounts" value={steamGuardCount} color="text-yellow-400" />
            <StatusCard icon="📊" label="Checked" value={checkedCount} color="text-blue-400" />
            <StatusCard icon="🧠" label="CPU" value={`${cpuUsage}%`} color="text-purple-400" />
            <StatusCard icon="🔧" label="RAM" value={`${ramUsage}%`} color="text-pink-400" />
          </div>

          <div className="flex border-b border-gray-600 mb-4">
            <TabButton label="Log" isActive={activeTab === 'log'} onClick={() => setActiveTab('log')} />
            <TabButton label="Results" isActive={activeTab === 'results'} onClick={() => setActiveTab('results')} />
            <TabButton label="About" isActive={activeTab === 'about'} onClick={() => setActiveTab('about')} />
          </div>

          <div className="flex-1 bg-gray-900 rounded-lg p-4 overflow-hidden">
            {activeTab === 'log' && (
              <div ref={logContainerRef} className="h-full overflow-y-auto text-sm text-gray-300 custom-scrollbar">
                {logEntries.map((entry, index) => (
                  <div key={index} className={`mb-1 ${entry.type === 'info' ? 'text-gray-400' : entry.type === 'success' ? 'text-green-400' : entry.type === 'error' ? 'text-red-400' : 'text-yellow-400'}`}> 
                    <span className="font-mono text-gray-500 mr-2">[{entry.timestamp}]</span>
                    {entry.message}
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'results' && (
              <div className="h-full overflow-y-auto text-sm text-gray-300 custom-scrollbar">
                <p className="text-center text-gray-400">
                  This section would display a filterable table of results. <br />
                  (Functionality is simulated for educational purposes.)
                </p>
                {resultsData.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-700 mt-4">
                    <thead className="bg-gray-800">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider rounded-tl-md">Account</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider rounded-tr-md">Details</th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-900 divide-y divide-gray-700">
                      {resultsData.map((result, idx) => (
                        <tr key={idx}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{result.account}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{result.status}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{result.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center text-gray-500 mt-8">No results yet. Start checking!</p>
                )}
              </div>
            )}
            {activeTab === 'about' && (
              <div className="h-full overflow-y-auto text-gray-300 custom-scrollbar">
                <h3 className="text-xl font-semibold text-teal-400 mb-2">About This Application</h3>
                <p className="mb-4">
                  This "Steam Account Checker" is a <strong>simulated application created purely for educational and personal use</strong>. It demonstrates UI/UX design, real-time dashboard updates and basic application flow.
                </p>
                <p className="mb-4 font-bold text-red-400">
                  <span className="text-xl mr-1">⚠️</span> <strong>Important Disclaimer:</strong>
                  This tool does <strong>NOT</strong> connect to any real external services (like Steam) and does <strong>NOT</strong> perform actual account checks. All checking processes and statistics displayed are entirely simulated.
                </p>
                <p className="mb-4">
                  <strong>It is strictly intended for learning and demonstration purposes.</strong> Using tools that perform unauthorized access to online accounts (e.g., credential stuffing) is illegal and unethical. Always respect terms of service and privacy.
                </p>
                <p className="mb-2"><strong>Version:</strong> 1.0.0 (Educational Demo)</p>
                <p className="mb-2"><strong>Developer Credits:</strong> Gemini AI</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAdvancedSettingsModal && (
        <AdvancedSettingsModal onClose={() => setShowAdvancedSettingsModal(false)} />
      )}

      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          .font-inter { font-family: 'Inter', sans-serif; }
          .custom-scrollbar::-webkit-scrollbar { width: 8px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: #374151; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #4B5563; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #6B7280; }
        `}
      </style>
    </div>
  );
}

