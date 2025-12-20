'use client';

import { useState, lazy, Suspense } from 'react';
import { ProblemHeader } from '@/components/problems/ProblemHeader';

const ProblemDescription = lazy(() =>
  import('@/components/problems/ProblemDescription').then((m) => ({
    default: m.ProblemDescription,
  }))
);
const EditorPanel = lazy(() =>
  import('@/components/problems/EditorPanel').then((m) => ({
    default: m.EditorPanel,
  }))
);

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
        isFullScreen ? 'fixed inset-0 z-60 bg-background pt-6 pb-6' : ''
      }`}
    >
      <ProblemHeader
        title={problem.title}
        difficulty={problem.difficulty}
        isFullScreen={isFullScreen}
        onToggleFullScreen={() => setIsFullScreen(!isFullScreen)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 grid grid-cols-1 lg:grid-cols-2 gap-px bg-border ${
          isFullScreen
            ? 'w-full border-y border-border'
            : 'max-w-7xl mx-auto w-full border border-border rounded-xl'
        } overflow-hidden shadow-2xl bg-card`}
      >
        <Suspense
          fallback={
            <div className="p-8 space-y-4 animate-pulse">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-32 bg-muted rounded" />
              <div className="h-32 bg-muted rounded" />
            </div>
          }
        >
          <ProblemDescription
            problem={problem}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </Suspense>

        <Suspense
          fallback={
            <div className="flex-1 bg-zinc-950 flex items-center justify-center">
              <div className="text-zinc-500 font-mono text-sm animate-pulse">
                Initializing Editor...
              </div>
            </div>
          }
        >
          <EditorPanel />
        </Suspense>
      </div>
    </div>
  );
}
