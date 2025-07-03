import React, { useEffect, useState } from "react";

export const TimerComponent: React.FC = () => {
  const [dailyTotal, setDailyTotal] = useState(0);

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    chrome.storage.local.get(["todos"], (res) => {
      const todos = res.todos || [];
      const total = todos
        .filter((todo:any) => todo.date.startsWith(today))
        .reduce((sum:any, todo:any) => sum + (todo.timeTaken || 0), 0);
      setDailyTotal(total);
    });
  }, []);

  return (
    <div className="pt-4">
      <div className="text-center mb-4">
        <p className="text-sm text-zinc-400/50">
          Today's Total ({new Date().toLocaleDateString()}):
        </p>
        <p className="text-lg font-mono font-semibold text-zinc-400/80">
          {formatTime(dailyTotal)}
        </p>
      </div>
    </div>
  );
};
