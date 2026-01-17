'use client';

import { useState } from 'react';
import { FileText, Plus, RefreshCw, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocumentManagementTable } from '@/components/Admin/DocumentManagementTable';
import { DocumentModal } from '@/components/Admin/DocumentModal';
import { Pagination } from '@/components/ui/pagination';
import { useAdminDocuments } from '@/hooks/useAdmin';
import { KnowledgeDocument } from '@/features/admin/adminApi';
import { Loader2 } from 'lucide-react';

export default function DocumentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] =
    useState<KnowledgeDocument | null>(null);

  const skip = (currentPage - 1) * pageSize;
  const {
    data: documents,
    isLoading,
    refetch,
  } = useAdminDocuments(skip, pageSize);

  const handleAddDocument = () => {
    setSelectedDocument(null);
    setIsModalOpen(true);
  };

  const handleEditDocument = (document: KnowledgeDocument) => {
    setSelectedDocument(document);
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
  const totalItems = documents?.length || 0;
  const hasMore = totalItems === pageSize;
  const estimatedTotalPages = hasMore ? currentPage + 1 : currentPage;

  if (isLoading && !documents) {
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
            Knowledge Documents
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage RAG documents for AI-powered interview questions
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
          <Button size="sm" onClick={handleAddDocument}>
            <Plus className="w-4 h-4 mr-2" />
            Add Document
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
                Current Page Documents
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <DocumentManagementTable
        documents={documents || []}
        isLoading={isLoading}
        onRefresh={refetch}
        onEdit={handleEditDocument}
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
      <DocumentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        document={selectedDocument}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
