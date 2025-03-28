"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, SkipForward, Play, Pause } from "lucide-react";
import { cn } from "../lib/utils";

const LOFI_PLAYLIST = [
  {
    title: "Lofi Chill Beats",
    url: "/lofi.mp3", // This will load from the public directory
  },
];

export const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [showVolume, setShowVolume] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = async () => {
    if (audioRef.current) {
      if (!hasInteracted) {
        setHasInteracted(true);
      }

      if (isPlaying) {
        audioRef.current.pause();
      } else {
        try {
          await audioRef.current.play();
        } catch (error) {
          console.log("Playback error:", error);
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    setCurrentTrack((current) => (current + 1) % LOFI_PLAYLIST.length);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="fixed bottom-8 left-8 z-50">
      {!hasInteracted && (
        <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-xl rounded-xl p-4 text-white text-sm whitespace-nowrap animate-bounce">
          Click play to start the music 🎵
        </div>
      )}
      <div
        className={cn(
          "bg-black/30 backdrop-blur-xl rounded-2xl p-4",
          "border border-white/20 shadow-2xl",
          "transition-all duration-300",
          "hover:bg-black/40 hover:scale-102",
          isPlaying && "ring-2 ring-white/20"
        )}
        style={{
          boxShadow: isPlaying
            ? "0 0 40px -10px rgba(255, 255, 255, 0.3)"
            : "0 0 30px -10px rgba(0, 0, 0, 0.3)",
        }}
      >
        <audio
          ref={audioRef}
          src={LOFI_PLAYLIST[currentTrack].url}
          onEnded={nextTrack}
          loop={false}
        />

        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className={cn(
              "bg-white/10 p-3 rounded-xl transition-all duration-300 cursor-pointer",
              "hover:bg-white/20 hover:scale-105 active:scale-95",
              "focus:outline-none focus:ring-2 focus:ring-white/30",
              isPlaying && "bg-white/20"
            )}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white" />
            )}
          </button>

          <button
            onClick={nextTrack}
            className={cn(
              "bg-white/10 p-3 rounded-xl transition-all duration-300 cursor-pointer",
              "hover:bg-white/20 hover:scale-105 active:scale-95",
              "focus:outline-none focus:ring-2 focus:ring-white/30"
            )}
          >
            <SkipForward className="w-6 h-6 text-white opacity-70" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowVolume(!showVolume)}
              className={cn(
                "bg-white/10 p-3 rounded-xl transition-all duration-300 cursor-pointer",
                "hover:bg-white/20 hover:scale-105 active:scale-95",
                "focus:outline-none focus:ring-2 focus:ring-white/30"
              )}
            >
              {volume === 0 ? (
                <VolumeX className="w-6 h-6 text-white opacity-70" />
              ) : (
                <Volume2 className="w-6 h-6 text-white opacity-70" />
              )}
            </button>

            {showVolume && (
              <div
                className={cn(
                  "absolute bottom-full left-1/2 -translate-x-1/2 mb-2",
                  "bg-black/50 backdrop-blur-xl rounded-xl p-3",
                  "border border-white/10 shadow-lg"
                )}
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className={cn(
                    "w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer",
                    "hover:bg-white/30 transition-all duration-300"
                  )}
                  style={{
                    backgroundImage: `linear-gradient(to right, white ${
                      volume * 100
                    }%, transparent ${volume * 100}%)`,
                  }}
                />
              </div>
            )}
          </div>

          <div className="ml-3">
            <p className="text-white/70 text-sm font-medium">
              {LOFI_PLAYLIST[currentTrack].title}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
