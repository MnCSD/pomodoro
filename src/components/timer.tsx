"use client";

import { useState, useEffect, useMemo } from "react";
import { Play, Pause, RotateCcw, Sun, Moon, TimerIcon } from "lucide-react";
import { cn } from "../lib/utils";

const POMODORO_QUOTES = [
  "Focus on progress, not perfection 🎯",
  "Small steps, big achievements 🌟",
  "Your future self will thank you 💫",
  "Stay focused, stay brilliant ✨",
  "Every minute counts towards success 📚",
  "Learning is a superpower 🦸‍♂️",
  "Break it down, build it up 🏗️",
  "Your potential is limitless 🚀",
];

type TimerMode = "work" | "break";

export const PomodoroTimer = () => {
  const [workTimeLeft, setWorkTimeLeft] = useState(25 * 60);
  const [breakTimeLeft, setBreakTimeLeft] = useState(5 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputMinutes, setInputMinutes] = useState("25");
  const [showQuote, setShowQuote] = useState(false);
  const [currentQuote, setCurrentQuote] = useState("");
  const [mode, setMode] = useState<TimerMode>("work");
  const [breakLength] = useState(5);

  const timeLeft = mode === "work" ? workTimeLeft : breakTimeLeft;

  const progress = useMemo(() => {
    if (mode === "work") {
      return (workTimeLeft / (parseInt(inputMinutes) * 60)) * 100;
    } else {
      return (breakTimeLeft / (breakLength * 60)) * 100;
    }
  }, [workTimeLeft, breakTimeLeft, inputMinutes, breakLength, mode]);

  const progressColors = useMemo(() => {
    if (mode === "break") {
      return {
        primary: "rgb(147, 51, 234)",
        secondary: "rgb(126, 34, 206)",
        glow: "rgba(147, 51, 234, 0.4)",
      };
    }

    if (progress > 66) {
      return {
        primary: "rgb(74, 222, 128)",
        secondary: "rgb(34, 197, 94)",
        glow: "rgba(74, 222, 128, 0.5)",
      };
    }
    if (progress > 33) {
      return {
        primary: "rgb(250, 204, 21)",
        secondary: "rgb(234, 179, 8)",
        glow: "rgba(250, 204, 21, 0.5)",
      };
    }
    return {
      primary: "rgb(248, 113, 113)",
      secondary: "rgb(239, 68, 68)",
      glow: "rgba(248, 113, 113, 0.5)",
    };
  }, [progress, mode]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        if (mode === "work") {
          setWorkTimeLeft((time) => {
            if (time <= 1) {
              setIsRunning(false);
              setMode("break");
              return time;
            }
            return time - 1;
          });
        } else {
          setBreakTimeLeft((time) => {
            if (time <= 1) {
              setIsRunning(false);
              setMode("work");
              return time;
            }
            return time - 1;
          });
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    if (mode === "work") {
      setWorkTimeLeft(parseInt(inputMinutes) * 60);
    } else {
      setBreakTimeLeft(breakLength * 60);
    }
  };

  const toggleMode = () => {
    setIsRunning(false);
    setMode(mode === "work" ? "break" : "work");
  };

  const handleTimeInput = (value: string) => {
    const numValue = value.replace(/[^0-9]/g, "");
    if (numValue === "" || parseInt(numValue) <= 60) {
      setInputMinutes(numValue);
      if (numValue !== "") {
        setWorkTimeLeft(parseInt(numValue) * 60);
      }
    }
  };

  const showMotivationalQuote = () => {
    const randomQuote =
      POMODORO_QUOTES[Math.floor(Math.random() * POMODORO_QUOTES.length)];
    setCurrentQuote(randomQuote);
    setShowQuote(true);
    setTimeout(() => setShowQuote(false), 3000);
  };

  const circumference = 2 * Math.PI * 70;

  return (
    <div className="absolute top-8 right-8 animate-fade-in">
      <div
        className={cn(
          "bg-black/30 backdrop-blur-xl rounded-3xl p-8",
          "border border-white/20 shadow-2xl",
          "transition-all duration-500",
          "hover:scale-102 hover:bg-black/40",
          isRunning ? "ring-2 ring-white/30" : ""
        )}
        style={{
          boxShadow: `0 0 60px -15px ${progressColors.glow}`,
        }}
      >
        <div className="relative">
          <div className="flex gap-3 absolute -top-12 left-1/2 -translate-x-1/2">
            <button
              onClick={showMotivationalQuote}
              className="bg-black/30 p-3 rounded-2xl border border-white/10 cursor-pointer hover:bg-black/40 transition-all duration-300 hover:scale-105"
              style={{
                transition: "transform 0.3s ease, opacity 0.3s ease",
                transform: `translateY(${isRunning ? "0" : "-5px"})`,
                opacity: isRunning ? 0.5 : 1,
              }}
            >
              <TimerIcon className="w-8 h-8 text-white" />
            </button>
            <button
              onClick={toggleMode}
              className="bg-black/30 p-3 rounded-2xl border border-white/10 cursor-pointer hover:bg-black/40 transition-all duration-300 hover:scale-105"
              style={{
                transition: "transform 0.3s ease, opacity 0.3s ease",
                transform: `translateY(${isRunning ? "0" : "-5px"})`,
                opacity: isRunning ? 0.5 : 1,
              }}
            >
              {mode === "work" ? (
                <Sun className="w-8 h-8 text-white" />
              ) : (
                <Moon className="w-8 h-8 text-white" />
              )}
            </button>
          </div>

          <div className="relative w-40 h-40 mb-6">
            <svg className="absolute w-full h-full transform -rotate-90">
              <defs>
                <linearGradient
                  id="progressGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    stopColor={progressColors.primary}
                    stopOpacity="0.3"
                  />
                  <stop
                    offset="100%"
                    stopColor={progressColors.secondary}
                    stopOpacity="0.1"
                  />
                </linearGradient>
              </defs>
              <circle
                cx="80"
                cy="80"
                r="74"
                className="stroke-white/5"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="80"
                cy="80"
                r="66"
                className="stroke-white/3"
                strokeWidth="4"
                fill="none"
              />
            </svg>

            <svg className="absolute w-full h-full transform -rotate-90">
              <defs>
                <linearGradient
                  id="strokeGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor={progressColors.primary} />
                  <stop offset="100%" stopColor={progressColors.secondary} />
                </linearGradient>
              </defs>
              {!isEditing && (
                <>
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="url(#progressGradient)"
                    strokeWidth="12"
                    fill="none"
                    className="transition-all duration-300 blur-sm"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - progress / 100)}
                    style={{
                      transition:
                        "stroke-dashoffset 0.5s ease-out, stroke 1s ease",
                    }}
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="url(#strokeGradient)"
                    strokeWidth="8"
                    fill="none"
                    className="transition-all duration-300"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - progress / 100)}
                    style={{
                      transition:
                        "stroke-dashoffset 0.5s ease-out, stroke 1s ease",
                      filter: "drop-shadow(0 0 8px rgba(255,255,255,0.3))",
                    }}
                  />
                </>
              )}
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputMinutes}
                    onChange={(e) => handleTimeInput(e.target.value)}
                    onBlur={() => {
                      if (inputMinutes === "") setInputMinutes("25");
                      setIsEditing(false);
                      resetTimer();
                    }}
                    className="w-16 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-2xl font-mono text-center focus:outline-none focus:ring-2 focus:ring-white/30"
                    style={{ color: progressColors.primary }}
                    autoFocus
                  />
                  <span
                    className="text-2xl font-mono"
                    style={{ color: progressColors.primary }}
                  >
                    min
                  </span>
                </div>
              ) : (
                <div
                  className="cursor-pointer group"
                  onClick={() => {
                    if (!isRunning) setIsEditing(true);
                  }}
                >
                  <span
                    className="text-[40px] font-bold tracking-tight mb-1 font-mono group-hover:opacity-80"
                    style={{
                      color: progressColors.primary,
                      textShadow: `0 0 20px ${progressColors.glow}`,
                    }}
                  >
                    {String(minutes).padStart(2, "0")}:
                    {String(seconds).padStart(2, "0")}
                  </span>
                  {!isRunning && mode === "work" && (
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white/50 whitespace-nowrap">
                      Click to edit
                    </div>
                  )}
                </div>
              )}
              {!isEditing && (
                <span
                  className="text-sm font-medium tracking-wider uppercase"
                  style={{ color: progressColors.primary }}
                >
                  {mode === "break"
                    ? "Take a Break!"
                    : progress > 66
                    ? "Keep Going!"
                    : progress > 33
                    ? "Halfway There!"
                    : "Almost Done!"}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={toggleTimer}
              disabled={isEditing}
              className={cn(
                "p-4 rounded-2xl cursor-pointer",
                "transition-all duration-300",
                "hover:scale-105 active:scale-95",
                "focus:outline-none focus:ring-2 focus:ring-white/30",
                isRunning ? "bg-white/20" : "bg-white/10",
                isEditing && "opacity-50 cursor-not-allowed"
              )}
              style={{
                boxShadow: isRunning
                  ? `0 0 20px -5px ${progressColors.glow}`
                  : "none",
              }}
            >
              {isRunning ? (
                <Pause
                  className="w-7 h-7"
                  style={{ color: progressColors.primary }}
                />
              ) : (
                <Play
                  className="w-7 h-7"
                  style={{ color: progressColors.primary }}
                />
              )}
            </button>
            <button
              onClick={resetTimer}
              disabled={isEditing}
              className={cn(
                "p-4 rounded-2xl bg-white/10 cursor-pointer",
                "transition-all duration-300",
                "hover:scale-105 active:scale-95",
                "focus:outline-none focus:ring-2 focus:ring-white/30",
                isEditing && "opacity-50 cursor-not-allowed"
              )}
            >
              <RotateCcw
                className="w-7 h-7"
                style={{ color: progressColors.primary }}
              />
            </button>
          </div>
        </div>

        {showQuote && (
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 bg-black/50 backdrop-blur-xl rounded-xl p-4 border border-white/10 shadow-lg"
            style={{
              animation: "fadeInOut 3s forwards",
            }}
          >
            <p className="text-white text-sm whitespace-nowrap">
              {currentQuote}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
