'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Loader2,
  Sparkles,
  Clock,
  Circle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { interviewCategoriesAPI } from '@/features/interview/interviewApi';
import { useInterviewSession } from '@/hooks';
import { toast } from 'sonner';
import Link from 'next/link';

export default function InterviewSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const {
    data: session,
    isLoading: loading,
    error,
    refetch,
  } = useInterviewSession(sessionId);

  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const handleEndInterview = async () => {
    try {
      await interviewCategoriesAPI.updateSession(sessionId, {
        status: 'COMPLETED',
      });
      toast.success('Interview completed successfully!');
      router.push('/interview');
    } catch (err) {
      console.error('Failed to end interview:', err);
      toast.error('Failed to end interview');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">
            Connecting to interview...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-[calc(100vh-6rem)] py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/interview"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Interviews
          </Link>

          <Card className="border-destructive/20">
            <CardContent className="py-16 text-center">
              <p className="text-destructive mb-4">
                {error
                  ? 'Failed to load interview session.'
                  : 'Session not found'}
              </p>
              <Button onClick={() => refetch()} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <Link
            href="/interview"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Interviews
          </Link>

          <div className="flex items-center gap-4">
            {/* Recording Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-destructive/10 rounded-full">
              <Circle className="w-2 h-2 fill-destructive text-destructive animate-pulse" />
              <span className="text-xs font-medium text-destructive">REC</span>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-mono font-medium">
                {formatTime(elapsedTime)}
              </span>
            </div>

            {/* Status Badge */}
            <div className="px-3 py-1.5 bg-primary/10 text-primary rounded-full">
              <span className="text-xs font-bold uppercase tracking-widest">
                {session.status === 'IN_PROGRESS' ? 'Live' : session.status}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Main Video Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Interviewer - Large */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="overflow-hidden border-border hover:border-primary/30 transition-colors">
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 relative">
                  {/* AI Avatar */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                      className="relative"
                    >
                      {/* Animated Ring */}
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.5, 0.2, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        className="absolute inset-0 rounded-full bg-primary/20"
                      />
                      <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 shadow-lg">
                        <Sparkles className="w-12 h-12 text-primary" />
                      </div>
                    </motion.div>

                    <div className="mt-6 text-center">
                      <h2 className="text-xl font-bold tracking-tight">
                        AI Interviewer
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Listening to your responses...
                      </p>
                    </div>
                  </div>

                  {/* Session ID Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="px-3 py-1.5 bg-background/80 backdrop-blur-sm rounded-lg border border-border">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                        Session
                      </p>
                      <p className="text-xs font-mono font-medium">
                        {sessionId.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* User Video - Small */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="overflow-hidden border-border hover:border-primary/30 transition-colors h-full">
              <CardContent className="p-0 h-full">
                <div className="aspect-video lg:aspect-auto lg:h-full bg-gradient-to-br from-secondary to-secondary/50 relative min-h-[200px]">
                  <AnimatePresence mode="wait">
                    {isVideoOn ? (
                      <motion.div
                        key="video-on"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center"
                      >
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center border border-border">
                          <Video className="w-7 h-7 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">
                          Camera Preview
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="video-off"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-secondary"
                      >
                        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center border border-border">
                          <VideoOff className="w-7 h-7 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">
                          Camera Off
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* You Badge */}
                  <div className="absolute bottom-4 left-4">
                    <div className="px-2.5 py-1 bg-background/80 backdrop-blur-sm rounded-md border border-border">
                      <span className="text-xs font-medium">You</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Call Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border">
            <CardContent className="py-6 px-8">
              <div className="flex items-center justify-center gap-4">
                {/* Mic Toggle */}
                <Button
                  variant={isMicOn ? 'secondary' : 'destructive'}
                  size="lg"
                  onClick={() => setIsMicOn(!isMicOn)}
                  className="rounded-full w-14 h-14 shadow-sm hover:shadow-md transition-all"
                >
                  {isMicOn ? (
                    <Mic className="w-5 h-5" />
                  ) : (
                    <MicOff className="w-5 h-5" />
                  )}
                </Button>

                {/* Video Toggle */}
                <Button
                  variant={isVideoOn ? 'secondary' : 'destructive'}
                  size="lg"
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className="rounded-full w-14 h-14 shadow-sm hover:shadow-md transition-all"
                >
                  {isVideoOn ? (
                    <Video className="w-5 h-5" />
                  ) : (
                    <VideoOff className="w-5 h-5" />
                  )}
                </Button>

                {/* Separator */}
                <div className="w-px h-10 bg-border mx-2" />

                {/* End Call */}
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={handleEndInterview}
                  className="rounded-full px-8 h-14 shadow-sm hover:shadow-md transition-all font-bold uppercase tracking-widest text-xs"
                >
                  <PhoneOff className="w-5 h-5 mr-2" />
                  End Interview
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
