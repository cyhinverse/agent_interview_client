'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const words = [
  'AI Agents',
  'Interviews',
  'Success',
  'Excellence',
  'Engineering',
];

export default function TextCycler() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="inline-grid grid-cols-1 items-center justify-items-center">
      {/* Invisible spacer to reserve width based on the longest word */}
      <span className="col-start-1 row-start-1 opacity-0 pointer-events-none select-none invisible font-extrabold px-2">
        Engineering
      </span>

      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="col-start-1 row-start-1 font-extrabold whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-600 pb-1"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
