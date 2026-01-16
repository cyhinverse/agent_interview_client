'use client';

import {
  Calendar,
  Clock,
  BarChart,
  MessageSquare,
  UserIcon,
} from 'lucide-react';
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
import { cn } from '@/lib/utils';

import { InterviewSession } from '@/features/interview/interviewApi';
import { QuestionResponse } from '@/features/questions/questionsApi';
import { EvaluationReport, User } from '@/features/users/usersApi';

interface SessionWithDetails extends InterviewSession {
  responses?: QuestionResponse[];
  report?: EvaluationReport;
  user?: User;
}

const getScoreColor = (score: number) => {
  if (score >= 80)
    return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
  if (score >= 60)
    return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
  return 'bg-red-500/10 text-red-500 border-red-500/20';
};

interface SessionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: SessionWithDetails | null;
}

export function SessionDetailModal({
  isOpen,
  onClose,
  session,
}: SessionDetailModalProps) {
  if (!session) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusVariant = (
    status: string
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'COMPLETED':
        return 'default';
      case 'IN_PROGRESS':
        return 'secondary';
      case 'FAILED':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80)
      return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    if (score >= 60)
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    return 'bg-red-500/10 text-red-500 border-red-500/20';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Session Details</DialogTitle>
              <DialogDescription className="font-mono">
                {session.id?.substring(0, 8)}...
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6 py-4">
            {/* Status & Score */}
            <div className="flex items-center gap-4">
              <Badge variant={getStatusVariant(session.status)}>
                {session.status}
              </Badge>
              {session.score !== null && (
                <div className="flex items-center gap-2">
                  <BarChart className="w-4 h-4 text-muted-foreground" />
                  <Badge
                    variant="outline"
                    className={`font-bold ${getScoreColor(session.score || 0)}`}
                  >
                    {session.score}%
                  </Badge>
                </div>
              )}
            </div>

            <Separator />

            {/* User Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <UserIcon className="w-4 h-4 text-muted-foreground" />
                Candidate
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground text-xs">Name</div>
                  <div className="font-medium">
                    {session.user?.fullName || 'Unknown'}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Email</div>
                  <div className="font-medium">
                    {session.user?.email || 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Category */}
            <div className="space-y-3">
              <div className="text-sm font-medium">Category</div>
              <Badge variant="outline">
                {session.category?.name || 'Unknown'}
              </Badge>
            </div>

            <Separator />

            {/* Timeline */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock className="w-4 h-4 text-muted-foreground" />
                Timeline
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground text-xs">Created</div>
                  <div>{formatDate(session.createdAt)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Started</div>
                  <div>{formatDate(session.startTime)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Ended</div>
                  <div>{formatDate(session.endTime)}</div>
                </div>
              </div>
            </div>

            {/* Responses */}
            {(session.responses?.length || 0) > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    Responses ({session.responses?.length || 0})
                  </div>
                  <div className="space-y-2">
                    {session.responses?.map(
                      (resp: QuestionResponse, idx: number) => (
                        <div
                          key={resp.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <span className="text-sm text-muted-foreground">
                            Question {idx + 1}
                          </span>
                          <Badge
                            variant="outline"
                            className={cn(
                              'font-bold',
                              resp.score >= 80
                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                : resp.score >= 60
                                ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                : 'bg-red-500/10 text-red-500 border-red-500/20'
                            )}
                          >
                            {resp.score}%
                          </Badge>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </>
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
