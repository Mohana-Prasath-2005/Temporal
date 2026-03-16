/**
 * AnimatedBackground — Full-screen ambient layer with floating gradient orbs
 * and a subtle noise texture. Creates depth and "living" atmosphere.
 */
import React from 'react';

const orbs = [
  {
    size: 620,
    gradient:
      'radial-gradient(circle, rgba(124,58,237,0.14) 0%, rgba(79,70,229,0.05) 40%, transparent 70%)',
    top: '-8%',
    left: '-6%',
    delay: '0s',
    duration: '22s',
  },
  {
    size: 520,
    gradient:
      'radial-gradient(circle, rgba(6,182,212,0.12) 0%, rgba(59,130,246,0.04) 40%, transparent 70%)',
    top: '55%',
    right: '-8%',
    delay: '-6s',
    duration: '26s',
  },
  {
    size: 420,
    gradient:
      'radial-gradient(circle, rgba(244,63,94,0.08) 0%, rgba(249,115,22,0.03) 40%, transparent 70%)',
    bottom: '-6%',
    left: '28%',
    delay: '-12s',
    duration: '24s',
  },
  {
    size: 360,
    gradient:
      'radial-gradient(circle, rgba(16,185,129,0.08) 0%, rgba(20,184,166,0.03) 40%, transparent 70%)',
    top: '18%',
    right: '18%',
    delay: '-17s',
    duration: '30s',
  },
  {
    size: 280,
    gradient:
      'radial-gradient(circle, rgba(251,191,36,0.06) 0%, rgba(245,158,11,0.02) 40%, transparent 70%)',
    top: '40%',
    left: '10%',
    delay: '-9s',
    duration: '28s',
  },
];

export default function AnimatedBackground() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      {/* Floating gradient orbs */}
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-float-orb"
          style={{
            width: orb.size,
            height: orb.size,
            background: orb.gradient,
            top: orb.top,
            left: orb.left,
            right: orb.right,
            bottom: orb.bottom,
            animationDelay: orb.delay,
            animationDuration: orb.duration,
            filter: 'blur(80px)',
          }}
        />
      ))}

      {/* Subtle grain overlay for texture depth */}
      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        }}
      />
    </div>
  );
}
