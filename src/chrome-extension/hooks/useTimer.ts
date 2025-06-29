// ===== hooks/useTimer.ts =====
import { useState, useEffect } from 'react';
import { storageUtils } from '../utils/storage';

export const useTimer = () => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [dailyTotal, setDailyTotal] = useState<number>(0);

  useEffect(() => {
    const loadTimerData = async () => {
      const keys = ['currentTime', 'isRunning', `dailyTotal_${storageUtils.getTodayKey()}`];
      const result = await storageUtils.getFromStorage(keys);
      
      if (typeof result.currentTime === 'number') {
        setCurrentTime(result.currentTime);
      }
      
      if (typeof result.isRunning === 'boolean') {
        setIsRunning(result.isRunning);
      }
      
      const todayTotal = result[`dailyTotal_${storageUtils.getTodayKey()}`] || 0;
      if (typeof todayTotal === 'number') {
        setDailyTotal(todayTotal);
      }
    };

    loadTimerData();
  }, []);

  // Timer effect
  useEffect(() => {
    let intervalRef: NodeJS.Timeout | null = null;

    if (isRunning) {
      intervalRef = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          storageUtils.saveToStorage('currentTime', newTime);
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef) {
        clearInterval(intervalRef);
      }
    };
  }, [isRunning]);

  // Save running state
  useEffect(() => {
    storageUtils.saveToStorage('isRunning', isRunning);
  }, [isRunning]);

  const startTimer = (): void => {
    setIsRunning(true);
  };

  const pauseTimer = (): void => {
    setIsRunning(false);
  };

  const stopTimer = async (): Promise<void> => {
    setIsRunning(false);
    
    // Add current time to daily total
    const newDailyTotal = dailyTotal + currentTime;
    setDailyTotal(newDailyTotal);
    await storageUtils.saveToStorage(`dailyTotal_${storageUtils.getTodayKey()}`, newDailyTotal);
    
    // Reset current time
    setCurrentTime(0);
    await storageUtils.saveToStorage('currentTime', 0);
  };

  const resetTimer = (): void => {
    setIsRunning(false);
    setCurrentTime(0);
    storageUtils.saveToStorage('currentTime', 0);
  };

  return {
    currentTime,
    isRunning,
    dailyTotal,
    startTimer,
    pauseTimer,
    stopTimer,
    resetTimer
  };
};