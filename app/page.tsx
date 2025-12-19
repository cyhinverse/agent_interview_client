"use client"

import { motion, Variants } from "framer-motion"
import TextCycler from "@/components/common/TextCycler"

export default function Home() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  return (
    <div className="relative w-full overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-6">
        <motion.div 
          className="flex flex-col items-center justify-center min-h-screen text-center space-y-8 py-20"
          variants={containerVariants}
          initial="hidden"
          animate={{
            opacity: 1,
            y: [0, -8, 0],
            transition: {
              opacity: { duration: 0.5 },
              y: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              },
              staggerChildren: 0.2,
            }
          }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary mb-2 shadow-sm backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Leading AI Interview Platform
          </motion.div>

          <motion.h2 
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight max-w-4xl"
          >
            Mastering the Future <br />
            of <TextCycler />
          </motion.h2>

          <motion.p 
            variants={itemVariants}
            className="text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed font-light px-4"
          >
            Step into the next generation of technical assessment. Our platform simulates 
            complex AI agent workflows to help you build, scale, and master 
            autonomous systems.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <button className="group relative px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-105 transition-all duration-300 active:scale-95 overflow-hidden">
              <span className="relative z-10">Start Practicing Free</span>
            </button>
            <button className="px-6 py-3 bg-background/40 backdrop-blur-md text-foreground border border-border/40 rounded-xl font-bold text-sm hover:bg-accent/50 transition-all duration-300 active:scale-95">
              Explore Roadmap
            </button>
          </motion.div>

          {/* Brands section with subtle animation */}
          <motion.div 
            variants={itemVariants}
            className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40"
          >
            {['OpenAI', 'Anthropic', 'LangChain', 'AutoGPT'].map((brand) => (
              <span key={brand} className="text-[10px] font-bold tracking-[0.2em] uppercase">{brand}</span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
