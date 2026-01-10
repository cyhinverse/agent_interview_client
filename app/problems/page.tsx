'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { ProblemFilters } from '@/components/problems/ProblemFilters';
import { ProblemTable } from '@/components/problems/ProblemTable';
import { Input } from '@/components/ui/input';
import { useQuestions } from '@/hooks/useQuestionBanks';
import { useInterviewCategories } from '@/hooks/useInterviewCategories';

interface Problem {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  points: number;
}

export default function ProblemsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch questions using React Query
  const { 
    data: questions, 
    isLoading: isLoadingQuestions, 
    error: questionsError,
    refetch: refetchQuestions 
  } = useQuestions();

  // Fetch interview categories using React Query
  const { 
    data: categories, 
    isLoading: isLoadingCategories,
    error: categoriesError 
  } = useInterviewCategories();

  const getPointsByDifficulty = (difficulty: string | null): number => {
    switch (difficulty?.toLowerCase()) {
      case 'low': return 100;
      case 'medium': return 250;
      case 'high': return 500;
      default: return 200;
    }
  };

  // Format categories for filter
  const categoryOptions = ['All', ...(categories?.map(cat => cat.name) || [])];

  // Format problems for display
  const formattedProblems: Problem[] = (questions || []).map((question) => ({
    id: question.id,
    title: question.questionText.substring(0, 50) + (question.questionText.length > 50 ? '...' : ''),
    category: question.category?.name || 'Uncategorized',
    difficulty: question.difficulty || 'Medium',
    points: getPointsByDifficulty(question.difficulty),
  }));

  const filteredProblems = formattedProblems.filter(problem => {
    const matchesCategory = selectedCategory === 'All' || problem.category === selectedCategory;
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         problem.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isLoading = isLoadingQuestions || isLoadingCategories;
  const error = questionsError || categoriesError;

  if (isLoading) {
    return (
      <div className="relative min-h-[calc(100vh-6rem)] py-20 px-6">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <h1 className="text-3xl font-medium tracking-tight text-foreground">
              Challenge Protocols
            </h1>
          </div>
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-t-0 border-x-0 border-b border-border rounded-none py-2 pl-10 pr-4 text-sm focus-visible:ring-0 focus-visible:border-primary transition-colors w-full md:w-64"
            />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">Failed to load data. Showing cached results.</p>
            <button
              onClick={() => {
                refetchQuestions();
              }}
              className="mt-2 px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
            >
              Retry
            </button>
          </div>
        )}

        <ProblemFilters
          categories={categoryOptions}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        <ProblemTable problems={filteredProblems} />
      </div>
    </div>
  );
}
