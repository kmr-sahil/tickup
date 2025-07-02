// components/TimerComponent.tsx
import React from "react";

interface TimerProps {
  dailyTotal: number;
}

export const TimerComponent: React.FC<TimerProps> = ({ dailyTotal }) => {
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleShowTimer = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ["content.js"],
        });
      }
    });
  };

  const handleHideTimer = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id! },
        func: () => {
          const el = document.getElementById("tickup-timer-container");
          if (el) el.remove();
        },
      });
    });
  };

  return (
    <div className="pt-4">
      {/* Daily Total Only */}
      <div className="text-center mb-4">
        <p className="text-sm text-zinc-400/50">Today's Total</p>
        <p className="text-lg font-mono font-semibold text-zinc-400/80">
          {formatTime(dailyTotal)}
        </p>
      </div>

      {/* Show / Hide Floating Timer */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={handleShowTimer}
          className="px-3 py-1 bg-green-500/40 text-white rounded hover:bg-green-600/80 text-sm"
        >
          Show Timer
        </button>
        <button
          onClick={handleHideTimer}
          className="px-3 py-1 bg-red-500/40 text-white rounded hover:bg-red-600/80 text-sm"
        >
          Hide Timer
        </button>
      </div>
    </div>
  );
};
