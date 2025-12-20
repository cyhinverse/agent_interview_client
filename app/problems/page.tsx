'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { ProblemFilters } from '@/components/problems/ProblemFilters';
import { ProblemTable } from '@/components/problems/ProblemTable';
import { Input } from '@/components/ui/input';

export default function ProblemsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Array',
    'String',
    'Dynamic Programming',
    'Tree',
    'Security',
    'Data',
  ];

  const problems = [
    {
      title: 'Distributed Consensus Loop',
      category: 'Data',
      difficulty: 'High',
      points: 400,
    },
    {
      title: 'Context Window Efficiency',
      category: 'Array',
      difficulty: 'Medium',
      points: 250,
    },
    {
      title: 'Prompt Injection Defense',
      category: 'Security',
      difficulty: 'High',
      points: 500,
    },
    {
      title: 'Heuristic Reasoning Path',
      category: 'Tree',
      difficulty: 'Medium',
      points: 300,
    },
    {
      title: 'Agentic Memory Persistence',
      category: 'Data',
      difficulty: 'Low',
      points: 150,
    },
    {
      title: 'Maximum Subarray Protocol',
      category: 'Array',
      difficulty: 'Medium',
      points: 200,
    },
    {
      title: 'Palindrome Chain Analysis',
      category: 'String',
      difficulty: 'Low',
      points: 100,
    },
    {
      title: 'Knapsack Token Optimizer',
      category: 'Dynamic Programming',
      difficulty: 'High',
      points: 450,
    },
  ];

  const filteredProblems =
    selectedCategory === 'All'
      ? problems
      : problems.filter((p) => p.category === selectedCategory);

  return (
    <div className="relative min-h-[calc(100vh-6rem)] py-20 px-6">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <h1 className="text-3xl font-medium tracking-tight text-foreground">
            Challenge Protocols
          </h1>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
            <Input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-t-0 border-x-0 border-b border-border rounded-none py-2 pl-10 pr-4 text-sm focus-visible:ring-0 focus-visible:border-primary transition-colors w-full md:w-64"
            />
          </div>
        </div>

        <ProblemFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        <ProblemTable problems={filteredProblems} />
      </div>
    </div>
  );
}
