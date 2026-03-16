/**
 * HeroSection — Bold gradient headline with staggered entrance animation,
 * descriptive subtitle, and technology tags.
 */
import React from 'react';
import { motion } from 'framer-motion';

const tags = ['Wav2Vec 2.0', 'DINOv2', 'Transformer Fusion', 'Affective Computing'];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HeroSection() {
  return (
    <motion.section
      className="pt-28 pb-10 px-6 max-w-7xl mx-auto"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {/* Eyebrow accent */}
      <motion.div variants={item} className="flex items-center gap-3 mb-6">
        <div className="h-px w-10 bg-gradient-to-r from-violet-500 to-transparent" />
        <span className="text-[11px] tracking-[0.2em] uppercase text-white/35 font-medium">
          Real-time Emotion Intelligence
        </span>
      </motion.div>

      {/* Display title */}
      <motion.h1
        variants={item}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-bold font-display leading-[1.08] tracking-tight max-w-5xl mb-6"
      >
        <span className="text-white">Temporal Facial </span>
        <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
          Dynamics&#8209;Driven
        </span>
        <br />
        <span className="text-white/75">Emotion Recognition</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        variants={item}
        className="text-base sm:text-lg text-white/35 max-w-2xl leading-relaxed mb-8"
      >
        Vision transformer models capturing temporal facial expression
        progression, fused with self-supervised speech embeddings for robust
        cross-dataset emotion classification.
      </motion.p>

      {/* Tech tags */}
      <motion.div variants={item} className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-4 py-2 rounded-full text-[13px] text-white/40 border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.06] hover:text-white/65 hover:border-white/[0.14] transition-all duration-300 cursor-default"
          >
            {tag}
          </span>
        ))}
      </motion.div>
    </motion.section>
  );
}
