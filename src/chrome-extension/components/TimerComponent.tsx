// ===== components/TimerComponent.tsx =====
import React from 'react';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';

interface TimerProps {
  currentTime: number;
  isRunning: boolean;
  dailyTotal: number;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onReset: () => void;
}

export const TimerComponent: React.FC<TimerProps> = ({
  currentTime,
  isRunning,
  dailyTotal,
  onStart,
  onPause,
  onStop,
  onReset
}) => {
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className=" pt-4">
      
      {/* Current Timer Display */}
      <div className="text-center mb-4">
        <div className="text-2xl font-mono font-bold text-zinc-400/80 mb-2">
          {formatTime(currentTime)}
        </div>
        <div className={`text-sm ${isRunning ? 'text-green-600' : 'text-zinc-600'}`}>
          {isRunning ? 'Running' : 'Stopped'}
        </div>
      </div>

      {/* Timer Controls */}
      <div className="flex gap-2 justify-center mb-4">
        {!isRunning ? (
          <button
            onClick={onStart}
            className="flex text-sm items-center gap-1 px-2 py-1 bg-green-500/40 text-white rounded-md hover:bg-green-600/80 transition-colors"
            type="button"
          >
            <Play size={10} />
            Start
          </button>
        ) : (
          <button
            onClick={onPause}
            className="flex text-sm items-center gap-1 px-2 py-1 bg-yellow-500/40 text-white rounded-md hover:bg-yellow-600/80 transition-colors"
            type="button"
          >
            <Pause size={10} />
            Pause
          </button>
        )}
        
        <button
          onClick={onStop}
          className="flex text-sm items-center gap-1 px-2 py-1 bg-red-500/40 text-white rounded-md hover:bg-red-600/80 transition-colors"
          type="button"
        >
          <Square size={10} />
          Stop
        </button>
        
        <button
          onClick={onReset}
          className="flex text-sm items-center gap-1 px-2 py-1 bg-gray-500/40 text-white rounded-md hover:bg-gray-600/80 transition-colors"
          type="button"
        >
          <RotateCcw size={10} />
          Reset
        </button>
      </div>

      {/* Daily Total */}
      <div className="text-center flex items-center justify-center gap-2">
        <p className="text-sm text-zinc-400/50">Today's Total:</p>
        <p className="text-lg font-mono font-semibold text-zinc-400/80">
          {formatTime(dailyTotal)}
        </p>
      </div>
    </div>
  );
};