import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

export default function Timer({ initialSeconds, onExpire }) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (onExpire) onExpire();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (onExpire) onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, onExpire]);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const formattedTime = [
    hours > 0 ? String(hours).padStart(2, '0') : null,
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0'),
  ]
    .filter(Boolean)
    .join(':');

  const isCritical = secondsLeft <= 120; // under 2 mins
  const isWarning = secondsLeft <= 300 && !isCritical; // under 5 mins

  return (
    <div
      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono font-bold text-sm tracking-wider shadow-sm transition-all ${
        isCritical
          ? 'bg-rose-500 text-white animate-pulse'
          : isWarning
          ? 'bg-amber-100 text-amber-800 border border-amber-300'
          : 'bg-slate-800 text-emerald-400'
      }`}
    >
      {isCritical ? (
        <AlertTriangle className="w-4 h-4 text-white" />
      ) : (
        <Clock className={`w-4 h-4 ${isWarning ? 'text-amber-700' : 'text-emerald-400'}`} />
      )}
      <span>{formattedTime}</span>
    </div>
  );
}
