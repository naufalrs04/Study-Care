"use client";

import '@/app/globals.css';
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const PomodoroContext = createContext();

export const usePomodoroContext = () => {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error('usePomodoroContext must be used within PomodoroProvider');
  }
  return context;
};

export const PomodoroProvider = ({ children }) => {
  const [currentMode, setCurrentMode] = useState('pomodoro');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentInterval, setCurrentInterval] = useState(1);
  const [startTime, setStartTime] = useState(null);
  
  // Settings state
  const [pomodoroTime, setPomodoroTime] = useState(25);
  const [shortBreakTime, setShortBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);
  const [autoStartBreaks, setAutoStartBreaks] = useState(true);
  const [autoStartPomodoros, setAutoStartPomodoros] = useState(true);
  const [longBreakInterval, setLongBreakInterval] = useState(4);

  // Background timer reference
  const backgroundTimerRef = useRef(null);
  const audioRef = useRef(null);
  
  // useRef untuk mencegah double execution
  const isInitializedRef = useRef(false);
  const handleTimerCompleteRef = useRef(false);
  const timerCompletionTimeoutRef = useRef(null);

  // Get time for current mode
  const getModeTime = (mode) => {
    const times = {
      pomodoro: pomodoroTime * 60,
      shortBreak: shortBreakTime * 60,
      longBreak: longBreakTime * 60
    };
    return times[mode] || times.pomodoro;
  };

  // Play sound function
  const playSound = (soundType) => {
    if (typeof window !== 'undefined') {
      const soundPaths = {
        'pomodoro': '/sounds/pomodoro.mp3',
        'shortBreak': '/sounds/short-break.mp3',
        'longBreak': '/sounds/long-break.mp3'
      };
      
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      
      audioRef.current.src = soundPaths[soundType];
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  // Handle timer completion and auto-transition
  const handleTimerComplete = () => {
    // Prevent double execution
    if (handleTimerCompleteRef.current) {
      return;
    }
    handleTimerCompleteRef.current = true;

    // Clear timeout jika ada
    if (timerCompletionTimeoutRef.current) {
      clearTimeout(timerCompletionTimeoutRef.current);
    }

    setIsRunning(false);
    setStartTime(null);
    
    if (currentMode === 'pomodoro') {
      if (currentInterval % longBreakInterval === 0) {
        // Time for long break
        setCurrentMode('longBreak');
        setTimeLeft(getModeTime('longBreak'));
        playSound('longBreak');
        if (autoStartBreaks) {
          timerCompletionTimeoutRef.current = setTimeout(() => {
            setIsRunning(true);
            setStartTime(Date.now());
            handleTimerCompleteRef.current = false;
          }, 1000);
        } else {
          handleTimerCompleteRef.current = false;
        }
      } else {
        // Time for short break
        setCurrentMode('shortBreak');
        setTimeLeft(getModeTime('shortBreak'));
        playSound('shortBreak');
        if (autoStartBreaks) {
          timerCompletionTimeoutRef.current = setTimeout(() => {
            setIsRunning(true);
            setStartTime(Date.now());
            handleTimerCompleteRef.current = false;
          }, 1000);
        } else {
          handleTimerCompleteRef.current = false;
        }
      }
    } else {
      // Break finished, back to pomodoro
      if (currentMode === 'longBreak') {
        setCurrentInterval(1); // Reset interval after long break
      } else {
        setCurrentInterval(prev => prev + 1);
      }
      setCurrentMode('pomodoro');
      setTimeLeft(getModeTime('pomodoro'));
      playSound('pomodoro');
      if (autoStartPomodoros) {
        timerCompletionTimeoutRef.current = setTimeout(() => {
          setIsRunning(true);
          setStartTime(Date.now());
          handleTimerCompleteRef.current = false;
        }, 1000);
      } else {
        handleTimerCompleteRef.current = false;
      }
    }
  };

  // Background timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      backgroundTimerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            // Timer completed, handle transition
            handleTimerComplete();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (backgroundTimerRef.current) {
        clearInterval(backgroundTimerRef.current);
      }
    }

    return () => {
      if (backgroundTimerRef.current) {
        clearInterval(backgroundTimerRef.current);
      }
    };
  }, [isRunning, timeLeft, currentMode, currentInterval, longBreakInterval, autoStartBreaks, autoStartPomodoros]);

  // CRITICAL: Load state dari localStorage saat komponen mount
  useEffect(() => {
    // Prevent double execution pada mount
    if (isInitializedRef.current) {
      return;
    }

    console.log('🔄 CONTEXT: Initializing from localStorage...');

    if (typeof window !== 'undefined') {
      const savedState = JSON.parse(localStorage.getItem('pomodoroState') || '{}');
      
      if (Object.keys(savedState).length > 0) {
        console.log('🔄 CONTEXT: Found saved state:', savedState);
        
        // Restore all settings
        if (savedState.currentMode) setCurrentMode(savedState.currentMode);
        if (savedState.currentInterval) setCurrentInterval(savedState.currentInterval);
        if (savedState.pomodoroTime) setPomodoroTime(savedState.pomodoroTime);
        if (savedState.shortBreakTime) setShortBreakTime(savedState.shortBreakTime);
        if (savedState.longBreakTime) setLongBreakTime(savedState.longBreakTime);
        if (savedState.autoStartBreaks !== undefined) setAutoStartBreaks(savedState.autoStartBreaks);
        if (savedState.autoStartPomodoros !== undefined) setAutoStartPomodoros(savedState.autoStartPomodoros);
        if (savedState.longBreakInterval) setLongBreakInterval(savedState.longBreakInterval);
        
        // Restore timer state
        if (savedState.isRunning && savedState.startTime) {
          const elapsed = Math.floor((Date.now() - savedState.startTime) / 1000);
          const modeTime = getModeTimeFromSaved(savedState.currentMode, savedState);
          const remaining = modeTime - elapsed;
          
          if (remaining > 0) {
            console.log('🔄 CONTEXT: Restoring running timer, remaining:', remaining);
            setTimeLeft(remaining);
            setIsRunning(true);
            setStartTime(savedState.startTime);
          } else {
            console.log('🔄 CONTEXT: Timer expired, handling completion');
            setTimeLeft(0);
            setIsRunning(false);
            setTimeout(() => handleTimerComplete(), 100);
          }
        } else {
          console.log('🔄 CONTEXT: Restoring paused timer');
          const modeTime = getModeTimeFromSaved(savedState.currentMode, savedState);
          setTimeLeft(savedState.timeLeft || modeTime);
          setIsRunning(false);
        }
      } else {
        console.log('🔄 CONTEXT: No saved state, using defaults');
      }
      
      isInitializedRef.current = true;
    }
  }, []); // Empty dependency array - hanya run sekali saat mount

  // Helper function to get mode time from saved state
  const getModeTimeFromSaved = (mode, savedState) => {
    const times = {
      pomodoro: (savedState.pomodoroTime || 25) * 60,
      shortBreak: (savedState.shortBreakTime || 5) * 60,
      longBreak: (savedState.longBreakTime || 15) * 60
    };
    return times[mode] || times.pomodoro;
  };

  // CRITICAL: Save state ke localStorage setiap kali ada perubahan
  useEffect(() => {
    // Skip save pada initial mount
    if (!isInitializedRef.current) {
      return;
    }

    if (typeof window !== 'undefined') {
      const stateToSave = {
        currentMode,
        timeLeft,
        isRunning,
        currentInterval,
        startTime,
        pomodoroTime,
        shortBreakTime,
        longBreakTime,
        autoStartBreaks,
        autoStartPomodoros,
        longBreakInterval,
        lastSaved: Date.now()
      };
      
      console.log('💾 CONTEXT: Saving state to localStorage:', stateToSave);
      localStorage.setItem('pomodoroState', JSON.stringify(stateToSave));
    }
  }, [currentMode, timeLeft, isRunning, currentInterval, startTime, pomodoroTime, shortBreakTime, longBreakTime, autoStartBreaks, autoStartPomodoros, longBreakInterval]);

  // Sync with background when page becomes visible
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleVisibilityChange = () => {
        if (!document.hidden && isRunning && startTime) {
          console.log('👁️ CONTEXT: Page visible, syncing timer...');
          // Recalculate time when page becomes visible
          const elapsed = Math.floor((Date.now() - startTime) / 1000);
          const modeTime = getModeTime(currentMode);
          const remaining = modeTime - elapsed;
          
          if (remaining > 0) {
            console.log('👁️ CONTEXT: Synced time remaining:', remaining);
            setTimeLeft(remaining);
          } else {
            console.log('👁️ CONTEXT: Timer expired while away');
            setTimeLeft(0);
            handleTimerCompleteRef.current = false;
            handleTimerComplete();
          }
        }
      };

      const handleBeforeUnload = () => {
        console.log('🚪 CONTEXT: Page unloading, saving final state...');
        // Force save before page unload
        if (isInitializedRef.current) {
          const stateToSave = {
            currentMode,
            timeLeft,
            isRunning,
            currentInterval,
            startTime,
            pomodoroTime,
            shortBreakTime,
            longBreakTime,
            autoStartBreaks,
            autoStartPomodoros,
            longBreakInterval,
            lastSaved: Date.now()
          };
          localStorage.setItem('pomodoroState', JSON.stringify(stateToSave));
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [isRunning, startTime, currentMode, timeLeft, currentInterval, pomodoroTime, shortBreakTime, longBreakTime, autoStartBreaks, autoStartPomodoros, longBreakInterval]);

  // Cleanup function
  useEffect(() => {
    return () => {
      if (backgroundTimerRef.current) {
        clearInterval(backgroundTimerRef.current);
      }
      if (timerCompletionTimeoutRef.current) {
        clearTimeout(timerCompletionTimeoutRef.current);
      }
    };
  }, []);

  const contextValue = {
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
    playSound,
    handleTimerComplete: () => {
      handleTimerCompleteRef.current = false;
      handleTimerComplete();
    }
  };

  return (
    <PomodoroContext.Provider value={contextValue}>
      {children}
    </PomodoroContext.Provider>
  );
};