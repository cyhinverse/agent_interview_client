'use client';

import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProblemFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export function ProblemFilters({
  categories,
  selectedCategory,
  onCategorySelect,
}: ProblemFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-border/50">
      <div className="flex items-center gap-2 mr-4 text-muted-foreground">
        <Filter className="w-3.5 h-3.5" />
        <span className="text-[10px] uppercase font-bold tracking-widest">
          Filter:
        </span>
      </div>
      {categories.map((cat) => (
        <Button
          key={cat}
          variant={selectedCategory === cat ? 'default' : 'secondary'}
          size="sm"
          onClick={() => onCategorySelect(cat)}
          className={`h-8 px-4 rounded-full text-[11px] font-medium transition-all ${
            selectedCategory === cat
              ? ''
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {cat}
        </Button>
      ))}
    </div>
  );
}
