'use client';

import '@/app/globals.css';
import React, { useState, useRef } from 'react';
import { Settings, Info, X, RotateCcw, SkipForward, RefreshCw } from 'lucide-react';
import { usePomodoroContext } from '../../contexts/PomodoroContext';

const PomodoroTimer = () => {
  const {
    currentMode, setCurrentMode,
    timeLeft, setTimeLeft,
    isRunning, setIsRunning,
    currentInterval, setCurrentInterval,
    startTime, setStartTime,
    pomodoroTime, setPomodoroTime,
    shortBreakTime, setShortBreakTime,
    longBreakTime, setLongBreakTime,
    autoStartBreaks, setAutoStartBreaks,
    autoStartPomodoros, setAutoStartPomodoros,
    longBreakInterval, setLongBreakInterval,
    getModeTime,
    handleTimerComplete
  } = usePomodoroContext();

  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  // useRef untuk mencegah double execution
  const modeChangeRef = useRef(false);
  const startPauseRef = useRef(false);
  const skipResetRef = useRef(false);
  const resetIntervalRef = useRef(false);

  const modes = {
    pomodoro: { 
      name: 'Pomodoro', 
      time: pomodoroTime * 60, 
      bgColor: 'bg-red-500',
      textColor: 'text-red-500',
      buttonColor: 'bg-red-500 hover:bg-red-600'
    },
    shortBreak: { 
      name: 'Short Break', 
      time: shortBreakTime * 60, 
      bgColor: 'bg-green-500',
      textColor: 'text-green-500',
      buttonColor: 'bg-green-500 hover:bg-green-600'
    },
    longBreak: { 
      name: 'Long Break', 
      time: longBreakTime * 60, 
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-500',
      buttonColor: 'bg-blue-500 hover:bg-blue-600'
    }
  };

  // PERBAIKAN: HAPUS useEffect yang mereset timeLeft saat page load
  // Biarkan PomodoroContext mengelola semua state management
  // Context sudah handle localStorage restore dengan baik

  const handleModeChange = (mode) => {
    console.log('🎯 DEBUG: handleModeChange called with mode:', mode);
    
    // Prevent double execution
    if (modeChangeRef.current) {
      console.log('🎯 DEBUG: Preventing double execution of mode change');
      return;
    }

    if (mode !== currentMode) {
      console.log('🎯 DEBUG: Changing mode from', currentMode, 'to', mode);
      modeChangeRef.current = true;
      
      // HANYA reset timer jika user secara manual mengubah mode dan timer tidak sedang berjalan
      if (!isRunning) {
        setCurrentMode(mode);
        setTimeLeft(getModeTime(mode));
        setStartTime(null);
        console.log('🎯 DEBUG: Mode changed and timer reset because not running');
      } else {
        // Jika timer sedang berjalan, tanya user dulu atau langsung stop
        console.log('🎯 DEBUG: Timer is running, stopping before mode change');
        setIsRunning(false);
        setStartTime(null);
        setCurrentMode(mode);
        setTimeLeft(getModeTime(mode));
      }
      
      // Reset flag setelah operasi selesai
      setTimeout(() => {
        modeChangeRef.current = false;
      }, 100);
    }
  };

  const handleStartPause = () => {
    console.log('▶️ DEBUG: handleStartPause called');
    console.log('▶️ DEBUG: Current state - isRunning:', isRunning, 'timeLeft:', timeLeft, 'startTime:', startTime);
    
    // Prevent double execution
    if (startPauseRef.current) {
      console.log('▶️ DEBUG: Preventing double execution of start/pause');
      return;
    }

    startPauseRef.current = true;

    if (!isRunning) {
      // START: resume timer dari waktu saat ini
      const newStartTime = Date.now() - (getModeTime(currentMode) - timeLeft) * 1000;
      console.log('▶️ DEBUG: STARTING timer from timeLeft:', timeLeft);
      
      setStartTime(newStartTime);
      setIsRunning(true);
    } else {
      // PAUSE: hanya hentikan timer, jangan reset
      console.log('▶️ DEBUG: PAUSING timer at timeLeft:', timeLeft);
      setIsRunning(false);
      // TIDAK mengubah startTime atau timeLeft saat pause
    }

    // Reset flag setelah operasi selesai
    setTimeout(() => {
      startPauseRef.current = false;
    }, 100);
  };

  const handleSkipReset = () => {
    console.log('⏭️ DEBUG: handleSkipReset called, isRunning:', isRunning);
    
    // Prevent double execution
    if (skipResetRef.current) {
      console.log('⏭️ DEBUG: Preventing double execution of skip/reset');
      return;
    }

    skipResetRef.current = true;

    if (isRunning) {
      // Skip to next mode
      console.log('⏭️ DEBUG: Skipping to next mode');
      setIsRunning(false);
      setStartTime(null);
      handleTimerComplete();
    } else {
      // Reset current timer to full time
      console.log('⏭️ DEBUG: Resetting current timer to full time');
      setTimeLeft(getModeTime(currentMode));
      setStartTime(null);
    }

    // Reset flag setelah operasi selesai
    setTimeout(() => {
      skipResetRef.current = false;
    }, 100);
  };

  const handleResetInterval = () => {
    console.log('🔄 DEBUG: handleResetInterval called');
    
    // Prevent double execution
    if (resetIntervalRef.current) {
      console.log('🔄 DEBUG: Preventing double execution of reset interval');
      return;
    }

    resetIntervalRef.current = true;

    // Stop timer jika sedang berjalan
    setIsRunning(false);
    setStartTime(null);
    
    // Reset ke pomodoro mode
    setCurrentMode('pomodoro');
    setTimeLeft(getModeTime('pomodoro'));
    
    // Reset interval ke 1
    setCurrentInterval(1);

    console.log('🔄 DEBUG: Reset interval completed');

    // Reset flag setelah operasi selesai
    setTimeout(() => {
      resetIntervalRef.current = false;
    }, 100);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentModeConfig = modes[currentMode];

  return (
    <div id="pomodoro-page" className={`min-h-screen transition-colors duration-500  ${currentModeConfig.bgColor}`}>

      {/* Header */}
      <div className="flex justify-between items-center p-6 text-white">
        <h1 className="text-2xl font-bold">Pomodoro Timer</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-200 bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
          >
            <Settings size={20} />
            Settings
          </button>
          <button
            onClick={() => setShowAbout(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-200 bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
          >
            <Info size={20} />
            About
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] text-white">
        {/* Mode Tabs */}
        <div className="flex bg-cyan-200 bg-opacity-20 rounded-lg p-2 mb-12">
          {Object.entries(modes).map(([key, mode]) => (
            <button
              key={key}
              onClick={() => handleModeChange(key)}
              className={`px-6 py-3 rounded-md transition-colors ${
                currentMode === key 
                  ? 'bg-red-200 bg-opacity-30 font-semibold' 
                  : 'hover:bg-red-200 hover:bg-opacity-10'
              }`}
            >
              {mode.name}
            </button>
          ))}
        </div>

        {/* Interval Counter */}
        <div className="mb-4 text-xl font-medium opacity-80">
          Interval {currentInterval}/{longBreakInterval}
        </div>

        {/* Timer Display */}
        <div className="text-8xl font-bold mb-12 font-mono tracking-wider">
          {formatTime(timeLeft)}
        </div>

        {/* Controls */}
        <div className="flex gap-4">
          <button
            onClick={handleResetInterval}
            className="px-6 py-4 bg-cyan-200 bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors flex items-center gap-2"
            title="Reset Interval"
          >
            <RefreshCw size={20} />
          </button>
          
          <button
            onClick={handleStartPause}
            className="px-12 py-4 bg-cyan-200 text-xl font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
            style={{ color: currentModeConfig.bgColor.replace('bg-', '') }}
          >
            {isRunning ? 'PAUSE' : 'START'}
          </button>
          
          <button
            onClick={handleSkipReset}
            className="px-6 py-4 bg-cyan-200 bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
          >
            {isRunning ? <SkipForward size={24} /> : <RotateCcw size={24} />}
          </button>
        </div>

        {/* Auto Settings Indicator */}
        {(autoStartBreaks || autoStartPomodoros) && (
          <div className="mt-8 text-sm opacity-70 text-center">
            <div className="flex items-center gap-2 justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span>
                Auto {autoStartBreaks && autoStartPomodoros ? 'Start: All' : 
                      autoStartBreaks ? 'Start: Breaks' : 'Start: Pomodoros'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Time (minutes)</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Pomodoro</label>
                    <input
                      type="number"
                      value={pomodoroTime}
                      onChange={(e) => setPomodoroTime(parseInt(e.target.value) || 25)}
                      className="w-full p-2 border rounded-md"
                      min="1"
                      max="60"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Short Break</label>
                    <input
                      type="number"
                      value={shortBreakTime}
                      onChange={(e) => setShortBreakTime(parseInt(e.target.value) || 5)}
                      className="w-full p-2 border rounded-md"
                      min="1"
                      max="30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Long Break</label>
                    <input
                      type="number"
                      value={longBreakTime}
                      onChange={(e) => setLongBreakTime(parseInt(e.target.value) || 15)}
                      className="w-full p-2 border rounded-md"
                      min="1"
                      max="60"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Auto Start Breaks</span>
                  <button
                    onClick={() => setAutoStartBreaks(!autoStartBreaks)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      autoStartBreaks ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        autoStartBreaks ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Auto Start Pomodoros</span>
                  <button
                    onClick={() => setAutoStartPomodoros(!autoStartPomodoros)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      autoStartPomodoros ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        autoStartPomodoros ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Long Break Interval</span>
                  <input
                    type="number"
                    value={longBreakInterval}
                    onChange={(e) => setLongBreakInterval(parseInt(e.target.value) || 4)}
                    className="w-16 p-2 border rounded-md text-center"
                    min="2"
                    max="10"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">
                  <strong>Background Mode:</strong> Timer continues running even when you switch pages or tabs. 
                  Auto-start will work in background according to your settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">About</h2>
              <button
                onClick={() => setShowAbout(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="text-gray-700 space-y-4">
              <p>
                The Pomodoro Technique is a time management method that uses a timer to break work into intervals, 
                typically 25 minutes in length, separated by short breaks.
              </p>
              <p>
                <strong>How it works:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Work for 25 minutes (Pomodoro)</li>
                <li>Take a 5-minute short break</li>
                <li>Repeat 4 times, then take a 15-minute long break</li>
              </ul>
              <p>
                This technique helps improve focus and productivity by breaking work into manageable chunks 
                with regular breaks to rest and recharge.
              </p>
              <div className="border-t pt-3 mt-4">
                <p className="text-sm">
                  <strong>Features:</strong> Background timer, auto-start modes, sound notifications, 
                  and persistent state across page navigation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PomodoroTimer;