/**
 * EmotionDisplay — Showcases the currently detected emotion with a
 * pulsating colored glow, animated emoji transition, and label.
 * Color palette shifts per emotion for immediate visual feedback.
 */
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const emotionConfig = {
  happy:   { color: '#fbbf24', glow: 'rgba(251,191,36,0.25)',  icon: '😊' },
  sad:     { color: '#60a5fa', glow: 'rgba(96,165,250,0.25)',  icon: '😢' },
  angry:   { color: '#f87171', glow: 'rgba(248,113,113,0.25)', icon: '😡' },
  neutral: { color: '#a78bfa', glow: 'rgba(167,139,250,0.25)', icon: '😐' },
  '—':     { color: '#94a3b8', glow: 'rgba(148,163,184,0.15)', icon: '🔍' },
};

export default function EmotionDisplay({ emotion }) {
  const config = useMemo(
    () => emotionConfig[emotion] || emotionConfig['—'],
    [emotion]
  );

  return (
    <div className="flex flex-col items-center justify-center py-8 relative">
      {/* Pulsing glow orb behind the icon */}
      <motion.div
        className="absolute w-44 h-44 rounded-full blur-3xl opacity-70"
        animate={{
          backgroundColor: config.glow,
          scale: [1, 1.25, 1],
        }}
        transition={{
          backgroundColor: { duration: 0.5 },
          scale: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      {/* Emotion emoji — cross-fades on change */}
      <AnimatePresence mode="wait">
        <motion.div
          key={emotion}
          initial={{ scale: 0.4, opacity: 0, filter: 'blur(12px)' }}
          animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
          exit={{ scale: 0.4, opacity: 0, filter: 'blur(12px)' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="text-6xl mb-4 relative z-10"
        >
          {config.icon}
        </motion.div>
      </AnimatePresence>

      {/* Emotion label */}
      <AnimatePresence mode="wait">
        <motion.span
          key={emotion}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-bold font-display capitalize relative z-10"
          style={{ color: config.color }}
        >
          {emotion}
        </motion.span>
      </AnimatePresence>

      <span className="text-[10px] text-white/25 uppercase tracking-[0.18em] mt-3 relative z-10">
        Detected Emotion
      </span>
    </div>
  );
}
