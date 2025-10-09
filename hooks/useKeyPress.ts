"use client";

import { useEffect } from 'react';

/**
 * A custom hook to listen for specific key combinations.
 * @param targetKey The main key to listen for (e.g., 'i').
 * @param callback The function to execute when the key combination is pressed.
 * @param modifier The modifier key required (e.g., 'ctrlKey', 'metaKey').
 */
export const useKeyPress = (targetKey: string, callback: () => void, modifier: 'ctrlKey' | 'metaKey' | 'altKey' = 'ctrlKey') => {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      // Check if the modifier key (Ctrl) and the target key (i) are pressed
      if (event[modifier] && event.key.toLowerCase() === targetKey.toLowerCase()) {
        event.preventDefault(); // Prevent default browser actions (like opening bookmarks)
        callback();
      }
    };

    window.addEventListener('keydown', handler);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [targetKey, callback, modifier]);
};