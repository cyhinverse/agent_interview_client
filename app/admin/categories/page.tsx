'use client';

import { useState } from 'react';
import { Award, Plus, RefreshCw, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryManagementTable } from '@/components/Admin/CategoryManagementTable';
import { CategoryModal } from '@/components/Admin/CategoryModal';
import { useAdminCategories } from '@/hooks/useAdmin';
import { InterviewCategory } from '@/features/interview/interviewApi';
import { Loader2 } from 'lucide-react';

export default function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<InterviewCategory | null>(null);

  const { data: categories, isLoading, refetch } = useAdminCategories();

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: InterviewCategory) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    refetch();
  };

  if (isLoading && !categories) {
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
            Interview Categories
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage interview types and AI prompts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" onClick={handleAddCategory}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {categories?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Categories
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <CategoryManagementTable
        categories={categories || []}
        isLoading={isLoading}
        onRefresh={refetch}
        onEdit={handleEditCategory}
      />

      {/* Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
