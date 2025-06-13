'use client';

import '@/app/globals.css';
import React from 'react';
import Link from 'next/link';
import { usePomodoroContext } from '@/contexts/PomodoroContext';

const MiniTimer = () => {
  const { timeLeft, currentMode, isRunning } = usePomodoroContext();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const modeColors = {
    pomodoro: 'bg-red-500 text-white',
    shortBreak: 'bg-green-500 text-white',
    longBreak: 'bg-blue-500 text-white'
  };

  const modeNames = {
    pomodoro: 'Pomodoro',
    shortBreak: 'Short Break',
    longBreak: 'Long Break'
  };

  return (
    <Link href="/pomodoro">
      <div className={`fixed bottom-4 left-4 z-50 shadow-lg rounded-lg p-3 cursor-pointer hover:shadow-xl transition-shadow ${modeColors[currentMode]}`}>
        <div className="text-xs font-semibold opacity-90">{modeNames[currentMode]}</div>
        <div className="text-lg font-mono font-bold">{formatTime(timeLeft)}</div>
        <div className="flex items-center gap-2 mt-1">
          <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-white animate-pulse' : 'bg-white opacity-50'}`} />
          <span className="text-xs opacity-80">{isRunning ? 'Running' : 'Paused'}</span>
        </div>
      </div>
    </Link>
  );
};

export default MiniTimer;