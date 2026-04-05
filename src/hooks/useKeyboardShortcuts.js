import { useState, useEffect, useCallback } from "react";

const useKeyboardShortcuts = (shortcuts) => {
  const [activeKeys, setActiveKeys] = useState(new Set());

  const handleKeyDown = useCallback(
    (event) => {
      const key = event.key.toLowerCase();
      const newKeys = new Set(activeKeys);
      newKeys.add(key);
      setActiveKeys(newKeys);

      shortcuts.forEach(({ keys, callback, preventDefault = true }) => {
        const requiredKeys = keys.map((k) => k.toLowerCase());
        const modifiers = {
          ctrl: event.ctrlKey || event.metaKey,
          shift: event.shiftKey,
          alt: event.altKey,
        };

        const keysMatch = requiredKeys.every((k) => {
          if (k === "ctrl" || k === "cmd") return modifiers.ctrl;
          if (k === "shift") return modifiers.shift;
          if (k === "alt") return modifiers.alt;
          return key === k;
        });

        if (keysMatch) {
          if (preventDefault) {
            event.preventDefault();
          }
          callback(event);
        }
      });
    },
    [shortcuts, activeKeys],
  );

  const handleKeyUp = useCallback((event) => {
    const key = event.key.toLowerCase();
    setActiveKeys((prev) => {
      const newKeys = new Set(prev);
      newKeys.delete(key);
      return newKeys;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return activeKeys;
};

export default useKeyboardShortcuts;
