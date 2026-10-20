import React, { useState, useEffect, useRef } from 'react';
import {
  Maximize2,
  Music,
  Volume2,
  VolumeX,
  Coffee,
  ChevronDown,
  Plus,
  Minus,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { Category } from '../types';

interface FocusDialProps {
  categories: Category[];
  selectedCategory: Category;
  onSelectCategory: (cat: Category) => void;
  sessionTitle: string;
  onUpdateTitle: (title: string) => void;
  onCompleteSession: (durationMinutes: number, title: string, category: Category) => void;
}

export const FocusDial: React.FC<FocusDialProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  sessionTitle,
  onUpdateTitle,
  onCompleteSession,
}) => {
  // Session duration in minutes (default 25)
  const [targetDurationMinutes, setTargetDurationMinutes] = useState(25);
  // Seconds left
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(sessionTitle);

  // Accurate timestamp math: save target end timestamp
  const targetEndTimeRef = useRef<number | null>(null);

  // Time interval display strings
  const [startTimeStr, setStartTimeStr] = useState('');
  const [endTimeStr, setEndTimeStr] = useState('');

  // Update start & end times based on target duration
  const updateIntervalDisplay = (minutes: number) => {
    const now = new Date();
    const end = new Date(now.getTime() + minutes * 60 * 1000);
    const formatTime = (d: Date) =>
      d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    setStartTimeStr(formatTime(now));
    setEndTimeStr(formatTime(end));
  };

  useEffect(() => {
    updateIntervalDisplay(targetDurationMinutes);
  }, [targetDurationMinutes]);

  // Audio completion chime using Web Audio API (no external asset required!)
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch {
      // AudioContext not allowed before user interaction
    }
  };

  // Timer loop with timestamp drift protection
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (isRunning) {
      if (!targetEndTimeRef.current) {
        targetEndTimeRef.current = Date.now() + secondsRemaining * 1000;
      }

      intervalId = setInterval(() => {
        if (!targetEndTimeRef.current) return;
        const now = Date.now();
        const diffSeconds = Math.round((targetEndTimeRef.current - now) / 1000);

        if (diffSeconds <= 0) {
          // Finished!
          setSecondsRemaining(0);
          setIsRunning(false);
          targetEndTimeRef.current = null;
          playChime();
          onCompleteSession(targetDurationMinutes, sessionTitle, selectedCategory);
        } else {
          setSecondsRemaining(diffSeconds);
        }
      }, 250);
    } else {
      targetEndTimeRef.current = null;
    }

    return () => clearInterval(intervalId);
  }, [isRunning, targetDurationMinutes, sessionTitle, selectedCategory]);

  const togglePlay = () => {
    if (!isRunning && secondsRemaining === 0) {
      // Reset if completed
      setSecondsRemaining(targetDurationMinutes * 60);
      targetEndTimeRef.current = Date.now() + targetDurationMinutes * 60 * 1000;
    }
    setIsRunning(!isRunning);
  };

  const adjustDuration = (deltaMinutes: number) => {
    const newMins = Math.max(5, Math.min(120, targetDurationMinutes + deltaMinutes));
    setTargetDurationMinutes(newMins);
    setSecondsRemaining(newMins * 60);
    setIsRunning(false);
    targetEndTimeRef.current = null;
    updateIntervalDisplay(newMins);
  };

  const toggleBreak = () => {
    setIsBreak(!isBreak);
    const breakMins = !isBreak ? 5 : 25;
    setTargetDurationMinutes(breakMins);
    setSecondsRemaining(breakMins * 60);
    setIsRunning(false);
    targetEndTimeRef.current = null;
    updateIntervalDisplay(breakMins);
  };

  // Format digital countdown: MM:SS
  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeDisplay = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  // Dial geometry calculations
  const totalSeconds = targetDurationMinutes * 60;
  const progressRatio = Math.max(0, Math.min(1, 1 - secondsRemaining / totalSeconds));
  
  // Angle for the needle: 0 to 360 deg
  // Clock top is 0 deg (or 12 o'clock = -90 in standard polar)
  const sweepAngleDeg = progressRatio * 360;

  // Generate 60 tick marks
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const angle = (i * 6) * (Math.PI / 180);
    const isMajor = i % 5 === 0;
    const r1 = isMajor ? 132 : 138;
    const r2 = 148;
    const x1 = 160 + r1 * Math.sin(angle);
    const y1 = 160 - r1 * Math.cos(angle);
    const x2 = 160 + r2 * Math.sin(angle);
    const y2 = 160 - r2 * Math.cos(angle);
    return { x1, y1, x2, y2, isMajor, i };
  });

  return (
    <div className="flex-1 flex flex-col justify-between items-center py-6 px-8 relative bg-white select-none">
      {/* Top Bar: Expand | Category Pill | Sound */}
      <div className="w-full flex items-center justify-between">
        <button
          className="p-2 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-50 transition"
          title="Toggle Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Category Pill Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-200 bg-white hover:border-zinc-300 text-xs font-medium text-zinc-700 shadow-sm transition"
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: selectedCategory.color }}
            />
            <span>{selectedCategory.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            <div className="w-3.5 h-3.5 rounded-full bg-zinc-800 text-white flex items-center justify-center text-[9px] font-bold">
              ?
            </div>
          </button>

          {showCategoryDropdown && (
            <div className="absolute top-9 left-1/2 -translate-x-1/2 w-48 bg-white border border-zinc-100 rounded-xl shadow-lg p-1.5 z-20">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat);
                    setShowCategoryDropdown(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition text-left"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2 rounded-lg transition ${
            soundEnabled
              ? 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'
              : 'text-zinc-300'
          }`}
          title="Toggle Ambient Sound"
        >
          <Music className="w-4 h-4" />
        </button>
      </div>

      {/* Session Title & Edit */}
      <div className="text-center my-4">
        {isEditingTitle ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onUpdateTitle(newTitle);
              setIsEditingTitle(false);
            }}
            className="flex items-center gap-2 justify-center"
          >
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="px-2 py-1 border border-zinc-300 rounded text-base font-semibold text-zinc-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
              autoFocus
              onBlur={() => {
                onUpdateTitle(newTitle);
                setIsEditingTitle(false);
              }}
            />
          </form>
        ) : (
          <div>
            <h1 className="text-lg font-bold text-zinc-900 tracking-tight flex items-center justify-center gap-1.5">
              {sessionTitle}
            </h1>
            <button
              onClick={() => setIsEditingTitle(true)}
              className="text-[11px] font-medium text-zinc-400 hover:text-zinc-600 mt-0.5 inline-flex items-center gap-1"
            >
              <span>Edit Session</span>
              <span className="w-3 h-3 rounded-full bg-zinc-800 text-white flex items-center justify-center text-[8px] font-bold">
                ?
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Circular Clock Dial */}
      <div className="relative flex flex-col items-center justify-center my-auto">
        <div className="relative w-80 h-80 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 320 320">
            {/* Background Circle */}
            <circle
              cx="160"
              cy="160"
              r="120"
              className="fill-zinc-50/50"
            />

            {/* Shaded Red Arc representing focus interval */}
            <circle
              cx="160"
              cy="160"
              r="60"
              fill="transparent"
              stroke="#ffe4e6"
              strokeWidth="120"
              strokeDasharray={`${2 * Math.PI * 60}`}
              strokeDashoffset={`${2 * Math.PI * 60 * (1 - targetDurationMinutes / 60)}`}
              strokeLinecap="butt"
              opacity="0.6"
            />

            {/* Dynamic Progress Arc */}
            {isRunning && (
              <circle
                cx="160"
                cy="160"
                r="60"
                fill="transparent"
                stroke="#f43f5e"
                strokeWidth="120"
                strokeDasharray={`${2 * Math.PI * 60}`}
                strokeDashoffset={`${2 * Math.PI * 60 * (1 - (targetDurationMinutes * progressRatio) / 60)}`}
                strokeLinecap="butt"
                opacity="0.85"
                className="transition-all duration-300"
              />
            )}

            {/* 60 Tick Marks */}
            <g className="text-zinc-300">
              {ticks.map((t) => (
                <line
                  key={t.i}
                  x1={t.x1}
                  y1={t.y1}
                  x2={t.x2}
                  y2={t.y2}
                  stroke="currentColor"
                  strokeWidth={t.isMajor ? 1.75 : 1}
                  strokeLinecap="round"
                  className={t.isMajor ? 'text-zinc-400' : 'text-zinc-200'}
                />
              ))}
            </g>

            {/* Sweep Hand / Needle */}
            <g
              transform={`rotate(${sweepAngleDeg} 160 160)`}
              className="transition-transform duration-200 ease-linear"
            >
              <line
                x1="160"
                y1="160"
                x2="160"
                y2="50"
                stroke="#e11d48"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              <circle cx="160" cy="50" r="3" fill="#e11d48" />
            </g>

            {/* Center Pivot Pin */}
            <circle
              cx="160"
              cy="160"
              r="14"
              className="fill-white stroke-zinc-200"
              strokeWidth="2"
              filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.08))"
            />
            <circle cx="160" cy="160" r="5" className="fill-rose-500" />
          </svg>

          {/* Quick Play/Pause Center Trigger */}
          <button
            onClick={togglePlay}
            className="absolute inset-0 m-auto w-12 h-12 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/5 hover:bg-black/10"
            title={isRunning ? 'Pause' : 'Start Focus'}
          >
            {isRunning ? (
              <Pause className="w-5 h-5 text-zinc-700" />
            ) : (
              <Play className="w-5 h-5 text-zinc-700 ml-0.5" />
            )}
          </button>
        </div>

        {/* Digital Countdown Display */}
        <div className="text-center mt-2">
          <div className="text-3xl font-semibold tracking-tight text-zinc-800 font-mono">
            {timeDisplay}
          </div>

          {/* Interval Bar: [-]  9:44 PM -> 10:09 PM ⌵ ?  [+] */}
          <div className="flex items-center justify-center gap-3 mt-3">
            <button
              onClick={() => adjustDuration(-5)}
              className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center transition"
              title="Subtract 5 minutes"
            >
              <Minus className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200 bg-white text-xs font-medium text-zinc-700 shadow-sm">
              <span>{startTimeStr} → {endTimeStr}</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
              <div className="w-3.5 h-3.5 rounded-full bg-zinc-800 text-white flex items-center justify-center text-[9px] font-bold">
                ?
              </div>
            </div>

            <button
              onClick={() => adjustDuration(5)}
              className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center transition"
              title="Add 5 minutes"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Floating Control Buttons */}
      <div className="w-full flex items-center justify-center gap-4 mt-6">
        {/* Sound toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="w-12 h-12 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-600 flex items-center justify-center shadow-sm transition active:scale-95"
          title={soundEnabled ? 'Mute Alert Sound' : 'Unmute Sound'}
        >
          {soundEnabled ? (
            <Volume2 className="w-5 h-5" />
          ) : (
            <VolumeX className="w-5 h-5" />
          )}
        </button>

        {/* Start / Pause or Coffee Break Button */}
        <button
          onClick={toggleBreak}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md transition active:scale-95 relative ${
            isBreak
              ? 'bg-amber-500 hover:bg-amber-600 text-white'
              : 'bg-rose-500 hover:bg-rose-600 text-white'
          }`}
          title={isBreak ? 'Return to Focus' : 'Take a Coffee Break'}
        >
          <Coffee className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-zinc-800 text-white text-[9px] font-bold flex items-center justify-center">
            ?
          </span>
        </button>

        {/* Reset / Options button */}
        <button
          onClick={() => {
            setSecondsRemaining(targetDurationMinutes * 60);
            setIsRunning(false);
            targetEndTimeRef.current = null;
          }}
          className="w-12 h-12 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-600 flex items-center justify-center shadow-sm transition active:scale-95"
          title="Reset Timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
