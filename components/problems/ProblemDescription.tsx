'use client';

import { Clock, Code2, Trophy, BookOpen } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity as ReactActivity, ViewTransition } from 'react';

interface Example {
  input: string;
  output: string;
  explanation: string;
}

interface Problem {
  timeLimit: string;
  memoryLimit: string;
  points: number;
  description: string;
  examples: Example[];
  constraints: string[];
}

interface ProblemDescriptionProps {
  problem: Problem;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function ProblemDescription({
  problem,
  activeTab,
  onTabChange,
}: ProblemDescriptionProps) {
  return (
    <div className="bg-card flex flex-col overflow-y-auto min-h-0">
      <div className="border-b border-border bg-muted/30 sticky top-0 z-10 backdrop-blur-sm">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b-0 bg-transparent h-12 px-8 gap-6">
            {['Description', 'Solutions', 'Submissions'].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab.toLowerCase()}
                className="text-xs font-medium px-0 pb-3 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 relative">
        <ViewTransition>
          {/* Description Tab */}
          <ReactActivity
            mode={activeTab === 'description' ? 'visible' : 'hidden'}
          >
            <div className="p-8 space-y-10">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-muted/40 border border-border/50 space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                    <Clock className="w-3 h-3" /> Time Limit
                  </div>
                  <div className="text-sm font-semibold">
                    {problem.timeLimit}
                  </div>
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

              <section className="space-y-4 text-card-foreground">
                <div className="flex items-center gap-2 text-sm font-semibold italic">
                  <BookOpen className="w-4 h-4" /> Context Protocol
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {problem.description}
                </p>
              </section>

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
          </ReactActivity>

          {/* Solutions Tab */}
          <ReactActivity
            mode={activeTab === 'solutions' ? 'visible' : 'hidden'}
          >
            <div className="p-8">
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-sm italic">
                  Scanning for optimal solutions...
                </p>
              </div>
            </div>
          </ReactActivity>

          {/* Submissions Tab */}
          <ReactActivity
            mode={activeTab === 'submissions' ? 'visible' : 'hidden'}
          >
            <div className="p-8">
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-sm italic">No protocol submissions found.</p>
              </div>
            </div>
          </ReactActivity>
        </ViewTransition>
      </div>
    </div>
  );
}
