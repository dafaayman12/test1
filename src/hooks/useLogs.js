import { useState, useCallback } from 'react';

export default function useLogs() {
  const [logEntries, setLogEntries] = useState([]);

  const addLogEntry = useCallback((message, type = 'info') => {
    setLogEntries(prev => [
      ...prev,
      { message, type, timestamp: new Date().toLocaleTimeString() }
    ]);
  }, []);

  const clearLog = useCallback(() => setLogEntries([]), []);

  const copyLog = useCallback(() => {
    const text = logEntries
      .map(e => `[${e.timestamp}] [${e.type.toUpperCase()}] ${e.message}`)
      .join('\n');
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => addLogEntry('Log copied to clipboard!', 'info'))
        .catch(() => addLogEntry('Failed to copy log.', 'error'));
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        addLogEntry('Log copied to clipboard!', 'info');
      } catch {
        addLogEntry('Failed to copy log.', 'error');
      }
      document.body.removeChild(textarea);
    }
  }, [logEntries, addLogEntry]);

  return { logEntries, addLogEntry, clearLog, copyLog };
}
