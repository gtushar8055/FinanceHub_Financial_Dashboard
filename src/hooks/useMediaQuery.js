import { useState, useEffect } from "react";

/**
 * Custom hook for responsive design - detects if a media query matches
 * @param {string} query - The media query string (e.g., '(min-width: 768px)')
 * @returns {boolean} - Whether the media query matches
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    // Check if window is available (for SSR compatibility)
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);

    // Update state when match changes
    const handleChange = (event) => {
      setMatches(event.matches);
    };

    // Set initial value
    setMatches(mediaQuery.matches);

    // Add listener for changes
    mediaQuery.addEventListener("change", handleChange);

    // Cleanup listener on unmount
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
};

// Predefined breakpoint hooks for convenience
export const useIsMobile = () => useMediaQuery("(max-width: 639px)");
export const useIsTablet = () =>
  useMediaQuery("(min-width: 640px) and (max-width: 1023px)");
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");

export default useMediaQuery;
