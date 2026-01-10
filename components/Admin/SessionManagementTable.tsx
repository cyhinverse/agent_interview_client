'use client';

import { Calendar, User, Clock, BarChart, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { InterviewSession } from '@/features/interview/interviewApi';
import { useDeleteSession } from '@/hooks/useAdmin';
import { toast } from 'sonner';

interface SessionManagementTableProps {
  sessions: InterviewSession[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onView?: (session: InterviewSession) => void;
}

export function SessionManagementTable({
  sessions,
  isLoading,
  onRefresh,
  onView,
}: SessionManagementTableProps) {
  const deleteSession = useDeleteSession();

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (startTime: string | null, endTime: string | null) => {
    if (!startTime || !endTime) return 'N/A';
    const duration = Math.floor(
      (new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000
    );
    if (duration < 60) return `${duration}m`;
    return `${Math.floor(duration / 60)}h ${duration % 60}m`;
  };

  const handleDelete = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return;
    try {
      await deleteSession.mutateAsync(sessionId);
      toast.success('Session deleted successfully');
      onRefresh?.();
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        Loading sessions...
      </div>
    );
  }

  if (!sessions?.length) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
        <p className="text-muted-foreground">No sessions found</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Session</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell className="font-mono text-xs">
                  {session.id.substring(0, 8)}...
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm font-mono">
                      {session.userId.substring(0, 8)}...
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {session.category?.name || 'Unknown'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(session.status)}>
                    {session.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm">
                      {formatDuration(session.startTime, session.endTime)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {session.score != null ? (
                    <Badge
                      variant={
                        (session.score ?? 0) >= 70 ? 'default' : 'secondary'
                      }
                    >
                      {session.score}%
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">N/A</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(session.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onView?.(session)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>View Details</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(session.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
