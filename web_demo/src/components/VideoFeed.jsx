/**
 * VideoFeed — Renders the webcam <video> element inside a sleek frame with
 * gradient edge overlays, a "LIVE" badge, and an emotion overlay chip.
 */
import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Video, VideoOff } from 'lucide-react';

const VideoFeed = forwardRef(({ emotion, error }, ref) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl bg-[#080c18] border border-white/[0.06] aspect-video"
    >
      {/* Webcam video */}
      <video
        ref={ref}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Top gradient vignette */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

      {/* Bottom gradient vignette */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

      {/* LIVE badge */}
      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/[0.1]">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-[11px] text-white/70 font-semibold tracking-wider">
          LIVE
        </span>
      </div>

      {/* Camera status icon */}
      <div className="absolute top-4 right-4">
        {error ? (
          <VideoOff className="w-5 h-5 text-red-400/50" />
        ) : (
          <Video className="w-5 h-5 text-white/25" />
        )}
      </div>

      {/* Bottom-left emotion chip */}
      <div className="absolute bottom-4 left-4 flex items-end">
        <div className="px-5 py-3 rounded-xl bg-black/50 backdrop-blur-lg border border-white/[0.08]">
          <span className="text-[10px] uppercase tracking-[0.15em] text-white/35 block mb-1">
            Current State
          </span>
          <span className="text-xl font-bold text-white font-display capitalize">
            {emotion}
          </span>
        </div>
      </div>

      {/* Error ribbon */}
      {error && (
        <div className="absolute bottom-4 right-4 max-w-[240px] px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300/80 backdrop-blur-md">
          {error}
        </div>
      )}
    </motion.div>
  );
});

VideoFeed.displayName = 'VideoFeed';
export default VideoFeed;
