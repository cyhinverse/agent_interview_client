'use client';

import { motion, Variants } from 'framer-motion';
import TextCycler from '@/components/common/TextCycler';
import Link from 'next/link';

import FeaturesSection from '@/components/home/FeaturesSection';

export default function Home() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div className="w-full max-w-6xl mx-auto px-6">
        <motion.div
          className="flex flex-col items-center justify-center min-h-[85vh] text-center space-y-8 py-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2 mr-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            AI-Powered Interview Practice
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-4xl"
          >
            Master Your Next{' '}
            <span className="text-primary">Technical Interview</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-muted-foreground text-base md:text-lg max-w-xl leading-relaxed"
          >
            Practice technical interviews with AI. Get real-time feedback,
            improve your skills, and land your dream job.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <Link
              href="/interview"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity active:scale-[0.98]"
            >
              Start Practicing
            </Link>
            <Link
              href="/problems"
              className="px-6 py-3 bg-secondary text-secondary-foreground border border-border rounded-xl font-semibold text-sm hover:bg-accent transition-colors active:scale-[0.98]"
            >
              Browse Problems
            </Link>
          </motion.div>

          {/* Features Showcase Section */}
          <div className="w-full pt-20">
            <FeaturesSection />
          </div>

          {/* Trust indicators */}
          <motion.div
            variants={itemVariants}
            className="pt-16 flex flex-col items-center gap-4"
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Trusted by engineers preparing for
            </p>
            <div className="flex items-center gap-8 text-muted-foreground/50">
              {['Google', 'Meta', 'OpenAI', 'Anthropic'].map((company) => (
                <span
                  key={company}
                  className="text-sm font-semibold tracking-wide"
                >
                  {company}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
