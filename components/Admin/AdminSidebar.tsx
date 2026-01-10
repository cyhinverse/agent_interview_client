'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  BarChart,
  Settings,
  ChevronRight,
  Shield,
  MessageSquare,
  Award,
} from 'lucide-react';

const navItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    description: 'System overview and analytics',
  },
  {
    title: 'User Management',
    href: '/admin/users',
    icon: Users,
    description: 'Manage users and roles',
  },
  {
    title: 'Session Management',
    href: '/admin/sessions',
    icon: Calendar,
    description: 'View and manage interview sessions',
  },
  {
    title: 'Question Bank',
    href: '/admin/questions',
    icon: FileText,
    description: 'Manage interview questions',
  },
  {
    title: 'Evaluation Reports',
    href: '/admin/reports',
    icon: BarChart,
    description: 'Review assessment results',
  },
  {
    title: 'Responses',
    href: '/admin/responses',
    icon: MessageSquare,
    description: 'View user answers and feedback',
  },
  {
    title: 'Categories',
    href: '/admin/categories',
    icon: Award,
    description: 'Manage interview categories',
  },
  {
    title: 'System Settings',
    href: '/admin/settings',
    icon: Settings,
    description: 'Configure system parameters',
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`h-full border-r border-border bg-card transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Admin Panel</h2>
                <p className="text-xs text-muted-foreground">
                  System Management
                </p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
              <Shield className="w-5 h-5 text-primary" />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ChevronRight
              className={`w-4 h-4 transition-transform ${
                collapsed ? 'rotate-0' : 'rotate-180'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname === item.href || pathname?.startsWith(`${item.href}/`);

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <div
                  className={`flex-shrink-0 ${
                    isActive
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                </div>

                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{item.title}</div>
                    <div
                      className={`text-xs truncate ${
                        isActive
                          ? 'text-primary-foreground/70'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                )}

                {isActive && !collapsed && (
                  <motion.div
                    layoutId="active-nav"
                    className="w-1 h-6 bg-primary-foreground/30 rounded-full"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* System Status */}
      {!collapsed && (
        <div className="p-4 border-t border-border mt-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                System Status
              </span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-500">
                  Online
                </span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Last updated: Just now
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
