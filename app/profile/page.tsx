'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Settings,
  Shield,
  Trophy,
  Activity as ActivityIcon,
  Terminal,
  ChevronRight,
  Flame,
  Award,
  Loader2,
  LogOut,
} from 'lucide-react';
import { useCurrentUser, useUserStats, useUserReports } from '@/hooks/useUsers';
import { useLogout } from '@/hooks/useAuth';
import { useInterviewSessions } from '@/hooks/useInterviewCategories';
import { toast } from 'sonner';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { mutate: logout } = useLogout();

  // Fetch user data using React Query
  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
    refetch: refetchUser,
  } = useCurrentUser();

  // Fetch user stats using React Query
  const {
    data: stats,
    isLoading: isLoadingStats,
    error: statsError,
  } = useUserStats();

  // Fetch user reports using React Query
  const {
    data: reports,
    isLoading: isLoadingReports,
    error: reportsError,
  } = useUserReports(0, 3);

  // Fetch recent interview sessions using React Query
  const {
    data: sessions,
    isLoading: isLoadingSessions,
    error: sessionsError,
  } = useInterviewSessions(0, 5);

  const isLoading =
    isLoadingUser || isLoadingStats || isLoadingReports || isLoadingSessions;
  const error = userError || statsError || reportsError || sessionsError;

  const userStats = [
    {
      label: 'Rank',
      value: `Global #${stats?.totalSessions || 1}`,
      icon: Trophy,
      color: 'text-yellow-500',
    },
    {
      label: 'Points',
      value: stats ? Math.floor(stats.averageScore * 10).toString() : '0',
      icon: Flame,
      color: 'text-orange-500',
    },
    {
      label: 'Success Rate',
      value:
        stats && stats.totalSessions > 0
          ? `${Math.round(
              (stats.completedSessions / stats.totalSessions) * 100
            )}%`
          : '0%',
      icon: ActivityIcon,
      color: 'text-emerald-500',
    },
  ];

  const getLevel = (score: number) => {
    if (score >= 90) return 'Expert';
    if (score >= 70) return 'Advanced';
    if (score >= 50) return 'Intermediate';
    return 'Beginner';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-6rem)] py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-[calc(100vh-6rem)] py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <p className="text-destructive mb-4">
              Failed to load profile data. Please try again later.
            </p>
            <button
              onClick={() => {
                refetchUser();
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Profile Header Card */}
        <div className="bg-card border border-border rounded-2xl p-10 shadow-sm relative overflow-hidden">
          {/* Subtle background element */}
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] select-none">
            <User size={240} />
          </div>

          <div className="relative flex flex-col md:flex-row items-center gap-10">
            {/* Avatar Section */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-muted border-2 border-border flex items-center justify-center overflow-hidden">
                <User className="w-16 h-16 text-muted-foreground/50" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-2 rounded-lg shadow-lg border border-primary/20">
                <Shield className="w-4 h-4" />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">
                  {user?.fullName || 'Anonymous User'}
                </h1>
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Protocol Level {getLevel(stats?.averageScore || 0)}
                </p>
              </div>
              <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                {user?.email || 'No email provided'}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <span className="px-3 py-1 rounded bg-muted border border-border text-[10px] font-bold uppercase tracking-tighter">
                  JavaScript
                </span>
                <span className="px-3 py-1 rounded bg-muted border border-border text-[10px] font-bold uppercase tracking-tighter">
                  Python
                </span>
                <span className="px-3 py-1 rounded bg-muted border border-border text-[10px] font-bold uppercase tracking-tighter">
                  TypeScript
                </span>
              </div>
            </div>

            {/* Action Group */}
            <div className="flex flex-col gap-3 min-w-[160px]">
              <button className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold transition-all hover:opacity-90 shadow-sm">
                Edit Bio
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-muted text-foreground border border-border rounded-xl text-xs font-bold transition-all hover:bg-muted/80">
                <Settings className="w-3.5 h-3.5" />
                Settings
              </button>
              <button
                onClick={() => logout()}
                className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl text-xs font-bold transition-all hover:bg-destructive/20"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {userStats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border p-6 rounded-2xl shadow-sm flex items-center gap-6"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </div>
                <div className="text-xl font-bold tracking-tight">
                  {stat.value}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tab System */}
        <div className="flex border-b border-border gap-8 overflow-x-auto">
          {['Overview', 'History', 'Achievements', 'Security'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${
                activeTab === tab.toLowerCase()
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
              {activeTab === tab.toLowerCase() && (
                <motion.div
                  layoutId="tab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                  <ActivityIcon className="w-4 h-4 text-primary" />
                  Recent Activity
                </h3>

                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                  <div className="divide-y divide-border">
                    {sessions?.slice(0, 3).map((session, i) => (
                      <div
                        key={session.id}
                        className="group p-5 flex items-center justify-between hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            <Terminal className="w-4 h-4 text-muted-foreground/60" />
                          </div>
                          <div className="space-y-0.5">
                            <div className="text-sm font-semibold group-hover:text-primary transition-colors">
                              {session.category?.name || 'Interview Session'}
                            </div>
                            <div className="text-[10px] text-muted-foreground uppercase font-mono tracking-tighter">
                              {session.status} • {formatDate(session.createdAt)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-mono font-bold text-emerald-500">
                            {session.score
                              ? `Score: ${session.score}`
                              : 'In Progress'}
                          </span>
                          <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-muted/50 transition-colors border-t border-border">
                    View Full Logs
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest">
                  Detailed History
                </h3>
                <div className="p-10 border border-dashed border-border rounded-2xl text-center text-muted-foreground text-xs italic">
                  {reports && reports.length > 0
                    ? `${reports.length} evaluation reports available`
                    : 'No evaluation reports yet'}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar / Achievements */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              Recent Awards
            </h3>

            <div className="space-y-4">
              {reports?.slice(0, 2).map((report, i) => (
                <div
                  key={report.id}
                  className="p-5 bg-card border border-border rounded-2xl space-y-3 shadow-sm hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold tracking-tight">
                      {report.overallScore >= 90
                        ? 'Expert Performance'
                        : report.overallScore >= 70
                        ? 'Strong Performance'
                        : 'Good Effort'}
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground">
                      {formatDate(report.createdAt)}
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {report.feedback?.substring(0, 100) ||
                      'No feedback provided'}
                    ...
                  </p>
                </div>
              ))}
              <button className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-muted text-foreground border border-border rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-muted/80">
                View All Reports
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">
              Some data failed to load. Showing cached results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
