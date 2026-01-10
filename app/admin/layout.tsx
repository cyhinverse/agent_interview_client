'use client';

import { AdminSidebar } from '@/components/Admin/AdminSidebar';
import { useCurrentUser } from '@/hooks/useUsers';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, isLoading, error } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShieldAlert className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            You need to be logged in as an admin to access this page.
          </p>
        </div>
      </div>
    );
  }

  if (user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShieldAlert className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Insufficient Permissions</h2>
          <p className="text-muted-foreground">
            You do not have admin privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-background overflow-hidden flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto p-6 scroll-smooth">
        <div className="max-w-7xl mx-auto pb-10">{children}</div>
      </main>
    </div>
  );
}
