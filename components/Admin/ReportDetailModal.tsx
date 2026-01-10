'use client';

import { BarChart, ThumbsUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EvaluationReport } from '@/features/users/usersApi';

interface ReportDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: EvaluationReport | null;
}

export function ReportDetailModal({
  isOpen,
  onClose,
  report,
}: ReportDetailModalProps) {
  if (!report) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getScoreVariant = (
    score: number
  ): 'default' | 'secondary' | 'destructive' => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <BarChart className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Evaluation Report</DialogTitle>
              <DialogDescription>
                {formatDate(report.createdAt)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6 py-4">
            {/* Overall Score */}
            <div className="text-center p-6 rounded-xl bg-muted/50">
              <div className="text-sm text-muted-foreground mb-2">
                Overall Score
              </div>
              <Badge
                variant={getScoreVariant(report.overallScore)}
                className="text-3xl px-6 py-2"
              >
                {report.overallScore}%
              </Badge>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-muted/30">
                <div className="text-xs text-muted-foreground mb-1">
                  Technical
                </div>
                <Badge variant={getScoreVariant(report.technicalScore)}>
                  {report.technicalScore}%
                </Badge>
              </div>
              <div className="text-center p-4 rounded-xl bg-muted/30">
                <div className="text-xs text-muted-foreground mb-1">
                  Communication
                </div>
                <Badge variant={getScoreVariant(report.communicationScore)}>
                  {report.communicationScore}%
                </Badge>
              </div>
              <div className="text-center p-4 rounded-xl bg-muted/30">
                <div className="text-xs text-muted-foreground mb-1">
                  Problem Solving
                </div>
                <Badge variant={getScoreVariant(report.problemSolvingScore)}>
                  {report.problemSolvingScore}%
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Feedback */}
            {report.feedback && (
              <div className="space-y-2">
                <div className="text-sm font-medium">AI Feedback</div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {report.feedback}
                </p>
              </div>
            )}

            {/* Strengths */}
            {report.strengths?.length > 0 && (
              <div className="space-y-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                  <ThumbsUp className="w-4 h-4" />
                  Strengths
                </div>
                <ul className="space-y-2">
                  {report.strengths.map((s, i) => (
                    <li key={i} className="text-sm flex gap-2">
                      <span className="text-emerald-500">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Areas for Improvement */}
            {report.areasForImprovement?.length > 0 && (
              <div className="space-y-3 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
                <div className="flex items-center gap-2 text-sm font-medium text-yellow-600">
                  <AlertTriangle className="w-4 h-4" />
                  Areas for Improvement
                </div>
                <ul className="space-y-2">
                  {report.areasForImprovement.map((a, i) => (
                    <li key={i} className="text-sm flex gap-2">
                      <span className="text-yellow-500">•</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {report.recommendations?.length > 0 && (
              <div className="space-y-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
                  <Lightbulb className="w-4 h-4" />
                  Recommendations
                </div>
                <ul className="space-y-2">
                  {report.recommendations.map((r, i) => (
                    <li key={i} className="text-sm flex gap-2">
                      <span className="text-blue-500">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
