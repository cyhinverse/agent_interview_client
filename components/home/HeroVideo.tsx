'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';
import CodeDemo from './CodeDemo';

export default function HeroVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: '-20% 0px -20% 0px' });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.4], [15, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.6, 1]);
  const y = useTransform(scrollYProgress, [0, 0.4], [50, 0]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto mt-20 perspective-1000 px-4"
    >
      <motion.div
        style={{
          rotateX,
          scale,
          opacity,
          y,
          transformStyle: 'preserve-3d',
        }}
        className="relative group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl shadow-violet-500/20 will-change-transform"
      >
        {/* Browser Header / UI Frame */}
        <div className="h-10 bg-black/60 backdrop-blur-md flex items-center px-4 gap-2 border-b border-white/5 font-medium z-10 relative">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="ml-4 h-5 w-64 rounded-full bg-white/10 flex items-center px-3">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
            <span className="text-[10px] text-white/40 font-mono">
              aa-interview-platform.demo
            </span>
          </div>
        </div>

        {/* Video Container */}
        <div className="aspect-video w-full bg-[#0D0D11] relative">
          <CodeDemo isInView={isInView} />
        </div>

        {/* Glossy Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-30 z-10" />
      </motion.div>

      {/* Background Glow */}
      <motion.div
        style={{ scale, opacity }}
        className="absolute -inset-4 bg-violet-500/20 blur-3xl -z-10 rounded-[2rem]"
      />
    </div>
  );
}
