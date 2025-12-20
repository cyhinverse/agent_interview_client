'use client';

import {
  ChevronLeft,
  Maximize2,
  Minimize2,
  Settings2,
  Send,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ProblemHeaderProps {
  title: string;
  difficulty: string;
  isFullScreen: boolean;
  onToggleFullScreen: () => void;
}

export function ProblemHeader({
  title,
  difficulty,
  isFullScreen,
  onToggleFullScreen,
}: ProblemHeaderProps) {
  return (
    <div
      className={`${
        isFullScreen ? 'px-10' : 'max-w-7xl mx-auto px-6'
      } w-full mb-6`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {!isFullScreen && (
            <Link
              href="/problems"
              className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
          )}
          {!isFullScreen && <div className="h-4 w-px bg-border mx-2" />}
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
              difficulty === 'High'
                ? 'border-red-500/20 text-red-500 bg-red-500/5'
                : 'border-blue-500/20 text-blue-500 bg-blue-500/5'
            }`}
          >
            {difficulty}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFullScreen}
            className="text-muted-foreground"
            title={isFullScreen ? 'Exit Full Screen' : 'Enter Full Screen'}
          >
            {isFullScreen ? (
              <Minimize2 className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
          </Button>
          <Button variant="secondary" size="sm" className="gap-2 font-medium">
            <Settings2 className="w-3.5 h-3.5" />
            Settings
          </Button>
          <Button size="sm" className="gap-2 font-bold shadow-sm">
            <Send className="w-3.5 h-3.5" />
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
