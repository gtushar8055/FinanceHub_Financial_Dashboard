import { useState, useEffect, useCallback } from "react";

const useScrollPosition = (threshold = 100) => {
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("down");
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const documentHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    setScrollDirection(currentScrollY > scrollY ? "down" : "up");
    setScrollY(currentScrollY);
    setIsScrolled(currentScrollY > threshold);
    setScrollProgress(
      documentHeight > 0 ? (currentScrollY / documentHeight) * 100 : 0,
    );
  }, [scrollY, threshold]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return {
    scrollY,
    scrollDirection,
    isScrolled,
    scrollProgress,
  };
};

export default useScrollPosition;
