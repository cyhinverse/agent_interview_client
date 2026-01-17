'use client';

import { useState } from 'react';
import { Users, RefreshCw, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserManagementTable } from '@/components/Admin/UserManagementTable';
import { UserRoleModal } from '@/components/Admin/UserRoleModal';
import { Pagination } from '@/components/ui/pagination';
import { useAdminUsers } from '@/hooks/useAdmin';
import { User } from '@/features/users/usersApi';
import { Loader2 } from 'lucide-react';

export default function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const skip = (currentPage - 1) * pageSize;
  const { data: users, isLoading, refetch } = useAdminUsers(skip, pageSize);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
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

  const totalItems = users?.length || 0;
  const hasMore = totalItems === pageSize;
  const estimatedTotalPages = hasMore ? currentPage + 1 : currentPage;

  if (isLoading && !users) {
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
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage user accounts and permissions
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
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{totalItems}</div>
              <div className="text-sm text-muted-foreground">
                Current Page Users
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <UserManagementTable
        users={users || []}
        isLoading={isLoading}
        onRefresh={refetch}
        onEdit={handleEditUser}
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

      {/* User Role Modal */}
      <UserRoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
