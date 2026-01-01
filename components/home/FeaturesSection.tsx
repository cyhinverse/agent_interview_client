'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import InterviewDemo from './InterviewDemo';
import CodeDemo from './CodeDemo';

export default function FeaturesSection() {
  return (
    <div className="w-full relative overflow-hidden">
      <div className="space-y-32 pb-32 pt-20">
        <FeatureBlock
          title="Master the Technical Interview"
          description="Practice with an AI that adapts to your responses in real-time. Get instant feedback on your communication and problem-solving skills."
          badge="AI INTERVIEWER"
          align="left"
        >
          <InterviewDemoWrapper />
        </FeatureBlock>

        <FeatureBlock
          title="Code Live, Without Limits"
          description="Experience a realistic coding environment with integrated hints, test cases, and performance analysis. It feels just like the real thing."
          badge="LIVE CODING ENVIRONMENT"
          align="right"
        >
          <CodeDemoWrapper />
        </FeatureBlock>
      </div>
    </div>
  );
}

function FeatureBlock({
  title,
  description,
  children,
  align,
  badge,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  align: 'left' | 'right';
  badge: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: '-20% 0px -20% 0px', amount: 0.3 });

  return (
    <div
      ref={ref}
      className="max-w-[1400px] mx-auto px-6 grid md:grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center font-sans"
    >
      {/* Text Side */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }} // Google Ease
        className={`lg:col-span-5 flex flex-col justify-center ${
          align === 'left' ? 'lg:order-2 lg:pl-10' : 'lg:pr-10'
        }`}
      >
        <div className="mb-6 flex">
          <span className="bg-[#e8f0fe] text-[#1967d2] border-[#d2e3fc] dark:bg-white/10 dark:text-[#a8c7fa] dark:border-white/10 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase border shadow-sm backdrop-blur-sm transition-colors duration-300">
            {badge}
          </span>
        </div>
        <h2 className="text-4xl md:text-[56px] leading-[1.1] font-medium text-[#202124] dark:text-white tracking-tight mb-6 transition-colors duration-300">
          {title}
        </h2>
        <p className="text-lg md:text-xl text-[#5f6368] dark:text-[#9aa0a6] leading-relaxed font-normal transition-colors duration-300">
          {description}
        </p>

        <div className="mt-8">
          <button className="text-[#8ab4f8] font-medium text-lg hover:text-[#aecbfa] transition-colors flex items-center gap-2 group">
            Learn more
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </button>
        </div>
      </motion.div>

      {/* Visual Side */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.2, 0.65, 0.3, 0.9] }}
        className={`lg:col-span-7 w-full ${
          align === 'left' ? 'lg:order-1' : ''
        }`}
      >
        {children}
      </motion.div>
    </div>
  );
}

function CodeDemoWrapper() {
  const ref = useRef(null);
  const isInView = useInView(ref);
  return (
    <div ref={ref} className="h-[520px] w-full">
      <CodeDemo isInView={isInView} />
    </div>
  );
}

function InterviewDemoWrapper() {
  const ref = useRef(null);
  const isInView = useInView(ref);
  return (
    <div ref={ref} className="h-[520px] w-full">
      <InterviewDemo isInView={isInView} />
    </div>
  );
}
