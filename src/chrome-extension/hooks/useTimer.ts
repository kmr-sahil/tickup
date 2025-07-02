// hooks/useTimer.ts
import { useEffect, useState } from "react";

export const useTimer = () => {
  const [dailyTotal, setDailyTotal] = useState<number>(0);

  const todayKey = `tickup_daily_${new Date().toISOString().split("T")[0]}`;

  useEffect(() => {
    chrome.storage.local.get([todayKey], (res) => {
      setDailyTotal(res[todayKey] || 0);
    });
  }, []);

  return {
    dailyTotal,
  };
};
