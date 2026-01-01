'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  Video,
  PhoneOff,
  MessageSquare,
  Volume2,
  User,
} from 'lucide-react';

export default function InterviewDemo({ isInView }: { isInView: boolean }) {
  const [activeSpeaker, setActiveSpeaker] = useState<'ai' | 'user'>('ai');
  const [transcript, setTranscript] = useState<string[]>([]);

  // Simulation sequence
  useEffect(() => {
    if (!isInView) return;

    const sequence = [
      {
        speaker: 'ai',
        text: "Let's discuss the time complexity of your solution.",
        delay: 500,
      },
      {
        speaker: 'user',
        text: 'Sure. I used a Hash Map, so properly...',
        delay: 3000,
      },
      {
        speaker: 'ai',
        text: 'Correct. That gives us O(n) lookup time. Great job.',
        delay: 6000,
      },
    ];

    let timeouts: NodeJS.Timeout[] = [];

    // Reset
    setTranscript([]);
    setActiveSpeaker('ai');

    sequence.forEach(({ speaker, text, delay }) => {
      const timeout = setTimeout(() => {
        setActiveSpeaker(speaker as 'ai' | 'user');
        setTranscript((prev) => [...prev.slice(-2), text]);
      }, delay);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [isInView]);

  return (
    <div className="w-full h-full bg-[#131418] rounded-[24px] overflow-hidden border border-white/5 shadow-[0_0_80px_-20px_rgba(66,133,244,0.15)] flex flex-col relative font-sans transition-shadow duration-500 hover:shadow-[0_0_100px_-20px_rgba(66,133,244,0.25)]">
      {/* Header / Top Bar */}
      <div className="h-14 bg-[#1a1b1f]/80 backdrop-blur-md flex items-center justify-between px-6 z-10 absolute top-0 w-full border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 bg-[#ea4335] rounded-full animate-pulse shadow-[0_0_8px_#ea4335]" />
          <span className="text-xs font-medium text-[#e8eaed] tracking-wide">
            REC 00:04:23
          </span>
        </div>
        <div className="flex gap-3">
          <div className="p-2.5 rounded-full bg-[#3c4043] text-[#e8eaed] hover:bg-[#4a4d51] transition-colors cursor-pointer">
            <MessageSquare size={18} />
          </div>
          <div className="p-2.5 rounded-full bg-[#3c4043] text-[#e8eaed] hover:bg-[#4a4d51] transition-colors cursor-pointer">
            <User size={18} />
          </div>
        </div>
      </div>

      {/* Main Content - Grid */}
      <div className="flex-1 grid grid-cols-2 p-6 gap-6 pt-20">
        {/* AI Card */}
        <div
          className={`relative rounded-3xl overflow-hidden bg-[#202124] border transition-all duration-500 ${
            activeSpeaker === 'ai'
              ? 'border-[#8ab4f8]/50 shadow-[0_0_30px_-10px_rgba(138,180,248,0.3)]'
              : 'border-transparent'
          }`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div
                className="w-32 h-32 rounded-full bg-[#1a73e8] flex items-center justify-center shadow-2xl transform transition-transform duration-700 blur-[60px] opacity-40"
                style={{
                  transform: activeSpeaker === 'ai' ? 'scale(1.1)' : 'scale(1)',
                }}
              ></div>
              <div className="absolute inset-1 rounded-full bg-[#131418] flex items-center justify-center z-10">
                <SparkleIcon
                  className={`w-12 h-12 text-[#e8eaed] ${
                    activeSpeaker === 'ai' ? 'animate-pulse' : 'opacity-50'
                  }`}
                />
              </div>
            </div>
          </div>
          <div className="absolute bottom-4 left-4 bg-[#000000]/40 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-medium text-white flex items-center gap-2 border border-white/10 shadow-lg">
            <span className="w-1.5 h-1.5 bg-[#34a853] rounded-full" />
            Gemini AI
          </div>
        </div>

        {/* User Card */}
        <div
          className={`relative rounded-3xl overflow-hidden bg-[#202124] border transition-all duration-500 ${
            activeSpeaker === 'user'
              ? 'border-[#8ab4f8]/50'
              : 'border-transparent'
          }`}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-[#3c4043]">
            <User className="w-24 h-24 text-[#5f6368]" />
          </div>
          {/* Fake Camera Feed Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-4 left-4 bg-[#000000]/40 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-medium text-white flex items-center gap-2 border border-white/10 shadow-lg">
            <span className="w-1.5 h-1.5 bg-[#34a853] rounded-full" />
            You
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="h-20 bg-[#131418] flex items-center justify-center gap-4 border-t border-[#24262b] relative z-10">
        <button className="p-3.5 rounded-full bg-[#3c4043] text-white hover:bg-[#4a4d51] transition shadow-lg">
          <Mic size={20} />
        </button>
        <button className="p-3.5 rounded-full bg-[#3c4043] text-white hover:bg-[#4a4d51] transition shadow-lg">
          <Video size={20} />
        </button>
        <button className="p-3.5 rounded-full bg-[#ea4335] text-white hover:bg-[#d93025] transition px-8 shadow-lg shadow-[#ea4335]/20">
          <PhoneOff size={20} />
        </button>
        <button className="p-3.5 rounded-full bg-[#3c4043] text-white hover:bg-[#4a4d51] transition shadow-lg">
          <Volume2 size={20} />
        </button>
      </div>

      {/* Floating Captions */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-3/4 flex flex-col items-center gap-3 pointer-events-none z-20">
        <AnimatePresence>
          {transcript.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#000000]/70 backdrop-blur-md px-6 py-3 rounded-2xl text-center border border-white/5 shadow-2xl"
            >
              <p className="text-[#e8eaed] text-sm font-medium leading-relaxed tracking-wide">
                {t}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path
        d="M12 2L14.4 7.2L20 9.6L14.4 12L12 17.2L9.6 12L4 9.6L9.6 7.2L12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}
