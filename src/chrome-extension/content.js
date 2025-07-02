(function () {
  const CONTAINER_ID = "tickup-timer-container";

  if (document.getElementById(CONTAINER_ID)) return;

  const container = document.createElement("div");
  container.id = CONTAINER_ID;
  Object.assign(container.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "#111",
    color: "#fff",
    padding: "12px",
    borderRadius: "10px",
    fontFamily: "monospace",
    zIndex: "999999",
    fontSize: "14px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
  });
  document.body.appendChild(container);

  let time = 0;
  let running = false;
  let interval = null;

  const format = (s) => {
    const h = String(Math.floor(s / 3600)).padStart(2, "0");
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  const showToast = (msg) => {
    const toast = document.createElement("div");
    toast.textContent = msg;
    Object.assign(toast.style, {
      position: "fixed",
      bottom: "100px",
      right: "20px",
      background: "green",
      color: "#fff",
      padding: "6px 12px",
      borderRadius: "6px",
      fontSize: "14px",
      zIndex: 9999,
    });
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  };

  const render = () => {
    container.innerHTML = `
      <div style="margin-bottom: 8px">⏱ ${format(time)}</div>
      <div style="display: flex; gap: 6px">
        ${
          running
            ? `<button id="tickup-stop">⏹ Stop</button>`
            : `<button id="tickup-start">▶️ Start</button>`
        }
        <button id="tickup-reset">🔁 Reset</button>
      </div>
    `;

    if (running) {
      document.getElementById("tickup-stop").onclick = stop;
    } else {
      document.getElementById("tickup-start").onclick = start;
    }
    document.getElementById("tickup-reset").onclick = reset;
  };

  const tick = () => {
    time += 1;
    chrome.storage.local.set({ tickup_currentTime: time });
    render();
  };

  const start = () => {
    if (!running) {
      interval = setInterval(tick, 1000);
      running = true;
      chrome.storage.local.set({ tickup_running: true });
      showToast("▶️ Started");
      render();
    }
  };

  const stop = () => {
    if (running) {
      clearInterval(interval);
      running = false;
      chrome.storage.local.set({ tickup_running: false });

      // Save today's time
      chrome.storage.local.get("tickup_currentTime", (res) => {
        const sessionTime = res.tickup_currentTime || 0;
        const key = getTodayKey();
        chrome.storage.local.get([key], (d) => {
          const total = d[key] || 0;
          chrome.storage.local.set({ [key]: total + sessionTime });
        });
      });

      showToast("⏹️ Stopped");
      render();
    }
  };

  const reset = () => {
    stop();
    chrome.storage.local.get("tickup_currentTime", (res) => {
      const sessionTime = res.tickup_currentTime || 0;
      const key = getTodayKey();
      chrome.storage.local.get([key], (d) => {
        const total = d[key] || 0;
        chrome.storage.local.set({ [key]: total + sessionTime });
      });
    });
    chrome.storage.local.set({ tickup_currentTime: 0, tickup_running: false });
    container.remove();
    showToast("🔁 Reset and removed");
  };

  const getTodayKey = () =>
    `tickup_daily_${new Date().toISOString().split("T")[0]}`;

  // Load initial state
  chrome.storage.local.get(
    ["tickup_running", "tickup_currentTime"],
    (res) => {
      time = res.tickup_currentTime || 0;
      running = res.tickup_running || false;
      render();
      if (running) {
        interval = setInterval(tick, 1000);
      }
    }
  );
})();
