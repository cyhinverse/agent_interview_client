'use client';

import { motion } from 'framer-motion';
import {
  Users,
  Calendar,
  FileText,
  MessageSquare,
  TrendingUp,
  Award,
} from 'lucide-react';
import { SystemStats } from '@/features/admin/adminApi';

interface DashboardStatsProps {
  stats: SystemStats;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: 'Total Users',
      value: (stats?.totalUsers ?? 0).toLocaleString(),
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      change: '+12%',
      trend: 'up',
    },
    {
      title: 'Total Sessions',
      value: (stats?.totalSessions ?? 0).toLocaleString(),
      icon: Calendar,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      change: '+8%',
      trend: 'up',
    },
    {
      title: 'Total Documents',
      value: (stats?.totalDocuments ?? 0).toLocaleString(),
      icon: FileText,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      change: '+15%',
      trend: 'up',
    },
    {
      title: 'Total Responses',
      value: (stats?.totalResponses ?? 0).toLocaleString(),
      icon: MessageSquare,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      change: '+22%',
      trend: 'up',
    },
    {
      title: 'Active Users',
      value: (stats?.activeUsers ?? 0).toLocaleString(),
      icon: TrendingUp,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      change: '+5%',
      trend: 'up',
    },
    {
      title: 'Avg Session Score',
      value: `${(stats?.averageSessionScore ?? 0).toFixed(1)}%`,
      icon: Award,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      change: '+3%',
      trend: 'up',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div
              className={`text-xs font-bold px-2 py-1 rounded-full ${
                stat.trend === 'up'
                  ? 'bg-green-500/20 text-green-500'
                  : 'bg-red-500/20 text-red-500'
              }`}
            >
              {stat.change}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-2xl font-bold tracking-tight">
              {stat.value}
            </div>
            <div className="text-sm text-muted-foreground">{stat.title}</div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground">
              Updated just now
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
