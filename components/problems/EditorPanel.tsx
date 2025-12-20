'use client';

import { Profiler, type ProfilerOnRenderCallback } from 'react';
import { motion } from 'framer-motion';
import { Settings2, Terminal as TerminalIcon, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EditorPanel() {
  const onRender: ProfilerOnRenderCallback = (
    id,
    phase,
    actualDuration,
    _baseDuration,
    _startTime,
    _commitTime
  ) => {
    // In a real app, you might send this to an analytics service
    console.debug(
      `[Profiler] ${id} (${phase}): ${actualDuration.toFixed(
        2
      )}ms (base: ${_baseDuration.toFixed(2)}ms, start: ${_startTime.toFixed(
        2
      )}ms, commit: ${_commitTime.toFixed(2)}ms)`
    );
  };

  return (
    <Profiler id="EditorPanel" onRender={onRender}>
      <div className="bg-card flex flex-col border-l border-border min-h-0">
        <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-muted/20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded text-[11px] font-semibold border border-border text-foreground">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              Python 3.10
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings2 className="w-4 h-4 text-muted-foreground" />
            </Button>
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
                  :{i === 1 && <span className="pl-6 text-blue-400">def</span>}{' '}
                  {i === 1 && (
                    <span className="text-yellow-400">solve_consensus</span>
                  )}
                  (self, agents, latency):
                  {i === 2 && (
                    <span className="pl-12 text-zinc-600">
                      # Implement orchestration logic here
                    </span>
                  )}
                  {i === 3 && <span className="pl-12 text-zinc-600">pass</span>}
                </div>
              </div>
            ))}
          </div>

          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute left-[111px] top-[108px] w-0.5 h-5 bg-primary"
          />
        </div>

        <div className="p-6 border-t border-border bg-muted/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <TerminalIcon className="w-4 h-4" />
              Terminal Ready
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="sm"
                className="h-9 gap-2 font-bold border-border"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Run Code
              </Button>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-black border border-white/5 font-mono text-[11px] text-emerald-400 space-y-1 shadow-inner">
            <div className="opacity-70"> protocol_initialized 100%</div>
            <div className="opacity-70"> waiting for input...</div>
          </div>
        </div>
      </div>
    </Profiler>
  );
}
