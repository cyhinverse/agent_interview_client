'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  RefreshCw,
  Download,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardStats } from '@/components/Admin/DashboardStats';
import { UserManagementTable } from '@/components/Admin/UserManagementTable';
import { SessionManagementTable } from '@/components/Admin/SessionManagementTable';
import {
  useAdminDashboard,
  useAdminUsers,
  useAdminSessions,
} from '@/hooks/useAdmin';
import { Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');

  // Fetch dashboard data using React Query
  const {
    data: dashboardData,
    isLoading: isLoadingDashboard,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useAdminDashboard();

  // Fetch users data using React Query
  const {
    data: users,
    isLoading: isLoadingUsers,
    refetch: refetchUsers,
  } = useAdminUsers(0, 10);

  // Fetch sessions data using React Query
  const {
    data: sessions,
    isLoading: isLoadingSessions,
    refetch: refetchSessions,
  } = useAdminSessions(0, 10);

  const handleRefreshAll = () => {
    refetchDashboard();
    refetchUsers();
    refetchSessions();
  };

  if (isLoadingDashboard) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="text-center py-12">
        <div className="text-destructive mb-4">
          Failed to load dashboard data
        </div>
        <Button onClick={() => refetchDashboard()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Monitor system performance and manage resources
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleRefreshAll}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh All
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-xl w-fit">
        {['24h', '7d', '30d', '90d'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeRange === range
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Stats Overview */}
      {dashboardData?.stats && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">System Overview</h2>
            <div className="text-sm text-muted-foreground">
              Last updated: Just now
            </div>
          </div>
          <DashboardStats stats={dashboardData.stats} />
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'sessions', label: 'Sessions', icon: Calendar },
            { id: 'questions', label: 'Questions', icon: FileText },
            { id: 'reports', label: 'Reports', icon: TrendingUp },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-4 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="admin-tab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Users */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Recent Users</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => refetchUsers()}
                >
                  View All
                </Button>
              </div>
              <UserManagementTable
                users={users || []}
                isLoading={isLoadingUsers}
                onRefresh={refetchUsers}
              />
            </div>

            {/* Recent Sessions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Recent Sessions</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => refetchSessions()}
                >
                  View All
                </Button>
              </div>
              <SessionManagementTable
                sessions={sessions || []}
                isLoading={isLoadingSessions}
                onRefresh={refetchSessions}
              />
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">User Management</h3>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  Filter Users
                </Button>
                <Button size="sm">Add New User</Button>
              </div>
            </div>
            <UserManagementTable
              users={users || []}
              isLoading={isLoadingUsers}
              onRefresh={refetchUsers}
            />
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Session Management</h3>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  Filter Sessions
                </Button>
                <Button size="sm">View Analytics</Button>
              </div>
            </div>
            <SessionManagementTable
              sessions={sessions || []}
              isLoading={isLoadingSessions}
              onRefresh={refetchSessions}
            />
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Question Management</h3>
            <p className="text-muted-foreground mb-6">
              Manage interview questions and categories
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={() => (window.location.href = '/admin/questions')}
              >
                Go to Question Bank
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = '/admin/categories')}
              >
                Manage Categories
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Evaluation Reports</h3>
            <p className="text-muted-foreground mb-6">
              View and analyze assessment results
            </p>
            <Button onClick={() => (window.location.href = '/admin/reports')}>
              View Reports
            </Button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="border-t border-border pt-8">
        <h3 className="text-lg font-bold mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="justify-start h-auto py-4">
            <MessageSquare className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Send Announcement</div>
              <div className="text-xs text-muted-foreground">
                Notify all users
              </div>
            </div>
          </Button>
          <Button variant="outline" className="justify-start h-auto py-4">
            <Users className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Add Interviewer</div>
              <div className="text-xs text-muted-foreground">
                Assign new staff
              </div>
            </div>
          </Button>
          <Button variant="outline" className="justify-start h-auto py-4">
            <FileText className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Generate Report</div>
              <div className="text-xs text-muted-foreground">
                Export system data
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
