/**
 * useMousePosition — Tracks cursor coordinates (client-space) with
 * minimal re-renders via requestAnimationFrame batching.
 */
import { useState, useEffect, useRef, useCallback } from 'react';

export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const frame = useRef(0);

  const handler = useCallback((e) => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      setPosition({ x: e.clientX, y: e.clientY });
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handler);
    return () => {
      window.removeEventListener('mousemove', handler);
      cancelAnimationFrame(frame.current);
    };
  }, [handler]);

  return position;
}
