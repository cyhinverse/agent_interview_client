'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Play,
  Send,
  Clock,
  Trophy,
  BookOpen,
  Settings2,
  Code2,
  Terminal as TerminalIcon,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import Link from 'next/link';

export default function ProblemDetailPage() {
  const [activeTab, setActiveTab] = useState('description');
  const [isFullScreen, setIsFullScreen] = useState(false);

  const problem = {
    title: 'Distributed Consensus Loop',
    category: 'Orchestration',
    difficulty: 'High',
    points: 400,
    timeLimit: '2.0s',
    memoryLimit: '256MB',
    description: `
      Design an autonomous agent orchestration loop that ensures absolute consensus among multiple sub-agents in a high-latency environment.
      
      Your goal is to implement a robust protocol that handles node failures and context window limitations while maintaining a single thread of truth.
    `,
    examples: [
      {
        input: 'agents = 3, latency = [100, 500, 1000]',
        output: 'consensus_reached: true, duration: 1200ms',
        explanation:
          'The system waited for the majority and consolidated the context window correctly.',
      },
    ],
    constraints: [
      'Number of agents range [1, 50]',
      'Latency can vary dynamically per request.',
      'Context tokens must not exceed 4096 per cycle.',
    ],
  };

  return (
    <div
      className={`min-h-[calc(100vh-6rem)] flex flex-col pt-4 transition-all duration-300 ${
        isFullScreen ? 'fixed inset-0 z-[60] bg-background pt-6 pb-6' : ''
      }`}
    >
      {/* Top Navigation / Breadcrumbs */}
      <div
        className={`${
          isFullScreen ? 'px-10' : 'max-w-7xl mx-auto px-6'
        } w-full mb-6`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!isFullScreen && (
              <Link
                href="/problems"
                className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
            )}
            {!isFullScreen && <div className="h-4 w-px bg-border mx-2" />}
            <h1 className="text-xl font-semibold tracking-tight">
              {problem.title}
            </h1>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                problem.difficulty === 'High'
                  ? 'border-red-500/20 text-red-500 bg-red-500/5'
                  : 'border-blue-500/20 text-blue-500 bg-blue-500/5'
              }`}
            >
              {problem.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground"
              title={isFullScreen ? 'Exit Full Screen' : 'Enter Full Screen'}
            >
              {isFullScreen ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-xs font-medium transition-all">
              <Settings2 className="w-3.5 h-3.5" />
              Settings
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold transition-all hover:opacity-90 shadow-sm">
              <Send className="w-3.5 h-3.5" />
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 grid grid-cols-1 lg:grid-cols-2 gap-px bg-border ${
          isFullScreen
            ? 'w-full border-y border-border'
            : 'max-w-7xl mx-auto w-full border border-border rounded-xl'
        } overflow-hidden shadow-2xl bg-card`}
      >
        {/* Left Side: Description & Examples */}
        <div className="bg-card flex flex-col overflow-y-auto min-h-0">
          <div className="flex items-center gap-6 px-8 py-3 border-b border-border bg-muted/30 sticky top-0 z-10 backdrop-blur-sm">
            {['Description', 'Solutions', 'Submissions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`text-xs font-medium pb-3 -mb-3 border-b-2 transition-all ${
                  activeTab === tab.toLowerCase()
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-8 space-y-10">
            {/* Meta Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-muted/40 border border-border/50 space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                  <Clock className="w-3 h-3" /> Time Limit
                </div>
                <div className="text-sm font-semibold">{problem.timeLimit}</div>
              </div>
              <div className="p-4 rounded-xl bg-muted/40 border border-border/50 space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                  <Code2 className="w-3 h-3" /> Memory
                </div>
                <div className="text-sm font-semibold">
                  {problem.memoryLimit}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-muted/40 border border-border/50 space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                  <Trophy className="w-3 h-3" /> Points
                </div>
                <div className="text-sm font-semibold text-primary">
                  {problem.points}
                </div>
              </div>
            </div>

            {/* Description Text */}
            <section className="space-y-4 text-card-foreground">
              <div className="flex items-center gap-2 text-sm font-semibold italic">
                <BookOpen className="w-4 h-4" /> Context Protocol
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {problem.description}
              </p>
            </section>

            {/* Examples */}
            <section className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Example Observations
              </h4>
              {problem.examples.map((ex, i) => (
                <div key={i} className="space-y-3">
                  <div className="p-4 rounded-lg bg-muted border border-border font-mono text-xs space-y-3 shadow-inner">
                    <div className="text-muted-foreground/60">
                      # Input Queue
                    </div>
                    <div className="text-foreground">{ex.input}</div>
                    <div className="h-px bg-border/50" />
                    <div className="text-muted-foreground/60">
                      # Expected Output
                    </div>
                    <div className="text-primary">{ex.output}</div>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed px-2 italic">
                    Note: {ex.explanation}
                  </p>
                </div>
              ))}
            </section>

            {/* Constraints */}
            <section className="space-y-3 pb-8">
              <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Mission Constraints
              </h4>
              <ul className="space-y-2 px-4">
                {problem.constraints.map((c, i) => (
                  <li
                    key={i}
                    className="text-xs text-muted-foreground list-disc marker:text-primary"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        {/* Right Side: Code Editor Mockup */}
        <div className="bg-card flex flex-col border-l border-border min-h-0">
          <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-muted/20">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded text-[11px] font-semibold border border-border text-foreground">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                Python 3.10
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-muted rounded transition-colors">
                <Settings2 className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="flex-1 bg-zinc-950 font-mono text-sm p-6 overflow-y-auto relative min-h-[400px]">
            <div className="opacity-80 space-y-1">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className="flex gap-6">
                  <span className="w-6 text-right text-zinc-700 select-none text-xs">
                    {i + 1}
                  </span>
                  <div className="text-zinc-400">
                    {i === 0 && <span className="text-blue-400">class</span>}{' '}
                    {i === 0 && (
                      <span className="text-yellow-400">ProtocolSolver</span>
                    )}
                    :
                    {i === 1 && <span className="pl-6 text-blue-400">def</span>}{' '}
                    {i === 1 && (
                      <span className="text-yellow-400">solve_consensus</span>
                    )}
                    (self, agents, latency):
                    {i === 2 && (
                      <span className="pl-12 text-zinc-600">
                        # Implement orchestration logic here
                      </span>
                    )}
                    {i === 3 && (
                      <span className="pl-12 text-zinc-600">pass</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Blinking cursor effect */}
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="absolute left-[111px] top-[108px] w-0.5 h-5 bg-primary"
            />
          </div>

          {/* Console / Controls */}
          <div className="p-6 border-t border-border bg-muted/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                <TerminalIcon className="w-4 h-4" />
                Terminal Ready
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-muted hover:bg-muted/80 rounded-lg text-xs font-bold transition-all border border-border text-foreground">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Run Code
                </button>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-black border border-white/5 font-mono text-[11px] text-emerald-400 space-y-1 shadow-inner">
              <div className="opacity-70"> protocol_initialized 100%</div>
              <div className="opacity-70"> waiting for input...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
