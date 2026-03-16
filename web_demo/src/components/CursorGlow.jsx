/**
 * CursorGlow — A large, soft radial gradient that follows the mouse cursor,
 * creating a flashlight-like ambient effect. Uses mix-blend-screen to
 * interact with the dark background without washing out content.
 */
import React from 'react';
import { useMousePosition } from '../hooks/useMousePosition';

export default function CursorGlow() {
  const { x, y } = useMousePosition();

  return (
    <div
      className="fixed pointer-events-none z-[1] hidden md:block"
      style={{
        left: x - 250,
        top: y - 250,
        width: 500,
        height: 500,
        background:
          'radial-gradient(circle, rgba(124,58,237,0.07) 0%, rgba(59,130,246,0.03) 40%, transparent 70%)',
        transition: 'left 0.12s ease-out, top 0.12s ease-out',
        willChange: 'left, top',
      }}
      aria-hidden="true"
    />
  );
}
