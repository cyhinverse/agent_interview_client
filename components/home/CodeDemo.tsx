'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Terminal, Play, FileJson, Sparkles, Hash } from 'lucide-react';

const codeSnippet = `
  // Use a hash map for O(1) lookups
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return [];
}`;

export default function CodeDemo({ isInView }: { isInView: boolean }) {
  const [text, setText] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'typing' | 'running' | 'success'
  >('idle');

  useEffect(() => {
    if (isInView && status === 'idle') {
      const t = setTimeout(() => setStatus('typing'), 400);
      return () => clearTimeout(t);
    }
  }, [isInView, status]);

  useEffect(() => {
    if (status === 'typing') {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < codeSnippet.length) {
          setText(codeSnippet.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(interval);
          setTimeout(() => setStatus('running'), 500);
        }
      }, 20);
      return () => clearInterval(interval);
    }
  }, [status]);

  useEffect(() => {
    if (status === 'running') {
      const timer = setTimeout(() => {
        setStatus('success');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Reset loop
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        setText('');
        setStatus('idle');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <div className="w-full h-full bg-[#131418] flex flex-col md:flex-row text-xs font-mono overflow-hidden rounded-[24px] border border-white/5 shadow-[0_0_80px_-20px_rgba(66,133,244,0.15)] ring-1 ring-white/5 relative z-10 transition-shadow duration-500 hover:shadow-[0_0_100px_-20px_rgba(66,133,244,0.25)]">
      {/* Activity Bar */}
      <div className="hidden md:flex flex-col w-14 border-r border-[#24262b] bg-[#1a1b1f] items-center py-5 gap-3 shrink-0">
        <div className="p-2.5 rounded-full bg-[#3c4043] text-white shadow-sm">
          <FileJson size={18} strokeWidth={2} />
        </div>
        <div className="p-2.5 rounded-full hover:bg-[#323639] text-[#9aa0a6] transition-colors cursor-pointer">
          <Terminal size={18} strokeWidth={2} />
        </div>
        <div className="p-2.5 rounded-full hover:bg-[#323639] text-[#9aa0a6] transition-colors cursor-pointer">
          <Hash size={18} strokeWidth={2} />
        </div>
      </div>

      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-56 border-r border-[#24262b] bg-[#131418] shrink-0 font-sans">
        <div className="h-12 border-b border-[#24262b] flex items-center px-5 font-semibold text-[#bdc1c6] text-[11px] uppercase tracking-wider bg-[#131418]">
          Problem
        </div>
        <div className="p-5 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar">
          <div className="space-y-3">
            <h3 className="font-bold text-white text-base tracking-tight">
              1. Two Sum
            </h3>
            <div className="flex gap-2">
              <span className="px-2.5 py-1 rounded-full text-[#9aa0a6] text-[10px] font-bold bg-[#3c4043] tracking-wide">
                EASY
              </span>
              <span className="px-2.5 py-1 rounded-full text-[#9aa0a6] text-[10px] font-bold bg-[#3c4043] tracking-wide">
                ARRAYS
              </span>
            </div>
          </div>

          <p className="text-[#9aa0a6] leading-relaxed text-xs">
            Given an array of integers{' '}
            <code className="bg-[#24262b] px-1.5 py-0.5 rounded text-white font-medium">
              nums
            </code>{' '}
            and an integer{' '}
            <code className="bg-[#24262b] px-1.5 py-0.5 rounded text-white font-medium">
              target
            </code>
            , return indices of the two numbers such that they add up to target.
          </p>

          <div className="mt-auto relative group pt-4">
            <div className="absolute -inset-0.5 bg-[#8AB4F8] rounded-xl opacity-0 blur-sm group-hover:opacity-10 transition-opacity" />
            <div className="relative p-4 rounded-lg bg-[#202124] border border-[#3c4043]">
              <div className="flex items-center gap-2 text-[#9aa0a6] font-bold mb-2 text-xs">
                <Sparkles size={14} className="text-[#9aa0a6]" />
                <span>AI Hint</span>
              </div>
              <p className="text-[#e8eaed] text-[11px] opacity-90 leading-tight">
                Try optimizing with a Hash Map for O(1) lookups.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main IDE */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#131418] text-left relative">
        {/* Tab */}
        <div className="flex items-center h-12 border-b border-[#24262b] bg-[#131418] font-sans">
          <div className="flex items-center gap-2 px-5 h-full bg-[#131418] text-[#e8eaed] text-xs font-medium border-t-2 border-t-[#8ab4f8]">
            <div className="w-2 h-2 rounded-full bg-[#f28b82]" />
            solution.js
          </div>
          <div className="flex items-center gap-2 px-5 h-full bg-transparent text-[#5f6368] text-xs font-medium cursor-pointer hover:text-[#e8eaed] transition-colors">
            tests.js
          </div>
        </div>

        <div className="flex-1 p-6 overflow-hidden relative group flex font-mono text-[13px] leading-7 will-change-contents">
          {/* Line Nums */}
          <div className="flex flex-col text-[#454746] select-none pr-6 text-right min-w-[32px] font-medium text-xs pt-0.5">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          <div className="relative flex-1">
            <pre className="text-[#a8aeb4]">
              <code>
                <span className="text-[#f28b82] font-semibold">function</span>{' '}
                <span className="text-[#8ab4f8] font-semibold">twoSum</span>
                <span className="text-[#e8eaed]">(</span>nums, target
                <span className="text-[#e8eaed]">)</span> {'{'}
                {'\n'}
                {text.split('\n').map((line, i) => (
                  <span
                    key={i}
                    className={
                      line.trim().startsWith('//')
                        ? 'text-[#5f6368] italic'
                        : ''
                    }
                  >
                    {line}
                    {'\n'}
                  </span>
                ))}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-2 h-4 bg-[#8ab4f8] align-middle ml-1 rounded-sm"
                />
              </code>
            </pre>
          </div>

          {/* Button - Google Style Pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-6 right-6 z-20"
          >
            <button
              className={`
                 flex items-center gap-2 px-6 py-2.5 rounded-full font-medium text-xs tracking-wide shadow-xl transition-all duration-300 font-sans
                 ${
                   status === 'success'
                     ? 'bg-[#188038] text-white shadow-[#188038]/30 ring-1 ring-[#188038]/50'
                     : 'bg-white text-[#202124] hover:bg-[#f8f9fa] ring-1 ring-[#DADCE0]'
                 }
              `}
            >
              {status === 'running' ? (
                <span className="animate-spin text-[#1a73e8]">⟳</span>
              ) : status === 'success' ? (
                <Check size={14} strokeWidth={3} />
              ) : (
                <Play
                  size={14}
                  fill="currentColor"
                  className="text-[#1a73e8]"
                />
              )}
              {status === 'running'
                ? 'Compiling...'
                : status === 'success'
                ? 'Solved'
                : 'Run'}
            </button>
          </motion.div>

          {/* Success Card - Glassy */}
          <AnimatePresence>
            {status === 'success' && (
              <motion.div
                initial={{ y: 20, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                className="absolute inset-x-6 bottom-20 p-5 bg-[#202124]/95 border border-[#3c4043] rounded-2xl shadow-2xl backdrop-blur-xl font-sans"
              >
                <div className="flex gap-4 items-center">
                  <div className="bg-[#1e8e3e]/20 p-2.5 rounded-full">
                    <Check size={18} className="text-[#81c995]" />
                  </div>
                  <div>
                    <div className="text-[#e8eaed] font-bold text-sm">
                      All Tests Passed
                    </div>
                    <div className="text-[#9aa0a6] text-xs mt-0.5">
                      Runtime: 1ms • Memory: 40MB
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Minimal Status Bar */}
        <div className="h-8 bg-[#131418] border-t border-[#24262b] flex items-center px-5 text-[11px] text-[#9aa0a6] font-medium justify-between select-none font-sans">
          <div className="flex gap-4">
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#81c995]"></div>{' '}
              Ready
            </span>
          </div>
          <div className="opacity-60 flex gap-4">
            <span>Main</span>
            <span>JavaScript</span>
            <span>UTF-8</span>
          </div>
        </div>
      </div>
    </div>
  );
}
