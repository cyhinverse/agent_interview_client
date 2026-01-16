'use client';

import { BarChart, Eye, Trash2 } from 'lucide-react';
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
import { EvaluationReport } from '@/features/users/usersApi';
import { useDeleteReport } from '@/hooks/useAdmin';
import { toast } from 'sonner';

interface ReportManagementTableProps {
  reports: EvaluationReport[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onView?: (report: EvaluationReport) => void;
}

export function ReportManagementTable({
  reports,
  isLoading,
  onRefresh,
  onView,
}: ReportManagementTableProps) {
  const { mutate: deleteReport } = useDeleteReport();

  const getScoreClass = (score: number) => {
    if (score >= 80)
      return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    if (score >= 60)
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    return 'bg-red-500/10 text-red-500 border-red-500/20';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleDelete = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;
    try {
      await deleteReport(reportId);
      onRefresh?.();
    } catch (error) {
      console.error('Failed to delete report:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        Loading reports...
      </div>
    );
  }

  if (!reports?.length) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <BarChart className="w-12 h-12 mx-auto mb-4 opacity-20" />
        <p className="text-muted-foreground">No reports found</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Overall</TableHead>
              <TableHead>Technical</TableHead>
              <TableHead>Communication</TableHead>
              <TableHead>Problem Solving</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                  <Badge variant="outline">
                    {report.session?.category?.name || 'Unknown'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`font-bold ${getScoreClass(
                      report.overallScore
                    )}`}
                  >
                    {report.overallScore}%
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`font-bold ${getScoreClass(
                      report.technicalScore
                    )}`}
                  >
                    {report.technicalScore}%
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`font-bold ${getScoreClass(
                      report.communicationScore
                    )}`}
                  >
                    {report.communicationScore}%
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`font-bold ${getScoreClass(
                      report.problemSolvingScore
                    )}`}
                  >
                    {report.problemSolvingScore}%
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(report.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onView?.(report)}
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
                          onClick={() => handleDelete(report.id)}
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
