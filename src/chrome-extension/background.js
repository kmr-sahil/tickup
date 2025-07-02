// src/background.ts
let timer = 0;
let isRunning = false;
let interval = null;

chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
  if (msg.type === "GET_TIMER_STATE") {
    sendResponse({ timer, isRunning });
  }

  if (msg.type === "START_TIMER") {
    if (!isRunning) {
      isRunning = true;
      interval = setInterval(() => {
        timer++;
        chrome.runtime.sendMessage({ type: "TIMER_TICK", timer });
      }, 1000);
    }
  }

  if (msg.type === "STOP_TIMER") {
    if (isRunning) {
      isRunning = false;
      clearInterval(interval);
      interval = null;

      const key = `tickup_daily_${new Date().toISOString().split("T")[0]}`;
      chrome.storage.local.get([key], (res) => {
        const total = res[key] || 0;
        chrome.storage.local.set({ [key]: total + timer });
      });
    }
  }

  if (msg.type === "RESET_TIMER") {
    if (isRunning) clearInterval(interval);
    isRunning = false;
    interval = null;

    const key = `tickup_daily_${new Date().toISOString().split("T")[0]}`;
    chrome.storage.local.get([key], (res) => {
      const total = res[key] || 0;
      chrome.storage.local.set({ [key]: total + timer });
    });

    timer = 0;
    chrome.runtime.sendMessage({ type: "TIMER_TICK", timer });
  }
});
