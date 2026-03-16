/**
 * EmotionHistory — Animated scrollable list showing detected emotion entries
 * with color-coded badges and timestamps. New entries slide in from the left.
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';

const emotionStyles = {
  happy:   'text-amber-400  bg-amber-400/10  border-amber-400/20',
  sad:     'text-blue-400   bg-blue-400/10   border-blue-400/20',
  angry:   'text-red-400    bg-red-400/10    border-red-400/20',
  neutral: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
};

export default function EmotionHistory({ logs }) {
  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-white/25" />
          <span className="text-sm font-medium text-white/50">
            Detection History
          </span>
        </div>
        <span className="text-[11px] text-white/20 tabular-nums">
          {logs.length} entries
        </span>
      </div>

      {/* Scrollable log list */}
      <div className="flex flex-col gap-2 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin">
        <AnimatePresence initial={false}>
          {logs.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-white/15 text-center py-8"
            >
              Waiting for detections…
            </motion.p>
          )}

          {logs
            .slice()
            .reverse()
            .map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -16, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto', marginBottom: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border ${
                  emotionStyles[entry.label] ||
                  'text-white/40 bg-white/[0.03] border-white/[0.06]'
                }`}
              >
                <span className="text-sm font-semibold capitalize">
                  {entry.label}
                </span>
                <span className="text-[10px] text-white/25 tabular-nums">
                  {entry.time}
                </span>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
