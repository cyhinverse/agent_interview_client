'use client';

import { AgentCard } from '@/components/interview/AgentCard';
import { useInterviewCategories } from '@/hooks/useInterviewCategories';
import { Loader2 } from 'lucide-react';

export default function InterviewPage() {
  // Fetch interview categories using React Query
  const { 
    data: categories, 
    isLoading, 
    error,
    refetch 
  } = useInterviewCategories();

  const getComplexityLevel = (index: number) => {
    const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    return levels[index % levels.length];
  };

  const getAgentType = (slug: string) => {
    const typeMap: Record<string, string> = {
      'system-design': 'System Design',
      'algorithm': 'Algorithm',
      'behavioral': 'Behavioral',
    };
    return typeMap[slug] || 'Technical';
  };

  if (isLoading) {
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
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (error && (!categories || categories.length === 0)) {
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
          <div className="text-center py-20">
            <p className="text-destructive mb-4">Failed to load interview categories. Please try again later.</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          {error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">Failed to load some data. Showing cached results.</p>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories?.map((category, index) => (
            <AgentCard 
              key={category.id} 
              agent={{
                id: category.id,
                name: category.name,
                type: getAgentType(category.slug),
                desc: category.systemPrompt,
                complexity: getComplexityLevel(index),
              }} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
