'use client';

import { useState } from 'react';
import { Calendar, RefreshCw, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SessionManagementTable } from '@/components/Admin/SessionManagementTable';
import { SessionDetailModal } from '@/components/Admin/SessionDetailModal';
import { Pagination } from '@/components/ui/Pagination';
import { useAdminSessions } from '@/hooks/useAdmin';
import { InterviewSession } from '@/features/interview/interviewApi';
import { Loader2 } from 'lucide-react';

export default function SessionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] =
    useState<InterviewSession | null>(null);

  const skip = (currentPage - 1) * pageSize;
  const {
    data: sessions,
    isLoading,
    refetch,
  } = useAdminSessions(skip, pageSize);

  const handleViewSession = (session: InterviewSession) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const totalItems = sessions?.length || 0;
  const hasMore = totalItems === pageSize;
  const estimatedTotalPages = hasMore ? currentPage + 1 : currentPage;

  if (isLoading && !sessions) {
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
            Interview Sessions
          </h1>
          <p className="text-muted-foreground mt-2">
            View and manage all interview sessions
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{totalItems}</div>
              <div className="text-sm text-muted-foreground">
                Current Page Sessions
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <SessionManagementTable
        sessions={sessions || []}
        isLoading={isLoading}
        onRefresh={refetch}
        onView={handleViewSession}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={estimatedTotalPages}
        pageSize={pageSize}
        totalItems={skip + totalItems}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* Session Detail Modal */}
      <SessionDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        session={selectedSession}
      />
    </div>
  );
}
