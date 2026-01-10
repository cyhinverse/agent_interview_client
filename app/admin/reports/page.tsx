'use client';

import { useState } from 'react';
import { BarChart, RefreshCw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReportManagementTable } from '@/components/Admin/ReportManagementTable';
import { ReportDetailModal } from '@/components/Admin/ReportDetailModal';
import { Pagination } from '@/components/ui/Pagination';
import { useAdminReports } from '@/hooks/useAdmin';
import { EvaluationReport } from '@/features/users/usersApi';
import { Loader2 } from 'lucide-react';

export default function ReportsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<EvaluationReport | null>(
    null
  );

  const skip = (currentPage - 1) * pageSize;
  const { data: reports, isLoading, refetch } = useAdminReports(skip, pageSize);

  const handleViewReport = (report: EvaluationReport) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const totalItems = reports?.length || 0;
  const hasMore = totalItems === pageSize;
  const estimatedTotalPages = hasMore ? currentPage + 1 : currentPage;

  if (isLoading && !reports) {
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
            Evaluation Reports
          </h1>
          <p className="text-muted-foreground mt-2">
            Review and analyze candidate assessments
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <BarChart className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{totalItems}</div>
              <div className="text-sm text-muted-foreground">
                Current Page Reports
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <ReportManagementTable
        reports={reports || []}
        isLoading={isLoading}
        onRefresh={refetch}
        onView={handleViewReport}
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

      {/* Report Detail Modal */}
      <ReportDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        report={selectedReport}
      />
    </div>
  );
}
