"use client";

import { useState, useEffect } from "react";

export function useIsLandscape() {
  const [isLandscape, setIsLandscape] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const checkOrientation = () => {
      // We check on mount and on resize
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    // Add event listener
    window.addEventListener("resize", checkOrientation);

    // Initial check
    checkOrientation();

    // Cleanup on component unmount
    return () => window.removeEventListener("resize", checkOrientation);
  }, []); // Empty array ensures effect is only run on mount and unmount

  return isLandscape;
}
