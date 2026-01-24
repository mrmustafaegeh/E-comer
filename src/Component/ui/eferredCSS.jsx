// src/components/DeferredCSS.jsx
"use client";

import { useEffect } from "react";

export default function DeferredCSS() {
  useEffect(() => {
    // Function to load CSS without blocking
    const loadCSS = () => {
      // Check if CSS is already loaded
      const existingLink = document.querySelector(
        'link[href*="globals.css"], link[href*="app/layout.css"]'
      );

      if (existingLink) {
        // If exists but not applied, make it active
        if (existingLink.media === "print") {
          existingLink.media = "all";
        }
        return;
      }

      // Create and load new stylesheet
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/_next/static/css/app/layout.css"; // Try this path first

      // If not found, try alternative paths
      link.onerror = () => {
        // Try different possible paths
        const altPaths = [
          "/_next/static/css/app/globals.css",
          "/_next/static/css/91e4631d.css", // Your original hash
        ];

        let currentIndex = 0;
        const tryNextPath = () => {
          if (currentIndex < altPaths.length) {
            link.href = altPaths[currentIndex];
            currentIndex++;
          }
        };

        tryNextPath();
      };

      document.head.appendChild(link);
    };

    // Load CSS after a short delay (non-blocking)
    const timer = setTimeout(loadCSS, 100);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
