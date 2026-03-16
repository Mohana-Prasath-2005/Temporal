/**
 * GlowCard — Premium card with an animated rotating conic-gradient border
 * that appears on hover. Uses the CSS @property hack for smooth angle
 * animation and Framer Motion for subtle depth-shift on hover.
 *
 * The gradient border uses mask-composite to render only the border ring,
 * while the inner content sits on a glass-morphic background.
 */
import React from 'react';
import { motion } from 'framer-motion';

export default function GlowCard({ children, className = '', hover = true }) {
  return (
    <motion.div
      className={`glow-card group relative ${className}`}
      whileHover={hover ? { y: -3, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } } : {}}
    >
      {/* Rotating conic-gradient border (visible on hover via CSS) */}
      <div className="glow-card-border" />

      {/* Glass-morphic content shell */}
      <div className="glow-card-content">{children}</div>
    </motion.div>
  );
}
