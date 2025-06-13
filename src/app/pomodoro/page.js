"use client";

import "@/app/globals.css";
import React, { useState, useRef, useMemo } from "react";
import {
  Settings,
  Info,
  X,
  RotateCcw,
  SkipForward,
  RefreshCw,
} from "lucide-react";
import { usePomodoroContext } from "@/contexts/PomodoroContext";

const PomodoroTimer = () => {
  const {
    currentMode,
    setCurrentMode,
    timeLeft,
    setTimeLeft,
    isRunning,
    setIsRunning,
    currentInterval,
    setCurrentInterval,
    startTime,
    setStartTime,
    pomodoroTime,
    setPomodoroTime,
    shortBreakTime,
    setShortBreakTime,
    longBreakTime,
    setLongBreakTime,
    autoStartBreaks,
    setAutoStartBreaks,
    autoStartPomodoros,
    setAutoStartPomodoros,
    longBreakInterval,
    setLongBreakInterval,
    getModeTime,
    handleTimerComplete,
  } = usePomodoroContext();

  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  // useRef untuk mencegah double execution
  const modeChangeRef = useRef(false);
  const startPauseRef = useRef(false);
  const skipResetRef = useRef(false);
  const resetIntervalRef = useRef(false);

  // ✅ PERBAIKAN: Gunakan useMemo untuk membuat objek modes yang reaktif
  const modes = useMemo(
    () => ({
      pomodoro: {
        name: "Pomodoro",
        time: pomodoroTime * 60,
        bgColor: "bg-red-500",
        textColor: "text-red-500",
        buttonColor: "bg-red-500 hover:bg-red-600",
      },
      shortBreak: {
        name: "Short Break",
        time: shortBreakTime * 60,
        bgColor: "bg-green-500",
        textColor: "text-green-500",
        buttonColor: "bg-green-500 hover:bg-green-600",
      },
      longBreak: {
        name: "Long Break",
        time: longBreakTime * 60,
        bgColor: "bg-blue-500",
        textColor: "text-blue-500",
        buttonColor: "bg-blue-500 hover:bg-blue-600",
      },
    }),
    [pomodoroTime, shortBreakTime, longBreakTime]
  ); // Dependency array

  const handleModeChange = (mode) => {
    console.log("🎯 DEBUG: handleModeChange called with mode:", mode);

    // Prevent double execution
    if (modeChangeRef.current) {
      console.log("🎯 DEBUG: Preventing double execution of mode change");
      return;
    }

    if (mode !== currentMode) {
      console.log("🎯 DEBUG: Changing mode from", currentMode, "to", mode);
      modeChangeRef.current = true;

      // HANYA reset timer jika user secara manual mengubah mode dan timer tidak sedang berjalan
      if (!isRunning) {
        setCurrentMode(mode);
        setTimeLeft(getModeTime(mode));
        setStartTime(null);
        console.log(
          "🎯 DEBUG: Mode changed and timer reset because not running"
        );
      } else {
        // Jika timer sedang berjalan, tanya user dulu atau langsung stop
        console.log("🎯 DEBUG: Timer is running, stopping before mode change");
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
    console.log("▶️ DEBUG: handleStartPause called");
    console.log(
      "▶️ DEBUG: Current state - isRunning:",
      isRunning,
      "timeLeft:",
      timeLeft,
      "startTime:",
      startTime
    );

    // Prevent double execution
    if (startPauseRef.current) {
      console.log("▶️ DEBUG: Preventing double execution of start/pause");
      return;
    }

    startPauseRef.current = true;

    if (!isRunning) {
      // START: resume timer dari waktu saat ini
      const newStartTime =
        Date.now() - (getModeTime(currentMode) - timeLeft) * 1000;
      console.log("▶️ DEBUG: STARTING timer from timeLeft:", timeLeft);

      setStartTime(newStartTime);
      setIsRunning(true);
    } else {
      // PAUSE: hanya hentikan timer, jangan reset
      console.log("▶️ DEBUG: PAUSING timer at timeLeft:", timeLeft);
      setIsRunning(false);
      // TIDAK mengubah startTime atau timeLeft saat pause
    }

    // Reset flag setelah operasi selesai
    setTimeout(() => {
      startPauseRef.current = false;
    }, 100);
  };

  const handleSkipReset = () => {
    console.log("⏭️ DEBUG: handleSkipReset called, isRunning:", isRunning);

    // Prevent double execution
    if (skipResetRef.current) {
      console.log("⏭️ DEBUG: Preventing double execution of skip/reset");
      return;
    }

    skipResetRef.current = true;

    if (isRunning) {
      // Skip to next mode
      console.log("⏭️ DEBUG: Skipping to next mode");
      setIsRunning(false);
      setStartTime(null);
      handleTimerComplete();
    } else {
      // Reset current timer to full time
      console.log("⏭️ DEBUG: Resetting current timer to full time");
      setTimeLeft(getModeTime(currentMode));
      setStartTime(null);
    }

    // Reset flag setelah operasi selesai
    setTimeout(() => {
      skipResetRef.current = false;
    }, 100);
  };

  const handleResetInterval = () => {
    console.log("🔄 DEBUG: handleResetInterval called");

    // Prevent double execution
    if (resetIntervalRef.current) {
      console.log("🔄 DEBUG: Preventing double execution of reset interval");
      return;
    }

    resetIntervalRef.current = true;

    // Stop timer jika sedang berjalan
    setIsRunning(false);
    setStartTime(null);

    // Reset ke pomodoro mode
    setCurrentMode("pomodoro");
    setTimeLeft(getModeTime("pomodoro"));

    // Reset interval ke 1
    setCurrentInterval(1);

    console.log("🔄 DEBUG: Reset interval completed");

    // Reset flag setelah operasi selesai
    setTimeout(() => {
      resetIntervalRef.current = false;
    }, 100);
  };

  // ✅ TAMBAHAN: Handler untuk close settings dengan auto update
  const handleCloseSettings = () => {
    setShowSettings(false);

    // Jika timer tidak sedang berjalan, update timeLeft dengan nilai baru
    if (!isRunning) {
      console.log(
        "⚙️ Settings closed, updating timer display for current mode:",
        currentMode
      );
      setTimeLeft(getModeTime(currentMode));
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const currentModeConfig = modes[currentMode];

  return (
    <div
      id="pomodoro-page"
      className={`min-h-screen transition-colors duration-500 bg-gray-50 px-4 sm:px-6 lg:px-10`}
    >
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-center pt-6 sm:pt-7 gap-4 sm:gap-0">
        <h1 className="text-lg sm:text-2xl font-bold text-[#424D66] text-center sm:text-left">
          Hi, This is a <span className="text-[#24A1CA]">Pomodoro Timer</span>
        </h1>

        <div className="flex gap-3 sm:gap-4">
          <button
            onClick={() => setShowSettings(true)}
            className="text-gray-700 font-bold flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-t from-gray-200 to-white rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 cursor-pointer text-sm sm:text-base"
          >
            <Settings size={18} className="sm:w-5 sm:h-5" strokeWidth={2.5} />
            <span className="hidden sm:inline">Settings</span>
          </button>
          <button
            onClick={() => setShowAbout(true)}
            className="text-white font-bold flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 cursor-pointer text-sm sm:text-base"
          >
            <Info size={18} className="sm:w-5 sm:h-5" strokeWidth={2.5} />
            <span className="hidden sm:inline">About</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] sm:min-h-[calc(100vh-120px)]">
        {/* Mode Tabs - Responsive */}
        <div className="flex bg-white p-2 mb-5 w-full max-w-2xl justify-center rounded-full space-x-2 sm:space-x-6 lg:space-x-10">
          {Object.entries(modes).map(([key, mode]) => (
            <button
              key={key}
              onClick={() => handleModeChange(key)}
              className={`font-bold px-2 sm:px-4 py-2 rounded-md transition-all duration-300 text-xs sm:text-sm ${
                currentMode === key
                  ? "bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] text-white shadow-md transform scale-105"
                  : "text-gray-600 hover:bg-gradient-to-t hover:from-gray-100 hover:to-gray-50 hover:text-gray-800"
              }`}
            >
              <span className="sm:hidden">
                {mode.name === "Short Break" ? "Short" : mode.name === "Long Break" ? "Long" : mode.name}
              </span>
              <span className="hidden sm:inline">{mode.name}</span>
            </button>
          ))}
        </div>

        {/* Timer Display Box - Responsive */}
        <div className="relative mb-6 sm:mb-8 w-full max-w-2xl transition-all duration-500">
          <div
            className={`w-full h-40 sm:h-48 lg:h-56 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center shadow-2xl transition-colors duration-500 ${currentModeConfig.bgColor}`}
          >
            {/* Interval Counter */}
            <div className="text-xs sm:text-sm font-medium text-white mb-1 sm:mb-2">
              INTERVAL {currentInterval} | {longBreakInterval}
            </div>

            {/* Timer Text - Responsive font size */}
            <div className="text-6xl sm:text-7xl lg:text-9xl font-bold text-white font-mono tracking-wider drop-shadow-lg">
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {/* Controls - Responsive */}
        <div className="flex gap-3 sm:gap-6 items-center mb-6 sm:mb-0">
          <button
            onClick={handleResetInterval}
            className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-t from-gray-300 to-gray-200 text-gray-700 rounded-xl hover:from-gray-400 hover:to-gray-300 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2 font-medium"
            title="Reset Interval"
          >
            <RefreshCw size={18} className="sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={handleStartPause}
            className="px-8 sm:px-12 py-3 sm:py-4 text-lg sm:text-xl font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-white bg-gradient-to-t from-cyan-500 to-cyan-400 hover:from-cyan-600 hover:to-cyan-500"
          >
            {isRunning ? "PAUSE" : "START"}
          </button>

          <button
            onClick={handleSkipReset}
            className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-t from-gray-300 to-gray-200 text-gray-700 rounded-xl hover:from-gray-400 hover:to-gray-300 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2 font-medium"
          >
            {isRunning ? (
              <SkipForward size={20} className="sm:w-6 sm:h-6" />
            ) : (
              <RotateCcw size={20} className="sm:w-6 sm:h-6" />
            )}
          </button>
        </div>

        {/* Auto Settings Indicator - Responsive */}
        <div className="mt-4 sm:mt-8 bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-lg mx-4">
          <div className="flex items-center gap-2 sm:gap-3 justify-center text-gray-700">
            <div
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full animate-pulse ${
                !autoStartBreaks && !autoStartPomodoros
                  ? "bg-gray-400"
                  : currentMode === "pomodoro"
                  ? "bg-red-400"
                  : currentMode === "shortBreak"
                  ? "bg-green-400"
                  : "bg-blue-400"
              }`}
            />
            <span className="font-medium text-sm sm:text-base">
              Auto Start:{" "}
              {autoStartBreaks && autoStartPomodoros
                ? "All"
                : autoStartBreaks
                ? "Breaks"
                : autoStartPomodoros
                ? "Pomodoros"
                : "None"}
            </span>
          </div>
        </div>
      </div>

      {/* Settings Modal - Responsive */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 px-6 sm:px-8 py-4 sm:py-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Settings</h2>
                <button
                  onClick={handleCloseSettings}
                  className="text-white hover:bg-white/20 hover:bg-opacity-20 p-2 rounded-full transition-colors"
                >
                  <X size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-4 text-base sm:text-lg">
                  Time (minutes)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Pomodoro
                    </label>
                    <input
                      type="number"
                      value={pomodoroTime}
                      onChange={(e) =>
                        setPomodoroTime(parseInt(e.target.value) || 25)
                      }
                      className="w-full p-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                      min="1"
                      max="60"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Short Break
                    </label>
                    <input
                      type="number"
                      value={shortBreakTime}
                      onChange={(e) =>
                        setShortBreakTime(parseInt(e.target.value) || 5)
                      }
                      className="w-full p-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                      min="1"
                      max="30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Long Break
                    </label>
                    <input
                      type="number"
                      value={longBreakTime}
                      onChange={(e) =>
                        setLongBreakTime(parseInt(e.target.value) || 15)
                      }
                      className="w-full p-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                      min="1"
                      max="60"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-700 font-medium text-sm sm:text-base">
                    Auto Start Breaks
                  </span>
                  <button
                    onClick={() => setAutoStartBreaks(!autoStartBreaks)}
                    className={`w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-colors relative ${
                      autoStartBreaks
                        ? "bg-gradient-to-r from-green-500 to-green-400"
                        : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full shadow-md transition-transform absolute top-0.5 ${
                        autoStartBreaks ? "translate-x-6 sm:translate-x-7" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-700 font-medium text-sm sm:text-base">
                    Auto Start Pomodoros
                  </span>
                  <button
                    onClick={() => setAutoStartPomodoros(!autoStartPomodoros)}
                    className={`w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-colors relative ${
                      autoStartPomodoros
                        ? "bg-gradient-to-r from-green-500 to-green-400"
                        : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full shadow-md transition-transform absolute top-0.5 ${
                        autoStartPomodoros ? "translate-x-6 sm:translate-x-7" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-700 font-medium text-sm sm:text-base">
                    Long Break Interval
                  </span>
                  <input
                    type="number"
                    value={longBreakInterval}
                    onChange={(e) =>
                      setLongBreakInterval(parseInt(e.target.value) || 4)
                    }
                    className="w-16 sm:w-20 p-2 text-black border border-gray-300 rounded-lg text-center font-medium focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    min="2"
                    max="10"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <p className="text-sm text-blue-800">
                    <strong>Background Mode:</strong> Timer continues running
                    even when you switch pages or tabs. Auto-start will work in
                    background according to your settings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Modal - Responsive */}
      {showAbout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 px-6 sm:px-8 py-4 sm:py-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl font-bold text-white">About</h2>
                <button
                  onClick={() => setShowAbout(false)}
                  className="text-white hover:bg-white/20 hover:bg-opacity-20 p-2 rounded-full transition-colors"
                >
                  <X size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8 text-gray-700 space-y-4">
              <p className="leading-relaxed text-sm sm:text-base">
                The Pomodoro Technique is a time management method that uses a
                timer to break work into intervals, typically 25 minutes in
                length, separated by short breaks.
              </p>
              <div>
                <p className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                  How it works:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-gray-600 text-sm sm:text-base">
                  <li>Work for 25 minutes (Pomodoro)</li>
                  <li>Take a 5-minute short break</li>
                  <li>Repeat 4 times, then take a 15-minute long break</li>
                </ul>
              </div>
              <p className="leading-relaxed text-sm sm:text-base">
                This technique helps improve focus and productivity by breaking
                work into manageable chunks with regular breaks to rest and
                recharge.
              </p>
              <div className="border-t border-gray-200 pt-4 mt-6">
                <div className="bg-cyan-50 p-4 rounded-xl">
                  <p className="text-sm text-cyan-800">
                    <strong>Features:</strong> Background timer, auto-start
                    modes, sound notifications, and persistent state across page
                    navigation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PomodoroTimer;