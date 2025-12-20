'use client';

import { useState, Activity as ReactActivity, ViewTransition } from 'react';
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
} from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');

  const userStats = [
    {
      label: 'Rank',
      value: 'Global #1,204',
      icon: Trophy,
      color: 'text-yellow-500',
    },
    { label: 'Points', value: '4,850', icon: Flame, color: 'text-orange-500' },
    {
      label: 'Success Rate',
      value: '94.2%',
      icon: ActivityIcon,
      color: 'text-emerald-500',
    },
  ];

  const recentActivity = [
    {
      title: 'Distributed Consensus Loop',
      status: 'Solved',
      points: '+400',
      date: '2h ago',
    },
    {
      title: 'Nexus-01 Architecture',
      status: 'Verified',
      points: '+150',
      date: '5h ago',
    },
    {
      title: 'Knapsack Token Optimizer',
      status: 'Solved',
      points: '+450',
      date: '1d ago',
    },
  ];

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
                  Cypher_Engineer
                </h1>
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Protocol Level 07
                </p>
              </div>
              <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                Specializing in agentic orchestration and secure distributed
                systems. Solving high-latency consensus problems since cycle 0.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <span className="px-3 py-1 rounded bg-muted border border-border text-[10px] font-bold uppercase tracking-tighter">
                  Python
                </span>
                <span className="px-3 py-1 rounded bg-muted border border-border text-[10px] font-bold uppercase tracking-tighter">
                  TypeScript
                </span>
                <span className="px-3 py-1 rounded bg-muted border border-border text-[10px] font-bold uppercase tracking-tighter">
                  Neural Logic
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
            <ViewTransition>
              <ReactActivity
                mode={activeTab === 'overview' ? 'visible' : 'hidden'}
              >
                <div className="space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                    <ActivityIcon className="w-4 h-4 text-primary" />
                    Protocol History
                  </h3>

                  <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                    <div className="divide-y divide-border">
                      {recentActivity.map((item, i) => (
                        <div
                          key={i}
                          className="group p-5 flex items-center justify-between hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                              <Terminal className="w-4 h-4 text-muted-foreground/60" />
                            </div>
                            <div className="space-y-0.5">
                              <div className="text-sm font-semibold group-hover:text-primary transition-colors">
                                {item.title}
                              </div>
                              <div className="text-[10px] text-muted-foreground uppercase font-mono tracking-tighter">
                                {item.status} • {item.date}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-xs font-mono font-bold text-emerald-500">
                              {item.points}
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
              </ReactActivity>

              <ReactActivity
                mode={activeTab === 'history' ? 'visible' : 'hidden'}
              >
                <div className="space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest">
                    Detailed History
                  </h3>
                  <div className="p-10 border border-dashed border-border rounded-2xl text-center text-muted-foreground text-xs italic">
                    Retrieving archive logs...
                  </div>
                </div>
              </ReactActivity>
            </ViewTransition>
          </div>

          {/* Sidebar / Achievements */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              Recent Awards
            </h3>

            <div className="space-y-4">
              {[
                {
                  title: 'Early Adopter',
                  date: 'Dec 2025',
                  desc: 'Protocol participant since genesis.',
                },
                {
                  title: 'Consensus Expert',
                  date: 'Nov 2025',
                  desc: 'Solved 5 high-latency problems.',
                },
              ].map((award, i) => (
                <div
                  key={i}
                  className="p-5 bg-card border border-border rounded-2xl space-y-3 shadow-sm hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold tracking-tight">
                      {award.title}
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground">
                      {award.date}
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {award.desc}
                  </p>
                </div>
              ))}
              <button className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-muted text-foreground border border-border rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-muted/80">
                View Gallery
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
