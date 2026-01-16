'use client';

import { useState } from 'react';
import { Search, Loader2, FileText, FolderOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useInterviewCategories } from '@/hooks/useInterviewCategories';
import Link from 'next/link';

export default function ProblemsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch interview categories using React Query
  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useInterviewCategories();

  const filteredCategories =
    categories?.filter((cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  if (isLoadingCategories) {
    return (
      <div className="relative min-h-[calc(100vh-6rem)] py-20 px-6">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <h1 className="text-3xl font-medium tracking-tight text-foreground">
              Interview Categories
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
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-foreground">
              Interview Categories
            </h1>
            <p className="text-muted-foreground mt-2">
              Browse available categories and start your AI-powered interview
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
            <Input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-t-0 border-x-0 border-b border-border rounded-none py-2 pl-10 pr-4 text-sm focus-visible:ring-0 focus-visible:border-primary transition-colors w-full md:w-64"
            />
          </div>
        </div>

        {categoriesError && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">
              Failed to load categories.
            </p>
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <Link
              key={category.id}
              href={`/interview?category=${category.id}`}
              className="group block"
            >
              <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <FolderOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {category.systemPrompt
                        ? category.systemPrompt.substring(0, 100) + '...'
                        : 'AI-powered interview category'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    <span>AI-generated questions</span>
                  </div>
                  <span className="text-xs text-primary font-medium">
                    Start Interview →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredCategories.length === 0 && !isLoadingCategories && (
          <div className="text-center py-20">
            <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No categories found</p>
          </div>
        )}
      </div>
    </div>
  );
}
