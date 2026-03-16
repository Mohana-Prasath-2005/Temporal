/**
 * App — Root component. Composes the full NeuralAura interface:
 * animated background, cursor glow, navbar, hero, video feed,
 * emotion display, audio visualizer, history log, and tech stats.
 */
import React from 'react';
import { useFaceDetection } from './hooks/useFaceDetection';
import { useAudioVisualizer } from './hooks/useAudioVisualizer';
import AnimatedBackground from './components/AnimatedBackground';
import CursorGlow from './components/CursorGlow';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import GlowCard from './components/GlowCard';
import VideoFeed from './components/VideoFeed';
import EmotionDisplay from './components/EmotionDisplay';
import AudioVisualizer from './components/AudioVisualizer';
import EmotionHistory from './components/EmotionHistory';
import ScrollReveal from './components/ScrollReveal';

const stats = [
  { label: 'Detection Rate', value: '~220ms' },
  { label: 'Model', value: 'TinyFace' },
  { label: 'Smoothing', value: '16-frame avg' },
  { label: 'Audio FFT', value: '1024 bins' },
];

export default function App() {
  const { videoRef, status, emotion, error, logs } = useFaceDetection();
  const { canvasRef, listening, voiceError } = useAudioVisualizer();

  return (
    <div className="min-h-screen bg-[#06080f] text-white selection:bg-violet-500/30 selection:text-white">
      {/* Ambient layers */}
      <AnimatedBackground />
      <CursorGlow />

      {/* Fixed navbar */}
      <Navbar status={status} />

      {/* Hero */}
      <HeroSection />

      {/* ── Main content grid ─────────────────────── */}
      <div className="px-6 pb-24 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video feed — 2/3 width on desktop */}
            <div className="lg:col-span-2">
              <GlowCard>
                <div className="p-3 sm:p-4">
                  <VideoFeed ref={videoRef} emotion={emotion} error={error} />
                </div>
              </GlowCard>
            </div>

            {/* Right sidebar — emotion + audio + history */}
            <div className="flex flex-col gap-6">
              <GlowCard>
                <div className="p-5">
                  <EmotionDisplay emotion={emotion} />
                </div>
              </GlowCard>

              <GlowCard>
                <div className="p-4">
                  <AudioVisualizer
                    ref={canvasRef}
                    listening={listening}
                    voiceError={voiceError}
                  />
                </div>
              </GlowCard>

              <GlowCard>
                <div className="p-4">
                  <EmotionHistory logs={logs} />
                </div>
              </GlowCard>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Technical specs strip ─────────────────── */}
        <ScrollReveal delay={0.15}>
          <div className="mt-20 pt-10 border-t border-white/[0.04]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
              {stats.map((s) => (
                <div key={s.label} className="text-center group">
                  <div className="text-2xl font-bold font-display bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent group-hover:brightness-125 transition-all duration-300">
                    {s.value}
                  </div>
                  <div className="text-[11px] text-white/25 uppercase tracking-[0.15em] mt-2">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* ── Footer ────────────────────────────────── */}
        <footer className="mt-16 text-center text-xs text-white/15">
          NeuralAura — Temporal Facial Dynamics Emotion Recognition &middot;{' '}
          {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
