'use client';

import { AgentCard } from '@/components/interview/AgentCard';

export default function InterviewPage() {
  const agents = [
    {
      name: 'Nexus-01 Architecture',
      type: 'System Design',
      desc: 'Comprehensive assessment of distributed systems and agent orchestration.',
      complexity: 'Level 4',
    },
    {
      name: 'Sentinel Security',
      type: 'Alignment & Safety',
      desc: 'Focusing on prompt injection defense and safety guardrail implementations.',
      complexity: 'Level 3',
    },
    {
      name: 'Logic Engine Pro',
      type: 'Efficiency',
      desc: 'Evaluating token economy and reasoning path optimization.',
      complexity: 'Expert',
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-6rem)] py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-16">
          <h1 className="text-3xl font-medium tracking-tight mb-4">
            Interview Protocols
          </h1>
          <p className="text-muted-foreground text-sm max-w-sm">
            Select an autonomous evaluation agent to begin the assessment.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent, index) => (
            <AgentCard key={index} agent={agent} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
