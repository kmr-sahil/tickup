import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: "src/chrome-extension/manifest.json", dest: "." },
        { src: "src/chrome-extension/background.js", dest: "." },
        { src: "src/chrome-extension/content.js", dest: "." },
        { src: "src/chrome-extension/public/icon.png", dest: "./public" }
      ]
    })
  ],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "popup.html"),
        options: resolve(__dirname, "options.html"),
        //content: resolve(__dirname, "src/chrome-extension/content/main.tsx")
      },
      output: {
        entryFileNames: "[name].js"
      }
    }
  }
});
