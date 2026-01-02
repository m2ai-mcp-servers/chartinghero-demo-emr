import { useState, useEffect } from 'react';
import { formatSecondsAgo } from '../../utils/formatters';

export default function DataRefreshIndicator({ lastUpdate }) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (!lastUpdate) return;

    const updateText = () => {
      setDisplayText(formatSecondsAgo(lastUpdate));
    };

    updateText();
    const timer = setInterval(updateText, 1000);
    return () => clearInterval(timer);
  }, [lastUpdate]);

  if (!lastUpdate) return null;

  return (
    <div className="fixed bottom-20 right-4 bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg z-40">
      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-dot" />
      <span>Live</span>
      <span className="text-emerald-600">•</span>
      <span className="text-emerald-600">{displayText}</span>
    </div>
  );
}
