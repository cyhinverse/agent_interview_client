'use client';

import { useState } from 'react';
import {
  MessageSquare,
  RefreshCw,
  Filter,
  User,
  FileText,
  Calendar,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/Pagination';
import { useAdminResponses, useDeleteResponse } from '@/hooks/useAdmin';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ResponsesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const skip = (currentPage - 1) * pageSize;
  const {
    data: responses,
    isLoading,
    refetch,
  } = useAdminResponses(skip, pageSize);
  const { mutate: deleteResponse } = useDeleteResponse();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleDelete = async (responseId: string) => {
    if (!confirm('Are you sure you want to delete this response?')) return;
    try {
      await deleteResponse(responseId);
      toast.success('Response deleted successfully');
      refetch();
    } catch (error) {
      console.error('Failed to delete response:', error);
    }
  };

  const totalItems = responses?.length || 0;
  const hasMore = totalItems === pageSize;
  const estimatedTotalPages = hasMore ? currentPage + 1 : currentPage;

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'bg-emerald-500/20 text-emerald-500';
    if (score >= 60) return 'bg-yellow-500/20 text-yellow-500';
    return 'bg-red-500/20 text-red-500';
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (isLoading && !responses) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Question Responses
          </h1>
          <p className="text-muted-foreground mt-2">
            View and manage candidate responses
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{totalItems}</div>
              <div className="text-sm text-muted-foreground">
                Current Page Responses
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border border-border rounded-xl overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-xs uppercase tracking-widest text-muted-foreground/60 font-mono">
                <th className="px-6 py-4 font-normal text-left">Question</th>
                <th className="px-6 py-4 font-normal text-left">Answer</th>
                <th className="px-6 py-4 font-normal text-left">Score</th>
                <th className="px-6 py-4 font-normal text-left">Session</th>
                <th className="px-6 py-4 font-normal text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {responses?.map((response: any) => (
                <tr
                  key={response.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center mt-1">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium text-sm">
                          {truncateText(
                            response.question?.questionText || 'Unknown',
                            60
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {response.question?.category?.name || 'Uncategorized'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-muted-foreground max-w-xs">
                      {truncateText(response.answer || '', 80)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreBadge(
                        response.score || 0
                      )}`}
                    >
                      {response.score || 0}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-3 h-3 text-muted-foreground" />
                      <span>
                        {response.session?.user?.fullName || 'Unknown'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(response.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(!responses || responses.length === 0) && (
          <div className="p-8 text-center text-muted-foreground">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No responses found</p>
          </div>
        )}

        <div className="border-t border-border px-6 py-4 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Showing {responses?.length || 0} responses
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={estimatedTotalPages}
        pageSize={pageSize}
        totalItems={skip + totalItems}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
