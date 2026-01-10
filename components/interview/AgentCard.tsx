'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Cpu, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { interviewCategoriesAPI } from '@/features/interview/interviewApi';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Agent {
  id: string;
  name: string;
  type: string;
  desc: string;
  complexity: string;
}

interface AgentCardProps {
  agent: Agent;
  index: number;
}

export function AgentCard({ agent, index }: AgentCardProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const Icon = index === 0 ? Cpu : index === 1 ? Shield : Zap;

  const handleStartInterview = async () => {
    try {
      setLoading(true);
      const session = await interviewCategoriesAPI.createInterviewSession({
        categoryId: agent.id,
      });

      toast.success('Interview session created successfully!');

      // 重定向到面试会话页面
      router.push(`/interview/session/${session.id}`);
    } catch (error) {
      console.error('Failed to start interview:', error);
      toast.error('Failed to start interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative h-full"
    >
      <Card className="aspect-square border-border hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden">
        <CardContent className="p-8 h-full flex flex-col items-center text-center justify-between">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors border border-border/50 shadow-inner">
            <Icon className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <div>
              <h3 className="text-base font-bold tracking-tight">
                {agent.name}
              </h3>
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">
                {agent.type}
              </p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 px-2">
              {agent.desc}
            </p>
          </div>

          <div className="w-full space-y-4">
            <div className="flex items-center justify-center gap-2">
              <span className="text-[10px] font-mono text-muted-foreground uppercase">
                Complexity:
              </span>
              <span className="text-[10px] font-bold text-foreground">
                {agent.complexity}
              </span>
            </div>
            <Button
              onClick={handleStartInterview}
              disabled={loading}
              className="w-full font-bold uppercase tracking-widest text-[10px] py-6 rounded-xl shadow-sm hover:translate-y-[-2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Start Mission'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
