/**
 * AudioVisualizer — Microphone status header + canvas element for the
 * real-time frequency bar visualization drawn by useAudioVisualizer.
 */
import React, { forwardRef } from 'react';
import { Mic, MicOff } from 'lucide-react';

const AudioVisualizer = forwardRef(({ listening, voiceError }, ref) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {listening ? (
            <Mic className="w-4 h-4 text-violet-400" />
          ) : (
            <MicOff className="w-4 h-4 text-white/25" />
          )}
          <span className="text-sm font-medium text-white/50">Audio Input</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${
              listening
                ? 'bg-violet-400 shadow-sm shadow-violet-400/50 animate-pulse'
                : 'bg-white/15'
            }`}
          />
          <span className="text-[11px] text-white/25">
            {listening ? 'Listening' : 'Connecting…'}
          </span>
        </div>
      </div>

      {/* Frequency canvas */}
      <canvas
        ref={ref}
        width={420}
        height={120}
        className="w-full h-auto rounded-xl bg-gradient-to-b from-white/[0.02] to-transparent border border-white/[0.05]"
      />

      {voiceError && (
        <p className="text-xs text-red-400/70 mt-1">{voiceError}</p>
      )}
    </div>
  );
});

AudioVisualizer.displayName = 'AudioVisualizer';
export default AudioVisualizer;
