// src/chrome-extension/content/ContentPage.tsx
import React, { useEffect, useState } from "react";

interface Props {
  unmount: () => void;
}

const formatTime = (s: number) => {
  const h = String(Math.floor(s / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${h}:${m}:${sec}`;
};

const ContentPage: React.FC<Props> = ({ unmount }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: "GET_TIMER_STATE" }, (res) => {
      if (res?.timer != null) setTime(res.timer);
    });

    const listener = (msg: any) => {
      if (msg.type === "TIMER_TICK") setTime(msg.timer);
    };
    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);

  const handleStart = () =>
    chrome.runtime.sendMessage({ type: "START_TIMER" }, () =>
      showToast("▶️ Started")
    );

  const handleStop = () =>
    chrome.runtime.sendMessage({ type: "STOP_TIMER" }, () =>
      showToast("⏹️ Stopped")
    );

  const handleReset = () =>
    chrome.runtime.sendMessage({ type: "RESET_TIMER" }, () => {
      showToast("🔁 Reset");
      unmount(); // Remove UI
    });

  return (
    <div style={floatingStyle}>
      <div style={{ fontSize: 18, marginBottom: 8 }}>⏱️ {formatTime(time)}</div>
      <div style={{ display: "flex", gap: 6 }}>
        <button onClick={handleStart}>▶️ Start</button>
        <button onClick={handleStop}>⏹️ Stop</button>
        <button onClick={handleReset}>🔁 Reset</button>
      </div>
    </div>
  );
};

const floatingStyle: React.CSSProperties = {
  background: "#111",
  padding: "12px",
  borderRadius: "10px",
  color: "#eee",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  fontFamily: "monospace",
};

function showToast(msg: string) {
  const toast = document.createElement("div");
  toast.textContent = msg;
  toast.style.cssText = `
    position:fixed;
    bottom:80px;
    right:20px;
    background:#4caf50;
    color:#fff;
    padding:6px 12px;
    border-radius:6px;
    font-size:14px;
    z-index:999999;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

export default ContentPage;
