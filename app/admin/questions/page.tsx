'use client';

import { useState } from 'react';
import { FileText, Plus, RefreshCw, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuestionManagementTable } from '@/components/Admin/QuestionManagementTable';
import { QuestionModal } from '@/components/Admin/QuestionModal';
import { Pagination } from '@/components/ui/Pagination';
import { useAdminQuestions } from '@/hooks/useAdmin';
import { QuestionBank } from '@/features/questions/questionsApi';
import { Loader2 } from 'lucide-react';

export default function QuestionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionBank | null>(
    null
  );

  const skip = (currentPage - 1) * pageSize;
  const {
    data: questions,
    isLoading,
    refetch,
  } = useAdminQuestions(skip, pageSize);

  const handleAddQuestion = () => {
    setSelectedQuestion(null);
    setIsModalOpen(true);
  };

  const handleEditQuestion = (question: QuestionBank) => {
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    refetch();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Estimate total pages based on current data
  const totalItems = questions?.length || 0;
  const hasMore = totalItems === pageSize;
  const estimatedTotalPages = hasMore ? currentPage + 1 : currentPage;

  if (isLoading && !questions) {
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
          <h1 className="text-3xl font-bold tracking-tight">Question Bank</h1>
          <p className="text-muted-foreground mt-2">
            Manage interview questions across all categories
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
          <Button size="sm" onClick={handleAddQuestion}>
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{totalItems}</div>
              <div className="text-sm text-muted-foreground">
                Current Page Questions
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <QuestionManagementTable
        questions={questions || []}
        isLoading={isLoading}
        onRefresh={refetch}
        onEdit={handleEditQuestion}
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

      {/* Modal */}
      <QuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        question={selectedQuestion}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
