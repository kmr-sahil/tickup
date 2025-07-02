// src/chrome-extension/content/main.tsx
import { createRoot } from "react-dom/client";
import React from "react";
import ContentPage from "./ContentPage";

const CONTAINER_ID = "__tickup_timer_root__";

// Unmount function to remove the component on reset
function injectApp() {
  if (document.getElementById(CONTAINER_ID)) return;

  const rootDiv = document.createElement("div");
  rootDiv.id = CONTAINER_ID;
  Object.assign(rootDiv.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: "999999",
  });
  document.body.appendChild(rootDiv);

  const root = createRoot(rootDiv);
  root.render(
    <React.StrictMode>
      <ContentPage unmount={() => {
        const el = document.getElementById(CONTAINER_ID);
        if (el) el.remove();
      }} />
    </React.StrictMode>
  );
}

injectApp();
