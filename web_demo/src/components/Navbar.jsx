/**
 * Navbar — Fixed top navigation with logo, brand name, and a live
 * status indicator pill. Fades in on mount.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Activity } from 'lucide-react';

export default function Navbar({ status }) {
  const isActive = status === 'Active';

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-40 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo + brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-white/90 font-display tracking-tight">
            NeuralAura
          </span>
        </div>

        {/* Status pill */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl">
          <div
            className={`w-2 h-2 rounded-full transition-colors duration-500 ${
              isActive
                ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse'
                : 'bg-amber-400'
            }`}
          />
          <span className="text-sm text-white/50 font-medium">{status}</span>
          <Activity className="w-4 h-4 text-white/30" />
        </div>
      </div>
    </motion.nav>
  );
}
