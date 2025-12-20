'use client';

import { Profiler, type ProfilerOnRenderCallback } from 'react';
import { Terminal } from 'lucide-react';
import Link from 'next/link';

interface Problem {
  title: string;
  category: string;
  difficulty: 'High' | 'Medium' | 'Low' | string;
  points: number;
}

interface ProblemTableProps {
  problems: Problem[];
}

export function ProblemTable({ problems }: ProblemTableProps) {
  const onRender: ProfilerOnRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration
  ) => {
    console.debug(
      `[Profiler] ${id} (${phase}): ${actualDuration.toFixed(
        2
      )}ms (base: ${baseDuration.toFixed(2)}ms)`
    );
  };

  return (
    <Profiler id="ProblemTable" onRender={onRender}>
      <div className="border border-border rounded-xl overflow-hidden bg-card shadow-lg">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-[10px] uppercase tracking-widest text-muted-foreground/60 font-mono">
              <th className="px-6 py-4 font-normal">Protocol Name</th>
              <th className="px-6 py-4 font-normal">Category</th>
              <th className="px-6 py-4 font-normal">Difficulty</th>
              <th className="px-6 py-4 font-normal text-right">Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50 text-card-foreground">
            {problems.length > 0 ? (
              problems.map((prob, i) => (
                <tr
                  key={i}
                  className="group hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-5">
                    <Link
                      href={`/problems/${i}`}
                      className="flex items-center gap-3"
                    >
                      <Terminal className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                      <span className="font-medium">{prob.title}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-5 text-muted-foreground font-light">
                    {prob.category}
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                        prob.difficulty === 'High'
                          ? 'border-red-500/20 text-red-400'
                          : prob.difficulty === 'Medium'
                          ? 'border-blue-500/20 text-blue-400'
                          : 'border-zinc-500/20 text-zinc-400'
                      }`}
                    >
                      {prob.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right font-mono text-xs text-muted-foreground">
                    {prob.points}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-20 text-center text-muted-foreground italic"
                >
                  No protocols found for this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Profiler>
  );
}
